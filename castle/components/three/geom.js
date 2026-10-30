'use client';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Geometría procedural para la arquitectura y la vegetación del castillo.
 * Todo se construye con "lofts" de planta rectangular: cada nivel v ∈ [0, 1]
 * es un rectángulo de semilados size(v) a altura y(v). Así salen tejados con
 * curvatura sori y esquinas levantadas, murallas ishigaki en abanico, etc.
 */

const SIDES = [
  { e: new THREE.Vector3(0, 0, 1), xz: (u, sx, sz) => [u * sx, sz], len: (sx) => sx },
  { e: new THREE.Vector3(0, 0, -1), xz: (u, sx, sz) => [-u * sx, -sz], len: (sx) => sx },
  { e: new THREE.Vector3(1, 0, 0), xz: (u, sx, sz) => [sx, -u * sz], len: (sx, sz) => sz },
  { e: new THREE.Vector3(-1, 0, 0), xz: (u, sx, sz) => [-sx, u * sz], len: (sx, sz) => sz },
];
const DOWN = new THREE.Vector3(0, -1, 0);
const UP = new THREE.Vector3(0, 1, 0);

function builder() {
  return { pos: [], uv: [], idx: [], groups: [] };
}

function beginGroup(b, materialIndex) {
  const last = b.groups[b.groups.length - 1];
  if (last && last.materialIndex === materialIndex && last.start + last.count === b.idx.length) return last;
  const g = { start: b.idx.length, count: 0, materialIndex };
  b.groups.push(g);
  return g;
}

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _n = new THREE.Vector3();

/** Añade una rejilla (cols+1)×(rows+1) y orienta los triángulos según `expect`. */
function grid(b, verts, uvs, cols, rows, expect, material) {
  const g = beginGroup(b, material);
  const start = b.pos.length / 3;
  verts.forEach((v) => b.pos.push(v[0], v[1], v[2]));
  uvs.forEach((t) => b.uv.push(t[0], t[1]));
  const at = (i, j) => start + j * (cols + 1) + i;
  // ¿Hacia dónde apunta la normal con el orden por defecto?
  const ci = Math.floor(cols / 2), cj = Math.floor(rows / 2);
  const P = (k) => _a.set(b.pos[k * 3], b.pos[k * 3 + 1], b.pos[k * 3 + 2]).clone();
  const p0 = P(at(ci, cj)), p1 = P(at(ci + 1, cj)), p2 = P(at(ci + 1, cj + 1));
  _n.subVectors(p1, p0).cross(_c.subVectors(p2, p0));
  const flip = _n.dot(expect) < 0;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = at(i, j), bb = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
      if (flip) b.idx.push(a, c, bb, a, d, c);
      else b.idx.push(a, bb, c, a, c, d);
    }
  }
  g.count += cols * rows * 6;
}

/**
 * Loft de planta rectangular: 4 caras. `expect`: 'out' (fachadas/tejados) o 'down' (sofitos).
 */
export function squareLoft(b, { size, y, lift = () => 0, segU = 10, segV = 8, tile = 1, expect = 'out', material = 0 }) {
  for (const s of SIDES) {
    const verts = [], uvs = [];
    let dist = 0;
    let prevMid = null;
    for (let j = 0; j <= segV; j++) {
      const v = j / segV;
      const [sx, sz] = size(v);
      const yy = y(v);
      const [mx, mz] = s.xz(0, sx, sz);
      const mid = new THREE.Vector3(mx, yy, mz);
      if (prevMid) dist += mid.distanceTo(prevMid);
      prevMid = mid;
      const L = s.len(sx, sz);
      for (let i = 0; i <= segU; i++) {
        const u = (i / segU) * 2 - 1;
        const [x, z] = s.xz(u, sx, sz);
        verts.push([x, yy + lift(u, v), z]);
        uvs.push([(u * L) / tile, dist / tile]);
      }
    }
    const exp = expect === 'down' ? DOWN : expect === 'up' ? UP : s.e;
    grid(b, verts, uvs, segU, segV, exp, material);
  }
}

/** Tapa rectangular horizontal (mirando arriba o abajo). */
export function capRect(b, sx, sz, y, { down = false, material = 0, tile = 1 } = {}) {
  const verts = [[-sx, y, -sz], [sx, y, -sz], [-sx, y, sz], [sx, y, sz]];
  const uvs = verts.map((v) => [v[0] / tile, v[2] / tile]);
  grid(b, verts, uvs, 1, 1, down ? DOWN : UP, material);
}

export function finish(b) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(b.pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(b.uv, 2));
  g.setIndex(b.idx);
  b.groups.forEach((gr) => g.addGroup(gr.start, gr.count, gr.materialIndex));
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

/**
 * Tejado japonés a cuatro aguas (yosemune / irimoya simplificado):
 * superficie cóncava (sori), esquinas del alero levantadas (sorimune),
 * canto del alero (fascia) y sofito. Grupo 0 = tejas, grupo 1 = sofito y canto.
 * w, d: semilados del alero · tw, td: semilados de la cumbrera · h: altura.
 */
export function roofGeometry({ w, d, h, tw, td, lift = 0.35, thick = 0.16, wi, di, tile = 0.32, segU = 12, segV = 8 }) {
  tw = tw ?? Math.max(0.06, w - d * 0.92);
  td = td ?? Math.max(0.06, d - w * 0.92);
  wi = wi ?? w * 0.62;
  di = di ?? d * 0.62;
  const b = builder();
  const L = (u, v) => lift * Math.pow(Math.abs(u), 3.2) * Math.pow(1 - v, 1.6);
  const size = (v) => [w + (tw - w) * v, d + (td - d) * v];
  const yv = (v) => h * (0.32 * v + 0.68 * v * v);
  squareLoft(b, { size, y: yv, lift: L, segU, segV, tile, material: 0 });
  capRect(b, tw, td, h, { material: 0, tile });
  // canto del alero
  squareLoft(b, { size: () => [w, d], y: (v) => -thick + v * thick, lift: (u) => L(u, 0), segU, segV: 1, tile, material: 1 });
  // sofito: del canto hacia el muro, subiendo un poco
  squareLoft(b, {
    size: (v) => [w + (wi - w) * v, d + (di - d) * v],
    y: (v) => -thick + v * h * 0.12,
    lift: (u, v) => L(u, 0) * (1 - v),
    segU, segV: 2, tile, expect: 'down', material: 1,
  });
  return finish(b);
}

/** Muralla ishigaki con perfil en abanico (ōgi-kōbai): casi vertical arriba, abierta abajo. */
export function ishigakiGeometry({ bw, bd, tw, td, h, tile = 3, segU = 8, segV = 10 }) {
  const b = builder();
  const size = (v) => {
    const k = Math.pow(1 - v, 2.1);
    return [tw + (bw - tw) * k, td + (bd - td) * k];
  };
  squareLoft(b, { size, y: (v) => v * h, lift: (u, v) => 0.25 * Math.pow(Math.abs(u), 4) * v * h * 0.06, segU, segV, tile });
  capRect(b, tw, td, h, { tile });
  return finish(b);
}

/** Tubo con sección decreciente (troncos, ramas, arcos). */
export function taperedTube(points, r0, r1, seg = 20, radial = 7) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p))));
  const g = new THREE.TubeGeometry(curve, seg, 1, radial, false);
  const pos = g.attributes.position;
  const c = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    curve.getPointAt(t, c);
    const r = r0 + (r1 - r0) * t;
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, k).sub(c).multiplyScalar(r).add(c);
      pos.setXYZ(k, v.x, v.y, v.z);
    }
  }
  g.computeVertexNormals();
  return g;
}

/** Almohadilla de agujas de pino: lente aplanada con borde ondulado. */
export function padGeometry(seed = 1) {
  const prof = [[0, 0.42], [0.45, 0.4], [0.78, 0.3], [0.97, 0.12], [1, 0.0], [0.9, -0.1], [0.55, -0.14], [0, -0.14]];
  const g = new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 16);
  const pos = g.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const a = Math.atan2(v.z, v.x);
    const k = 1 + 0.1 * Math.sin(3 * a + seed) + 0.06 * Math.sin(7 * a + seed * 2.3);
    pos.setXYZ(i, v.x * k, v.y, v.z * k);
  }
  g.computeVertexNormals();
  return g;
}

/** Barco de papel (origami) con casco plegado y vela en tienda. */
export function paperBoatGeometry() {
  const V = (x, y, z) => [x, y, z];
  const keelA = V(-0.6, 0, 0), keelB = V(0.6, 0, 0);
  const bow = V(-1.05, 0.42, 0), stern = V(1.05, 0.42, 0);
  const rimFL = V(-0.6, 0.38, 0.32), rimFR = V(0.6, 0.38, 0.32);
  const rimBL = V(-0.6, 0.38, -0.32), rimBR = V(0.6, 0.38, -0.32);
  const sailBase = V(0, 0.38, 0), apex = V(0, 1.05, 0);
  const sailL = V(-0.62, 0.38, 0), sailR = V(0.62, 0.38, 0);
  const foldF = V(0, 0.38, 0.13), foldB = V(0, 0.38, -0.13);
  const tris = [
    // casco
    [keelA, keelB, rimFR], [keelA, rimFR, rimFL], [keelB, keelA, rimBL], [keelB, rimBL, rimBR],
    [bow, keelA, rimFL], [bow, rimBL, keelA], [stern, rimFR, keelB], [stern, keelB, rimBR],
    // vela plegada
    [sailL, foldF, apex], [foldF, sailR, apex], [sailR, foldB, apex], [foldB, sailL, apex],
  ];
  const pos = [];
  tris.forEach((t) => t.forEach((p) => pos.push(...p)));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.computeVertexNormals();
  void sailBase;
  return g;
}

/** Hoja curva (bokken, naginata): forma 2D con lomo curvo, extruida fina. */
export function bladeGeometry({ length = 2.4, width = 0.16, curve = 0.18, tip = 0.25, depth = 0.05 }) {
  const s = new THREE.Shape();
  const n = 16;
  const back = [], edge = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const y = t * length;
    const bend = curve * t * t;
    const wdt = t > 1 - tip / length ? width * Math.max(0, (1 - t) / (tip / length)) : width;
    back.push([bend, y]);
    edge.push([bend + wdt * (t > 1 - tip / length ? 1 : 1), y]);
  }
  s.moveTo(back[0][0], back[0][1]);
  back.forEach(([x, y]) => s.lineTo(x, y));
  for (let i = edge.length - 1; i >= 0; i--) s.lineTo(edge[i][0], edge[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelThickness: depth * 0.4, bevelSize: 0.012, bevelSegments: 1 });
  g.translate(-width / 2, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

/** Hoja recta de lanza (yari): rombo alargado. */
export function spearHeadGeometry(len = 0.75, w = 0.11) {
  const s = new THREE.Shape();
  s.moveTo(0, 0); s.lineTo(w, len * 0.3); s.lineTo(0, len); s.lineTo(-w, len * 0.3); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.01, bevelSegments: 1 });
  g.translate(0, 0, -0.015);
  return g;
}

/** Frontón triangular (chidori-hafu). */
export function gableGeometry(w = 2.4, h = 1.3, depth = 0.8) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth);
  return g;
}

/** Banda curva del frontón kara-hafu (curva campana). */
export function karaHafuGeometry(w = 3.2, h = 1.0, band = 0.22, depth = 1.2) {
  const pts = [];
  const n = 24;
  for (let i = 0; i <= n; i++) {
    const x = (i / n - 0.5) * w;
    const t = Math.abs(x) / (w / 2);
    // perfil campana: cima redondeada, puntas que se levantan hacia fuera
    const y = h * (Math.cos(t * Math.PI * 0.5) ** 1.6) + h * 0.12 * Math.max(0, t - 0.82) * 5;
    pts.push([x, y]);
  }
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  pts.forEach(([x, y]) => s.lineTo(x, y));
  for (let i = pts.length - 1; i >= 0; i--) s.lineTo(pts[i][0], pts[i][1] - band);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false });
  g.translate(0, 0, -depth);
  return g;
}

/** Shachihoko: pez ornamental de la cumbrera (silueta original). */
export function shachiGeometry() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.2, 0.05, 0.32, 0.25, 0.28, 0.5);
  s.bezierCurveTo(0.26, 0.7, 0.12, 0.85, 0.2, 1.05); // cola que sube
  s.lineTo(0.32, 1.2); s.lineTo(0.1, 1.12); s.lineTo(0.0, 1.25); s.lineTo(0.02, 1.0);
  s.bezierCurveTo(-0.05, 0.8, 0.02, 0.62, -0.06, 0.42);
  s.bezierCurveTo(-0.14, 0.22, -0.28, 0.12, -0.3, 0.02); // cabeza
  s.lineTo(-0.12, -0.04);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 1 });
  g.translate(0, 0, -0.07);
  return g;
}

/**
 * Fusiona piezas estáticas en una sola geometría (menos llamadas de dibujo).
 * parts: [{ geo, p: [x,y,z], r: [x,y,z], s: number | [x,y,z] }]
 */
export function mergeParts(parts) {
  const o = new THREE.Object3D();
  const geos = parts.map(({ geo, p = [0, 0, 0], r = [0, 0, 0], s = 1 }) => {
    o.position.set(...p); o.rotation.set(...r);
    if (Array.isArray(s)) o.scale.set(...s); else o.scale.setScalar(s);
    o.updateMatrix();
    const g = geo.clone();
    g.applyMatrix4(o.matrix);
    if (!g.attributes.uv) g.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
    if (g.attributes.uv2) g.deleteAttribute('uv2');
    return g;
  });
  const indexed = geos.every((g) => g.index);
  const merged = mergeGeometries(indexed ? geos : geos.map((g) => (g.index ? g.toNonIndexed() : g)), false);
  geos.forEach((g) => g.dispose());
  merged.computeBoundingSphere();
  return merged;
}
