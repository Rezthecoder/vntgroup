'use client';

import { useEffect } from 'react';

/**
 * Photos marked `.reveal-color` start in black and white and turn to colour
 * once they scroll into the middle of the screen, or when touched / hovered.
 * Once coloured they stay coloured. Mounted once in the layout; watches the
 * DOM so cards added after navigation are picked up too.
 */
export function ColorReveal() {
  useEffect(() => {
    // Reduced motion, or no IntersectionObserver: show everything in colour.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      document.documentElement.classList.add('reveal-color-off');
      return;
    }

    const colour = (el: Element) => el.classList.add('is-colored');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            colour(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      // Colour when the photo reaches the middle band of the screen.
      { rootMargin: '-25% 0px -25% 0px', threshold: 0 },
    );

    const watch = (root: ParentNode) => {
      root.querySelectorAll('.reveal-color:not(.is-colored):not([data-reveal-watched])').forEach((el) => {
        el.setAttribute('data-reveal-watched', '');
        io.observe(el);
      });
    };
    watch(document);

    const mo = new MutationObserver(() => watch(document));
    mo.observe(document.body, { childList: true, subtree: true });

    // Touch or hover colours a photo immediately.
    const onPointer = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.('.reveal-color');
      if (el) colour(el);
    };
    document.addEventListener('pointerdown', onPointer, { passive: true });
    document.addEventListener('pointerover', onPointer, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('pointerover', onPointer);
    };
  }, []);

  return null;
}
