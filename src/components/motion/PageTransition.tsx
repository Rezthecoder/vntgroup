'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { takeLangSwitch } from '@/lib/langSwitch';

const strip = (p: string) => p.replace(/^\/(ja|en)(?=\/|$)/, '');

/** Last path shown. Module-level on purpose: /ja and /en have separate
 *  layouts, so this component remounts on a language switch and a ref
 *  would forget the previous page. */
let lastPath: string | null = null;

/**
 * Soft cross-fade + lift between routes, keyed on the pathname. Switching
 * language (same page, other locale) glides in sideways, continuing the
 * glide-out started by the 日本語 / EN switch.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const langOnly = lastPath !== null && lastPath !== pathname && strip(lastPath) === strip(pathname);
  if (typeof window !== 'undefined') lastPath = pathname;
  // Language switch: glide in from the side opposite to where the old page left.
  const [dir] = useState(() => (typeof window !== 'undefined' && langOnly ? takeLangSwitch() : null));
  // Never leave the page hidden: clear the switch's glide-out state once shown.
  useEffect(() => {
    document.documentElement.classList.remove('lang-leaving');
  }, [pathname]);

  return (
    <motion.main
      key={pathname}
      initial={langOnly ? (dir ? { opacity: 0, x: dir === 'next' ? 28 : -28, y: 0 } : false) : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={langOnly ? { duration: 0.32, ease: [0.22, 1, 0.36, 1] } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {children}
    </motion.main>
  );
}
