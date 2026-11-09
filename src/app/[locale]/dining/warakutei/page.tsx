import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { ArrowLink } from '@/components/ui/ArrowLink';
import { Gallery } from '@/components/ui/Gallery';

import { getVenue, type Venue } from '@/content/dining';
import { getDictionary } from '@/content/dictionary';
import { isLocale, localePath, t, type Locale } from '@/lib/i18n';

/**
 * 和楽亭 — the live site's /restaurant page: one page for both Ariake
 * restaurants, a section each for 焼肉 and 焼鳥 with its logo, heading,
 * introduction, photo and a 詳しく見る link to that restaurant's own page.
 */
const range = (prefix: string, n: number) =>
  Array.from({ length: n }, (_, i) => `/images/warakutei/${prefix}-${String(i + 1).padStart(2, '0')}.webp`);

/** Every Warakutei photo is shown: all 10 焼肉 and all 4 焼鳥 pictures. */
const SECTIONS: { slug: Venue['slug']; logo: string; image: string; photos: string[] }[] = [
  {
    slug: 'warakutei-yakiniku',
    logo: '/images/warakutei/logo-yakiniku-b.svg',
    image: '/images/warakutei/yakiniku-03.webp',
    photos: range('yakiniku', 10),
  },
  {
    slug: 'warakutei-yakitori',
    logo: '/images/warakutei/logo-yakitori-b.svg',
    image: '/images/warakutei/yakitori-02.webp',
    photos: range('yakitori', 4),
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '和楽亭（焼肉、焼鳥）',
    description: '東京・有明（国際展示場から徒歩7分）の和牛焼肉店と焼き鳥居酒屋、和楽亭。',
  };
}

export default async function WarakuteiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const active = locale as Locale;
  const dict = getDictionary(active);

  return (
    <>
      <PageHero
        eyebrow="WARAKUTEI — 東京・有明"
        title="和楽亭"
        lead="焼肉・焼鳥"
        image="/images/warakutei/yakiniku-01.webp"
        alt="和楽亭"
      />

      {/* The group logo is white artwork: shown inverted (black) on the light page. */}
      <div className="flex justify-center pt-16 md:pt-24">
        <Image src="/images/warakutei/logo-group.webp" alt="和楽亭" width={900} height={307} className="h-auto w-56 invert md:w-72 dark:invert-0" />
      </div>

      {SECTIONS.map((section, i) => {
        const venue = getVenue(section.slug);
        if (!venue) return null;
        const href = localePath(active, `/dining/${venue.slug}`);
        return (
          <section key={venue.slug} id={venue.slug} className="relative py-24 md:py-32">
            <div className="shell-wide">
              <div className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20 ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal direction={i % 2 === 1 ? 'left' : 'right'}>
                  <a href={href} className="group block">
                    <div className="relative aspect-[3/2] w-full overflow-hidden">
                      <Image
                        src={section.image}
                        alt={t(venue.name, active)}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      />
                    </div>
                  </a>
                </Reveal>

                <div>
                  <Reveal>
                    <Image src={section.logo} alt={t(venue.name, active)} width={2154} height={873} className="h-auto w-48 md:w-56 dark:hidden" />
                    <Image src={section.logo.replace('-b.svg', '-a.svg')} alt={t(venue.name, active)} width={2154} height={873} className="hidden h-auto w-48 md:w-56 dark:block" />
                  </Reveal>
                  {venue.hub.title && (
                    <Reveal delay={0.08}>
                      <h2 className="type-mincho mt-8 text-[1.375rem] text-ink">{t(venue.hub.title, active)}</h2>
                    </Reveal>
                  )}
                  <Reveal delay={0.14}>
                    <p className="type-body mt-6 max-w-xl whitespace-pre-line">{t(venue.hub.body, active)}</p>
                  </Reveal>
                  <Reveal delay={0.2} className="mt-10">
                    <ArrowLink href={href}>{dict.common.viewMore}</ArrowLink>
                  </Reveal>
                </div>
              </div>

              <div className="mt-14 md:mt-20">
                <Gallery items={section.photos.map((src) => ({ src, alt: t(venue.name, active) }))} closeLabel={dict.common.close} />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
