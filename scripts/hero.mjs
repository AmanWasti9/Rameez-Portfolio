// Dev helper: settled hero screenshots at several viewport sizes.
// Usage: node scripts/hero.mjs <outDir>   (dev server on :5310)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const sizes = [[1910, 790], [1440, 900], [1920, 1080], [1280, 720], [390, 844]];
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--hide-scrollbars'],
});
for (const [w, h] of sizes) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: w < 500 });
  await page.goto('http://localhost:5310/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 5500));
  const m = await page.evaluate(() => {
    const hero = document.querySelector('.hero');
    const name = document.querySelector('.hero-name');
    const inner = document.querySelector('.hero-name-inner');
    const r = inner.getBoundingClientRect();
    return {
      heroH: hero.scrollHeight, vh: innerHeight,
      font: getComputedStyle(name).fontSize,
      nameRight: Math.round(r.right), frameRight: Math.round(name.getBoundingClientRect().right),
    };
  });
  console.log(`${w}x${h}`, JSON.stringify(m));
  await page.screenshot({ path: `${out}/hero-${w}x${h}.png` });
  await page.close();
}
await browser.close();
