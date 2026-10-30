'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ink, Box, toon } from '../kit';
import { canvasTexture, plankTexture, tatamiTexture, wrapTexture, PALETTE as P } from '../textures';
import { bladeGeometry, spearHeadGeometry, taperedTube } from '../geom';
import { MBox } from '../Castle';
import { Kakejiku, StaticCam } from './common';
import { useStore } from '@/lib/store';
import { pick } from '@/lib/i18n';
import { sfx } from '@/lib/audio';
import skills from '@/content/skills.json';

const glow = (on) => (on ? { emissive: P.ochre, emissiveIntensity: 0.5 } : {});

function Grip({ len = 0.9, r = 0.07, ...p }) {
  const mat = useMemo(() => toon('#ffffff', { map: wrapTexture(), repeat: [2, len * 4] }), [len]);
  return (
    <mesh material={mat} {...p}>
      <cylinderGeometry args={[r, r, len, 10]} />
    </mesh>
  );
}

function Weapon({ kind, on }) {
  const c = glow(on);
  const g = useMemo(() => {
    switch (kind) {
      case 'bokken': return { blade: bladeGeometry({ length: 2.3, width: 0.17, curve: 0.16, tip: 0.3, depth: 0.09 }) };
      case 'naginata': return { blade: bladeGeometry({ length: 1.0, width: 0.16, curve: 0.22, tip: 0.35, depth: 0.04 }) };
      case 'yari': return { blade: spearHeadGeometry(0.72, 0.1) };
      case 'yumi': {
        // arco asimétrico: el agarre queda por debajo del centro
        const pts = [];
        for (let i = 0; i <= 12; i++) {
          const t = i / 12;
          const y = -1.35 + t * 3.6;
          const x = -Math.sin(t * Math.PI) * 0.42 + (t < 0.05 || t > 0.95 ? 0.06 : 0);
          pts.push([x, y, 0]);
        }
        return { bow: taperedTube(pts, 0.05, 0.035, 40, 6) };
      }
      default: return {};
    }
  }, [kind]);
  switch (kind) {
    case 'bokken':
      return (
        <group>
          <Ink geometry={g.blade} color={P.wood} wood={9} {...c} position={[0, -0.45, 0]} />
          <Ink color={P.sumi} position={[0.03, -0.5, 0]} rotation-x={Math.PI / 2} outline={1.4}><cylinderGeometry args={[0.2, 0.2, 0.05, 18]} /></Ink>
          <Grip len={0.85} r={0.065} position={[0.0, -0.98, 0]} />
          <Ink color={P.ochre} position={[0, -1.42, 0]} outline={1.2}><cylinderGeometry args={[0.07, 0.065, 0.06, 10]} /></Ink>
        </group>
      );
    case 'bo':
      return (
        <group>
          <Ink color={P.wood} wood={9} {...c}><cylinderGeometry args={[0.085, 0.085, 3.3, 12]} /></Ink>
          {[-1.58, 1.58].map((y) => <Ink key={y} color={P.sumi} position={[0, y, 0]} outline={1.2}><cylinderGeometry args={[0.09, 0.09, 0.14, 12]} /></Ink>)}
          <Grip len={0.5} r={0.09} position={[0, -0.35, 0]} />
          <Grip len={0.5} r={0.09} position={[0, 0.55, 0]} />
        </group>
      );
    case 'naginata':
      return (
        <group>
          <Ink color={P.woodDark} wood {...c} position={[0, -0.3, 0]}><cylinderGeometry args={[0.07, 0.075, 2.8, 10]} /></Ink>
          <Grip len={0.36} r={0.08} position={[0, -1.55, 0]} />
          <Ink color={P.ochre} position={[0, 1.12, 0]} outline={1.2}><cylinderGeometry args={[0.09, 0.08, 0.18, 10]} /></Ink>
          <Ink color={P.sumi} position={[0, 1.24, 0]} rotation-x={Math.PI / 2} outline={1.2}><cylinderGeometry args={[0.16, 0.16, 0.04, 14]} /></Ink>
          <Ink geometry={g.blade} color={'#d9d4c8'} {...c} position={[0, 1.27, 0]} />
        </group>
      );
    case 'yari':
      return (
        <group>
          <Ink color={P.woodDark} wood {...c} position={[0, -0.2, 0]}><cylinderGeometry args={[0.06, 0.065, 3.1, 10]} /></Ink>
          <Ink color={P.ochre} position={[0, 1.38, 0]} outline={1.2}><cylinderGeometry args={[0.075, 0.07, 0.22, 10]} /></Ink>
          <Ink color={P.ai} position={[0, 1.2, 0]} outline={1.2}><sphereGeometry args={[0.1, 10, 8]} /></Ink>
          <Ink geometry={g.blade} color={'#d9d4c8'} {...c} position={[0, 1.48, 0]} />
        </group>
      );
    case 'yumi':
      return (
        <group position={[0.15, 0, 0]}>
          <Ink geometry={g.bow} color={P.woodDark} {...c} />
          <mesh position={[0.06, 0.45, 0]}><cylinderGeometry args={[0.01, 0.01, 3.55, 4]} /><meshBasicMaterial color={P.washi} /></mesh>
          <Grip len={0.32} r={0.06} position={[-0.42, -0.05, 0]} />
        </group>
      );
    default:
      return null;
  }
}

function plaqueTex(cat, lang) {
  return canvasTexture(`dojo-plaque-${cat.id}-${lang}`, 256, 384, {
    text: cat.kanji + pick(cat.name, lang),
    draw: (x, w, h) => {
      x.fillStyle = '#c9a46a'; x.fillRect(0, 0, w, h);
      for (let i = 0; i < 22; i++) { x.strokeStyle = `rgba(70,45,20,${0.08 + (i % 4) * 0.04})`; x.lineWidth = 1 + (i % 3); x.beginPath(); x.moveTo(10 + i * 11, 0); x.bezierCurveTo(i * 11 - 6, h * 0.3, i * 11 + 14, h * 0.7, 6 + i * 11, h); x.stroke(); }
      x.strokeStyle = '#1A1A1A'; x.lineWidth = 10; x.strokeRect(5, 5, w - 10, h - 10);
      x.fillStyle = '#1A1A1A'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = '800 150px "Shippori Mincho"'; x.fillText(cat.kanji, w / 2, h * 0.4);
      x.font = '700 34px "Inter", sans-serif'; x.fillText(pick(cat.name, lang).toUpperCase(), w / 2, h * 0.8);
    },
  });
}

function Slot({ cat, x }) {
  const hovered = useStore((s) => s.hovered);
  const lang = useStore((s) => s.lang);
  const on = hovered === cat.id;
  const ref = useRef();
  const plaque = useMemo(() => plaqueTex(cat, lang), [cat, lang]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, on ? 3.25 : 3.0, 8, dt);
  });
  return (
    <group position={[x, 0, -5.35]}>
      {/* soporte con dos clavijas */}
      {[1.55, 4.45].map((y) => (
        <group key={y} position={[0, y, 0.05]}>
          <Box args={[0.7, 0.16, 0.24]} color={P.woodDark} wood />
          {[-0.22, 0.22].map((px) => <Ink key={px} color={P.woodDark} position={[px, 0.12, 0.08]} outline={1}><cylinderGeometry args={[0.035, 0.035, 0.16, 6]} /></Ink>)}
        </group>
      ))}
      <group
        ref={ref}
        position={[0, 3.0, 0.22]}
        onPointerOver={(e) => { e.stopPropagation(); if (!on) sfx('wood'); useStore.setState({ hovered: cat.id }); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); useStore.setState({ hovered: cat.id }); }}
      >
        <group scale={1.25}><Weapon kind={cat.weapon} on={on} /></group>
        <mesh visible={false}><boxGeometry args={[1.4, 4.6, 0.6]} /></mesh>
      </group>
      {/* placa de la categoría */}
      <group position={[0, 0.75, 0.12]}>
        <mesh>
          <planeGeometry args={[0.72, 1.08]} />
          <meshBasicMaterial map={plaque} toneMapped={false} />
        </mesh>
        {on ? <Box args={[0.86, 1.2, 0.04]} color={P.ochre} outline={1.4} position={[0, 0, -0.03]} /> : null}
      </group>
      {on ? <pointLight position={[0, 3.2, 1.2]} color={P.ochre} intensity={5} distance={4} /> : null}
    </group>
  );
}

/** Banda de ventanas shōji en lo alto del muro: la luz del dojo. */
function ShojiBand({ w = 18, y = 6.1, z = -5.85 }) {
  const n = Math.floor(w / 1.5);
  return (
    <group position={[0, y, z]}>
      <Box args={[w, 1.0, 0.12]} color={P.washi} paper emissive={P.ochre} emissiveIntensity={0.12} />
      {Array.from({ length: n + 1 }, (_, i) => <Box key={i} args={[0.08, 1.0, 0.16]} color={P.woodDark} outline={0} position={[-w / 2 + i * (w / n), 0, 0]} />)}
      <Box args={[w, 0.06, 0.16]} color={P.woodDark} outline={0} />
    </group>
  );
}

export default function DojoRoom() {
  const cats = skills.categories;
  const mats = useMemo(() => {
    const floor = toon(P.wood, { map: plankTexture(4), repeat: [18 / 2, 12 / 4] });
    const side = toon(P.woodDark);
    const tat = toon('#ffffff', { map: tatamiTexture() });
    return { floor: [side, side, floor, side, side, side], tat: [side, side, tat, side, side, side] };
  }, []);
  return (
    <>
      <color attach="background" args={[P.washiDark]} />
      <ambientLight intensity={1.55} />
      <directionalLight position={[3, 8, 8]} intensity={1.25} />
      <pointLight position={[0, 5, 0]} intensity={6} color={P.ochre} distance={14} />
      {/* sala */}
      <MBox args={[18, 0.3, 12]} mats={mats.floor} position={[0, -0.15, 0]} />
      <Box args={[18, 7, 0.3]} color={P.plaster} paper position={[0, 3.5, -6]} />
      <Box args={[0.3, 7, 12]} color={P.plaster} paper position={[-9, 3.5, 0]} />
      <Box args={[0.3, 7, 12]} color={P.plaster} paper position={[9, 3.5, 0]} />
      {[-8.6, -4.6, 4.6, 8.6].map((x) => <Box key={x} args={[0.4, 7, 0.4]} color={P.woodDark} wood position={[x, 3.5, -5.7]} />)}
      <Box args={[18, 0.45, 0.45]} color={P.woodDark} wood position={[0, 6.85, -5.7]} />
      <Box args={[18, 0.3, 0.4]} color={P.woodDark} wood position={[0, 5.45, -5.7]} />
      <Box args={[18, 0.9, 0.2]} color={P.woodDark} wood position={[0, 0.45, -5.8]} />
      <ShojiBand />
      {/* armero sobre tablero */}
      <Box args={[13.4, 4.8, 0.12]} color="#d8c7a4" paper position={[0, 3.0, -5.78]} />
      <Box args={[13.8, 0.22, 0.3]} color={P.woodDark} wood position={[0, 5.48, -5.7]} />
      {cats.map((c, i) => <Slot key={c.id} cat={c} x={(i - 2) * 2.55} />)}
      <Kakejiku text="道場" sub="稽古" position={[-7.0, 3.6, -5.62]} w={1.2} h={3.6} />
      <Kakejiku text="実践" position={[7.0, 3.6, -5.62]} w={1.2} h={3.6} />
      {/* tatamis de entrenamiento */}
      {[-4.05, 0, 4.05].map((x) => <MBox key={x} args={[3.9, 0.12, 5.6]} mats={mats.tat} outline={1.6} position={[x, 0.06, 1.2]} />)}
      <StaticCam pos={[0, 3.1, 5.9]} look={[0, 2.9, -5]} sway={0.7} />
    </>
  );
}
