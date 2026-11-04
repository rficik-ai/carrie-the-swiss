// Shared framing for the scroll film and the interactive stops on top of it (1920x1080 source).
// The film and every overlay must use exactly the same numbers so hand-overs are pixel-identical.
import { SHELF } from '../data/shelf';
import type { HouseStop } from '../data/house';

export type Frame = { k: number; left: number; top: number; maxPan?: number };
export const WIDE_MQ = '(min-width: 900px) and (hover: hover)';
export const isWide = () => matchMedia(WIDE_MQ).matches;
const NARROW_UI = 176; // phone: space at the bottom for the caption bar / text

export function headerHeight() {
  return (document.querySelector('header.top') as HTMLElement | null)?.offsetHeight ?? 68;
}

/** cover placement (what object-fit: cover does) */
export function coverFrame(W: number, H: number): Frame {
  const k = Math.max(W / 1920, H / 1080);
  return { k, left: Math.round((W - 1920 * k) / 2), top: Math.round((H - 1080 * k) / 2) };
}

const clampPan = (pan: number, max: number) => Math.max(-max, Math.min(max, pan));

/** shelf stop: desktop fits books + plaques + caption below the menu; phone shows bigger books you can pan sideways */
export function fitFrame(W: number, H: number, hh = headerHeight(), pan = 0): Frame {
  const c = coverFrame(W, H);
  if (isWide()) {
    const R = SHELF.region;
    const k = Math.min(c.k, (W * 0.96) / R.w, (H - hh - 14) / R.h);
    return { k, left: Math.round(W / 2 - (R.x + R.w / 2) * k), top: Math.round(hh + (H - hh - R.h * k) / 2 - R.y * k), maxPan: 0 };
  }
  const x0 = SHELF.edges[0] - 24, x1 = SHELF.edges[SHELF.edges.length - 1] + 24;
  const y0 = SHELF.top - 18, y1 = SHELF.bottom + 18;
  const avail = H - hh - NARROW_UI - 16;
  const k = Math.min(c.k, avail / (y1 - y0), 0.62);
  const maxPan = Math.max(0, ((x1 - x0) * k - (W - 24)) / 2);
  return {
    k, maxPan,
    left: Math.round(W / 2 - ((x0 + x1) / 2) * k + clampPan(pan, maxPan)),
    top: Math.round(hh + 8 + (avail - (y1 - y0) * k) / 2 - y0 * k),
  };
}

/** photo-wall stop: desktop = cover; phone = the whole frame tall enough to tap, pan sideways */
export function wallFrame(W: number, H: number, hh = headerHeight(), pan = 0): Frame {
  const c = coverFrame(W, H);
  if (isWide()) return { ...c, maxPan: 0 };
  const avail = H - hh - 250;
  const k = Math.min(c.k, avail / 1080);
  const maxPan = Math.max(0, (1920 * k - W) / 2);
  return { k, maxPan, left: Math.round(W / 2 - 960 * k + clampPan(pan, maxPan)), top: Math.round(hh + (avail - 1080 * k) / 2) };
}

export const lerpFrame = (a: Frame, b: Frame, e: number): Frame => ({
  k: a.k + (b.k - a.k) * e, left: a.left + (b.left - a.left) * e, top: a.top + (b.top - a.top) * e,
});

/** critically damped follow (the classic SmoothDamp): x glides to `to` in about `time` seconds and never overshoots;
 *  v is the velocity, carried from frame to frame; maxSpeed caps how fast it may go. Returns [x, v]. */
export function damp(x: number, to: number, v: number, time: number, dt: number, maxSpeed = Infinity): [number, number] {
  if (dt <= 0) return [x, v];
  time = Math.max(1e-4, time);
  const w = 2 / time, a = w * dt, e = 1 / (1 + a + 0.48 * a * a + 0.235 * a * a * a);
  const lim = maxSpeed * time, ch = Math.max(-lim, Math.min(lim, x - to)), goal = x - ch, tmp = (v + w * ch) * dt;
  let nv = (v - w * tmp) * e, nx = goal + (ch + tmp) * e;
  if ((to - x > 0) === (nx > to)) { nx = to; nv = 0; }
  return [nx, nv];
}

/** horizontal drag on an element → pan value in window[key]; vertical scrolling stays native */
export function attachPan(el: HTMLElement, key: string, getMax: () => number) {
  const W_ = window as any;
  W_[key] = W_[key] ?? 0;
  let sx = 0, sy = 0, p0 = 0, dragging = false, decided = false, moved = false;
  el.style.touchAction = 'pan-y';
  el.addEventListener('pointerdown', (e) => { if (e.pointerType === 'mouse') return; sx = e.clientX; sy = e.clientY; p0 = W_[key]; dragging = true; decided = false; moved = false; });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (!decided && Math.abs(dx) + Math.abs(dy) > 8) { decided = true; if (Math.abs(dy) > Math.abs(dx)) { dragging = false; return; } }
    if (decided) { moved = true; const m = getMax(); W_[key] = Math.max(-m, Math.min(m, p0 + dx)); }
  });
  const end = () => { dragging = false; };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  // a drag must not count as a tap on whatever is under the finger
  el.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
}

/** one gentle sideways "peek" so visitors see there is more to the left and right; stops as soon as they touch */
export function peek(key: string, getMax: () => number, el: HTMLElement) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const W_ = window as any;
  let stop = false;
  const cancel = () => { stop = true; };
  el.addEventListener('pointerdown', cancel, { once: true });
  const p0 = W_[key] ?? 0, dur = 2400;
  let t0 = 0;
  const keys = [0, -0.55, 0.55, 0];
  const step = (t: number) => {
    if (stop) return;
    if (!t0) t0 = t;
    const m = getMax();
    const k = Math.min(1, (t - t0) / dur) * (keys.length - 1), i = Math.min(keys.length - 2, Math.floor(k)), f = k - i;
    const e = f < .5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
    W_[key] = Math.max(-m, Math.min(m, p0 + (keys[i] + (keys[i + 1] - keys[i]) * e) * m));
    if (k < keys.length - 1) requestAnimationFrame(step);
  };
  setTimeout(() => requestAnimationFrame(step), 700);
}

/** house stops (see src/data/house.ts): desktop keeps `region` below the menu, phone centres on the stop's focus.
 *  A stop component can take over its framing (e.g. the wall zooming to one picture) via window.__stopFrame[id]. */
export function stopFrame(s: HouseStop, W: number, H: number, hh = headerHeight(), pan = 0): Frame {
  const o = (window as any).__stopFrame?.[s.id];
  if (o) { const f = o(W, H, hh); if (f) return f; }
  const c = coverFrame(W, H);
  const bound = (k: number, cx: number, cy: number, top0: number, availH: number): Frame => {
    const iw = 1920 * k, ih = 1080 * k;
    let left = W / 2 - cx * k + pan, top = top0 + availH / 2 - cy * k;
    // where the picture is bigger than the screen, never show an edge; where smaller, centre it (the blurred fill shows around)
    left = iw >= W ? Math.max(W - iw, Math.min(0, left)) : (W - iw) / 2;
    if (ih >= H) top = Math.max(H - ih, Math.min(0, top));
    return { k, left: Math.round(left), top: Math.round(top), maxPan: Math.max(0, (iw - W) / 2) };
  };
  if (isWide()) {
    const R = s.region;
    if (R.w >= 1920 && R.h >= 1080) return bound(c.k, 960, 540, 0, H);   // a full scene: simply fill the screen
    const k = Math.min(c.k, (W * 0.96) / R.w, (H - hh - 14) / R.h);
    return bound(k, R.x + R.w / 2, R.y + R.h / 2, hh, H - hh);
  }
  const P = s.phone;
  const k = P.h >= 1080 ? c.k : Math.min(c.k * 1.6, (H - hh - P.ui - 16) / P.h);
  return bound(k, P.cx, P.cy, P.h >= 1080 ? 0 : hh + 8, P.h >= 1080 ? H : H - hh - P.ui - 16);
}
