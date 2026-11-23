# CLAUDE.md — VNT GROUP site

Read this first. It is the shared context for every Claude session and account
working on this repo, so keep it up to date when something here changes.

## What this is

A rebuild of the corporate site for VNT株式会社 / VNT Co., Ltd.
(https://vntgroup.co.jp). It replaces the old STUDIO no-code site with Next.js.
It is a client job with a fixed scope, so **don't add new pages or sections
unless the owner asks for them.**

- **Languages:** Japanese is the default. English was removed on 6 Nov 2026 and
  brought back on 10 Nov 2026 after the boss agreed to it.
- **HISANO** (https://hisano-jp.com) is a separate site. This repo only links to
  it from the Business page.
- **Hosting:** Vercel, free Hobby plan. The domains are registered at
  ムームードメイン (Muumuu Domain).
- **Enquiries** go to `sales-1@vntgroup.co.jp` through Web3Forms, posted from the
  browser. There are no API routes, no mail server and no Resend; don't add any.

## Stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion
(animation), Lenis (smooth scroll) and zod.

```bash
npm install
npm run dev        # http://localhost:3000 → /ja
npm run typecheck  # run before every commit
npm run build      # must pass before a PR
```

## Where things live

```
src/app/[locale]/      every page; locale = ja | en (root layout is here)
src/content/           ALL copy and data. Pages hold no hard-coded text
src/components/        layout/ motion/ forms/ ui/ hotel/ home/ company/ sections/ brand/
src/lib/i18n.ts        locales, t(), localePath(), switchLocalePath()
src/lib/langSwitch.ts  state for the 日本語/EN switch animation
src/middleware.ts      un-prefixed URLs → /ja (always /ja; there is no Accept-Language detection)
next.config.ts         308 redirects from the old STUDIO URLs
public/images/         WebP photos grouped by property (fuji/, nagoya/, toji/, shops/, …)
```

| Content file | Holds |
| --- | --- |
| `site.ts` | Company details, address and phone numbers, navigation, footer |
| `dictionary.ts` | UI labels and section copy |
| `hotels.ts` / `hotelStay.ts` | Fuji Premium Hotel, Nagoya Premium Hotel, Premium Toji: rooms, galleries, spots, OTA links |
| `dining.ts` | 芸者亭 (Geisha-tei) and the Warakutei yakiniku and yakitori venues |
| `shops.ts` | Shops: 京彩堂 Kyosaido, Kix Japan drug 泉佐野店, 堺 花月 Sakai Kagetsu |
| `business.ts` | Business areas, HISANO, supplier call, Ikegami Store |
| `company.ts` | President's message, facts, revenue, licences |
| `news.ts` | Announcements, newest first |

## Finding code: use Graphify first

The repo is indexed in Graphify (MCP tools `mcp__Graphify__*`, repository
`Rezthecoder/vntgroup`). To save tokens, look code up there before grepping or
reading whole files:

- where something is defined → `graphify_find`
- who uses it / what a change affects → `graphify_callers`, `graphify_impact`
- a file's imports and dependents → `graphify_file_neighbors`
- "how does X work" → `query_graph` (use `skeleton: true` to just locate things)

Each result has a `commitSha`. If it equals `git rev-parse HEAD`, trust it. If
not, read the current version of any file changed since then. For literal text
(copy, image paths, config values) plain grep is still faster.

## Rules

- **Text:** every string is an `L10n` value, `{ ja: string; en?: string }`. Read
  it with `t(value, locale)`. A missing `en` falls back to Japanese. When you add
  or change Japanese copy, add the English too, unless the page is meant to be
  Japanese only (the 芸者亭 page currently is).
- **Links:** build internal links with `localePath(locale, '/path')`, never with
  a bare `/path`.
- **New hotel, venue or shop:** add one entry to the right array in
  `src/content/`. Routes, sitemap and navigation pick it up automatically.
- **Images:** WebP, at most 2400px wide, in the matching `public/images/<group>/`
  folder. Client photos replace placeholders; give a new version a new file name
  (e.g. `fuji-triple-v2.webp`) rather than overwriting the old one.
- **Motion:** everything must respect `prefers-reduced-motion`. The language
  switch uses View Transitions and must keep working in Safari.
- **Japanese line breaks:** use `splitForStagger` in `lib/utils.ts` for split text
  so that 、。」 never start a line.
- **Link previews (OGP):** every page's `generateMetadata` returns
  `pageMeta()` from `src/lib/seo.ts` (own title, description, canonical and
  preview image). Preview images are 1200×630 JPGs in `public/og/`, made by
  `scripts/og-images.mjs` (runs as `prebuild`) from hotel/venue heroes, shop
  photos and its `PAGE_SOURCES` list. A new page photo used as a preview must
  be one of those. URLs use `siteOrigin` (Vercel's production domain).
- **Third-party embeds:** Google Maps and YouTube stay behind click-to-load
  facades.
- **Design:** warm washi paper background, sumi ink text and a brass accent, all
  defined in `src/app/globals.css`. Use the existing tokens; don't hard-code
  colours.

## Workflow

- Make one small branch per change (e.g. `fuji-hotel-dining`), then open a PR
  into `main` and merge it. Vercel deploys from `main`.
- Commit messages should be short and say which page they touch, for example:
  `Fuji お食事: the hotel's own crab meals`.
- Commit and push often, so another account or session can pick up the work
  from the last commit.
- **Note:** parts of `README.md` are out of date. It still mentions API routes,
  a rate limiter, mail variables and Accept-Language redirects. Trust the code
  and this file.

## Current status

_Update this section at the end of each session._

- Bilingual JA/EN is live, with an animated language switch (loader and glide).
  Below 1280px the header shows the menu button instead of the link row
  (Japanese labels would otherwise wrap); menu panels use `data-lenis-prevent`.
- 販売店 (`/retail`): イケガミストア → 京彩堂ドラッグ 東寺店 → Kix Japan drug
  泉佐野店 → 京小町, all in the same block. Ikegami's own page is
  `/retail/ikegami-store`. Shops have address, TEL, map, 10:00〜22:00 and 年中無休.
- 飲食店 (`/dining`): 芸者亭 → 和楽亭 (2.1 焼肉, 2.2 焼鳥) → 堺花月; no shops on it.
- Home FOOD & SHOP shows every restaurant and shop.
- Hotel お食事 use the client's own meal photos (Fuji crab, Nagoya 夕食/朝食,
  Toji shabu-shabu); dish names were written from the photos.
- Next: from the client — photos for 京彩堂, store descriptions for 京彩堂 /
  京小町, confirmation of dish names; Toji's review links.
