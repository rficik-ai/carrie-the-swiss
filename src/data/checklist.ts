// The lead magnet: "10 questions for the breeder" (/[lang]/checklist/ and a PDF per language), sent in the welcome
// e-mail after a visitor confirms the newsletter. Content = episode 10 (v3) and its fact-checked IG caption.
// Registers as on the site: sk, cs, fr, uk formal; de, pl, it, es, hu, nl informal.
import type { Locale } from '../i18n';

export interface ChecklistCopy {
  link: string;       // name of the cheat sheet in links and e-mails
  meta: string;
  title: string;
  subtitle: string;
  intro: string;
  parts: { h: string; qs: { q: string; why: string }[] }[];   // 4 + 4 + 2 questions, numbered across the parts
  twist: { h: string; p: string };
  flags: { h: string; items: string[] };
  outro: string;
  sources_h: string;
  sources: string;
  print: string;
  pdf: string;
  note: string;
}

export const CHECKLIST: Partial<Record<Locale, ChecklistCopy>> = {
  sk: {
    link: 'Ťahák: 10 otázok pre chovateľa',
    meta: 'Desať otázok pre chovateľa, kým poviete áno šteňaťu. Ťahák na vytlačenie od Carrie the Swiss.',
    title: '10 otázok pre chovateľa',
    subtitle: 'Kým poviete áno šteňaťu.',
    intro: 'Dobrý chovateľ tieto otázky miluje. Zlý ich neznáša. Vytlačte si ich, zoberte so sebou a odškrtávajte.',
    parts: [
      { h: 'Rodičia', qs: [
        { q: 'Môžem vidieť mamu?', why: 'U chovateľa doma, so šteniatkami. „Dnes tu nie je“ je varovný signál.' },
        { q: 'Majú oba rodičia zdravotné vyšetrenia?', why: 'Oficiálne röntgeny bedier (DBK/HD, stupne A – E), lakťov (DLK/ED, 0 – 3) a pliec (OCD), hodnotené špecialistom klubu, ideálne aj oči. Pýtajte si papiere. Moje: bedrá A, lakte 0, plecia čisté.' },
        { q: 'Prečo práve títo dvaja a nakoľko sú príbuzní?', why: 'Ukáže to koeficient príbuzenskej plemenitby (COI): šteňatá polosúrodencov = 12,5 %. Na úrovni priemeru plemena alebo pod ním, čo najnižší.' },
        { q: 'Ako dlho žili starí rodičia a čím boli chorí?', why: 'Niektoré problémy, napríklad epilepsia (často od 2 – 3 rokov), na röntgene neuvidíte.' },
      ] },
      { h: 'Šteňa', qs: [
        { q: 'Je vrh zapísaný v chovateľskom klube?', why: 'Preukaz pôvodu je z oficiálnej plemennej knihy (FCI, na Slovensku SPKP); názov chovateľskej stanice si overíte v adresári FCI. Na Slovensku musí byť každý, kto predáva šteňatá, registrovaný na regionálnej veterinárnej a potravinovej správe (RVPS).' },
        { q: 'Koľko týždňov bude mať šteňa, keď pôjde domov?', why: 'Môj klub: najmenej 7 týždňov. Veterinári z Cornellu: 8 – 12 týždňov. Tie týždne s mamou a súrodencami ho naučia jemne hrýzť a psie spôsoby.' },
        { q: 'Čo už je vybavené?', why: 'Čip zapísaný v Centrálnom registri spoločenských zvierat, prvé očkovanie, najmenej 2 odčervenia. Besnota (od 12 týždňov) a preočkovania prídu neskôr u vášho veterinára.' },
        { q: 'Ako šteňatá vyrastali?', why: 'Najdôležitejšie sú prvé 3 mesiace: návštevy, zvuky, jazda autom, rušná domácnosť. Nie zadná miestnosť.' },
      ] },
      { h: 'Keď poviete áno', qs: [
        { q: 'Bude písomná zmluva?', why: 'Cena, zdravie, preukaz pôvodu a sľub, že psa zoberie späť v akomkoľvek veku.' },
        { q: 'Môžem vám neskôr zavolať?', why: 'Dobrí chovatelia odpovedajú roky.' },
      ] },
    ],
    twist: { h: 'Háčik', p: 'Dobrý chovateľ sa bude pýtať aj vás: na váš domov, čas a plány. Ak sa vás nikto na nič nepýta, aj to je odpoveď.' },
    flags: { h: 'Varovné signály', items: ['Šteňatá sú stále k dispozícii', 'Veľa plemien naraz', 'Odovzdanie na benzínke', 'Záloha skôr, ako ste boli na návšteve'] },
    outro: 'Desať otázok. Pár trápnych minút. Desať rokov spolu.',
    sources_h: 'Zdroje',
    sources: 'ŠVPS SR (kúpa šteňaťa, čipovanie a registrácia), chovateľský poriadok slovenského klubu švajčiarskych salašníckych psov, Royal Kennel Club, AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Vytlačiť alebo uložiť ako PDF',
    pdf: 'Stiahnuť PDF',
    note: 'Len vzdelávací obsah. O svojom psovi sa poraďte s veterinárom a chovateľským klubom.',
  },
  en: {
    link: 'Cheat sheet: 10 questions for the breeder',
    meta: 'Ten questions to ask a breeder before you say yes to a puppy. A printable cheat sheet from Carrie the Swiss.',
    title: '10 questions for the breeder',
    subtitle: 'Before you say yes to a puppy.',
    intro: 'A good breeder loves these questions. A bad one hates them. Print them, take them along, tick as you go.',
    parts: [
      { h: 'The parents', qs: [
        { q: 'Can I meet the mom?', why: 'At the breeder\'s home, with her puppies. "Not here today" is a red flag.' },
        { q: 'Are both parents health tested?', why: 'Official X-rays of hips (HD, graded A–E), elbows (ED, 0–3) and shoulders (OCD), graded by the club\'s specialist, ideally eyes too. Ask to see the papers. Mine: hips A, elbows 0, shoulders clear.' },
        { q: 'Why these two, and how related are they?', why: 'The inbreeding coefficient (COI) shows it: puppies from half-siblings = 12.5%. At or below the breed average, as low as possible.' },
        { q: 'How long did the grandparents live, and what were they sick with?', why: 'Some problems, such as epilepsy (often starting at 2–3 years), don\'t show on any X-ray.' },
      ] },
      { h: 'The puppy', qs: [
        { q: 'Is the litter registered with the breed club?', why: 'A pedigree comes from the official studbook (FCI); kennel names can be checked in the FCI directory. In Slovakia, anyone selling puppies must be registered with the regional veterinary office (RVPS).' },
        { q: 'How old will the puppy be when it goes home?', why: 'My club: at least 7 weeks. Cornell vets: 8–12 weeks. Those weeks with mom and siblings teach bite control and dog manners.' },
        { q: 'What\'s already done?', why: 'Microchip entered in the national pet register, first vaccination, at least 2 dewormings. Rabies (from 12 weeks) and boosters come later with your vet.' },
        { q: 'How were the puppies raised?', why: 'The first 3 months matter most: visitors, noises, car rides, a busy home. Not a back room.' },
      ] },
      { h: 'After you say yes', qs: [
        { q: 'Is there a written contract?', why: 'Price, health, pedigree, and a promise to take the dog back at any age.' },
        { q: 'Can I call you later?', why: 'Good breeders answer for years.' },
      ] },
    ],
    twist: { h: 'The twist', p: 'A good breeder will question you too: your home, your time, your plans. If nobody asks you anything, that\'s your answer.' },
    flags: { h: 'Red flags', items: ['Puppies always available', 'Many breeds at once', 'Handover at a gas station', 'A deposit before you\'ve visited'] },
    outro: 'Ten questions. A few awkward minutes. Ten years together.',
    sources_h: 'Sources',
    sources: 'ŠVPS SR (buying a puppy, microchip and registration), Slovak Swiss Mountain Dog club breeding rules, Royal Kennel Club, AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Print or save as PDF',
    pdf: 'Download PDF',
    note: 'Educational content only. Ask your vet and your breed club about your own dog.',
  },
};
