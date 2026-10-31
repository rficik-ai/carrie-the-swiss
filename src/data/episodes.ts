// Season 1. Titles stay in English (the reels are in English).
// `date` = planned Instagram release (YYYY-MM-DD); status is computed in the browser.
export type Episode = {
  n: string;
  title: string;
  topic: 'intro' | 'pedigrees' | 'health' | 'shows' | 'history' | 'genetics' | 'breeding' | 'buying' | 'ownership';
  date: string | null;
  parts?: string[];
  image?: string; // /assets/ep/epXX.jpg once covers are added
};

export const INSTAGRAM = 'https://www.instagram.com/carrietheswiss/';

export const EPISODES: Episode[] = [
  { n: '01', title: "Hi, I'm Carrie", topic: 'intro', date: '2026-10-05' },
  { n: '02', title: 'What is FCI?', topic: 'pedigrees', date: '2026-10-06' },
  { n: '03', title: 'Pedigree ≠ the whole story', topic: 'pedigrees', date: '2026-10-07' },
  { n: '04', title: 'Health tests decoded', topic: 'health', date: '2026-10-09' },
  { n: '05', title: 'Inside the show ring', topic: 'shows', date: '2026-10-12' },
  { n: '06', title: 'The show that saved my breed', topic: 'history', date: '2026-10-14' },
  { n: '07', title: 'My three colours', topic: 'genetics', date: '2026-10-16' },
  { n: '08', title: 'A responsible litter', topic: 'breeding', date: '2026-10-19' },
  { n: '09', title: "Why a good puppy isn't cheap", topic: 'buying', date: '2026-10-21', parts: ['The mom', 'One litter', 'My whole life'] },
  { n: '10', title: 'What to ask a breeder', topic: 'buying', date: '2026-10-28', parts: ['The parents', 'The puppy', 'After you say yes'] },
  { n: '11', title: 'My breed evaluation', topic: 'breeding', date: '2026-11-09' },
  { n: '12', title: 'Is a Swissy right for you?', topic: 'ownership', date: null },
];
