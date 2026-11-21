import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { SupplierCall } from '@/components/sections/SupplierCall';
import { ShopLinks } from '@/components/sections/ShopPage';
import { retailShops } from '@/content/shops';
import { Reveal } from '@/components/motion/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ButtonLink } from '@/components/ui/ArrowLink';

import { ikegami } from '@/content/business';
import { getDictionary } from '@/content/dictionary';
import { isLocale, localePath, t, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const active: Locale = isLocale(locale) ? locale : 'ja';
  return pageMeta({
    locale: active,
    path: '/retail/ikegami-store',
    image: ikegami.image,
    title: t(ikegami.name, active),
    description: t(ikegami.lede, active),
  });
}

export default async function IkegamiStorePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const active = locale as Locale;
  const dict = getDictionary(active);

  return (
    <>
      {/* Bright masthead: the storefront photo is shown whole, with no dark
          scrim, so the full イケガミストア / IKEGAMI STORE sign reads clearly. */}
      <section className="bg-page-2 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="shell text-center">
          <p className="type-eyebrow">Ikegami Store</p>
          <h1 className="type-display mt-4 text-[clamp(1.75rem,4.4vw,3.25rem)] text-ink">{t(ikegami.name, active)}</h1>
          {/* No fade-in: this is the first thing on the page, so it shows at full strength at once. */}
          <div className="mx-auto mt-10 max-w-[62.5rem]">
            <Image
              src={ikegami.image}
              alt={`${t(ikegami.name, active)}（IKEGAMI STORE）の店舗外観`}
              width={1000}
              height={601}
              priority
              sizes="(max-width: 1024px) 100vw, 62.5rem"
              className="h-auto w-full shadow-[0_10px_40px_rgba(0,0,0,0.12)]"
            />
          </div>
        </div>
      </section>

      <section className="relative py-24 md:py-32">
        <div className="shell">
          <Reveal className="mx-auto max-w-3xl">
            <p className="type-mincho text-[clamp(1rem,2vw,1.35rem)] leading-[2.1] text-ink/90">{t(ikegami.lede, active)}</p>
          </Reveal>
        </div>
      </section>

      {/* Stores ----------------------------------------------------------- */}
      <section className="relative border-t border-ink/10 py-24 md:py-32">
        <div className="shell">
          <SectionHeading eyebrow="Stores" title={dict.common.storeInformation} />

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {ikegami.branches.map((branch, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="h-full border border-ink/12 p-8 md:p-10">
                  <h3 className="type-display text-[1.25rem] leading-snug text-ink">{t(branch.name, active)}</h3>
                  <dl className="mt-7 space-y-4 text-base">
                    <div>
                      <dt className="text-[0.8125rem] tracking-[0.24em] text-stone uppercase">{dict.common.address}</dt>
                      <dd className="mt-1.5 leading-[1.95] text-ink/85">{t(branch.address, active)}</dd>
                    </div>
                    {branch.tel && (
                      <div>
                        <dt className="text-[0.8125rem] tracking-[0.24em] text-stone uppercase">TEL</dt>
                        <dd className="mt-1.5">
                          <a href={`tel:${branch.tel.replace(/-/g, '')}`} className="text-ink/85 hover:text-brass">
                            {branch.tel}
                          </a>
                        </dd>
                      </div>
                    )}
                    {branch.hours && (
                      <div>
                        <dt className="text-[0.8125rem] tracking-[0.24em] text-stone uppercase">{dict.common.hours}</dt>
                        <dd className="mt-1.5 text-ink/85">{t(branch.hours, active)}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="mt-12 text-center">
            <ButtonLink href={localePath(active, '/contact')} variant="outline">
              {dict.contact.title}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* As on the live Ikegami page: the supplier call follows the stores. */}
      <SupplierCall locale={active} />

      <ShopLinks shops={retailShops} locale={active} eyebrow="Other Stores" title={active === 'en' ? 'Other stores' : 'その他の店舗'} />
    </>
  );
}
