'use client';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Ink, Box, PaperLantern, Roof } from '../kit';
import { canvasTexture, PALETTE as P } from '../textures';
import { useStore } from '@/lib/store';
import { sfx } from '@/lib/audio';
import offensive from '@/content/offensive.json';

function plate(item) {
  return canvasTexture('kura-' + item.id, 512, 160, {
    text: item.kanji + item.name,
    draw: (c, w, h) => {
      c.fillStyle = P.washi; c.fillRect(6, 6, w - 12, h - 12);
      c.strokeStyle = P.sumi; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12);
      c.fillStyle = P.sumi; c.textBaseline = 'middle';
      c.font = '800 96px "Shippori Mincho"'; c.textAlign = 'left'; c.fillText(item.kanji, 26, h / 2 + 6);
      c.font = '800 52px "Shippori Mincho"'; c.fillText(item.name, 150, h / 2 + 4);
    },
  });
}

function Chest({ item, x }) {
  const [hover, setHover] = useState(false);
  const lid = useRef();
  const tex = useMemo(() => plate(item), [item]);
  useFrame((_, dt) => {
    if (lid.current) lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, hover ? -0.7 : 0, 6, dt);
  });
  return (
    <group
      position={[x, 0, -5.5]}
      onClick={(e) => { e.stopPropagation(); sfx('wood'); useStore.setState({ kuraItem: item.id }); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
    >
      <Box args={[2.2, 1.3, 1.4]} color={P.woodDark} wood={x + 10} position={[0, 0.65, 0]} />
      {[-0.8, 0.8].map((bx) => <Box key={bx} args={[0.14, 1.32, 1.42]} color={P.sumi} outline={0} position={[bx, 0.65, 0]} />)}
      <group ref={lid} position={[0, 1.3, -0.7]}>
        <Box args={[2.3, 0.3, 1.5]} color={P.wood} wood={x + 3} position={[0, 0.15, 0.7]} emissive={hover ? P.ochre : undefined} emissiveIntensity={0.4} />
      </group>
      {hover ? <pointLight position={[0, 1.6, 0]} color={P.ochre} intensity={5} distance={4} /> : null}
      <mesh position={[0, 0.7, 0.72]}>
        <planeGeometry args={[1.6, 0.5]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function KuraRoom() {
  const open = useStore((s) => s.kuraOpen);
  const { camera } = useThree();
  const doorL = useRef(), doorR = useRef(), lock = useRef();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const [lockHover, setLockHover] = useState(false);

  useFrame((_, dt) => {
    const k = open ? 1 : 0;
    if (doorL.current) {
      doorL.current.position.x = THREE.MathUtils.damp(doorL.current.position.x, -1.5 - k * 2.9, 3, dt);
      doorR.current.position.x = THREE.MathUtils.damp(doorR.current.position.x, 1.5 + k * 2.9, 3, dt);
    }
    if (lock.current) {
      lock.current.rotation.z = THREE.MathUtils.damp(lock.current.rotation.z, k * 1.6, 4, dt);
      lock.current.position.y = THREE.MathUtils.damp(lock.current.position.y, open ? -0.5 : 2.6, 2, dt);
    }
    pos.set(0, open ? 3.2 : 3, open ? 0.6 : 13);
    look.set(0, open ? 0.9 : 3, open ? -5.5 : 0);
    if (lock.current) lock.current.visible = lock.current.position.y > 0;
    camera.position.lerp(pos, 1 - Math.exp(-dt * 2.5));
    camera.lookAt(look);
  });

  return (
    <>
      <color attach="background" args={['#120d08']} />
      <fog attach="fog" args={['#120d08', 8, 26]} />
      <ambientLight intensity={open ? 0.9 : 0.6} />
      <directionalLight position={[0, 8, 10]} intensity={0.9} />
      <pointLight position={[0, 3.5, -4.5]} color={P.ochre} intensity={open ? 14 : 0} distance={12} />
      {/* interior */}
      <Box args={[14, 0.2, 12]} color={P.woodDark} wood position={[0, -0.1, -4]} />
      <Box args={[14, 6, 0.3]} color="#3a2a1a" wood={7} position={[0, 3, -9.5]} />
      <Box args={[0.3, 6, 11]} color="#3a2a1a" wood={7} position={[-6.8, 3, -4]} />
      <Box args={[0.3, 6, 11]} color="#3a2a1a" wood={7} position={[6.8, 3, -4]} />
      {offensive.items.map((it, i) => <Chest key={it.id} item={it} x={(i - 1.5) * 2.7} />)}
      <PaperLantern position={[-4.5, 4, -7]} light glow={1.2} />
      <PaperLantern position={[4.5, 4, -7]} light glow={1.2} />
      {/* fachada con puertas gruesas */}
      <group position={[0, 0, 1.5]}>
        <Box args={[16, 7, 0.6]} color={P.plaster} paper position={[-6.5, 3.5, 0]} scale={[0.4, 1, 1]} />
        <Box args={[16, 7, 0.6]} color={P.plaster} paper position={[6.5, 3.5, 0]} scale={[0.4, 1, 1]} />
        <Box args={[6.2, 1.6, 0.6]} color={P.plaster} paper position={[0, 6.2, 0]} />
        <Box args={[6.4, 2.2, 0.7]} color={P.sumi} position={[-6.5, 1.1, 0.02]} />
        <Box args={[6.4, 2.2, 0.7]} color={P.sumi} position={[6.5, 1.1, 0.02]} />
        {[-8.4, -6.5, -4.6, 4.6, 6.5, 8.4].map((x) => <Box key={x} args={[0.1, 2.6, 0.05]} color={P.washi} outline={0} rotation-z={0.78} position={[x, 1.1, 0.4]} />)}
        <Roof w={20} d={4} h={1.8} color={P.ai} position={[0, 7.9, 0]} />
        <group ref={doorL} position={[-1.5, 0, 0.45]}>
          <Box args={[3, 5.4, 0.5]} color={P.plaster} paper position={[0, 2.7, 0]} />
          <Box args={[3, 0.25, 0.55]} color={P.sumi} outline={0} position={[0, 4.6, 0]} />
        </group>
        <group ref={doorR} position={[1.5, 0, 0.45]}>
          <Box args={[3, 5.4, 0.5]} color={P.plaster} paper position={[0, 2.7, 0]} />
          <Box args={[3, 0.25, 0.55]} color={P.sumi} outline={0} position={[0, 4.6, 0]} />
        </group>
        <group
          ref={lock}
          position={[0, 2.6, 0.85]}
          onClick={(e) => { e.stopPropagation(); if (!open) { sfx('wood'); useStore.setState({ kuraOpen: true }); } }}
          onPointerOver={(e) => { e.stopPropagation(); setLockHover(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setLockHover(false); document.body.style.cursor = ''; }}
        >
          <Box args={[0.9, 0.7, 0.3]} color={P.ochre} emissive={lockHover ? P.ochre : undefined} emissiveIntensity={0.6} />
          <Ink color={P.ochre} position={[0, 0.45, 0]}><torusGeometry args={[0.3, 0.07, 8, 16, Math.PI]} /></Ink>
          <Box args={[0.08, 0.25, 0.05]} color={P.sumi} outline={0} position={[0, 0, 0.17]} />
        </group>
      </group>
    </>
  );
}
