import en from './en.json';

const files = import.meta.glob('./*.json', { eager: true }) as Record<string, { default: typeof en }>;

export const LOCALES = ['en', 'sk', 'cs', 'de', 'pl', 'fr', 'it', 'es', 'uk', 'hu', 'nl'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English', sk: 'Slovenčina', cs: 'Čeština', de: 'Deutsch', pl: 'Polski',
  fr: 'Français', it: 'Italiano', es: 'Español', uk: 'Українська', hu: 'Magyar', nl: 'Nederlands',
};

export const HTML_LANG: Record<Locale, string> = {
  en: 'en', sk: 'sk', cs: 'cs', de: 'de', pl: 'pl', fr: 'fr', it: 'it', es: 'es', uk: 'uk', hu: 'hu', nl: 'nl',
};

type Dict = typeof en;

function deepMerge(base: any, over: any): any {
  if (typeof base !== 'object' || base === null) return over ?? base;
  const out: any = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(base)) if (over && k in over) out[k] = deepMerge(base[k], over[k]);
  return out;
}

/** Strings for a locale; any missing key falls back to English. */
export function t(locale: Locale): Dict {
  const f = files[`./${locale}.json`];
  return f ? deepMerge(en, f.default) : en;
}

export function availableLocales(): Locale[] {
  return LOCALES.filter((l) => l === 'en' || files[`./${l}.json`]);
}
