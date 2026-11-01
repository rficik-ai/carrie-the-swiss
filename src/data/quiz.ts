// "Is a Swissy right for you?" — the garden quiz (house walk). Ten questions, six areas.
// Every answer gives 0–3 points to one area; some answers also raise a warning (a likely deal-breaker).
// The thresholds are indicative: they summarise general large-breed / Swissy knowledge, they don't replace
// meeting adult Swissies and talking to several breeders.
export type Dim = 'space' | 'time' | 'skill' | 'money' | 'care' | 'life';
export type Opt = { p: number; flag?: string; t: Record<string, string> };
export type Q = { id: string; dim: Dim; t: Record<string, string>; why: Record<string, string>; opts: Opt[] };

export const DIMS: { id: Dim; t: Record<string, string>; m: Record<string, string> }[] = [
  { id: 'space', t: { sk: 'Priestor', en: 'Space' }, m: {
    sk: 'Dospelý swissy váži zhruba 40 až 60 kg. Zmestí sa aj do bytu, ale schody bez výťahu, šmykľavé podlahy a žiadny kúsok zelene blízko domu sú pri veľkom psovi (a pri šteniatku, ktoré ešte nemá chodiť veľa po schodoch) skutočný problém.',
    en: 'An adult Swissy weighs roughly 40 to 60 kg. A flat can work, but stairs without a lift, slippery floors and no green space nearby are a real problem with a big dog (and with a puppy that shouldn\'t climb many stairs yet).' } },
  { id: 'time', t: { sk: 'Čas a pohyb', en: 'Time and exercise' }, m: {
    sk: 'Swissy potrebuje každý deň prechádzky, hru a trochu práce pre hlavu, za každého počasia. A je to rodinný pes: dlhé hodiny osamote znáša zle.',
    en: 'A Swissy needs walks, play and some brain work every day, in any weather. And it is a family dog: long hours alone are hard on it.' } },
  { id: 'skill', t: { sk: 'Výcvik a sila', en: 'Training and strength' }, m: {
    sk: 'Je to silný pracovný pes s vlastnou hlavou. Výcvik od šteňaťa (socializácia, chôdza na vôdzke) nie je bonus, ale nutnosť, a venčiť ho musí niekto, kto ho udrží.',
    en: 'It is a strong working dog with a mind of its own. Training from puppyhood (socialisation, loose-lead walking) is not a bonus but a must, and whoever walks it must be able to hold it.' } },
  { id: 'money', t: { sk: 'Financie', en: 'Money' }, m: {
    sk: 'Veľký pes zje veľa: ja dostávam asi 600 g kvalitných granúl denne a 12 kg vrece stojí okolo 40 €, takže len krmivo vychádza zhruba na 60 € mesačne. Veterinár, lieky, odčervenie aj výbava stoja podľa váhy a pri plemene so sklonom k torzii žalúdka treba mať rezervu aj na neplánovaný zákrok.',
    en: 'A big dog eats a lot: I get about 600 g of good kibble a day and a 12 kg bag costs around €40, so food alone comes to roughly €60 a month. Vets, medicine, worming and gear are priced by weight, and with a breed prone to bloat you need savings for an unplanned emergency too.' } },
  { id: 'care', t: { sk: 'Starostlivosť', en: 'Care' }, m: {
    sk: 'Krátka, ale hustá srsť sezónne poriadne pĺzne. A šteňa veľkého plemena rastie pomaly: v duši je to šteniatko asi tri roky.',
    en: 'The short but dense coat sheds hard in season. And a large-breed puppy grows slowly: at heart it stays a puppy for about three years.' } },
  { id: 'life', t: { sk: 'Život a plány', en: 'Life and plans' }, m: {
    sk: 'Pes je rozhodnutie zhruba na desať rokov. Stabilné bývanie, jasno v tom, kto sa postará pri cestovaní, a vedomie, že veľké plemená žijú kratšie a môžu mať zdravotné problémy.',
    en: 'A dog is a decision for roughly ten years. Stable housing, a plan for who helps when you travel, and knowing that big breeds live shorter lives and can have health problems.' } },
];

const o = (p: number, sk: string, en: string, flag?: string): Opt => ({ p, flag, t: { sk, en } });

export const QUESTIONS: Q[] = [
  { id: 'q1', dim: 'space', t: { sk: 'Kde bude pes bývať?', en: 'Where will the dog live?' }, why: { sk: 'Priestor a schody.', en: 'Space and stairs.' }, opts: [
    o(0, 'Byt vyššie, bez výťahu', 'Upstairs flat, no lift', 'stairs'),
    o(1, 'Byt s výťahom, park neďaleko', 'Flat with a lift, a park nearby'),
    o(2, 'Dom s menšou záhradou', 'House with a small garden'),
    o(3, 'Dom s veľkou oplotenou záhradou', 'House with a big fenced garden'),
  ] },
  { id: 'q2', dim: 'time', t: { sk: 'Koľko času denne s ním strávite vonku?', en: 'How much time a day will you spend outside with it?' }, why: { sk: 'Denný pohyb.', en: 'Daily exercise.' }, opts: [
    o(0, 'Menej ako hodinu', 'Less than an hour', 'exercise'),
    o(1, 'Hodinu, keď je pekne', 'An hour when the weather is nice'),
    o(2, 'Jednu až dve hodiny, každý deň', 'One to two hours, every day'),
    o(3, 'Dve hodiny a viac, za každého počasia', 'Two hours or more, in any weather'),
  ] },
  { id: 'q3', dim: 'time', t: { sk: 'Koľko hodín denne by bol pes sám doma?', en: 'How many hours a day would the dog be home alone?' }, why: { sk: 'Samota.', en: 'Time alone.' }, opts: [
    o(0, 'Viac ako 8 hodín', 'More than 8 hours', 'alone'),
    o(1, '5 až 8 hodín', '5 to 8 hours'),
    o(2, '2 až 4 hodiny', '2 to 4 hours'),
    o(3, 'Takmer nikdy, niekto je stále doma', 'Hardly ever, someone is usually home'),
  ] },
  { id: 'q4', dim: 'skill', t: { sk: 'Aké máte skúsenosti so psami?', en: 'What experience do you have with dogs?' }, why: { sk: 'Skúsenosti.', en: 'Experience.' }, opts: [
    o(1, 'Bol by to môj prvý pes', 'It would be my first dog'),
    o(2, 'Mal(a) som malého alebo stredného psa', 'I\'ve had a small or medium dog'),
    o(3, 'Mal(a) som veľké alebo pracovné plemeno', 'I\'ve had a large or working breed'),
  ] },
  { id: 'q5', dim: 'skill', t: { sk: 'Budete s ním chodiť na výcvik?', en: 'Will you go to training classes with it?' }, why: { sk: 'Výcvik.', en: 'Training.' }, opts: [
    o(0, 'Nie, naučí sa to sám', 'No, it will figure it out', 'training'),
    o(1, 'Možno, ak bude čas', 'Maybe, if there\'s time'),
    o(3, 'Áno, aspoň celý prvý rok', 'Yes, at least the whole first year'),
  ] },
  { id: 'q6', dim: 'skill', t: { sk: 'Kto ho bude najčastejšie venčiť?', en: 'Who will walk it most of the time?' }, why: { sk: 'Sila na vôdzke.', en: 'Strength on the lead.' }, opts: [
    o(0, 'Deti alebo niekto drobnej postavy', 'Children, or someone slight', 'strength'),
    o(2, 'Rôzni členovia rodiny', 'Different family members'),
    o(3, 'Dospelý, ktorý ho udrží a bude ho učiť chodiť na vôdzke', 'An adult who can hold it and will teach loose-lead walking'),
  ] },
  { id: 'q7', dim: 'money', t: { sk: 'Koľko môžete mesačne dať na psa (krmivo, veterinár, poistenie, výbava)?', en: 'How much can you spend on the dog a month (food, vet, insurance, gear)?' }, why: { sk: 'Rozpočet.', en: 'Budget.' }, opts: [
    o(0, 'Do 60 € (to je len krmivo)', 'Up to €60 (that\'s just food)', 'money'),
    o(1, '60 až 100 €', '€60 to €100'),
    o(2, '100 až 150 €', '€100 to €150'),
    o(3, 'Viac, plus rezerva na nečakaného veterinára', 'More, plus savings for an unexpected vet bill'),
  ] },
  { id: 'q8', dim: 'care', t: { sk: 'Ako ste na tom so psími chlpmi?', en: 'How do you feel about dog hair?' }, why: { sk: 'Pĺznutie.', en: 'Shedding.' }, opts: [
    o(0, 'Doma ich nechcem', 'I don\'t want them at home', 'shedding'),
    o(2, 'Zvládnem, mám vysávač', 'Fine, I own a vacuum'),
    o(3, 'Chlpy sú len korenie', 'Dog hair is just seasoning'),
  ] },
  { id: 'q9', dim: 'care', t: { sk: 'Swissy dospieva pomaly, asi tri roky je v duši šteňa. Trpezlivosť?', en: 'A Swissy matures slowly, a puppy at heart for about three years. Patience?' }, why: { sk: 'Trpezlivosť.', en: 'Patience.' }, opts: [
    o(0, 'Nie veľmi, chcem rýchlo poslušného psa', 'Not really, I want an obedient dog fast', 'patience'),
    o(2, 'Skúsim to', 'I\'ll try'),
    o(3, 'Trpezlivosť je moje druhé meno', 'Patience is my middle name'),
  ] },
  { id: 'q10', dim: 'life', t: { sk: 'Ako vyzerá vašich najbližších desať rokov?', en: 'What do your next ten years look like?' }, why: { sk: 'Dlhodobé plány.', en: 'Long-term plans.' }, opts: [
    o(0, 'Veľa cestujem a neviem, kde budem bývať', 'I travel a lot and don\'t know where I\'ll live', 'plans'),
    o(1, 'Môže sa veľa zmeniť, uvidíme', 'A lot could change, we\'ll see'),
    o(3, 'Stabilne, a viem, kto pomôže, keď odcestujem', 'Settled, and I know who helps when I travel'),
  ] },
];

// warnings shown in the result (and sent to the AI evaluation)
export const FLAGS: Record<string, Record<string, string>> = {
  stairs: { sk: 'Schody bez výťahu: šteňa po nich nemá veľa chodiť a dospelého 50 kg psa nevynesiete.', en: 'Stairs without a lift: a puppy shouldn\'t climb many, and you can\'t carry a 50 kg adult.' },
  exercise: { sk: 'Menej ako hodina pohybu denne je pre swissyho málo.', en: 'Less than an hour of exercise a day is too little for a Swissy.' },
  alone: { sk: 'Viac ako 8 hodín denne osamote: rodinný pes sa nudí a trpí.', en: 'More than 8 hours a day alone: a family dog gets bored and unhappy.' },
  training: { sk: 'Bez výcviku vyrastie zo šteniatka silný pes, ktorý si robí, čo chce.', en: 'Without training, the puppy grows into a strong dog that does what it likes.' },
  strength: { sk: 'Dieťa ani drobný človek 50 kg psa na vôdzke neudrží.', en: 'A child or a slight person can\'t hold a 50 kg dog on a lead.' },
  money: { sk: 'Do 60 € mesačne pokryje len krmivo (ja zjem asi 600 g granúl denne). Na veterinára, poistenie a výbavu už nezostane nič.', en: 'Up to €60 a month only covers food (I eat about 600 g of kibble a day). Nothing is left for the vet, insurance or gear.' },
  shedding: { sk: 'Swissy pĺzne, hlavne sezónne. Bez chlpov to nepôjde.', en: 'Swissies shed, especially in season. Hair-free isn\'t an option.' },
  patience: { sk: 'Rýchlo poslušný pes to nebude, swissy dospieva roky.', en: 'It won\'t be obedient fast; a Swissy takes years to grow up.' },
  plans: { sk: 'Pes je záväzok na desať rokov. Bez stabilného zázemia je to ťažké pre oboch.', en: 'A dog is a ten-year commitment. Without a settled home it\'s hard on both of you.' },
};

export const UI: Record<string, Record<string, string>> = {
  sk: {
    eyebrow: 'Carrie sa pýta', title: 'Je swissy ten pravý pes pre vás?', intro: 'Desať úprimných otázok v šiestich oblastiach. Na konci uvidíte, kde ste silní, čo by bolo problémom, a ak chcete, vyhodnotím to s vami podrobne.',
    start: 'Poďme na to', q: 'Otázka', back: 'Späť', method: 'Ako to počítame?', method_title: 'Metodika', method_intro: 'Každá odpoveď dá 0 až 3 body jednej zo šiestich oblastí. Niektoré odpovede zároveň zapnú upozornenie, ktoré býva pri swissym vážnou prekážkou. Hranice sú orientačné: zhŕňajú všeobecné znalosti o veľkých plemenách a o swissy, nenahradia stretnutie s dospelými psami ani rozhovor s viacerými chovateľmi.',
    method_score: 'Celkové skóre = súčet bodov / maximum. Pod 50 % alebo s dvoma a viac upozorneniami: radšej nie. 50 až 75 %: môže to fungovať s plánom. Nad 75 % bez vážnych upozornení: možno ste presne môj typ človeka.',
    result: 'Váš výsledok', areas: 'Podľa oblastí', warn: 'Na čo myslieť', ai: 'Vyhodnoť ma, Carrie', ai_sub: 'Prečo áno, prečo nie a čo zmeniť. Napíšem vám to na mieru.', ai_wait: 'Carrie premýšľa…', ai_err: 'Teraz to nevyšlo, skúste o chvíľu.', ai_note: 'Odpoveď generuje AI z vašich odpovedí a z toho, čo viem o svojom plemene. Nie je to rada chovateľa ani veterinára.',
    again: 'Skúsiť znova', watch: 'Začnite epizódou 01', close: 'Zavrieť',
    r1: 'Možno nie swissy. A to je v poriadku.', r2: 'Môže to fungovať, s plánom.', r3: 'Možno ste presne môj typ človeka.',
  },
  en: {
    eyebrow: 'Carrie asks', title: 'Is a Swissy the right dog for you?', intro: 'Ten honest questions across six areas. At the end you\'ll see where you\'re strong, what could be a problem and, if you like, I\'ll go through it with you in detail.',
    start: 'Let\'s go', q: 'Question', back: 'Back', method: 'How is this scored?', method_title: 'Method', method_intro: 'Every answer gives 0 to 3 points to one of six areas. Some answers also switch on a warning that is often a serious obstacle with a Swissy. The thresholds are indicative: they summarise general knowledge about big breeds and Swissies, and they don\'t replace meeting adult dogs or talking to several breeders.',
    method_score: 'Overall score = points / maximum. Under 50 %, or two or more warnings: better not. 50 to 75 %: it could work, with a plan. Over 75 % with no serious warnings: you might be exactly my kind of human.',
    result: 'Your result', areas: 'By area', warn: 'Things to think about', ai: 'Evaluate me, Carrie', ai_sub: 'Why yes, why not and what to change. Written just for you.', ai_wait: 'Carrie is thinking…', ai_err: 'That didn\'t work just now, try again in a moment.', ai_note: 'Generated by AI from your answers and what I know about my breed. Not advice from a breeder or a vet.',
    again: 'Try again', watch: 'Start with episode 01', close: 'Close',
    r1: 'Maybe not a Swissy. And that\'s okay.', r2: 'It could work, with a plan.', r3: 'You might be exactly my kind of human.',
  },
};
