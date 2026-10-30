// Genera public/og.jpg (1200×630) capturando la vista de entrada del castillo en 3D, sin interfaz.
// Uso: npm run build && (cd out && python3 -m http.server 4321) & node scripts/og.mjs
import { chromium } from 'playwright';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dest = resolve(dirname(fileURLToPath(import.meta.url)), '../public/og.jpg');
const url = process.env.OG_URL || 'http://localhost:4321/?mode=3d';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(9000);
await page.addStyleTag({ content: 'header, .dock, .signature, .skip-link { display: none !important }' });
await page.mouse.move(600, 315);
await page.waitForTimeout(2500);
await page.screenshot({ path: dest, type: 'jpeg', quality: 86 });
await browser.close();
console.log('✓', dest);
