'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type Lenis from 'lenis';

const R = 21;
const C = 2 * Math.PI * R;

/**
 * Back-to-top button: a frosted-glass circle in the bottom-right corner that
 * appears after the first screen. A thin VNT-red ring around it fills as the
 * page is read. It glides up through Lenis (the site's smooth scroller), or
 * jumps straight up for visitors who prefer reduced motion.
 */
export function ScrollToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(window.scrollY > 600);
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const toTop = () => {
    const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={label}
          title={label}
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          // Phones: sits above the fixed call / form bar. PC: bottom-right corner.
          className="glass-panel liquid-press fixed right-4 bottom-[calc(6.25rem+env(safe-area-inset-bottom))] z-[120] flex size-12 items-center justify-center rounded-full text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:right-8 md:bottom-8"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden>
            <circle cx="24" cy="24" r={R} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1.5" />
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="var(--color-brand)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
            />
          </svg>
          <svg viewBox="0 0 24 24" className="relative size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
