'use client';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ink, Box, Roof, PaperLantern } from './kit';
import { canvasTexture, PALETTE as P } from './textures';
import { avatarSVG, armSVG, ninjaSVG, craneSVG } from './art';

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
export function NorenDoor({ room, label, onOpen, active, ...p }) {
  const [hover, setHover] = useState(false);
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
      {[-0.75, 0, 0.75].map((x) => <Box key={x} args={[0.06, 4, 0.06]} color={P.woodDark} outline={0} position={[x, 2, -0.08]} />)}
      {[0.8, 1.6, 2.4, 3.2].map((y) => <Box key={y} args={[3.05, 0.06, 0.06]} color={P.woodDark} outline={0} position={[0, y, -0.08]} />)}
      <group ref={cloth} position={[0, 4.0, 0.18]}>
        <mesh position={[0, -1.25, 0]}>
          <planeGeometry args={[3.2, 2.5 * 1.25]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} side={THREE.DoubleSide} alphaTest={0.05} />
        </mesh>
      </group>
    </group>
  );
}

/** Edificio largo con pasarela (engawa) y puertas. */
export function Engawa({ from = -2, to = -50 }) {
  const len = from - to;
  const mid = (from + to) / 2;
  const posts = useMemo(() => Array.from({ length: Math.floor(len / 4) + 1 }, (_, i) => from - i * 4), [from, len]);
  return (
    <group>
      {/* suelo de la pasarela */}
      <Box args={[3.4, 0.5, len]} color={P.wood} wood={2} position={[-5.9, 0.25, mid]} />
      {/* edificio */}
      <Box args={[4, 5.2, len]} color={P.plaster} paper position={[-9.6, 2.6, mid]} />
      <Box args={[0.2, 0.4, len]} color={P.woodDark} wood position={[-7.55, 4.6, mid]} />
      {posts.map((z) => (
        <group key={z}>
          <Box args={[0.3, 5.2, 0.3]} color={P.woodDark} wood position={[-4.35, 2.6, z]} />
          <PaperLantern position={[-4.35, 4.2, z - 2]} scale={0.7} glow={1.1} />
        </group>
      ))}
      {/* ventanas shōji entre puertas */}
      {[-3.5, -12.2, -20.7, -29.2, -37.7, -46.2].map((z) => (
        <group key={z} position={[-7.56, 2.4, z]}>
          <Box args={[0.12, 1.8, 2.4]} color={P.washi} paper />
          {[-0.6, 0, 0.6].map((dz) => <Box key={dz} args={[0.14, 1.8, 0.06]} color={P.woodDark} outline={0} position={[0, 0, dz]} />)}
          {[-0.45, 0.15].map((dy) => <Box key={dy} args={[0.14, 0.06, 2.4]} color={P.woodDark} outline={0} position={[0, dy, 0]} />)}
        </group>
      ))}
      {/* tejado */}
      <Ink color={P.ai} position={[-8, 6.0, mid]} rotation-x={Math.PI / 2} scale={[1, 1, 0.42]}>
        <cylinderGeometry args={[4.9, 4.9, len + 2, 3, 1, false, Math.PI / 2]} />
      </Ink>
    </group>
  );
}

/** Kura: almacén cerrado con llave al fondo. */
export function Kura({ onOpen, ...p }) {
  const [hover, setHover] = useState(false);
  return (
    <group {...p} onClick={(e) => { e.stopPropagation(); onOpen?.(); }} {...hoverable(setHover)}>
      <Box args={[7, 0.8, 6]} color={P.stone} position={[0, 0.4, 0]} />
      <Box args={[6.2, 5, 5.2]} color={P.plaster} paper position={[0, 3.3, 0]} />
      {/* muro namako: sumi con retícula crema */}
      <Box args={[6.3, 2, 5.3]} color={P.sumi} position={[0, 1.8, 0]} />
      {Array.from({ length: 7 }, (_, i) => (
        <Box key={i} args={[0.08, 2.6, 0.02]} color={P.washi} outline={0} rotation-z={Math.PI / 4} position={[-2.7 + i * 0.9, 1.8, 2.67]} />
      ))}
      <Roof w={8} d={7} h={2} color={P.ai} position={[0, 6.6, 0]} />
      <Box args={[2.4, 3.2, 0.3]} color={P.woodDark} wood emissive={hover ? P.ochre : undefined} emissiveIntensity={0.3} position={[0, 2.4, 2.7]} />
      <Box args={[2.8, 0.3, 0.4]} color={P.sumi} position={[0, 4.1, 2.75]} />
      <Ink color={P.ochre} emissive={hover ? P.ochre : undefined} emissiveIntensity={0.4} position={[0, 2.4, 2.95]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.32, 0.09, 8, 16]} />
      </Ink>
      <Box args={[0.6, 0.5, 0.2]} color={P.ochre} position={[0, 2.0, 2.95]} />
      <KuraSign position={[0, 5.0, 2.72]} />
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
      <circleGeometry args={[0.8, 32]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

/** Estanque con kois (sin rojo: ocre, crema y sumi). */
export function Pond(p) {
  const kois = useRef([]);
  const fish = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ r: 1.2 + (i % 3) * 0.9, s: 0.25 + Math.random() * 0.3, ph: i * 1.1, c: i % 3 === 0 ? P.ochre : i % 3 === 1 ? P.washi : '#e9b866' })), []);
  useFrame(({ clock }) => {
    fish.forEach((f, i) => {
      const k = kois.current[i];
      if (!k) return;
      const a = clock.elapsedTime * f.s + f.ph;
      k.position.set(Math.cos(a) * f.r, 0.12, Math.sin(a) * f.r * 0.7);
      k.rotation.y = -a;
    });
  });
  return (
    <group {...p}>
      <Ink color={P.ai} position={[0, 0.05, 0]} scale={[1, 1, 0.7]} outline={2}>
        <cylinderGeometry args={[4.2, 4.2, 0.1, 32]} />
      </Ink>
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <Ink key={i} color={P.stone} position={[Math.cos(a) * 4.4, 0.2, Math.sin(a) * 3.1]} scale={[0.6, 0.35, 0.5]}><dodecahedronGeometry args={[0.8, 0]} /></Ink>;
      })}
      {fish.map((f, i) => (
        <group key={i} ref={(el) => (kois.current[i] = el)}>
          <Ink color={f.c} outline={1.5} scale={[0.14, 0.08, 0.5]}><sphereGeometry args={[1, 10, 8]} /></Ink>
          <Ink color={P.sumi} outline={0} position={[0, 0.05, 0.12]} scale={[0.07, 0.05, 0.1]}><sphereGeometry args={[1, 6, 6]} /></Ink>
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
