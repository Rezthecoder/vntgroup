import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { ShopPage } from '@/components/sections/ShopPage';
import { getShop, retailShops } from '@/content/shops';
import { isLocale, locales, t, type Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.flatMap((locale) => retailShops.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const shop = getShop(slug, 'retail');
  if (!shop) return {};
  const active: Locale = isLocale(locale) ? locale : 'ja';
  return {
    title: `${t(shop.name, active)}（${t(shop.category, active)}）`,
    // Placeholder pages stay out of search results until the client's details are in.
    robots: shop.draft ? { index: false, follow: true } : undefined,
  };
}

export default async function RetailShopPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const shop = getShop(slug, 'retail');
  if (!shop) notFound();
  return <ShopPage shop={shop} locale={locale as Locale} />;
}
