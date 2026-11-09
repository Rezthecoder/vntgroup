import Image from 'next/image';
import Link from 'next/link';

import { Reveal } from '@/components/motion/Reveal';
import type { Shop } from '@/content/shops';
import { getDictionary } from '@/content/dictionary';
import { localePath, t, type Locale } from '@/lib/i18n';

const IMG = '/images/shops/sakai-';

const SCENES = [
  { src: `${IMG}scene-dinner.webp`, caption: '大切な方とのご会食に' },
  { src: `${IMG}scene-private.webp`, caption: '個室でゆったりと' },
  { src: `${IMG}scene-celebration.webp`, caption: '記念日・ご接待にも' },
];

/**
 * 堺花月, laid out after the restaurant's own flyer: a washi hero with the
 * plum-and-moon emblem and the dining room, a dark 懐石料理 band, three
 * scenes, then the shop details. Photos are cut from the flyer (VNT) until
 * full-size originals arrive. The flyer's phone number is a placeholder, so
 * the page sends visitors to the enquiry form instead.
 */
export function SakaiKagetsuPage({ shop, locale }: { shop: Shop; locale: Locale }) {
  const dict = getDictionary(locale);
  const contactHref = localePath(locale, '/contact');

  return (
    <div className="bg-[#f7f3ea] text-[#2a2420] dark:bg-page dark:text-ink">
      {/* 1. Hero: emblem + name on washi, dining room on the right ---------------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-[76rem] gap-8 px-5 pt-10 pb-14 md:grid-cols-[0.85fr_1.5fr] md:gap-10 md:pt-16 md:pb-20">
          <Reveal className="flex flex-col items-center text-center md:items-start md:text-left">
            <Image src={`${IMG}emblem.webp`} alt="" width={137} height={156} className="w-28 dark:invert dark:hue-rotate-180 md:w-32" />
            <p className="type-mincho mt-6 text-[2rem] leading-none tracking-[0.2em]">堺</p>
            <h1 className="type-mincho mt-2 text-[clamp(4.5rem,9vw,7rem)] leading-[1.05] font-semibold tracking-[0.06em]">
              花<span className="hidden md:inline">
                <br />
              </span>
              月
            </h1>
            <p className="font-latin mt-6 text-[1.125rem] tracking-[0.3em] uppercase">Sakai Kagetsu</p>
            <p className="font-latin mt-1 text-[0.8125rem] tracking-[0.35em] text-stone uppercase">Japanese Cuisine</p>
            <p className="type-mincho mt-8 text-[1.25rem] leading-[1.9] tracking-[0.12em] whitespace-pre-line">
              {'七十年、\n受け継がれる\n日本の味とおもてなし'}
            </p>
          </Reveal>

          <Reveal from="right" duration={1.1} className="relative min-h-[26rem] overflow-hidden rounded-sm md:min-h-[38rem]">
            <Image src={`${IMG}room.webp`} alt="堺花月の座敷" fill priority sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,14,10,0.78),rgba(20,14,10,0.25)_45%,rgba(20,14,10,0)_70%)]" />
            <div className="absolute inset-x-0 top-0 p-5 pr-16 text-washi md:p-10 md:pr-28">
              <h2 className="type-mincho text-[clamp(1.25rem,2.6vw,2rem)] leading-[1.6] tracking-[0.1em]">
                四季を味わい、心を結ぶ
                <br />
                特別なひととき
              </h2>
              <p className="mt-4 text-[0.875rem] leading-[2] tracking-[0.04em] text-washi/90 md:text-[0.9375rem] md:tracking-[0.06em]">
                旬の食材と伝統の技で仕立てる、
                <br />
                ここにしかない懐石料理を、
                <br />
                落ち着いた和の空間でお楽しみください。
              </p>
            </div>
            {/* Black ribbon: 創業七十年 */}
            <div className="absolute top-0 right-3 flex gap-2 bg-[#14110f]/90 px-2.5 pt-3 pb-4 text-[#d9b77c] md:right-6 md:px-4 md:pt-4 md:pb-5">
              <p className="writing-vertical type-mincho text-[1.125rem] tracking-[0.3em] md:text-[1.75rem]">創業七十年</p>
              <p className="writing-vertical type-mincho hidden text-[0.8125rem] tracking-[0.25em] text-washi/85 md:block">受け継がれる伝統、変わらぬおもてなし</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. 懐石料理: dark band ------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-[#14110f] text-washi">
        <div aria-hidden className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(45deg,#d9b77c_0_1px,transparent_1px_22px)]" />
        <div className="relative mx-auto grid max-w-[76rem] items-center gap-8 px-5 py-14 md:py-20 lg:grid-cols-[auto_1.5fr_1fr] lg:gap-10">
          <Reveal className="hidden justify-center lg:flex">
            <p className="writing-vertical type-mincho text-[1.5rem] leading-[2] tracking-[0.3em] text-[#e9dcc0]">
              季節の彩りを、一皿に込めて
            </p>
          </Reveal>
          <Reveal from="left" duration={1.1} className="relative aspect-[2/1] overflow-hidden rounded-sm">
            <Image src={`${IMG}kaiseki.webp`} alt="懐石料理" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="type-mincho text-[1.125rem] tracking-[0.2em] text-[#e9dcc0] lg:hidden">季節の彩りを、一皿に込めて</p>
            <h2 className="type-mincho mt-3 text-[clamp(2rem,3.4vw,2.75rem)] tracking-[0.25em] text-[#d9b77c] lg:mt-0">懐石料理</h2>
            <span aria-hidden className="mt-4 block h-px w-16 bg-[#d9b77c]/70" />
            <p className="mt-5 text-[1rem] leading-[2.1] tracking-[0.06em] text-washi/90">
              旬の恵みを大切に、一品一品に心を込めた懐石料理。目で楽しみ、舌で味わい、心に残るひとときを。日本の四季が織りなす、美しい味わいをお届けします。
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. Scenes ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-[76rem] px-5 py-14 md:py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {SCENES.map((s, i) => (
            <Reveal key={s.src} from={i % 2 === 0 ? 'left' : 'right'} duration={1.1} delay={i * 0.06}>
              <figure>
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm shadow-[0_14px_30px_-14px_rgba(0,0,0,0.35)]">
                  <Image src={s.src} alt={s.caption} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
                <figcaption className="type-mincho mt-4 text-center text-[1.0625rem] tracking-[0.12em]">{s.caption}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. Shop details ------------------------------------------------------------ */}
      <section className="bg-seigaiha">
        <div className="mx-auto grid max-w-[76rem] items-center gap-8 px-5 py-14 md:grid-cols-[0.9fr_1.2fr_0.8fr] md:gap-10 md:py-20">
          <Reveal from="left" duration={1.1} className="relative aspect-[5/3] overflow-hidden rounded-sm">
            <Image src={`${IMG}storefront.webp`} alt="堺花月の店構え" fill sizes="(max-width: 768px) 100vw, 30vw" className="object-cover" />
          </Reveal>

          <Reveal delay={0.08}>
            <p className="type-mincho text-[2rem] tracking-[0.2em] text-ink">
              <span className="text-[1.375rem]">堺</span> 花月
            </p>
            <p className="font-latin mt-1 text-[0.9375rem] tracking-[0.3em] text-stone uppercase">Sakai Kagetsu</p>
            <dl className="mt-6 space-y-2.5 text-[1rem] text-ink">
              {shop.address && (
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-stone">{dict.common.address}</dt>
                  <dd>{t(shop.address, locale)}</dd>
                </div>
              )}
              {shop.hours && (
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-stone">{dict.common.hours}</dt>
                  <dd>{t(shop.hours, locale)}</dd>
                </div>
              )}
              {shop.closed && (
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-stone">定休日</dt>
                  <dd>{t(shop.closed, locale)}</dd>
                </div>
              )}
            </dl>
            <Link href={contactHref} className="btn-pill btn-pill-brand liquid-press mt-7">
              ご予約・お問い合わせ
            </Link>
          </Reveal>

          <Reveal delay={0.16} className="text-center md:text-left">
            <p className="type-mincho text-[1.375rem] leading-[2] tracking-[0.15em] text-ink">
              変わらぬ味を、
              <br />
              これからも。
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
