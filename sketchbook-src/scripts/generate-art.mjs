// Genera las ilustraciones con Muse Image. La clave NUNCA se guarda en el repo:
//   MUSE_API_KEY=... node scripts/generate-art.mjs [id ...]   (sin ids = todas las que falten)
// Las imágenes de referencia de los trabajos "edit" se buscan en .art-raw/<id>.png (la foto va en .art-raw/photo.png).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JOBS } from './art-jobs.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const raw = resolve(process.env.ART_RAW || resolve(root, '.art-raw'));
const KEY = process.env.MUSE_API_KEY;
const API = 'https://api.meta.ai/v1';
const CONCURRENCY = +(process.env.CONCURRENCY || 6);
if (!KEY) throw new Error('Falta MUSE_API_KEY');
mkdirSync(raw, { recursive: true });

const only = process.argv.slice(2);
const force = !!process.env.FORCE;
const pending = JOBS.filter(j => (only.length ? only.includes(j.id) : true) && (force || !existsSync(resolve(raw, `${j.id}-0.png`))));

async function call(job) {
  const common = { model: 'muse-image-1.0', prompt: job.prompt, n: job.n || 1, size: job.size || '1024x1024', output_format: 'png', response_format: 'b64_json' };
  let res;
  if (job.edit) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(common)) fd.append(k, String(v));
    job.edit.forEach((ref, i) => {
      const p = existsSync(resolve(raw, `${ref}.png`)) ? resolve(raw, `${ref}.png`) : resolve(raw, `${ref}-0.png`);
      fd.append(`image[${i}]`, new Blob([readFileSync(p)], { type: 'image/png' }), `${ref}.png`);
    });
    res = await fetch(`${API}/images/edits`, { method: 'POST', headers: { Authorization: `Bearer ${KEY}` }, body: fd });
  } else {
    res = await fetch(`${API}/images/generations`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(common)
    });
  }
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`); }
  if (!res.ok || !json.data) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  json.data.forEach((d, i) => writeFileSync(resolve(raw, `${job.id}-${i}.png`), Buffer.from(d.b64_json, 'base64')));
  return json.data.length;
}

async function run(job) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const t0 = Date.now();
    try {
      const n = await call(job);
      console.log(`✓ ${job.id} (${n}) ${((Date.now() - t0) / 1000).toFixed(1)}s`);
      return;
    } catch (e) {
      console.log(`✗ ${job.id} intento ${attempt}: ${e.message}`);
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
}

// Los trabajos "edit" dependen de otros (p. ej. avatar-window usa avatar): primero los independientes.
const first = pending.filter(j => !j.edit || j.edit.every(r => r === 'photo' || existsSync(resolve(raw, `${r}-0.png`)) || existsSync(resolve(raw, `${r}.png`))));
const later = pending.filter(j => !first.includes(j));
for (const group of [first, later]) {
  const queue = [...group];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => { while (queue.length) await run(queue.shift()); }));
}
console.log('listo');
