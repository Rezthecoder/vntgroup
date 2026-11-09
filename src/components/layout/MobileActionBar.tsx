'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import { site } from '@/content/site';
import { localePath, type Locale } from '@/lib/i18n';

/**
 * Phone and the enquiry form stay one thumb away on small screens, where the
 * header's desktop CTAs are hidden. Slides in once the hero is behind you,
 * and stays out of the way on the contact form itself.
 *
 * Not shown on the home page: the live vntgroup.co.jp home has no such bar
 * (the home page is a 1:1 match of live), it only helps on the hotel /
 * dining pages where a group booking is the goal.
 */
export function MobileActionBar({
  locale,
  labels,
}: {
  locale: Locale;
  labels: { call: string; contact: string };
}) {
  const [shown, setShown] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, 'change', (y) => setShown(y > 520));

  const isHome = /^\/(ja|en)\/?$/.test(pathname) || pathname === '/';
  if (isHome || pathname.endsWith('/contact')) return null;

  return (
    <motion.div
      // Floating Liquid Glass capsule, as the iOS 26 tab bar.
      className="glass-panel fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[110] grid grid-cols-2 gap-1.5 rounded-full p-1.5 md:hidden"
      initial={{ y: '160%' }}
      animate={{ y: shown ? '0%' : '160%' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <a
        href={`tel:${site.telGroup.replace(/-/g, '')}`}
        className="liquid-press flex flex-col items-center justify-center gap-0.5 rounded-full py-2"
      >
        <span className="text-[0.8125rem] tracking-[0.2em] text-stone uppercase">{labels.call}</span>
        <span className="type-display text-[1.0625rem] tracking-[0.08em] text-brass">{site.telGroup}</span>
      </a>

      <Link
        href={localePath(locale, '/contact')}
        className="liquid-press flex flex-col items-center justify-center gap-0.5 rounded-full bg-brass py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-1px_1px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(183,41,41,0.6)]"
      >
        <span className="text-[0.8125rem] tracking-[0.2em] text-page/70 uppercase">Form</span>
        <span className="text-[0.9375rem] tracking-[0.12em] text-page">{labels.contact}</span>
      </Link>
    </motion.div>
  );
}
