// Dev helper: screenshots of the intro, a transition and scroll positions.
// Usage: node scripts/shoot.mjs <outDir> [width] [height] [path]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [out, w = '1440', h = '900', route = '/'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const B = 'http://localhost:5310';
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));

const t0 = Date.now();
await page.goto(B + route, { waitUntil: 'domcontentloaded' });
for (const t of [300, 900, 1700, 2300, 2700, 4200]) {
  await wait(Math.max(0, t - (Date.now() - t0)));
  await page.screenshot({ path: `${out}/intro-${t}.png` });
}
const H = await page.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = +h; y < H; y += +h * 0.9) {
  await page.evaluate((y) => window.scrollTo(0, y), y);
  await wait(1600);
  await page.screenshot({ path: `${out}/scroll-${String(i++).padStart(2, '0')}.png` });
}
fs.writeFileSync(`${out}/errors.txt`, errors.join('\n') || 'none');
console.log('height', H, 'shots', i, 'errors', errors.length ? errors : 'none');
await browser.close();
