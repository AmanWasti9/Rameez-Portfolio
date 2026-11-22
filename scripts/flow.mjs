// Dev helper: walks through the site and captures transitions and pages.
// Usage: node scripts/flow.mjs <outDir>   (dev server on :5310)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const B = 'http://localhost:5310';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--hide-scrollbars'],
});
const errors = [];
const shot = (p, n) => p.screenshot({ path: `${out}/${n}.png` });

const page = await browser.newPage();
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
await page.setViewport({ width: 1440, height: 900 });
await page.goto(B + '/', { waitUntil: 'networkidle0' });
await wait(5500);
await shot(page, 'a-hero');

// Transition: click "Work" in the nav.
const work = await page.$('.nav-links a[href="/work"]');
const box = await work.boundingBox();
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
for (const t of [200, 500, 800, 1100, 1400]) { await wait(t === 200 ? 200 : 300); await shot(page, `b-tx-${t}`); }
await wait(2500);
await shot(page, 'c-work');

// Hover the second row for the preview, then open it.
await page.evaluate(() => window.scrollTo(0, 520));
await wait(1800);
const row = (await page.$$('.index-link'))[1];
const rb = await row.boundingBox();
await page.mouse.move(rb.x + rb.width * 0.55, rb.y + rb.height / 2, { steps: 8 });
await wait(1200);
await shot(page, 'd-work-hover');
await page.mouse.click(rb.x + rb.width * 0.55, rb.y + rb.height / 2);
await wait(3500);
await shot(page, 'e-case');
const ys = [1100, 2000, 3200];
for (let i = 0; i < ys.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), ys[i]);
  await wait(1800);
  await shot(page, `e-case-${i}`);
}
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await wait(2000);
await shot(page, 'f-footer');

for (const r of ['/about', '/contact']) {
  await page.goto(B + r, { waitUntil: 'networkidle0' });
  await wait(4500);
  await shot(page, `g-${r.slice(1)}`);
  await page.evaluate(() => window.scrollTo(0, 1000));
  await wait(1800);
  await shot(page, `g-${r.slice(1)}-2`);
}

const m = await browser.newPage();
m.on('pageerror', (e) => errors.push(String(e)));
await m.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await m.goto(B + '/', { waitUntil: 'networkidle0' });
await wait(5000);
await shot(m, 'h-mobile-hero');
await m.tap('.nav-toggle');
await wait(1400);
await shot(m, 'h-mobile-menu');
await m.tap('.nav-toggle');
await wait(900);
await m.evaluate(() => window.scrollTo(0, 2200));
await wait(1800);
await shot(m, 'h-mobile-work');

console.log('errors:', errors.length ? errors : 'none');
await browser.close();
