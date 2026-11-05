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
        { q: 'Prečo práve títo dvaja a aké COI bude mať vrh?', why: 'COI = koeficient príbuzenskej plemenitby z 5 generácií. Má byť pod 6,25 % (ako bratranci), pri Swissy ideálne pod 2 % ako vo švédskom chove. Od 12,5 % (polosúrodenci) nie. Z viacerých generácií vychádza vyššie číslo.' },
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
    sources: 'ŠVPS SR (kúpa šteňaťa, čipovanie a registrácia), chovateľský poriadok slovenského klubu švajčiarskych salašníckych psov, Royal Kennel Club, švédsky a nórsky kynologický zväz (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
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
        { q: 'Why these two, and what will the litter’s COI be?', why: 'COI = inbreeding coefficient over 5 generations. Under 6.25% (like cousins); for a Swissy ideally under 2%, as in Swedish breeding. 12.5% (half-siblings) or more: no. More generations give a higher number.' },
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
    sources: 'ŠVPS SR (buying a puppy, microchip and registration), Slovak Swiss Mountain Dog club breeding rules, Royal Kennel Club, Swedish and Norwegian Kennel Clubs (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Print or save as PDF',
    pdf: 'Download PDF',
    note: 'Educational content only. Ask your vet and your breed club about your own dog.',
  },
  cs: {
    link: 'Tahák: 10 otázek pro chovatele',
    meta: 'Deset otázek pro chovatele, než řeknete štěněti ano. Tahák k vytištění od Carrie the Swiss.',
    title: '10 otázek pro chovatele',
    subtitle: 'Než řeknete štěněti ano.',
    intro: 'Dobrý chovatel tyhle otázky miluje. Špatný je nesnáší. Vytiskněte si je, vezměte s sebou a odškrtávejte.',
    parts: [
      { h: 'Rodiče', qs: [
        { q: 'Můžu vidět mámu?', why: 'U chovatele doma, se štěňaty. „Dnes tu není“ je varovný signál.' },
        { q: 'Mají oba rodiče zdravotní vyšetření?', why: 'Oficiální rentgeny kyčlí (HD, stupně A–E), loktů (ED, 0–3) a ramen (OCD), hodnocené specialistou klubu, ideálně i oči. Řekněte si o papíry. Moje: kyčle A, lokty 0, ramena bez OCD.' },
        { q: 'Proč právě tihle dva a jaké COI bude mít vrh?', why: 'COI = koeficient příbuzenské plemenitby z 5 generací. Má být pod 6,25 % (jako bratranci), u Swissy ideálně pod 2 % jako ve švédském chovu. Od 12,5 % (polosourozenci) ne. Z více generací vychází vyšší číslo.' },
        { q: 'Jak dlouho žili prarodiče a čím stonali?', why: 'Některé problémy, třeba epilepsii (často od 2–3 let), na žádném rentgenu neuvidíte.' },
      ] },
      { h: 'Štěně', qs: [
        { q: 'Je vrh zapsaný v chovatelském klubu?', why: 'Průkaz původu pochází z oficiální plemenné knihy (FCI); název chovatelské stanice si ověříte v adresáři FCI. Na Slovensku musí být každý, kdo prodává štěňata, registrovaný u regionální veterinární správy (RVPS).' },
        { q: 'Kolik týdnů bude štěněti, až půjde domů?', why: 'Můj klub: nejméně 7 týdnů. Veterináři z Cornellu: 8–12 týdnů. Ty týdny s mámou a sourozenci ho naučí jemně kousat a chovat se mezi psy.' },
        { q: 'Co už má štěně za sebou?', why: 'Čip zapsaný v národním registru zvířat, první očkování, nejméně 2 odčervení. Očkování proti vzteklině (od 12 týdnů) a přeočkování přijdou později u vašeho veterináře.' },
        { q: 'Jak štěňata vyrůstala?', why: 'Nejdůležitější jsou první 3 měsíce: návštěvy, zvuky, jízdy autem, rušná domácnost. Ne v zadní místnosti.' },
      ] },
      { h: 'Když řeknete ano', qs: [
        { q: 'Bude písemná smlouva?', why: 'Cena, zdraví, průkaz původu a slib, že psa vezme zpět v jakémkoli věku.' },
        { q: 'Můžu vám později zavolat?', why: 'Dobří chovatelé odpovídají roky.' },
      ] },
    ],
    twist: { h: 'Háček', p: 'Dobrý chovatel se bude ptát i vás: na váš domov, čas a plány. Pokud se vás nikdo na nic neptá, i to je odpověď.' },
    flags: { h: 'Varovné signály', items: ['Štěňata vždy k dispozici', 'Hodně plemen najednou', 'Předání na benzince', 'Záloha ještě před návštěvou'] },
    outro: 'Deset otázek. Pár trapných minut. Deset let spolu.',
    sources_h: 'Zdroje',
    sources: 'ŠVPS SR (koupě štěněte, čipování a registrace), chovatelský řád slovenského klubu švýcarských salašnických psů, Royal Kennel Club, švédský a norský kynologický svaz (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Vytisknout nebo uložit jako PDF',
    pdf: 'Stáhnout PDF',
    note: 'Pouze vzdělávací obsah. O svém psovi se poraďte s veterinářem a chovatelským klubem.',
  },
  de: {
    link: 'Spickzettel: 10 Fragen an den Züchter',
    meta: 'Zehn Fragen an den Züchter, bevor du Ja zu einem Welpen sagst. Ein Spickzettel zum Ausdrucken von Carrie the Swiss.',
    title: '10 Fragen an den Züchter',
    subtitle: 'Bevor du Ja zu einem Welpen sagst.',
    intro: 'Ein guter Züchter liebt diese Fragen. Ein schlechter hasst sie. Druck sie aus, nimm sie mit und hak sie ab.',
    parts: [
      { h: 'Die Eltern', qs: [
        { q: 'Darf ich die Mutter kennenlernen?', why: 'Beim Züchter zu Hause, mit ihren Welpen. „Heute ist sie nicht da“ ist ein Warnsignal.' },
        { q: 'Sind beide Eltern gesundheitlich untersucht?', why: 'Offizielle Röntgenbilder von Hüften (HD, Grad A–E), Ellbogen (ED, 0–3) und Schultern (OCD), ausgewertet vom Gutachter des Zuchtvereins, idealerweise auch die Augen. Lass dir die Papiere zeigen. Meine: Hüften A, Ellbogen 0, Schultern frei.' },
        { q: 'Warum gerade diese beiden, und welchen COI hat der Wurf?', why: 'COI = Inzuchtkoeffizient über 5 Generationen. Unter 6,25 % (wie bei Cousins), beim Swissy ideal unter 2 %, wie in der schwedischen Zucht. Ab 12,5 % (Halbgeschwister): nein. Über mehr Generationen ergibt sich eine höhere Zahl.' },
        { q: 'Wie alt wurden die Großeltern, und welche Krankheiten hatten sie?', why: 'Manche Probleme, etwa Epilepsie (oft ab 2–3 Jahren), zeigt kein Röntgenbild.' },
      ] },
      { h: 'Der Welpe', qs: [
        { q: 'Ist der Wurf beim Zuchtverein eingetragen?', why: 'Eine Ahnentafel stammt aus dem offiziellen Zuchtbuch (FCI); Zwingernamen kannst du im Verzeichnis der FCI prüfen. In der Slowakei muss jeder, der Welpen verkauft, beim regionalen Veterinäramt (RVPS) registriert sein.' },
        { q: 'Wie alt ist der Welpe, wenn er zu mir kommt?', why: 'Mein Verein: mindestens 7 Wochen. Tierärzte aus Cornell: 8–12 Wochen. Die Wochen mit Mutter und Geschwistern bringen ihm Beißhemmung und Hundemanieren bei.' },
        { q: 'Was ist schon erledigt?', why: 'Mikrochip mit Eintrag im nationalen Heimtierregister, erste Impfung, mindestens 2 Entwurmungen. Die Tollwutimpfung (ab 12 Wochen) und Auffrischungen folgen später in deiner Tierarztpraxis.' },
        { q: 'Wie sind die Welpen aufgewachsen?', why: 'Die ersten 3 Monate zählen am meisten: Besuch, Geräusche, Autofahrten, ein trubeliger Haushalt. Nicht im Hinterzimmer.' },
      ] },
      { h: 'Wenn du Ja sagst', qs: [
        { q: 'Gibt es einen schriftlichen Vertrag?', why: 'Preis, Gesundheit, Ahnentafel und das Versprechen, den Hund in jedem Alter zurückzunehmen.' },
        { q: 'Kann ich später noch anrufen?', why: 'Gute Züchter antworten noch nach Jahren.' },
      ] },
    ],
    twist: { h: 'Der Haken', p: 'Ein guter Züchter fragt auch dich aus: nach deinem Zuhause, deiner Zeit, deinen Plänen. Wenn dich niemand etwas fragt, hast du deine Antwort.' },
    flags: { h: 'Warnsignale', items: ['Immer Welpen verfügbar', 'Viele Rassen auf einmal', 'Übergabe an der Tankstelle', 'Anzahlung vor dem ersten Besuch'] },
    outro: 'Zehn Fragen. Ein paar unangenehme Minuten. Zehn gemeinsame Jahre.',
    sources_h: 'Quellen',
    sources: 'ŠVPS SR (Welpenkauf, Chip und Registrierung), Zuchtordnung des slowakischen Clubs für Schweizer Sennenhunde, Royal Kennel Club, Schwedischer und Norwegischer Kennel Club (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Drucken oder als PDF speichern',
    pdf: 'PDF herunterladen',
    note: 'Nur zu Informationszwecken. Frag bei deinem eigenen Hund deine Tierärztin oder deinen Tierarzt und deinen Zuchtverein.',
  },
  pl: {
    link: 'Ściąga: 10 pytań do hodowcy',
    meta: 'Dziesięć pytań do hodowcy, zanim powiesz „tak” szczeniakowi. Ściąga do wydruku od Carrie the Swiss.',
    title: '10 pytań do hodowcy',
    subtitle: 'Zanim powiesz „tak” szczeniakowi.',
    intro: 'Dobry hodowca uwielbia te pytania. Zły ich nie znosi. Wydrukuj je, zabierz ze sobą i odhaczaj.',
    parts: [
      { h: 'Rodzice', qs: [
        { q: 'Czy mogę zobaczyć mamę?', why: 'W domu hodowcy, razem ze szczeniakami. „Dziś jej nie ma” to sygnał ostrzegawczy.' },
        { q: 'Czy oboje rodziców ma badania zdrowotne?', why: 'Oficjalne prześwietlenia bioder (HD, stopnie A–E), łokci (ED, 0–3) i barków (OCD), ocenione przez specjalistę klubu, najlepiej też oczy. Poproś o papiery. Moje: biodra A, łokcie 0, barki czyste.' },
        { q: 'Dlaczego właśnie te dwa psy i jaki COI będzie miał miot?', why: 'COI = współczynnik inbredu z 5 pokoleń. Poniżej 6,25% (jak u kuzynów), u Swissy najlepiej poniżej 2%, jak w hodowli szwedzkiej. Od 12,5% (przyrodnie rodzeństwo): nie. Z większej liczby pokoleń wychodzi wyższa liczba.' },
        { q: 'Jak długo żyli dziadkowie i na co chorowali?', why: 'Niektórych problemów, np. padaczki (często zaczyna się w wieku 2–3 lat), nie widać na żadnym zdjęciu RTG.' },
      ] },
      { h: 'Szczeniak', qs: [
        { q: 'Czy miot jest zarejestrowany w klubie rasy?', why: 'Rodowód pochodzi z oficjalnej księgi rodowodowej (FCI); przydomek hodowlany sprawdzisz w rejestrze FCI. Na Słowacji każdy, kto sprzedaje szczenięta, musi być zarejestrowany w regionalnym urzędzie weterynaryjnym (RVPS).' },
        { q: 'W jakim wieku szczeniak pojedzie do nowego domu?', why: 'Mój klub: co najmniej 7 tygodni. Weterynarze z Cornella: 8–12 tygodni. Te tygodnie z mamą i rodzeństwem uczą go delikatnego gryzienia i psich manier.' },
        { q: 'Co szczeniak ma już za sobą?', why: 'Chip wpisany do krajowego rejestru zwierząt, pierwsze szczepienie, co najmniej 2 odrobaczenia. Szczepienie na wściekliznę (od 12 tygodni) i dawki przypominające będą później, u twojego weterynarza.' },
        { q: 'Jak wychowywały się szczenięta?', why: 'Najważniejsze są pierwsze 3 miesiące: goście, dźwięki, jazdy autem, gwarny dom. Nie w pokoju na zapleczu.' },
      ] },
      { h: 'Gdy powiesz „tak”', qs: [
        { q: 'Czy będzie pisemna umowa?', why: 'Cena, zdrowie, rodowód i obietnica, że hodowca przyjmie psa z powrotem w każdym wieku.' },
        { q: 'Czy mogę dzwonić później?', why: 'Dobrzy hodowcy odpowiadają latami.' },
      ] },
    ],
    twist: { h: 'Haczyk', p: 'Dobry hodowca też będzie zadawał pytania tobie: o dom, czas i plany. Jeśli nikt cię o nic nie pyta, to też jest odpowiedź.' },
    flags: { h: 'Sygnały ostrzegawcze', items: ['Szczenięta zawsze dostępne', 'Wiele ras naraz', 'Odbiór na stacji benzynowej', 'Zaliczka przed wizytą'] },
    outro: 'Dziesięć pytań. Kilka niezręcznych minut. Dziesięć lat razem.',
    sources_h: 'Źródła',
    sources: 'ŠVPS SR (zakup szczeniaka, czipowanie i rejestracja), regulamin hodowlany słowackiego klubu szwajcarskich psów pasterskich, Royal Kennel Club, szwedzki i norweski związek kynologiczny (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Wydrukuj lub zapisz jako PDF',
    pdf: 'Pobierz PDF',
    note: 'Treści wyłącznie edukacyjne. W sprawie własnego psa zapytaj weterynarza i klub rasy.',
  },
  fr: {
    link: 'Antisèche : 10 questions à poser à l’éleveur',
    meta: 'Dix questions à poser à un éleveur avant de dire oui à un chiot. Une antisèche à imprimer, signée Carrie the Swiss.',
    title: '10 questions à poser à l’éleveur',
    subtitle: 'Avant de dire oui à un chiot.',
    intro: 'Un bon éleveur adore ces questions. Un mauvais les déteste. Imprimez-les, emportez-les et cochez au fur et à mesure.',
    parts: [
      { h: 'Les parents', qs: [
        { q: 'Puis-je voir la mère ?', why: 'Chez l’éleveur, avec ses chiots. « Elle n’est pas là aujourd’hui » est un signal d’alarme.' },
        { q: 'Les deux parents ont-ils passé des tests de santé ?', why: 'Des radios officielles des hanches (HD, notées A–E), des coudes (ED, 0–3) et des épaules (OCD), lues par le spécialiste du club, idéalement aussi les yeux. Demandez à voir les papiers. Mes résultats : hanches A, coudes 0, épaules indemnes.' },
        { q: 'Pourquoi ces deux-là, et quel sera le COI de la portée ?', why: 'COI = coefficient de consanguinité sur 5 générations. Sous 6,25 % (comme des cousins), idéalement sous 2 % chez le Swissy, comme dans l’élevage suédois. À partir de 12,5 % (demi-frère et demi-sœur) : non. Sur plus de générations, le chiffre est plus élevé.' },
        { q: 'Jusqu’à quel âge ont vécu les grands-parents, et de quoi souffraient-ils ?', why: 'Certains problèmes, comme l’épilepsie (souvent à partir de 2–3 ans), ne se voient sur aucune radio.' },
      ] },
      { h: 'Le chiot', qs: [
        { q: 'La portée est-elle inscrite auprès du club de race ?', why: 'Un pedigree provient du livre des origines officiel (FCI) ; les affixes se vérifient dans le répertoire de la FCI. En Slovaquie, toute personne qui vend des chiots doit être enregistrée auprès des services vétérinaires régionaux (RVPS).' },
        { q: 'À quel âge le chiot pourra-t-il venir chez moi ?', why: 'Mon club : au moins 7 semaines. Les vétérinaires de Cornell : 8–12 semaines. Ces semaines avec sa mère et ses frères et sœurs lui apprennent à contrôler sa morsure et à respecter les codes canins.' },
        { q: 'Qu’est-ce qui est déjà fait ?', why: 'Puce enregistrée au fichier national, premier vaccin, au moins 2 vermifugations. Le vaccin contre la rage (dès 12 semaines) et les rappels se feront plus tard, chez votre vétérinaire.' },
        { q: 'Comment les chiots ont-ils été élevés ?', why: 'Les 3 premiers mois comptent le plus : des visites, des bruits, des trajets en voiture, une maison animée. Pas dans une pièce isolée.' },
      ] },
      { h: 'Après votre oui', qs: [
        { q: 'Y aura-t-il un contrat écrit ?', why: 'Le prix, la santé, le pedigree, et la promesse de reprendre le chien à tout âge.' },
        { q: 'Puis-je vous appeler plus tard ?', why: 'Les bons éleveurs répondent pendant des années.' },
      ] },
    ],
    twist: { h: 'Le hic', p: 'Un bon éleveur vous posera aussi des questions : sur votre logement, votre temps, vos projets. Si personne ne vous demande rien, vous avez votre réponse.' },
    flags: { h: 'Signaux d’alarme', items: ['Des chiots toujours disponibles', 'Beaucoup de races à la fois', 'Remise dans une station-service', 'Un acompte avant toute visite'] },
    outro: 'Dix questions. Quelques minutes de gêne. Dix ans ensemble.',
    sources_h: 'Sources',
    sources: 'ŠVPS SR (achat d’un chiot, puce et enregistrement), règlement d’élevage du club slovaque des bouviers suisses, Royal Kennel Club, Kennel clubs suédois et norvégien (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Imprimer ou enregistrer en PDF',
    pdf: 'Télécharger le PDF',
    note: 'Contenu uniquement éducatif. Pour votre propre chien, demandez à votre vétérinaire et à votre club de race.',
  },
  it: {
    link: 'Promemoria: 10 domande da fare all’allevatore',
    meta: 'Dieci domande da fare a un allevatore prima di dire sì a un cucciolo. Un promemoria da stampare di Carrie the Swiss.',
    title: '10 domande da fare all’allevatore',
    subtitle: 'Prima di dire sì a un cucciolo.',
    intro: 'Un buon allevatore adora queste domande. Uno cattivo le odia. Stampale, portale con te e spuntale una a una.',
    parts: [
      { h: 'I genitori', qs: [
        { q: 'Posso vedere la mamma?', why: 'A casa dell’allevatore, con i suoi cuccioli. «Oggi non c’è» è un campanello d’allarme.' },
        { q: 'Entrambi i genitori hanno fatto gli esami sanitari?', why: 'Radiografie ufficiali di anche (HD, gradi A–E), gomiti (ED, 0–3) e spalle (OCD), valutate dallo specialista del club, idealmente anche gli occhi. Chiedi di vedere i documenti. I miei: anche A, gomiti 0, spalle esenti.' },
        { q: 'Perché proprio questi due, e che COI avrà la cucciolata?', why: 'COI = coefficiente di consanguineità su 5 generazioni. Sotto il 6,25% (come tra cugini), per lo Swissy idealmente sotto il 2%, come nell’allevamento svedese. Dal 12,5% (mezzi fratelli) in su: no. Su più generazioni il numero sale.' },
        { q: 'Quanto sono vissuti i nonni, e di cosa si sono ammalati?', why: 'Alcuni problemi, come l’epilessia (che spesso compare a 2–3 anni), non si vedono in nessuna radiografia.' },
      ] },
      { h: 'Il cucciolo', qs: [
        { q: 'La cucciolata è registrata presso il club di razza?', why: 'Il pedigree viene dal libro genealogico ufficiale (FCI); l’affisso si controlla nell’elenco della FCI. In Slovacchia chi vende cuccioli deve essere registrato presso l’ufficio veterinario regionale (RVPS).' },
        { q: 'Quante settimane avrà il cucciolo quando potrà venire a casa?', why: 'Il mio club: almeno 7 settimane. I veterinari della Cornell: 8–12 settimane. Quelle settimane con mamma e fratelli gli insegnano l’inibizione del morso e le buone maniere tra cani.' },
        { q: 'Cosa è già stato fatto?', why: 'Microchip registrato all’anagrafe nazionale, prima vaccinazione, almeno 2 sverminazioni. L’antirabbica (dalle 12 settimane) e i richiami arrivano più tardi, dal tuo veterinario.' },
        { q: 'Come sono cresciuti i cuccioli?', why: 'Contano soprattutto i primi 3 mesi: visite, rumori, giri in macchina, una casa vivace. Non in una stanza sul retro.' },
      ] },
      { h: 'Dopo il tuo sì', qs: [
        { q: 'C’è un contratto scritto?', why: 'Prezzo, salute, pedigree e la promessa di riprendere il cane a qualsiasi età.' },
        { q: 'Posso chiamare anche più avanti?', why: 'I buoni allevatori rispondono per anni.' },
      ] },
    ],
    twist: { h: 'Il colpo di scena', p: 'Un buon allevatore farà domande anche a te: sulla tua casa, sul tuo tempo, sui tuoi progetti. Se nessuno ti chiede niente, hai già la tua risposta.' },
    flags: { h: 'Campanelli d’allarme', items: ['Cuccioli sempre disponibili', 'Tante razze insieme', 'Consegna al distributore di benzina', 'Un acconto prima della visita'] },
    outro: 'Dieci domande. Qualche minuto di imbarazzo. Dieci anni insieme.',
    sources_h: 'Fonti',
    sources: 'ŠVPS SR (acquisto di un cucciolo, microchip e registrazione), regolamento di allevamento del club slovacco dei bovari svizzeri, Royal Kennel Club, Kennel club svedese e norvegese (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Stampa o salva come PDF',
    pdf: 'Scarica il PDF',
    note: 'Contenuti solo a scopo educativo. Per il tuo cane chiedi al tuo veterinario e al tuo club di razza.',
  },
  es: {
    link: 'Chuleta: 10 preguntas para el criador',
    meta: 'Diez preguntas para hacerle a un criador antes de decirle que sí a un cachorro. Una chuleta para imprimir de Carrie the Swiss.',
    title: '10 preguntas para el criador',
    subtitle: 'Antes de decirle que sí a un cachorro.',
    intro: 'A un buen criador le encantan estas preguntas. Uno malo las odia. Imprímelas, llévalas contigo y ve marcándolas.',
    parts: [
      { h: 'Los padres', qs: [
        { q: '¿Puedo ver a la madre?', why: 'En casa del criador, con sus cachorros. «Hoy no está» es una señal de alarma.' },
        { q: '¿Tienen los dos padres pruebas de salud?', why: 'Radiografías oficiales de caderas (HD, grados A–E), codos (ED, 0–3) y hombros (OCD), valoradas por el especialista del club, idealmente también los ojos. Pide ver los papeles. Los míos: caderas A, codos 0, hombros libres.' },
        { q: '¿Por qué estos dos y qué COI tendrá la camada?', why: 'COI = coeficiente de consanguinidad en 5 generaciones. Por debajo del 6,25% (como entre primos); en el Swissy, idealmente por debajo del 2%, como en la cría sueca. Desde el 12,5% (medio hermanos): no. Con más generaciones, la cifra sale más alta.' },
        { q: '¿Cuánto vivieron los abuelos y de qué enfermaron?', why: 'Algunos problemas, como la epilepsia (que suele aparecer a los 2–3 años), no se ven en ninguna radiografía.' },
      ] },
      { h: 'El cachorro', qs: [
        { q: '¿Está registrada la camada en el club de raza?', why: 'El pedigrí sale del libro de orígenes oficial (FCI); el afijo se puede comprobar en el directorio de la FCI. En Eslovaquia, quien vende cachorros debe estar registrado en la oficina veterinaria regional (RVPS).' },
        { q: '¿Con cuántas semanas se irá a casa el cachorro?', why: 'Mi club: al menos 7 semanas. Los veterinarios de Cornell: 8–12 semanas. Esas semanas con su madre y sus hermanos le enseñan a controlar el mordisco y los modales de perro.' },
        { q: '¿Qué tiene ya hecho?', why: 'Microchip inscrito en el registro nacional de animales de compañía, primera vacuna, al menos 2 desparasitaciones. La vacuna de la rabia (desde las 12 semanas) y los refuerzos llegarán después, con tu veterinario.' },
        { q: '¿Cómo se criaron los cachorros?', why: 'Los 3 primeros meses son los que más cuentan: visitas, ruidos, viajes en coche, una casa con vida. No en un cuarto trasero.' },
      ] },
      { h: 'Cuando digas que sí', qs: [
        { q: '¿Habrá contrato por escrito?', why: 'Precio, salud, pedigrí y la promesa de aceptar al perro de vuelta a cualquier edad.' },
        { q: '¿Puedo llamar más adelante?', why: 'Los buenos criadores responden durante años.' },
      ] },
    ],
    twist: { h: 'Giro de guion', p: 'Un buen criador también te hará preguntas a ti: sobre tu casa, tu tiempo y tus planes. Si nadie te pregunta nada, ahí tienes tu respuesta.' },
    flags: { h: 'Señales de alarma', items: ['Cachorros siempre disponibles', 'Muchas razas a la vez', 'Entrega en una gasolinera', 'Un anticipo antes de la visita'] },
    outro: 'Diez preguntas. Unos minutos incómodos. Diez años juntos.',
    sources_h: 'Fuentes',
    sources: 'ŠVPS SR (compra de un cachorro, microchip y registro), reglamento de cría del club eslovaco de boyeros suizos, Royal Kennel Club, Kennel clubs sueco y noruego (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Imprimir o guardar como PDF',
    pdf: 'Descargar PDF',
    note: 'Contenido solo educativo. Consulta a tu veterinario y a tu club de raza sobre tu propio perro.',
  },
  uk: {
    link: 'Шпаргалка: 10 запитань до заводчика',
    meta: 'Десять запитань до заводчика, перш ніж сказати цуценяті «так». Шпаргалка для друку від Carrie the Swiss.',
    title: '10 запитань до заводчика',
    subtitle: 'Перш ніж сказати цуценяті «так».',
    intro: 'Хороший заводчик любить ці запитання. Поганий їх ненавидить. Роздрукуйте їх, візьміть із собою й відмічайте.',
    parts: [
      { h: 'Батьки', qs: [
        { q: 'Чи можна побачити маму?', why: 'Удома в заводчика, з її цуценятами. Якщо чуєте «сьогодні її немає», це тривожний сигнал.' },
        { q: 'Чи пройшли обоє батьків перевірки здоров’я?', why: 'Офіційні рентгенівські знімки кульшових суглобів (HD, ступені A–E), ліктів (ED, 0–3) і плечей (OCD), оцінені фахівцем клубу, в ідеалі також очі. Попросіть показати документи. Мої: кульшові суглоби A, лікті 0, плечі чисті.' },
        { q: 'Чому саме ці двоє і який COI матиме послід?', why: 'COI — коефіцієнт інбридингу за 5 поколінь. Нижче 6,25% (як двоюрідні брат і сестра), у Swissy ідеально нижче 2%, як у шведському розведенні. Від 12,5% (напіврідні брат і сестра) — ні. За більшої кількості поколінь число виходить вищим.' },
        { q: 'Скільки прожили бабусі й дідусі та на що хворіли?', why: 'Деякі проблеми, наприклад епілепсію (часто з 2–3 років), не видно на жодному рентгені.' },
      ] },
      { h: 'Цуценя', qs: [
        { q: 'Чи зареєстрований послід у породному клубі?', why: 'Родовід походить з офіційної племінної книги (FCI); назву розплідника можна перевірити в реєстрі FCI. У Словаччині кожен, хто продає цуценят, має бути зареєстрований у регіональній ветеринарній службі (RVPS).' },
        { q: 'У якому віці цуценя поїде до нового дому?', why: 'Мій клуб: щонайменше 7 тижнів. Ветеринари з Корнелла: 8–12 тижнів. Ці тижні з мамою, братами й сестрами вчать його м’якого укусу й собачих манер.' },
        { q: 'Що вже зроблено?', why: 'Чип із записом у національному реєстрі тварин, перше щеплення, щонайменше 2 дегельмінтизації. Щеплення від сказу (з 12 тижнів) і ревакцинації зробить пізніше ваш ветеринар.' },
        { q: 'Як росли цуценята?', why: 'Найважливіші перші 3 місяці: гості, звуки, поїздки в авто, жвавий дім. А не задня кімната.' },
      ] },
      { h: 'Коли ви скажете «так»', qs: [
        { q: 'Чи буде письмовий договір?', why: 'Ціна, здоров’я, родовід і обіцянка забрати собаку назад у будь-якому віці.' },
        { q: 'Чи можна вам зателефонувати згодом?', why: 'Хороші заводчики відповідають роками.' },
      ] },
    ],
    twist: { h: 'Нюанс', p: 'Хороший заводчик розпитуватиме і вас: про ваш дім, час і плани. Якщо вас ні про що не питають, це теж відповідь.' },
    flags: { h: 'Тривожні сигнали', items: ['Цуценята є завжди', 'Багато порід одночасно', 'Передача на заправці', 'Завдаток ще до візиту'] },
    outro: 'Десять запитань. Кілька незручних хвилин. Десять років разом.',
    sources_h: 'Джерела',
    sources: 'ŠVPS SR (купівля цуценяти, чипування та реєстрація), племінні правила словацького клубу швейцарських зенненхундів, Royal Kennel Club, шведський і норвезький кінологічні клуби (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Надрукувати або зберегти як PDF',
    pdf: 'Завантажити PDF',
    note: 'Лише освітній контент. Щодо власної собаки радьтеся з ветеринаром і породним клубом.',
  },
  hu: {
    link: 'Puska: 10 kérdés a tenyésztőnek',
    meta: 'Tíz kérdés a tenyésztőnek, mielőtt igent mondasz egy kiskutyára. Carrie the Swiss nyomtatható puskája.',
    title: '10 kérdés a tenyésztőnek',
    subtitle: 'Mielőtt igent mondasz egy kiskutyára.',
    intro: 'A jó tenyésztő imádja ezeket a kérdéseket. A rossz utálja őket. Nyomtasd ki, vidd magaddal, és pipáld ki sorban.',
    parts: [
      { h: 'A szülők', qs: [
        { q: 'Megnézhetem az anyakutyát?', why: 'A tenyésztő otthonában, a kölykeivel. Ha azt hallod, hogy „ma nincs itt”, az intő jel.' },
        { q: 'Mindkét szülőnek megvannak az egészségügyi szűrései?', why: 'Hivatalos röntgenfelvételek a csípőről (HD, A–E fokozat), a könyökről (ED, 0–3) és a vállról (OCD), a klub szakértőjének értékelésével, ideális esetben szemvizsgálattal is. Kérd el a papírokat. Az enyéim: csípő A, könyök 0, váll mentes.' },
        { q: 'Miért éppen ők ketten, és mekkora lesz az alom COI-ja?', why: 'COI = beltenyésztettségi együttható 5 generációra. 6,25% alatt (mint unokatestvéreknél), Swissynél ideálisan 2% alatt, mint a svéd tenyésztésben. 12,5%-tól (féltestvérek): nem. Több generációra számolva magasabb szám jön ki.' },
        { q: 'Meddig éltek a nagyszülők, és milyen betegségeik voltak?', why: 'Egyes problémák, például az epilepszia (gyakran 2–3 éves kortól), egyetlen röntgenen sem látszanak.' },
      ] },
      { h: 'A kölyök', qs: [
        { q: 'Be van jegyezve az alom a fajtaklubnál?', why: 'A származási lapot a hivatalos törzskönyv (FCI) alapján adják ki; a kennelnevet az FCI nyilvántartásában ellenőrizheted. Szlovákiában mindenkinek, aki kölyköket árul, regisztrálva kell lennie a regionális állat-egészségügyi hivatalnál (RVPS).' },
        { q: 'Hány hetesen vihetem haza a kölyköt?', why: 'A klubom: legalább 7 hét. A Cornell állatorvosai: 8–12 hét. Az anyjával és a testvéreivel töltött hetek tanítják meg a harapásgátlásra és a kutyaillemre.' },
        { q: 'Mi van már elintézve?', why: 'Az országos kisállat-nyilvántartásba bejegyzett mikrochip, első oltás, legalább 2 féregtelenítés. A veszettség elleni oltás (12 hetes kortól) és az emlékeztető oltások később jönnek, az állatorvosodnál.' },
        { q: 'Hogyan nőttek fel a kölykök?', why: 'Az első 3 hónap számít a legtöbbet: vendégek, zajok, autózás, nyüzsgő otthon. Nem egy hátsó szobában.' },
      ] },
      { h: 'Ha igent mondasz', qs: [
        { q: 'Lesz írásos szerződés?', why: 'Ár, egészség, törzskönyv és ígéret, hogy bármilyen korban visszaveszi a kutyát.' },
        { q: 'Később is telefonálhatok?', why: 'A jó tenyésztők évekig válaszolnak.' },
      ] },
    ],
    twist: { h: 'A csavar', p: 'A jó tenyésztő téged is kikérdez: az otthonodról, az idődről, a terveidről. Ha senki nem kérdez tőled semmit, az is válasz.' },
    flags: { h: 'Intő jelek', items: ['Mindig van eladó kölyök', 'Sok fajta egyszerre', 'Átadás egy benzinkúton', 'Foglaló még a látogatás előtt'] },
    outro: 'Tíz kérdés. Pár kínos perc. Tíz közös év.',
    sources_h: 'Források',
    sources: 'ŠVPS SR (kiskutya vásárlása, chipezés és regisztráció), a svájci havasi kutyák szlovák klubjának tenyésztési szabályzata, Royal Kennel Club, svéd és norvég kennel klub (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Nyomtatás vagy mentés PDF-ként',
    pdf: 'PDF letöltése',
    note: 'Kizárólag ismeretterjesztő tartalom. A saját kutyádról kérdezd az állatorvosodat és a fajtaklubodat.',
  },
  nl: {
    link: 'Spiekbriefje: 10 vragen voor de fokker',
    meta: 'Tien vragen voor de fokker voordat je ja zegt tegen een pup. Een spiekbriefje om te printen, van Carrie the Swiss.',
    title: '10 vragen voor de fokker',
    subtitle: 'Voordat je ja zegt tegen een pup.',
    intro: 'Een goede fokker vindt deze vragen geweldig. Een slechte haat ze. Print ze, neem ze mee en vink ze af.',
    parts: [
      { h: 'De ouders', qs: [
        { q: 'Mag ik de moeder zien?', why: 'Bij de fokker thuis, met haar pups. “Ze is er vandaag niet” is een alarmsignaal.' },
        { q: 'Zijn beide ouders op gezondheid getest?', why: 'Officiële röntgenfoto’s van heupen (HD, graad A–E), ellebogen (ED, 0–3) en schouders (OCD), beoordeeld door de specialist van de club, liefst ook de ogen. Vraag naar de papieren. De mijne: heupen A, ellebogen 0, schouders vrij.' },
        { q: 'Waarom juist deze twee, en wat wordt de COI van het nest?', why: 'COI = inteeltcoëfficiënt over 5 generaties. Onder 6,25% (zoals bij neef en nicht), bij een Swissy het liefst onder 2%, zoals in de Zweedse fokkerij. Vanaf 12,5% (halfbroer en halfzus): nee. Over meer generaties komt het getal hoger uit.' },
        { q: 'Hoe oud werden de grootouders, en welke ziektes hadden ze?', why: 'Sommige problemen, zoals epilepsie (vaak vanaf 2–3 jaar), zie je op geen enkele röntgenfoto.' },
      ] },
      { h: 'De pup', qs: [
        { q: 'Is het nest ingeschreven bij de rasvereniging?', why: 'Een stamboom komt uit het officiële stamboek (FCI); kennelnamen kun je nakijken in het register van de FCI. In Slowakije moet iedereen die pups verkoopt geregistreerd zijn bij de regionale veterinaire dienst (RVPS).' },
        { q: 'Hoe oud is de pup als hij mee naar huis mag?', why: 'Mijn club: minstens 7 weken. Dierenartsen van Cornell: 8–12 weken. Die weken bij moeder en nestgenoten leren hem bijtremming en hondenmanieren.' },
        { q: 'Wat is al geregeld?', why: 'Chip geregistreerd in de nationale databank, eerste vaccinatie, minstens 2 ontwormingen. De rabiësvaccinatie (vanaf 12 weken) en boosters volgen later bij je dierenarts.' },
        { q: 'Hoe zijn de pups opgegroeid?', why: 'De eerste 3 maanden tellen het zwaarst: bezoek, geluiden, autoritjes, een druk huishouden. Niet in een achterkamertje.' },
      ] },
      { h: 'Als je ja zegt', qs: [
        { q: 'Komt er een schriftelijk contract?', why: 'Prijs, gezondheid, stamboom en de belofte om de hond op elke leeftijd terug te nemen.' },
        { q: 'Mag ik later nog bellen?', why: 'Goede fokkers blijven jarenlang antwoorden.' },
      ] },
    ],
    twist: { h: 'De twist', p: 'Een goede fokker stelt jou ook vragen: over je huis, je tijd, je plannen. Vraagt niemand je iets, dan heb je je antwoord.' },
    flags: { h: 'Alarmsignalen', items: ['Altijd pups beschikbaar', 'Veel rassen tegelijk', 'Overdracht bij een tankstation', 'Aanbetaling vóór een bezoek'] },
    outro: 'Tien vragen. Een paar ongemakkelijke minuten. Tien jaar samen.',
    sources_h: 'Bronnen',
    sources: 'ŠVPS SR (een pup kopen, chippen en registratie), fokreglement van de Slowaakse club voor Zwitserse sennenhonden, Royal Kennel Club, Zweedse en Noorse kennelclub (SKK, NKK), AKC, FOUR PAWS, Cornell Riney Canine Health Center, AVSAB, WSAVA, FCI, Frontiers in Veterinary Science 2022.',
    print: 'Printen of opslaan als pdf',
    pdf: 'Download pdf',
    note: 'Alleen educatieve inhoud. Vraag je dierenarts en je rasvereniging naar je eigen hond.',
  },
};
