// "My life so far": chapters of the album. Text lives in i18n (album.chN_*); here only dates and pictures.
// Documents are redacted copies (no kennel name, registration number, owner or judges).
export type Pic = { src: string; kind: 'photo' | 'doc'; w: number; h: number };
export type Chapter = { id: string; date: string; pics: Pic[]; stamp?: string[]; link?: { href: string; key: string } };

const A = '/assets/album/';
export const ALBUM: Chapter[] = [
  { id: 'c1', date: '28. 3. 2025', pics: [{ src: A + 'ig-puppy.jpg', kind: 'photo', w: 1080, h: 1350 }], stamp: ['28', 'III', '2025'] },
  { id: 'c2', date: '27. 9. 2025', pics: [{ src: A + 'ig-show-2025.jpg', kind: 'photo', w: 680, h: 480 }, { src: A + 'doc-2025-09.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'c3', date: '11–12 / 2025', pics: [{ src: A + 'p-2025-11.jpg', kind: 'photo', w: 619, h: 1100 }, { src: A + 'p-2025-12a.jpg', kind: 'photo', w: 825, h: 1100 }, { src: A + 'p-2025-12b.jpg', kind: 'photo', w: 825, h: 1100 }] },
  { id: 'c4', date: '1 / 2026', pics: [{ src: A + 'p-2026-01.jpg', kind: 'photo', w: 825, h: 1100 }, { src: A + 'ig-snow.jpg', kind: 'photo', w: 1100, h: 1218 }] },
  { id: 'c5', date: '30. 5. 2026', pics: [{ src: A + 'doc-2026-05.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'c6', date: '23. 8. 2026', pics: [{ src: A + 'doc-2026-08.jpg', kind: 'doc', w: 920, h: 1300 }] },
  { id: 'c7', date: '18.–20. 9. 2026', pics: [{ src: A + 'diplom-2026-09-18.jpg', kind: 'doc', w: 1300, h: 920 }, { src: A + 'doc-2026-09-18.jpg', kind: 'doc', w: 919, h: 1300 }, { src: A + 'doc-2026-09-19.jpg', kind: 'doc', w: 919, h: 1300 }, { src: A + 'doc-2026-09-20.jpg', kind: 'doc', w: 919, h: 1300 }] },
  { id: 'c8', date: '2026', pics: [], stamp: ['HD A/A', 'ED 0/0', 'OCD –'], link: { href: 'papers/', key: 'to_papers' } },
  { id: 'c9', date: '2026', pics: [{ src: A + 'ig-profile.jpg', kind: 'photo', w: 1080, h: 1000 }], stamp: ['14', '/ 14', '✓'], link: { href: '#episodes', key: 'to_ep11' } },
  { id: 'c10', date: '', pics: [{ src: '/assets/img/carrie-anim.jpg', kind: 'photo', w: 1000, h: 1250 }], link: { href: '#episodes', key: 'to_episodes' } },
];
