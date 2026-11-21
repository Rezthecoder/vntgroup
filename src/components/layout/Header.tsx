'use client';

import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { headerNav } from '@/content/site';
import { localePath, t, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { LangSwitch } from './LangSwitch';
import { MenuOverlay } from './MenuOverlay';
import { Wordmark } from '@/components/brand/Wordmark';

/** Each hotel page carries its own header, as on the live site. */
const OWN_HEADER = /^\/(ja|en)\/hotels\/[^/]+\/?$/;

/**
 * The live site's header: white bar, red VNT mark on the left, the five
 * Japanese links in bold, then 施設予約 (red outline) and お問い合わせ
 * (red fill). Sticky, so it stays reachable on long pages; the live one
 * scrolls away.
 */
export function Header({ locale, labels }: { locale: Locale; labels: { menu: string; close: string; contact: string } }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (OWN_HEADER.test(pathname)) return null;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-[130] transition-[background-color,box-shadow] duration-500',
          // Solid at the top of the page; frosted glass once content scrolls under it.
          scrolled && !open ? 'glass-bar shadow-[0_2px_16px_rgba(0,0,0,0.06)]' : 'bg-page',
        )}
      >
        {/* PC (xl+): logo | links centred on the page | contact. Below xl: logo | contact + menu.
            The full row needs about 1,140px in Japanese (お問い合わせ is wider than
            Contact), so it starts at xl; below that the links are in the menu. */}
        <div className="flex h-(--header-h) items-center justify-between gap-6 px-5 md:px-10 xl:grid xl:grid-cols-[1fr_auto_1fr]">
          <Link href={localePath(locale)} aria-label="VNT GROUP" className="shrink-0 justify-self-start text-brand transition-opacity hover:opacity-75">
            <Wordmark className="h-6 w-auto md:h-7" />
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {headerNav.map((item) => (
              <Link
                key={item.href + item.label.ja}
                href={localePath(locale, item.href)}
                className="whitespace-nowrap text-[1.0625rem] font-bold text-ink transition-colors hover:text-brand"
              >
                {t(item.label, locale)}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 justify-self-end md:gap-5">
            <LangSwitch locale={locale} className="hidden sm:inline-flex" />
            <ThemeToggle />
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href={localePath(locale, '/contact')}
                className="whitespace-nowrap rounded-lg bg-brand px-6 py-3.5 text-[1.0625rem] font-bold text-washi shadow-[0_4px_12px_rgba(183,41,41,0.3)] transition-opacity hover:opacity-85"
              >
                {labels.contact}
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? labels.close : labels.menu}
              className="relative z-[130] flex h-11 w-11 items-center justify-center xl:hidden"
            >
              <span className="relative block h-3.5 w-7">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute left-0 block h-[2px] w-full bg-ink"
                    animate={
                      open
                        ? { top: '50%', rotate: i === 1 ? 0 : i === 0 ? 45 : -45, opacity: i === 1 ? 0 : 1 }
                        : { top: `${i * 50}%`, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.35 }}
                  />
                ))}
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>{open && <MenuOverlay locale={locale} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
