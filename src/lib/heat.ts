// Anonymous heat map (worker/stats.js): where people tap, how far they scroll and how long they stay with each scene.
// A tap is only a rough spot on a 20 × 20 grid of the screen, tallied per day like every other event: no cookie, no id,
// no source or country, nothing that could tell one visit from another. Everything goes out in one request when the
// page is left (or every 30 taps), so the page never waits for it. Visitors with GPC / Do Not Track send nothing.
import { trackMany, trackingOff } from './ev';

const GRID = 20;
const MAX_TAPS = 40;
const PAGES = new Set(['home', 'papers', 'privacy', 'checklist']);
// the same things the gold cursor calls clickable (Cursor.astro) + plain form controls
const CLICKABLE = '[data-cur], a, button, summary, input, select, textarea, label, [role="button"], [role="link"]';

type Item = { e: string; v: string };

function pageKey() {
  const parts = location.pathname.split('/').filter(Boolean);
  if (parts[0]?.length === 2) parts.shift();          // the language
  const key = parts.join('-') || 'home';
  return PAGES.has(key) ? key : 'other';
}

function bucket(ms: number) {
  const s = ms / 1000;
  return s < 3 ? '0-3' : s < 10 ? '3-10' : s < 30 ? '10-30' : s < 60 ? '30-60' : '60p';
}

export function startHeat() {
  if (trackingOff) return;
  const page = pageKey();
  const home = page === 'home';
  const queue: Item[] = [];
  const dwell = new Map<string, number>();
  let taps = 0, deepest = 0, summarized = false, paused = document.visibilityState === 'hidden';

  // which scene is on screen: the chapter the page spine (Progress.astro) marks as current; elsewhere a tenth of the page
  const scene = () => {
    if (home) {
      const li = document.querySelector<HTMLElement>('.rail li.on[data-c]');
      if (li?.dataset.c) return li.dataset.c;
    }
    const h = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    return 'p' + Math.min(9, Math.floor((scrollY / h) * 10));
  };

  let cur = scene(), since = performance.now();
  const addDwell = () => {
    if (paused) return;
    const now = performance.now();
    dwell.set(cur, (dwell.get(cur) ?? 0) + (now - since));
    since = now;
  };

  const flush = (final: boolean) => {
    if (final && !summarized) {
      summarized = true;                                // depth and time once per page view, never twice
      queue.push({ e: 'depth', v: `${page}.${Math.min(100, Math.max(10, Math.ceil(deepest * 10) * 10))}` });
      if (home) dwell.forEach((ms, s) => { if (ms >= 300) queue.push({ e: 'dwell', v: `${page}.${s}.${bucket(ms)}` }); });
      else queue.push({ e: 'dwell', v: `${page}.all.${bucket([...dwell.values()].reduce((a, b) => a + b, 0))}` });
    }
    if (queue.length) trackMany(queue.splice(0, queue.length));
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const seen = (scrollY + innerHeight) / Math.max(1, document.documentElement.scrollHeight);
      if (seen > deepest) deepest = seen;
      const s = scene();
      if (s !== cur) { addDwell(); cur = s; }
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  addEventListener('pointerdown', (ev) => {
    if (!ev.isPrimary || ev.button > 0 || taps >= MAX_TAPS) return;
    taps++;
    const col = Math.min(GRID - 1, Math.max(0, Math.floor((ev.clientX / innerWidth) * GRID)));
    const row = Math.min(GRID - 1, Math.max(0, Math.floor((ev.clientY / innerHeight) * GRID)));
    const live = (ev.target as Element | null)?.closest?.(CLICKABLE) ? 1 : 0;   // 0 = a tap on nothing clickable
    queue.push({ e: 'hm', v: `${page}.${scene()}.${col}x${row}.${live}` });
    if (queue.length >= 30) flush(false);
  }, { passive: true, capture: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { addDwell(); paused = true; flush(true); }
    else { paused = false; since = performance.now(); }
  });
  addEventListener('pagehide', () => { addDwell(); paused = true; flush(true); });
}
