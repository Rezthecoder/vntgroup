'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { Wordmark } from '@/components/brand/Wordmark';
import { cn } from '@/lib/utils';

/**
 * The one VNT home button on hotel pages: a glass pill floating bottom-left
 * (mirroring the back-to-top button on the right). It slides away while the
 * page is scrolling and comes back as soon as scrolling stops, so it never
 * covers what the guest is reading but is always there when they pause.
 */
export function HomeFab({ href, label }: { href: string; label: string }) {
  const [shown, setShown] = useState(true);

  useEffect(() => {
    let timer = 0;
    const onScroll = () => {
      setShown(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setShown(true), 650);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <Link
      href={href}
      aria-label={`VNT GROUP ${label}`}
      className={cn(
        'glass-panel liquid-press fixed bottom-[calc(6.25rem+env(safe-area-inset-bottom))] left-4 z-[120] flex h-12 items-center gap-2 rounded-full px-4 text-ink shadow-[0_8px_24px_rgba(0,0,0,0.16)] transition-[opacity,transform] duration-300 ease-out md:bottom-8 md:left-8',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
      )}
    >
      <Wordmark className="h-[0.95rem] w-auto text-brand" />
      <span className="text-[0.8125rem] font-bold tracking-[0.1em]">{label}</span>
    </Link>
  );
}
