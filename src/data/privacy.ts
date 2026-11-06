// The privacy page (/[lang]/privacy/), 11 languages. Registers as on the site: sk, cs, fr, uk formal; de, pl, it, es,
// hu, nl informal. The controller and the contact address appear as written here; the page links the address.
import type { Locale } from '../i18n';

export interface PrivacyCopy {
  link: string;      // the word for links (footer, sign-up form, e-mails)
  title: string;
  meta: string;
  updated: string;
  intro: string;
  sections: { h: string; p: string[] }[];
}

export const CONTACT = 'info@carrietheswiss.com';

export const PRIVACY: Partial<Record<Locale, PrivacyCopy>> = {
  sk: {
    link: 'Ochrana súkromia',
    title: 'Ochrana súkromia',
    meta: 'Kto prevádzkuje Carrie the Swiss, aké údaje web spracúva a aké máte práva.',
    updated: 'Platné od 6. 11. 2026',
    intro: 'Krátko a jasne: web nepoužíva sledovacie cookies, návštevy počítame anonymne a váš e-mail uchovávame, len ak sa prihlásite a prihlásenie potvrdíte.',
    sections: [
      { h: 'Kto zodpovedá za vaše údaje', p: ['Web carrietheswiss.com a newsletter Carrie the Swiss prevádzkuje Ing. Róbert Nagy. Kontakt: info@carrietheswiss.com.'] },
      { h: 'Newsletter', p: [
        'Ak sa prihlásite, spracúvame vašu e-mailovú adresu a jazyk stránky, na ktorej ste sa prihlásili, aby sme vám mohli poslať ťahák a občasné e-maily o nových epizódach a obchode.',
        'Právnym základom je váš súhlas (čl. 6 ods. 1 písm. a) GDPR). Do zoznamu sa dostanete až po kliknutí na odkaz v potvrdzovacom e-maile. Ak prihlásenie nepotvrdíte, vaša adresa sa do zoznamu nezapíše.',
        'E-maily v našom mene rozosiela služba Brevo (Francúzsko). Brevo môže zaznamenať, či bol e-mail doručený a otvorený a či ste klikli na odkaz; my sa pozeráme len na súhrnné čísla.',
        'Adresu uchovávame, kým sa neodhlásite. Odhlásiť sa môžete odkazom v každom e-maile alebo správou na info@carrietheswiss.com.',
      ] },
      { h: 'Anonymné počítanie návštev', p: [
        'Aby sme vedeli, čo na webe funguje, počítame anonymné udalosti: návštevu stránky, ktoré scény ľudia videli, ktorú epizódu spustili, jazyk, typ zariadenia (mobil alebo počítač), krajinu a stránku, z ktorej ste prišli.',
        'Počítame aj to, kam sa na stránkach kliká (len približné miesto v hrubej mriežke), ako ďaleko sa posúva a ako dlho sa zostáva pri jednotlivých scénach, vždy len ako denné súčty bez väzby na konkrétnu návštevu.',
        'Neukladáme IP adresy a nepoužívame cookies ani žiadne identifikátory, takže z čísel sa nedá zistiť, kto ste. Ak váš prehliadač posiela signál Global Privacy Control alebo Do Not Track, neodosiela sa vôbec nič.',
      ] },
      { h: 'Opýtajte sa Carrie (chat)', p: ['Otázky, ktoré napíšete do chatu, posielame poskytovateľovi umelej inteligencie Anthropic (USA), aby vám Carrie mohla odpovedať. My ich neukladáme. Do chatu prosím nepíšte osobné údaje.'] },
      { h: 'Videá z YouTube', p: ['Epizódy sa prehrávajú cez YouTube (Google) v režime so zvýšenou ochranou súkromia. Kým video nespustíte, YouTube sa nenačíta; potom údaje spracúva Google podľa vlastných pravidiel.'] },
      { h: 'Hosting a bezpečnosť', p: ['Web beží na Cloudflare. Pri doručovaní stránok a ochrane pred útokmi Cloudflare technicky spracúva vašu IP adresu; my ju neukladáme.'] },
      { h: 'Cookies a pamäť prehliadača', p: ['Web nepoužíva žiadne cookies. Hudobný prehrávač si v pamäti vášho prehliadača (localStorage) pamätá, či hrá hudba, ktorá skladba a hlasitosť. Tieto údaje váš prehliadač neopustia.'] },
      { h: 'Prenos mimo EÚ', p: ['Brevo spracúva údaje v EÚ. Anthropic, Google a Cloudflare sú americké spoločnosti; pri prenose do USA sa opierajú o štandardné zmluvné doložky alebo o rámec ochrany údajov medzi EÚ a USA.'] },
      { h: 'Vaše práva', p: [
        'Máte právo na prístup k svojim údajom, na ich opravu či vymazanie, na obmedzenie spracúvania, na prenosnosť údajov a právo namietať. Súhlas s newsletterom môžete kedykoľvek odvolať; zákonnosť spracúvania pred odvolaním tým nie je dotknutá. Stačí napísať na info@carrietheswiss.com.',
        'Ak sa domnievate, že s vašimi údajmi zaobchádzame nesprávne, môžete sa obrátiť na Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk.',
      ] },
    ],
  },
  en: {
    link: 'Privacy',
    title: 'Privacy',
    meta: 'Who runs Carrie the Swiss, what data the site processes and what your rights are.',
    updated: 'Effective 6 November 2026',
    intro: 'Short and plain: the site uses no tracking cookies, visits are counted anonymously, and your e-mail is stored only if you sign up and confirm it.',
    sections: [
      { h: 'Who is responsible', p: ['The site carrietheswiss.com and the Carrie the Swiss newsletter are run by Ing. Róbert Nagy. Contact: info@carrietheswiss.com.'] },
      { h: 'Newsletter', p: [
        'If you sign up, we process your e-mail address and the language of the page you signed up on, so we can send you the cheat sheet and occasional e-mails about new episodes and the shop.',
        'The legal basis is your consent (Art. 6(1)(a) GDPR). You are added to the list only after you click the link in the confirmation e-mail. If you don\'t confirm, your address is not added.',
        'The e-mails are sent on our behalf by Brevo (France). Brevo may record whether an e-mail was delivered and opened and whether a link was clicked; we only look at the totals.',
        'We keep your address until you unsubscribe. You can unsubscribe with the link in every e-mail or by writing to info@carrietheswiss.com.',
      ] },
      { h: 'Anonymous visit counting', p: [
        'To see what works on the site, we count anonymous events: a page visit, which scenes people reached, which episode they played, the language, the type of device (phone or computer), the country and the site you came from.',
        'We also count where people click on the pages (only a rough spot on a coarse grid), how far they scroll and how long they stay with each scene, always as daily totals and never linked to a particular visit.',
        'We store no IP addresses and use no cookies or identifiers, so the numbers cannot tell who you are. If your browser sends Global Privacy Control or Do Not Track, nothing is sent at all.',
      ] },
      { h: 'Ask Carrie (chat)', p: ['Questions you type into the chat are sent to the AI provider Anthropic (USA) so that Carrie can answer. We don\'t store them. Please don\'t type personal information into the chat.'] },
      { h: 'YouTube videos', p: ['Episodes play through YouTube (Google) in privacy-enhanced mode. YouTube is not loaded until you start a video; after that, Google processes data under its own rules.'] },
      { h: 'Hosting and security', p: ['The site runs on Cloudflare. To deliver pages and protect against attacks, Cloudflare technically processes your IP address; we don\'t store it.'] },
      { h: 'Cookies and browser storage', p: ['The site sets no cookies. The music player remembers in your browser\'s storage (localStorage) whether the music is on, which track and the volume. This never leaves your browser.'] },
      { h: 'Transfers outside the EU', p: ['Brevo processes data in the EU. Anthropic, Google and Cloudflare are US companies; for transfers to the USA they rely on standard contractual clauses or the EU–US Data Privacy Framework.'] },
      { h: 'Your rights', p: [
        'You have the right to access your data, to have it corrected or erased, to restrict its processing, to data portability and to object. You can withdraw your newsletter consent at any time; this does not affect processing before the withdrawal. Just write to info@carrietheswiss.com.',
        'If you think your data is handled wrongly, you can complain to the Slovak supervisory authority, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, or to the data protection authority in your own EU country.',
      ] },
    ],
  },
  cs: {
    link: 'Ochrana soukromí',
    title: 'Ochrana soukromí',
    meta: 'Kdo provozuje Carrie the Swiss, jaké údaje web zpracovává a jaká máte práva.',
    updated: 'Platné od 6. listopadu 2026',
    intro: 'Stručně a jasně: web nepoužívá sledovací cookies, návštěvy počítáme anonymně a váš e-mail uchováváme, jen pokud se přihlásíte a přihlášení potvrdíte.',
    sections: [
      { h: 'Kdo odpovídá za vaše údaje', p: ['Web carrietheswiss.com a newsletter Carrie the Swiss provozuje Ing. Róbert Nagy. Kontakt: info@carrietheswiss.com.'] },
      { h: 'Newsletter', p: [
        'Pokud se přihlásíte, zpracováváme vaši e-mailovou adresu a jazyk stránky, na které jste se přihlásili, abychom vám mohli poslat tahák a občasné e-maily o nových epizodách a obchodě.',
        'Právním základem je váš souhlas (čl. 6 odst. 1 písm. a) GDPR). Do seznamu se dostanete až po kliknutí na odkaz v potvrzovacím e-mailu. Pokud přihlášení nepotvrdíte, vaše adresa se do seznamu nezapíše.',
        'E-maily naším jménem rozesílá služba Brevo (Francie). Brevo může zaznamenat, zda byl e-mail doručen a otevřen a zda jste klikli na odkaz; my se díváme jen na souhrnná čísla.',
        'Adresu uchováváme, dokud se neodhlásíte. Odhlásit se můžete odkazem v každém e-mailu nebo zprávou na info@carrietheswiss.com.',
      ] },
      { h: 'Anonymní počítání návštěv', p: [
        'Abychom věděli, co na webu funguje, počítáme anonymní události: návštěvu stránky, které scény lidé viděli, kterou epizodu spustili, jazyk, typ zařízení (mobil nebo počítač), zemi a stránku, ze které jste přišli.',
        'Počítáme také, kam se na stránkách kliká (jen přibližné místo v hrubé mřížce), jak daleko se posouvá a jak dlouho se zůstává u jednotlivých scén, vždy jen jako denní součty bez vazby na konkrétní návštěvu.',
        'Neukládáme IP adresy a nepoužíváme cookies ani žádné identifikátory, takže z čísel nelze zjistit, kdo jste. Pokud váš prohlížeč posílá signál Global Privacy Control nebo Do Not Track, neodesílá se vůbec nic.',
      ] },
      { h: 'Zeptejte se Carrie (chat)', p: ['Otázky, které napíšete do chatu, posíláme poskytovateli umělé inteligence Anthropic (USA), aby vám Carrie mohla odpovědět. My je neukládáme. Do chatu prosím nepište osobní údaje.'] },
      { h: 'Videa z YouTube', p: ['Epizody se přehrávají přes YouTube (Google) v režimu rozšířené ochrany soukromí. Dokud video nespustíte, YouTube se nenačte; potom údaje zpracovává Google podle vlastních pravidel.'] },
      { h: 'Hosting a zabezpečení', p: ['Web běží na Cloudflare. Při doručování stránek a ochraně před útoky Cloudflare technicky zpracovává vaši IP adresu; my ji neukládáme.'] },
      { h: 'Cookies a paměť prohlížeče', p: ['Web nepoužívá žádné cookies. Hudební přehrávač si v paměti vašeho prohlížeče (localStorage) pamatuje, zda hraje hudba, kterou skladbu a hlasitost. Tyto údaje váš prohlížeč neopustí.'] },
      { h: 'Předávání mimo EU', p: ['Brevo zpracovává údaje v EU. Anthropic, Google a Cloudflare jsou americké společnosti; při předávání do USA se opírají o standardní smluvní doložky nebo o rámec EU–USA pro ochranu osobních údajů.'] },
      { h: 'Vaše práva', p: [
        'Máte právo na přístup ke svým údajům, na jejich opravu nebo výmaz, na omezení zpracování, na přenositelnost údajů a právo vznést námitku. Souhlas s newsletterem můžete kdykoli odvolat; zákonnost zpracování před odvoláním tím není dotčena. Stačí napsat na info@carrietheswiss.com.',
        'Pokud se domníváte, že s vašimi údaji zacházíme nesprávně, můžete se obrátit na slovenský dozorový úřad, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, nebo na úřad pro ochranu osobních údajů ve své zemi EU.',
      ] },
    ],
  },
  de: {
    link: 'Datenschutz',
    title: 'Datenschutzerklärung',
    meta: 'Wer Carrie the Swiss betreibt, welche Daten die Website verarbeitet und welche Rechte du hast.',
    updated: 'Gültig ab 6. November 2026',
    intro: 'Kurz und klar: Die Website nutzt keine Tracking-Cookies, Besuche zählen wir anonym, und deine E-Mail-Adresse speichern wir nur, wenn du dich anmeldest und die Anmeldung bestätigst.',
    sections: [
      { h: 'Wer verantwortlich ist', p: ['Die Website carrietheswiss.com und der Newsletter von Carrie the Swiss werden von Ing. Róbert Nagy betrieben. Kontakt: info@carrietheswiss.com.'] },
      { h: 'Newsletter', p: [
        'Wenn du dich anmeldest, verarbeiten wir deine E-Mail-Adresse und die Sprache der Seite, auf der du dich angemeldet hast, damit wir dir den Spickzettel und gelegentlich E-Mails über neue Folgen und den Shop schicken können.',
        'Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). In die Liste kommst du erst, wenn du auf den Link in der Bestätigungs-E-Mail klickst. Bestätigst du nicht, wird deine Adresse nicht aufgenommen.',
        'Die E-Mails verschickt in unserem Auftrag Brevo (Frankreich). Brevo kann erfassen, ob eine E-Mail zugestellt und geöffnet und ob ein Link angeklickt wurde; wir schauen uns nur die Gesamtzahlen an.',
        'Wir speichern deine Adresse, bis du dich abmeldest. Abmelden kannst du dich über den Link in jeder E-Mail oder mit einer Nachricht an info@carrietheswiss.com.',
      ] },
      { h: 'Anonyme Besuchszählung', p: [
        'Damit wir sehen, was auf der Website funktioniert, zählen wir anonyme Ereignisse: einen Seitenbesuch, welche Szenen erreicht wurden, welche Folge abgespielt wurde, die Sprache, die Art des Geräts (Handy oder Computer), das Land und die Website, von der du gekommen bist.',
        'Wir zählen außerdem, wohin auf den Seiten geklickt wird (nur ungefähr, in einem groben Raster), wie weit gescrollt wird und wie lange man bei den einzelnen Szenen bleibt, immer nur als Tagessummen und nie mit einem bestimmten Besuch verknüpft.',
        'Wir speichern keine IP-Adressen und verwenden weder Cookies noch Kennungen, daher lässt sich aus den Zahlen nicht ablesen, wer du bist. Sendet dein Browser Global Privacy Control oder Do Not Track, wird gar nichts übertragen.',
      ] },
      { h: 'Frag Carrie (Chat)', p: ['Fragen, die du in den Chat tippst, senden wir an den KI-Anbieter Anthropic (USA), damit Carrie antworten kann. Wir speichern sie nicht. Bitte gib im Chat keine persönlichen Daten ein.'] },
      { h: 'YouTube-Videos', p: ['Die Folgen laufen über YouTube (Google) im erweiterten Datenschutzmodus. YouTube wird erst geladen, wenn du ein Video startest; danach verarbeitet Google Daten nach eigenen Regeln.'] },
      { h: 'Hosting und Sicherheit', p: ['Die Website läuft auf Cloudflare. Um Seiten auszuliefern und vor Angriffen zu schützen, verarbeitet Cloudflare technisch bedingt deine IP-Adresse; wir speichern sie nicht.'] },
      { h: 'Cookies und Browserspeicher', p: ['Die Website setzt keine Cookies. Der Musikplayer merkt sich im Speicher deines Browsers (localStorage), ob Musik läuft, welcher Titel gewählt ist und wie laut sie ist. Diese Daten verlassen deinen Browser nie.'] },
      { h: 'Übermittlung außerhalb der EU', p: ['Brevo verarbeitet Daten in der EU. Anthropic, Google und Cloudflare sind US-Unternehmen; für Übermittlungen in die USA stützen sie sich auf Standardvertragsklauseln oder den Datenschutzrahmen EU–USA.'] },
      { h: 'Deine Rechte', p: [
        'Du hast das Recht auf Auskunft über deine Daten, auf Berichtigung oder Löschung, auf Einschränkung der Verarbeitung, auf Datenübertragbarkeit und auf Widerspruch. Deine Einwilligung in den Newsletter kannst du jederzeit widerrufen; die Verarbeitung bis zum Widerruf bleibt davon unberührt. Schreib einfach an info@carrietheswiss.com.',
        'Wenn du findest, dass wir mit deinen Daten nicht richtig umgehen, kannst du dich beschweren: bei der slowakischen Aufsichtsbehörde, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, oder bei der Datenschutzbehörde in deinem eigenen EU-Land.',
      ] },
    ],
  },
  pl: {
    link: 'Prywatność',
    title: 'Polityka prywatności',
    meta: 'Kto prowadzi Carrie the Swiss, jakie dane przetwarza strona i jakie masz prawa.',
    updated: 'Obowiązuje od 6 listopada 2026 r.',
    intro: 'Krótko i jasno: strona nie używa śledzących plików cookie, wizyty liczymy anonimowo, a twój e-mail przechowujemy tylko wtedy, gdy się zapiszesz i potwierdzisz zapis.',
    sections: [
      { h: 'Kto odpowiada za twoje dane', p: ['Stronę carrietheswiss.com i newsletter Carrie the Swiss prowadzi Ing. Róbert Nagy. Kontakt: info@carrietheswiss.com.'] },
      { h: 'Newsletter', p: [
        'Jeśli się zapiszesz, przetwarzamy twój adres e-mail i język strony, na której się zapisujesz, żeby wysłać ci ściągę i okazjonalne e-maile o nowych odcinkach i sklepie.',
        'Podstawą prawną jest twoja zgoda (art. 6 ust. 1 lit. a RODO). Na listę trafisz dopiero po kliknięciu linku w e-mailu potwierdzającym. Jeśli nie potwierdzisz zapisu, twój adres nie zostanie dodany.',
        'E-maile wysyła w naszym imieniu Brevo (Francja). Brevo może rejestrować, czy e-mail został doręczony i otwarty oraz czy kliknięto link; my patrzymy tylko na zbiorcze liczby.',
        'Przechowujemy twój adres, dopóki się nie wypiszesz. Wypisać się możesz przez link w każdym e-mailu albo pisząc na info@carrietheswiss.com.',
      ] },
      { h: 'Anonimowe liczenie wizyt', p: [
        'Żeby wiedzieć, co na stronie działa, liczymy anonimowe zdarzenia: odwiedziny strony, do których scen ludzie dotarli, który odcinek włączyli, język, rodzaj urządzenia (telefon czy komputer), kraj oraz stronę, z której do nas trafiasz.',
        'Liczymy też, gdzie na stronach się klika (tylko przybliżone miejsce w zgrubnej siatce), jak daleko się przewija i jak długo zostaje się przy poszczególnych scenach, zawsze tylko jako dzienne sumy, bez powiązania z konkretną wizytą.',
        'Nie zapisujemy adresów IP i nie używamy plików cookie ani identyfikatorów, więc z liczb nie da się ustalić, kim jesteś. Jeśli twoja przeglądarka wysyła sygnał Global Privacy Control lub Do Not Track, nie wysyłamy zupełnie nic.',
      ] },
      { h: 'Zapytaj Carrie (czat)', p: ['Pytania, które wpisujesz na czacie, wysyłamy do dostawcy sztucznej inteligencji Anthropic (USA), żeby Carrie mogła odpowiedzieć. Nie przechowujemy ich. Prosimy, nie wpisuj na czacie danych osobowych.'] },
      { h: 'Filmy z YouTube', p: ['Odcinki są odtwarzane przez YouTube (Google) w trybie rozszerzonej prywatności. YouTube nie ładuje się, dopóki nie włączysz filmu; potem Google przetwarza dane według własnych zasad.'] },
      { h: 'Hosting i bezpieczeństwo', p: ['Strona działa na Cloudflare. Przy dostarczaniu stron i ochronie przed atakami Cloudflare technicznie przetwarza twój adres IP; my go nie przechowujemy.'] },
      { h: 'Pliki cookie i pamięć przeglądarki', p: ['Strona nie używa żadnych plików cookie. Odtwarzacz muzyki zapamiętuje w pamięci twojej przeglądarki (localStorage), czy muzyka gra, który utwór i jaka głośność. Te dane nigdy nie opuszczają twojej przeglądarki.'] },
      { h: 'Przekazywanie danych poza UE', p: ['Brevo przetwarza dane w UE. Anthropic, Google i Cloudflare to firmy amerykańskie; przy przekazywaniu danych do USA opierają się na standardowych klauzulach umownych lub na ramach ochrony danych UE–USA.'] },
      { h: 'Twoje prawa', p: [
        'Masz prawo dostępu do swoich danych, ich sprostowania lub usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz prawo do sprzeciwu. Zgodę na newsletter możesz w każdej chwili wycofać; nie wpływa to na zgodność z prawem przetwarzania przed jej wycofaniem. Wystarczy napisać na info@carrietheswiss.com.',
        'Jeśli uważasz, że niewłaściwie obchodzimy się z twoimi danymi, możesz złożyć skargę do słowackiego organu nadzorczego, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, lub do organu ochrony danych w swoim kraju UE.',
      ] },
    ],
  },
  fr: {
    link: 'Confidentialité',
    title: 'Politique de confidentialité',
    meta: 'Qui gère Carrie the Swiss, quelles données le site traite et quels sont vos droits.',
    updated: 'En vigueur à compter du 6 novembre 2026',
    intro: 'En bref : le site n’utilise aucun cookie de suivi, les visites sont comptées de façon anonyme et votre e-mail n’est conservé que si vous vous inscrivez et confirmez votre inscription.',
    sections: [
      { h: 'Responsable du traitement', p: ['Le site carrietheswiss.com et la newsletter Carrie the Swiss sont gérés par Ing. Róbert Nagy. Contact : info@carrietheswiss.com.'] },
      { h: 'Newsletter', p: [
        'Si vous vous inscrivez, nous traitons votre adresse e-mail et la langue de la page d’inscription, afin de vous envoyer l’antisèche et des e-mails occasionnels sur les nouveaux épisodes et la boutique.',
        'La base légale est votre consentement (art. 6, paragraphe 1, point a) du RGPD). Votre adresse n’entre dans la liste qu’après un clic sur le lien de l’e-mail de confirmation. Sans confirmation, elle n’est pas ajoutée.',
        'Les e-mails sont envoyés en notre nom par Brevo (France). Brevo peut enregistrer si un e-mail a été remis et ouvert, et si un lien a été cliqué ; nous ne regardons que les totaux.',
        'Nous conservons votre adresse jusqu’à votre désinscription. Vous pouvez vous désinscrire via le lien présent dans chaque e-mail ou en écrivant à info@carrietheswiss.com.',
      ] },
      { h: 'Comptage anonyme des visites', p: [
        'Pour savoir ce qui fonctionne sur le site, nous comptons des événements anonymes : une visite de page, les scènes atteintes, l’épisode lancé, la langue, le type d’appareil (téléphone ou ordinateur), le pays et le site d’où vous venez.',
        'Nous comptons aussi où l’on clique sur les pages (seulement un emplacement approximatif sur une grille grossière), jusqu’où l’on fait défiler et combien de temps on reste sur chaque scène, toujours en totaux journaliers et jamais liés à une visite précise.',
        'Nous n’enregistrons aucune adresse IP et n’utilisons ni cookies ni identifiants : ces chiffres ne permettent donc pas de savoir qui vous êtes. Si votre navigateur envoie le signal Global Privacy Control ou Do Not Track, rien n’est envoyé du tout.',
      ] },
      { h: 'Demandez à Carrie (chat)', p: ['Les questions que vous tapez dans le chat sont envoyées au fournisseur d’IA Anthropic (États-Unis) pour que Carrie puisse répondre. Nous ne les conservons pas. Merci de ne pas saisir de données personnelles dans le chat.'] },
      { h: 'Vidéos YouTube', p: ['Les épisodes sont lus via YouTube (Google) en mode confidentialité avancée. YouTube n’est chargé que lorsque vous lancez une vidéo ; ensuite, Google traite les données selon ses propres règles.'] },
      { h: 'Hébergement et sécurité', p: ['Le site est hébergé par Cloudflare. Pour diffuser les pages et protéger le site contre les attaques, Cloudflare traite techniquement votre adresse IP ; nous ne la conservons pas.'] },
      { h: 'Cookies et stockage du navigateur', p: ['Le site ne dépose aucun cookie. Le lecteur de musique mémorise dans le stockage de votre navigateur (localStorage) si la musique est activée, quel morceau est joué et le volume. Ces données ne quittent jamais votre navigateur.'] },
      { h: 'Transferts hors de l’UE', p: ['Brevo traite les données dans l’UE. Anthropic, Google et Cloudflare sont des sociétés américaines ; pour les transferts vers les États-Unis, elles s’appuient sur des clauses contractuelles types ou sur le cadre de protection des données UE–États-Unis.'] },
      { h: 'Vos droits', p: [
        'Vous disposez d’un droit d’accès à vos données, ainsi que d’un droit de rectification, d’effacement, de limitation du traitement, de portabilité et d’opposition. Vous pouvez retirer à tout moment votre consentement à la newsletter, sans que cela remette en cause le traitement effectué avant ce retrait. Il suffit d’écrire à info@carrietheswiss.com.',
        'Si vous estimez que nous ne traitons pas correctement vos données, vous pouvez introduire une réclamation auprès de l’autorité de contrôle slovaque, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, ou auprès de l’autorité de protection des données de votre propre pays de l’UE.',
      ] },
    ],
  },
  it: {
    link: 'Privacy',
    title: 'Informativa sulla privacy',
    meta: 'Chi gestisce Carrie the Swiss, quali dati tratta il sito e quali sono i tuoi diritti.',
    updated: 'In vigore dal 6 novembre 2026',
    intro: 'In breve: il sito non usa cookie di tracciamento, le visite vengono contate in forma anonima e la tua e-mail viene conservata solo se ti iscrivi e confermi l’iscrizione.',
    sections: [
      { h: 'Titolare del trattamento', p: ['Il sito carrietheswiss.com e la newsletter di Carrie the Swiss sono gestiti da Ing. Róbert Nagy. Contatto: info@carrietheswiss.com.'] },
      { h: 'Newsletter', p: [
        'Se ti iscrivi, trattiamo il tuo indirizzo e-mail e la lingua della pagina di iscrizione, per inviarti il promemoria ed e-mail occasionali sui nuovi episodi e sul negozio.',
        'La base giuridica è il tuo consenso (art. 6, par. 1, lett. a) del GDPR). Entri nella lista solo dopo aver cliccato sul link nell’e-mail di conferma. Se non confermi, il tuo indirizzo non viene aggiunto.',
        'Le e-mail vengono inviate per nostro conto da Brevo (Francia). Brevo può registrare se un’e-mail è stata consegnata e aperta e se è stato cliccato un link; noi guardiamo solo i totali.',
        'Conserviamo il tuo indirizzo finché non ti disiscrivi. Puoi disiscriverti con il link presente in ogni e-mail o scrivendo a info@carrietheswiss.com.',
      ] },
      { h: 'Conteggio anonimo delle visite', p: [
        'Per capire cosa funziona sul sito, contiamo eventi anonimi: una visita alla pagina, quali scene sono state raggiunte, quale episodio è stato avviato, la lingua, il tipo di dispositivo (telefono o computer), il paese e il sito da cui arrivi.',
        'Contiamo anche dove si clicca sulle pagine (solo un punto approssimativo su una griglia grossolana), fin dove si scorre e quanto tempo si resta su ogni scena, sempre come totali giornalieri e mai collegati a una visita precisa.',
        'Non salviamo indirizzi IP e non usiamo cookie né identificatori, quindi dai numeri non si può risalire a chi sei. Se il tuo browser invia il segnale Global Privacy Control o Do Not Track, non viene inviato nulla.',
      ] },
      { h: 'Chiedi a Carrie (chat)', p: ['Le domande che scrivi nella chat vengono inviate al fornitore di intelligenza artificiale Anthropic (USA), così Carrie può risponderti. Noi non le conserviamo. Per favore, non scrivere dati personali nella chat.'] },
      { h: 'Video di YouTube', p: ['Gli episodi vengono riprodotti tramite YouTube (Google) in modalità di privacy avanzata. YouTube non viene caricato finché non avvii un video; da quel momento Google tratta i dati secondo le proprie regole.'] },
      { h: 'Hosting e sicurezza', p: ['Il sito è ospitato su Cloudflare. Per distribuire le pagine e proteggerle dagli attacchi, Cloudflare tratta tecnicamente il tuo indirizzo IP; noi non lo conserviamo.'] },
      { h: 'Cookie e memoria del browser', p: ['Il sito non usa cookie. Il lettore musicale ricorda nella memoria del tuo browser (localStorage) se la musica è accesa, quale brano e il volume. Questi dati non lasciano mai il tuo browser.'] },
      { h: 'Trasferimenti fuori dall’UE', p: ['Brevo tratta i dati nell’UE. Anthropic, Google e Cloudflare sono aziende statunitensi; per i trasferimenti verso gli USA si basano su clausole contrattuali standard o sul quadro UE–USA per la protezione dei dati personali.'] },
      { h: 'I tuoi diritti', p: [
        'Hai diritto di accesso ai tuoi dati, alla rettifica o alla cancellazione, alla limitazione del trattamento, alla portabilità dei dati e di opposizione. Puoi revocare in qualsiasi momento il consenso alla newsletter; la revoca non pregiudica la liceità del trattamento precedente. Basta scrivere a info@carrietheswiss.com.',
        'Se ritieni che i tuoi dati vengano trattati in modo scorretto, puoi presentare reclamo all’autorità di controllo slovacca, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, oppure all’autorità per la protezione dei dati del tuo paese dell’UE.',
      ] },
    ],
  },
  es: {
    link: 'Privacidad',
    title: 'Política de privacidad',
    meta: 'Quién gestiona Carrie the Swiss, qué datos trata la web y qué derechos tienes.',
    updated: 'Vigente desde el 6 de noviembre de 2026',
    intro: 'En pocas palabras: la web no usa cookies de seguimiento, las visitas se cuentan de forma anónima y tu correo solo se guarda si te suscribes y confirmas la suscripción.',
    sections: [
      { h: 'Responsable del tratamiento', p: ['La web carrietheswiss.com y la newsletter de Carrie the Swiss las gestiona Ing. Róbert Nagy. Contacto: info@carrietheswiss.com.'] },
      { h: 'Newsletter', p: [
        'Si te suscribes, tratamos tu dirección de correo electrónico y el idioma de la página desde la que te suscribes, para enviarte la chuleta y correos ocasionales sobre nuevos episodios y la tienda.',
        'La base jurídica es tu consentimiento (art. 6.1.a) del RGPD). Solo entras en la lista después de hacer clic en el enlace del correo de confirmación. Si no confirmas, tu dirección no se añade.',
        'Los correos los envía en nuestro nombre Brevo (Francia). Brevo puede registrar si un correo se entregó y se abrió y si se hizo clic en un enlace; nosotros solo miramos los totales.',
        'Guardamos tu dirección hasta que te des de baja. Puedes darte de baja con el enlace que aparece en cada correo o escribiendo a info@carrietheswiss.com.',
      ] },
      { h: 'Recuento anónimo de visitas', p: [
        'Para saber qué funciona en la web, contamos eventos anónimos: una visita a la página, qué escenas se vieron, qué episodio se reprodujo, el idioma, el tipo de dispositivo (móvil u ordenador), el país y la web desde la que llegas.',
        'También contamos dónde se hace clic en las páginas (solo un punto aproximado en una cuadrícula gruesa), hasta dónde se desplaza la página y cuánto tiempo se queda uno en cada escena, siempre como totales diarios y nunca ligados a una visita concreta.',
        'No guardamos direcciones IP ni usamos cookies ni identificadores, así que los números no permiten saber quién eres. Si tu navegador envía la señal Global Privacy Control o Do Not Track, no se envía absolutamente nada.',
      ] },
      { h: 'Pregúntale a Carrie (chat)', p: ['Las preguntas que escribes en el chat se envían al proveedor de inteligencia artificial Anthropic (EE. UU.) para que Carrie pueda responder. No las guardamos. Por favor, no escribas datos personales en el chat.'] },
      { h: 'Vídeos de YouTube', p: ['Los episodios se reproducen a través de YouTube (Google) en modo de privacidad mejorada. YouTube no se carga hasta que inicias un vídeo; a partir de ahí, Google trata los datos según sus propias normas.'] },
      { h: 'Alojamiento y seguridad', p: ['La web está alojada en Cloudflare. Para servir las páginas y protegerlas de ataques, Cloudflare trata técnicamente tu dirección IP; nosotros no la guardamos.'] },
      { h: 'Cookies y almacenamiento del navegador', p: ['La web no instala cookies. El reproductor de música recuerda en el almacenamiento de tu navegador (localStorage) si la música está activada, qué pista suena y el volumen. Estos datos nunca salen de tu navegador.'] },
      { h: 'Transferencias fuera de la UE', p: ['Brevo trata los datos en la UE. Anthropic, Google y Cloudflare son empresas estadounidenses; para las transferencias a EE. UU. se basan en cláusulas contractuales tipo o en el Marco de Privacidad de Datos UE–EE. UU.'] },
      { h: 'Tus derechos', p: [
        'Tienes derecho a acceder a tus datos, a rectificarlos o suprimirlos, a limitar su tratamiento, a la portabilidad de los datos y a oponerte al tratamiento. Puedes retirar tu consentimiento a la newsletter en cualquier momento, sin que ello afecte a la licitud del tratamiento anterior. Basta con escribir a info@carrietheswiss.com.',
        'Si crees que tratamos tus datos de forma incorrecta, puedes presentar una reclamación ante la autoridad de control eslovaca, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, o ante la autoridad de protección de datos de tu propio país de la UE.',
      ] },
    ],
  },
  uk: {
    link: 'Конфіденційність',
    title: 'Політика конфіденційності',
    meta: 'Хто керує Carrie the Swiss, які дані обробляє сайт і які у вас права.',
    updated: 'Діє з 6 листопада 2026 року',
    intro: 'Коротко і зрозуміло: сайт не використовує файлів cookie для відстеження, відвідування ми рахуємо анонімно, а ваш e-mail зберігаємо, лише якщо ви підпишетеся й підтвердите підписку.',
    sections: [
      { h: 'Хто відповідає за ваші дані', p: ['Сайт carrietheswiss.com і розсилку Carrie the Swiss веде Ing. Róbert Nagy. Контакт: info@carrietheswiss.com.'] },
      { h: 'Розсилка', p: [
        'Якщо ви підпишетеся, ми оброблятимемо вашу адресу e-mail і мову сторінки, на якій ви підписалися, щоб надіслати вам шпаргалку, а час від часу й листи про нові епізоди та магазин.',
        'Правовою підставою є ваша згода (ст. 6(1)(a) GDPR). До списку ви потрапите лише після того, як натиснете посилання в листі з підтвердженням. Якщо не підтвердите підписку, вашу адресу до списку не додадуть.',
        'Листи від нашого імені надсилає сервіс Brevo (Франція). Brevo може фіксувати, чи лист доставлено й відкрито та чи натиснуто посилання; ми дивимося лише на загальні цифри.',
        'Ми зберігаємо вашу адресу, доки ви не відпишетеся. Відписатися можна за посиланням у кожному листі або написавши на info@carrietheswiss.com.',
      ] },
      { h: 'Анонімний підрахунок відвідувань', p: [
        'Щоб розуміти, що на сайті працює, ми рахуємо анонімні події: відвідування сторінки, до яких сцен дійшли люди, який епізод увімкнули, мову, тип пристрою (телефон чи комп’ютер), країну та сайт, з якого ви прийшли.',
        'Ми також рахуємо, куди натискають на сторінках (лише приблизне місце в грубій сітці), як далеко прокручують і скільки часу залишаються біля кожної сцени, завжди лише як щоденні суми, без зв’язку з конкретним відвідуванням.',
        'Ми не зберігаємо IP-адрес і не використовуємо файлів cookie чи ідентифікаторів, тож із цих цифр неможливо дізнатися, хто ви. Якщо ваш браузер надсилає сигнал Global Privacy Control або Do Not Track, не надсилається взагалі нічого.',
      ] },
      { h: 'Запитайте Керрі (чат)', p: ['Запитання, які ви пишете в чаті, ми передаємо постачальнику штучного інтелекту Anthropic (США), щоб Керрі могла відповісти. Ми їх не зберігаємо. Будь ласка, не пишіть у чаті персональних даних.'] },
      { h: 'Відео з YouTube', p: ['Епізоди відтворюються через YouTube (Google) у режимі підвищеної конфіденційності. YouTube не завантажується, доки ви не запустите відео; після цього Google обробляє дані за власними правилами.'] },
      { h: 'Хостинг і безпека', p: ['Сайт працює на Cloudflare. Щоб доставляти сторінки й захищати їх від атак, Cloudflare технічно обробляє вашу IP-адресу; ми її не зберігаємо.'] },
      { h: 'Файли cookie і пам’ять браузера', p: ['Сайт не встановлює жодних файлів cookie. Музичний плеєр запам’ятовує в пам’яті вашого браузера (localStorage), чи грає музика, який трек і яка гучність. Ці дані ніколи не залишають ваш браузер.'] },
      { h: 'Передавання даних за межі ЄС', p: ['Brevo обробляє дані в ЄС. Anthropic, Google і Cloudflare є американськими компаніями; для передавання даних до США вони спираються на стандартні договірні положення або на рамкову програму захисту даних ЄС–США (Data Privacy Framework).'] },
      { h: 'Ваші права', p: [
        'Ви маєте право на доступ до своїх даних, на їхнє виправлення чи видалення, на обмеження обробки, на перенесення даних і право заперечити проти обробки. Згоду на розсилку можна будь-коли відкликати; це не впливає на законність обробки до відкликання. Достатньо написати на info@carrietheswiss.com.',
        'Якщо ви вважаєте, що ми неправильно поводимося з вашими даними, можете подати скаргу до словацького наглядового органу, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, або до органу захисту даних у своїй країні ЄС.',
      ] },
    ],
  },
  hu: {
    link: 'Adatvédelem',
    title: 'Adatvédelmi tájékoztató',
    meta: 'Ki üzemelteti a Carrie the Swiss oldalt, milyen adatokat kezel a weboldal, és milyen jogaid vannak.',
    updated: 'Hatályos: 2026. november 6-tól',
    intro: 'Röviden és érthetően: az oldal nem használ követő sütiket, a látogatásokat névtelenül számoljuk, az e-mail-címedet pedig csak akkor tároljuk, ha feliratkozol, és megerősíted a feliratkozást.',
    sections: [
      { h: 'Ki felel az adataidért', p: ['A carrietheswiss.com weboldalt és a Carrie the Swiss hírlevelet Ing. Róbert Nagy üzemelteti. Kapcsolat: info@carrietheswiss.com.'] },
      { h: 'Hírlevél', p: [
        'Ha feliratkozol, kezeljük az e-mail-címedet és annak az oldalnak a nyelvét, ahol feliratkoztál, hogy elküldhessük neked a puskát, és időnként írhassunk az új epizódokról és a webshopról.',
        'Az adatkezelés jogalapja a hozzájárulásod (GDPR 6. cikk (1) bekezdés a) pont). A listára csak akkor kerülsz fel, ha rákattintasz a megerősítő e-mailben lévő linkre. Ha nem erősíted meg a feliratkozást, a címed nem kerül a listára.',
        'Az e-maileket a nevünkben a Brevo (Franciaország) küldi ki. A Brevo rögzítheti, hogy az e-mail megérkezett-e, megnyitották-e, és kattintottak-e benne linkre; mi csak az összesített számokat nézzük.',
        'A címedet addig tároljuk, amíg le nem iratkozol. Leiratkozhatsz bármelyik e-mailünk linkjével, vagy ha írsz az info@carrietheswiss.com címre.',
      ] },
      { h: 'Névtelen látogatásszámlálás', p: [
        'Hogy lássuk, mi működik az oldalon, névtelen eseményeket számolunk: az oldal megtekintését, hogy a látogatók mely jelenetekig jutottak el és melyik epizódot indították el, valamint a nyelvet, az eszköz típusát (telefon vagy számítógép), az országot és azt az oldalt, ahonnan érkeztél.',
        'Azt is számoljuk, hová kattintanak az oldalakon (csak hozzávetőleges helyként, durva rácson), meddig görgetnek, és mennyi ideig maradnak az egyes jeleneteknél, mindig csak napi összesítésként, soha nem egy adott látogatáshoz kötve.',
        'Nem tárolunk IP-címeket, és nem használunk sütiket vagy azonosítókat, így a számokból nem derül ki, ki vagy. Ha a böngésződ Global Privacy Control vagy Do Not Track jelzést küld, semmit sem küldünk el.',
      ] },
      { h: 'Kérdezd Carrie-t (chat)', p: ['A chatbe írt kérdéseidet elküldjük az Anthropic (USA) nevű MI-szolgáltatónak, hogy Carrie válaszolni tudjon. Mi nem tároljuk őket. Kérjük, ne írj személyes adatokat a chatbe.'] },
      { h: 'YouTube-videók', p: ['Az epizódokat a YouTube (Google) játssza le, fokozott adatvédelmi módban. A YouTube csak akkor töltődik be, amikor elindítasz egy videót; onnantól a Google a saját szabályai szerint kezeli az adatokat.'] },
      { h: 'Tárhely és biztonság', p: ['Az oldal a Cloudflare-en fut. Az oldalak kiszolgálásához és a támadások elleni védelemhez a Cloudflare technikailag kezeli az IP-címedet; mi nem tároljuk.'] },
      { h: 'Sütik és a böngésző tárolója', p: ['Az oldal nem használ sütiket. A zenelejátszó a böngésződ helyi tárolójában (localStorage) megjegyzi, szól-e a zene, melyik szám megy és mekkora a hangerő. Ezek az adatok soha nem hagyják el a böngésződet.'] },
      { h: 'Adattovábbítás az EU-n kívülre', p: ['A Brevo az EU-ban kezeli az adatokat. Az Anthropic, a Google és a Cloudflare amerikai cégek; az USA-ba irányuló adattovábbításnál általános szerződési feltételekre vagy az EU–USA adatvédelmi keretre támaszkodnak.'] },
      { h: 'A jogaid', p: [
        'Jogod van hozzáférni az adataidhoz, kérni a helyesbítésüket vagy törlésüket, kérni az adatkezelés korlátozását, továbbá jogod van az adathordozhatósághoz és a tiltakozáshoz. A hírlevélhez adott hozzájárulásodat bármikor visszavonhatod; ez nem érinti a visszavonás előtti adatkezelés jogszerűségét. Elég írnod az info@carrietheswiss.com címre.',
        'Ha úgy gondolod, hogy nem megfelelően kezeljük az adataidat, panaszt tehetsz a szlovák felügyeleti hatóságnál, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, vagy a saját EU-s országod adatvédelmi hatóságánál.',
      ] },
    ],
  },
  nl: {
    link: 'Privacy',
    title: 'Privacyverklaring',
    meta: 'Wie Carrie the Swiss beheert, welke gegevens de site verwerkt en welke rechten je hebt.',
    updated: 'Geldig vanaf 6 november 2026',
    intro: 'Kort en duidelijk: de site gebruikt geen trackingcookies, bezoeken tellen we anoniem en je e-mailadres bewaren we alleen als je je aanmeldt en de aanmelding bevestigt.',
    sections: [
      { h: 'Wie verantwoordelijk is', p: ['De site carrietheswiss.com en de nieuwsbrief van Carrie the Swiss worden beheerd door Ing. Róbert Nagy. Contact: info@carrietheswiss.com.'] },
      { h: 'Nieuwsbrief', p: [
        'Als je je aanmeldt, verwerken we je e-mailadres en de taal van de pagina waarop je dat doet, zodat we je het spiekbriefje en af en toe een e-mail over nieuwe afleveringen en de shop kunnen sturen.',
        'De rechtsgrond hiervoor is je toestemming (art. 6 lid 1 sub a AVG). Je komt pas op de lijst nadat je op de link in de bevestigingsmail hebt geklikt. Bevestig je niet, dan wordt je adres niet toegevoegd.',
        'De e-mails worden namens ons verstuurd door Brevo (Frankrijk). Brevo kan bijhouden of een e-mail is afgeleverd en geopend en of er op een link is geklikt; wij kijken alleen naar de totalen.',
        'We bewaren je adres tot je je afmeldt. Afmelden kan via de link in elke e-mail of met een bericht naar info@carrietheswiss.com.',
      ] },
      { h: 'Bezoeken anoniem tellen', p: [
        'Om te zien wat werkt op de site, tellen we anonieme gebeurtenissen: een paginabezoek, welke scènes mensen bereikten, welke aflevering ze afspeelden, de taal, het type apparaat (telefoon of computer), het land en de site waar je vandaan komt.',
        'We tellen ook waar op de pagina’s wordt geklikt (alleen een globale plek op een grof raster), hoe ver er wordt gescrold en hoe lang men bij elke scène blijft, altijd alleen als dagtotalen en nooit gekoppeld aan een bepaald bezoek.',
        'We slaan geen IP-adressen op en gebruiken geen cookies of identificatoren, dus uit de cijfers valt niet op te maken wie je bent. Stuurt je browser een Global Privacy Control- of Do Not Track-signaal mee, dan wordt er helemaal niets verstuurd.',
      ] },
      { h: 'Vraag het Carrie (chat)', p: ['Vragen die je in de chat typt, sturen we naar AI-aanbieder Anthropic (VS), zodat Carrie kan antwoorden. Wij bewaren ze niet. Typ alsjeblieft geen persoonsgegevens in de chat.'] },
      { h: 'YouTube-video’s', p: ['De afleveringen worden afgespeeld via YouTube (Google) in de privacy-geoptimaliseerde modus. YouTube wordt pas geladen als je een video start; daarna verwerkt Google gegevens volgens zijn eigen regels.'] },
      { h: 'Hosting en beveiliging', p: ['De site draait op Cloudflare. Om pagina’s af te leveren en tegen aanvallen te beschermen, verwerkt Cloudflare technisch je IP-adres; wij slaan het niet op.'] },
      { h: 'Cookies en browseropslag', p: ['De site plaatst geen cookies. De muziekspeler onthoudt in de opslag van je browser (localStorage) of de muziek aanstaat, welk nummer er speelt en op welk volume. Die gegevens verlaten je browser nooit.'] },
      { h: 'Doorgifte buiten de EU', p: ['Brevo verwerkt gegevens in de EU. Anthropic, Google en Cloudflare zijn Amerikaanse bedrijven; voor doorgifte naar de VS baseren ze zich op modelcontractbepalingen of op het EU–VS-kader voor gegevensbescherming.'] },
      { h: 'Jouw rechten', p: [
        'Je hebt recht op inzage in je gegevens, op rectificatie of wissing, op beperking van de verwerking, op overdraagbaarheid van je gegevens en op bezwaar. Je toestemming voor de nieuwsbrief kun je altijd intrekken; dat doet niets af aan de rechtmatigheid van de verwerking vóór de intrekking. Stuur gewoon een bericht naar info@carrietheswiss.com.',
        'Vind je dat we niet goed met je gegevens omgaan, dan kun je een klacht indienen bij de Slowaakse toezichthoudende autoriteit, Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava 27, dataprotection.gov.sk, of bij de toezichthouder voor gegevensbescherming in je eigen EU-land.',
      ] },
    ],
  },
};
