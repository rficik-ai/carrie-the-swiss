// Shared framing for the scroll film and the interactive stops on top of it (1920x1080 source).
// The film and every overlay must use exactly the same numbers so hand-overs are pixel-identical.
import { SHELF } from '../data/shelf';

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
