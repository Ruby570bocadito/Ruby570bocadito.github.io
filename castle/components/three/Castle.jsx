'use client';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ink, Box, Roof } from './kit';
import { canvasTexture, PALETTE as P } from './textures';

/** Torre del homenaje (tenshu) de tres pisos sobre muralla ishigaki. */
export function Keep(props) {
  const tiers = [
    { w: 10, h: 3.4, roof: 13.6 },
    { w: 7.6, h: 3, roof: 10.6 },
    { w: 5.4, h: 2.8, roof: 8 },
  ];
  let y = 7;
  return (
    <group {...props}>
      <Ink color={P.stone} position={[0, 3.5, 0]} rotation-y={Math.PI / 4}>
        <cylinderGeometry args={[8.6, 11, 7, 4, 1]} />
      </Ink>
      {/* hiladas de la muralla */}
      {[1.4, 3, 4.6, 6.1].map((h) => (
        <mesh key={h} position={[0, h, 0]} rotation-y={Math.PI / 4}>
          <cylinderGeometry args={[11 - (h / 7) * 2.4 + 0.02, 11 - (h / 7) * 2.4 + 0.02, 0.06, 4, 1, true]} />
          <meshBasicMaterial color={P.sumi} />
        </mesh>
      ))}
      {tiers.map((t, i) => {
        const base = y;
        y += t.h + 1.1;
        return (
          <group key={i} position={[0, base, 0]}>
            <Box args={[t.w, t.h, t.w]} color={P.plaster} paper position={[0, t.h / 2, 0]} />
            {/* ventanas y vigas */}
            {[-1, 0, 1].map((k) => (
              <Box key={k} args={[0.9, 0.9, 0.1]} color={P.sumi} outline={0} position={[k * t.w * 0.3, t.h * 0.55, t.w / 2 + 0.03]} />
            ))}
            <Box args={[t.w + 0.1, 0.25, t.w + 0.1]} color={P.woodDark} wood position={[0, t.h - 0.1, 0]} />
            <Roof w={t.roof} d={t.roof} h={1.6} color={P.ai} position={[0, t.h + 0.75, 0]} />
            {/* frontón chidori-hafu */}
            {i < 2 ? (
              <Ink color={P.ai} position={[0, t.h + 1.2, t.w / 2 + 0.4]} rotation={[0, 0, 0]} scale={[t.w * 0.22, 1, 0.7]}>
                <coneGeometry args={[1.5, 1.4, 3]} />
              </Ink>
            ) : null}
          </group>
        );
      })}
      {/* remate y shachihoko ocre */}
      <Box args={[1.2, 1.4, 1.2]} color={P.ai} position={[0, y + 0.1, 0]} />
      <Ink color={P.ochre} position={[-0.9, y + 1.2, 0]} rotation-z={0.5}><coneGeometry args={[0.25, 1, 5]} /></Ink>
      <Ink color={P.ochre} position={[0.9, y + 1.2, 0]} rotation-z={-0.5}><coneGeometry args={[0.25, 1, 5]} /></Ink>
    </group>
  );
}

/** Muro con base de piedra, enlucido blanco y tejadillo. */
export function Wall({ length = 20, ...p }) {
  return (
    <group {...p}>
      <Box args={[length, 2.2, 1.6]} color={P.stone} position={[0, 1.1, 0]} />
      <Box args={[length, 1.6, 0.8]} color={P.plaster} paper position={[0, 3, 0]} />
      <Ink color={P.ai} position={[0, 4.05, 0]} rotation-z={Math.PI / 2} scale={[0.55, 1, 1.4]}>
        <cylinderGeometry args={[0.9, 0.9, length + 0.6, 3]} />
      </Ink>
    </group>
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
      {[-2.6, 2.6].map((x) => (
        <Box key={x} args={[0.7, 6, 0.7]} color={P.woodDark} wood position={[x, 3, 0]} />
      ))}
      <Box args={[6.6, 0.6, 0.8]} color={P.woodDark} wood position={[0, 5.6, 0]} />
      <Box args={[7.4, 0.35, 1.2]} color={P.sumi} position={[0, 6.1, 0]} />
      <Roof w={9.2} d={4.6} h={1.9} color={P.ai} position={[0, 7.1, 0]} />
      {/* placa con kanji */}
      <GatePlaque position={[0, 6.3, 0.62]} />
      <group ref={left} position={[-2.25, 0, 0.1]}>
        <Box args={[2.25, 5.2, 0.25]} color={P.wood} wood={5} emissive={glow} emissiveIntensity={0.35} position={[1.125, 2.6, 0]} />
        {[1.4, 3.8].map((y) => <Box key={y} args={[2.25, 0.18, 0.32]} color={P.sumi} outline={0} position={[1.125, y, 0]} />)}
        {[0.5, 1.7].map((x) => [1.4, 3.8].map((y) => (
          <Ink key={x + '-' + y} color={P.ochre} outline={1} position={[x, y, 0.18]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.1, 0.1, 0.06, 8]} /></Ink>
        )))}
      </group>
      <group ref={right} position={[2.25, 0, 0.1]}>
        <Box args={[2.25, 5.2, 0.25]} color={P.wood} wood={6} emissive={glow} emissiveIntensity={0.35} position={[-1.125, 2.6, 0]} />
        {[1.4, 3.8].map((y) => <Box key={y} args={[2.25, 0.18, 0.32]} color={P.sumi} outline={0} position={[-1.125, y, 0]} />)}
        {[-0.5, -1.7].map((x) => [1.4, 3.8].map((y) => (
          <Ink key={x + '-' + y} color={P.ochre} outline={1} position={[x, y, 0.18]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.1, 0.1, 0.06, 8]} /></Ink>
        )))}
      </group>
    </group>
  );
}

function GatePlaque(p) {
  const tex = useMemo(
    () => canvasTexture('plaque', 256, 128, {
      text: '見張りの城',
      draw: (c, w, h) => {
        c.fillStyle = P.sumi; c.fillRect(0, 0, w, h);
        c.strokeStyle = P.ochre; c.lineWidth = 6; c.strokeRect(8, 8, w - 16, h - 16);
        c.fillStyle = P.ochre; c.font = '800 54px "Shippori Mincho"'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('見張りの城', w / 2, h / 2 + 4);
      },
    }),
    []
  );
  return (
    <mesh {...p}>
      <planeGeometry args={[2.2, 1.1]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/** Puente de madera sobre el agua hasta el portón. */
export function Bridge({ from = 10.5, to = 40, ...p }) {
  const len = to - from;
  const posts = useMemo(() => Array.from({ length: Math.floor(len / 3) + 1 }, (_, i) => from + i * 3), [from, len]);
  return (
    <group {...p}>
      <Box args={[3.4, 0.35, len]} color={P.wood} wood position={[0, 0.7, from + len / 2]} />
      {posts.map((z) => (
        <group key={z}>
          {[-1.6, 1.6].map((x) => <Box key={x} args={[0.22, 1.5, 0.22]} color={P.woodDark} wood position={[x, 0.75, z]} />)}
        </group>
      ))}
      {[-1.6, 1.6].map((x) => <Box key={x} args={[0.16, 0.16, len]} color={P.woodDark} position={[x, 1.45, from + len / 2]} />)}
    </group>
  );
}
