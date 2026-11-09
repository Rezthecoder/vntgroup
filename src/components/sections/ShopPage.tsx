import Image from 'next/image';

import { Reveal } from '@/components/motion/Reveal';
import { ButtonLink } from '@/components/ui/ArrowLink';
import { MapEmbed } from '@/components/ui/MapEmbed';

import type { Shop } from '@/content/shops';
import { getDictionary } from '@/content/dictionary';
import { localePath, t, type Locale } from '@/lib/i18n';

const PENDING = '準備中';

/**
 * One page for a shop or restaurant from `content/shops.ts`. Any detail the
 * client hasn't supplied yet shows 準備中 rather than an invented value.
 */
export function ShopPage({ shop, locale }: { shop: Shop; locale: Locale }) {
  const dict = getDictionary(locale);
  const rows: { label: string; value?: string; href?: string }[] = [
    { label: dict.common.address, value: shop.address && t(shop.address, locale) },
    { label: dict.common.hours, value: shop.hours && t(shop.hours, locale) },
    { label: '定休日', value: shop.closed && t(shop.closed, locale) },
    { label: 'TEL', value: shop.tel, href: shop.tel && `tel:${shop.tel.replace(/-/g, '')}` },
  ];

  return (
    <>
      <section className="border-b border-ink/10 bg-page-2 pt-16 pb-14 md:pt-24 md:pb-20">
        <div className="shell text-center">
          <p className="type-eyebrow">{shop.romaji}</p>
          <p className="type-mincho mt-6 text-[1.0625rem] text-brass">{t(shop.category, locale)}</p>
          <h1 className="type-display mt-3 text-[clamp(1.75rem,4.4vw,3.25rem)] text-ink">{t(shop.name, locale)}</h1>
          {shop.draft && (
            <p className="mt-6 inline-block rounded-full border border-ink/15 px-4 py-1.5 text-[0.9375rem] md:text-[0.875rem] tracking-[0.12em] text-stone">
              店舗情報は近日公開予定です
            </p>
          )}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative aspect-4/3 w-full overflow-hidden bg-page-3">
              {shop.image ? (
                <Image src={shop.image} alt={t(shop.name, locale)} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[0.9375rem] tracking-[0.2em] text-stone">
                  写真{PENDING}
                </div>
              )}
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="type-body whitespace-pre-line">
                {shop.lede ? t(shop.lede, locale) : `${t(shop.name, locale)}（${t(shop.category, locale)}）の店舗紹介は${PENDING}です。`}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="mt-12 text-[0.875rem] md:text-[0.8125rem] tracking-[0.24em] text-stone uppercase">{dict.common.storeInformation}</h2>
              <dl className="mt-5 divide-y divide-ink/10 border-y border-ink/10 text-base">
                {rows.map((row) => (
                  <div key={row.label} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4">
                    <dt className="text-stone">{row.label}</dt>
                    <dd className={row.value ? 'text-ink/90' : 'text-stone'}>
                      {row.value ? (
                        row.href ? (
                          <a href={row.href} className="hover:text-brass">
                            {row.value}
                          </a>
                        ) : (
                          row.value
                        )
                      ) : (
                        PENDING
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.2} className="mt-10">
              <ButtonLink href={localePath(locale, '/contact')} variant="outline">
                {dict.contact.title}
              </ButtonLink>
            </Reveal>
          </div>
        </div>

        {shop.flyer && (
          <div className="shell mt-20">
            <h2 className="text-center text-[0.875rem] md:text-[0.8125rem] tracking-[0.24em] text-stone uppercase">Flyer</h2>
            <Reveal className="mx-auto mt-6 max-w-xl">
              <Image
                src={shop.flyer.src}
                alt={`${t(shop.name, locale)} のチラシ`}
                width={shop.flyer.width}
                height={shop.flyer.height}
                sizes="(max-width: 640px) 100vw, 36rem"
                className="h-auto w-full shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
              />
            </Reveal>
          </div>
        )}

        {shop.address && shop.mapEmbed && (
          <div className="mt-16">
            <MapEmbed src={shop.mapEmbed} title={t(shop.name, locale)} address={t(shop.address, locale)} cta={dict.common.openInMaps} />
          </div>
        )}
      </section>
    </>
  );
}

/** Simple linked cards for the hub pages. Shops without a photo show text only. */
export function ShopLinks({ shops, locale, eyebrow, title }: { shops: Shop[]; locale: Locale; eyebrow: string; title: string }) {
  if (!shops.length) return null;
  return (
    <section className="relative border-t border-ink/10 py-24 md:py-32">
      <div className="shell">
        <p className="type-eyebrow text-center">{eyebrow}</p>
        <h2 className="type-display mt-4 text-center text-[clamp(1.375rem,3vw,2.25rem)] text-ink">{title}</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shops.map((shop) => (
            <a
              key={shop.slug}
              href={localePath(locale, `/${shop.section}/${shop.slug}`)}
              className="group block border border-ink/12 transition-colors hover:border-brass"
            >
              <div className="relative aspect-[3/2] w-full overflow-hidden bg-page-3">
                {shop.image ? (
                  <Image src={shop.image} alt={t(shop.name, locale)} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[0.9375rem] md:text-[0.875rem] tracking-[0.2em] text-stone">写真{PENDING}</div>
                )}
              </div>
              <div className="p-6">
                <p className="text-[0.9375rem] md:text-[0.875rem] text-brass">{t(shop.category, locale)}</p>
                <p className="type-display mt-2 text-[1.1875rem] text-ink group-hover:text-brass">{t(shop.name, locale)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
