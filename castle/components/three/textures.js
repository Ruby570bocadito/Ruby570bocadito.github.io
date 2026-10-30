'use client';
import * as THREE from 'three';

/**
 * Texturas procedurales: veta de madera, papel washi, y lienzos para arte SVG
 * + texto con las tipografías de la web (los SVG-imagen no pueden usar webfonts,
 * por eso el texto se pinta con Canvas 2D tras cargar la fuente).
 */
const cache = new Map();

function rand(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

export function woodTexture(seed = 3) {
  const key = 'wood' + seed;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = 256; c.height = 512;
  const x = c.getContext('2d');
  const r = rand(seed * 977 + 1);
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 46; i++) {
    const px = r() * 256, amp = 3 + r() * 10, freq = 0.004 + r() * 0.012, ph = r() * 6.28;
    x.strokeStyle = `rgba(60,40,20,${0.08 + r() * 0.16})`;
    x.lineWidth = 0.6 + r() * 2.2;
    x.beginPath();
    for (let y = 0; y <= 512; y += 6) {
      const xx = px + Math.sin(y * freq + ph) * amp + Math.sin(y * 0.05 + ph) * 1.2;
      y === 0 ? x.moveTo(xx, y) : x.lineTo(xx, y);
    }
    x.stroke();
  }
  // nudos
  for (let k = 0; k < 2; k++) {
    const cx = r() * 256, cy = r() * 512;
    for (let j = 1; j < 6; j++) {
      x.strokeStyle = `rgba(60,40,20,${0.18 - j * 0.02})`;
      x.beginPath(); x.ellipse(cx, cy, j * 3.5, j * 9, 0, 0, Math.PI * 2); x.stroke();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  cache.set(key, t);
  return t;
}

export function paperTexture() {
  if (cache.has('paper')) return cache.get('paper');
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  const img = x.createImageData(256, 256);
  const r = rand(91);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 236 + r() * 19;
    img.data[i] = v; img.data[i + 1] = v - 3; img.data[i + 2] = v - 10; img.data[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  x.strokeStyle = 'rgba(150,120,80,.12)';
  for (let i = 0; i < 70; i++) {
    x.lineWidth = 0.5 + r();
    x.beginPath();
    const sx = r() * 256, sy = r() * 256;
    x.moveTo(sx, sy);
    x.quadraticCurveTo(sx + r() * 40 - 20, sy + r() * 40 - 20, sx + r() * 60 - 30, sy + r() * 60 - 30);
    x.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  cache.set('paper', t);
  return t;
}

let gradient;
/** Rampa de 3 tonos para el toon shading (colores planos). */
export function toonRamp() {
  if (gradient) return gradient;
  const data = new Uint8Array([150, 205, 255]);
  gradient = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}

const svgUrl = (svg) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
const fontsReady = (text) =>
  typeof document !== 'undefined' && document.fonts
    ? Promise.all([
        document.fonts.load('800 40px "Shippori Mincho"', text || '城'),
        document.fonts.load('600 40px "Inter"', 'A'),
      ]).catch(() => {})
    : Promise.resolve();

/**
 * Lienzo → textura. `svg` (opcional) se dibuja de fondo; `draw(ctx, w, h)` pinta
 * encima (texto con webfonts). Devuelve la textura al instante y la rellena
 * cuando las fuentes/imágenes están listas.
 */
export function canvasTexture(key, w, h, { svg, draw, text } = {}) {
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  const paint = (img) => {
    ctx.clearRect(0, 0, w, h);
    if (img) ctx.drawImage(img, 0, 0, w, h);
    if (draw) draw(ctx, w, h);
    tex.needsUpdate = true;
  };
  const imgP = svg
    ? new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = svgUrl(svg); })
    : Promise.resolve(null);
  Promise.all([imgP, fontsReady(text)]).then(([img]) => paint(img));
  return tex;
}

export const PALETTE = {
  ai: '#1F3A5F', aiDeep: '#13263f', aiSoft: '#3c5a80', shu: '#C8402A', ochre: '#D9A441',
  pine: '#4A6B4F', pineDark: '#36513b', sumi: '#1A1A1A', washi: '#F2E8D5', washiDark: '#e2d3b5',
  wood: '#8a6a43', woodDark: '#5e4429', stone: '#9d9584', plaster: '#efe5d0',
};
