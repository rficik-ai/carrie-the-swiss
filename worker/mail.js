// Newsletter with double opt-in, in the visitor's language and in Carrie's look.
//
// 1. POST /api/subscribe {email, lang, consent}: the Worker sends a branded confirmation e-mail through Brevo
//    (transactional API) in the language of the page the visitor signed up on. The link carries a signed token.
// 2. GET /api/confirm?t=…: the token is checked (signature, 7 days) and only then the address goes into the Brevo
//    list, with the attribute LANGUAGE (so later newsletters can go out per language). Then the welcome e-mail with
//    the cheat sheet "10 questions for the breeder" (/[lang]/checklist/ + PDF) goes out.
// 3. /api/unsubscribe?t=…: one question, one button, off the list.
//
// Settings: BREVO_API_KEY (Secret, Rob adds it in Cloudflare); BREVO_LIST_ID, MAIL_FROM, MAIL_NAME (wrangler.jsonc vars).
// The sender's domain carrietheswiss.com is authenticated in Brevo (Brevo code, DKIM, DMARC records in Cloudflare DNS).

import { COPY, WELCOME, UNSUB, PRIVACY_WORD } from './mailcopy.js';

const LANGS = new Set(['en', 'sk', 'cs', 'de', 'pl', 'fr', 'it', 'es', 'uk', 'hu', 'nl']);
const DAYS = 7;   // how long the confirmation link is valid
const SITE = 'https://carrietheswiss.com';
const IG = 'https://www.instagram.com/carrietheswiss/';
const YT = 'https://www.youtube.com/@carrietheswiss';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// tables and inline styles: the only layout every mail app agrees on. Dark and gold like the site; the fonts load
// where the mail app allows it (Apple Mail, iOS), elsewhere Georgia and Arial stand in.
const F = { serif: "Cinzel, Georgia, 'Times New Roman', serif", head: "Montserrat, 'Helvetica Neue', Arial, sans-serif", text: "Manrope, 'Helvetica Neue', Arial, sans-serif" };
const gold = (href, label) => `<a href="${esc(href)}" style="color:#c9a35b;text-decoration:none">${esc(label)}</a>`;

// one card: logo, Carrie, gold rule, headline, text, gold button, then the quiet parts. body/extra/small are HTML.
function shell(lang, { subject, pre, title, body, button, extra = '', small = '', foot = '' }) {
  const home = `${SITE}/${lang}/`;
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${esc(subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&amp;family=Montserrat:wght@800&amp;family=Manrope:wght@400;600&amp;display=swap" rel="stylesheet">
<style>a{color:#e8c77a}@media (max-width:600px){.pad{padding-left:22px!important;padding-right:22px!important}.h1{font-size:24px!important}}</style>
</head>
<body style="margin:0;padding:0;background:#0d0c0a;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#0d0c0a">${esc(pre)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0c0a">
<tr><td align="center" style="padding:28px 12px 32px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
    <tr><td align="center" style="padding:0 0 18px">
      <a href="${home}" style="text-decoration:none"><span style="font-family:${F.serif};font-weight:700;font-size:24px;letter-spacing:6px;color:#f2d48e">CARRIE</span><br>
      <span style="font-family:${F.serif};font-weight:700;font-size:10px;letter-spacing:7px;color:#c9a35b">THE SWISS</span></a>
    </td></tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#16140f;border:1px solid #2c2820;border-radius:18px;overflow:hidden">
    <tr><td style="padding:0;line-height:0"><a href="${home}"><img src="${SITE}/assets/img/og.jpg" width="560" alt="Carrie" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:18px 18px 0 0"></a></td></tr>
    <tr><td class="pad" style="padding:30px 36px 0">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:28px;height:2px;background:#c9a35b;line-height:2px;font-size:0">&nbsp;</td></tr></table>
    </td></tr>
    <tr><td class="pad h1" style="padding:14px 36px 0;font-family:${F.head};font-weight:800;font-size:28px;line-height:1.12;letter-spacing:-0.2px;text-transform:uppercase;color:#ffffff">${esc(title)}</td></tr>
    <tr><td class="pad" style="padding:14px 36px 0;font-family:${F.text};font-size:16px;line-height:1.6;color:#e9e2d3">${body}</td></tr>
    <tr><td class="pad" style="padding:28px 36px 6px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#e8c77a" style="border-radius:999px;background:#e8c77a;background-image:linear-gradient(180deg,#f6dc9c,#c9a35b)">
        <a href="${esc(button.href)}" style="display:inline-block;padding:16px 32px;font-family:${F.head};font-weight:800;font-size:15px;letter-spacing:0.4px;color:#1a1408;text-decoration:none;border-radius:999px">${esc(button.label)} &rarr;</a>
      </td></tr></table>
    </td></tr>
    ${extra ? `<tr><td class="pad" style="padding:14px 36px 0;font-family:${F.text};font-size:15px;line-height:1.6;color:#e9e2d3">${extra}</td></tr>` : ''}
    <tr><td class="pad" style="padding:22px 36px 32px;font-family:${F.text};font-size:13px;line-height:1.55;color:#9d9380">${small}</td></tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
    <tr><td align="center" style="padding:22px 20px 0;font-family:${F.text};font-size:12px;line-height:1.7;color:#8f8571">
      ${gold(IG, 'Instagram')} &nbsp;·&nbsp; ${gold(YT, 'YouTube')} &nbsp;·&nbsp; ${gold(home, 'carrietheswiss.com')} &nbsp;·&nbsp; ${gold(`${SITE}/${lang}/privacy/`, PRIVACY_WORD[lang] ?? PRIVACY_WORD.en)}<br>
      ${foot}
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

export function confirmHtml(lang, link) {
  const c = COPY[lang] ?? COPY.en;
  return shell(lang, { subject: c.subject, pre: c.pre, title: c.title, body: esc(c.body), button: { href: link, label: c.button }, small: esc(c.ignore), foot: esc(c.why) });
}

export function confirmText(lang, link) {
  const c = COPY[lang] ?? COPY.en;
  return `${c.title}\n\n${c.body}\n\n${c.button}: ${link}\n\n${c.ignore}\n\n--\nCarrie the Swiss · ${SITE}/${lang}/\n${c.why}`;
}

// the thank-you after confirming: the cheat sheet (page + PDF), what comes next, a one-step way out
const sheet = (lang) => ({ page: `${SITE}/${lang}/checklist/`, pdf: `${SITE}/assets/pdf/carrie-10-questions-${lang}.pdf` });
export function welcomeHtml(lang, unsubLink) {
  const w = WELCOME[lang] ?? WELCOME.en, s = sheet(lang);
  return shell(lang, {
    subject: w.subject, pre: w.pre, title: w.title, body: esc(w.body), button: { href: s.page, label: w.button },
    extra: `<a href="${esc(s.pdf)}" style="color:#e8c77a;font-weight:600">${esc(w.pdf)}</a>`,
    small: `${esc(w.next)} ${gold(`${SITE}/${lang}/#episodes`, w.episodes)}`,
    foot: `${esc(w.why)} ${gold(unsubLink, w.unsub)}`,
  });
}
export function welcomeText(lang, unsubLink) {
  const w = WELCOME[lang] ?? WELCOME.en, s = sheet(lang);
  return `${w.title}\n\n${w.body}\n\n${w.button}: ${s.page}\n${w.pdf}: ${s.pdf}\n\n${w.next} ${SITE}/${lang}/#episodes\n\n--\nCarrie the Swiss · ${SITE}/${lang}/\n${w.why}\n${w.unsub}: ${unsubLink}`;
}

// ------------------------------------------------------------------ the signed link (no database needed)
const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (ch) => ch.charCodeAt(0));
// one key per purpose, so a confirmation link can never act as a way-out link and the other way round
const key = (env, use) => crypto.subtle.importKey('raw', new TextEncoder().encode(`${use}:${env.BREVO_API_KEY}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

async function sign(env, email, lang, use = 'doi') {
  const payload = b64(new TextEncoder().encode(JSON.stringify({ e: email, l: lang, t: Date.now() })));
  return `${payload}.${b64(await crypto.subtle.sign('HMAC', await key(env, use), new TextEncoder().encode(payload)))}`;
}
async function check(env, token, use = 'doi') {
  const [payload, sig] = String(token || '').split('.');
  if (!payload || !sig) return null;
  try {
    if (!(await crypto.subtle.verify('HMAC', await key(env, use), unb64(sig), new TextEncoder().encode(payload)))) return null;
    const d = JSON.parse(new TextDecoder().decode(unb64(payload)));
    if (!LANGS.has(d.l) || (use === 'doi' && Date.now() - d.t > DAYS * 864e5)) return null;   // the way out never expires
    return d;
  } catch { return null; }
}

// ------------------------------------------------------------------ Brevo calls
const brevo = (env, path, body) => fetch(`https://api.brevo.com/v3${path}`, {
  method: 'POST',
  headers: { 'content-type': 'application/json', accept: 'application/json', 'api-key': env.BREVO_API_KEY },
  body: JSON.stringify(body),
});
const configured = (env) => !!(env.BREVO_API_KEY && env.BREVO_LIST_ID);

export async function subscribe(request, env) {
  if (request.method === 'GET') return json({ configured: configured(env) });   // says only whether the settings are in place
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  const origin = request.headers.get('origin') || '';
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: 'origin' }, 403);
  if (!configured(env)) return json({ error: 'not_configured' }, 503);
  let b; try { b = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }
  if (b?.website) return json({ ok: true });   // honeypot: bots fill hidden fields
  const email = String(b?.email || '').trim().toLowerCase();
  if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i.test(email) || b?.consent !== true) return json({ error: 'invalid' }, 400);
  const lang = LANGS.has(b?.lang) ? b.lang : 'en';
  // nobody gets flooded with confirmation e-mails: a few per minute per visitor and per address
  const limiter = env.MAIL_LIMIT || env.CHAT_LIMIT;
  if (limiter) {
    for (const k of [`ip:${request.headers.get('cf-connecting-ip') || 'anon'}`, `to:${email}`]) {
      const { success } = await limiter.limit({ key: k });
      if (!success) return json({ error: 'rate' }, 429);
    }
  }
  const link = `${new URL(request.url).origin}/api/confirm?t=${await sign(env, email, lang)}&l=${lang}`;
  const c = COPY[lang];
  const r = await brevo(env, '/smtp/email', {
    sender: { name: env.MAIL_NAME || 'Carrie the Swiss', email: env.MAIL_FROM || 'carrie@carrietheswiss.com' },
    to: [{ email }],
    subject: c.subject,
    htmlContent: confirmHtml(lang, link),
    textContent: confirmText(lang, link),
    tags: ['confirm', lang],
  });
  if (r.ok) return json({ ok: true });
  console.log('brevo send error', r.status, (await r.text()).slice(0, 300));
  return json({ error: 'upstream' }, 502);
}

export async function confirm(request, env, ctx) {
  const url = new URL(request.url);
  const d = configured(env) ? await check(env, url.searchParams.get('t')) : null;
  const back = (lang, q) => Response.redirect(`${url.origin}/${lang}/?${q}#follow`, 303);
  if (!d) return back(LANGS.has(url.searchParams.get('l')) ? url.searchParams.get('l') : 'en', 'nl=expired');
  const add = (attributes) => brevo(env, '/contacts', {
    email: d.e, listIds: [Number(env.BREVO_LIST_ID)], updateEnabled: true, ...(attributes ? { attributes } : {}),
  });
  let r = await add({ LANGUAGE: d.l });
  let t = r.ok ? '' : await r.text();
  if (r.status === 400 && /attribute/i.test(t)) { r = await add(null); t = r.ok ? '' : await r.text(); }   // LANGUAGE is optional in Brevo
  if (r.ok || r.status === 204) {
    const done = sendWelcome(env, url.origin, d.e, d.l).catch((e) => console.log('brevo welcome error', String(e)));
    if (ctx?.waitUntil) ctx.waitUntil(done); else await done;
    return back(d.l, 'subscribed=1');
  }
  console.log('brevo contact error', r.status, t.slice(0, 300));
  return back(d.l, 'nl=error');
}

async function sendWelcome(env, origin, email, lang) {
  const out = `${origin}/api/unsubscribe?t=${await sign(env, email, lang, 'out')}`;
  const r = await brevo(env, '/smtp/email', {
    sender: { name: env.MAIL_NAME || 'Carrie the Swiss', email: env.MAIL_FROM || 'carrie@carrietheswiss.com' },
    to: [{ email }],
    subject: (WELCOME[lang] ?? WELCOME.en).subject,
    htmlContent: welcomeHtml(lang, out),
    textContent: welcomeText(lang, out),
    headers: { 'List-Unsubscribe': `<${out}>` },
    tags: ['welcome', lang],
  });
  if (!r.ok) console.log('brevo welcome error', r.status, (await r.text()).slice(0, 300));
}

// ------------------------------------------------------------------ the way out: /api/unsubscribe?t=…
// GET shows one question with a button (mail apps' link scanners only GET, so nobody is unsubscribed by a robot);
// POST takes the address off the list.
function page(lang, title, body, extra = '') {
  const u = UNSUB[lang] ?? UNSUB.en;
  return new Response(`<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(title)} · Carrie the Swiss</title><style>
:root{color-scheme:dark}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(70% 60% at 50% 0%,rgba(201,163,91,.16),transparent 60%),#0d0c0a;color:#f4eee2;font:16px/1.6 'Helvetica Neue',Arial,sans-serif;padding:24px max(16px,env(safe-area-inset-left))}
main{max-width:440px;text-align:center;display:grid;gap:16px}.m{font:700 22px/1.1 Georgia,serif;letter-spacing:.3em;color:#f2d48e}.m small{display:block;font-size:9px;letter-spacing:.6em;color:#c9a35b;margin-top:4px}
h1{font:800 26px/1.15 'Helvetica Neue',Arial,sans-serif;text-transform:uppercase;margin:8px 0 0}p{margin:0;color:#d8cfbd}
button{justify-self:center;border:0;border-radius:999px;padding:15px 30px;font:800 15px 'Helvetica Neue',Arial,sans-serif;color:#1a1408;background:linear-gradient(180deg,#f6dc9c,#c9a35b);cursor:pointer}
a{color:#e8c77a}</style></head><body><main><div class="m">CARRIE<small>THE SWISS</small></div><h1>${esc(title)}</h1><p>${esc(body)}</p>${extra}
<p><a href="${SITE}/${lang}/">${esc(u.back)}</a></p></main></body></html>`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
}

export async function unsubscribe(request, env) {
  const url = new URL(request.url), token = url.searchParams.get('t') || '';
  const d = configured(env) ? await check(env, token, 'out') : null;
  const lang = d?.l ?? 'en', u = UNSUB[lang] ?? UNSUB.en;
  if (!d) return page(lang, u.title, u.error);
  if (request.method !== 'POST') {
    return page(lang, u.title, u.body, `<form method="post" action="/api/unsubscribe?t=${encodeURIComponent(token)}"><button type="submit">${esc(u.button)}</button></form>`);
  }
  const r = await brevo(env, `/contacts/lists/${Number(env.BREVO_LIST_ID)}/contacts/remove`, { emails: [d.e] });
  const t = r.ok ? '' : await r.text();
  if (r.ok || /already|does not exist|not found/i.test(t)) return page(lang, u.done_title, u.done_body);
  console.log('brevo unsubscribe error', r.status, t.slice(0, 300));
  return page(lang, u.title, u.error);
}

// Brevo switches an API key off after 90 days without use. Once a week the Worker reads the list (a harmless call
// that counts as use), so a quiet stretch without sign-ups never breaks the form. Cron: wrangler.jsonc "triggers".
export async function keepAlive(env) {
  if (!configured(env)) return;
  const r = await fetch(`https://api.brevo.com/v3/contacts/lists/${Number(env.BREVO_LIST_ID)}`, {
    headers: { accept: 'application/json', 'api-key': env.BREVO_API_KEY },
  });
  if (!r.ok) console.log('brevo keep-alive', r.status, (await r.text()).slice(0, 200));
}

// ------------------------------------------------------------------ TEMPORARY (Nov 2026): samples for Rob
// POST /api/mail-samples {email, lang}: sends that language's confirmation and welcome e-mail, with "[Ukážka nn/22]"
// in the subject, so Rob can see every version in his inbox. Only to an address already confirmed on the list
// (nobody else can be sent anything), a few calls a minute, and only until 7 Nov 2026. Delete after use.
const SAMPLE_ORDER = ['sk', 'en', 'cs', 'de', 'pl', 'fr', 'it', 'es', 'uk', 'hu', 'nl'];
export async function samples(request, env) {
  if (request.method !== 'POST' || Date.now() > Date.UTC(2026, 10, 7)) return json({ error: 'gone' }, 410);
  if (!configured(env)) return json({ error: 'not_configured' }, 503);
  let b; try { b = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }
  const email = String(b?.email || '').trim().toLowerCase(), lang = b?.lang;
  if (!email || !LANGS.has(lang)) return json({ error: 'invalid' }, 400);
  if (env.MAIL_LIMIT && !(await env.MAIL_LIMIT.limit({ key: `samples:${email}` })).success) return json({ error: 'rate' }, 429);
  const c = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    headers: { accept: 'application/json', 'api-key': env.BREVO_API_KEY },
  });
  const lists = c.ok ? ((await c.json()).listIds || []) : [];
  if (!lists.includes(Number(env.BREVO_LIST_ID))) return json({ error: 'not_on_list' }, 403);
  const origin = new URL(request.url).origin, i = SAMPLE_ORDER.indexOf(lang);
  const tag = (n, kind) => `[Ukážka ${String(2 * i + n).padStart(2, '0')}/22 · ${lang.toUpperCase()} · ${kind}] `;
  const sender = { name: env.MAIL_NAME || 'Carrie the Swiss', email: env.MAIL_FROM || 'carrie@carrietheswiss.com' };
  const link = `${origin}/api/confirm?t=${await sign(env, email, lang)}&l=${lang}`;
  const out = `${origin}/api/unsubscribe?t=${await sign(env, email, lang, 'out')}`;
  const r1 = await brevo(env, '/smtp/email', {
    sender, to: [{ email }], subject: tag(1, 'potvrdenie') + COPY[lang].subject,
    htmlContent: confirmHtml(lang, link), textContent: confirmText(lang, link), tags: ['sample', lang],
  });
  const r2 = await brevo(env, '/smtp/email', {
    sender, to: [{ email }], subject: tag(2, 'uvítanie') + (WELCOME[lang] ?? WELCOME.en).subject,
    htmlContent: welcomeHtml(lang, out), textContent: welcomeText(lang, out),
    headers: { 'List-Unsubscribe': `<${out}>` }, tags: ['sample', lang],
  });
  return json({ lang, confirm: r1.status, welcome: r2.status });
}
