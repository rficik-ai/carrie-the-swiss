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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/ask') return chat(request, env);
    return env.ASSETS.fetch(request);
  },
};
