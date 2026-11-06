// Season 1. Titles stay in English (the reels are in English).
// `date` = planned Instagram release (YYYY-MM-DD); status is computed in the browser.
export type Episode = {
  n: string;
  title: string;
  topic: 'intro' | 'pedigrees' | 'health' | 'shows' | 'history' | 'genetics' | 'breeding' | 'buying' | 'ownership';
  date: string | null;
  parts?: string[];
  image?: string; // /assets/ep/epXX.jpg once covers are added
  yt?: string[]; // YouTube video IDs (one per part)
  mp4?: string[]; // until a part is on YouTube: the finished file itself (Higgsfield CDN), one per part
  partDates?: string[]; // release day of each part (a part plays only from that day)
};
export const CDN = 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FPAK2UslvAxxYzOCjOXqZRN8Bf/';

export const YOUTUBE = 'https://www.youtube.com/@carrietheswiss';
export const INSTAGRAM = 'https://www.instagram.com/carrietheswiss/';

export const EPISODES: Episode[] = [
  { n: '01', yt: ['X3Jk2eiYhIY'], title: "Hi, I'm Carrie", image: '/assets/ep/ep01.jpg', topic: 'intro', date: '2026-10-05' },
  { n: '02', yt: ['Yvk1WvQdryU'], title: 'What is FCI?', image: '/assets/ep/ep02.jpg', topic: 'pedigrees', date: '2026-10-06' },
  { n: '03', yt: ['QkrWGUTaPgA'], title: 'Pedigree ≠ the whole story', image: '/assets/ep/ep03.jpg', topic: 'pedigrees', date: '2026-10-07' },
  { n: '04', yt: ['HMryprY6Hxc'], title: 'Health tests decoded', image: '/assets/ep/ep04.jpg', topic: 'health', date: '2026-10-09' },
  { n: '05', yt: ['5gqIdcRQu4U'], title: 'Inside the show ring', image: '/assets/ep/ep05.jpg', topic: 'shows', date: '2026-10-12' },
  { n: '06', yt: ['_4M-m_QHh6o'], title: 'The show that saved my breed', image: '/assets/ep/ep06.jpg', topic: 'history', date: '2026-10-14' },
  { n: '07', yt: ['I5Ef4M4tZhA'], title: 'My three colours', image: '/assets/ep/ep07.jpg', topic: 'genetics', date: '2026-10-16' },
  { n: '08', yt: ['afU-00GUDLI'], title: 'A responsible litter', image: '/assets/ep/ep08.jpg', topic: 'breeding', date: '2026-10-19' },
  { n: '09', yt: ['xX_iClvxNFE', 'mia5S8l_G1E', '9hbxDt4QBtk'], title: "Why a good puppy isn't cheap", image: '/assets/ep/ep09.jpg', topic: 'buying', date: '2026-10-21', parts: ['The mom', 'One litter', 'My whole life'] },
  { n: '10', yt: ['pURD5ug_J28', 'T-BRePEW01U', 'RNasucpPOK0'], partDates: ['2026-11-04', '2026-11-06', '2026-11-06'], title: 'What to ask a breeder', image: '/assets/ep/ep10.jpg', topic: 'buying', date: '2026-11-04', parts: ['The parents', 'The puppy', 'After you say yes'] },
  { n: '11', yt: ['_pEpgKw0TfM'], partDates: ['2026-11-06'], title: 'My breed evaluation', image: '/assets/ep/ep11.jpg', topic: 'breeding', date: '2026-11-06' },
  { n: '12', title: 'Is a Swissy right for you?', topic: 'ownership', date: null },
];
