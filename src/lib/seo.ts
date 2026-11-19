import type { Metadata } from 'next';

import { site } from '@/content/site';
import type { Locale } from '@/lib/i18n';

/**
 * The address the site is served from, for absolute URLs in link previews.
 * On Vercel this is the production domain (vntgroup.vercel.app now, and
 * vntgroup.co.jp once the domain is moved and added to the project), so
 * preview images never point at the old STUDIO site.
 */
export const siteOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : site.url;

/** Default link-preview image. */
export const DEFAULT_OG = '/images/brand/hero-group.webp';

/**
 * Link-preview version of a page photo: the 1200×630 JPG that
 * scripts/og-images.mjs makes from it (/images/x/y.webp → /og/x/y.jpg).
 */
export function ogImage(src: string = DEFAULT_OG) {
  return src.replace(/^\/images\//, '/og/').replace(/\.(webp|jpe?g|png)$/, '.jpg');
}

/**
 * Metadata for one page: its own title, description and preview image in
 * every app (LINE, X, Facebook, Slack…), and its own canonical URL with the
 * other-language version.
 *
 * `title` is the page title without the site name (the layout adds
 * " | VNT GROUP"); leave it out for the home page. `image` is the page's main
 * photo under /images; it must be one scripts/og-images.mjs covers.
 */
export function pageMeta({
  locale,
  path = '',
  title,
  description,
  image,
  robots,
}: {
  locale: Locale;
  path?: string;
  title?: string;
  description?: string;
  image?: string;
  robots?: Metadata['robots'];
}): Metadata {
  const fullTitle = title ? `${title} | VNT GROUP` : undefined;
  const og = { url: ogImage(image), width: 1200, height: 630, alt: title ?? 'VNT GROUP' };
  return {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(robots ? { robots } : {}),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { ja: `/ja${path}`, en: `/en${path}`, 'x-default': `/ja${path}` },
    },
    openGraph: {
      type: 'website',
      siteName: 'VNT GROUP',
      locale: locale === 'en' ? 'en_US' : 'ja_JP',
      url: `/${locale}${path}`,
      ...(fullTitle ? { title: fullTitle } : {}),
      ...(description ? { description } : {}),
      images: [og],
    },
    twitter: {
      card: 'summary_large_image',
      ...(fullTitle ? { title: fullTitle } : {}),
      ...(description ? { description } : {}),
      images: [og.url],
    },
  };
}
