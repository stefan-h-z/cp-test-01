import { useCallback, useMemo } from 'react';
import { useTranslation as useI18nTranslation, Trans } from 'react-i18next';
import { i18n } from './config';
import { supportedLocales, localeNames, type SupportedLocale } from './locales';

// Type-safe translation hook
export function useTranslation() {
  const { t, i18n: i18nInstance, ready } = useI18nTranslation();

  const currentLocale = i18nInstance.language as SupportedLocale;

  const changeLanguage = useCallback(
    async (locale: SupportedLocale) => {
      await i18nInstance.changeLanguage(locale);
    },
    [i18nInstance]
  );

  const formatDate = useCallback(
    (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
      const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      return new Intl.DateTimeFormat(currentLocale, options).format(dateObj);
    },
    [currentLocale]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(currentLocale, options).format(value);
    },
    [currentLocale]
  );

  const formatCurrency = useCallback(
    (value: number, currency = 'USD') => {
      return new Intl.NumberFormat(currentLocale, {
        style: 'currency',
        currency,
      }).format(value);
    },
    [currentLocale]
  );

  const formatRelativeTime = useCallback(
    (date: Date | string | number) => {
      const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

      const rtf = new Intl.RelativeTimeFormat(currentLocale, { numeric: 'auto' });

      if (Math.abs(diffInSeconds) < 60) {
        return rtf.format(-diffInSeconds, 'second');
      }
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (Math.abs(diffInMinutes) < 60) {
        return rtf.format(-diffInMinutes, 'minute');
      }
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (Math.abs(diffInHours) < 24) {
        return rtf.format(-diffInHours, 'hour');
      }
      const diffInDays = Math.floor(diffInHours / 24);
      if (Math.abs(diffInDays) < 30) {
        return rtf.format(-diffInDays, 'day');
      }
      const diffInMonths = Math.floor(diffInDays / 30);
      if (Math.abs(diffInMonths) < 12) {
        return rtf.format(-diffInMonths, 'month');
      }
      const diffInYears = Math.floor(diffInMonths / 12);
      return rtf.format(-diffInYears, 'year');
    },
    [currentLocale]
  );

  return {
    t,
    i18n: i18nInstance,
    ready,
    currentLocale,
    changeLanguage,
    supportedLocales,
    localeNames,
    // Formatters
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime,
  };
}

// Hook for language selection
export function useLanguage() {
  const { currentLocale, changeLanguage, supportedLocales, localeNames } = useTranslation();

  const languages = useMemo(
    () =>
      supportedLocales.map((locale) => ({
        code: locale,
        name: localeNames[locale],
        isActive: locale === currentLocale,
      })),
    [currentLocale, localeNames, supportedLocales]
  );

  return {
    currentLocale,
    languages,
    changeLanguage,
  };
}

// Direct access to i18n functions (for use outside React components)
export function t(key: string, options?: Record<string, unknown>): string {
  return i18n.t(key, options);
}

export function changeLanguage(locale: SupportedLocale): Promise<void> {
  return i18n.changeLanguage(locale) as unknown as Promise<void>;
}

export function getCurrentLocale(): SupportedLocale {
  return i18n.language as SupportedLocale;
}

// Re-export Trans component for complex translations
export { Trans };
