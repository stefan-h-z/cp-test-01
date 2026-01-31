// Configuration
export { initI18n, getI18n, isI18nInitialized, i18n, type I18nConfig } from './config';

// Hooks
export {
  useTranslation,
  useLanguage,
  t,
  changeLanguage,
  getCurrentLocale,
  Trans,
} from './hooks';

// Locales
export {
  en,
  de,
  supportedLocales,
  localeNames,
  loadLocale,
  type SupportedLocale,
  type TranslationKeys,
} from './locales';
