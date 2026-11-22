import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { HomeHero } from '@/components/home/HomeHero';
import { BusinessCards } from '@/components/home/BusinessCards';
import { SupplierCall } from '@/components/sections/SupplierCall';
import { Reveal } from '@/components/motion/Reveal';

import { getDictionary } from '@/content/dictionary';
import { retailShops } from '@/content/shops';
import { isLocale, localePath, t, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** A photo tile. With no image (a shop whose photos haven't arrived) it is a plain ink tile. */
type Strip = { href: string; image?: string; imageFocus?: string; name: string; mincho?: boolean };

/**
 * The live home page, section for section: hero, BUSINESS, HOTEL, FOOD &
 * SHOP, then the supplier panel. Fixes over the live build: no "Type
 * Something" placeholder, a photo in the empty 商品企画 slot, and a real
 * photograph on the FUJI PREMIUM HOTEL tile (live shows a cropped logo).
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const hotelStrip: Strip[] = [
    { href: '/hotels/fuji', image: '/images/live/fuji/u6.jpg', name: 'FUJI PREMIUM HOTEL' },
    { href: '/hotels/nagoya', image: '/images/nagoya/castle-01.webp', name: 'NAGOYA PREMIUM HOTEL' },
    { href: '/hotels/toji', image: '/images/toji/toji-01.webp', name: 'PREMIUM TOJI' },
  ];

  // FOOD & SHOP shows every restaurant and shop (client request, 23 Nov 2026):
  // restaurants in one row, shops in the next, in the same order as their pages.
  const foodStrip: Strip[] = [
    { href: '/dining/geisyatei', image: '/images/geisya/geisya-01.webp', name: locale === 'ja' ? '芸者亭' : 'Geisha-tei', mincho: true },
    { href: '/dining/warakutei', image: '/images/warakutei/yakiniku-01.webp', name: locale === 'ja' ? '和楽亭' : 'Warakutei', mincho: true },
    { href: '/dining/sakai-kagetsu', image: '/images/shops/sakai-kagetsu-card-v2.webp', name: locale === 'ja' ? '堺花月' : 'Sakai Kagetsu', mincho: true },
  ];
  const shopStrip: Strip[] = [
    { href: '/retail/ikegami-store', image: '/images/ikegami/store-01.webp', name: locale === 'ja' ? 'イケガミストア' : 'Ikegami Store', mincho: true },
    ...retailShops.map((s) => ({
      href: `/retail/${s.slug}`,
      image: s.image,
      imageFocus: s.imageFocus,
      name: t(s.name, locale),
      mincho: true,
    })),
  ];

  return (
    <>
      <HomeHero
        line1={dict.home.heroLine1}
        line2={dict.home.heroLine2}
        intro={dict.home.intro}
        cta={dict.home.heroCta}
        ctaHref={localePath(locale, '/contact')}
      />

      <section id="business" className="px-5 pt-20 pb-24 md:pt-24 md:pb-36">
        <SectionTitle sub={locale === 'ja' ? '事業紹介' : 'What we do'}>BUSINESS</SectionTitle>
        <div className="mt-12 md:mt-14">
          <BusinessCards locale={locale} viewMore={dict.common.viewMore} />
        </div>
      </section>

      <section id="hotel" className="pb-20 md:pb-28">
        <SectionTitle sub={locale === 'ja' ? 'ホテル' : 'Hotels'}>HOTEL</SectionTitle>
        <PhotoStrip items={hotelStrip} locale={locale} />
        <GroupNote
          body={dict.home.groupHotel}
          more={{ href: localePath(locale, '/hotels'), label: dict.common.viewMore }}
          contact={{ href: localePath(locale, '/contact'), label: dict.contact.title }}
        />
      </section>

      <section id="foodshop" className="pb-8 md:pb-12">
        <SectionTitle sub={locale === 'ja' ? '飲食店・販売店' : 'Restaurants & shops'}>FOOD &amp; SHOP</SectionTitle>
        <PhotoStrip items={foodStrip} locale={locale} compact />
        <PhotoStrip items={shopStrip} locale={locale} cols={4} joined compact />
        <GroupNote
          body={dict.home.groupDining}
          more={{ href: localePath(locale, '/dining'), label: dict.common.viewMore }}
          contact={{ href: localePath(locale, '/contact'), label: dict.contact.title }}
        />
      </section>

      <SupplierCall locale={locale} />
    </>
  );
}

function SectionTitle({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <Reveal className="text-center">
      <h2 className="type-section text-[clamp(2.1rem,2.8vw,2.75rem)] text-ink">{children}</h2>
      <span aria-hidden className="ornament" />
      {sub && <p className="mt-3 text-[0.9375rem] tracking-[0.3em] text-brass">{sub}</p>}
    </Reveal>
  );
}

/** Full-bleed row of photos with the name set in the middle, lifted on a soft shadow.
 *  `joined` sits the row directly under the one before it (FOOD & SHOP's second row). */
function PhotoStrip({
  items,
  locale,
  cols = 3,
  joined = false,
  compact = false,
}: {
  items: Strip[];
  locale: Locale;
  cols?: 3 | 4;
  joined?: boolean;
  /** Phone: two tiles per row instead of one (FOOD & SHOP has seven). */
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        'grid shadow-[0_24px_40px_-12px_rgba(0,0,0,0.25)]',
        compact && 'grid-cols-2',
        cols === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3',
        joined ? 'border-t border-page' : 'mt-12 md:mt-14',
      )}
    >
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={localePath(locale, item.href)}
          className={cn(
            'group relative block overflow-hidden border-page',
            compact
              ? // Phone: two per row; a lone last tile spans the row.
                cn(
                  'h-[11rem] border-l [&:nth-child(2n+1)]:border-l-0 md:[&:nth-child(2n+1)]:border-l md:first:border-l-0',
                  items.length % 2 === 1 && i === items.length - 1 && 'col-span-2 md:col-span-1',
                  i >= 2 && 'border-t md:border-t-0',
                )
              : 'h-[15rem] md:border-l first:md:border-l-0',
            cols === 4 ? 'md:h-[min(20vw,17rem)]' : 'md:h-[min(25vw,22.5rem)]',
          )}
        >
          {item.image ? (
            <Image
              src={item.image}
              alt=""
              fill
              sizes={`(max-width: 768px) ${compact ? '50vw' : '100vw'}, ${cols === 4 ? '25vw' : '33vw'}`}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={item.imageFocus ? { objectPosition: item.imageFocus } : undefined}
            />
          ) : (
            <span className="absolute inset-0 bg-sumi" />
          )}
          <span className="absolute inset-0 bg-sumi/35 transition-colors duration-500 group-hover:bg-sumi/50" />
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center px-4 text-center text-washi [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]',
              item.mincho
                ? 'type-mincho text-[clamp(1.15rem,1.7vw,1.6rem)]'
                : 'font-latin text-[clamp(1.1rem,1.6vw,1.6rem)] font-medium tracking-[0.12em]',
            )}
          >
            {item.name}
          </span>
        </Link>
      ))}
    </div>
  );
}

function GroupNote({
  body,
  more,
  contact,
}: {
  body: string;
  more: { href: string; label: string };
  contact: { href: string; label: string };
}) {
  return (
    <Reveal className="mx-auto mt-10 max-w-[76.25rem] px-5 md:mt-12">
      <p className="text-[1rem] leading-[1.95] whitespace-pre-line text-ink-mute">{body}</p>
      <div className="mt-6 flex justify-end gap-5">
        <Link href={more.href} className="btn-pill">
          {more.label}
        </Link>
        <Link href={contact.href} className="btn-pill btn-pill-brand">
          {contact.label}
        </Link>
      </div>
    </Reveal>
  );
}
