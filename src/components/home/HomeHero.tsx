'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Live home hero: the Yokohama harbour photo under the white header, the
 * Mincho line and its English echo set right, a white shadowed button, and
 * the three-line statement low on the left over the water. The live page's
 * stray "Type Something" placeholder is left out.
 *
 * Phone (like live): headline on ONE centred line, English + button centred
 * under it, and the statement left-aligned lower down in normal flow so it
 * never overlaps the button.
 */
export function HomeHero({
  line1,
  line2,
  intro,
  cta,
  ctaHref,
}: {
  line1: string;
  line2: string;
  intro: string;
  cta: string;
  ctaHref: string;
  scrollLabel?: string;
}) {
  const still = useReducedMotion();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section className="relative h-[34rem] w-full overflow-hidden md:h-[clamp(34rem,53vw,54rem)]">
      {/* The page's one orchestrated moment: the harbour settles from a slight
          zoom while the lines rise in. Skipped for reduced-motion visitors. */}
      <motion.div
        className="absolute inset-0"
        initial={still ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image src="/images/brand/hero-group.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      {/* Barely there: keeps the white type readable on bright sky without
          changing how the photograph looks. */}
      <div className="absolute inset-0 bg-linear-to-b from-sumi/10 via-transparent to-sumi/20" />

      <div className="relative flex h-full flex-col items-center justify-center px-5 pt-6 text-center md:-mt-[4%] md:items-end md:px-[8.5%] md:pt-0 md:text-right">
        <motion.h1
          {...rise(0.15)}
          className="type-mincho text-[clamp(1.45rem,6.2vw,1.85rem)] tracking-[0.06em] whitespace-nowrap text-washi [text-shadow:0_1px_10px_rgba(0,0,0,0.25)] md:text-[clamp(1.85rem,2.6vw,2.4rem)] md:tracking-[0.12em]"
        >
          {line1}
        </motion.h1>
        <motion.p
          {...rise(0.35)}
          className="mt-3 font-latin text-[clamp(0.9rem,3.6vw,1rem)] tracking-[0.03em] text-washi [text-shadow:0_1px_8px_rgba(0,0,0,0.3)] md:mt-4 md:text-[clamp(1rem,1.2vw,1.1rem)] md:tracking-[0.04em]"
        >
          {line2}
        </motion.p>
        <motion.div {...rise(0.55)} className="mt-6 md:mt-8">
          <Link
            href={ctaHref}
            className="glass-lit liquid-press inline-flex min-w-[14rem] items-center justify-center rounded-full px-8 py-3.5 text-[1rem] tracking-[0.08em] transition-colors md:min-w-[12rem]"
          >
            {cta}
          </Link>
        </motion.div>

        <motion.p
          {...rise(0.75)}
          className="mt-14 self-start text-left text-[1.0625rem] leading-[1.95] whitespace-pre-line text-washi [text-shadow:0_1px_8px_rgba(0,0,0,0.45)] md:absolute md:bottom-[calc(13%-4vw)] md:left-[12.5%] md:mt-0 md:self-auto md:text-[1.0625rem] md:leading-[1.95]"
        >
          {intro}
        </motion.p>
      </div>
    </section>
  );
}
