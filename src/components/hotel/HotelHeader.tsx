'use client';

import { Wordmark } from '@/components/brand/Wordmark';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

export type HotelNavLink = { id: string; label: string };

/**
 * The reference hotel site's masthead: the hotel's wordmark centred on
 * white under the slideshow, then one centred row of small Japanese links
 * (予約する first, in colour), ruled underneath. The link row pins to the
 * top while the page scrolls and underlines the current section. On phones
 * it folds into a メニュー toggle that opens a drawer sliding in from the
 * right over 40% of the screen; the rest of the page stays visible, dimmed,
 * and a tap on it closes the drawer.
 */
export function HotelHeader({
  name,
  nameJa,
  stars,
  links,
  contactHref,
  homeHref,
}: {
  name: string;
  nameJa: string;
  stars: number;
  links: HotelNavLink[];
  contactHref: string;
  homeHref: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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

  // Drawer open: lock page scroll, close on Escape, close if the viewport grows to desktop.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const linkClass =
    'relative block py-2 text-[0.9375rem] tracking-[0.06em] text-ink-mute transition-colors hover:text-ink md:py-3';

  const drawerLink = 'block border-b border-ink/10 py-3.5 text-[0.9375rem] tracking-[0.08em] text-ink-mute';

  return (
    <>
      {/* Wordmark block, white, centred. */}
      <div className="bg-page px-5 pt-16 pb-8 text-center md:pt-24 md:pb-10">
        <a href="#top" className="inline-block">
          <span className="block font-latin text-[clamp(1.5rem,3vw,2.4rem)] tracking-[0.22em] text-ink">
            {name}
          </span>
          <span className="mt-1 block text-[1.125rem] tracking-[0.3em] text-star">{'★'.repeat(stars)}</span>
          <span className="mt-2 block text-[0.9375rem] md:text-[0.875rem] tracking-[0.3em] text-stone">{nameJa}</span>
        </a>
      </div>

      <header className="glass-bar sticky top-0 z-[130] border-t border-ink/10">
        <div className="flex items-center justify-between px-5 md:hidden">
          <Link href={homeHref} aria-label="VNT GROUP ホーム" className="py-3 text-brand">
            <Wordmark className="h-[1.05rem] w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="hotel-mobile-menu"
            className="py-3 text-[0.9375rem] tracking-[0.1em] text-ink"
          >
            {open ? '閉じる' : 'メニュー'}
            </button>
          </div>
        </div>

        {/* Desktop: VNT logo (home) at the left, centred links, theme switch at the right. */}
        <Link
          href={homeHref}
          aria-label="VNT GROUP ホーム"
          className="absolute top-1/2 left-8 hidden -translate-y-1/2 items-center gap-2 text-brand transition-opacity hover:opacity-75 xl:flex"
        >
          <Wordmark className="h-[1.05rem] w-auto" />
          <span className="text-[0.8125rem] font-bold tracking-[0.1em] text-ink-mute">ホーム</span>
        </Link>
        <ThemeToggle className="absolute top-1/2 right-5 hidden -translate-y-1/2 md:inline-flex" />
        <nav aria-label="Page sections" className="hidden px-5 md:block">
          <ul className="flex flex-row items-center justify-center gap-4 lg:gap-7 xl:gap-9">
            {/* Tablets: the logo leads the row (the corner logo shows from xl up). */}
            <li className="xl:hidden">
              <Link href={homeHref} aria-label="VNT GROUP ホーム" className="block py-3 text-brand">
                <Wordmark className="h-[0.95rem] w-auto" />
              </Link>
            </li>
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
                お問い合わせ
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Phone: drawer from the right, 40% of the screen wide. */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[140] md:hidden">
            <motion.button
              type="button"
              aria-label="閉じる"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-sumi/25 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.nav
              id="hotel-mobile-menu"
              aria-label="Page sections"
              className="absolute inset-y-0 right-0 flex w-[40%] min-w-[9.5rem] flex-col overflow-y-auto glass-panel px-4 pb-8 shadow-[-12px_0_32px_rgba(0,0,0,0.12)]"
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-end border-b border-ink/10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="py-3 text-[0.9375rem] tracking-[0.1em] text-ink"
                >
                  閉じる
                </button>
              </div>
              <ul className="flex flex-col">
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
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href={homeHref} onClick={() => setOpen(false)} className={cn(drawerLink, 'border-b-0 text-stone')}>
                    VNTグループ ホーム
                  </Link>
                </li>
              </ul>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
