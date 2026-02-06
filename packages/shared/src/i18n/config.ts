import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { supportedLocales, type SupportedLocale } from './locales';
import { de } from './locales/de';
import { en } from './locales/en';

export interface I18nConfig {
  defaultLocale?: SupportedLocale;
  fallbackLocale?: SupportedLocale;
  debug?: boolean;
  detectLanguage?: boolean;
}

const defaultConfig: I18nConfig = {
  defaultLocale: 'en',
  fallbackLocale: 'en',
  debug: false,
  detectLanguage: true,
};

let isInitialized = false;

export function initI18n(config: I18nConfig = {}): typeof i18n {
  if (isInitialized) {
    return i18n;
  }

  const mergedConfig = { ...defaultConfig, ...config };

  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
    lng: mergedConfig.defaultLocale,
    fallbackLng: mergedConfig.fallbackLocale,
    debug: mergedConfig.debug,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },
    supportedLngs: [...supportedLocales],
    load: 'languageOnly', // Load 'en' instead of 'en-US'
  });

  isInitialized = true;
  return i18n;
}

export function getI18n(): typeof i18n {
  if (!isInitialized) {
    return initI18n();
  }
  return i18n;
}

export function isI18nInitialized(): boolean {
  return isInitialized;
}

export { i18n };
