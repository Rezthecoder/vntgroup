'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { switchLocalePath, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** 日本語 | EN — the same page in the other language. */
export function LangSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const item = (to: Locale, label: string) => (
    <Link
      href={switchLocalePath(pathname, to)}
      hrefLang={to}
      lang={to}
      aria-current={locale === to ? 'true' : undefined}
      className={cn(
        'rounded-full px-2.5 py-1 text-[0.75rem] font-bold tracking-[0.06em] transition-colors',
        locale === to ? 'bg-ink text-page' : 'text-ink-mute hover:text-ink',
      )}
    >
      {label}
    </Link>
  );
  return (
    <div role="group" aria-label="Language" className={cn('glass-panel inline-flex items-center gap-0.5 rounded-full p-0.5', className)}>
      {item('ja', '日本語')}
      {item('en', 'EN')}
    </div>
  );
}
