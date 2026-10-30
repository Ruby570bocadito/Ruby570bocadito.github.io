'use client';
import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Box, Ink } from '../kit';
import { canvasTexture, PALETTE as P } from '../textures';

/** Cámara fija con un leve parallax del ratón. */
export function StaticCam({ pos, look, sway = 0.6 }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(...look), [look]);
  const p = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    p.set(pos[0] + pointer.x * sway, pos[1] + pointer.y * sway * 0.4, pos[2]);
    camera.position.lerp(p, 1 - Math.exp(-dt * 4));
    camera.lookAt(target);
  });
  return null;
}

/** Sala de madera: suelo de tablas, paredes de enlucido con vigas. */
export function Hall({ w = 20, d = 14, h = 7, floor = P.wood, wall = P.plaster }) {
  return (
    <group>
      <Box args={[w, 0.3, d]} color={floor} wood={4} position={[0, -0.15, 0]} />
      {Array.from({ length: Math.floor(w / 1.4) }, (_, i) => (
        <mesh key={i} position={[-w / 2 + 0.7 + i * 1.4, 0.005, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.03, d]} />
          <meshBasicMaterial color={P.sumi} transparent opacity={0.35} />
        </mesh>
      ))}
      <Box args={[w, h, 0.3]} color={wall} paper position={[0, h / 2, -d / 2]} />
      <Box args={[0.3, h, d]} color={wall} paper position={[-w / 2, h / 2, 0]} />
      <Box args={[0.3, h, d]} color={wall} paper position={[w / 2, h / 2, 0]} />
      {[-w / 2 + 0.4, -w / 4, 0, w / 4, w / 2 - 0.4].map((x) => (
        <Box key={x} args={[0.4, h, 0.4]} color={P.woodDark} wood position={[x, h / 2, -d / 2 + 0.3]} />
      ))}
      <Box args={[w, 0.5, 0.5]} color={P.woodDark} wood position={[0, h - 0.25, -d / 2 + 0.3]} />
      <Box args={[w, 0.35, 0.4]} color={P.woodDark} wood position={[0, 0.9, -d / 2 + 0.3]} />
    </group>
  );
}

/** Pergamino colgante (kakejiku) con texto vertical. */
export function Kakejiku({ text, sub, w = 1.4, h = 4, ...p }) {
  const tex = useMemo(
    () => canvasTexture('kake-' + text + (sub || ''), 256, 720, {
      text,
      draw: (c, W, H) => {
        c.fillStyle = P.ai; c.fillRect(0, 0, W, H);
        c.fillStyle = P.washi; c.fillRect(28, 60, W - 56, H - 120);
        c.strokeStyle = P.sumi; c.lineWidth = 5; c.strokeRect(28, 60, W - 56, H - 120);
        c.fillStyle = P.sumi; c.textAlign = 'center'; c.textBaseline = 'middle';
        const chars = [...text];
        const size = Math.min(130, (H - 200) / chars.length);
        c.font = `800 ${size}px "Shippori Mincho"`;
        chars.forEach((ch, i) => c.fillText(ch, W / 2, 110 + size / 2 + i * size));
        if (sub) {
          c.fillStyle = P.shu; c.fillRect(W / 2 - 28, H - 150, 56, 56);
          c.fillStyle = P.washi; c.font = '800 30px "Shippori Mincho"'; c.fillText(sub, W / 2, H - 121);
        }
      },
    }),
    [text, sub]
  );
  return (
    <group {...p}>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <Ink color={P.woodDark} position={[0, h / 2 + 0.05, 0.05]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.07, 0.07, w + 0.3, 8]} /></Ink>
      <Ink color={P.woodDark} position={[0, -h / 2 - 0.05, 0.05]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.09, 0.09, w + 0.4, 8]} /></Ink>
    </group>
  );
}

export const hover = (set, id) => ({
  onPointerOver: (e) => { e.stopPropagation(); set(id); document.body.style.cursor = 'pointer'; },
  onPointerOut: () => { set(null); document.body.style.cursor = ''; },
});
