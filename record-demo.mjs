import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire('C:/Users/91944/.agents/skills/playwright/run.js');
const { chromium } = require('playwright');

const outputDir = path.resolve('public/recordings');
const finalPath = path.join(outputDir, 'moveguard-ai-walkthrough.webm');
fs.mkdirSync(outputDir, { recursive: true });
if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath);

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: outputDir, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();

await page.goto('https://movegaurdai.vercel.app/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.getByRole('link', { name: 'Try Demo', exact: true }).click();
await page.waitForTimeout(2500);
await page.goBack({ waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' }));
await page.waitForTimeout(4500);
await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
await page.waitForTimeout(4500);

const videoPath = await page.video().path();
await context.close();
await browser.close();
fs.renameSync(videoPath, finalPath);
console.log(`Recording saved to ${finalPath}`);
console.log(`Bytes: ${fs.statSync(finalPath).size}`);
