'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const strip = (p: string) => p.replace(/^\/(ja|en)(?=\/|$)/, '');

/** Last path shown. Module-level on purpose: /ja and /en have separate
 *  layouts, so this component remounts on a language switch and a ref
 *  would forget the previous page. */
let lastPath: string | null = null;

/**
 * Soft cross-fade + lift between routes, keyed on the pathname. Switching
 * language (same page, other locale) uses a quick fade with no lift, so the
 * 日本語 / EN switch feels instant.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const langOnly = lastPath !== null && lastPath !== pathname && strip(lastPath) === strip(pathname);
  if (typeof window !== 'undefined') lastPath = pathname;

  return (
    <motion.main
      key={pathname}
      initial={langOnly ? { opacity: 0.4, y: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={langOnly ? { duration: 0.22, ease: 'easeOut' } : { duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {children}
    </motion.main>
  );
}
