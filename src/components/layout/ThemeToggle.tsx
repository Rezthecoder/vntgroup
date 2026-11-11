'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Theme = 'light' | 'dark';
const KEY = 'vnt-theme';

/**
 * Runs in <head> before the page paints, so a visitor who chose dark mode
 * never sees a flash of the light theme. Light is the default.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${KEY}');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`;

function apply(theme: Theme) {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* storage unavailable (private mode): the choice lasts for this page only */
  }
}

/**
 * Re-applies the saved theme. Mounted in the locale layout: switching
 * 日本語 / EN replaces <html> (each language has its own root layout), which
 * drops data-theme, and the head script only runs on a full page load.
 */
export function ThemeRestore() {
  // Layout effect: runs before the browser paints the new page, so no light flash.
  useLayoutEffect(() => {
    try {
      if (localStorage.getItem(KEY) === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    } catch {}
  }, []);
  return null;
}

/** Compact light / dark switch: a sliding pill with a sun and a moon. */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {}
    setTheme(saved === 'dark' || document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  }, []);

  const dark = theme === 'dark';
  const toggle = () => {
    const next: Theme = dark ? 'light' : 'dark';
    apply(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
      title={dark ? 'ライトモード' : 'ダークモード'}
      onClick={toggle}
      className={cn(
        'glass-panel liquid-press relative inline-flex h-8 w-[3.75rem] shrink-0 items-center rounded-full p-1',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-1 left-1 size-6 rounded-full bg-page shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          dark && 'translate-x-[1.75rem]',
        )}
      />
      <span aria-hidden className="relative z-10 flex w-full items-center justify-between px-[0.3rem] text-ink">
        {/* sun */}
        <svg viewBox="0 0 24 24" className={cn('size-3.5 transition-opacity', dark ? 'opacity-45' : 'opacity-100')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        {/* moon */}
        <svg viewBox="0 0 24 24" className={cn('size-3.5 transition-opacity', dark ? 'opacity-100' : 'opacity-45')} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}
