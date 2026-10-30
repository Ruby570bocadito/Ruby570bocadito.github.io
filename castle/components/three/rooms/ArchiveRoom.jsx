'use client';
import * as THREE from 'three';
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ink, Box, PaperLantern } from '../kit';
import { PALETTE as P } from '../textures';
import { Hall, StaticCam, Kakejiku } from './common';
import { useStore } from '@/lib/store';
import { sfx } from '@/lib/audio';
import certs from '@/content/certs.json';

const TAG = { obtained: P.pine, preparing: P.ochre, course: P.ai };

function Scroll({ item, pos }) {
  const [hover, setHover] = useState(false);
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, hover ? 0.7 : 0, 8, dt);
  });
  const color = TAG[item.status] || P.ai;
  return (
    <group position={pos}>
      <group
        ref={ref}
        onClick={(e) => { e.stopPropagation(); sfx('paper'); useStore.setState({ cert: item.id }); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
      >
        <Ink color={P.washi} paper emissive={hover ? P.ochre : undefined} emissiveIntensity={0.4} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.28, 0.28, 1.6, 16]} />
        </Ink>
        <Ink color={color} rotation-z={Math.PI / 2} position={[0, 0, 0]}><cylinderGeometry args={[0.3, 0.3, 0.25, 16]} /></Ink>
        {[-0.9, 0.9].map((x) => (
          <Ink key={x} color={P.woodDark} position={[x, 0, 0]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.12, 0.12, 0.25, 10]} /></Ink>
        ))}
        {/* etiqueta colgante */}
        <Box args={[0.3, 0.55, 0.04]} color={color} position={[0.5, -0.5, 0.25]} />
      </group>
    </group>
  );
}

export default function ArchiveRoom() {
  const items = [...certs.items, ...certs.achievements];
  const cols = 4;
  return (
    <>
      <color attach="background" args={[P.washiDark]} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[2, 8, 8]} intensity={1.2} />
      <Hall w={18} d={12} h={8} />
      {/* estantería de casillas */}
      <group position={[0, 0, -5]}>
        <Box args={[11, 6.6, 1.6]} color={P.woodDark} wood position={[0, 3.6, -0.3]} />
        {Array.from({ length: 2 * cols }, (_, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          return <Box key={i} args={[2.4, 2.6, 1.2]} color="#3a2a1a" outline={0} position={[-3.9 + c * 2.6, 5.1 - r * 3, 0.25]} />;
        })}
        {items.map((it, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          return <Scroll key={it.id} item={it} pos={[-3.9 + c * 2.6, 4.75 - r * 3, 0.65]} />;
        })}
      </group>
      <Kakejiku text="巻物庫" position={[-7.5, 4, -5.7]} w={1.2} h={3.8} />
      <Kakejiku text="継続" sub="学" position={[7.5, 4, -5.7]} w={1.2} h={3.8} />
      <PaperLantern position={[-5.5, 6.2, -2]} light glow={1.4} />
      <PaperLantern position={[5.5, 6.2, -2]} light glow={1.4} />
      <StaticCam pos={[0, 3.6, 8]} look={[0, 3.4, -5]} sway={0.9} />
    </>
  );
}
