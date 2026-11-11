'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FlagWordmark } from '@/components/brand/FlagWordmark';

const SESSION_KEY = 'vnt:intro-played';

/**
 * Runs before first paint (inline in <head>): when the intro has already
 * played this session, or the visitor prefers reduced motion, the preloader
 * is hidden by CSS straight away, so it never flashes.
 */
export const introInitScript = `try{if(sessionStorage.getItem('${SESSION_KEY}')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('intro-skip')}catch(e){document.documentElement.classList.add('intro-skip')}`;

/**
 * Arrival screen, once per session: the VNT wordmark waves like a flag with a
 * gold rule drawing beneath it, then the curtain lifts. Rendered on the server
 * so it covers the page from the first frame.
 */
/** Set once the intro has played or been skipped in this tab. Module-level:
 *  /ja and /en have separate root layouts, so switching language remounts
 *  this component (and replaces <html>, dropping the intro-skip class). */
let introDone = false;

export default function Preloader({ tagline }: { tagline: string }) {
  // First load: render like the server (visible; CSS hides it if skipped).
  // Later remounts (language switch): start hidden, so it never re-appears.
  const [visible, setVisible] = useState(() => !introDone);

  useEffect(() => {
    if (introDone || document.documentElement.classList.contains('intro-skip')) {
      introDone = true;
      document.documentElement.classList.add('intro-skip');
      setVisible(false);
      return;
    }
    document.documentElement.style.overflow = 'hidden';
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {}
      introDone = true;
      setVisible(false);
      document.documentElement.style.overflow = '';
    }, 2600);
    return () => {
      window.clearTimeout(timer);
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="vnt-preloader fixed inset-0 z-[200] flex flex-col items-center justify-center bg-page"
          exit={{ y: '-100%' }}
          transition={{ duration: 1, ease: [0.83, 0, 0.17, 1] }}
        >
          <motion.div
            className="w-[min(68vw,24rem)] text-brand"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <FlagWordmark />
          </motion.div>

          <motion.div
            className="mt-4 h-px w-[min(60vw,22rem)] origin-left bg-[linear-gradient(90deg,var(--color-brand),var(--color-gold))]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.83, 0, 0.17, 1] }}
          />

          <motion.p
            className="font-latin mt-5 px-6 text-center text-[0.75rem] tracking-[0.2em] text-stone uppercase sm:text-[0.875rem] sm:tracking-[0.3em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {tagline}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
