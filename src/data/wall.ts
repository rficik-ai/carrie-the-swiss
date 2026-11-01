// The wall of my life (house walk, stop 1): ten frames on the hallway wall, one chapter each, in time order from left to right.
// Scrolling walks the camera along the wall from the first frame to the last.
// `r` = the inside of the frame in the 1920x1080 still; `cover` = what hangs in the frame;
// `pics` = what the story card shows (photos and redacted papers). Order of WALL = chronological (card navigation).
import type { Rect } from './house';
export type WallPic = { src: string; kind: 'photo' | 'doc'; w: number; h: number };
export type WallItem = { id: string; date: string; short?: string; r: Rect; cover: string; pos?: string; pics: WallPic[]; link?: { href: string; key: string; ep?: string } };

const A = '/assets/album/', I = '/assets/img/', H = '/assets/house/';
const R = (x0: number, y0: number, x1: number, y1: number): Rect => ({ x: x0, y: y0, w: x1 - x0, h: y1 - y0 });

export const WALL: WallItem[] = [
  { id: 'w1', short: '3/25', date: '28. 3. 2025', r: R(298, 378, 441, 480), cover: H + 'wf-w1.jpg', pos: '50% 50%', pics: [{ src: A + 'ig-puppy.jpg', kind: 'photo', w: 1080, h: 1350 }] },
  { id: 'w2', short: '9/25', date: '27. 9. 2025', r: R(362, 77, 522, 296), cover: H + 'wf-w2.jpg', pos: '50% 50%', pics: [{ src: A + 'ig-show-2025.jpg', kind: 'photo', w: 680, h: 480 }, { src: A + 'doc-2025-09.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'w3', short: '11/25', date: '11 / 2025', r: R(610, 284, 777, 509), cover: H + 'wf-w3.jpg', pos: '50% 50%', pics: [{ src: A + 'p-2025-11.jpg', kind: 'photo', w: 619, h: 1100 }, { src: A + 'p-2025-12a.jpg', kind: 'photo', w: 825, h: 1100 }, { src: A + 'p-2025-12b.jpg', kind: 'photo', w: 825, h: 1100 }] },
  { id: 'w4', short: '1/26', date: '1 / 2026', r: R(718, 85, 1027, 223), cover: H + 'wf-w4.jpg', pos: '50% 50%', pics: [{ src: A + 'ig-snowrun.jpg', kind: 'photo', w: 1100, h: 611 }, { src: A + 'ig-snow.jpg', kind: 'photo', w: 1100, h: 1218 }, { src: A + 'p-2026-01.jpg', kind: 'photo', w: 825, h: 1100 }] },
  { id: 'w5', short: '5/26', date: '30. 5. 2026', r: R(868, 296, 962, 434), cover: A + 'doc-2026-05.jpg', pos: '50% 0%', pics: [{ src: A + 'doc-2026-05.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'w6', short: '8/26', date: '23. 8. 2026', r: R(1020, 412, 1223, 538), cover: A + 'doc-2026-08.jpg', pos: '50% 4%', pics: [{ src: A + 'doc-2026-08.jpg', kind: 'doc', w: 920, h: 1300 }] },
  { id: 'w7', short: '9/26', date: '18.–20. 9. 2026', r: R(1158, 83, 1318, 294), cover: A + 'doc-2026-09-18.jpg', pos: '50% 0%', pics: [{ src: A + 'diplom-2026-09-18.jpg', kind: 'doc', w: 1300, h: 920 }, { src: A + 'doc-2026-09-18.jpg', kind: 'doc', w: 919, h: 1300 }, { src: A + 'doc-2026-09-19.jpg', kind: 'doc', w: 919, h: 1300 }, { src: A + 'doc-2026-09-20.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'w8', short: '2026', date: '2026', r: R(1293, 362, 1445, 456), cover: I + 'doc-xray.jpg', pos: '50% 62%', pics: [{ src: I + 'doc-xray.jpg', kind: 'photo', w: 800, h: 1000 }], link: { href: 'papers/', key: 'to_papers' } },
  { id: 'w9', short: '2026', date: '2026', r: R(1467, 118, 1579, 258), cover: H + 'wf-w9.jpg', pos: '50% 50%', pics: [{ src: A + 'ig-profile.jpg', kind: 'photo', w: 1080, h: 1000 }], link: { href: '#episodes', key: 'to_ep', ep: '11' } },
  { id: 'w10', date: '', r: R(1536, 336, 1682, 516), cover: I + 'carrie-anim.jpg', pos: '50% 25%', pics: [{ src: I + 'carrie-anim.jpg', kind: 'photo', w: 1000, h: 1250 }, { src: I + 'carrie-real.jpg', kind: 'photo', w: 1000, h: 1250 }], link: { href: '#episodes', key: 'to_episodes' } },
];
