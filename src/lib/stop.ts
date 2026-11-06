// Shared plumbing for the interactive stops of the house walk.
// The film engine (Hero) sets window.__stop to the id of the stop the visitor is standing at;
// each stop component runs this loop to show itself and to keep its 1920x1080 layer glued to the picture.
import { STOPS, type HouseStop } from '../data/house';
import { stopFrame, drift, type Frame } from './frame';

const W_ = window as any;

export function mountStop(id: HouseStop['id'], el: HTMLElement, opts: { onFrame?: (f: Frame, live: boolean) => void; onLive?: (live: boolean) => void } = {}) {
  const stage = document.querySelector<HTMLElement>('.scrub .stage');
  if (!stage) return;
  stage.appendChild(el);                       // lives on the frozen picture, inside the sticky stage
  const s = STOPS.find((x) => x.id === id)!;
  const layer = el.querySelector<HTMLElement>('.layer');
  let live = false, last = '';
  const frame = () => drift(stopFrame(s, stage.clientWidth, stage.clientHeight), W_.__drift ?? 1);
  const tick = () => {
    const on = W_.__stop === id;
    if (on !== live) {
      live = on; el.classList.toggle('live', on); el.inert = !on;
      el.querySelectorAll('.rv').forEach((c) => c.classList.toggle('rv-in', on));   // its captions play their entrance
      opts.onLive?.(on);
    }
    if (live || !last) {
      const f = frame();
      const key = `${f.k.toFixed(4)},${f.left},${f.top}`;
      if (key !== last) { last = key; if (layer) layer.style.transform = `translate(${f.left}px, ${f.top}px) scale(${f.k})`; opts.onFrame?.(f, live); }
    }
    requestAnimationFrame(tick);
  };
  el.inert = true;
  requestAnimationFrame(tick);
  return { frame };
}
