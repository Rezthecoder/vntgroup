'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { switchLocalePath, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * 日本語 | EN — one big tap target: the whole pill links to the same page in
 * the other language (44px tall, so it is easy to hit with a thumb). The
 * current language is the filled half.
 */
export function LangSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const other: Locale = locale === 'ja' ? 'en' : 'ja';
  const half = (lang: Locale, label: string) => (
    <span
      lang={lang}
      className={cn(
        'flex h-full items-center rounded-full px-3 text-[0.875rem] font-bold tracking-[0.04em] whitespace-nowrap transition-colors',
        locale === lang ? 'bg-ink text-page' : 'text-ink-mute group-hover:text-ink',
      )}
    >
      {label}
    </span>
  );
  return (
    <Link
      href={switchLocalePath(pathname, other)}
      hrefLang={other}
      aria-label={other === 'en' ? 'English' : '日本語'}
      className={cn(
        'group glass-panel liquid-press inline-flex h-11 shrink-0 items-center gap-0.5 rounded-full p-1 select-none',
        className,
      )}
    >
      {half('ja', '日本語')}
      {half('en', 'EN')}
    </Link>
  );
}
