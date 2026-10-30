// Copia la exportación estática (castle/out) a la raíz del repo para GitHub Pages.
// No toca el portfolio clásico (classic/, static/, assets/, projects/, fonts/, cv.pdf, site/...).
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const castle = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(castle, '..');
const out = resolve(castle, 'out');
const manifestPath = resolve(root, '.castle-manifest.json');

const PROTECTED = new Set([
  '.git', '.gitignore', '.nojekyll', 'README.md', 'castle', 'site', 'classic', 'static', 'assets', 'projects',
  'fonts', 'cv.pdf', 'favicon.svg', 'logo.svg', 'robots.txt', '.castle-manifest.json',
]);

if (!existsSync(out)) {
  console.error('✗ No existe castle/out — ejecuta primero `npm run build`.');
  process.exit(1);
}

const entries = readdirSync(out);
const clash = entries.filter((e) => PROTECTED.has(e));
if (clash.length) {
  console.error('✗ La exportación pisaría archivos protegidos:', clash.join(', '));
  process.exit(1);
}

// 1. Borra lo que escribió el despliegue anterior (según el manifiesto) y el _next/ previo.
const previous = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : [];
for (const e of new Set([...previous, '_next'])) {
  if (PROTECTED.has(e)) continue;
  rmSync(resolve(root, e), { recursive: true, force: true });
}

// 2. Copia la nueva exportación.
for (const e of entries) cpSync(resolve(out, e), resolve(root, e), { recursive: true });
writeFileSync(manifestPath, JSON.stringify(entries.sort(), null, 2) + '\n');
console.log(`✓ ${entries.length} entradas copiadas a ${root}`);
