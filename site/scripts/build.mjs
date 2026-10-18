// Build de producción: cliente + SSR, prerender del HTML y copia a la raíz del repo.
import { execSync } from 'node:child_process';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// Destino: la raíz del repo (por defecto) o la carpeta indicada con --out <dir> (para previsualizar).
const outArg = process.argv.indexOf('--out');
const repo = outArg > -1 ? resolve(process.argv[outArg + 1]) : resolve(site, '..');
const run = cmd => execSync(cmd, { cwd: site, stdio: 'inherit' });

run('npx vite build');
run('npx vite build --ssr src/entry-server.jsx');

const { render } = await import(pathToFileURL(resolve(site, '.ssr/entry-server.js')).href);
const { I18N } = await import(pathToFileURL(resolve(site, 'src/i18n.js')).href);
const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const html = readFileSync(resolve(site, '.client/index.html'), 'utf8')
  .replace('%TITLE%', attr(I18N.en['meta.title']))
  .replace('%DESC%', attr(I18N.en['meta.desc']))
  .replace('<!--app-->', () => render());
writeFileSync(resolve(site, '.client/index.html'), html);

mkdirSync(repo, { recursive: true });
rmSync(resolve(repo, 'static'), { recursive: true, force: true });
cpSync(resolve(site, '.client/static'), resolve(repo, 'static'), { recursive: true });
cpSync(resolve(site, '.client/index.html'), resolve(repo, 'index.html'));
rmSync(resolve(site, '.client'), { recursive: true, force: true });
rmSync(resolve(site, '.ssr'), { recursive: true, force: true });
console.log(`✓ index.html + static/ escritos en ${repo}`);
