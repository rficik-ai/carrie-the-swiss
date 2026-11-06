// Anonymous measurement (worker/stats.js): what happened on the page, never who did it. No cookie, no id, nothing
// stored in the browser; a visitor who asks not to be tracked (Global Privacy Control / Do Not Track) sends nothing.
const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
const off = nav.globalPrivacyControl === true || nav.doNotTrack === '1';
const lang = document.documentElement.lang.slice(0, 2);
const device = () => (matchMedia('(max-width: 899px), (hover: none)').matches ? 'm' : 'd');
const sent = new Set<string>();

/** track('ep_play', '03'); with once = true the same event+value is sent only once per page view */
export function track(e: string, v = '', once = false, r = '') {
  if (off) return;
  if (once) { const k = `${e}:${v}`; if (sent.has(k)) return; sent.add(k); }
  const body = JSON.stringify({ e, v, l: lang, d: device(), r });
  try {
    if (!navigator.sendBeacon?.('/api/ev', new Blob([body], { type: 'application/json' }))) {
      fetch('/api/ev', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
    }
  } catch { /* measurement never breaks the page */ }
}

/** a visitor who asked not to be tracked: the heat map (heat.ts) stays off too */
export const trackingOff = off;

/** several events in one request: the heat map sends its tally once, when the page is left */
export function trackMany(items: { e: string; v: string }[]) {
  if (off || !items.length) return;
  const body = JSON.stringify({ b: items.slice(0, 60), l: lang, d: device() });
  try {
    if (!navigator.sendBeacon?.('/api/ev', new Blob([body], { type: 'application/json' }))) {
      fetch('/api/ev', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } }).catch(() => {});
    }
  } catch { /* measurement never breaks the page */ }
}

/** where the visit came from: only the other site's name (instagram.com), never the full address */
export function referrerHost() {
  try {
    const h = document.referrer ? new URL(document.referrer).host.replace(/^www\.|^l\.|^m\.|^lm\./, '') : '';
    return h && h !== location.host ? h : '';
  } catch { return ''; }
}
