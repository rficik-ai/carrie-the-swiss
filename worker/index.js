// Cloudflare Worker: serves the static site and the "Ask Carrie" chat endpoint.
// The Anthropic API key lives only in the Worker secret ANTHROPIC_API_KEY (never in the code or the browser).
import { systemPrompt } from './knowledge.js';
import { event, stats } from './stats.js';
export { Stats } from './stats.js';   // the Durable Object that tallies the anonymous events

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

// ---- "Is a Swissy right for you?": Carrie's detailed evaluation of the visitor's quiz answers
const LANG_NAMES = { en: 'English', sk: 'Slovak', cs: 'Czech', de: 'German', pl: 'Polish', fr: 'French', it: 'Italian', es: 'Spanish', uk: 'Ukrainian', hu: 'Hungarian', nl: 'Dutch' };
const HEADS = {
  sk: ['Prečo áno', 'Prečo nie', 'Čo by som zmenila'], en: ['Why yes', 'Why not', 'What I would change'],
};
async function quiz(request, env) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  const origin = request.headers.get('origin') || '';
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'origin' }, 403);
  if (!env.ANTHROPIC_API_KEY) return json({ error: 'not_configured' }, 503);
  if (env.CHAT_LIMIT) {
    const { success } = await env.CHAT_LIMIT.limit({ key: 'quiz:' + (request.headers.get('cf-connecting-ip') || 'anon') });
    if (!success) return json({ error: 'rate' }, 429);
  }
  let b; try { b = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }
  const lang = LANGS.has(b?.lang) ? b.lang : 'en';
  const str = (x, n) => String(x ?? '').slice(0, n);
  const answers = (Array.isArray(b?.answers) ? b.answers : []).slice(0, 12).map((a) => `- ${str(a?.q, 200)} → ${str(a?.a, 160)}`).join('\n');
  const scores = Object.entries(b?.scores && typeof b.scores === 'object' ? b.scores : {}).slice(0, 8).map(([k, v]) => `${str(k, 40)}: ${Math.max(0, Math.min(100, Number(v) || 0))} %`).join(', ');
  const flags = (Array.isArray(b?.flags) ? b.flags : []).slice(0, 10).map((f) => `- ${str(f, 200)}`).join('\n') || '- none';
  if (!answers) return json({ error: 'empty' }, 400);
  const h = HEADS[lang] || null;
  const task = `A visitor filled in the quiz "Is a Greater Swiss Mountain Dog (Swissy) right for you?". Evaluate honestly, as Carrie, whether a Swissy fits this person.

Their answers:
${answers}

Score by area: ${scores}. Overall: ${Math.max(0, Math.min(100, Number(b?.total) || 0))} %.
Warnings raised by the quiz:
${flags}

Write in ${LANG_NAMES[lang]}. Use exactly three sections, each starting with a markdown heading (###) ${h ? `named "${h[0]}", "${h[1]}" and "${h[2]}"` : 'meaning "Why yes", "Why not" and "What I would change", translated'}. Under each heading 2 to 4 short bullet points (- ). Refer to their actual answers. The area scores are the quiz's baseline: don't call an answer bad if its area scored well, focus the criticism on low areas and on the warnings. Be kind but honest: if a Swissy is a bad fit, say so clearly and, in the last section, you may suggest considering a smaller or calmer breed or an adult dog. In "What I would change" give concrete, practical steps (e.g. meet adult Swissies, puppy classes, a dog walker, savings for the vet). No intro, no outro, no invented numbers or studies, under 220 words. Call the breed "Swissy" (in Slovak and Czech write "swissy"), never invent nicknames, and write correct, natural ${LANG_NAMES[lang]} without words from other languages.`;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: MODEL, max_tokens: 900, thinking: { type: 'disabled' }, system: systemPrompt(lang), messages: [{ role: 'user', content: task }] }),
  });
  if (!res.ok) { console.log('anthropic quiz error', res.status, (await res.text()).slice(0, 300)); return json({ error: 'upstream' }, 502); }
  const data = await res.json();
  const text = (data.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('\n').trim();
  return text ? json({ reply: text }) : json({ error: 'empty_reply' }, 502);
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
      return { id: pick(/<yt:videoId>([^<]+)<\/yt:videoId>/), title: unescape(pick(/<title>([^<]*)<\/title>/)).replace(/\s*\|\s*Carrie the Swiss.*$/i, ''), published: pick(/<published>([^<]+)<\/published>/) };
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

// ---- newsletter: Brevo double opt-in (the visitor confirms by e-mail before being added)
async function subscribe(request, env) {
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  const origin = request.headers.get('origin') || '';
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'origin' }, 403);
  if (!env.BREVO_API_KEY || !env.BREVO_LIST_ID || !env.BREVO_DOI_TEMPLATE_ID) return json({ error: 'not_configured' }, 503);
  if (env.CHAT_LIMIT) {
    const { success } = await env.CHAT_LIMIT.limit({ key: 'sub:' + (request.headers.get('cf-connecting-ip') || 'anon') });
    if (!success) return json({ error: 'rate' }, 429);
  }
  let b; try { b = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }
  const email = String(b?.email || '').trim().toLowerCase();
  if (b?.website) return json({ ok: true }); // honeypot: bots fill hidden fields
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i.test(email) || b?.consent !== true) return json({ error: 'invalid' }, 400);
  const lang = LANGS.has(b?.lang) ? b.lang : 'en';
  const host = new URL(request.url).origin;
  const r = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json', 'api-key': env.BREVO_API_KEY },
    body: JSON.stringify({
      email,
      includeListIds: [Number(env.BREVO_LIST_ID)],
      templateId: Number(env.BREVO_DOI_TEMPLATE_ID),
      redirectionUrl: `${host}/${lang}/?subscribed=1#follow`,
      attributes: { LANGUAGE: lang },
    }),
  });
  if (r.ok || r.status === 204) return json({ ok: true });
  const t = await r.text();
  if (/duplicate|already/i.test(t)) return json({ ok: true });
  console.log('brevo error', r.status, t.slice(0, 300));
  return json({ error: 'upstream' }, 502);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === '/api/ask') return chat(request, env);
    if (url.pathname === '/api/quiz') return quiz(request, env);
    if (url.pathname === '/api/latest') return latest(request, ctx);
    if (url.pathname === '/api/subscribe') return subscribe(request, env);
    if (url.pathname === '/api/ev') return event(request, env, ctx);
    if (url.pathname === '/api/stats') return stats(request, env);
    const t = url.pathname.match(/^\/api\/thumb\/([\w-]+)\.jpg$/);
    if (t) return thumb(request, ctx, t[1]);
    return env.ASSETS.fetch(request);
  },
};
