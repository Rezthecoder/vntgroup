import Image from 'next/image';
import Link from 'next/link';

import { Reveal } from '@/components/motion/Reveal';
import { supplierCall, supplierCallExtras } from '@/content/business';
import { localePath, t, type Locale } from '@/lib/i18n';

/**
 * 新規の仕入先を探しています — the live site's supplier panel (home and
 * Ikegami Store), redesigned: the head-office tower at dusk under a deep
 * navy wash, a gold eyebrow and ornament, the two sales channels, a
 * three-step "how it works" strip in glass cards and the red お問い合わせ (CONTACT in English) pill.
 * On phones the photo becomes a band above the copy so the text never sits
 * on the busy building facade.
 */
export function SupplierCall({ locale }: { locale: Locale }) {
  const x = supplierCallExtras;
  return (
    <section className="px-0 py-14 md:px-[1.875rem] md:py-24">
      <div className="relative isolate overflow-hidden bg-[#13203f] md:rounded-2xl md:shadow-[0_30px_60px_-30px_rgba(19,32,63,0.6)]">
        {/* Photo: a top band on phones, the full background from md up. */}
        <div className="relative aspect-[16/9] md:absolute md:inset-0 md:-z-10 md:aspect-auto">
          <Image
            src="/images/business/supplier.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[72%_center]"
          />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#13203f] md:hidden" />
          <div className="absolute inset-0 hidden bg-linear-to-r from-[#13203f] via-[#13203f]/80 to-[#13203f]/10 md:block" />
        </div>
        {/* Thin red→gold line along the top edge. */}
        <div className="absolute inset-x-0 top-0 z-10 h-[3px] bg-linear-to-r from-[#d23a3a] via-[#d9b77c] to-transparent" />
        {/* Faint red glow behind the copy. */}
        <div className="pointer-events-none absolute -bottom-40 -left-32 -z-[5] h-[28rem] w-[28rem] rounded-full bg-[#d23a3a]/20 blur-3xl" />

        <div className="relative px-6 pt-2 pb-12 md:px-14 md:py-20 lg:px-20">
          <Reveal from="left" className="max-w-[40rem]">
            <p className="text-[0.8125rem] font-semibold tracking-[0.32em] text-[#d9b77c] uppercase">{x.eyebrow}</p>
            <h2 className="type-display mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.45] font-bold text-white">
              {t(supplierCall.title, locale)}
            </h2>
            <span className="ornament ornament-lit ornament-left" aria-hidden />

            <p className="mt-7 text-[1.0625rem] leading-[2.05] tracking-[0.04em] whitespace-pre-line text-white/88">
              {t(supplierCall.body, locale)}
            </p>

            {/* Where suppliers' products are sold. */}
            <ul className="mt-8 flex flex-wrap gap-3">
              {x.channels.map((c) => (
                <li
                  key={c.name.ja}
                  className="rounded-full border border-[#d9b77c]/45 bg-white/[0.06] px-4 py-2 backdrop-blur-sm"
                >
                  <span className="font-bold tracking-[0.06em] text-white">{t(c.name, locale)}</span>
                  <span className="ml-2 text-[0.8125rem] text-[#e7d3ad]">{t(c.note, locale)}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* How it works. */}
          <ol className="mt-10 grid max-w-[52rem] gap-3 sm:grid-cols-3">
            {x.steps.map((s, i) => (
              <Reveal
                key={i}
                as="li"
                delay={0.12 * i}
                from={i % 2 ? 'right' : 'left'}
                distance={50}
                className="flex h-full gap-4 rounded-xl border border-white/12 bg-white/[0.07] p-4 backdrop-blur-md sm:block sm:p-5"
              >
                  <span className="type-display text-[1.6rem] leading-none text-[#d9b77c]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="sm:mt-3">
                    <p className="font-bold tracking-[0.05em] text-white">{t(s.title, locale)}</p>
                    <p className="mt-1 text-[0.9375rem] leading-[1.75] text-white/75 [word-break:auto-phrase]">{t(s.body, locale)}</p>
                  </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href={localePath(locale, '/contact')}
              className="group inline-flex items-center gap-3 rounded-full bg-[#d23a3a] py-3.5 pr-4 pl-7 font-bold tracking-[0.12em] text-white shadow-[0_14px_30px_-12px_rgba(210,58,58,0.85)] transition hover:bg-[#b72929]"
            >
              {locale === 'ja' ? 'お問い合わせ' : 'CONTACT'}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white/18 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
            <span className="text-[0.9375rem] text-white/70">{t(x.cta, locale)}</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
