'use client';

import { motion } from 'motion/react';

/** Confirmation shown in place of a form once it has been sent. */
export function SuccessPanel({ title, body }: { title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="border border-brass/35 bg-brass/5 px-8 py-16 text-center md:px-16"
    >
      <motion.span
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-brass"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-2xl text-brass">✓</span>
      </motion.span>

      <h3 className="type-display mt-8 text-[clamp(1.25rem,3vw,1.75rem)] text-ink">{title}</h3>
      <p className="type-body mx-auto mt-5 max-w-lg">{body}</p>
    </motion.div>
  );
}
