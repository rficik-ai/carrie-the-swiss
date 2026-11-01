// Cloudflare Worker: serves the static site and the "Ask Carrie" chat endpoint.
// The Anthropic API key lives only in the Worker secret ANTHROPIC_API_KEY (never in the code or the browser).
import { systemPrompt } from './knowledge.js';

const MODEL = 'claude-haiku-5-5';
const LANGS = new Set(['en', 'sk', 'cs', 'de', 'pl', 'fr', 'it', 'es', 'uk', 'hu', 'nl']);
const MAX_TURNS = 12;        // messages of history sent to the model
const MAX_CHARS = 600;       // per visitor message

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

async function chat(request, env) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  const origin = request.headers.get('origin') || '';
  const host = new URL(request.url).host;
  if (origin && new URL(origin).host !== host) return json({ error: 'origin' }, 403);
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503);

  // per-visitor rate limit (Workers Rate Limiting binding)
  if (env.CHAT_LIMIT) {
    const ip = request.headers.get('cf-connecting-ip') || 'anon';
    const { success } = await env.CHAT_LIMIT.limit({ key: ip });
    if (!success) return json({ error: 'rate' }, 429);
  }

  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }
  const lang = LANGS.has(body?.lang) ? body.lang : 'en';
  const msgs = Array.isArray(body?.messages) ? body.messages : [];
  const clean = msgs
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, m.role === 'user' ? MAX_CHARS : 2000) }));
  while (clean.length && clean[0].role !== 'user') clean.shift();
  if (!clean.length || clean[clean.length - 1].role !== 'user') return json({ error: 'empty' }, 400);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 700, thinking: { type: 'disabled' }, system: systemPrompt(lang), messages: clean }),
  });
  if (!res.ok) {
    console.log('anthropic error', res.status, (await res.text()).slice(0, 300));
    return json({ error: 'upstream' }, 502);
  }
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
  if (!text) {
    console.log('empty reply', data.stop_reason, JSON.stringify((data.content || []).map((c) => c.type)), JSON.stringify(data).slice(0, 400));
    return json({ error: 'empty_reply' }, 502);
  }
  return json({ reply: text });
}

// ---- latest YouTube videos (public RSS, no key), cached for an hour at the edge
const CHANNEL = 'UCDXuilIy2fdJZ6wRTh1yDgA';
const unescape = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function cached(request, ctx, ttl, make) {
  const cache = caches.default;
  const key = new Request(new URL(request.url).toString(), { method: 'GET' });
  const hit = await cache.match(key);
  if (hit) return hit;
  const res = await make();
  if (res.ok) {
    const r = new Response(res.body, res);
    r.headers.set('cache-control', `public, max-age=${ttl}`);
    ctx.waitUntil(cache.put(key, r.clone()));
    return r;
  }
  return res;
}

async function latest(request, ctx) {
  return cached(request, ctx, 3600, async () => {
    const r = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL}`, { cf: { cacheTtl: 1800 } });
    if (!r.ok) return json({ error: 'feed' }, 502);
    const xml = await r.text();
    const items = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 12).map((m) => {
      const e = m[1];
      const pick = (re) => (e.match(re) || [])[1] || '';
      return { id: pick(/<yt:videoId>([^<]+)<\/yt:videoId>/), title: unescape(pick(/<title>([^<]*)<\/title>/)), published: pick(/<published>([^<]+)<\/published>/) };
    }).filter((v) => /^[\w-]{11}$/.test(v.id));
    return new Response(JSON.stringify({ items }), { headers: { 'content-type': 'application/json; charset=utf-8' } });
  });
}

// thumbnails are proxied so visitors' browsers never contact Google (no third-party requests)
async function thumb(request, ctx, id) {
  if (!/^[\w-]{11}$/.test(id)) return new Response('bad id', { status: 400 });
  return cached(request, ctx, 86400, async () => {
    for (const q of ['oardefault', 'hq720', 'hqdefault']) {
      const r = await fetch(`https://i.ytimg.com/vi/${id}/${q}.jpg`);
      if (r.ok) return new Response(r.body, { headers: { 'content-type': 'image/jpeg' } });
    }
    return new Response('not found', { status: 404 });
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/ask') return chat(request, env);
    if (url.pathname === '/api/latest') return latest(request, ctx);
    const t = url.pathname.match(/^\/api\/thumb\/([\w-]+)\.jpg$/);
    if (t) return thumb(request, ctx, t[1]);
    return env.ASSETS.fetch(request);
  },
};
