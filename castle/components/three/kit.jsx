'use client';
import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { toonRamp, woodTexture, paperTexture, tileTexture, needleTexture, lanternTexture, PALETTE as P } from './textures';
import { roofGeometry, taperedTube, padGeometry, shachiGeometry, mergeParts } from './geom';

function mulberry(seed) {
  let a = Math.floor(seed * 9973) + 1;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let SHACHI;
const shachiGeo = () => (SHACHI ??= shachiGeometry());

const matCache = new Map();
/** Material toon compartido (evita duplicar programas y texturas). */
export function toon(color, { map, emissive, emissiveIntensity = 0, side, repeat } = {}) {
  const key = [color, map?.uuid, emissive, emissiveIntensity, side, repeat?.join(',')].join('|');
  if (matCache.has(key)) return matCache.get(key);
  let m = map;
  if (map && repeat) { m = map.clone(); m.repeat.set(repeat[0], repeat[1]); m.needsUpdate = true; }
  const mat = new THREE.MeshToonMaterial({ color, map: m || null, gradientMap: toonRamp(), emissive: emissive || '#000000', emissiveIntensity });
  if (side !== undefined) mat.side = side;
  matCache.set(key, mat);
  return mat;
}

/** Material toon de tintas planas (+ veta de madera o papel opcional). */
export function Toon({ color = P.washi, wood, paper, emissive, emissiveIntensity = 1, side, transparent, opacity }) {
  const map = useMemo(() => (wood ? woodTexture(typeof wood === 'number' ? wood : 3) : paper ? paperTexture() : null), [wood, paper]);
  return (
    <meshToonMaterial
      color={color}
      gradientMap={toonRamp()}
      map={map}
      emissive={emissive || '#000000'}
      emissiveIntensity={emissive ? emissiveIntensity : 0}
      side={side}
      transparent={transparent}
      opacity={opacity}
    />
  );
}

/** Malla con contorno negro sumi (casco invertido). */
export function Ink({ children, color, wood, paper, emissive, emissiveIntensity, outline = 2.4, side, ...props }) {
  return (
    <mesh {...props}>
      {children}
      <Toon color={color} wood={wood} paper={paper} emissive={emissive} emissiveIntensity={emissiveIntensity} side={side} />
      {outline ? <Outlines thickness={outline} color={P.sumi} angle={Math.PI} /> : null}
    </mesh>
  );
}

export const Box = ({ args = [1, 1, 1], ...p }) => <Ink {...p}><boxGeometry args={args} /></Ink>;

/** Piezas repetidas en una sola llamada de dibujo (+ su contorno). transforms: [{ p, r?, s? }] */
export function InstancedParts({ geometry, material, transforms, outline = 2 }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D();
    transforms.forEach((t, i) => {
      o.position.set(...t.p);
      o.rotation.set(...(t.r || [0, 0, 0]));
      const sc = t.s ?? 1;
      if (Array.isArray(sc)) o.scale.set(...sc); else o.scale.setScalar(sc);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [transforms]);
  return (
    <instancedMesh ref={ref} args={[geometry, material, transforms.length]} frustumCulled={false}>
      {outline ? <Outlines thickness={outline} color={P.sumi} /> : null}
    </instancedMesh>
  );
}

/** Tejado japonés de tejas (geom.roofGeometry): curvatura sori, esquinas levantadas, sofito claro. */
export function TileRoof({ w, d, h, tw, td, lift, thick, wi, di, color = P.ai, under = P.plaster, tile = 0.32, ridge = true, shachi = false, outline = 2.4, ...p }) {
  const geo = useMemo(() => roofGeometry({ w, d, h, tw, td, lift: lift ?? Math.min(w, d) * 0.12, thick, wi, di, tile }), [w, d, h, tw, td, lift, thick, wi, di, tile]);
  const mats = useMemo(() => [toon(color, { map: tileTexture() }), toon(under)], [color, under]);
  const rtw = tw ?? Math.max(0.06, w - d * 0.92), rtd = td ?? Math.max(0.06, d - w * 0.92);
  const along = rtw >= rtd; // cumbrera a lo largo de x
  const rl = (along ? rtw : rtd) * 2 + 0.3;
  return (
    <group {...p}>
      <mesh geometry={geo} material={mats}>
        {outline ? <Outlines thickness={outline} color={P.sumi} /> : null}
      </mesh>
      {ridge ? (
        <group position={[0, h + 0.06, 0]} rotation-y={along ? 0 : Math.PI / 2}>
          <Box args={[rl, Math.max(0.16, h * 0.1), 0.26]} color={P.aiDeep} />
          {[-1, 1].map((k) => (
            <Box key={k} args={[0.22, Math.max(0.3, h * 0.2), 0.34]} color={P.aiDeep} position={[k * rl / 2, 0.08, 0]} />
          ))}
          {shachi
            ? [-1, 1].map((k) => (
                <Ink key={'s' + k} geometry={shachiGeo()} color={P.ochre} outline={1.6} position={[k * (rl / 2 - 0.05), 0.14, 0]} scale={[-k * 0.7, 0.7, 0.7]} />
              ))
            : null}
        </group>
      ) : null}
    </group>
  );
}

/** Compatibilidad: tejado centrado verticalmente con tamaños totales (como el modelo anterior). */
export function Roof({ w = 4, d = 4, h = 1.4, color = P.ai, ...p }) {
  const pos = p.position || [0, 0, 0];
  return <TileRoof w={w * 0.53} d={d * 0.53} h={h} color={color} {...p} position={[pos[0], pos[1] - h / 2, pos[2]]} />;
}

/** Cielo con degradado bokashi y bandas horizontales. */
export function Sky({ top = P.ai, mid = P.ochre, bottom = P.washi, midAt = 0.55 }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: new THREE.Color(top) }, mid: { value: new THREE.Color(mid) }, bottom: { value: new THREE.Color(bottom) }, midAt: { value: midAt } },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; uniform float midAt; varying vec3 vP;
          float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
          void main(){
            float y = clamp(vP.y * 1.6 + 0.08, 0.0, 1.0);
            float t = 1.0 - y;
            vec3 c = t < midAt ? mix(top, mid, smoothstep(0.0, midAt, t)) : mix(mid, bottom, smoothstep(midAt, 1.0, t));
            // bokashi impreso: pequeños escalones de tinta
            c = floor(c * 22.0 + h(gl_FragCoord.xy) * 0.6) / 22.0;
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [top, mid, bottom, midAt]
  );
  return (
    <mesh material={mat} renderOrder={-10}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}

/** Agua índigo con líneas de oleaje en tinta crema. */
export function Water({ size = [600, 600], position = [0, 0, 0], deep = P.aiDeep, light = P.aiSoft, lines = P.washi, speed = 1 }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { t: { value: 0 }, deep: { value: new THREE.Color(deep) }, light: { value: new THREE.Color(light) }, ln: { value: new THREE.Color(lines) } },
        vertexShader: `varying vec2 vW; varying float vD; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xz; vec4 mv = viewMatrix * w; vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform float t; uniform vec3 deep; uniform vec3 light; uniform vec3 ln; varying vec2 vW; varying float vD;
          void main(){
            float k = smoothstep(20.0, 160.0, vD);
            vec3 c = mix(deep, light, k * 0.8);
            float wave = sin(vW.x * 0.35 + sin(vW.y * 0.25 + t * 0.6) * 1.6 + t * 0.4) * 0.5 + 0.5;
            float band = smoothstep(0.93, 0.97, fract(vW.y * 0.18 + wave * 0.35 + t * 0.05));
            float fade = 1.0 - smoothstep(30.0, 120.0, vD);
            c = mix(c, ln, band * 0.75 * fade);
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [deep, light, lines]
  );
  useFrame((_, dt) => (mat.uniforms.t.value += dt * speed));
  return (
    <mesh material={mat} rotation-x={-Math.PI / 2} position={position}>
      <planeGeometry args={size} />
    </mesh>
  );
}

/** Plano con textura (capa 2D del parallax). */
export function Layer({ map, w, h, opacity = 1, fog = false, bob = 0, bobSpeed = 1, phase = 0, children, ...p }) {
  const ref = useRef();
  const base = p.position ? p.position[1] : 0;
  useFrame(({ clock }) => {
    if (bob && ref.current) ref.current.position.y = base + Math.sin(clock.elapsedTime * bobSpeed + phase) * bob;
  });
  return (
    <mesh ref={ref} {...p}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} alphaTest={0.02} fog={fog} />
      {children}
    </mesh>
  );
}

/** Pino ukiyo-e: tronco torcido que se estrecha, ramas y almohadillas planas de agujas. */
export function Pine({ scale = 1, seed = 1, lean = 0.5, ...p }) {
  const data = useMemo(() => {
    const r = mulberry(seed);
    const pts = [];
    let x = 0, z = 0;
    for (let i = 0; i <= 5; i++) {
      pts.push(new THREE.Vector3(x, i * 0.92, z));
      x += (r() - 0.5) * 0.7 + lean * 0.14;
      z += (r() - 0.5) * 0.45;
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const trunk = taperedTube(pts, 0.34, 0.11, 26, 7);
    const pads = [], branches = [];
    const n = 4 + Math.floor(r() * 2);
    for (let i = 0; i < n; i++) {
      const t = 0.42 + (i / (n - 1)) * 0.58;
      const base = curve.getPointAt(t);
      const a = (i % 2 ? Math.PI : 0) + (r() - 0.5) * 1.6 + seed;
      const dist = i === n - 1 ? 0.15 : (1.25 - t * 0.55) * (1.1 + r() * 0.7);
      const end = base.clone().add(new THREE.Vector3(Math.cos(a) * dist, 0.25 + r() * 0.25, Math.sin(a) * dist));
      if (dist > 0.3) {
        const mid = base.clone().lerp(end, 0.5).add(new THREE.Vector3(0, -0.15, 0));
        branches.push(taperedTube([base, mid, end], 0.11, 0.05, 8, 5));
      }
      pads.push({ pos: end, r: (1.55 - t * 0.6) * (0.9 + r() * 0.3), g: padGeometry(seed * 10 + i), dark: i % 2 === 0 });
    }
    const bark = mergeParts([{ geo: trunk }, ...branches.map((g) => ({ geo: g }))]);
    const group = (dark) => {
      const list = pads.filter((pd) => pd.dark === dark);
      return list.length ? mergeParts(list.map((pd) => ({ geo: pd.g, p: pd.pos.toArray(), s: [pd.r * 1.25, pd.r * 0.62, pd.r] }))) : null;
    };
    return { bark, padsA: group(false), padsB: group(true) };
  }, [seed, lean]);
  const bark = useMemo(() => toon(P.woodDark, { map: woodTexture(9) }), []);
  const needlesA = useMemo(() => toon(P.pine, { map: needleTexture() }), []);
  const needlesB = useMemo(() => toon(P.pineDark, { map: needleTexture() }), []);
  return (
    <group scale={scale} {...p}>
      <mesh geometry={data.bark} material={bark}><Outlines thickness={2} color={P.sumi} /></mesh>
      {data.padsA ? <mesh geometry={data.padsA} material={needlesA}><Outlines thickness={2.4} color={P.sumi} /></mesh> : null}
      {data.padsB ? <mesh geometry={data.padsB} material={needlesB}><Outlines thickness={2.4} color={P.sumi} /></mesh> : null}
    </group>
  );
}

const BLOSSOM = ['#f7f1e6', '#efe4d0', '#e8d8bb', '#fbf8f1', '#f2e6d2', '#dfcba8'];
/** Cerezo: ramas que se abren y nubes de flor crema (instanciadas). */
export function Sakura({ scale = 1, seed = 3, ...p }) {
  const ref = useRef();
  const data = useMemo(() => {
    const r = mulberry(seed + 0.5);
    const pts = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.15, 1.1, 0.05), new THREE.Vector3(-0.1, 2.0, 0.1), new THREE.Vector3(0.05, 2.5, 0)];
    const trunk = taperedTube(pts, 0.3, 0.16, 18, 7);
    const top = pts[2];
    const branches = [], ends = [];
    const nb = 5;
    for (let i = 0; i < nb; i++) {
      const a = (i / nb) * Math.PI * 2 + r() * 0.8;
      const end = top.clone().add(new THREE.Vector3(Math.cos(a) * (1.3 + r() * 0.6), 0.7 + r() * 0.9, Math.sin(a) * (1.1 + r() * 0.5)));
      const mid = top.clone().lerp(end, 0.5).add(new THREE.Vector3(0, 0.25, 0));
      branches.push(taperedTube([top, mid, end], 0.13, 0.05, 10, 5));
      ends.push(end);
    }
    const blossoms = [];
    ends.forEach((e) => {
      for (let k = 0; k < 16; k++) {
        const s = 0.17 + r() * 0.2;
        const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 0.95;
        blossoms.push({ p: e.clone().add(new THREE.Vector3(Math.cos(a) * rr * 1.1, (r() - 0.45) * 0.55, Math.sin(a) * rr)), s, c: BLOSSOM[Math.floor(r() * BLOSSOM.length)] });
      }
    });
    for (let k = 0; k < 14; k++) blossoms.push({ p: top.clone().add(new THREE.Vector3((r() - 0.5) * 1.8, 1.0 + r() * 0.8, (r() - 0.5) * 1.5)), s: 0.2 + r() * 0.2, c: BLOSSOM[Math.floor(r() * BLOSSOM.length)] });
    return { bark: mergeParts([{ geo: trunk }, ...branches.map((g) => ({ geo: g }))]), blossoms };
  }, [seed]);
  const bark = useMemo(() => toon('#4a3a2a', { map: woodTexture(4) }), []);
  const flower = useMemo(() => toon('#ffffff'), []);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const o = new THREE.Object3D(), col = new THREE.Color();
    data.blossoms.forEach((b, i) => {
      o.position.copy(b.p); o.scale.set(b.s, b.s * 0.72, b.s); o.rotation.set(b.s * 3, b.s * 5, 0); o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, col.set(b.c));
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [data]);
  return (
    <group scale={scale} {...p}>
      <mesh geometry={data.bark} material={bark}><Outlines thickness={1.9} color={P.sumi} /></mesh>
      <instancedMesh ref={ref} args={[geo, flower, data.blossoms.length]} frustumCulled={false}>
        <Outlines thickness={1.3} color={P.sumi} />
      </instancedMesh>
    </group>
  );
}

/** Pétalos que caen (instanciados). */
export function Petals({ count = 140, area = [20, 10, 60], center = [0, 0, -25], color = P.washi }) {
  const ref = useRef();
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * area[0], y: Math.random() * area[1], z: (Math.random() - 0.5) * area[2],
        s: 0.3 + Math.random() * 0.6, r: Math.random() * 6, v: 0.3 + Math.random() * 0.5,
      })),
    [count, area]
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    data.forEach((d, i) => {
      d.y -= d.v * dt; d.r += dt * d.s * 2; d.x += Math.sin(d.r) * dt * 0.4;
      if (d.y < 0) d.y = area[1];
      dummy.position.set(center[0] + d.x, center[1] + d.y, center[2] + d.z);
      dummy.rotation.set(d.r, d.r * 0.7, 0);
      dummy.scale.setScalar(0.09);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <circleGeometry args={[1, 5]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}

let LANTERN_FRAME;
/** Cordón, aros superior/inferior y borla del farolillo, fusionados. */
function lanternFrame() {
  return (LANTERN_FRAME ??= mergeParts([
    { geo: new THREE.CylinderGeometry(0.015, 0.015, 0.6, 4), p: [0, 0.95, 0] },
    { geo: new THREE.CylinderGeometry(0.22, 0.24, 0.12, 14), p: [0, 0.6, 0] },
    { geo: new THREE.CylinderGeometry(0.24, 0.22, 0.12, 14), p: [0, -0.6, 0] },
    { geo: new THREE.CylinderGeometry(0.01, 0.01, 0.24, 4), p: [0, -0.78, 0] },
  ]));
}

/** Farolillo de papel (chōchin) con costillas, kanji y luz ocre. */
export function PaperLantern({ glow = 1.2, light = false, mark = '見', ...p }) {
  const ref = useRef();
  const mat = useMemo(() => new THREE.MeshToonMaterial({ color: '#ffffff', map: lanternTexture(mark), gradientMap: toonRamp(), emissive: P.ochre, emissiveIntensity: glow * 0.32 }), [mark, glow]);
  const frame = useMemo(() => lanternFrame(), []);
  const sumi = useMemo(() => toon(P.sumi), []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.2 + (p.position?.[2] || 0)) * 0.05;
  });
  return (
    <group ref={ref} {...p}>
      <mesh geometry={frame} material={sumi} />
      <mesh material={mat} scale={[0.42, 0.55, 0.42]}>
        <sphereGeometry args={[1, 18, 14]} />
        <Outlines thickness={2} color={P.sumi} />
      </mesh>
      {light ? <pointLight color={P.ochre} intensity={6} distance={7} decay={1.6} /> : null}
    </group>
  );
}

let TORO;
function toroGeometry() {
  if (TORO) return TORO;
  const C = (rt, rb, h) => new THREE.CylinderGeometry(rt, rb, h, 6);
  const parts = [
    { geo: C(0.46, 0.5, 0.24), p: [0, 0.12, 0] },
    { geo: C(0.3, 0.42, 0.2), p: [0, 0.34, 0] },
    { geo: C(0.13, 0.17, 1.0), p: [0, 0.9, 0] },
    { geo: C(0.42, 0.24, 0.2), p: [0, 1.46, 0] },
    ...[0, 1, 2].map((k) => ({ geo: new THREE.BoxGeometry(0.08, 0.46, 0.6), p: [0, 1.78, 0], r: [0, (k * Math.PI) / 3, 0] })),
    { geo: C(0.12, 0.66, 0.36), p: [0, 2.16, 0] },
    { geo: C(0.66, 0.6, 0.06), p: [0, 2.34, 0] },
    { geo: C(0.06, 0.14, 0.18), p: [0, 2.45, 0] },
    { geo: new THREE.SphereGeometry(0.12, 10, 8), p: [0, 2.6, 0] },
    { geo: new THREE.ConeGeometry(0.06, 0.16, 6), p: [0, 2.74, 0] },
  ];
  TORO = { stone: mergeParts(parts), light: new THREE.CylinderGeometry(0.28, 0.28, 0.44, 6) };
  return TORO;
}

/** Linterna de piedra (tōrō) hexagonal: piedra fusionada en una sola malla. */
export function StoneLantern(p) {
  const g = useMemo(() => toroGeometry(), []);
  const stone = useMemo(() => toon(P.stone), []);
  const light = useMemo(() => toon(P.washi, { emissive: P.ochre, emissiveIntensity: 0.9 }), []);
  return (
    <group {...p}>
      <mesh geometry={g.stone} material={stone}><Outlines thickness={2} color={P.sumi} /></mesh>
      <mesh geometry={g.light} material={light} position={[0, 1.78, 0]} />
    </group>
  );
}
