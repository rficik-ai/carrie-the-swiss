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
    updated: 'Platné od 5. 11. 2026',
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
    updated: 'Effective 5 November 2026',
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
};
