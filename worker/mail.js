// Newsletter with double opt-in, in the visitor's language and in Carrie's look.
//
// 1. POST /api/subscribe {email, lang, consent}: the Worker sends a branded confirmation e-mail through Brevo
//    (transactional API) in the language of the page the visitor signed up on. The link carries a signed token.
// 2. GET /api/confirm?t=…: the token is checked (signature, 7 days) and only then the address goes into the Brevo
//    list, with the attribute LANGUAGE (so later newsletters can go out per language).
//
// Settings: BREVO_API_KEY (Secret, Rob adds it in Cloudflare); BREVO_LIST_ID, MAIL_FROM, MAIL_NAME (wrangler.jsonc vars).
// The sender's domain carrietheswiss.com is authenticated in Brevo (Brevo code, DKIM, DMARC records in Cloudflare DNS).

const LANGS = new Set(['en', 'sk', 'cs', 'de', 'pl', 'fr', 'it', 'es', 'uk', 'hu', 'nl']);
const DAYS = 7;   // how long the confirmation link is valid
const SITE = 'https://carrietheswiss.com';
const IG = 'https://www.instagram.com/carrietheswiss/';
const YT = 'https://www.youtube.com/@carrietheswiss';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
});

// ------------------------------------------------------------------ the confirmation e-mail, 11 languages
// registers as on the site: sk, cs, fr, uk formal; de, pl, it, es, hu, nl informal
const COPY = {
  en: { subject: "One more tap, and you're in", pre: "Confirm your e-mail and I'll write when a new episode is out.", title: 'One more tap.',
    body: "Hi, Carrie here. Confirm your e-mail and I'll write to you when a new episode or something new in the shop comes out. Rarely, briefly, and only when it's worth it.",
    button: 'Confirm my e-mail', ignore: "Didn't sign up? Just ignore this e-mail, without confirmation you won't get anything else. The link is valid for 7 days.",
    why: 'You are getting this e-mail because this address was entered on carrietheswiss.com.' },
  sk: { subject: 'Ešte jedno ťuknutie a ste dnu', pre: 'Potvrďte e-mail a napíšem vám, keď vyjde nová epizóda.', title: 'Ešte jedno ťuknutie.',
    body: 'Ahoj, tu Carrie. Potvrďte svoj e-mail a napíšem vám, keď vyjde nová epizóda alebo niečo nové v obchode. Zriedka, stručne a len keď to stojí za to.',
    button: 'Potvrdiť e-mail', ignore: 'Neprihlasovali ste sa? Tento e-mail pokojne ignorujte, bez potvrdenia vám už nič nepríde. Odkaz platí 7 dní.',
    why: 'Tento e-mail ste dostali, lebo niekto zadal túto adresu na carrietheswiss.com.' },
  cs: { subject: 'Ještě jedno ťuknutí a jste uvnitř', pre: 'Potvrďte e-mail a napíšu vám, až vyjde nová epizoda.', title: 'Ještě jedno ťuknutí.',
    body: 'Ahoj, tady Carrie. Potvrďte svůj e-mail a napíšu vám, až vyjde nová epizoda nebo něco nového v obchodě. Zřídka, stručně a jen když to stojí za to.',
    button: 'Potvrdit e-mail', ignore: 'Nepřihlašovali jste se? Tento e-mail klidně ignorujte, bez potvrzení vám už nic nepřijde. Odkaz platí 7 dní.',
    why: 'Tento e-mail jste dostali, protože někdo zadal tuto adresu na carrietheswiss.com.' },
  de: { subject: 'Noch ein Klick, und du bist dabei', pre: 'Bestätige deine E-Mail, und ich schreibe dir, wenn eine neue Folge kommt.', title: 'Noch ein Klick.',
    body: 'Hallo, hier ist Carrie. Bestätige deine E-Mail, und ich schreibe dir, wenn eine neue Folge oder etwas Neues im Shop erscheint. Selten, kurz und nur, wenn es sich lohnt.',
    button: 'E-Mail bestätigen', ignore: 'Nicht angemeldet? Dann ignoriere diese E-Mail einfach, ohne Bestätigung bekommst du nichts weiter. Der Link ist 7 Tage gültig.',
    why: 'Du bekommst diese E-Mail, weil diese Adresse auf carrietheswiss.com eingegeben wurde.' },
  pl: { subject: 'Jeszcze jedno kliknięcie i jesteś z nami', pre: 'Potwierdź e-mail, a napiszę, gdy wyjdzie nowy odcinek.', title: 'Jeszcze jedno kliknięcie.',
    body: 'Cześć, tu Carrie. Potwierdź swój e-mail, a napiszę do ciebie, gdy wyjdzie nowy odcinek albo coś nowego w sklepie. Rzadko, krótko i tylko wtedy, gdy warto.',
    button: 'Potwierdzam e-mail', ignore: 'To nie ty? Po prostu zignoruj tę wiadomość, bez potwierdzenia nic więcej nie dostaniesz. Link jest ważny 7 dni.',
    why: 'Dostajesz tę wiadomość, bo ten adres został wpisany na carrietheswiss.com.' },
  fr: { subject: "Encore un clic et c'est fait", pre: 'Confirmez votre e-mail et je vous écrirai quand un nouvel épisode sortira.', title: 'Encore un clic.',
    body: 'Bonjour, ici Carrie. Confirmez votre e-mail et je vous écrirai quand un nouvel épisode ou une nouveauté de la boutique sortira. Rarement, brièvement, et seulement quand ça en vaut la peine.',
    button: 'Confirmer mon e-mail', ignore: "Ce n'est pas vous ? Ignorez simplement cet e-mail, sans confirmation vous ne recevrez rien d'autre. Le lien est valable 7 jours.",
    why: 'Vous recevez cet e-mail parce que cette adresse a été saisie sur carrietheswiss.com.' },
  it: { subject: 'Ancora un clic e ci sei', pre: 'Conferma la tua e-mail e ti scriverò quando esce un nuovo episodio.', title: 'Ancora un clic.',
    body: 'Ciao, sono Carrie. Conferma la tua e-mail e ti scriverò quando esce un nuovo episodio o una novità nel negozio. Di rado, in breve e solo quando ne vale la pena.',
    button: 'Conferma la mia e-mail', ignore: "Non hai chiesto tu l'iscrizione? Ignora pure questa e-mail, senza conferma non riceverai nient'altro. Il link è valido 7 giorni.",
    why: 'Ricevi questa e-mail perché questo indirizzo è stato inserito su carrietheswiss.com.' },
  es: { subject: 'Un clic más y ya estás dentro', pre: 'Confirma tu correo y te escribiré cuando salga un episodio nuevo.', title: 'Un clic más.',
    body: 'Hola, soy Carrie. Confirma tu correo y te escribiré cuando salga un episodio nuevo o algo nuevo en la tienda. Pocas veces, en breve y solo cuando valga la pena.',
    button: 'Confirmar mi correo', ignore: '¿No fuiste tú? Simplemente ignora este correo, sin confirmación no recibirás nada más. El enlace es válido durante 7 días.',
    why: 'Recibes este correo porque esta dirección se introdujo en carrietheswiss.com.' },
  uk: { subject: 'Ще один дотик, і ви з нами', pre: 'Підтвердьте e-mail, і я напишу вам, коли вийде новий епізод.', title: 'Ще один дотик.',
    body: 'Привіт, це Керрі. Підтвердьте свою адресу, і я напишу вам, коли вийде новий епізод або щось нове в магазині. Рідко, коротко і лише тоді, коли воно того варте.',
    button: 'Підтвердити e-mail', ignore: 'Ви не підписувалися? Просто проігноруйте цей лист, без підтвердження більше нічого не надійде. Посилання дійсне 7 днів.',
    why: 'Ви отримали цей лист, бо цю адресу ввели на carrietheswiss.com.' },
  hu: { subject: 'Még egy koppintás, és bent vagy', pre: 'Erősítsd meg az e-mail-címed, és írok, amikor új epizód jön.', title: 'Még egy koppintás.',
    body: 'Szia, itt Carrie. Erősítsd meg az e-mail-címed, és írok neked, amikor új epizód vagy valami új érkezik a boltba. Ritkán, röviden, és csak ha megéri.',
    button: 'Megerősítem', ignore: 'Nem te iratkoztál fel? Nyugodtan hagyd figyelmen kívül ezt az e-mailt, megerősítés nélkül nem kapsz többet. A link 7 napig érvényes.',
    why: 'Azért kapod ezt az e-mailt, mert ezt a címet megadták a carrietheswiss.com oldalon.' },
  nl: { subject: 'Nog één klik en je bent erbij', pre: 'Bevestig je e-mail en ik schrijf je zodra er een nieuwe aflevering is.', title: 'Nog één klik.',
    body: 'Hoi, hier is Carrie. Bevestig je e-mailadres en ik schrijf je zodra er een nieuwe aflevering of iets nieuws in de shop verschijnt. Zelden, kort en alleen als het de moeite waard is.',
    button: 'Bevestig mijn e-mail', ignore: 'Niet aangemeld? Negeer deze e-mail dan gewoon, zonder bevestiging krijg je niets meer. De link is 7 dagen geldig.',
    why: 'Je krijgt deze e-mail omdat dit adres is ingevuld op carrietheswiss.com.' },
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// tables and inline styles: the only layout every mail app agrees on. Dark and gold like the site; the fonts load
// where the mail app allows it (Apple Mail, iOS), elsewhere Georgia and Arial stand in.
export function confirmHtml(lang, link) {
  const c = COPY[lang] ?? COPY.en, home = `${SITE}/${lang}/`;
  const serif = "Cinzel, Georgia, 'Times New Roman', serif", head = "Montserrat, 'Helvetica Neue', Arial, sans-serif", text = "Manrope, 'Helvetica Neue', Arial, sans-serif";
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${esc(c.subject)}</title>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&amp;family=Montserrat:wght@800&amp;family=Manrope:wght@400;600&amp;display=swap" rel="stylesheet">
<style>a{color:#e8c77a}@media (max-width:600px){.pad{padding-left:22px!important;padding-right:22px!important}.h1{font-size:24px!important}}</style>
</head>
<body style="margin:0;padding:0;background:#0d0c0a;-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#0d0c0a">${esc(c.pre)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0c0a">
<tr><td align="center" style="padding:28px 12px 32px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
    <tr><td align="center" style="padding:0 0 18px">
      <a href="${home}" style="text-decoration:none"><span style="font-family:${serif};font-weight:700;font-size:24px;letter-spacing:6px;color:#f2d48e">CARRIE</span><br>
      <span style="font-family:${serif};font-weight:700;font-size:10px;letter-spacing:7px;color:#c9a35b">THE SWISS</span></a>
    </td></tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#16140f;border:1px solid #2c2820;border-radius:18px;overflow:hidden">
    <tr><td style="padding:0;line-height:0"><a href="${home}"><img src="${SITE}/assets/img/og.jpg" width="560" alt="Carrie" style="display:block;width:100%;max-width:560px;height:auto;border:0;border-radius:18px 18px 0 0"></a></td></tr>
    <tr><td class="pad" style="padding:30px 36px 0">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="width:28px;height:2px;background:#c9a35b;line-height:2px;font-size:0">&nbsp;</td></tr></table>
    </td></tr>
    <tr><td class="pad h1" style="padding:14px 36px 0;font-family:${head};font-weight:800;font-size:28px;line-height:1.12;letter-spacing:-0.2px;text-transform:uppercase;color:#ffffff">${esc(c.title)}</td></tr>
    <tr><td class="pad" style="padding:14px 36px 0;font-family:${text};font-size:16px;line-height:1.6;color:#e9e2d3">${esc(c.body)}</td></tr>
    <tr><td class="pad" style="padding:28px 36px 6px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#e8c77a" style="border-radius:999px;background:#e8c77a;background-image:linear-gradient(180deg,#f6dc9c,#c9a35b)">
        <a href="${esc(link)}" style="display:inline-block;padding:16px 32px;font-family:${head};font-weight:800;font-size:15px;letter-spacing:0.4px;color:#1a1408;text-decoration:none;border-radius:999px">${esc(c.button)} &rarr;</a>
      </td></tr></table>
    </td></tr>
    <tr><td class="pad" style="padding:22px 36px 32px;font-family:${text};font-size:13px;line-height:1.55;color:#9d9380">${esc(c.ignore)}</td></tr>
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px">
    <tr><td align="center" style="padding:22px 20px 0;font-family:${text};font-size:12px;line-height:1.6;color:#8f8571">
      <a href="${IG}" style="color:#c9a35b;text-decoration:none">Instagram</a> &nbsp;·&nbsp; <a href="${YT}" style="color:#c9a35b;text-decoration:none">YouTube</a> &nbsp;·&nbsp; <a href="${home}" style="color:#c9a35b;text-decoration:none">carrietheswiss.com</a><br>
      ${esc(c.why)}
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

export function confirmText(lang, link) {
  const c = COPY[lang] ?? COPY.en;
  return `${c.title}\n\n${c.body}\n\n${c.button}: ${link}\n\n${c.ignore}\n\n--\nCarrie the Swiss · ${SITE}/${lang}/\n${c.why}`;
}

// ------------------------------------------------------------------ the signed link (no database needed)
const b64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (ch) => ch.charCodeAt(0));
const key = (env) => crypto.subtle.importKey('raw', new TextEncoder().encode(`doi:${env.BREVO_API_KEY}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);

async function sign(env, email, lang) {
  const payload = b64(new TextEncoder().encode(JSON.stringify({ e: email, l: lang, t: Date.now() })));
  return `${payload}.${b64(await crypto.subtle.sign('HMAC', await key(env), new TextEncoder().encode(payload)))}`;
}
async function check(env, token) {
  const [payload, sig] = String(token || '').split('.');
  if (!payload || !sig) return null;
  try {
    if (!(await crypto.subtle.verify('HMAC', await key(env), unb64(sig), new TextEncoder().encode(payload)))) return null;
    const d = JSON.parse(new TextDecoder().decode(unb64(payload)));
    if (Date.now() - d.t > DAYS * 864e5 || !LANGS.has(d.l)) return null;
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

export async function confirm(request, env) {
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
  if (r.ok || r.status === 204) return back(d.l, 'subscribed=1');
  console.log('brevo contact error', r.status, t.slice(0, 300));
  return back(d.l, 'nl=error');
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
