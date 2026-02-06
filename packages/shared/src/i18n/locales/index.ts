export { en, type TranslationKeys } from './en';
export { de } from './de';

export const resources = {
  en: { translation: {} as Record<string, unknown> },
  de: { translation: {} as Record<string, unknown> },
};

// Lazy load to support tree shaking
export async function loadLocale(locale: string): Promise<Record<string, unknown>> {
  switch (locale) {
    case 'de': {
      const { de } = await import('./de');
      return de;
    }
    case 'en':
    default: {
      const { en } = await import('./en');
      return en;
    }
  }
}

export const supportedLocales = ['en', 'de'] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export const localeNames: Record<SupportedLocale, string> = {
  en: 'English',
  de: 'Deutsch',
};
