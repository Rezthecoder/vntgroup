import type { L10n } from '@/lib/i18n';

/**
 * New shops and restaurants added under the 2026 quote (items 8–11).
 *
 * DRAFT: VNT has not supplied these shops' details yet, so every factual
 * field (address, hours, closed days, phone, photos, description) is left
 * empty and the page shows 準備中 in its place. Nothing here is invented.
 * Fill the fields in as the client sends them; set `draft: false` once a
 * shop's page is complete so it is indexed by search engines and listed in
 * the sitemap.
 */
export type Shop = {
  slug: 'kyosaido-kimono' | 'kix-japan-drug-izumisano' | 'kyosaido-drug' | 'sakai-kagetsu';
  /** Which part of the site the shop lives in: 販売店 (/retail) or 飲食店 (/dining). */
  section: 'retail' | 'dining';
  name: L10n;
  /** Small label above the name, e.g. 着物レンタル. */
  category: L10n;
  /** Short English line shown as the eyebrow. */
  romaji: string;
  lede?: L10n;
  image?: string;
  /** Optional flyer or pamphlet shown in full on the page. */
  flyer?: { src: string; width: number; height: number };
  address?: L10n;
  hours?: L10n;
  closed?: L10n;
  tel?: string;
  /** Google Maps embed URL (…/maps?q=…&output=embed); only shown once there is an address. */
  mapEmbed?: string;
  draft: boolean;
};

export const shops: Shop[] = [
  {
    slug: 'kyosaido-kimono',
    section: 'retail',
    name: { ja: '京彩堂', en: 'Kyosaido' },
    category: { ja: '着物レンタル', en: 'Kimono rental' },
    romaji: 'Kyosaido — Kimono Rental',
    draft: true,
  },
  {
    slug: 'kix-japan-drug-izumisano',
    section: 'retail',
    name: { ja: 'Kix Japan drug 泉佐野店', en: 'Kix Japan drug Izumisano' },
    category: { ja: 'ドラッグストア', en: 'Drugstore' },
    romaji: 'Kix Japan drug — Izumisano',
    // Wording from the store's own signage (医薬品・化粧品・サプリメント・日用品).
    lede: {
      ja: '医薬品・化粧品・サプリメント・日用品を取り揃えたドラッグストアです。',
      en: 'A drugstore with medicines, cosmetics, supplements and everyday goods.',
    },
    image: '/images/shops/kix-japan-drug-izumisano.webp',
    // Still to come from VNT: address, hours, closed days, phone.
    draft: true,
  },
  {
    slug: 'kyosaido-drug',
    section: 'retail',
    name: { ja: '京彩堂', en: 'Kyosaido' },
    category: { ja: 'ドラッグストア', en: 'Drugstore' },
    romaji: 'Kyosaido — Drugstore',
    draft: true,
  },
  {
    slug: 'sakai-kagetsu',
    section: 'dining',
    name: { ja: '堺花月', en: 'Sakai Kagetsu' },
    category: { ja: '懐石料理', en: 'Kaiseki cuisine' },
    romaji: 'Sakai Kagetsu — Japanese Cuisine',
    // Copy, hours and closed days from VNT's flyer (updated Nov 2026).
    lede: {
      ja: '創業七十年、受け継がれる日本の味とおもてなし。\n旬の食材と伝統の技で仕立てる、ここにしかない懐石料理を、落ち着いた和の空間でお楽しみください。\nご接待・ご会食、大切な方との特別なひとときにご利用いただけます。',
      en: 'Seventy years of Japanese flavour and hospitality.\nKaiseki you will find only here, made with seasonal ingredients and time-honoured technique, served in a calm Japanese room.\nFor business dinners, gatherings and special moments with someone dear.',
    },
    image: '/images/shops/sakai-kagetsu-card-v2.webp',
    flyer: { src: '/images/shops/sakai-kagetsu-flyer-v2.webp', width: 853, height: 1280 },
    address: { ja: '大阪府堺市堺区（詳細はお問い合わせください）', en: 'Sakai Ward, Sakai, Osaka (please ask us for details)' },
    hours: { ja: '11:00〜22:00（L.O. 21:00）', en: '11:00–22:00 (last order 21:00)' },
    closed: { ja: '不定休', en: 'Irregular holidays' },
    // The flyer's phone number (072-000-0000) is a placeholder, so it is not
    // shown. Still to come from VNT: real phone number and full address.
    draft: true,
  },
];

export function getShop(slug: string, section?: Shop['section']) {
  return shops.find((s) => s.slug === slug && (!section || s.section === section));
}

export const retailShops = shops.filter((s) => s.section === 'retail');
export const diningShops = shops.filter((s) => s.section === 'dining');
