'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { Wordmark } from '@/components/brand/Wordmark';
import { LangSwitch } from '@/components/layout/LangSwitch';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { navigation } from '@/content/site';
import { localePath, t, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export type HotelNavLink = { id: string; label: string };

/**
 * Hotel masthead and navigation.
 *
 * - The hotel's wordmark centred on white under the slideshow.
 * - Phone: a slim glass navbar fixed to the top from the first screen —
 *   VNT logo (home) left, ≡ right (icons only; labels are for screen readers). It slides away while scrolling
 *   down and returns on scrolling up, so it never sits over what is being
 *   read but is there the moment the guest reaches for it.
 * - Tablet / laptop: the sticky section row, with the VNT logo at the left
 *   and ≡ at the right.
 * - The menu (a drawer from the right) lists this hotel's sections and the
 *   whole site, so the guest can switch to any page from anywhere.
 */
export function HotelHeader({
  name,
  nameJa,
  stars,
  links,
  contactHref,
  homeHref,
  locale = 'ja',
}: {
  name: string;
  nameJa: string;
  stars: number;
  links: HotelNavLink[];
  contactHref: string;
  homeHref: string;
  locale?: Locale;
}) {
  const ja = locale === 'ja';
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [barShown, setBarShown] = useState(true);

  // Scroll-spy for the section row.
  useEffect(() => {
    const targets = links.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const el of targets) if (el.getBoundingClientRect().top <= 120) current = el.id;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [links]);

  // Phone navbar: hide while scrolling down, show on scrolling up / near the top.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setBarShown(true);
      else if (y > last + 6) setBarShown(false);
      else if (y < last - 6) setBarShown(true);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Drawer open: lock page scroll, close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const linkClass =
    'relative block py-3 text-[0.875rem] tracking-[0.05em] text-ink-mute transition-colors hover:text-ink lg:text-[0.9375rem] lg:tracking-[0.06em]';
  const drawerLink = 'block border-b border-ink/10 py-3 text-[0.9375rem] tracking-[0.06em] text-ink-mute transition-colors hover:text-ink';
  const menuLabel = ja ? 'メニュー' : 'Menu';
  const homeLabel = ja ? 'ホーム' : 'Home';

  const Burger = () => (
    <span aria-hidden className="relative block h-[0.75rem] w-5">
      <span className="absolute top-0 left-0 h-[1.5px] w-5 rounded bg-current" />
      <span className="absolute top-[0.33rem] left-0 h-[1.5px] w-5 rounded bg-current" />
      <span className="absolute top-[0.66rem] left-0 h-[1.5px] w-5 rounded bg-current" />
    </span>
  );

  return (
    <>
      {/* Phone: slim navbar fixed to the top, VNT home left, menu right. */}
      <div
        className={cn(
          'glass-bar fixed inset-x-0 top-0 z-[135] pt-[env(safe-area-inset-top)] shadow-[0_2px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out md:hidden',
          barShown || open ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Link href={homeHref} aria-label={`VNT GROUP ${homeLabel}`} className="flex items-center gap-2 text-brand">
            <Wordmark className="h-[1.15rem] w-auto" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="hotel-menu"
            aria-label={menuLabel}
            className="-mr-2 flex size-11 items-center justify-center rounded-full text-ink"
          >
            <Burger />
          </button>
        </div>
      </div>

      {/* Wordmark block, white, centred. */}
      <div className="bg-page px-5 pt-16 pb-8 text-center md:pt-24 md:pb-10">
        <a href="#top" className="inline-block">
          <span className="block font-latin text-[clamp(1.5rem,3vw,2.4rem)] tracking-[0.22em] text-ink">{name}</span>
          <span className="mt-1 block text-[1.125rem] tracking-[0.3em] text-star">{'★'.repeat(stars)}</span>
          <span className="mt-2 block text-[0.9375rem] tracking-[0.3em] text-stone md:text-[0.875rem]">{nameJa}</span>
        </a>
      </div>

      {/* Tablet / laptop: sticky row — VNT home | sections | theme + menu. */}
      <header className="glass-bar sticky top-0 z-[130] hidden border-t border-ink/10 md:block">
        <div className="flex items-center justify-between gap-4 px-5 lg:px-8">
          <Link
            href={homeHref}
            aria-label={`VNT GROUP ${homeLabel}`}
            className="flex shrink-0 items-center gap-2 py-3 text-brand transition-opacity hover:opacity-75"
          >
            <Wordmark className="h-[1rem] w-auto" />
          </Link>

          <nav aria-label="Page sections" className="min-w-0">
            <ul className="flex flex-row items-center justify-center gap-4 lg:gap-7 xl:gap-9">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={active === link.id ? 'true' : undefined}
                    className={cn(linkClass, active === link.id && 'text-ink')}
                  >
                    {link.label}
                    <span
                      className={cn(
                        'absolute inset-x-0 bottom-1 h-px origin-center bg-ink transition-transform duration-300',
                        active === link.id ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </a>
                </li>
              ))}
              <li>
                <Link href={contactHref} className={linkClass}>
                  {ja ? 'お問い合わせ' : 'Contact'}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            <LangSwitch locale={locale} className="hidden lg:inline-flex" />
            <ThemeToggle className="hidden lg:inline-flex" />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="hotel-menu"
              aria-label={menuLabel}
              className="flex size-11 items-center justify-center text-ink transition-opacity hover:opacity-70"
            >
              <Burger />
            </button>
          </div>
        </div>
      </header>

      {/* Menu: this hotel's sections, then the whole site. */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[140]">
            <motion.button
              type="button"
              aria-label={ja ? '閉じる' : 'Close'}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-sumi/25 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.nav
              id="hotel-menu"
              aria-label={menuLabel}
              className="glass-panel absolute inset-y-0 right-0 flex w-[68%] max-w-[22rem] flex-col overflow-y-auto overscroll-contain px-5 pt-[env(safe-area-inset-top)] pb-8 shadow-[-12px_0_32px_rgba(0,0,0,0.12)]"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-ink/10">
                <LangSwitch locale={locale} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 py-2 text-[0.875rem] font-bold tracking-[0.1em] text-ink"
                >
                  <span aria-hidden className="text-[1.25rem] leading-none">×</span>
                  {ja ? '閉じる' : 'Close'}
                </button>
              </div>

              <p className="mt-5 text-[0.75rem] tracking-[0.18em] text-brand">{name}</p>
              <ul className="mt-1 flex flex-col">
                {links.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active === link.id ? 'true' : undefined}
                      className={cn(drawerLink, active === link.id && 'text-ink')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <Link href={contactHref} onClick={() => setOpen(false)} className={drawerLink}>
                    {ja ? 'お問い合わせ' : 'Contact'}
                  </Link>
                </li>
              </ul>

              <p className="mt-7 text-[0.75rem] tracking-[0.18em] text-brand">VNT GROUP</p>
              <ul className="mt-1 flex flex-col">
                {navigation.map((item) => (
                  <li key={item.href} className="border-b border-ink/10">
                    <Link
                      href={localePath(locale, item.href)}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-[0.9375rem] font-medium tracking-[0.04em] text-ink"
                    >
                      {t(item.label, locale)}
                    </Link>
                    {item.children && (
                      <div className="flex flex-col gap-2 pb-3 pl-3">
                        {item.children.map((child) => {
                          const href = localePath(locale, child.href);
                          const here = pathname === href;
                          return (
                            <Link
                              key={child.href}
                              href={href}
                              onClick={() => setOpen(false)}
                              aria-current={here ? 'page' : undefined}
                              className={cn('text-[0.875rem] leading-snug tracking-[0.03em] text-ink-mute', here && 'font-bold text-brand')}
                            >
                              {t(child.label, locale)}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <ThemeToggle />
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
