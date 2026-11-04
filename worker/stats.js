// Measurement without cookies: the page sends small anonymous events (what happened, never who), they go to
// Workers Analytics Engine (dataset "carrie_events", binding EV). No IP address, no visitor id, no cookie,
// so no consent banner is needed. /api/stats shows the numbers to Rob behind a password.
//
// Rob sets in Cloudflare (Worker → Settings → Variables and Secrets):
//   STATS_PASSWORD  (Secret)  the password for /api/stats
//   CF_API_TOKEN    (Secret)  an API token with the permission "Account Analytics: Read"
//   CF_ACCOUNT_ID   (Text)    the account id (in the dashboard URL)

const LANGS = new Set(['en', 'sk', 'cs', 'de', 'pl', 'fr', 'it', 'es', 'uk', 'hu', 'nl']);
const EVENTS = new Set(['visit', 'scene', 'cta', 'ep_open', 'ep_play', 'out', 'signup', 'quiz', 'ask', 'paper', 'flip', 'wall']);
const BOTS = /bot|crawl|spider|slurp|preview|headless|lighthouse|pagespeed|facebookexternalhit|embedly|monitor/i;
const clean = (s, n) => String(s ?? '').slice(0, n).replace(/[^\w.:\-]/g, '');

export async function event(request, env) {
  const done = () => new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  if (request.method !== 'POST' || !env.EV) return done();
  if (BOTS.test(request.headers.get('user-agent') || '')) return done();
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return done();
  let b; try { b = JSON.parse((await request.text()).slice(0, 600)); } catch { return done(); }
  const e = clean(b?.e, 16);
  if (!EVENTS.has(e)) return done();
  const l = LANGS.has(b?.l) ? b.l : '';
  const d = b?.d === 'm' ? 'm' : 'd';
  const country = clean(request.cf?.country, 2);
  env.EV.writeDataPoint({ blobs: [e, clean(b?.v, 40), l, d, clean(b?.r, 60), country], doubles: [1], indexes: [e] });
  return done();
}

// ---------------------------------------------------------------- the page for Rob
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

async function sql(env, q) {
  const r = await fetch(`https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/analytics_engine/sql`, {
    method: 'POST', headers: { authorization: `Bearer ${env.CF_API_TOKEN}` }, body: `${q} FORMAT JSON`,
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`${r.status} ${t.slice(0, 200)}`);
  return JSON.parse(t).data ?? [];
}

const NAMES = { ig: 'Instagram', yt: 'YouTube', start: 'začatý', done: 'dokončený', try: 'odoslaný', ok: 'prihlásený (čaká na potvrdenie)', confirmed: 'potvrdený', zoom: 'zväčšená fotka/papier', q: 'otázka' };
const nice = (v) => NAMES[v] ?? v;
const SCENES = [['intro', 'Úvod'], ['library', 'Knižnica'], ['real', 'Fotky'], ['wall', 'Stena'], ['desk', 'Stôl'], ['garden', 'Kvíz'], ['fire', 'Kozub'], ['door', 'Dvere'], ['follow', 'Sledujte ma']];

function bars(rows, total, label = (r) => r.k) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return `<table>${rows.map((r) => `<tr><td>${esc(label(r))}</td><td class="bar"><i style="width:${(100 * r.n / max).toFixed(1)}%"></i></td><td class="n">${r.n}${total ? ` <small>${Math.round(100 * r.n / total)} %</small>` : ''}</td></tr>`).join('')}</table>`;
}

function page(title, body) {
  return new Response(`<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${title}</title><style>
:root{color-scheme:dark}body{margin:0;background:#0d0c0a;color:#f4eee2;font:15px/1.5 system-ui,sans-serif}main{max-width:980px;margin:0 auto;padding:28px max(16px,env(safe-area-inset-left))}
h1{font:800 28px/1.1 system-ui;text-transform:uppercase;letter-spacing:-.01em;margin:0 0 4px}h2{font:800 15px system-ui;text-transform:uppercase;letter-spacing:.08em;color:#e8c77a;margin:34px 0 10px}
.k{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.k div{background:#16140f;border:1px solid #2c2820;border-radius:12px;padding:14px}.k b{display:block;font:800 30px system-ui}.k span{color:#b9ae98;font-size:13px}
table{width:100%;border-collapse:collapse}td{padding:5px 8px 5px 0;border-bottom:1px solid #221f19;vertical-align:middle}td:first-child{width:34%;color:#d8cfbd}.bar i{display:block;height:10px;border-radius:5px;background:linear-gradient(90deg,#c9a35b,#f2d48e)}.n{width:90px;text-align:right;font-weight:700}.n small{color:#8f8571;font-weight:400}
p.note{color:#b9ae98}a{color:#f2d48e}.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:0 28px}form{margin:0 0 6px}select{background:#16140f;color:#f4eee2;border:1px solid #2c2820;border-radius:8px;padding:6px 8px}
</style></head><body><main>${body}</main></body></html>`, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
}

export async function stats(request, env) {
  if (!env.STATS_PASSWORD) return page('Štatistiky', '<h1>Štatistiky</h1><p class="note">Chýba heslo: v nastaveniach Workera pridaj Secret <b>STATS_PASSWORD</b>.</p>');
  const auth = request.headers.get('authorization') || '';
  const pass = auth.startsWith('Basic ') ? (atob(auth.slice(6)).split(':').slice(1).join(':')) : '';
  if (pass !== env.STATS_PASSWORD) return new Response('Prihlásenie', { status: 401, headers: { 'www-authenticate': 'Basic realm="Carrie stats", charset="UTF-8"', 'cache-control': 'no-store' } });
  if (!env.CF_API_TOKEN || !env.CF_ACCOUNT_ID) {
    return page('Štatistiky', '<h1>Štatistiky</h1><p class="note">Udalosti sa už zbierajú. Na ich zobrazenie treba v nastaveniach Workera ešte <b>CF_API_TOKEN</b> (Secret, token s právom „Account Analytics: Read“) a <b>CF_ACCOUNT_ID</b> (text, ID účtu z adresy v dashboarde).</p>');
  }
  const days = Math.min(90, Math.max(1, Number(new URL(request.url).searchParams.get('d')) || 30));
  const since = `timestamp > NOW() - INTERVAL '${days}' DAY`;
  try {
    const [byEv, perDay, byLang, byDev, byRef, byCountry] = await Promise.all([
      sql(env, `SELECT blob1 AS e, blob2 AS v, SUM(_sample_interval) AS n FROM carrie_events WHERE ${since} GROUP BY e, v ORDER BY n DESC LIMIT 400`),
      sql(env, `SELECT toStartOfInterval(timestamp, INTERVAL '1' DAY) AS t, SUM(_sample_interval) AS n FROM carrie_events WHERE ${since} AND blob1 = 'visit' GROUP BY t ORDER BY t`),
      sql(env, `SELECT blob3 AS k, SUM(_sample_interval) AS n FROM carrie_events WHERE ${since} AND blob1 = 'visit' GROUP BY k ORDER BY n DESC`),
      sql(env, `SELECT blob4 AS k, SUM(_sample_interval) AS n FROM carrie_events WHERE ${since} AND blob1 = 'visit' GROUP BY k ORDER BY n DESC`),
      sql(env, `SELECT blob5 AS k, SUM(_sample_interval) AS n FROM carrie_events WHERE ${since} AND blob1 = 'visit' GROUP BY k ORDER BY n DESC LIMIT 15`),
      sql(env, `SELECT blob6 AS k, SUM(_sample_interval) AS n FROM carrie_events WHERE ${since} AND blob1 = 'visit' GROUP BY k ORDER BY n DESC LIMIT 15`),
    ]);
    const num = (x) => Math.round(Number(x) || 0);
    const get = (e, v) => num(byEv.find((r) => r.e === e && (v === undefined || r.v === v))?.n);
    const sum = (e) => byEv.filter((r) => r.e === e).reduce((a, r) => a + num(r.n), 0);
    const list = (e) => byEv.filter((r) => r.e === e).map((r) => ({ k: r.v || '–', n: num(r.n) }));
    const visits = sum('visit'), home = get('visit', 'home');
    const funnel = SCENES.map(([id, name]) => ({ k: name, n: get('scene', id) }));
    const kpi = (n, t) => `<div><b>${n}</b><span>${t}</span></div>`;
    const sel = [7, 30, 90].map((d) => `<option value="${d}"${d === days ? ' selected' : ''}>${d} dní</option>`).join('');
    const body = `<h1>Carrie · štatistiky</h1><form><select name="d" onchange="this.form.submit()">${sel}</select></form>
<div class="k">${kpi(visits, 'návštev stránok')}${kpi(sum('ep_play'), 'prehratí epizód')}${kpi(sum('out'), 'klikov na YouTube / Instagram')}${kpi(get('signup', 'ok'), 'prihlásení na e-mail')}${kpi(get('quiz', 'done'), 'dokončených kvízov')}${kpi(sum('ask'), 'otázok pre Carrie')}</div>
<h2>Návštevy po dňoch</h2>${bars(perDay.map((r) => ({ k: String(r.t).slice(0, 10), n: num(r.n) })), 0)}
<h2>Kam sa ľudia dostanú (úvodná stránka)</h2>${bars(funnel, home)}
<p class="note">Percentá sú z návštev úvodnej stránky (${home}). Každá scéna sa počíta raz za návštevu.</p>
<div class="cols"><div><h2>Otvorené knihy</h2>${bars(list('ep_open').sort((a, b) => a.k.localeCompare(b.k)), 0)}</div><div><h2>Prehraté epizódy</h2>${bars(list('ep_play').sort((a, b) => a.k.localeCompare(b.k)), 0)}</div></div>
<div class="cols"><div><h2>Kliky von</h2>${bars(list('out').map((r) => ({ ...r, k: nice(r.k) })), 0)}</div><div><h2>Tlačidlá a hry</h2>${bars([...list('cta').map((r) => ({ ...r, k: 'tlačidlo Pozrieť epizódy, kapitola ' + r.k.replace('ch', '') })), ...list('paper').map((r) => ({ ...r, k: 'papier ' + r.k })), ...list('flip').map((r) => ({ ...r, k: 'otočená fotka ' + r.k })), ...list('wall').map((r) => ({ ...r, k: 'stena: ' + nice(r.k) })), ...list('quiz').map((r) => ({ ...r, k: 'kvíz ' + nice(r.k) })), ...list('signup').map((r) => ({ ...r, k: 'e-mail ' + nice(r.k) }))], 0)}</div></div>
<div class="cols"><div><h2>Odkiaľ prišli</h2>${bars(byRef.map((r) => ({ k: r.k || 'priamo / neznáme', n: num(r.n) })), visits)}</div><div><h2>Jazyk</h2>${bars(byLang.map((r) => ({ k: r.k || '–', n: num(r.n) })), visits)}</div></div>
<div class="cols"><div><h2>Zariadenie</h2>${bars(byDev.map((r) => ({ k: r.k === 'm' ? 'mobil' : 'počítač', n: num(r.n) })), visits)}</div><div><h2>Krajina</h2>${bars(byCountry.map((r) => ({ k: r.k || '–', n: num(r.n) })), visits)}</div></div>
<p class="note">Bez cookies a bez IP adries: vidno len, čo sa stalo, nie kto to bol. Čísla môžu byť o pár minút oneskorené.</p>`;
    return page('Carrie · štatistiky', body);
  } catch (err) {
    return page('Štatistiky', `<h1>Štatistiky</h1><p class="note">Dotaz na Analytics Engine zlyhal: ${esc(err.message)}</p><p class="note">Skontroluj, či má token právo „Account Analytics: Read“ a či sedí CF_ACCOUNT_ID.</p>`);
  }
}
