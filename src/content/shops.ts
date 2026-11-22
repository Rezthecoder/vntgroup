import type { L10n } from '@/lib/i18n';

/**
 * New shops and restaurants added under the 2026 quote (items 8–11).
 *
 * Facts come only from VNT. Addresses and phone numbers were sent on
 * 21 Nov 2026 (年中無休 on 23 Nov); anything still missing (hours, photos) is left
 * empty and the page shows 準備中 in its place. Nothing here is invented.
 * Fill the fields in as the client sends them; set `draft: false` once a
 * shop's page is complete so it is indexed by search engines and listed in
 * the sitemap.
 */
export type Shop = {
  slug: 'komachi-kimono' | 'kix-japan-drug-izumisano' | 'kyosaido-drug' | 'sakai-kagetsu';
  /** Which part of the site the shop lives in: 販売店 (/retail) or 飲食店 (/dining). */
  section: 'retail' | 'dining';
  name: L10n;
  /** Small label above the name, e.g. 着物レンタル. */
  category: L10n;
  /** Short English line shown as the eyebrow. */
  romaji: string;
  lede?: L10n;
  image?: string;
  /** object-position for the photo crop in cards, e.g. 'center 30%'. */
  imageFocus?: string;
  /** Pixel size of `image`. When set, the shop page shows the whole photo
   *  at its own shape (no crop) instead of a 4:3 frame. */
  imageSize?: { width: number; height: number };
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

// Retail shops are listed in the client's order (Nov 2026):
// 京彩堂（ドラッグストア） → Kix Japan drug 泉佐野店 → 京小町（着物レンタル）.
export const shops: Shop[] = [
  {
    slug: 'kyosaido-drug',
    section: 'retail',
    name: { ja: '京彩堂ドラッグ 東寺店', en: 'Kyosaido Drug Toji' },
    category: { ja: 'ドラッグストア', en: 'Drugstore' },
    romaji: 'Kyosaido — Drugstore',
    address: {
      ja: '〒601-8474 京都府京都市南区四ツ塚町78 ORYZA東寺106号',
      en: 'ORYZA Toji 106, 78 Yotsuzuka-chō, Minami-ku, Kyoto 601-8474',
    },
    tel: '075-644-9667',
    closed: { ja: '年中無休', en: 'Open every day' }, // from VNT, 23 Nov 2026
    mapEmbed: 'https://www.google.com/maps?q=%E4%BA%AC%E9%83%BD%E5%BA%9C%E4%BA%AC%E9%83%BD%E5%B8%82%E5%8D%97%E5%8C%BA%E5%9B%9B%E3%83%84%E5%A1%9A%E7%94%BA78%20ORYZA%E6%9D%B1%E5%AF%BA&hl=ja&z=17&output=embed',
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
    address: {
      ja: '〒598-0012 大阪府泉佐野市高松東1-10-37',
      en: '1-10-37 Takamatsu-higashi, Izumisano, Osaka 598-0012',
    },
    tel: '072-479-6153',
    closed: { ja: '年中無休', en: 'Open every day' }, // from VNT, 23 Nov 2026
    mapEmbed: 'https://www.google.com/maps?q=%E5%A4%A7%E9%98%AA%E5%BA%9C%E6%B3%89%E4%BD%90%E9%87%8E%E5%B8%82%E9%AB%98%E6%9D%BE%E6%9D%B11-10-37&hl=ja&z=17&output=embed',
    // Still to come from VNT: hours.
    draft: true,
  },
  {
    slug: 'komachi-kimono',
    section: 'retail',
    // Name as VNT wrote it on 21 Nov 2026: 着物のレンタル 京小町.
    name: { ja: '京小町', en: 'Kyo Komachi' },
    category: { ja: '着物レンタル', en: 'Kimono rental' },
    romaji: 'Kyo Komachi — Kimono Rental',
    address: {
      ja: '〒601-8474 京都府京都市南区四ツ塚町78 ORYZA東寺103号',
      en: 'ORYZA Toji 103, 78 Yotsuzuka-chō, Minami-ku, Kyoto 601-8474',
    },
    tel: '075-748-7065',
    closed: { ja: '年中無休', en: 'Open every day' }, // from VNT, 23 Nov 2026
    mapEmbed: 'https://www.google.com/maps?q=%E4%BA%AC%E9%83%BD%E5%BA%9C%E4%BA%AC%E9%83%BD%E5%B8%82%E5%8D%97%E5%8C%BA%E5%9B%9B%E3%83%84%E5%A1%9A%E7%94%BA78%20ORYZA%E6%9D%B1%E5%AF%BA&hl=ja&z=17&output=embed',
    // Client's photo (Nov 2026); the 'KYOTO / OCTOBER 2026' caption was cropped off.
    image: '/images/shops/kyosaido-kimono-v1.webp',
    imageFocus: 'center 30%',
    imageSize: { width: 939, height: 1525 },
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
    address: { ja: '〒590-0954 大阪府堺市堺区大町東1-2-3', en: '1-2-3 Ōmachi-higashi, Sakai-ku, Sakai, Osaka 590-0954' },
    tel: '072-268-5596',
    // Shop name in the query so the map card reads 堺花月 (the bare address
    // resolves to another business at the same address).
    mapEmbed: 'https://www.google.com/maps?q=%E5%A0%BA%E8%8A%B1%E6%9C%88%20%E5%A4%A7%E9%98%AA%E5%BA%9C%E5%A0%BA%E5%B8%82%E5%A0%BA%E5%8C%BA%E5%A4%A7%E7%94%BA%E6%9D%B11-2-3&hl=ja&z=17&output=embed',
    hours: { ja: '11:00〜22:00（L.O. 21:00）', en: '11:00–22:00 (last order 21:00)' },
    closed: { ja: '不定休', en: 'Irregular holidays' },
    // Address and phone from VNT (21 Nov 2026); the flyer's 072-000-0000 was a placeholder.
    draft: true,
  },
];

export function getShop(slug: string, section?: Shop['section']) {
  return shops.find((s) => s.slug === slug && (!section || s.section === section));
}

export const retailShops = shops.filter((s) => s.section === 'retail');
export const diningShops = shops.filter((s) => s.section === 'dining');
