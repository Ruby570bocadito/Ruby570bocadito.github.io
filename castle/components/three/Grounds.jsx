'use client';
import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { Ink, Box, TileRoof, PaperLantern, InstancedParts, toon } from './kit';
import { MBox } from './Castle';
import { canvasTexture, plankTexture, bayTexture, namakoTexture, gravelTexture, crestTexture, woodTexture, PALETTE as P } from './textures';
import { avatarSVG, armSVG, ninjaSVG, craneSVG } from './art';
import { mergeParts } from './geom';

const hoverable = (set) => ({
  onPointerOver: (e) => { e.stopPropagation(); set(true); document.body.style.cursor = 'pointer'; },
  onPointerOut: () => { set(false); document.body.style.cursor = ''; },
});

export function norenTexture(room, label) {
  return canvasTexture('noren-' + room.id + '-' + label, 512, 640, {
    text: room.kanji,
    draw: (c, w, h) => {
      c.clearRect(0, 0, w, h);
      // tres paños de tela índigo con aberturas
      const gap = 10, pw = (w - 40 - gap * 2) / 3;
      for (let i = 0; i < 3; i++) {
        const x = 20 + i * (pw + gap);
        c.fillStyle = P.ai; c.fillRect(x, 40, pw, h - 60);
        c.strokeStyle = P.sumi; c.lineWidth = 7; c.strokeRect(x, 40, pw, h - 60);
      }
      c.fillStyle = P.aiDeep; c.fillRect(14, 22, w - 28, 34);
      c.strokeStyle = P.sumi; c.lineWidth = 7; c.strokeRect(14, 22, w - 28, 34);
      // kanji en vertical, crema
      const chars = [...room.kanji];
      const size = chars.length > 2 ? 104 : 160;
      c.fillStyle = P.washi; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = `800 ${size}px "Shippori Mincho"`;
      const total = chars.length * size * 0.98;
      chars.forEach((ch, i) => c.fillText(ch, w / 2, 70 + (h - 230 - total) / 2 + size / 2 + i * size * 0.98));
      c.font = '700 30px "Inter", sans-serif';
      c.fillText(room.name, w / 2, h - 110);
      c.font = '500 24px "Inter", sans-serif';
      c.fillStyle = P.ochre;
      c.fillText(label, w / 2, h - 70);
    },
  });
}

/** Puerta de sala con noren; clic para entrar. */
const DOOR_BARS = mergeParts([
  ...[-0.75, 0, 0.75].map((x) => ({ geo: new THREE.BoxGeometry(0.06, 4, 0.06), p: [x, 2, -0.08] })),
  ...[0.8, 1.6, 2.4, 3.2].map((y) => ({ geo: new THREE.BoxGeometry(3.05, 0.06, 0.06), p: [0, y, -0.08] })),
]);
const WINDOW_BARS = mergeParts([
  ...[-0.6, 0, 0.6].map((dz) => ({ geo: new THREE.BoxGeometry(0.14, 1.6, 0.06), p: [0, 0, dz] })),
  ...[-0.4, 0.2].map((dy) => ({ geo: new THREE.BoxGeometry(0.14, 0.06, 2.4), p: [0, dy, 0] })),
]);

export function NorenDoor({ room, label, onOpen, active, ...p }) {
  const [hover, setHover] = useState(false);
  const barMat = useMemo(() => toon(P.woodDark), []);
  const cloth = useRef();
  const tex = useMemo(() => norenTexture(room, label), [room, label]);
  useFrame(({ clock }) => {
    if (cloth.current) cloth.current.rotation.x = Math.sin(clock.elapsedTime * 1.4 + p.position[2]) * 0.04 + (hover ? -0.12 : 0);
  });
  const lit = hover || active;
  return (
    <group {...p} onClick={(e) => { e.stopPropagation(); onOpen?.(); }} {...hoverable(setHover)}>
      <Box args={[0.35, 4.2, 0.35]} color={P.woodDark} wood position={[-1.7, 2.1, 0]} />
      <Box args={[0.35, 4.2, 0.35]} color={P.woodDark} wood position={[1.7, 2.1, 0]} />
      <Box args={[3.8, 0.4, 0.45]} color={P.woodDark} wood position={[0, 4.2, 0]} />
      <Box args={[3.05, 4, 0.1]} color={P.washi} paper emissive={lit ? P.ochre : undefined} emissiveIntensity={0.5} position={[0, 2, -0.15]} />
      {/* celosía shōji */}
      <mesh geometry={DOOR_BARS} material={barMat} />
      <group ref={cloth} position={[0, 4.0, 0.18]}>
        <mesh position={[0, -1.25, 0]}>
          <planeGeometry args={[3.2, 2.5 * 1.25]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} alphaTest={0.05} />
        </mesh>
      </group>
    </group>
  );
}

/** Edificio largo con pasarela (engawa): zócalos de piedra, tablas, aleros con vigas y tejado de tejas. */
export function Engawa({ from = -2, to = -50 }) {
  const len = from - to;
  const mid = (from + to) / 2;
  const posts = useMemo(() => Array.from({ length: Math.floor(len / 4) + 1 }, (_, i) => from - i * 4), [from, len]);
  const rafters = useRef();
  const nR = Math.floor((len + 1.6) / 0.6);
  const mats = useMemo(() => {
    const top = toon('#a37e52', { map: plankTexture(5), repeat: [3.4 / 1.0, len / 8] });
    const side = toon(P.woodDark, { map: woodTexture(3) });
    const front = toon('#ffffff', { map: bayTexture(false), repeat: [len / 1.8, 1] });
    const pl = toon(P.plaster);
    return { deck: [side, side, top, side, side, side], wall: [front, front, pl, pl, pl, pl], stone: toon(P.stone), post: toon(P.woodDark, { map: woodTexture(6) }) };
  }, [len]);
  const footGeo = useMemo(() => new THREE.BoxGeometry(0.6, 0.35, 0.6), []);
  const postGeo = useMemo(() => new THREE.BoxGeometry(0.3, 4.9, 0.3), []);
  const postT = useMemo(() => ({ feet: posts.map((z) => ({ p: [-4.35, 0.17, z] })), posts: posts.map((z) => ({ p: [-4.35, 2.8, z] })) }), [posts]);
  useLayoutEffect(() => {
    const m = rafters.current;
    if (!m) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < nR; i++) {
      o.position.set(-5.7, 5.12, from + 0.8 - i * 0.6);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [from, nR]);
  const rafterGeo = useMemo(() => new THREE.BoxGeometry(3.6, 0.09, 0.12), []);
  const darkWood = useMemo(() => toon(P.woodDark), []);
  const rafterMat = useMemo(() => toon(P.woodDark), []);
  return (
    <group>
      {/* zócalos de piedra y suelo de tablas */}
      <InstancedParts geometry={footGeo} material={mats.stone} transforms={postT.feet} outline={1.6} />
      <MBox args={[3.4, 0.22, len]} mats={mats.deck} position={[-5.9, 0.46, mid]} />
      <Box args={[0.16, 0.2, len]} color={P.sumi} outline={0} position={[-4.18, 0.4, mid]} />
      {/* edificio */}
      <MBox args={[4, 5.2, len]} mats={mats.wall} position={[-9.6, 2.6, mid]} />
      <Box args={[0.2, 0.36, len]} color={P.woodDark} wood position={[-7.55, 4.62, mid]} />
      <Box args={[0.2, 0.2, len]} color={P.woodDark} outline={1.4} position={[-7.55, 0.62, mid]} />
      <InstancedParts geometry={postGeo} material={mats.post} transforms={postT.posts} />
      {posts.map((z) => <PaperLantern key={z} position={[-4.35, 4.15, z - 2]} scale={0.7} glow={1.1} mark="見" />)}
      <Box args={[0.26, 0.3, len]} color={P.woodDark} wood position={[-4.35, 5.05, mid]} />
      {/* ventanas shōji entre puertas */}
      {[-3.5, -12.2, -20.7, -29.2, -37.7, -46.2].map((z) => (
        <group key={z} position={[-7.56, 2.7, z]}>
          <Box args={[0.12, 1.6, 2.4]} color={P.washi} paper />
          <mesh geometry={WINDOW_BARS} material={darkWood} />
        </group>
      ))}
      {/* aleros con vigas vistas y tejado de tejas */}
      <instancedMesh ref={rafters} args={[rafterGeo, rafterMat, nR]} frustumCulled={false} />
      <TileRoof w={4.3} d={len / 2 + 1.2} h={2.4} tw={0.06} td={len / 2 - 2.4} wi={2.2} di={len / 2} lift={0.5} position={[-8, 5.3, mid]} />
    </group>
  );
}

/** Jardín seco: grava rastrillada con bordillo de piedra. */
export function Garden({ x0 = 0.8, x1 = 13, z0 = 1, z1 = -50 }) {
  const w = x1 - x0, d = z0 - z1;
  const mat = useMemo(() => toon('#ffffff', { map: gravelTexture(), repeat: [w / 4, d / 4] }), [w, d]);
  const curb = useRef();
  const stones = useMemo(() => {
    const out = [];
    for (let z = z0; z > z1; z -= 0.62) out.push([x0, z]);
    for (let x = x0 + 0.62; x < x1; x += 0.62) out.push([x, z0]);
    return out;
  }, [x0, x1, z0, z1]);
  useLayoutEffect(() => {
    const m = curb.current;
    if (!m) return;
    const o = new THREE.Object3D();
    stones.forEach(([x, z], i) => {
      o.position.set(x, 0.06, z); o.rotation.set(0, (i * 1.7) % 3, 0); o.scale.set(0.3 + (i % 3) * 0.04, 0.11, 0.26 + (i % 2) * 0.05);
      o.updateMatrix(); m.setMatrixAt(i, o.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [stones]);
  const geo = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const smat = useMemo(() => toon(P.stone), []);
  return (
    <group>
      <mesh material={mat} rotation-x={-Math.PI / 2} position={[x0 + w / 2, 0.02, z0 - d / 2]}>
        <planeGeometry args={[w, d]} />
      </mesh>
      <instancedMesh ref={curb} args={[geo, smat, stones.length]} frustumCulled={false}>
        <Outlines thickness={1.4} color={P.sumi} />
      </instancedMesh>
    </group>
  );
}

const SLAB = new THREE.CylinderGeometry(1, 1, 1, 7);
const PAD = new THREE.CylinderGeometry(1, 1, 1, 9);

/** Piedras de paso (tobi-ishi), instanciadas. */
export function SteppingStones({ points }) {
  const mat = useMemo(() => toon(P.stone), []);
  const t = useMemo(() => points.map(([x, z, r = 0.45], i) => ({ p: [x, 0.05, z], r: [0, i * 1.3, 0], s: [r, 0.1, r * 0.82] })), [points]);
  return <InstancedParts geometry={SLAB} material={mat} transforms={t} outline={1.6} />;
}

/** Manchas de musgo, instanciadas en dos tonos. */
export function Moss({ patches }) {
  const a = useMemo(() => toon(P.pine), []), b = useMemo(() => toon(P.pineDark), []);
  const t = (k) => patches.filter((_, i) => i % 2 === k).map(([x, z, r], i) => ({ p: [x, 0.03, z], r: [0, i, 0], s: [r, 0.04, r * 0.7] }));
  const ta = useMemo(() => t(0), [patches]), tb = useMemo(() => t(1), [patches]);
  return (
    <>
      <InstancedParts geometry={PAD} material={a} transforms={ta} outline={1.2} />
      {tb.length ? <InstancedParts geometry={PAD} material={b} transforms={tb} outline={1.2} /> : null}
    </>
  );
}

/** Kura: almacén de muro namako, cerrado con llave al fondo. */
export function Kura({ onOpen, ...p }) {
  const [hover, setHover] = useState(false);
  const mats = useMemo(() => {
    const nf = toon('#ffffff', { map: namakoTexture(), repeat: [6.3 / 1.6, 2.2 / 1.6] });
    const ns = toon('#ffffff', { map: namakoTexture(), repeat: [5.3 / 1.6, 2.2 / 1.6] });
    const dark = toon('#2f323a');
    return [ns, ns, dark, dark, nf, nf];
  }, []);
  const crest = useMemo(() => crestTexture(P.sumi), []);
  return (
    <group {...p} onClick={(e) => { e.stopPropagation(); onOpen?.(); }} {...hoverable(setHover)}>
      <Box args={[7.2, 0.8, 6.2]} color={P.stone} position={[0, 0.4, 0]} />
      <Box args={[6.2, 5, 5.2]} color={P.plaster} paper position={[0, 3.3, 0]} />
      <MBox args={[6.32, 2.2, 5.32]} mats={mats} position={[0, 1.9, 0]} />
      <Box args={[6.5, 0.28, 5.5]} color={P.plaster} paper position={[0, 3.05, 0]} />
      <Box args={[6.6, 0.5, 5.6]} color={P.plaster} paper position={[0, 5.75, 0]} />
      <TileRoof w={4.1} d={3.6} h={2.3} tw={2.5} td={0.07} wi={3.2} di={2.7} lift={0.32} position={[0, 6.0, 0]} />
      {/* puerta gruesa con herrajes */}
      <Box args={[2.6, 3.4, 0.4]} color={P.plaster} paper emissive={hover ? P.ochre : undefined} emissiveIntensity={0.3} position={[0, 2.5, 2.72]} />
      <Box args={[2.2, 3.0, 0.2]} color={P.woodDark} wood position={[0, 2.45, 2.86]} />
      {[1.4, 2.45, 3.5].map((y) => <Box key={y} args={[2.2, 0.14, 0.26]} color={P.sumi} outline={0} position={[0, y, 2.9]} />)}
      <Ink color={P.ochre} emissive={hover ? P.ochre : undefined} emissiveIntensity={0.5} position={[0, 2.55, 3.05]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.3, 0.08, 8, 18, Math.PI]} />
      </Ink>
      <Box args={[0.62, 0.48, 0.22]} color={P.ochre} emissive={hover ? P.ochre : undefined} emissiveIntensity={0.4} position={[0, 2.25, 3.05]} />
      {/* ventanuco con contraventanas */}
      <Box args={[1.0, 0.8, 0.2]} color={P.sumi} position={[-1.9, 4.45, 2.62]} />
      <Box args={[0.48, 0.8, 0.12]} color={P.plaster} paper position={[-2.65, 4.45, 2.7]} />
      <mesh position={[1.9, 4.45, 2.62]}>
        <circleGeometry args={[0.55, 32]} />
        <meshBasicMaterial map={crest} transparent toneMapped={false} />
      </mesh>
      <KuraSign position={[0, 4.65, 2.66]} />
    </group>
  );
}

function KuraSign(p) {
  const tex = useMemo(() => canvasTexture('kura-sign', 256, 256, {
    text: '蔵',
    draw: (c, w, h) => {
      c.fillStyle = P.washi; c.beginPath(); c.arc(w / 2, h / 2, 118, 0, 7); c.fill();
      c.strokeStyle = P.sumi; c.lineWidth = 10; c.stroke();
      c.fillStyle = P.sumi; c.font = '800 150px "Shippori Mincho"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText('蔵', w / 2, h / 2 + 8);
    },
  }), []);
  return (
    <mesh {...p}>
      <circleGeometry args={[0.62, 32]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/** Estanque: agua con ondas de tinta, bordillo de piedras, nenúfares y kois (ocre, crema y sumi). */
export function Pond(p) {
  const kois = useRef([]);
  const fish = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ r: 1.2 + (i % 3) * 0.9, s: 0.25 + ((i * 37) % 10) * 0.03, ph: i * 1.1, c: i % 3 === 0 ? P.ochre : i % 3 === 1 ? P.washi : '#e9b866' })), []);
  const water = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { t: { value: 0 }, a: { value: new THREE.Color(P.ai) }, b: { value: new THREE.Color(P.aiSoft) }, l: { value: new THREE.Color(P.washi) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform float t; uniform vec3 a; uniform vec3 b; uniform vec3 l; varying vec2 vUv;
      void main(){
        vec2 q = vUv - 0.5; float d = length(q * vec2(1.0, 1.4));
        vec3 c = mix(a, b, smoothstep(0.5, 0.0, d) * 0.5);
        float ring = smoothstep(0.035, 0.0, abs(fract(d * 5.0 - t * 0.25) - 0.5) - 0.44);
        c = mix(c, l, ring * 0.55 * smoothstep(0.5, 0.15, d));
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  }), []);
  const stones = useMemo(() => Array.from({ length: 26 }, (_, i) => {
    const a = (i / 26) * Math.PI * 2;
    return { p: [Math.cos(a) * 4.35, 0.12, Math.sin(a) * 3.05], r: [0, i * 1.7, 0], s: [0.36 + (i % 3) * 0.06, 0.2, 0.3 + (i % 2) * 0.05] };
  }), []);
  const stoneGeo = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const stoneMat = useMemo(() => toon(P.stone), []);
  const padGeo = useMemo(() => new THREE.CircleGeometry(1, 16, 0.35, Math.PI * 2 - 0.35), []);
  useFrame(({ clock }, dt) => {
    water.uniforms.t.value += dt;
    fish.forEach((f, i) => {
      const k = kois.current[i];
      if (!k) return;
      const an = clock.elapsedTime * f.s + f.ph;
      k.position.set(Math.cos(an) * f.r, 0.1, Math.sin(an) * f.r * 0.7);
      k.rotation.y = -an;
    });
  });
  return (
    <group {...p}>
      <mesh material={water} rotation-x={-Math.PI / 2} position={[0, 0.06, 0]} scale={[4.3, 3.0, 1]}>
        <circleGeometry args={[1, 40]} />
      </mesh>
      <InstancedParts geometry={stoneGeo} material={stoneMat} transforms={stones} outline={1.5} />
      {[[-2.1, 0.9, 0.42], [-1.5, 1.5, 0.3], [2.3, -1.1, 0.38]].map(([x, z, r], i) => (
        <mesh key={i} geometry={padGeo} rotation-x={-Math.PI / 2} rotation-z={i * 2} position={[x, 0.09, z]} scale={r}>
          <meshBasicMaterial color={i % 2 ? P.pine : P.pineDark} />
        </mesh>
      ))}
      {fish.map((f, i) => (
        <group key={i} ref={(el) => (kois.current[i] = el)}>
          <Ink color={f.c} outline={1.5} scale={[0.14, 0.06, 0.5]}><sphereGeometry args={[1, 10, 8]} /></Ink>
          <Ink color={P.sumi} outline={0} position={[0, 0.04, 0.12]} scale={[0.07, 0.05, 0.1]}><sphereGeometry args={[1, 6, 6]} /></Ink>
        </group>
      ))}
    </group>
  );
}

/** Mi avatar original que saluda en el patio. */
export function Avatar(p) {
  const arm = useRef();
  const body = useMemo(() => canvasTexture('avatar', 512, 1024, { svg: avatarSVG }), []);
  const armTex = useMemo(() => canvasTexture('arm', 256, 512, { svg: armSVG }), []);
  useFrame(({ clock }) => {
    if (arm.current) arm.current.rotation.z = -0.15 + Math.sin(clock.elapsedTime * 5) * 0.25;
  });
  const k = 2.2 / 1024;
  return (
    <group {...p}>
      <mesh position={[0, 1.1, 0]}>
        <planeGeometry args={[1.1, 2.2]} />
        <meshBasicMaterial map={body} transparent alphaTest={0.05} toneMapped={false} />
      </mesh>
      <group ref={arm} position={[(356 - 256) * k, 2.2 - 370 * k, 0.01]}>
        <mesh position={[(128 - 86) * k, (475 - 256) * k, 0]}>
          <planeGeometry args={[256 * k, 512 * k]} />
          <meshBasicMaterial map={armTex} transparent alphaTest={0.05} toneMapped={false} />
        </mesh>
      </group>
      {/* sombra plana */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color={P.sumi} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/** El ninja escondido en el tejado: la amenaza que hay que cazar. */
export function Ninja({ onCaught, caught, ...p }) {
  const tex = useMemo(() => canvasTexture('ninja', 256, 256, { svg: ninjaSVG }), []);
  const ref = useRef();
  const [gone, setGone] = useState(false);
  const fly = useRef(0);
  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    if (caught) {
      fly.current += dt;
      ref.current.position.y = p.position[1] + fly.current * 6;
      ref.current.rotation.z += dt * 8;
      ref.current.scale.setScalar(Math.max(0, 1 - fly.current));
      if (fly.current > 1 && !gone) setGone(true);
    } else {
      ref.current.position.y = p.position[1] + Math.max(0, Math.sin(clock.elapsedTime * 0.8)) * 0.25;
    }
  });
  if (gone) return null;
  return (
    <mesh
      ref={ref}
      {...p}
      onClick={(e) => { e.stopPropagation(); onCaught?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'crosshair'; }}
      onPointerOut={() => (document.body.style.cursor = '')}
    >
      <planeGeometry args={[1.1, 1.1]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.05} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

/** Grullas en vuelo. */
export function Cranes({ count = 4, y = 26, z = -70 }) {
  const tex = useMemo(() => canvasTexture('crane', 256, 160, { svg: craneSVG }), []);
  const refs = useRef([]);
  const birds = useMemo(() => Array.from({ length: count }, (_, i) => ({ x: -60 + i * 9, y: y + (i % 2) * 3 - i, z: z - i * 6, s: 3 + (i % 3) * 0.6, ph: i })), [count, y, z]);
  useFrame(({ clock }, dt) => {
    birds.forEach((b, i) => {
      const m = refs.current[i];
      if (!m) return;
      b.x += dt * b.s;
      if (b.x > 70) b.x = -70;
      m.position.set(b.x, b.y + Math.sin(clock.elapsedTime + b.ph) * 0.6, b.z);
      m.scale.y = 0.75 + Math.sin(clock.elapsedTime * 3 + b.ph) * 0.25;
    });
  });
  return birds.map((b, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)}>
      <planeGeometry args={[5, 3.1]} />
      <meshBasicMaterial map={tex} transparent alphaTest={0.05} toneMapped={false} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  ));
}
