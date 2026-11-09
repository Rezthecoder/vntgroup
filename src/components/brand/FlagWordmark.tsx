import { cn } from '@/lib/utils';
import { WORDMARK_PATHS } from './Wordmark';

const W = 947.01;
const H = 230.3;
const STRIPS = 40;

/**
 * The VNT wordmark waving like a flag. The logo is drawn once in <defs> and
 * shown through thin vertical strips; each strip bobs up and down a little
 * later than the one before it, so a wave runs from the pole (left, still)
 * to the free edge (right, widest swing). Pure SVG + CSS keyframes, so it
 * runs in iPhone Safari without JavaScript.
 */
export function FlagWordmark({ className, title = 'VNT GROUP' }: { className?: string; title?: string }) {
  const sw = W / STRIPS;
  return (
    <svg viewBox={`-10 -40 ${W + 20} ${H + 80}`} role="img" aria-label={title} fill="currentColor" className={cn('block h-auto w-full overflow-visible', className)}>
      <defs>
        <g id="vnt-flag-art">
          {WORDMARK_PATHS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        {Array.from({ length: STRIPS }, (_, i) => (
          <clipPath key={i} id={`vnt-flag-c${i}`}>
            {/* +0.6 overlaps neighbours so no hairline gaps show between strips. */}
            <rect x={i * sw - 0.3} y={-60} width={sw + 0.6} height={H + 120} />
          </clipPath>
        ))}
      </defs>
      {Array.from({ length: STRIPS }, (_, i) => (
        <g key={i} className="flag-strip" style={{ '--i': i, '--amp': i / (STRIPS - 1) } as React.CSSProperties}>
          <use href="#vnt-flag-art" clipPath={`url(#vnt-flag-c${i})`} />
        </g>
      ))}
    </svg>
  );
}
