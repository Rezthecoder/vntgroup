import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { ArrowLink } from '@/components/ui/ArrowLink';

import { getVenue } from '@/content/dining';
import { getShop } from '@/content/shops';
import { getDictionary } from '@/content/dictionary';
import { isLocale, localePath, t, type L10n, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';

// First sentence of the live site's 飲食店事業 description.
const INTRO = {
  ja: '食を通じて日本文化を体感できる場所の創出に取り組んでいます。',
  en: 'We create places where Japanese culture can be experienced through food.',
};

/**
 * 飲食店 page, in the client's order (Nov 2026):
 *   1. 芸者亭  2. 和楽亭 (2.1 焼肉, 2.2 焼鳥)  3. 堺花月
 * Every restaurant uses the same block. Shops (販売店) are not shown here;
 * they have their own page at /retail.
 */
type Sub = { key: string; href: string; image: string; label: L10n; name: L10n };
type Entry = {
  key: string;
  href: string;
  eyebrow: L10n;
  name: L10n;
  title?: L10n;
  body?: L10n;
  image: string;
  /** 和楽亭 only: its two restaurants, shown as 2.1 / 2.2 under the block. */
  subs?: Sub[];
};

const WARAKUTEI_BODY: L10n = {
  ja: '東京・有明（国際展示場から徒歩7分）に、和牛焼肉店と焼き鳥居酒屋の2店舗を展開しています。',
  en: 'In Ariake, Tokyo — seven minutes on foot from Tokyo Big Sight — we run two restaurants: a wagyu yakiniku restaurant and a yakitori izakaya.',
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ja = locale === 'ja';
  return pageMeta({
    locale: ja ? 'ja' : 'en',
    path: '/dining',
    image: '/images/geisya/geisya-01.webp',
    title: ja ? '飲食店' : 'Restaurants',
    description: ja ? INTRO.ja : INTRO.en,
  });
}

function buildEntries(): Entry[] {
  const geisha = getVenue('geisyatei');
  const yakiniku = getVenue('warakutei-yakiniku');
  const yakitori = getVenue('warakutei-yakitori');
  const kagetsu = getShop('sakai-kagetsu', 'dining');
  const entries: Entry[] = [];

  if (geisha)
    entries.push({
      key: geisha.slug,
      href: `/dining/${geisha.slug}`,
      eyebrow: { ja: `${geisha.romaji} — ${geisha.area.ja}`, en: `${geisha.romaji} — ${geisha.area.en ?? geisha.area.ja}` },
      name: geisha.name,
      title: geisha.hub.title,
      body: geisha.hub.body,
      image: geisha.hub.image,
    });

  if (yakiniku && yakitori)
    entries.push({
      key: 'warakutei',
      href: '/dining/warakutei',
      eyebrow: { ja: 'WARAKUTEI — 東京・有明', en: 'WARAKUTEI — Ariake, Tokyo' },
      name: { ja: '和楽亭', en: 'Warakutei' },
      title: { ja: '焼肉・焼鳥', en: 'Yakiniku & yakitori' },
      body: WARAKUTEI_BODY,
      image: '/images/warakutei/yakiniku-01.webp',
      subs: [
        { key: yakiniku.slug, href: `/dining/${yakiniku.slug}`, image: yakiniku.hub.image, label: { ja: '焼肉', en: 'Yakiniku' }, name: yakiniku.name },
        { key: yakitori.slug, href: `/dining/${yakitori.slug}`, image: yakitori.hub.image, label: { ja: '焼鳥', en: 'Yakitori' }, name: yakitori.name },
      ],
    });

  if (kagetsu?.image)
    entries.push({
      key: kagetsu.slug,
      href: `/dining/${kagetsu.slug}`,
      eyebrow: { ja: kagetsu.romaji, en: kagetsu.romaji },
      name: kagetsu.name,
      title: kagetsu.category,
      body: kagetsu.lede,
      image: kagetsu.image,
    });

  return entries;
}

export default async function DiningPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const active = locale as Locale;
  const dict = getDictionary(active);
  const entries = buildEntries();

  return (
    <>
      <PageHero eyebrow="Restaurants" title={'RESTAURANTS'} lead={INTRO[active]} image="/images/geisya/geisya-01.webp" />

      {entries.map((entry, i) => {
        const href = localePath(active, entry.href);
        const name = t(entry.name, active);
        return (
          <section key={entry.key} id={entry.key} className="relative border-t border-ink/10 py-24 md:py-32">
            <div className="shell-wide">
              <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal direction={i % 2 === 1 ? 'left' : 'right'}>
                  <Link href={href} className="group block">
                    <div className="relative aspect-4/3 w-full overflow-hidden">
                      <Image
                        src={entry.image}
                        alt={name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    </div>
                  </Link>
                </Reveal>

                <div>
                  <Reveal>
                    <p className="type-eyebrow">
                      <span className="mr-3 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      {t(entry.eyebrow, active)}
                    </p>
                  </Reveal>
                  <SplitText
                    as="h2"
                    text={name}
                    delay={0.06}
                    className="type-display mt-5 text-[clamp(1.5rem,3.6vw,2.75rem)] text-ink"
                  />
                  {entry.title && (
                    <Reveal delay={0.14}>
                      <p className="type-mincho mt-5 text-[1.1875rem] text-brass">{t(entry.title, active)}</p>
                    </Reveal>
                  )}
                  {entry.body && (
                    <Reveal delay={0.2}>
                      <p className="type-body mt-6 max-w-xl whitespace-pre-line">{t(entry.body, active)}</p>
                    </Reveal>
                  )}

                  {entry.subs && (
                    <Reveal delay={0.24}>
                      <ul className="mt-8 grid max-w-xl grid-cols-2 gap-4">
                        {entry.subs.map((sub, j) => (
                          <li key={sub.key}>
                            <Link
                              href={localePath(active, sub.href)}
                              className="group block border border-ink/12 transition-colors hover:border-brass"
                            >
                              <div className="relative aspect-[3/2] w-full overflow-hidden">
                                <Image src={sub.image} alt={t(sub.name, active)} fill sizes="(max-width: 1024px) 50vw, 18rem" className="object-cover" />
                              </div>
                              <div className="p-4">
                                <p className="text-[0.875rem] text-brass">
                                  {`${i + 1}.${j + 1}　${t(sub.label, active)}`}
                                </p>
                                <p className="type-display mt-1 text-[1.0625rem] text-ink group-hover:text-brass">{t(sub.name, active)}</p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  )}

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
