import Image from "next/image";

import { Reveal } from "@/components/motion/Reveal";

type Reviews = {
  google?: { score: number; date: string; href?: string };
  ranks: { site: string; logo?: string; stars: number; href?: string }[];
};

function Stars({
  n,
  of = 5,
  className = "",
}: {
  n: number;
  of?: number;
  className?: string;
}) {
  return (
    <span aria-hidden className={`tracking-[0.12em] ${className}`}>
      <span className="text-star">{"★".repeat(Math.round(n))}</span>
      <span className="text-ink/15">
        {"★".repeat(Math.max(0, of - Math.round(n)))}
      </span>
    </span>
  );
}

/**
 * The live page's rating strip: Google review score and the booking sites'
 * hotel ranks, with the sites' logos as the live page shows them (on a white
 * patch in dark mode so the grey marks stay legible); each badge links to
 * its listing where the live page does.
 */
export function ReviewBadges({
  reviews,
  locale,
}: {
  reviews: Reviews;
  locale: "ja" | "en";
}) {
  const ja = locale === "ja";
  const card =
    "group flex h-full flex-col items-center justify-center gap-1 rounded-xl border border-ink/10 bg-page px-1.5 py-4 text-center sm:gap-2 sm:rounded-2xl sm:px-6 sm:py-7 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:border-gold/60";
  const Wrap = ({
    href,
    children,
  }: {
    href?: string;
    children: React.ReactNode;
  }) =>
    href ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={card}>
        {children}
      </a>
    ) : (
      <div className={card}>{children}</div>
    );

  return (
    <section
      aria-label={ja ? "口コミ評価" : "Reviews"}
      className="px-4 pt-12 pb-2 md:px-5 md:pt-20 md:pb-4"
    >
      <div className="mx-auto grid max-w-[60rem] grid-cols-3 gap-2 sm:gap-4">
        {reviews.google && (
          <Reveal from="left" distance={50}>
            <Wrap href={reviews.google.href}>
              <span className="dark:rounded-md dark:bg-white dark:px-1.5 dark:py-1">
                <Image
                  src="/images/brands/google-maps.webp"
                  alt="Google Maps"
                  width={640}
                  height={124}
                  className="h-[1.05rem] w-auto sm:h-[1.75rem]"
                />
              </span>
              <span className="text-[0.6875rem] tracking-[0.1em] text-stone sm:text-[0.75rem] sm:tracking-[0.2em]">
                {ja ? "口コミ評価" : "Review"}
              </span>
              <span className="mt-1 flex items-baseline gap-1.5">
                <span className="font-latin text-[1.9rem] leading-none text-ink sm:text-[2.6rem]">
                  {reviews.google.score.toFixed(1)}
                </span>
                <span className="text-[0.8125rem] text-stone sm:text-[0.9375rem]">
                  / 5
                </span>
              </span>
              <Stars
                n={reviews.google.score}
                className="text-[0.8125rem] sm:text-[1.125rem]"
              />
              <span className="text-[0.625rem] text-stone sm:text-[0.75rem]">
                {reviews.google.date} {ja ? "時点" : ""}
              </span>
            </Wrap>
          </Reveal>
        )}
        {reviews.ranks.map((r, i) => (
          <Reveal
            key={r.site}
            delay={0.1 * (i + 1)}
            from={i % 2 ? "left" : "right"}
            distance={50}
          >
            <Wrap href={r.href}>
              {r.logo ? (
                <span className="flex h-[2rem] items-center dark:rounded-md dark:bg-white dark:px-1.5 sm:h-[3.25rem]">
                  <Image
                    src={r.logo}
                    alt={r.site}
                    width={640}
                    height={r.site === "Google Maps" ? 124 : 330}
                    className={
                      r.site === "agoda"
                        ? "h-[1.9rem] w-auto sm:h-[3.1rem]"
                        : r.site === "Google Maps"
                          ? "h-[1.05rem] w-auto sm:h-[1.75rem]"
                          : "h-[0.85rem] w-auto sm:h-[1.45rem]"
                    }
                  />
                </span>
              ) : (
                <span className="text-[0.8125rem] font-bold whitespace-nowrap text-ink sm:text-[1.25rem]">
                  {r.site}
                </span>
              )}
              <span className="text-[0.6875rem] tracking-[0.1em] text-stone sm:text-[0.75rem] sm:tracking-[0.2em]">
                Hotel Rank
              </span>
              <Stars
                n={r.stars}
                of={r.stars}
                className="mt-1 text-[0.9375rem] sm:text-[1.375rem]"
              />
            </Wrap>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
