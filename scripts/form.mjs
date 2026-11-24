// Dev helper: fills and submits the contact form and screenshots the result.
// Usage: node scripts/form.mjs <outDir> [port]   (dev server must be running)
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const [out, port = '5311'] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--hide-scrollbars'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const requests = [];
page.on('request', (r) => r.url().includes('emailjs') && requests.push(`${r.method()} ${r.url()}`));
await page.goto(`http://localhost:${port}/contact`, { waitUntil: 'networkidle0' });
await wait(5000);
await page.type('input[name=name]', 'TEST (ignore)');
await page.type('input[name=email]', 'client@example.com');
await page.type('textarea[name=message]', 'This is an automated test of the portfolio contact form. Please ignore.');
await page.click('button[type=submit]');
await wait(150);
await page.screenshot({ path: `${out}/form-sending.png` });
await wait(3000);
await page.screenshot({ path: `${out}/form-result.png` });
console.log('requests:', requests);
console.log('note:', await page.$eval('.form-note', (n) => n.textContent));
await browser.close();
