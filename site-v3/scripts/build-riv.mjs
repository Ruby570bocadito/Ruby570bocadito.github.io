// Builds public/rive/portfolio.riv from the scenes authored in scripts/rive/scenes.mjs
// and copies the Rive WASM runtime (canvas-lite) next to it, so nothing loads from a CDN.
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { RiveFile } from './rive/riv-writer.mjs';
import * as scenes from './rive/scenes.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = resolve(root, 'public/rive');

const file = new RiveFile();
scenes.hero(file);
scenes.heroFrame(file);
scenes.robot(file);
scenes.iconTarget(file);
scenes.iconShield(file);
scenes.iconCode(file);
scenes.iconNeural(file);
scenes.iconGear(file);
scenes.lock(file);
const bytes = file.toBytes();
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'portfolio.riv'), bytes);
console.log(`✓ ${file.artboards.map(a => a.name).join(', ')} → public/rive/portfolio.riv (${(bytes.length / 1024).toFixed(1)} KB)`);

const lite = resolve(root, 'node_modules/@rive-app/canvas-lite');
for (const f of ['rive.wasm', 'rive_fallback.wasm']) copyFileSync(resolve(lite, f), resolve(outDir, f));
console.log('✓ rive.wasm + rive_fallback.wasm (canvas-lite) → public/rive/');
