'use client';
import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ink, Box } from '../kit';
import { PALETTE as P } from '../textures';
import { Hall, Kakejiku, StaticCam } from './common';
import { useStore } from '@/lib/store';
import { sfx } from '@/lib/audio';
import skills from '@/content/skills.json';

const glow = (on) => (on ? { emissive: P.ochre, emissiveIntensity: 0.55 } : {});

function Weapon({ kind, on }) {
  const c = { ...glow(on) };
  switch (kind) {
    case 'bokken':
      return (
        <group rotation-z={0.04}>
          <Ink color={P.wood} wood {...c} position={[0, 0.6, 0]} scale={[1, 1, 0.5]}><boxGeometry args={[0.22, 2.4, 0.14]} /></Ink>
          <Ink color={P.sumi} position={[0, -0.85, 0]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.2, 0.2, 0.05, 16]} /></Ink>
          <Ink color={P.ai} {...c} position={[0, -1.35, 0]}><cylinderGeometry args={[0.07, 0.07, 0.9, 8]} /></Ink>
        </group>
      );
    case 'bo':
      return <Ink color={P.wood} wood={9} {...c}><cylinderGeometry args={[0.1, 0.1, 3.4, 10]} /></Ink>;
    case 'naginata':
      return (
        <group>
          <Ink color={P.woodDark} wood {...c} position={[0, -0.4, 0]}><cylinderGeometry args={[0.08, 0.08, 2.8, 8]} /></Ink>
          <Ink color={P.wood} wood={2} {...c} position={[0.12, 1.75, 0]} rotation-z={-0.18}><coneGeometry args={[0.2, 1.1, 4]} /></Ink>
          <Ink color={P.sumi} position={[0, 1.25, 0]}><cylinderGeometry args={[0.1, 0.1, 0.1, 8]} /></Ink>
        </group>
      );
    case 'yari':
      return (
        <group>
          <Ink color={P.woodDark} wood {...c} position={[0, -0.3, 0]}><cylinderGeometry args={[0.075, 0.075, 3.0, 8]} /></Ink>
          <Ink color={P.wood} wood={4} {...c} position={[0, 1.95, 0]}><coneGeometry args={[0.1, 0.7, 4]} /></Ink>
          <Ink color={P.ai} position={[0, 1.5, 0]}><cylinderGeometry args={[0.09, 0.09, 0.25, 8]} /></Ink>
        </group>
      );
    case 'yumi':
      return (
        <group>
          <Ink color={P.woodDark} {...c} position={[-0.75, 0.1, 0]} rotation-z={-0.95}>
            <torusGeometry args={[1.9, 0.07, 6, 32, 1.9]} />
          </Ink>
          <mesh position={[0.21, 0.1, 0]}><cylinderGeometry args={[0.012, 0.012, 3.05, 4]} /><meshBasicMaterial color={P.sumi} /></mesh>
        </group>
      );
    default:
      return null;
  }
}

function Slot({ cat, x }) {
  const hovered = useStore((s) => s.hovered);
  const on = hovered === cat.id;
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.y = THREE.MathUtils.damp(ref.current.position.y, on ? 3.15 : 2.9, 8, dt);
  });
  return (
    <group position={[x, 0, -5.4]}>
      <group
        ref={ref}
        position={[0, 2.9, 0]}
        onPointerOver={(e) => { e.stopPropagation(); if (!on) sfx('wood'); useStore.setState({ hovered: cat.id }); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); useStore.setState({ hovered: cat.id }); }}
      >
        <group scale={1.35}><Weapon kind={cat.weapon} on={on} /></group>
        {/* zona de impacto amplia e invisible */}
        <mesh visible={false}><boxGeometry args={[1.4, 4.4, 0.6]} /></mesh>
      </group>
      {/* placa con el kanji de la categoría */}
      <Box args={[1.2, 0.45, 0.1]} color={on ? P.ochre : P.sumi} position={[0, 0.65, 0.2]} />
    </group>
  );
}

export default function DojoRoom() {
  const cats = skills.categories;
  return (
    <>
      <color attach="background" args={[P.washiDark]} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[3, 8, 8]} intensity={1.3} />
      <pointLight position={[0, 5, 0]} intensity={8} color={P.ochre} distance={14} />
      <Hall w={18} d={12} h={7} />
      {/* armero sobre tablero oscuro */}
      <Box args={[13.6, 5.2, 0.15]} color={P.washiDark} paper position={[0, 3.1, -5.75]} />
      <Box args={[13, 0.3, 0.5]} color={P.woodDark} wood position={[0, 5.1, -5.6]} />
      <Box args={[13, 0.3, 0.5]} color={P.woodDark} wood position={[0, 1.0, -5.6]} />
      {cats.map((c, i) => <Slot key={c.id} cat={c} x={(i - 2) * 2.5} />)}
      <Kakejiku text="道場" sub="稽古" position={[-7.6, 3.8, -5.7]} w={1.2} h={3.6} />
      <Kakejiku text="実践" position={[7.6, 3.8, -5.7]} w={1.2} h={3.6} />
      {/* tatamis de entrenamiento */}
      {[-4, 0, 4].map((x) => <Box key={x} args={[3.8, 0.12, 5]} color="#c9b98c" outline={1.4} position={[x, 0.06, 1]} />)}
      <StaticCam pos={[0, 3.2, 7.5]} look={[0, 2.8, -5]} sway={0.8} />
    </>
  );
}
