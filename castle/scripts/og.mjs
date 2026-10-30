// Genera public/og.png (1200×630) capturando la cabecera ukiyo-e de la versión 2D.
// Uso: npm run build && (cd out && python3 -m http.server 4321) & node scripts/og.mjs
import { chromium } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dest = resolve(dirname(fileURLToPath(import.meta.url)), '../public/og.png');
const url = process.env.OG_URL || 'http://localhost:4321/?mode=2d';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
await page.addStyleTag({ content: 'header{display:none!important} main{max-width:none!important;padding:0!important} section[aria-label]{border:0!important;box-shadow:none!important}' });
const hero = page.locator('section[aria-label="見張りの城"] > div');
await hero.evaluate((el) => { el.style.width = '1200px'; el.style.height = '630px'; el.style.aspectRatio = 'auto'; });
await hero.screenshot({ path: dest });
await browser.close();
console.log('✓', dest);
