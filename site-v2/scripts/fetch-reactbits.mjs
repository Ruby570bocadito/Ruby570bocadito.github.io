// Descarga componentes de React Bits (variante JS + CSS) desde su registro oficial a src/reactbits/.
// node scripts/fetch-reactbits.mjs              -> los que usa la web
// node scripts/fetch-reactbits.mjs Nombre ...   -> otros (nombres como en reactbits.dev)
import { mkdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const USED = [
  'SplitText', 'RotatingText', 'BlurText', 'ShinyText', 'DecryptedText', 'CountUp', 'ScrollReveal',
  'SpotlightCard', 'AnimatedContent', 'Magnet', 'TiltedCard', 'ClickSpark', 'ScrollVelocity', 'DotGrid', 'GlareHover'
];

const dir = resolve(dirname(fileURLToPath(import.meta.url)), '../src/reactbits');
const names = process.argv.length > 2 ? process.argv.slice(2) : USED;
mkdirSync(dir, { recursive: true });

const deps = new Set();
for (const name of names) {
  const res = await fetch(`https://reactbits.dev/r/${name}-JS-CSS.json`);
  if (!res.ok) {
    console.error(`✗ ${name}: HTTP ${res.status}`);
    process.exitCode = 1;
    continue;
  }
  const item = await res.json();
  for (const file of item.files) writeFileSync(resolve(dir, basename(file.path)), file.content);
  for (const dep of item.dependencies ?? []) deps.add(dep);
  console.log(`✓ ${name}: ${item.files.map(f => basename(f.path)).join(', ')}`);
}
console.log(`dependencias: ${[...deps].join(' ') || '(ninguna)'}`);
