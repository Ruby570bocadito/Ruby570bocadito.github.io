'use client';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { Ink, Box, TileRoof, Pine, InstancedParts, toon } from './kit';
import { canvasTexture, stoneTexture, bayTexture, loopholeTexture, plankTexture, crestTexture, woodTexture, PALETTE as P } from './textures';
import { ishigakiGeometry, gableGeometry, karaHafuGeometry } from './geom';

/** Caja con un material por cara: [+x, -x, +y, -y, +z, -z]. */
export function MBox({ args, mats, outline = 2.4, ...p }) {
  return (
    <mesh {...p} material={mats}>
      <boxGeometry args={args} />
      {outline ? <Outlines thickness={outline} color={P.sumi} /> : null}
    </mesh>
  );
}

/** Cuerpo de un piso: enlucido con ventanas renji y zócalo negro. */
function TierBody({ hw, hd, h, bay = 1.7, windows = true, ...p }) {
  const mats = useMemo(() => {
    const tex = bayTexture(windows);
    const nx = Math.max(1, Math.round((hw * 2) / bay)), nz = Math.max(1, Math.round((hd * 2) / bay));
    const sideX = toon('#ffffff', { map: tex, repeat: [nz, 1] });
    const sideZ = toon('#ffffff', { map: tex, repeat: [nx, 1] });
    const plain = toon(P.plaster);
    return [sideX, sideX, plain, plain, sideZ, sideZ];
  }, [hw, hd, bay, windows]);
  return <MBox args={[hw * 2, h, hd * 2]} mats={mats} position={[0, h / 2, 0]} {...p} />;
}

/** Frontón triangular con su tejadillo. */
function Gable({ w = 2.6, h = 1.3, depth = 1.6, ...p }) {
  const geo = useMemo(() => gableGeometry(w, h, depth), [w, h, depth]);
  const slope = Math.atan2(h, w / 2);
  const len = Math.hypot(w / 2, h) + 0.35;
  return (
    <group {...p}>
      <Ink geometry={geo} color={P.plaster} paper />
      {/* listones del frontón */}
      <Box args={[w * 0.7, 0.07, 0.04]} color={P.woodDark} outline={0} position={[0, h * 0.32, 0.02]} />
      {[-1, 1].map((k) => (
        <Box key={k} args={[len, 0.16, depth + 0.5]} color={P.ai} position={[(k * w) / 4, h / 2 + 0.08, -depth / 2 + 0.2]} rotation-z={-k * slope} />
      ))}
      <Box args={[0.22, 0.24, depth + 0.5]} color={P.aiDeep} position={[0, h + 0.1, -depth / 2 + 0.2]} />
      <Ink color={P.ochre} outline={1.2} position={[0, h * 0.62, 0.05]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.16, 0.16, 0.06, 12]} /></Ink>
    </group>
  );
}

/** Frontón curvo kara-hafu. */
function KaraHafu({ w = 3.4, h = 1.05, depth = 1.6, ...p }) {
  const band = useMemo(() => karaHafuGeometry(w, h, 0.24, depth), [w, h, depth]);
  const fill = useMemo(() => {
    const s = new THREE.Shape();
    const n = 24;
    s.moveTo(-w / 2, 0);
    for (let i = 0; i <= n; i++) {
      const x = (i / n - 0.5) * w;
      const t = Math.abs(x) / (w / 2);
      s.lineTo(x, h * Math.cos(t * Math.PI * 0.5) ** 1.6 + h * 0.12 * Math.max(0, t - 0.82) * 5 - 0.2);
    }
    s.lineTo(w / 2, 0);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.4, bevelEnabled: false });
    g.translate(0, 0, -0.5);
    return g;
  }, [w, h]);
  return (
    <group {...p}>
      <Ink geometry={fill} color={P.plaster} paper />
      <Ink geometry={band} color={P.ai} />
      <Ink color={P.ochre} outline={1.2} position={[0, h * 0.45, -0.08]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.2, 0.2, 0.06, 14]} /></Ink>
    </group>
  );
}

/** Torre del homenaje (tenshu): cuatro pisos sobre ishigaki en abanico. */
export function Keep(props) {
  const stone = useMemo(() => toon('#ffffff', { map: stoneTexture() }), []);
  const base = useMemo(() => ishigakiGeometry({ bw: 8.4, bd: 7.6, tw: 6.0, td: 5.3, h: 6.5, tile: 3.2 }), []);
  const T = [
    { hw: 5.6, hd: 4.9, h: 3.0, roof: { w: 7.1, d: 6.4, h: 1.7 } },
    { hw: 4.4, hd: 3.8, h: 2.7, roof: { w: 5.8, d: 5.2, h: 1.6 } },
    { hw: 3.3, hd: 2.8, h: 2.5, roof: { w: 4.6, d: 4.1, h: 1.5 } },
    { hw: 2.3, hd: 1.9, h: 2.4, roof: { w: 3.7, d: 3.3, h: 2.1 } },
  ];
  let y = 6.5;
  const tiers = T.map((t, i) => {
    const next = T[i + 1];
    const out = { ...t, y, roofY: y + t.h };
    y += t.h + t.roof.h;
    out.tw = next ? next.hw : 1.5;
    out.td = next ? next.hd : 0.07;
    return out;
  });
  return (
    <group {...props}>
      <mesh geometry={base} material={stone}><Outlines thickness={2.6} color={P.sumi} /></mesh>
      {tiers.map((t, i) => (
        <group key={i}>
          <TierBody hw={t.hw} hd={t.hd} h={t.h} position={[0, t.y + t.h / 2, 0]} windows />
          <TileRoof
            w={t.roof.w} d={t.roof.d} h={t.roof.h} tw={t.tw} td={t.td}
            wi={t.hw} di={t.hd} lift={0.55 - i * 0.06}
            ridge={i === T.length - 1} shachi={i === T.length - 1}
            position={[0, t.roofY, 0]}
          />
          {i === 0 ? <KaraHafu position={[0, t.roofY + 0.25, t.roof.d - 0.15]} /> : null}
          {i === 1
            ? [[0, 0], [Math.PI / 2, 1], [-Math.PI / 2, 1]].map(([ry, side], k) => (
                <group key={k} rotation-y={ry}>
                  <Gable w={side ? 2.2 : 2.8} h={side ? 1.1 : 1.35} position={[0, t.roofY + 0.2, (side ? t.roof.w : t.roof.d) - 0.55]} />
                </group>
              ))
            : null}
          {i === 2 ? <Gable w={2.2} h={1.15} position={[0, t.roofY + 0.2, t.roof.d - 0.5]} /> : null}
        </group>
      ))}
    </group>
  );
}

/** Colina verde sobre la que se alza la torre. */
export function Hill({ r = 16, h = 6, ...p }) {
  const geo = useMemo(() => {
    const prof = [[0, h], [r * 0.25, h * 0.98], [r * 0.5, h * 0.86], [r * 0.72, h * 0.58], [r * 0.88, h * 0.26], [r, 0]];
    const g = new THREE.LatheGeometry(prof.map(([x, y]) => new THREE.Vector2(x, y)), 28);
    const pos = g.attributes.position, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const a = Math.atan2(v.z, v.x);
      const k = 1 + 0.06 * Math.sin(a * 3) + 0.04 * Math.sin(a * 5 + 1);
      pos.setXYZ(i, v.x * k, v.y, v.z * k);
    }
    g.computeVertexNormals();
    return g;
  }, [r, h]);
  return <Ink geometry={geo} color={P.pine} {...p} />;
}

/** Muro dobei: ishigaki, enlucido con troneras y tejadillo. */
export function Wall({ length = 20, ...p }) {
  const mats = useMemo(() => {
    const st = toon('#ffffff', { map: stoneTexture(), repeat: [length / 3.2, 0.7] });
    const stS = toon('#ffffff', { map: stoneTexture(), repeat: [0.5, 0.7] });
    const top = toon(P.stone);
    const wallF = toon('#ffffff', { map: loopholeTexture(), repeat: [Math.round(length / 2.6), 1] });
    const wallS = toon(P.plaster);
    return { stone: [stS, stS, top, top, st, st], wall: [wallS, wallS, wallS, wallS, wallF, wallF] };
  }, [length]);
  return (
    <group {...p}>
      <MBox args={[length, 2.2, 1.7]} mats={mats.stone} position={[0, 1.1, 0]} />
      <MBox args={[length, 1.6, 0.8]} mats={mats.wall} position={[0, 3, 0]} />
      <TileRoof w={length / 2 + 0.35} d={0.85} h={0.7} tw={length / 2 - 0.2} td={0.06} wi={length / 2} di={0.4} lift={0.12} position={[0, 3.8, 0]} />
    </group>
  );
}

/** Torreón de esquina (sumi-yagura) de dos pisos. */
export function Turret(p) {
  const stone = useMemo(() => toon('#ffffff', { map: stoneTexture() }), []);
  const base = useMemo(() => ishigakiGeometry({ bw: 3.6, bd: 3.6, tw: 2.9, td: 2.9, h: 3.4, tile: 3.2 }), []);
  return (
    <group {...p}>
      <mesh geometry={base} material={stone}><Outlines thickness={2.4} color={P.sumi} /></mesh>
      <TierBody hw={2.5} hd={2.5} h={2.4} position={[0, 3.4 + 1.2, 0]} bay={1.6} />
      <TileRoof w={3.4} d={3.4} h={1.2} tw={1.8} td={1.8} wi={2.5} di={2.5} lift={0.35} position={[0, 5.8, 0]} />
      <TierBody hw={1.8} hd={1.8} h={1.8} position={[0, 7.0 + 0.9, 0]} bay={1.6} />
      <TileRoof w={2.8} d={2.8} h={1.4} tw={1.1} td={0.06} wi={1.8} di={1.8} lift={0.35} position={[0, 8.8, 0]} />
    </group>
  );
}

function GatePlaque(p) {
  const tex = useMemo(
    () => canvasTexture('plaque2', 512, 192, {
      text: '見張りの城',
      draw: (c, w, h) => {
        c.fillStyle = P.sumi; c.fillRect(0, 0, w, h);
        c.strokeStyle = P.ochre; c.lineWidth = 8; c.strokeRect(12, 12, w - 24, h - 24);
        c.lineWidth = 2; c.strokeRect(24, 24, w - 48, h - 48);
        c.fillStyle = P.ochre; c.font = '800 92px "Shippori Mincho"'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('見張りの城', w / 2, h / 2 + 6);
      },
    }),
    []
  );
  return (
    <mesh {...p}>
      <planeGeometry args={[2.6, 0.98]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function DoorLeaf({ side, glow }) {
  const crest = useMemo(() => crestTexture(P.ochre), []);
  const sx = side; // -1 hoja izquierda, 1 derecha
  return (
    <>
      <Box args={[2.3, 5.2, 0.26]} color={P.wood} wood={side < 0 ? 5 : 6} emissive={glow} emissiveIntensity={0.35} position={[-sx * 1.15, 2.6, 0]} />
      {[0.7, 2.6, 4.5].map((y) => <Box key={y} args={[2.3, 0.2, 0.34]} color={P.sumi} outline={1.2} position={[-sx * 1.15, y, 0]} />)}
      {[0.35, 1.15, 1.95].map((x) => [0.7, 2.6, 4.5].map((y) => (
        <Ink key={x + '-' + y} color={P.ochre} outline={0} position={[-sx * x, y, 0.2]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.07, 0.07, 0.06, 8]} /></Ink>
      )))}
      <mesh position={[-sx * 1.15, 3.55, 0.14]}>
        <planeGeometry args={[1.1, 1.1]} />
        <meshBasicMaterial map={crest} transparent toneMapped={false} />
      </mesh>
    </>
  );
}

/** Portón principal ōtemon: clic para entrar. */
export function Otemon({ open = false, onEnter, ...p }) {
  const [hover, setHover] = useState(false);
  const left = useRef(), right = useRef();
  useFrame((_, dt) => {
    const target = open ? 1.75 : 0;
    if (left.current) {
      left.current.rotation.y = THREE.MathUtils.damp(left.current.rotation.y, target, 3, dt);
      right.current.rotation.y = -left.current.rotation.y;
    }
  });
  const glow = hover && !open ? P.ochre : undefined;
  return (
    <group
      {...p}
      onClick={(e) => { e.stopPropagation(); onEnter?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
    >
      {[-2.75, 2.75].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <Box args={[0.85, 6.2, 0.85]} color={P.woodDark} wood position={[0, 3.1, 0]} />
          {[0.4, 5.8].map((y) => <Box key={y} args={[0.92, 0.22, 0.92]} color={P.sumi} outline={1.2} position={[0, y, 0]} />)}
          <Box args={[0.6, 4.8, 0.6]} color={P.woodDark} wood position={[0, 2.4, -1.7]} />
          <Box args={[0.3, 0.3, 1.8]} color={P.woodDark} position={[0, 4.6, -0.9]} />
        </group>
      ))}
      <Box args={[7.2, 0.7, 0.9]} color={P.woodDark} wood position={[0, 5.75, 0]} />
      <Box args={[7.6, 0.3, 2.6]} color={P.sumi} position={[0, 6.25, -0.6]} />
      <TileRoof w={4.9} d={2.7} h={2.1} tw={3.0} td={0.07} wi={4} di={1.6} lift={0.55} position={[0, 6.4, -0.6]} />
      <GatePlaque position={[0, 6.62, 0.48]} />
      {/* muretes laterales (sode-bei) */}
      {[-1, 1].map((k) => (
        <group key={k} position={[k * 4.3, 0, -0.3]}>
          <Box args={[2.4, 3.4, 0.6]} color={P.plaster} paper position={[0, 1.7, 0]} />
          <Box args={[2.4, 1.2, 0.66]} color={P.sumi} position={[0, 0.6, 0]} />
          <TileRoof w={1.5} d={0.7} h={0.55} tw={1.1} td={0.06} lift={0.1} position={[0, 3.4, 0]} />
        </group>
      ))}
      <group ref={left} position={[-2.3, 0, 0.1]}><DoorLeaf side={-1} glow={glow} /></group>
      <group ref={right} position={[2.3, 0, 0.1]}><DoorLeaf side={1} glow={glow} /></group>
    </group>
  );
}

const BRIDGE_GEO = {};
const bridgeGeo = () => {
  if (!BRIDGE_GEO.post) {
    BRIDGE_GEO.post = new THREE.BoxGeometry(0.24, 1.55, 0.24);
    BRIDGE_GEO.ball = new THREE.SphereGeometry(0.15, 10, 8);
    BRIDGE_GEO.tip = new THREE.ConeGeometry(0.07, 0.22, 8);
    BRIDGE_GEO.pile = new THREE.BoxGeometry(0.3, 1.4, 0.3);
  }
  return BRIDGE_GEO;
};

/** Puente de madera con remates giboshi de bronce (piezas instanciadas). */
export function Bridge({ from = 10.5, to = 40, ...p }) {
  const len = to - from;
  const g = bridgeGeo();
  const t = useMemo(() => {
    const zs = Array.from({ length: Math.floor(len / 3) + 1 }, (_, i) => from + i * 3);
    const sides = zs.flatMap((z) => [-1.6, 1.6].map((x) => [x, z]));
    return {
      posts: sides.map(([x, z]) => ({ p: [x, 0.78, z] })),
      balls: sides.map(([x, z]) => ({ p: [x, 1.66, z] })),
      tips: sides.map(([x, z]) => ({ p: [x, 1.86, z] })),
      piles: zs.map((z) => ({ p: [0, -0.2, z] })),
    };
  }, [from, len]);
  const mats = useMemo(() => {
    const top = toon('#b08a5c', { map: plankTexture(3), repeat: [3.4 / 1.2, len / 6] });
    const side = toon(P.woodDark, { map: woodTexture(2) });
    return { deck: [side, side, top, side, side, side], wood: toon(P.woodDark, { map: woodTexture(2) }), bronze: toon(P.ochre) };
  }, [len]);
  return (
    <group {...p}>
      <MBox args={[3.4, 0.35, len]} mats={mats.deck} position={[0, 0.7, from + len / 2]} />
      <InstancedParts geometry={g.post} material={mats.wood} transforms={t.posts} />
      <InstancedParts geometry={g.ball} material={mats.bronze} transforms={t.balls} outline={1.2} />
      <InstancedParts geometry={g.tip} material={mats.bronze} transforms={t.tips} outline={1.2} />
      <InstancedParts geometry={g.pile} material={mats.wood} transforms={t.piles} />
      {[-1.6, 1.6].map((x) => <Box key={x} args={[0.16, 0.16, len]} color={P.woodDark} wood position={[x, 1.42, from + len / 2]} />)}
      {[-1.6, 1.6].map((x) => <Box key={'m' + x} args={[0.1, 0.1, len]} color={P.woodDark} outline={1.2} position={[x, 1.02, from + len / 2]} />)}
    </group>
  );
}

/** Pinos de la colina. */
export function HillPines() {
  return (
    <>
      <Pine position={[-9, 2.2, 6]} scale={1.3} seed={21} />
      <Pine position={[10, 2.4, 5]} scale={1.2} seed={23} />
      <Pine position={[-11, 1.2, -6]} scale={1.4} seed={25} />
    </>
  );
}
