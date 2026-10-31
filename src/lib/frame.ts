// Shared framing for the last frame of the scroll film and the shelf scene (1920x1080 source).
// Both must use exactly the same numbers so the hand-over is pixel-identical.
import { SHELF } from '../data/shelf';
const REGION = SHELF.region; // books + plaques + caption, in source pixels

export function headerHeight() {
  return (document.querySelector('header.top') as HTMLElement | null)?.offsetHeight ?? 68;
}

/** cover placement (what object-fit: cover does) */
export function coverFrame(W: number, H: number) {
  const k = Math.max(W / 1920, H / 1080);
  return { k, left: (W - 1920 * k) / 2, top: (H - 1080 * k) / 2 };
}

/** final placement: the whole shelf region fits below the header, never bigger than cover */
export function fitFrame(W: number, H: number, hh = headerHeight()) {
  const c = coverFrame(W, H);
  const k = Math.min(c.k, (W * 0.96) / REGION.w, (H - hh - 14) / REGION.h);
  const left = W / 2 - (REGION.x + REGION.w / 2) * k;
  const top = hh + (H - hh - REGION.h * k) / 2 - REGION.y * k;
  return { k, left, top };
}
