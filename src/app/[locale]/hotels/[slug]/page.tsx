import { Fragment, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { VideoEmbed } from '@/components/ui/VideoEmbed';
import { Reveal } from '@/components/motion/Reveal';
import { MapEmbed } from '@/components/ui/MapEmbed';
import { HeroSlider } from '@/components/hotel/HeroSlider';
import { HotelHeader } from '@/components/hotel/HotelHeader';
import { PhotoMarquee } from '@/components/hotel/PhotoMarquee';
import { RoomGallery } from '@/components/hotel/RoomGallery';

import { getHotel, hotels } from '@/content/hotels';
import { getStay, type Feature, type PhotoCredit, type RouteMode, type Season } from '@/content/hotelStay';
import { getDictionary } from '@/content/dictionary';
import { isLocale, locales, localePath, t, type L10n, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function generateStaticParams() {
  return locales.flatMap((locale) => hotels.map((h) => ({ locale, slug: h.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const hotel = getHotel(slug);
  if (!hotel) return {};
  const active: Locale = isLocale(locale) ? locale : 'ja';
  const title = hotel.pageTitle ?? hotel.name;

  return {
    title,
    description: t(hotel.about.body, active).replace(/\s+/g, ' ').slice(0, 150),
    openGraph: { title, images: [hotel.hero] },
  };
}

/** Clears the pinned link row when an in-page link lands. */
const ANCHOR = 'scroll-mt-16 md:scroll-mt-14';

const S = {
  rooms: { ja: '客室', en: 'Guest rooms' },
  roomsSub: { ja: '客室紹介', en: 'Our rooms' },
  dining: { ja: 'お食事', en: 'Dining' },
  diningSub: { ja: 'お食事のご案内', en: 'Dining guide' },
  access: { ja: 'アクセス', en: 'Access' },
  accessSub: { ja: 'アクセス情報', en: 'How to get here' },
  sightseeing: { ja: '周辺観光', en: 'Sightseeing' },
  overview: { ja: 'ホテル概要', en: 'About the hotel' },
  groups: { ja: '家族、グループ、企業イベントに最適', en: 'For families, groups and company events' },
  groupsTitle: { ja: 'ご家族のご旅行から、\n企業の研修・団体旅行まで。', en: 'From family trips\nto company training and group tours.' },
  groupsBody1: {
    ja: '団体のお客様には、人数やご予算に合わせたプランをご提案いたします。研修旅行、社員旅行、ツアーのご宿泊など、お気軽にご相談ください。',
    en: 'For groups we put together a plan to suit your numbers and budget — training trips, company outings, tour stays and more.',
  },
  groupsBody2: {
    ja: '団体予約・お見積りは団体受付までお電話ください。メールでのお問い合わせも承っております。',
    en: 'For group bookings and quotes, call the group desk or send us an email enquiry.',
  },
  groupDesk: { ja: '団体受付', en: 'Group desk' },
  features: { ja: '8つの魅力', en: 'Eight things to love' },
  spotsMore: { ja: '周辺観光をもっと見る', en: 'More sightseeing' },
  fromHotel: { ja: 'ホテルから', en: 'From the hotel' },
  viewMap: { ja: '地図で見る', en: 'View on map' },
  officialSite: { ja: '公式サイト', en: 'Official site' },
  events: { ja: '季節の行事', en: 'Seasonal events' },
  eventsLead: { ja: '四季折々の祭りや行事に合わせて、旅の日程を選ぶのもおすすめです。', en: 'Plan your trip around the festivals of each season.' },
  when: { ja: '開催日／', en: 'When: ' },
  where: { ja: '開催場所／', en: 'Where: ' },
  inside: { ja: 'ホテル内景色', en: 'Inside the hotel' },
  around: { ja: 'ホテル周辺景色', en: 'Around the hotel' },
  accessInfo: { ja: 'アクセス情報', en: 'Access details' },
  hotelInfo: { ja: 'ホテル情報', en: 'Hotel information' },
  routes: { ja: '交通のご案内', en: 'Getting here' },
  routeGuide: { ja: 'ルート案内', en: 'Route guide' },
  services: { ja: 'サービス内容', en: 'Services' },
  amenities: { ja: '客室設備', en: 'In the room' },
  telLabel: { ja: '電話', en: 'Tel' },
  faxLabel: { ja: 'FAX', en: 'Fax' },
  checkIn: { ja: 'チェックイン', en: 'Check-in' },
  checkOut: { ja: 'チェックアウト', en: 'Check-out' },
  parking: { ja: '駐車場', en: 'Parking' },
  frontDesk: { ja: '受付時間：24時間（フロント）', en: 'Front desk: 24 hours' },
  timeNote: { ja: '※所要時間は目安です。交通状況により異なります。', en: '* Travel times are approximate.' },
  eventsNote: { ja: '※開催日程は年により変わります。最新情報をご確認ください。', en: '* Dates change each year.' },
  contactForm: { ja: 'お問い合わせフォームへ', en: 'Contact form' },
  area: { ja: 'エリア情報', en: 'Area information' },
  addressLabel: { ja: '住所', en: 'Address' },
  hours: { ja: '営業時間', en: 'Hours' },
} satisfies Record<string, L10n>;

const SEASON: Record<Season, string> = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };
/** Traditional seasonal tones: 桜 (sakura), 藍 (indigo), 紅葉 (maple), 銀鼠 (snow grey). */
const SEASON_COLOR: Record<Season, string> = { spring: '#c95b7e', summer: '#2a6f93', autumn: '#c0532b', winter: '#5b6b88' };

/**
 * Spot-card layout so no row is left with a lone card. On tablet/desktop the
 * grid has 6 columns: rows of three (span 2), and the last row(s) of two
 * wider cards (span 3) when the count does not divide by three — 5 → 3+2,
 * 10 → 3+3+2+2. On phones (2 columns) an odd last card spans the full width.
 */
function spotShape(i: number, n: number) {
  const r = n % 3;
  const wideFrom = r === 2 ? n - 2 : r === 1 ? (n >= 4 ? n - 4 : 0) : n;
  return { wide: i >= wideFrom, mobileFull: n % 2 === 1 && i === n - 1 };
}

const DINING_GROUP: Record<string, L10n> = {
  Breakfast: { ja: 'ご朝食', en: 'Breakfast' },
  'Local Food': { ja: '地元グルメ', en: 'Local food' },
  'Nagoya Meshi': { ja: '名古屋めし', en: 'Nagoya meshi' },
  'Kyoto Cuisine': { ja: '京の味', en: 'Kyoto cuisine' },
  Neighbourhood: { ja: '周辺のお店', en: 'Around the hotel' },
};

const MODE_LABEL: Record<RouteMode, L10n> = {
  train: { ja: '電車', en: 'Train' },
  car: { ja: 'お車', en: 'Car' },
  bus: { ja: 'バス', en: 'Bus' },
  walk: { ja: '徒歩', en: 'Walk' },
  plane: { ja: '空港', en: 'Airport' },
};

const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/** Thin outline button (周辺観光をもっと見る / アクセス情報). */
const BTN_LINE = 'inline-flex items-center justify-center border px-8 py-3 text-[0.9375rem] tracking-[0.1em] transition-colors';

/** Latitude / longitude printed in the dark footer, read off the map embed. */
function coords(embed: string) {
  const lat = embed.match(/!3d(-?\d+\.\d+)/)?.[1];
  const lng = embed.match(/!2d(-?\d+\.\d+)/)?.[1];
  return lat && lng ? { lat: Number(lat).toFixed(4), lng: Number(lng).toFixed(4) } : null;
}

/**
 * Hotel page laid out after the estimate's reference, goderehotel.com:
 * slideshow → wordmark + link row → EXPERIENCE (collage + statements) →
 * WHATS SPECIAL photo cards → THE HOTEL MOVIE (if any) → 客室 → お食事 →
 * SURROUNDINGS strip + 季節の行事 → two photo marquees → GROUPS & EVENTS →
 * ACCESS banner with the details beneath → dark hotel footer.
 * (Story order: why stay → feel it → rooms & food → the area → groups → how to get here.)
 */
export default async function HotelPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const hotel = getHotel(slug);
  if (!hotel) notFound();

  const active = locale as Locale;
  const dict = getDictionary(active);
  const title = hotel.pageTitle ?? hotel.name;
  const stay = getStay(hotel.slug);
  const L = (v: L10n) => t(v, active);

  const contactHref = localePath(active, '/contact');
  const slides = stay.heroSlides ?? [hotel.hero, ...hotel.gallery].slice(0, 3);
  const pool = Array.from(new Set([hotel.hero, ...hotel.gallery, hotel.hub.image, ...hotel.highlights.map((b) => b.image), ...hotel.special.blocks.map((b) => b.image)]));
  const pick = (i: number) => pool[i % pool.length];
  const scenery = stay.scenery ?? { inside: pool, around: pool.slice().reverse() };

  // Photo cards: the hotel's own list, else services + special blocks + rooms.
  const features: Feature[] =
    stay.features ??
    [
      ...hotel.special.blocks.map((b) => ({ title: b.title, body: b.body, image: b.image })),
      ...(stay.rooms.services ?? []).map((s, i) => ({ title: s.title, body: s.body, image: pick(i + 1) })),
      ...stay.rooms.items.map((r, i) => ({ title: r.name, body: r.body, image: r.image ?? pick(i) })),
    ].slice(0, 8);

  // Dishes with a photo become cards; one without (breakfast, until the hotel
  // sends a photo) is a short note under the lead instead of an empty tile.
  const diningNotes = stay.dining.items.filter((item) => !item.image);
  const diningGroups = Array.from(
    stay.dining.items.filter((item) => item.image).reduce((map, item) => {
      if (!map.has(item.label)) map.set(item.label, []);
      map.get(item.label)!.push(item);
      return map;
    }, new Map<string, typeof stay.dining.items>()),
  ).map(([label, items]) => ({ title: DINING_GROUP[label] ? L(DINING_GROUP[label]) : label, items }));

  // Two different photos for the collage, even when the hub and highlight share one.
  const collage: [string, string] = [
    hotel.hub.image,
    [hotel.highlights[0]?.image, ...hotel.gallery, hotel.hero].find((src): src is string => !!src && src !== hotel.hub.image) ?? hotel.hero,
  ];
  const groupGrid = [pick(1), pick(2), pick(3), pick(0)];
  const geo = coords(hotel.mapEmbed);
  const links = [
    { id: 'top', label: 'ホーム' },
    { id: 'about', label: 'ホテルについて' },
    { id: 'rooms', label: '客室' },
    { id: 'dining', label: 'お食事' },
    { id: 'sightseeing', label: '周辺観光' },
    { id: 'access', label: 'アクセス' },
  ];

  return (
    <div id="top" className="bg-page text-ink">
      <HeroSlider
        images={slides}
        title={title}
        stars={hotel.stars}
        tagline={L(hotel.tagline)}
        nextId="about"
        homeHref={localePath(active)}
        homeLabel={active === 'ja' ? 'ホーム' : 'Home'}
      />

      <HotelHeader
        name={title}
        nameJa={hotel.nameJa}
        stars={hotel.stars}
        links={links}
        contactHref={contactHref}
        homeHref={localePath(active)}
      />

      {/* EXPERIENCE ------------------------------------------------------- */}
      <section id="about" className={cn('px-5 pt-16 pb-20 md:pt-20 md:pb-28', ANCHOR)}>
        <Flourish />
        <EnHeading en={`EXPERIENCE ${title}`} sub={L(S.overview)} />

        <div className="mx-auto mt-12 grid max-w-[72rem] items-center gap-12 md:mt-16 md:grid-cols-[1fr_1.1fr] md:gap-16">
          {/* Two overlapping photos, as the reference's collage. */}
          <Reveal from="left" duration={1.1} className="relative mx-auto aspect-[4/4.4] w-full max-w-[27rem]">
            <div className="absolute top-0 left-0 h-[62%] w-[72%] overflow-hidden rounded-md shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <Image src={collage[0]} alt="" fill sizes="(max-width: 768px) 70vw, 320px" className="object-cover" />
            </div>
            <div className="absolute right-0 bottom-0 h-[58%] w-[64%] overflow-hidden rounded-md shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
              <Image src={collage[1]} alt="" fill sizes="(max-width: 768px) 60vw, 280px" className="object-cover" />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="text-center md:text-left">
            <h3 className="text-[clamp(1.15rem,1.9vw,1.5rem)] leading-[1.95] tracking-[0.06em] text-ink">{L(hotel.about.title)}</h3>
            <h3 className="mt-3 text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.95] tracking-[0.06em] text-ink">{L(hotel.about.lede)}</h3>
            <div className="mt-6 space-y-3 text-[0.9375rem] leading-[2] whitespace-pre-line text-ink-mute">
              {L(hotel.about.body)
                .split(/\n\s*\n/)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
            </div>
            {hotel.highlights.map((block, i) => (
              <Fragment key={i}>
                <h3 className="mt-8 text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.95] tracking-[0.06em] whitespace-pre-line text-ink">{L(block.title)}</h3>
                <div className="mt-4 space-y-3 text-[0.9375rem] leading-[2] text-ink-mute">
                  {L(block.body)
                    .split(/\n\s*\n/)
                    .map((p, k) => (
                      <p key={k}>{p}</p>
                    ))}
                </div>
              </Fragment>
            ))}
            <p className="mt-8 text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.95] tracking-[0.06em] text-ink">—— {L(hotel.tagline)}</p>
          </Reveal>
        </div>
      </section>

      <Rule />

      {/* 8 photo cards ---------------------------------------------------- */}
      <section className="px-5 py-24 md:py-28">
        <EnHeading
          en="WHATS SPECIAL"
          sub={locale === 'ja' ? `${features.length}つの魅力` : `${features.length} things to love`}
        />
        <Flourish className="mt-6" />
        <div className="mx-auto mt-12 grid max-w-[72rem] gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((f, i) => {
            // 8 cards: 3 / 2 / 3 rhythm on desktop, as the reference grid.
            // Other counts: full rows of 3, any remainder as wide cards.
            const wide = features.length === 8 ? i === 3 || i === 4 : spotShape(i, features.length).wide;
            return (
              <Reveal key={i} from={i % 2 === 0 ? 'left' : 'right'} duration={1.1} delay={(i % 3) * 0.06} className={cn(wide ? 'lg:col-span-3' : 'lg:col-span-2')}>
                <article
                  className={cn(
                    'group relative overflow-hidden rounded-xl bg-sumi shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]',
                    wide ? 'aspect-[16/8]' : 'aspect-[4/3]',
                  )}
                >
                  <Image
                    src={f.image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Warm scrim from the bottom: the photo stays bright up top, the copy sits on shade. */}
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,12,8,0.85)_0%,rgba(20,12,8,0.6)_50%,rgba(20,12,8,0.12)_88%)]" />
                  {/* Faint gold edge on hover (pointer devices). */}
                  <div aria-hidden className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-[#d9b77c]/0 transition duration-500 ring-inset group-hover:ring-[#d9b77c]/70" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-6 text-center text-washi [text-shadow:0_1px_10px_rgba(0,0,0,0.55)] sm:px-6 md:pb-7">
                    <h3 className="text-[1.5rem] tracking-[0.06em] md:text-[1.75rem]">{L(f.title)}</h3>
                    <span aria-hidden className="ornament ornament-lit" />
                    <p className="mx-auto mt-2.5 line-clamp-3 max-w-[24rem] text-[0.9375rem] leading-[1.9] text-pretty whitespace-pre-line md:text-[0.875rem]">{L(f.body)}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* THE HOTEL MOVIE (as the live page) ------------------------------ */}
      {hotel.youtubeId && (
        <section className="border-t border-ink/8 px-5 py-24 md:py-28">
          <EnHeading en="THE HOTEL MOVIE" sub={locale === 'ja' ? 'ホテル紹介動画' : 'Hotel film'} />
          <Reveal from="left" duration={1.2} className="mx-auto mt-12 max-w-[60rem]">
            <VideoEmbed
              id={hotel.youtubeId}
              poster={hotel.hero}
              label={locale === 'ja' ? '動画を再生' : 'Play film'}
              title={`${hotel.name} — ${locale === 'ja' ? 'ホテル紹介動画' : 'hotel film'}`}
            />
          </Reveal>
          {hotel.movieText && (
            <Reveal className="mx-auto mt-10 max-w-[46rem]">
              <p className="text-center text-[1.0625rem] leading-[2.05] text-ink-mute">{L(hotel.movieText)}</p>
            </Reveal>
          )}
        </section>
      )}

      {/* 客室 ------------------------------------------------------------- */}
      <section id="rooms" className={cn('bg-page pb-24', ANCHOR)}>
        <JpBand title={L(S.rooms)} sub={L(S.roomsSub)} />
        <div className="mx-auto max-w-[76rem] px-5">
          {stay.rooms.lead && (
            <p className="mx-auto mt-10 max-w-[46rem] text-center text-[0.9375rem] leading-[2] text-ink-mute">{L(stay.rooms.lead)}</p>
          )}

          {stay.rooms.services && (
            <Reveal className="mt-10 rounded-xl bg-page-3 p-5 md:p-7">
              <p className="text-center text-[1.125rem] tracking-[0.08em] text-ink">{L(S.services)}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {stay.rooms.services.map((item, i) => (
                  <li key={i} className="rounded-lg border border-ink/10 bg-page p-4">
                    <p className="border-l-[3px] border-brass pl-2.5 text-[1rem] font-medium text-ink">{L(item.title)}</p>
                    <p className="mt-2.5 text-[0.9375rem] md:text-[0.875rem] leading-[2] whitespace-pre-line text-ink-mute">{L(item.body)}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {stay.rooms.items.map((room, i) => (
            <article key={i} className="mt-16 md:mt-20">
              <Rule inline />
              <Reveal className="mt-12 text-center">
                <h3 className="font-latin text-[1.625rem] tracking-[0.1em] text-ink uppercase md:text-[1.875rem]">
                  {room.name.en ?? L(room.name)}
                </h3>
                <p className="mt-2 text-[1rem] text-stone">{L(room.name)}</p>
              </Reveal>

              <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
                <Reveal from={i % 2 === 0 ? 'left' : 'right'} duration={1.1} className="overflow-hidden rounded-xl">
                  <RoomGallery
                    images={[room.image, ...(room.gallery ?? [])].filter((src): src is string => !!src)}
                    alt={L(room.name)}
                    emptyLabel={active === 'ja' ? '写真準備中' : 'Photos coming soon'}
                  />
                </Reveal>

                <Reveal delay={0.08}>
                  <p className="text-[1.125rem] leading-[2] text-ink">{L(room.body)}</p>
                  {room.amenities && (
                    <ul className="mt-4 space-y-1 text-[0.9375rem] md:text-[0.875rem] leading-[2] text-ink-mute">
                      <li>・{L(S.amenities)}｜{room.amenities.map((a) => L(a)).join('、')}</li>
                    </ul>
                  )}

                  {room.facts && (
                    <dl className="mt-6 overflow-hidden rounded-lg bg-page-3">
                      {room.facts.map((fact, k) => (
                        <div key={k} className={cn('grid grid-cols-[7rem_1fr] gap-4 px-5 py-3 text-[0.9375rem]', k > 0 && 'border-t border-page')}>
                          <dt className="font-medium text-ink">{L(fact.label)}</dt>
                          <dd className="text-ink-mute">{L(fact.value)}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* お食事 ----------------------------------------------------------- */}
      <section id="dining" className={cn('bg-page pb-24', ANCHOR)}>
        <JpBand title={L(S.dining)} sub={L(S.diningSub)} />
        <div className="mx-auto max-w-[76rem] px-5">
          <p className="mx-auto mt-10 max-w-[46rem] text-center text-[0.9375rem] leading-[2] text-ink-mute">{L(stay.dining.lead)}</p>
          {diningNotes.map((note, i) => (
            <p key={i} className="mx-auto mt-6 max-w-[40rem] rounded-xl border border-gold/40 bg-page-2 px-5 py-4 text-center text-[0.9375rem] leading-[1.9] text-ink-mute">
              <span className="mr-2 font-medium text-brass">{L(note.title)}</span>
              {L(note.body)}
            </p>
          ))}

          {diningGroups.map((group, g) => (
            <div key={g} className="mt-12">
              <h3 className="border-l-4 border-brass pl-3 text-[1.1875rem] font-medium tracking-[0.04em] text-ink">{group.title}</h3>
              {/* Flex instead of grid so a group of one or two cards sits centred
                  rather than against the left edge. */}
              <div className="mt-5 flex flex-wrap justify-center gap-5">
                {group.items.map((item, i) => (
                  <Reveal key={i} from={i % 2 === 0 ? 'left' : 'right'} duration={1.1} delay={(i % 3) * 0.06} className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc((100%-2.5rem)/3)]">
                    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-ink/10 bg-page shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                      <div className="relative aspect-[4/3] w-full">
                        {item.image ? (
                          <>
                            <Image src={item.image} alt={L(item.title)} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                            {item.credit && <Credit credit={item.credit} />}
                          </>
                        ) : (
                          // No dish photo yet: a soft panel carrying the hotel's wordmark, as the reference's logo tiles.
                          <div className="flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(160deg,#f6f6f6,#e4e4e4)] px-6 text-center">
                            <span className="font-latin text-[1.125rem] tracking-[0.2em] text-ink-mute">{title}</span>
                            <span className="mt-1 text-[0.9375rem] md:text-[0.875rem] tracking-[0.2em] text-star">{'★'.repeat(hotel.stars)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <h4 className="text-[1.0625rem] font-medium text-ink">{L(item.title)}</h4>
                        <p className="mt-2 text-[0.9375rem] leading-[2] text-ink-mute">{L(item.body)}</p>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* SURROUNDINGS ----------------------------------------------------- */}
      <section id="sightseeing" className={cn('px-5 py-24 md:py-28', ANCHOR)}>
        <EnHeading en="SURROUNDINGS" sub={L(S.sightseeing)} />
        <p className="mx-auto mt-8 max-w-[46rem] text-center text-[0.9375rem] leading-[2] text-ink-mute">{L(stay.sightseeing.lead)}</p>

        <div className="mx-auto mt-10 grid max-w-[76rem] grid-cols-2 gap-3 md:grid-cols-6 md:gap-5">
          {stay.sightseeing.spots.map((spot, i) => {
            const shape = spotShape(i, stay.sightseeing.spots.length);
            return (
            <Reveal key={i} from={i % 2 === 0 ? 'left' : 'right'} duration={1.1} delay={(i % 6) * 0.05} className={cn(shape.mobileFull && 'col-span-2', shape.wide ? 'md:col-span-3' : 'md:col-span-2')}>
              <article className="flex h-full flex-col overflow-hidden rounded-md border border-ink/10 bg-page">
                <div className={cn('reveal-color relative w-full', shape.mobileFull ? 'aspect-[3/2]' : 'aspect-[4/5]', shape.wide ? 'md:aspect-[2/1]' : 'md:aspect-[3/2]')}>
                  {spot.image ? (
                    <>
                      <Image src={spot.image} alt={L(spot.name)} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" style={spot.focus ? { objectPosition: spot.focus } : undefined} />
                      {spot.credit && <Credit credit={spot.credit} />}
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-page-2 px-3 text-center">
                      <span className="text-[0.9375rem] md:text-[0.875rem] tracking-[0.1em] text-stone">{L(spot.name)}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="text-[1.0625rem] leading-snug font-medium text-pretty text-ink">{L(spot.name)}</h3>
                  <p className="mt-1 text-[0.875rem] md:text-[0.8125rem] text-stone">{L(S.fromHotel)}{L(spot.time)}</p>
                  <p className="mt-2 flex-1 text-[0.875rem] leading-[2] text-pretty text-ink-mute md:text-[0.8125rem]">{L(spot.body)}</p>
                  <p className="mt-2 flex flex-wrap gap-x-3 text-[0.875rem] md:text-[0.8125rem]">
                    <a href={mapsUrl(spot.query)} target="_blank" rel="noopener noreferrer" className="border-b border-ink text-ink hover:opacity-60">
                      {L(S.viewMap)}
                    </a>
                    {spot.site && (
                      <a href={spot.site} target="_blank" rel="noopener noreferrer" className="border-b border-ink text-ink hover:opacity-60">
                        {L(S.officialSite)}
                      </a>
                    )}
                  </p>
                </div>
              </article>
            </Reveal>
            );
          })}
        </div>
        <p className="mx-auto mt-3 max-w-[76rem] text-right text-[0.875rem] md:text-[0.8125rem] text-stone">{L(S.timeNote)}</p>

        {stay.sightseeing.events && (
          <div className="mx-auto mt-16 max-w-[76rem]">
            <EnHeading en="SEASONAL EVENTS" sub={L(S.events)} small />
            <p className="mx-auto mt-5 max-w-[46rem] text-center text-[0.9375rem] leading-[2] text-ink-mute">{L(S.eventsLead)}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stay.sightseeing.events.map((event, i) => (
                <Reveal key={i} delay={(i % 4) * 0.06}>
                  <article
                    style={{ '--season': SEASON_COLOR[event.season] } as React.CSSProperties}
                    className="flex h-full flex-col overflow-hidden rounded-md border border-ink/10 border-t-[3px] border-t-[var(--season)] bg-[linear-gradient(to_bottom,color-mix(in_srgb,var(--season)_11%,var(--color-page)),var(--color-page)_55%)] p-5 transition-shadow duration-300 hover:shadow-[0_10px_28px_-14px_var(--season)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="type-mincho flex size-10 items-center justify-center rounded-full bg-[var(--season)] text-[1.125rem] text-white shadow-[0_4px_12px_-4px_var(--season)]">
                        {SEASON[event.season]}
                      </span>
                      <span className="font-latin text-[0.9375rem] tracking-[0.22em] text-[var(--season)] uppercase dark:text-[color-mix(in_srgb,var(--season)_55%,white)]">{event.season}</span>
                    </div>
                    <h4 className="mt-3 text-[1.0625rem] font-medium text-ink">{L(event.name)}</h4>
                    <p className="mt-2 text-[0.875rem] md:text-[0.8125rem] leading-[2] text-ink-mute">
                      {L(S.when)}{L(event.when)}
                      <br />
                      {L(S.where)}{L(event.place)}
                    </p>
                    <p className="mt-2 flex-1 text-[0.9375rem] md:text-[0.875rem] leading-[2] text-pretty text-ink-mute">{L(event.body)}</p>
                    <a href={mapsUrl(event.query)} target="_blank" rel="noopener noreferrer" className="mt-3 self-start border-b border-[var(--season)] text-[0.875rem] text-[var(--season)] hover:opacity-70 md:text-[0.8125rem] dark:border-[color-mix(in_srgb,var(--season)_55%,white)] dark:text-[color-mix(in_srgb,var(--season)_55%,white)]">
                      {L(S.viewMap)}
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-3 text-right text-[0.875rem] md:text-[0.8125rem] text-stone">{L(S.eventsNote)}</p>
          </div>
        )}

        {stay.sightseeing.facilities && (
          <div className="mx-auto mt-16 max-w-[76rem]">
            <EnHeading en="AREA INFORMATION" sub={L(S.area)} small />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stay.sightseeing.facilities.map((item, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06}>
                  <article className="h-full rounded-md border border-ink/10 bg-page p-5">
                    <p className="border-b border-ink/10 pb-2 text-[1.0625rem] font-medium text-ink">{L(item.kind)}</p>
                    <p className="mt-3 text-[1rem] font-medium text-ink">{L(item.name)}</p>
                    {item.address && <p className="mt-1 text-[0.9375rem] md:text-[0.875rem] leading-[2] text-ink-mute">{L(S.addressLabel)}：{item.address}</p>}
                    {item.hours && <p className="mt-1 text-[0.9375rem] md:text-[0.875rem] text-ink-mute">{L(S.hours)}：{L(item.hours)}</p>}
                    <p className="mt-2 text-[0.9375rem] md:text-[0.875rem] text-stone">{L(S.fromHotel)}{L(item.time)}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>

      <Rule />

      {/* Photo marquees --------------------------------------------------- */}
      <section className="px-5 py-20 md:py-24">
        <div className="mx-auto grid max-w-[76rem] gap-12 md:grid-cols-2 md:gap-8">
          <PhotoMarquee images={scenery.inside} title={L(S.inside)} />
          <PhotoMarquee images={scenery.around} title={L(S.around)} reverse />
        </div>
      </section>

      <Rule />

      {/* GROUPS & EVENTS -------------------------------------------------- */}
      <section className="px-5 py-24 md:py-28">
        <EnHeading en="PERFECT FOR GROUPS & EVENTS" sub={L(S.groups)} />
        <div className="mx-auto mt-12 grid max-w-[72rem] items-center gap-10 md:grid-cols-[0.9fr_1.4fr] md:gap-12">
          <Reveal>
            <h3 className="text-[clamp(1.15rem,1.9vw,1.5rem)] leading-[1.95] tracking-[0.06em] whitespace-pre-line text-ink">{L(S.groupsTitle)}</h3>
            <p className="mt-6 text-[0.9375rem] leading-[2] text-ink-mute">{L(S.groupsBody1)}</p>
            <p className="mt-4 text-[0.9375rem] leading-[2] text-ink-mute">{L(S.groupsBody2)}</p>
            <a href="tel:08040979552" className="mt-6 inline-flex items-center gap-3 text-[1.25rem] font-medium text-ink hover:opacity-70">
              <PhoneIcon size={18} /> {L(S.groupDesk)}　080-4097-9552
            </a>
            <div className="mt-6">
              <Link href={contactHref} className={cn(BTN_LINE, 'border-ink text-ink hover:bg-ink hover:text-page')}>
                {L(S.contactForm)}
              </Link>
            </div>
          </Reveal>

          <Reveal from="right" duration={1.1} delay={0.08} className="grid grid-cols-[1fr_1.7fr] gap-3 md:gap-4">
            <div className="grid gap-3 md:gap-4">
              {groupGrid.slice(0, 3).map((src, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-md">
                  <Image src={src} alt="" fill sizes="(max-width: 768px) 35vw, 220px" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="relative overflow-hidden rounded-md">
              <Image src={groupGrid[3]} alt="" fill sizes="(max-width: 768px) 60vw, 420px" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ACCESS banner ---------------------------------------------------- */}
      <section id="access" className={cn('relative overflow-hidden bg-sumi text-washi', ANCHOR)}>
        <Image src={pick(0)} alt="" fill sizes="100vw" className="object-cover" />
        {/* Photo only: the client asked for no ACCESS / アクセス情報 text here. */}
        <div aria-hidden className="relative h-[16rem] md:h-[26rem]" />
      </section>

      {/* Access details --------------------------------------------------- */}
      <section id="access-detail" className={cn('bg-page py-24 md:py-28', ANCHOR)}>
        <div className="mx-auto max-w-[76rem] px-5">
          <p className="mx-auto max-w-[46rem] text-center text-[0.9375rem] leading-[2] text-ink-mute">{L(stay.access.lead)}</p>

          <Reveal className="mt-10 overflow-hidden rounded-xl border border-ink/10">
            <MapEmbed src={hotel.mapEmbed} title={title} address={L(hotel.info.address)} cta={dict.common.openInMaps} height="h-[18rem] md:h-[26rem]" />
          </Reveal>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <p className="text-[0.875rem] md:text-[0.8125rem] tracking-[0.2em] text-stone">{L(S.hotelInfo)}</p>
              <h3 className="mt-2 text-[1.625rem] font-medium tracking-[0.06em] text-ink">{hotel.nameJa}</h3>
              <p className="mt-4 text-[1.0625rem] text-ink">{L(hotel.info.address)}</p>
              <ul className="mt-4 space-y-2.5 text-[1rem] text-ink-mute">
                {hotel.info.tel && (
                  <li className="flex items-center gap-3">
                    <PhoneIcon size={16} /> {L(S.telLabel)}　<a href={`tel:${hotel.info.tel.replace(/-/g, '')}`}>{hotel.info.tel}</a>
                  </li>
                )}
                {hotel.info.fax && (
                  <li className="flex items-center gap-3">
                    <FaxIcon /> {L(S.faxLabel)}　{hotel.info.fax}
                  </li>
                )}
                <li className="flex items-center gap-3">
                  <PhoneIcon size={16} /> {L(S.groupDesk)}　<a href="tel:08040979552" className="text-ink">080-4097-9552</a>
                </li>
              </ul>
              {(stay.access.checkIn || stay.access.checkOut || stay.access.parking) && (
                <dl className="mt-8 border-t border-ink/15 text-[0.9375rem]">
                  {stay.access.checkIn && <InfoRow label={L(S.checkIn)} value={stay.access.checkIn} />}
                  {stay.access.checkOut && <InfoRow label={L(S.checkOut)} value={stay.access.checkOut} />}
                  {stay.access.parking && <InfoRow label={L(S.parking)} value={L(stay.access.parking)} />}
                </dl>
              )}
            </Reveal>

            <Reveal delay={0.08} className="rounded-xl bg-page-3 p-6 md:p-8">
              <p className="text-[1rem] font-medium text-ink">{L(S.routes)}</p>
              <ul className="mt-5 space-y-5">
                {stay.access.routes.map((route, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-ink text-page">
                      <ModeIcon mode={route.mode} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[1rem] font-medium text-ink">
                        {L(MODE_LABEL[route.mode])}：{L(route.from)}
                      </span>
                      <span className="mt-0.5 block text-[0.9375rem] text-ink-mute">{L(route.detail)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {stay.access.journeys && (
            <div className="mt-14">
              <p className="text-[1rem] font-medium text-ink">{L(S.routeGuide)}</p>
              <div className="mt-4 grid gap-5 lg:grid-cols-2">
                {stay.access.journeys.map((journey, i) => (
                  <Reveal key={i} delay={(i % 2) * 0.08} className="rounded-xl bg-page-3 p-6 md:p-8">
                    <p className="text-[1rem] font-medium text-ink">{L(journey.title)}</p>
                    <ol className="mt-5 flex flex-col md:flex-row md:items-center">
                      {journey.steps.map((step, k) => {
                        const last = k === journey.steps.length - 1;
                        return (
                          <Fragment key={k}>
                            <li
                              className={cn(
                                'rounded-md px-3 py-3 text-center text-[0.9375rem] leading-snug md:min-w-[6rem]',
                                last ? 'bg-ink text-page' : 'bg-page text-ink shadow-[0_2px_8px_rgba(0,0,0,0.06)]',
                              )}
                            >
                              {L(step.place)}
                            </li>
                            {step.leg && (
                              <li className="relative flex items-center gap-3 py-4 pl-4 md:flex-1 md:flex-col md:gap-1.5 md:px-2 md:py-0">
                                <span aria-hidden className="absolute inset-y-0 left-[1.75rem] w-px bg-ink/25 md:hidden" />
                                <span aria-hidden className="absolute inset-x-0 top-3.5 hidden h-px bg-ink/25 md:block" />
                                <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-page">
                                  <ModeIcon mode={step.leg.mode} />
                                </span>
                                <span className="relative text-[0.9375rem] md:text-[0.875rem] leading-snug whitespace-nowrap text-ink-mute md:text-center">{L(step.leg.text)}</span>
                              </li>
                            )}
                          </Fragment>
                        );
                      })}
                    </ol>
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Dark hotel footer, as the reference ------------------------------ */}
      <section className="relative bg-[#1a1715] px-5 py-20 text-center text-washi md:py-24">
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#b72929,#b08d57_50%,#b72929)]" />
        <p className="font-latin text-[1.625rem] tracking-[0.22em] md:text-[2rem]">{title}</p>
        <p className="mt-1 text-[1.0625rem] tracking-[0.3em] text-star">{'★'.repeat(hotel.stars)}</p>
        <p className="mt-2 text-[0.9375rem] md:text-[0.875rem] tracking-[0.3em] text-washi/85">{hotel.nameJa}</p>
        {geo && (
          <p className="mt-6 text-[0.9375rem] tracking-[0.05em]">
            北緯{geo.lat}° 東経{geo.lng}°
          </p>
        )}
        <p className="mt-5 text-[0.9375rem] leading-[2] text-washi/85">
          {L(hotel.info.address)}
          <br />
          {hotel.info.tel && <>電話：{hotel.info.tel}　</>}
          {L(S.groupDesk)}：080-4097-9552
          <br />
          {L(S.frontDesk)}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.9375rem] md:text-[0.875rem] text-washi/85">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="hover:text-washi">
              {l.label}
            </a>
          ))}
          <Link href={contactHref} className="hover:text-washi">
            お問い合わせ
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

/** Thin Tenor caps title with a small Japanese line beneath (EXPERIENCE … / SURROUNDINGS). */
function EnHeading({ en, sub, small }: { en: string; sub?: string; small?: boolean }) {
  return (
    <Reveal className="text-center">
      <h2 className={cn('font-latin tracking-[0.18em] text-ink', small ? 'text-[1.375rem] md:text-[1.625rem]' : 'text-[clamp(1.4rem,2.6vw,2.1rem)]')}>
        {en}
      </h2>
      <span aria-hidden className="ornament" />
      {sub && <p className="mt-3 text-[0.9375rem] md:text-[0.875rem] tracking-[0.16em] text-brass">{sub}</p>}
    </Reveal>
  );
}

/** The reference's light title band with a faint dot pattern (客室紹介 / お食事). */
function JpBand({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="bg-seigaiha px-5 py-14 text-center md:py-16">
      <h2 className="text-[1.875rem] tracking-[0.1em] text-ink md:text-[2.25rem]">{title}</h2>
      <span aria-hidden className="ornament ornament-on-2" />
      {sub && <p className="mt-3 text-[0.9375rem] text-stone">{sub}</p>}
    </div>
  );
}

/** Ornamental flourish between the big sections. */
function Flourish({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center text-ink-soft', className)}>
      <svg width="280" height="28" viewBox="0 0 280 28" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden>
        <path d="M10 14c30-12 60 12 90 0s45-6 40 0" />
        <path d="M270 14c-30-12-60 12-90 0s-45-6-40 0" />
        <path d="M140 8l5 6-5 6-5-6z" fill="currentColor" stroke="none" />
        <circle cx="10" cy="14" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="270" cy="14" r="1.6" fill="currentColor" stroke="none" />
        <path d="M60 20c6-4 10-4 16 0M204 20c6-4 10-4 16 0" />
      </svg>
    </div>
  );
}

/** Hairline with a small centre mark, as the reference draws between blocks. */
function Rule({ inline }: { inline?: boolean }) {
  return (
    <div aria-hidden className={cn('relative mx-auto', inline ? 'max-w-[60rem]' : 'max-w-[76rem] px-5')}>
      <span className="block h-px w-full bg-ink/12" />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-page px-2 text-[0.9375rem] md:text-[0.875rem] text-stone-dim">✦</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-ink/15 py-3">
      <dt className="text-stone">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

function PhoneIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />
    </svg>
  );
}

function FaxIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M19 8h-1V3H6v5H5a3 3 0 0 0-3 3v6h4v4h12v-4h4v-6a3 3 0 0 0-3-3zM8 5h8v3H8V5zm8 14H8v-4h8v4zm2-7a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
    </svg>
  );
}

function ModeIcon({ mode }: { mode: RouteMode }): ReactNode {
  switch (mode) {
    case 'train':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C8 2 4 2.5 4 6v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5V21h2l2-2h4l2 2h2v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-4-4-8-4zm-4.5 14a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM18 10H6V6h12v4z" />
        </svg>
      );
    case 'bus':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M4 16c0 .9.4 1.7 1 2.2V20a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h8v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1.8c.6-.5 1-1.3 1-2.2V6c0-3.5-3.6-4-8-4S4 2.5 4 6v10zm3.5 1a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.5-6H6V6h12v5z" />
        </svg>
      );
    case 'walk':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M13.5 5.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9.8 8.9 7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3A7.3 7.3 0 0 0 19 13v-2a5.3 5.3 0 0 1-4.5-2.5l-1-1.6A2 2 0 0 0 11.8 6c-.3 0-.5 0-.8.1L6 8.3V13h2V9.6l1.8-.7z" />
        </svg>
      );
    case 'plane':
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      );
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18.9 6a1.5 1.5 0 0 0-1.4-1H6.5c-.7 0-1.2.4-1.4 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.1-6zM6.5 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM5 11l1.5-4.5h11L19 11H5z" />
        </svg>
      );
  }
}

/** Licence credit for a free-licence photo, small over the image's bottom edge. */
function Credit({ credit }: { credit: PhotoCredit }) {
  return (
    <a
      href={credit.source}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute right-0 bottom-0 left-0 truncate bg-gradient-to-t from-sumi/55 to-transparent px-2 pt-4 pb-1 text-right text-[0.65rem] leading-tight text-washi/85 hover:text-washi"
    >
      Photo: {credit.author} / {credit.license}
    </a>
  );
}
