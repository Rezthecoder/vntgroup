'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navigation, site } from '@/content/site';
import { localePath, t, type Locale } from '@/lib/i18n';

/** Hotel pages have their own header; they place this under it themselves. */
const HOTEL_PAGE = /^\/(ja|en)\/hotels\/[^/]+\/?$/;

const EXTRA: Record<string, { ja: string; en: string }> = {
  '/news': { ja: 'お知らせ', en: 'News' },
};

/** Path → label, from the menu (top-level labels win over child labels). */
function labelFor(path: string, locale: Locale): string | undefined {
  for (const item of navigation) if (item.href === path) return t(item.label, locale);
  for (const item of navigation) for (const c of item.children ?? []) if (c.href === path) return t(c.label, locale);
  return EXTRA[path] ? t(EXTRA[path], locale) : undefined;
}

/**
 * ホーム ＞ ホテル ＞ Fuji Premium Hotel — a small trail under the header on
 * every page except home, plus BreadcrumbList structured data for search.
 */
export function Breadcrumbs({ locale, inHotel = false }: { locale: Locale; inHotel?: boolean }) {
  const pathname = usePathname() ?? '';
  if (HOTEL_PAGE.test(pathname) !== inHotel) return null;

  const rest = pathname.replace(/^\/(ja|en)/, '').replace(/\/$/, '');
  if (!rest) return null; // home

  const parts = rest.split('/').filter(Boolean);
  const crumbs = [{ href: '/', label: locale === 'ja' ? 'ホーム' : 'Home' }];
  parts.forEach((_, i) => {
    const href = '/' + parts.slice(0, i + 1).join('/');
    const label = labelFor(href, locale);
    if (label) crumbs.push({ href, label });
  });
  if (crumbs.length < 2) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: site.url + localePath(locale, c.href),
    })),
  };

  return (
    <nav aria-label={locale === 'ja' ? 'パンくずリスト' : 'Breadcrumb'} className="bg-page px-5 md:px-10">
      <ol className="mx-auto flex max-w-[76rem] flex-wrap items-center gap-x-2 gap-y-1 py-3 text-[0.8125rem] tracking-[0.06em] text-stone">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-ink-mute">
                  {c.label}
                </span>
              ) : (
                <Link href={localePath(locale, c.href)} className="underline-offset-4 transition-colors hover:text-brand hover:underline">
                  {c.label}
                </Link>
              )}
              {!last && (
                <span aria-hidden className="text-ink/25">
                  ＞
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
