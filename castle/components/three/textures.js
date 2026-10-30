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

/* ───────────── Texturas de arquitectura y vegetación (procedurales) ───────────── */

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return [c, c.getContext('2d')];
}
function finishTex(c, { repeat = true, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
function cached(key, fn) {
  if (!cache.has(key)) cache.set(key, fn());
  return cache.get(key);
}

/** Tejas kawara: filas de tejas redondas (escala de grises, se tiñe con el color). */
export function tileTexture() {
  return cached('tiles', () => {
    const [c, x] = makeCanvas(128, 128);
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 4; i++) {
      const cx = i * 32;
      const g = x.createLinearGradient(cx, 0, cx + 32, 0);
      g.addColorStop(0, '#9aa3b2'); g.addColorStop(0.35, '#ffffff'); g.addColorStop(0.75, '#d9dee6'); g.addColorStop(1, '#8a93a3');
      x.fillStyle = g; x.fillRect(cx + 3, 0, 26, 128);
      x.fillStyle = '#5c6575'; x.fillRect(cx, 0, 3, 128);
      for (let j = 0; j < 4; j++) { x.fillStyle = 'rgba(40,48,60,.35)'; x.fillRect(cx + 3, j * 32 + 28, 26, 4); }
    }
    return finishTex(c);
  });
}

/** Muralla ishigaki: piedras irregulares con juntas sumi. */
export function stoneTexture() {
  return cached('stone', () => {
    const [c, x] = makeCanvas(512, 512);
    const r = rand(77);
    x.fillStyle = '#4b463e'; x.fillRect(0, 0, 512, 512);
    const tones = ['#a9a190', '#9d9584', '#b6ae9b', '#918a7b', '#a39a86', '#bab3a2'];
    let y = 0;
    while (y < 512) {
      const rh = 34 + r() * 30;
      let xx = -r() * 40;
      while (xx < 512) {
        const sw = 40 + r() * 70;
        const j = () => (r() - 0.5) * 7;
        x.beginPath();
        x.moveTo(xx + 3 + j(), y + 3 + j());
        x.lineTo(xx + sw * 0.5 + j(), y + 2 + j());
        x.lineTo(xx + sw - 3 + j(), y + 4 + j());
        x.lineTo(xx + sw - 2 + j(), y + rh * 0.55 + j());
        x.lineTo(xx + sw - 4 + j(), y + rh - 3 + j());
        x.lineTo(xx + sw * 0.45 + j(), y + rh - 2 + j());
        x.lineTo(xx + 3 + j(), y + rh - 4 + j());
        x.lineTo(xx + 2 + j(), y + rh * 0.5 + j());
        x.closePath();
        x.fillStyle = tones[Math.floor(r() * tones.length)];
        x.fill();
        x.lineWidth = 3; x.strokeStyle = '#1A1A1A'; x.lineJoin = 'round'; x.stroke();
        // brillo superior del grabado
        x.strokeStyle = 'rgba(242,232,213,.35)'; x.lineWidth = 2;
        x.beginPath(); x.moveTo(xx + 8, y + 8); x.lineTo(xx + sw * 0.6, y + 7); x.stroke();
        xx += sw;
      }
      y += rh;
    }
    // costura vertical para que el mosaico repita sin cortes visibles
    return finishTex(c);
  });
}

/** Fachada de la torre: enlucido blanco, ventana de barrotes (renji) y zócalo negro (shitamiban). */
export function bayTexture(withWindow = true) {
  return cached('bay' + withWindow, () => {
    const [c, x] = makeCanvas(256, 256);
    const r = rand(5);
    x.fillStyle = '#f1e8d6'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(120,100,70,${r() * 0.06})`; x.fillRect(r() * 256, r() * 170, 2, 2); }
    // viga superior
    x.fillStyle = '#2b241d'; x.fillRect(0, 10, 256, 7);
    if (withWindow) {
      x.fillStyle = '#1b2230'; x.fillRect(70, 50, 116, 84);
      x.fillStyle = '#efe5d0';
      for (let i = 0; i < 6; i++) x.fillRect(76 + i * 19, 50, 8, 84);
      x.lineWidth = 6; x.strokeStyle = '#1A1A1A'; x.strokeRect(70, 50, 116, 84);
      x.fillStyle = '#d8ccb3'; x.fillRect(64, 138, 128, 8);
      x.strokeStyle = '#1A1A1A'; x.lineWidth = 3; x.strokeRect(64, 138, 128, 8);
    }
    // zócalo de tablas negras
    x.fillStyle = '#1d1d1d'; x.fillRect(0, 168, 256, 88);
    for (let i = 0; i < 256; i += 18) { x.fillStyle = '#343434'; x.fillRect(i, 168, 2, 88); }
    x.fillStyle = '#4a4a4a'; x.fillRect(0, 168, 256, 4);
    x.fillStyle = '#0f0f0f'; x.fillRect(0, 214, 256, 3);
    return finishTex(c);
  });
}

/** Muro dobei con troneras (sama) triangulares y cuadradas. */
export function loopholeTexture() {
  return cached('sama', () => {
    const [c, x] = makeCanvas(256, 128);
    x.fillStyle = '#f1e8d6'; x.fillRect(0, 0, 256, 128);
    const r = rand(8);
    for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(120,100,70,${r() * 0.07})`; x.fillRect(r() * 256, r() * 128, 2, 2); }
    x.fillStyle = '#1A1A1A';
    x.beginPath(); x.moveTo(52, 44); x.lineTo(76, 44); x.lineTo(64, 66); x.closePath(); x.fill();
    x.fillRect(178, 44, 22, 22);
    x.fillStyle = '#2b241d'; x.fillRect(0, 100, 256, 6);
    return finishTex(c);
  });
}

/** Muro namako del kura: losetas grises en diagonal con juntas de cal en relieve. */
export function namakoTexture() {
  return cached('namako', () => {
    const [c, x] = makeCanvas(256, 256);
    x.fillStyle = '#3d4049'; x.fillRect(0, 0, 256, 256);
    x.save(); x.translate(128, 128); x.rotate(Math.PI / 4); x.translate(-182, -182);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      x.fillStyle = (i + j) % 2 ? '#454955' : '#3a3d47';
      x.fillRect(i * 46 + 5, j * 46 + 5, 36, 36);
    }
    x.strokeStyle = '#efe5d0'; x.lineWidth = 9; x.lineCap = 'round';
    for (let i = 0; i <= 8; i++) {
      x.beginPath(); x.moveTo(i * 46, 0); x.lineTo(i * 46, 368); x.stroke();
      x.beginPath(); x.moveTo(0, i * 46); x.lineTo(368, i * 46); x.stroke();
    }
    x.strokeStyle = '#1A1A1A'; x.lineWidth = 2;
    for (let i = 0; i <= 8; i++) {
      x.beginPath(); x.moveTo(i * 46 + 5, 0); x.lineTo(i * 46 + 5, 368); x.stroke();
      x.beginPath(); x.moveTo(0, i * 46 + 5); x.lineTo(368, i * 46 + 5); x.stroke();
    }
    x.restore();
    return finishTex(c);
  });
}

/** Grava rastrillada del jardín seco. */
export function gravelTexture() {
  return cached('gravel', () => {
    const [c, x] = makeCanvas(512, 512);
    const r = rand(21);
    x.fillStyle = '#e6d8bb'; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      const v = r();
      x.fillStyle = v > 0.5 ? `rgba(255,250,238,${0.4 * r()})` : `rgba(140,120,90,${0.35 * r()})`;
      x.fillRect(r() * 512, r() * 512, 1.6, 1.6);
    }
    for (let y = 8; y < 512; y += 21) {
      x.strokeStyle = 'rgba(150,128,95,.55)'; x.lineWidth = 3;
      x.beginPath();
      for (let xx = 0; xx <= 512; xx += 16) x.lineTo(xx, y + Math.sin(xx * 0.0123 + y) * 1.2);
      x.stroke();
      x.strokeStyle = 'rgba(255,250,238,.6)'; x.lineWidth = 2;
      x.beginPath();
      for (let xx = 0; xx <= 512; xx += 16) x.lineTo(xx, y + 4 + Math.sin(xx * 0.0123 + y) * 1.2);
      x.stroke();
    }
    return finishTex(c);
  });
}

/** Tierra apisonada con grano fino. */
export function earthTexture() {
  return cached('earth', () => {
    const [c, x] = makeCanvas(256, 256);
    const r = rand(33);
    x.fillStyle = '#e4d5b6'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3500; i++) {
      x.fillStyle = r() > 0.5 ? `rgba(255,248,232,${0.35 * r()})` : `rgba(130,105,70,${0.18 * r()})`;
      x.fillRect(r() * 256, r() * 256, 2, 2);
    }
    return finishTex(c);
  });
}

/** Tablas de madera con juntas (suelos, pasarela). */
export function plankTexture(seed = 2) {
  return cached('plank' + seed, () => {
    const [c, x] = makeCanvas(256, 512);
    const r = rand(seed * 101);
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, 256, 512);
    for (let p = 0; p < 4; p++) {
      const px = p * 64;
      x.fillStyle = `rgba(90,60,30,${0.04 + r() * 0.1})`; x.fillRect(px, 0, 64, 512);
      for (let i = 0; i < 9; i++) {
        const lx = px + 6 + r() * 52, amp = 1 + r() * 3, ph = r() * 6;
        x.strokeStyle = `rgba(70,45,20,${0.12 + r() * 0.15})`; x.lineWidth = 0.8 + r() * 1.5;
        x.beginPath();
        for (let y = 0; y <= 512; y += 8) x.lineTo(lx + Math.sin(y * 0.015 + ph) * amp, y);
        x.stroke();
      }
      x.fillStyle = 'rgba(26,26,26,.75)'; x.fillRect(px, 0, 3, 512);
      const cut = r() * 512;
      x.fillRect(px, cut, 64, 2.5);
    }
    return finishTex(c);
  });
}

/** Tatami: junco tejido con borde de tela (heri). */
export function tatamiTexture() {
  return cached('tatami', () => {
    const [c, x] = makeCanvas(256, 512);
    x.fillStyle = '#cfc193'; x.fillRect(0, 0, 256, 512);
    for (let y = 0; y < 512; y += 4) { x.fillStyle = y % 8 ? 'rgba(120,110,60,.18)' : 'rgba(255,250,220,.22)'; x.fillRect(0, y, 256, 2); }
    for (let xx = 20; xx < 256; xx += 36) { x.fillStyle = 'rgba(90,80,40,.12)'; x.fillRect(xx, 0, 2, 512); }
    x.fillStyle = '#1F3A5F'; x.fillRect(0, 0, 18, 512); x.fillRect(238, 0, 18, 512);
    x.fillStyle = 'rgba(242,232,213,.35)';
    for (let y = 0; y < 512; y += 10) { x.fillRect(5, y, 8, 3); x.fillRect(243, y + 5, 8, 3); }
    x.strokeStyle = '#1A1A1A'; x.lineWidth = 3; x.strokeRect(1, 1, 254, 510);
    return finishTex(c);
  });
}

/** Trazos de agujas de pino para las almohadillas. */
export function needleTexture() {
  return cached('needles', () => {
    const [c, x] = makeCanvas(256, 256);
    const r = rand(13);
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 420; i++) {
      const px = r() * 256, py = r() * 256, l = 8 + r() * 12;
      x.strokeStyle = r() > 0.5 ? 'rgba(20,40,25,.38)' : 'rgba(255,255,240,.45)';
      x.lineWidth = 1.4;
      x.beginPath(); x.moveTo(px - l * 0.4, py - l); x.lineTo(px, py); x.lineTo(px + l * 0.4, py - l); x.stroke();
    }
    return finishTex(c);
  });
}

/** Empuñadura con trenzado en rombos (tsuka-ito). */
export function wrapTexture() {
  return cached('wrap', () => {
    const [c, x] = makeCanvas(64, 128);
    x.fillStyle = '#1F3A5F'; x.fillRect(0, 0, 64, 128);
    x.fillStyle = '#efe5d0';
    for (let y = 0; y < 128; y += 32) { x.beginPath(); x.moveTo(32, y + 4); x.lineTo(54, y + 16); x.lineTo(32, y + 28); x.lineTo(10, y + 16); x.closePath(); x.fill(); }
    x.strokeStyle = '#1A1A1A'; x.lineWidth = 3;
    for (let y = 0; y < 128; y += 32) { x.beginPath(); x.moveTo(0, y); x.lineTo(64, y + 32); x.moveTo(64, y); x.lineTo(0, y + 32); x.stroke(); }
    return finishTex(c);
  });
}

/** Papel de farolillo con costillas y un kanji/emblema. */
export function lanternTexture(mark = '見') {
  return canvasTexture('lantern-' + mark, 256, 256, {
    text: mark,
    draw: (x, w, h) => {
      x.fillStyle = '#f6eedc'; x.fillRect(0, 0, w, h);
      const g = x.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, 150);
      g.addColorStop(0, 'rgba(255,240,200,.9)'); g.addColorStop(1, 'rgba(217,164,65,.25)');
      x.fillStyle = g; x.fillRect(0, 0, w, h);
      x.strokeStyle = 'rgba(26,26,26,.45)'; x.lineWidth = 2;
      for (let y = 10; y < h; y += 18) { x.beginPath(); x.moveTo(0, y); x.lineTo(w, y); x.stroke(); }
      x.fillStyle = '#1A1A1A'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = '800 58px "Shippori Mincho"';
      [0.0, 0.25, 0.5, 0.75, 1.0].forEach((u) => x.fillText(mark, w * u, h / 2 + 4));
    },
  });
}

/** Blasón original del castillo vigía: torre y ojo dentro de un anillo. */
export function crestTexture(fg = '#D9A441', bg = null) {
  return cached('crest' + fg + bg, () => {
    const [c, x] = makeCanvas(256, 256);
    if (bg) { x.fillStyle = bg; x.fillRect(0, 0, 256, 256); }
    x.strokeStyle = fg; x.fillStyle = fg; x.lineWidth = 14;
    x.beginPath(); x.arc(128, 128, 104, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.moveTo(52, 132); x.lineTo(128, 70); x.lineTo(204, 132); x.lineTo(184, 132); x.lineTo(128, 92); x.lineTo(72, 132); x.closePath(); x.fill();
    x.beginPath(); x.ellipse(128, 160, 50, 26, 0, 0, Math.PI * 2); x.lineWidth = 10; x.stroke();
    x.beginPath(); x.arc(128, 160, 14, 0, Math.PI * 2); x.fill();
    return finishTex(c, { repeat: false });
  });
}
