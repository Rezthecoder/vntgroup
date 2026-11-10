/**
 * Japanese (default) and English. English was removed on 6 Nov 2026 and
 * brought back on 10 Nov 2026 (boss agreed). Any string without an `en`
 * version falls back to Japanese.
 */
export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ja';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** A string in Japanese, with its English version where one exists. */
export type L10n = { ja: string; en?: string };

/** Pull the active language out of an `L10n` value (English falls back to Japanese). */
export function t(value: L10n, locale: Locale = 'ja'): string {
  return locale === 'en' ? (value.en ?? value.ja) : value.ja;
}

/** The same page in the other language. */
export function switchLocalePath(pathname: string, to: Locale): string {
  const rest = pathname.replace(/^\/(ja|en)(?=\/|$)/, '');
  return `/${to}${rest}`;
}

/** Prefix an app-relative path with the active locale. */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}
