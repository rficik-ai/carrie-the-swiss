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
  { n: '09', yt: ['xX_iClvxNFE', 'mia5S8l_G1E'], title: "Why a good puppy isn't cheap", image: '/assets/ep/ep09.jpg', topic: 'buying', date: '2026-10-21', parts: ['The mom', 'One litter', 'My whole life'] },
  // Uploaded to YouTube as drafts (6 Nov): EP09 P3 9hbxDt4QBtk · EP10 P1 pURD5ug_J28, P2 T-BRePEW01U, P3 RNasucpPOK0 · EP11 _pEpgKw0TfM.
  // When they are public: EP09 yt gets the P3 id; EP10/EP11 switch from mp4 to yt (keep partDates).
  { n: '10', mp4: [CDN + '8c4bb7f2-0ea7-419b-88f2-70f095285f97.mp4', CDN + 'e4664bc7-f37c-4244-92d4-d818e02311c3.mp4', CDN + 'e5d48c3a-3570-4ecb-ae3e-8d7de6b213dd.mp4'], partDates: ['2026-11-04', '2026-11-06', '2026-11-09'], title: 'What to ask a breeder', image: '/assets/ep/ep10.jpg', topic: 'buying', date: '2026-11-04', parts: ['The parents', 'The puppy', 'After you say yes'] },
  { n: '11', mp4: [CDN + '187f8f03-8449-4b3e-b891-fe8411443c9f.mp4'], partDates: ['2026-11-11'], title: 'My breed evaluation', image: '/assets/ep/ep11.jpg', topic: 'breeding', date: '2026-11-11' },
  { n: '12', title: 'Is a Swissy right for you?', topic: 'ownership', date: null },
];
