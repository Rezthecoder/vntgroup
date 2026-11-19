import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { PageHero } from '@/components/sections/PageHero';
import { ContactForm } from '@/components/forms/ContactForm';
import { Reveal } from '@/components/motion/Reveal';
import { MapEmbed } from '@/components/ui/MapEmbed';

import { getDictionary } from '@/content/dictionary';
import { site } from '@/content/site';
import { isLocale, type Locale } from '@/lib/i18n';
import { pageMeta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ja = locale === 'ja';
  return pageMeta({
    locale: ja ? 'ja' : 'en',
    path: '/contact',
    image: '/images/brand/hero-main.webp',
    title: ja ? 'お問い合わせ' : 'Contact',
    description: ja
      ? '事業・お取引・採用に関するお問い合わせはこちらから。'
      : 'Enquiries about our business, partnerships and careers.',
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const active = locale as Locale;
  const dict = getDictionary(active);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={dict.contact.title}
        image="/images/brand/hero-main.webp"
        height="h-[52vh] min-h-[20rem] md:h-[62vh]"
      />

      <section className="relative py-24 md:py-32">
        <div className="shell">
          <div className="grid gap-14 lg:grid-cols-[0.62fr_1.38fr] lg:gap-20">
            <div>
              <Reveal>
                <dl className="space-y-8">
                  <div>
                    <dt className="text-[0.8125rem] tracking-[0.26em] text-stone uppercase">{dict.footer.tel}</dt>
                    <dd className="type-display mt-2 text-xl text-brass">
                      <a href={`tel:${site.tel.replace(/-/g, '')}`} className="hover:opacity-75">
                        {site.tel}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] tracking-[0.26em] text-stone uppercase">
                      {dict.common.groupDesk}
                    </dt>
                    <dd className="type-display mt-2 text-xl text-brass">
                      <a href={`tel:${site.telGroup.replace(/-/g, '')}`} className="hover:opacity-75">
                        {site.telGroup}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] tracking-[0.26em] text-stone uppercase">{dict.footer.email}</dt>
                    <dd className="mt-2 text-base text-ink/90">
                      <a href={`mailto:${site.email}`} className="hover:text-brass">
                        {site.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.8125rem] tracking-[0.26em] text-stone uppercase">{dict.common.address}</dt>
                    <dd className="mt-2 text-base leading-[1.95] text-ink/85">
                      {site.address.postal}
                      <br />
                      {active === 'ja' ? site.address.ja : site.address.en}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            <ContactForm locale={active} />
          </div>
        </div>
      </section>

      <MapEmbed
        src={site.mapEmbed}
        title="VNT Co., Ltd."
        address={active === 'ja' ? site.address.ja : site.address.en}
        cta={dict.common.openInMaps}
      />
    </>
  );
}
