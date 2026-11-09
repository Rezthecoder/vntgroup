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
    category: { ja: 'レストラン', en: 'Restaurant' },
    romaji: 'Sakai Kagetsu',
    draft: true,
  },
];

export function getShop(slug: string, section?: Shop['section']) {
  return shops.find((s) => s.slug === slug && (!section || s.section === section));
}

export const retailShops = shops.filter((s) => s.section === 'retail');
export const diningShops = shops.filter((s) => s.section === 'dining');
