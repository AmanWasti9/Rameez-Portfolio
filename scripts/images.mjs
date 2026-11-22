// Converts the case-study images from the sibling project folders into
// optimised WebP files under public/work/<slug>/. Run: npm run images
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..', '..');
const out = path.resolve(import.meta.dirname, '..', 'public', 'work');

const sets = {
  dealboard: {
    dir: 'DealBoard/case-study',
    files: {
      cover: 'photos/00-cover.png',
      dashboard: 'photos/01-dashboard.png',
      pipeline: 'photos/02-pipeline.png',
      leads: 'photos/03-leads.png',
      forecast: 'photos/04-forecast.png',
      responsive: 'photos/05-responsive.png',
      landing: 'upwork/01-landing.png',
      drawer: 'upwork/04-deal-drawer.png',
      analytics: 'upwork/07-analytics.png',
      automation: 'upwork/08-automation.png',
      dark: 'upwork/10-dark-mode.png',
      system: 'upwork/12-design-system.png',
    },
  },
  dispatch: {
    dir: 'Dispatch/screenshots',
    files: {
      cover: 'case-study/00-cover.jpg',
      tracking: 'case-study/01-live-tracking.jpg',
      routes: 'case-study/02-route-optimization.jpg',
      shipments: 'case-study/03-shipments.jpg',
      analytics: 'case-study/04-analytics.jpg',
      responsive: 'case-study/05-responsive.jpg',
    },
  },
  elan: {
    dir: 'Match/match/screenshots',
    files: {
      cover: 'case-study/00-cover.png',
      hero: 'case-study/01-hero.png',
      polaroids: 'case-study/02-polaroids.png',
      story: 'case-study/03-story.png',
      light: 'case-study/04-light.png',
      mobile: 'mobile-01-hero.png',
    },
  },
};

for (const [slug, { dir, files }] of Object.entries(sets)) {
  await mkdir(path.join(out, slug), { recursive: true });
  for (const [name, file] of Object.entries(files)) {
    const src = path.join(root, dir, file);
    const dest = path.join(out, slug, `${name}.webp`);
    const info = await sharp(src).resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
    console.log(`${slug}/${name}.webp  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
  }
}
