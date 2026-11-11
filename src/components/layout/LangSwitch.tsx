'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';

import { switchLocalePath, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Slide length; the page change starts part-way through so the two overlap. */
const SLIDE_MS = 180;
const NAV_AFTER_MS = 0;

/**
 * Smooth page change between languages with the View Transitions API: the
 * old page glides out and the new one glides in (towards the left for
 * EN, the right for 日本語). /ja and /en have separate root layouts, so
 * <html> is replaced; the switch on the new page finishes the transition
 * when it mounts. Browsers without the API just switch.
 */
let finishSwitch: (() => void) | null = null;
let switchDir: 'next' | 'prev' = 'next';

type VTDocument = Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };

/**
 * 日本語 | EN — one big tap target: the whole pill links to the same page in
 * the other language (44px tall). On tap the dark highlight slides across
 * to the new language while the page change starts, so it feels smooth
 * without waiting.
 */
export function LangSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const router = useRouter();
  const other: Locale = locale === 'ja' ? 'en' : 'ja';
  const href = switchLocalePath(pathname, other);
  const [shown, setShown] = useState<Locale>(locale);

  // Back in sync after the new page arrives (or browser back/forward).
  useEffect(() => setShown(locale), [locale]);

  // New page mounted mid-transition: restore the direction (the old <html>
  // carried it) and let the transition play.
  useEffect(() => {
    if (!finishSwitch) return;
    document.documentElement.dataset.langDir = switchDir;
    const done = finishSwitch;
    finishSwitch = null;
    // Resolve now: the browser pauses animation frames until the update
    // callback settles, so waiting for one would deadlock.
    done();
  }, []);
  useEffect(() => router.prefetch(href), [router, href]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // new tab etc.
    e.preventDefault();
    if (shown !== locale) return; // already switching
    setShown(other);
    const go = () => (NAV_AFTER_MS ? window.setTimeout(() => router.push(href), NAV_AFTER_MS) : router.push(href));

    const doc = document as VTDocument;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduce) {
      go();
      return;
    }
    switchDir = other === 'en' ? 'next' : 'prev';
    document.documentElement.dataset.langDir = switchDir;
    doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          finishSwitch = resolve;
          go();
          // Safety net: never hold the screen if the new page is slow.
          window.setTimeout(() => {
            if (finishSwitch === resolve) finishSwitch = null;
            resolve();
          }, 1500);
        }),
    );
  };

  // Fixed half widths so the highlight can slide exactly from one to the other.
  const JA_W = '4.75rem';
  const EN_W = '3.25rem';

  const label = (lang: Locale, text: string) => (
    <span
      lang={lang}
      style={{ width: lang === 'ja' ? JA_W : EN_W }}
      className={cn(
        'relative z-10 flex h-full items-center justify-center text-[0.875rem] font-bold tracking-[0.04em] whitespace-nowrap transition-colors duration-300',
        shown === lang ? 'text-page' : 'text-ink-mute group-hover:text-ink',
      )}
    >
      {text}
    </span>
  );

  return (
    <Link
      href={href}
      hrefLang={other}
      onClick={onClick}
      aria-label={other === 'en' ? 'English' : '日本語'}
      className={cn(
        'group glass-panel liquid-press relative inline-flex h-11 shrink-0 items-center rounded-full p-1 select-none',
        className,
      )}
    >
      {/* Sliding highlight */}
      <span
        aria-hidden
        className="absolute top-1 bottom-1 left-1 rounded-full bg-ink shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-[transform,width] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={{
          transitionDuration: `${SLIDE_MS}ms`,
          width: shown === 'ja' ? JA_W : EN_W,
          transform: shown === 'ja' ? 'translateX(0)' : `translateX(${JA_W})`,
        }}
      />
      {label('ja', '日本語')}
      {label('en', 'EN')}
    </Link>
  );
}
