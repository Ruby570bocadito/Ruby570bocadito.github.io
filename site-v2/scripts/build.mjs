// Build de producción: cliente + SSR, prerender del HTML y publicación en la raíz del repo (GitHub Pages, rama main).
// node scripts/build.mjs            -> escribe en la raíz del repo (lo que se publica)
// node scripts/build.mjs --out dir  -> escribe en otra carpeta, para previsualizar sin tocar el repo
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const client = resolve(site, '.client');
const outArg = process.argv.indexOf('--out');
const out = outArg > -1 ? resolve(process.argv[outArg + 1]) : resolve(site, '..');
const run = cmd => execSync(cmd, { cwd: site, stdio: 'inherit' });

// La raíz del repo guarda también cosas que no salen de este build: nunca se pisan.
const PROTECTED = new Set(['.git', '.gitignore', '.nojekyll', 'README.md', 'robots.txt', 'cv.pdf', 'site', 'site-v2', 'assets', 'projects']);

run('npx vite build');
run('npx vite build --ssr src/entry-server.jsx');

const { render } = await import(pathToFileURL(resolve(site, '.ssr/entry-server.js')).href);
const html = readFileSync(resolve(client, 'index.html'), 'utf8').replace('<!--app-->', () => render());
writeFileSync(resolve(client, 'index.html'), html);

// Solo se reemplaza lo que genera el build (index.html, 404.html, static/, img/...); el resto de la raíz no se toca.
const entries = readdirSync(client);
const clash = entries.filter(entry => PROTECTED.has(entry));
if (clash.length) throw new Error(`El build pisaría ${clash.join(', ')}: cámbiale el nombre en public/.`);
mkdirSync(out, { recursive: true });
for (const entry of entries) {
  rmSync(resolve(out, entry), { recursive: true, force: true });
  cpSync(resolve(client, entry), resolve(out, entry), { recursive: true });
}
rmSync(client, { recursive: true, force: true });
rmSync(resolve(site, '.ssr'), { recursive: true, force: true });
console.log(`✓ Portfolio escrito en ${out}`);
