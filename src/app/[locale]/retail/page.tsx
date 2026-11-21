import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { ArrowLink } from '@/components/ui/ArrowLink';

import { ikegami } from '@/content/business';
import { retailShops } from '@/content/shops';
import { getDictionary } from '@/content/dictionary';
import { isLocale, localePath, t, type L10n, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';

/**
 * 販売店 hub. Every shop is shown in the same format, in the client's order
 * (Nov 2026): イケガミストア → 京彩堂（ドラッグストア） → Kix Japan drug 泉佐野店
 * → 小町着物レンタル. Each block links to the shop's own page.
 */
type Entry = {
  key: string;
  href: string;
  romaji: string;
  category: L10n;
  name: L10n;
  lede?: L10n;
  image?: string;
  imageFocus?: string;
};

const TITLE = { ja: '販売店', en: 'Shops' };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : 'ja';
  return pageMeta({
    locale: active,
    path: '/retail',
    image: ikegami.image,
    title: t(TITLE, active),
    description: t(ikegami.lede, active),
  });
}

export default async function RetailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const active = locale as Locale;
  const dict = getDictionary(active);
  const en = active === 'en';

  const entries: Entry[] = [
    {
      key: 'ikegami-store',
      href: '/retail/ikegami-store',
      romaji: 'Ikegami Store — Drugstore',
      category: { ja: 'ドラッグストア', en: 'Drugstore' },
      name: ikegami.name,
      lede: ikegami.lede,
      image: ikegami.image,
    },
    ...retailShops.map((s) => ({
      key: s.slug,
      href: `/retail/${s.slug}`,
      romaji: s.romaji,
      category: s.category,
      name: s.name,
      lede: s.lede,
      image: s.image,
      imageFocus: s.imageFocus,
    })),
  ];

  return (
    <>
      <section className="bg-page-2 pt-14 pb-16 md:pt-20 md:pb-20">
        <div className="shell text-center">
          <p className="type-eyebrow">Shop</p>
          <h1 className="type-display mt-4 text-[clamp(1.75rem,4.4vw,3.25rem)] text-ink">{t(TITLE, active)}</h1>
        </div>
      </section>

      {entries.map((entry, i) => {
        const href = localePath(active, entry.href);
        const name = t(entry.name, active);
        return (
          <section key={entry.key} id={entry.key} className="relative border-t border-ink/10 py-20 md:py-28">
            <div className="shell-wide">
              <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal direction={i % 2 === 1 ? 'left' : 'right'}>
                  <Link href={href} className="group block">
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-page-3">
                      {entry.image ? (
                        <Image
                          src={entry.image}
                          alt={name}
                          fill
                          priority={i === 0}
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                          style={entry.imageFocus ? { objectPosition: entry.imageFocus } : undefined}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-[0.9375rem] tracking-[0.2em] text-stone">
                          {en ? 'Photos coming soon' : '写真準備中'}
                        </div>
                      )}
                    </div>
                  </Link>
                </Reveal>

                <div>
                  <Reveal>
                    <p className="type-eyebrow">{entry.romaji}</p>
                  </Reveal>
                  <Reveal delay={0.04}>
                    <p className="type-mincho mt-5 text-[1.0625rem] text-brass">{t(entry.category, active)}</p>
                  </Reveal>
                  <SplitText
                    as="h2"
                    text={name}
                    delay={0.06}
                    className="type-display mt-3 text-[clamp(1.5rem,3.6vw,2.5rem)] text-ink"
                  />
                  <Reveal delay={0.2}>
                    <p className="type-body mt-6 max-w-xl whitespace-pre-line">
                      {entry.lede ? t(entry.lede, active) : en ? 'Store details coming soon.' : '店舗情報は近日公開予定です。'}
                    </p>
                  </Reveal>
                  <Reveal delay={0.28} className="mt-10">
                    <ArrowLink href={href}>{dict.common.viewMore}</ArrowLink>
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
