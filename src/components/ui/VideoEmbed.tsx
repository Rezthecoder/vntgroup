'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'motion/react';

/**
 * Click-to-play YouTube facade — keeps the player (and its cookies) off the
 * page until a visitor asks for it, and keeps LCP off a third-party iframe.
 */
export function VideoEmbed({
  id,
  poster,
  label,
  title,
}: {
  id: string;
  poster: string;
  label: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-page-2">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0"
          aria-label={label}
        >
          <Image src={poster} alt="" fill sizes="100vw" className="object-cover" />
          <span className="absolute inset-0 bg-sumi/45 transition-colors duration-500 group-hover:bg-sumi/30" />

          {/* Play button with a heartbeat and ripples spreading out from it. */}
          <span className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 md:h-24 md:w-24">
            <span aria-hidden className="play-ripple absolute inset-0 rounded-full border-2 border-[#e0605a]" />
            <span aria-hidden className="play-ripple absolute inset-0 rounded-full border-2 border-[#d9b77c] [animation-delay:0.9s]" />
            <motion.span
              className="play-beat relative flex h-full w-full items-center justify-center rounded-full bg-[#b72929] shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_10px_30px_-6px_rgba(183,41,41,0.75)]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span aria-hidden className="ml-1.5 block h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-white" />
            </motion.span>
          </span>

          <span className="absolute bottom-6 left-6 text-[0.875rem] md:text-[0.8125rem] tracking-[0.28em] text-washi/90 uppercase">
            {label}
          </span>
        </button>
      )}
    </div>
  );
}
