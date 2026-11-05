// Texts of the newsletter e-mails and pages, 11 languages (worker/mail.js uses them).
// Registers as on the site: sk, cs, fr, uk formal; de, pl, it, es, hu, nl informal.

// ---- the confirmation e-mail (double opt-in)
export const COPY = {
  en: { subject: "One more tap, and you're in", pre: "Confirm your e-mail and I'll send you the cheat sheet: 10 questions for the breeder.", title: 'One more tap.',
    body: "Hi, Carrie here. Confirm your e-mail and I'll send you the cheat sheet right away: 10 questions for the breeder. After that I'll write when a new episode or something new in the shop comes out. Rarely, briefly, and only when it's worth it.",
    button: 'Confirm my e-mail', ignore: "Didn't sign up? Just ignore this e-mail, without confirmation you won't get anything else. The link is valid for 7 days.",
    why: 'You are getting this e-mail because this address was entered on carrietheswiss.com.' },
  sk: { subject: 'Ešte jedno ťuknutie a ste dnu', pre: 'Potvrďte e-mail a pošlem vám ťahák: 10 otázok pre chovateľa.', title: 'Ešte jedno ťuknutie.',
    body: 'Ahoj, tu Carrie. Potvrďte svoj e-mail a hneď vám pošlem ťahák: 10 otázok pre chovateľa. Potom sa ozvem, keď vyjde nová epizóda alebo niečo nové v obchode. Zriedka, stručne a len keď to stojí za to.',
    button: 'Potvrdiť e-mail', ignore: 'Neprihlasovali ste sa? Tento e-mail pokojne ignorujte, bez potvrdenia vám už nič nepríde. Odkaz platí 7 dní.',
    why: 'Tento e-mail ste dostali, lebo niekto zadal túto adresu na carrietheswiss.com.' },
  cs: { subject: 'Ještě jedno ťuknutí a jste uvnitř', pre: 'Potvrďte e-mail a napíšu vám, až vyjde nová epizoda.', title: 'Ještě jedno ťuknutí.',
    body: 'Ahoj, tady Carrie. Potvrďte svůj e-mail a napíšu vám, až vyjde nová epizoda nebo něco nového v obchodě. Zřídka, stručně a jen když to stojí za to.',
    button: 'Potvrdit e-mail', ignore: 'Nepřihlašovali jste se? Tento e-mail klidně ignorujte, bez potvrzení vám už nic nepřijde. Odkaz platí 7 dní.',
    why: 'Tento e-mail jste dostali, protože někdo zadal tuto adresu na carrietheswiss.com.' },
  de: { subject: 'Noch ein Klick, und du bist dabei', pre: 'Bestätige deine E-Mail, und ich schreibe dir, wenn eine neue Folge kommt.', title: 'Noch ein Klick.',
    body: 'Hallo, hier ist Carrie. Bestätige deine E-Mail, und ich schreibe dir, wenn eine neue Folge oder etwas Neues im Shop erscheint. Selten, kurz und nur, wenn es sich lohnt.',
    button: 'E-Mail bestätigen', ignore: 'Nicht angemeldet? Dann ignoriere diese E-Mail einfach, ohne Bestätigung bekommst du nichts weiter. Der Link ist 7 Tage gültig.',
    why: 'Du bekommst diese E-Mail, weil diese Adresse auf carrietheswiss.com eingegeben wurde.' },
  pl: { subject: 'Jeszcze jedno kliknięcie i jesteś z nami', pre: 'Potwierdź e-mail, a napiszę, gdy wyjdzie nowy odcinek.', title: 'Jeszcze jedno kliknięcie.',
    body: 'Cześć, tu Carrie. Potwierdź swój e-mail, a napiszę do ciebie, gdy wyjdzie nowy odcinek albo coś nowego w sklepie. Rzadko, krótko i tylko wtedy, gdy warto.',
    button: 'Potwierdzam e-mail', ignore: 'To nie ty? Po prostu zignoruj tę wiadomość, bez potwierdzenia nic więcej nie dostaniesz. Link jest ważny 7 dni.',
    why: 'Dostajesz tę wiadomość, bo ten adres został wpisany na carrietheswiss.com.' },
  fr: { subject: "Encore un clic et c'est fait", pre: 'Confirmez votre e-mail et je vous écrirai quand un nouvel épisode sortira.', title: 'Encore un clic.',
    body: 'Bonjour, ici Carrie. Confirmez votre e-mail et je vous écrirai quand un nouvel épisode ou une nouveauté de la boutique sortira. Rarement, brièvement, et seulement quand ça en vaut la peine.',
    button: 'Confirmer mon e-mail', ignore: "Ce n'est pas vous ? Ignorez simplement cet e-mail, sans confirmation vous ne recevrez rien d'autre. Le lien est valable 7 jours.",
    why: 'Vous recevez cet e-mail parce que cette adresse a été saisie sur carrietheswiss.com.' },
  it: { subject: 'Ancora un clic e ci sei', pre: 'Conferma la tua e-mail e ti scriverò quando esce un nuovo episodio.', title: 'Ancora un clic.',
    body: 'Ciao, sono Carrie. Conferma la tua e-mail e ti scriverò quando esce un nuovo episodio o una novità nel negozio. Di rado, in breve e solo quando ne vale la pena.',
    button: 'Conferma la mia e-mail', ignore: "Non hai chiesto tu l'iscrizione? Ignora pure questa e-mail, senza conferma non riceverai nient'altro. Il link è valido 7 giorni.",
    why: 'Ricevi questa e-mail perché questo indirizzo è stato inserito su carrietheswiss.com.' },
  es: { subject: 'Un clic más y ya estás dentro', pre: 'Confirma tu correo y te escribiré cuando salga un episodio nuevo.', title: 'Un clic más.',
    body: 'Hola, soy Carrie. Confirma tu correo y te escribiré cuando salga un episodio nuevo o algo nuevo en la tienda. Pocas veces, en breve y solo cuando valga la pena.',
    button: 'Confirmar mi correo', ignore: '¿No fuiste tú? Simplemente ignora este correo, sin confirmación no recibirás nada más. El enlace es válido durante 7 días.',
    why: 'Recibes este correo porque esta dirección se introdujo en carrietheswiss.com.' },
  uk: { subject: 'Ще один дотик, і ви з нами', pre: 'Підтвердьте e-mail, і я напишу вам, коли вийде новий епізод.', title: 'Ще один дотик.',
    body: 'Привіт, це Керрі. Підтвердьте свою адресу, і я напишу вам, коли вийде новий епізод або щось нове в магазині. Рідко, коротко і лише тоді, коли воно того варте.',
    button: 'Підтвердити e-mail', ignore: 'Ви не підписувалися? Просто проігноруйте цей лист, без підтвердження більше нічого не надійде. Посилання дійсне 7 днів.',
    why: 'Ви отримали цей лист, бо цю адресу ввели на carrietheswiss.com.' },
  hu: { subject: 'Még egy koppintás, és bent vagy', pre: 'Erősítsd meg az e-mail-címed, és írok, amikor új epizód jön.', title: 'Még egy koppintás.',
    body: 'Szia, itt Carrie. Erősítsd meg az e-mail-címed, és írok neked, amikor új epizód vagy valami új érkezik a boltba. Ritkán, röviden, és csak ha megéri.',
    button: 'Megerősítem', ignore: 'Nem te iratkoztál fel? Nyugodtan hagyd figyelmen kívül ezt az e-mailt, megerősítés nélkül nem kapsz többet. A link 7 napig érvényes.',
    why: 'Azért kapod ezt az e-mailt, mert ezt a címet megadták a carrietheswiss.com oldalon.' },
  nl: { subject: 'Nog één klik en je bent erbij', pre: 'Bevestig je e-mail en ik schrijf je zodra er een nieuwe aflevering is.', title: 'Nog één klik.',
    body: 'Hoi, hier is Carrie. Bevestig je e-mailadres en ik schrijf je zodra er een nieuwe aflevering of iets nieuws in de shop verschijnt. Zelden, kort en alleen als het de moeite waard is.',
    button: 'Bevestig mijn e-mail', ignore: 'Niet aangemeld? Negeer deze e-mail dan gewoon, zonder bevestiging krijg je niets meer. De link is 7 dagen geldig.',
    why: 'Je krijgt deze e-mail omdat dit adres is ingevuld op carrietheswiss.com.' },
};

// ---- the welcome e-mail after confirming: the cheat sheet (src/data/checklist.ts), then news
export const WELCOME = {
  en: { subject: "Here's your cheat sheet: 10 questions for the breeder", pre: 'Print it and take it along to the breeder.', title: 'Welcome to the pack.',
    body: "Thanks for confirming. As promised, here's the cheat sheet: ten questions to ask a breeder before you say yes to a puppy. A good breeder loves them.",
    button: 'Open the cheat sheet', pdf: 'Download the printable PDF',
    next: "I'll write again when a new episode is out. Until then, all episodes are on the site and on YouTube.", episodes: 'Watch the episodes',
    unsub: 'Unsubscribe', why: 'You are getting this e-mail because you signed up on carrietheswiss.com.' },
  sk: { subject: 'Tu je váš ťahák: 10 otázok pre chovateľa', pre: 'Vytlačte si ho a zoberte ho so sebou k chovateľovi.', title: 'Vitajte vo svorke.',
    body: 'Ďakujem za potvrdenie. Ako som sľúbila, tu je ťahák: desať otázok, ktoré položte chovateľovi skôr, ako poviete áno šteňaťu. Dobrý chovateľ ich miluje.',
    button: 'Otvoriť ťahák', pdf: 'Stiahnuť PDF na vytlačenie',
    next: 'Ďalší e-mail pošlem, keď vyjde nová epizóda. Dovtedy sú všetky epizódy na webe aj na YouTube.', episodes: 'Pozrieť epizódy',
    unsub: 'Odhlásiť sa', why: 'Tento e-mail ste dostali, lebo ste sa prihlásili na carrietheswiss.com.' },
};

// ---- the unsubscribe page (/api/unsubscribe): asks first, so link scanners in mail apps can't unsubscribe anyone
export const UNSUB = {
  en: { title: "Unsubscribe from Carrie's news?", body: "You won't get any more e-mails about new episodes.", button: 'Yes, unsubscribe',
    done_title: 'Unsubscribed.', done_body: 'No more e-mails will come. If you change your mind, you can sign up again on the site.',
    error: "This link isn't valid. Write to info@carrietheswiss.com and I'll unsubscribe you by hand.", back: 'Back to the site' },
  sk: { title: 'Odhlásiť sa z noviniek?', body: 'Už vám nebudem posielať e-maily o nových epizódach.', button: 'Áno, odhlásiť',
    done_title: 'Odhlásené.', done_body: 'Ďalšie e-maily už neprídu. Ak si to rozmyslíte, prihlásiť sa môžete znova na webe.',
    error: 'Odkaz nie je platný. Napíšte na info@carrietheswiss.com a odhlásim vás ručne.', back: 'Späť na web' },
};

// ---- the word for the privacy page in e-mail footers (same as src/data/privacy.ts "link")
export const PRIVACY_WORD = { en: 'Privacy', sk: 'Ochrana súkromia' };
