// The wall of my life (house walk, stop 1): ten frames on the hallway wall, each one chapter.
// `r` = the inside of the frame in the 1920x1080 still; `cover` = what hangs in the frame;
// `pics` = what the story card shows (photos and redacted papers). Order of WALL = chronological (card navigation).
import type { Rect } from './house';
export type WallPic = { src: string; kind: 'photo' | 'doc'; w: number; h: number };
export type WallItem = { id: string; date: string; r: Rect; cover: string; pos?: string; pics: WallPic[]; link?: { href: string; key: string; ep?: string } };

const A = '/assets/album/', I = '/assets/img/';
const R = (x0: number, y0: number, x1: number, y1: number): Rect => ({ x: x0, y: y0, w: x1 - x0, h: y1 - y0 });

export const WALL: WallItem[] = [
  { id: 'w1', date: '28. 3. 2025', r: R(362, 77, 522, 296), cover: A + 'ig-puppy.jpg', pos: '50% 40%', pics: [{ src: A + 'ig-puppy.jpg', kind: 'photo', w: 1080, h: 1350 }] },
  { id: 'w2', date: '27. 9. 2025', r: R(718, 85, 1027, 223), cover: A + 'ig-show-2025.jpg', pos: '50% 55%', pics: [{ src: A + 'ig-show-2025.jpg', kind: 'photo', w: 680, h: 430 }, { src: A + 'doc-2025-09.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'w3', date: '11 / 2025', r: R(1158, 83, 1318, 294), cover: A + 'p-2025-11.jpg', pos: '50% 35%', pics: [{ src: A + 'p-2025-11.jpg', kind: 'photo', w: 619, h: 1100 }, { src: A + 'p-2025-12a.jpg', kind: 'photo', w: 825, h: 1100 }, { src: A + 'p-2025-12b.jpg', kind: 'photo', w: 825, h: 1100 }] },
  { id: 'w4', date: '1 / 2026', r: R(1467, 118, 1579, 258), cover: A + 'ig-snow.jpg', pos: '50% 40%', pics: [{ src: A + 'ig-snow.jpg', kind: 'photo', w: 1100, h: 1218 }, { src: A + 'p-2026-01.jpg', kind: 'photo', w: 825, h: 1100 }] },
  { id: 'w5', date: '30. 5. 2026', r: R(868, 296, 962, 434), cover: A + 'doc-2026-05.jpg', pos: '50% 0%', pics: [{ src: A + 'doc-2026-05.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'w6', date: '23. 8. 2026', r: R(610, 284, 777, 509), cover: A + 'doc-2026-08.jpg', pos: '50% 0%', pics: [{ src: A + 'doc-2026-08.jpg', kind: 'doc', w: 920, h: 1300 }] },
  { id: 'w7', date: '18.–20. 9. 2026', r: R(1020, 412, 1223, 538), cover: A + 'diplom-2026-09-18.jpg', pos: '50% 50%', pics: [{ src: A + 'diplom-2026-09-18.jpg', kind: 'doc', w: 1300, h: 920 }, { src: A + 'doc-2026-09-18.jpg', kind: 'doc', w: 919, h: 1300 }, { src: A + 'doc-2026-09-19.jpg', kind: 'doc', w: 919, h: 1300 }, { src: A + 'doc-2026-09-20.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'w8', date: '2026', r: R(298, 378, 441, 480), cover: I + 'doc-xray.jpg', pos: '50% 62%', pics: [{ src: I + 'doc-xray.jpg', kind: 'photo', w: 800, h: 1000 }], link: { href: 'papers/', key: 'to_papers' } },
  { id: 'w9', date: '2026', r: R(1293, 362, 1445, 456), cover: A + 'ig-profile.jpg', pos: '40% 30%', pics: [{ src: A + 'ig-profile.jpg', kind: 'photo', w: 1080, h: 1000 }], link: { href: '#episodes', key: 'to_ep', ep: '11' } },
  { id: 'w10', date: '', r: R(1536, 336, 1682, 516), cover: I + 'carrie-anim.jpg', pos: '50% 25%', pics: [{ src: I + 'carrie-anim.jpg', kind: 'photo', w: 1000, h: 1250 }, { src: I + 'carrie-real.jpg', kind: 'photo', w: 1000, h: 1250 }], link: { href: '#episodes', key: 'to_episodes' } },
];
