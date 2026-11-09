import Link from 'next/link';
import type { ReactNode } from 'react';
import { footerNav, site, type FooterLink } from '@/content/site';
import { getDictionary } from '@/content/dictionary';
import { localePath, t, type Locale } from '@/lib/i18n';
import { Reveal } from '@/components/motion/Reveal';
import { Wordmark } from '@/components/brand/Wordmark';

/**
 * Mirrors the live site's footer item for item: VNT GROUP, PREMIUM HOTEL with
 * FOOD & SHOP beneath it, then the corporate links over the address block, and
 * the copyright centred at the foot.
 */
export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <footer className="relative overflow-hidden bg-[#1a1715] text-washi">
      {/* VNT red line with a touch of gold at its centre. */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,#b72929,#b08d57_50%,#b72929)]" />
      {/* Faint warm glow behind the columns. */}
      <span aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(183,41,41,0.16),transparent)]" />

      {/* Extra bottom padding on mobile clears the fixed action bar. */}
      <div className="shell relative pt-16 pb-28 md:pt-20 md:pb-12">
        <Link href={localePath(locale)} aria-label="VNT GROUP" className="mb-12 inline-flex flex-col items-start gap-2.5 transition-opacity hover:opacity-80">
          <Wordmark className="h-7 w-auto text-[#d23a3a] md:h-8" />
          <span className="font-latin text-[0.75rem] tracking-[0.18em] text-[#d9b77c] uppercase md:text-[0.875rem] md:tracking-[0.3em]">Beyond. Connected. To the World.</span>
        </Link>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-6 md:gap-10">
          {/* VNT GROUP ------------------------------------------------------ */}
          <Reveal>
            <Heading>{footerNav.group.title}</Heading>
            <LinkList links={footerNav.group.links} locale={locale} />
          </Reveal>

          {/* PREMIUM HOTEL + FOOD & SHOP ------------------------------------- */}
          <Reveal delay={0.06}>
            <Heading>{footerNav.hotels.title}</Heading>
            <LinkList links={footerNav.hotels.links} locale={locale} />

            <div className="mt-5">
              <Heading>{footerNav.food.title}</Heading>
              <LinkList links={footerNav.food.links} locale={locale} />
            </div>
          </Reveal>

          {/* Corporate + contact -------------------------------------------- */}
          <Reveal delay={0.12}>
            <ul className="space-y-3.5">
              {footerNav.corporate.map((link) => (
                <li key={link.href + link.label.ja}>
                  <FooterAnchor href={localePath(locale, link.href)}>{t(link.label, locale)}</FooterAnchor>
                </li>
              ))}
            </ul>

            <span aria-hidden className="mt-2 block h-px w-full max-w-[16rem] bg-[#d9b77c]/60" />

            <address className="mt-6 text-[1rem] leading-[1.95] text-washi not-italic">
              <p>{site.address.postal}</p>
              {locale === 'ja' ? (
                <>
                  <p>神奈川県横浜市中区弥生町2-15-1</p>
                  <p>ストークタワー大通り公園III</p>
                </>
              ) : (
                <p>{site.address.en}</p>
              )}
            </address>

            <dl className="mt-5 space-y-2.5 text-[1rem]">
              <ContactRow label={dict.footer.tel}>
                <a href={`tel:${site.tel.replace(/-/g, '')}`} className="transition-colors hover:text-[#e0605a]">
                  {site.tel}
                </a>
              </ContactRow>
              <ContactRow label={dict.footer.fax}>{site.fax}</ContactRow>
              <ContactRow label={dict.footer.email}>
                <a href={`mailto:${site.email}`} className="transition-colors hover:text-[#e0605a]">
                  {site.email}
                </a>
              </ContactRow>
            </dl>
          </Reveal>
        </div>

        <p className="mt-16 border-t border-washi/10 pt-6 text-center text-[0.9375rem] text-washi/45">
          {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}

/** Column heading with the short underline the original uses. */
function Heading({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-latin inline-block border-b border-[#d9b77c] -ml-1 pl-1 pr-3 pb-1 text-[1.125rem] tracking-[0.12em] text-[#d9b77c] uppercase">
      {children}
    </h3>
  );
}

function LinkList({ links, locale }: { links: FooterLink[]; locale: Locale }) {
  return (
    <ul className="mt-4 space-y-3.5">
      {links.map((link) => (
        <li key={link.href + link.label.ja}>
          <FooterAnchor href={localePath(locale, link.href)}>{t(link.label, locale)}</FooterAnchor>
        </li>
      ))}
    </ul>
  );
}

function FooterAnchor({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="text-[1rem] text-washi/90 transition-colors duration-300 hover:text-[#e0605a]">
      {children}
    </Link>
  );
}

function ContactRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 text-washi">
      <dt className="shrink-0">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
