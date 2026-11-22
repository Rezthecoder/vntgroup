// Link-preview images (Open Graph): 1200×630 JPGs in public/og, made from the
// photos the pages already use. JPG because LINE and some other apps don't
// show WebP previews. Runs before every build (npm "prebuild"), so a new
// hotel, venue or shop gets its preview automatically.
//
// Sources: hotel/venue heroes and shop photos in src/content, plus the page
// photos listed in PAGE_SOURCES. Output path mirrors the source:
// /images/fuji/fuji-03.webp → /og/fuji/fuji-03.jpg (see ogImage() in src/lib/seo.ts).
import { mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PAGE_SOURCES = [
  '/images/brand/hero-group.webp', // home, news (default)
  '/images/brand/hero-main.webp', // company, contact
  '/images/business/product-03.webp', // business
  '/images/toji/toji-01.webp', // hotels hub
  '/images/geisya/geisya-01.webp', // dining hub
  '/images/ikegami/store-01.webp', // retail (Ikegami Store)
];
// Tall photos: where the 1200×630 window sits, 0 = top … 1 = bottom.
const FOCUS_Y = { '/images/shops/kyosaido-kimono-v1.webp': 0.36 };

// Main photos only: hotel and venue heroes, shop photos.
const CONTENT_FIELDS = [
  ['hotels.ts', /^ {4}hero:\s*'([^']+)'/gm],
  ['dining.ts', /^ {4}hero:\s*'([^']+)'/gm],
  ['shops.ts', /^ {4}image:\s*'([^']+)'/gm],
];

async function contentSources() {
  const found = new Set();
  for (const [file, re] of CONTENT_FIELDS) {
    const text = await readFile(path.join(ROOT, 'src/content', file), 'utf8');
    for (const m of text.matchAll(re)) found.add(m[1]);
  }
  return found;
}

const sources = new Set([...PAGE_SOURCES, ...(await contentSources())]);
let made = 0;
for (const src of sources) {
  const input = path.join(ROOT, 'public', src);
  const out = path.join(ROOT, 'public', ogPath(src));
  try {
    const [a, b] = await Promise.all([stat(input), stat(out).catch(() => null)]);
    if (b && b.mtimeMs >= a.mtimeMs) continue; // up to date
  } catch {
    console.warn(`og-images: missing ${src}`);
    continue;
  }
  await mkdir(path.dirname(out), { recursive: true });
  const fy = FOCUS_Y[src];
  let img = sharp(input);
  if (fy !== undefined) {
    const { width = 1200, height = 630 } = await img.metadata();
    const h = Math.round((height * 1200) / width);
    const top = h > 630 ? Math.round((h - 630) * fy) : 0;
    img = sharp(await img.resize(1200).toBuffer()).extract({ left: 0, top, width: 1200, height: Math.min(630, h) });
  }
  await img.resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  made++;
}
console.log(`og-images: ${made} made, ${sources.size} total`);

function ogPath(src) {
  return src.replace(/^\/images\//, '/og/').replace(/\.(webp|jpe?g|png)$/, '.jpg');
}
