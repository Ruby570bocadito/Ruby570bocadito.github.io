'use client';
import * as THREE from 'three';
import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Ink, Box, Sky, Water, PaperLantern, Layer } from '../kit';
import { canvasTexture, PALETTE as P } from '../textures';
import { mountainSVG } from '../art';
import { StaticCam } from './common';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { runChannel, CHANNELS } from '@/lib/channels';

function labelTex(text) {
  return canvasTexture('label-' + text, 512, 128, {
    text,
    draw: (c, w, h) => {
      c.fillStyle = '#8a6a43'; c.fillRect(6, 6, w - 12, h - 12);
      c.strokeStyle = P.sumi; c.lineWidth = 8; c.strokeRect(6, 6, w - 12, h - 12);
      c.fillStyle = P.washi; c.font = '800 54px "Shippori Mincho"'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(text, w / 2, h / 2 + 4);
    },
  });
}

function Label({ text, y = 1.6 }) {
  const tex = useMemo(() => labelTex(text), [text]);
  return (
    <mesh position={[0, y, 0]}>
      <planeGeometry args={[1.9, 0.48]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function PaperBoat({ ch, position, phase }) {
  const t = useT();
  const [hover, setHover] = useState(false);
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const e = clock.elapsedTime + phase;
    ref.current.position.y = position[1] + Math.sin(e * 1.4) * 0.08 + (hover ? 0.15 : 0);
    ref.current.rotation.z = Math.sin(e * 1.1) * 0.06;
    ref.current.rotation.x = Math.sin(e * 0.9) * 0.04;
  });
  const glow = hover ? { emissive: P.ochre, emissiveIntensity: 0.5 } : {};
  return (
    <group
      ref={ref}
      position={position}
      onClick={(e) => { e.stopPropagation(); runChannel(ch.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
    >
      <Ink color={P.washi} paper {...glow} rotation-y={Math.PI / 4} scale={[1.4, 1, 1.4]} position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.75, 0.38, 0.45, 4]} />
      </Ink>
      <Ink color={P.washi} paper {...glow} position={[0, 0.85, 0]} scale={[1.1, 1, 0.25]}>
        <coneGeometry args={[0.6, 1.0, 3]} />
      </Ink>
      {ch.id === 'message' ? <Box args={[0.5, 0.32, 0.04]} color={P.washi} position={[0, 0.8, 0.22]} rotation-z={0.2} /> : null}
      <Label text={t(ch.label)} y={2.0} />
    </group>
  );
}

function LanternPost({ ch, position }) {
  const t = useT();
  const [hover, setHover] = useState(false);
  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); runChannel(ch.id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
    >
      <Box args={[0.25, 3, 0.25]} color={P.woodDark} wood position={[0, 1.5, 0]} />
      <Box args={[1.2, 0.18, 0.2]} color={P.woodDark} position={[0.45, 3, 0]} />
      <PaperLantern position={[0.85, 2.3, 0]} light glow={hover ? 2.6 : 1.6} scale={0.9} />
      <Label text={t(ch.label)} y={3.75} />
    </group>
  );
}

export default function HarborRoom() {
  const mountain = useMemo(() => canvasTexture('mountain', 1024, 512, { svg: mountainSVG }), []);
  const moon = useMemo(() => canvasTexture('moon', 256, 256, {
    draw: (c) => { c.fillStyle = P.washi; c.beginPath(); c.arc(128, 128, 110, 0, 7); c.fill(); c.lineWidth = 8; c.strokeStyle = P.sumi; c.stroke(); },
  }), []);
  const boats = CHANNELS.filter((c) => c.kind === 'boat');
  const lanterns = CHANNELS.filter((c) => c.kind === 'lantern');
  return (
    <>
      <fog attach="fog" args={[P.aiDeep, 30, 180]} />
      <ambientLight intensity={0.9} color="#b9c6dd" />
      <directionalLight position={[-10, 20, -20]} intensity={0.7} color="#c9d4e8" />
      <Sky top="#0b1626" mid={P.ai} bottom={P.aiSoft} midAt={0.5} />
      <Layer map={moon} w={14} h={14} position={[30, 38, -150]} />
      <Layer map={mountain} w={240} h={120} position={[-60, 30, -200]} opacity={0.55} />
      <Water size={[600, 600]} deep="#0d1a2c" light={P.ai} lines={P.ochre} speed={0.6} />
      {/* muelle */}
      <Box args={[4, 0.4, 16]} color={P.wood} wood={3} position={[-3.5, 0.9, -2]} />
      {[-9, -5, -1, 3].map((z) => [-5.3, -1.7].map((x) => <Box key={x + '' + z} args={[0.3, 2.2, 0.3]} color={P.woodDark} position={[x, 0.2, z]} />))}
      {lanterns.map((ch, i) => <LanternPost key={ch.id} ch={ch} position={[-2.1, 1.1, -7 + i * 5]} />)}
      {boats.map((ch, i) => <PaperBoat key={ch.id} ch={ch} position={[1.4 + i * 2.8, 0.05, -3.5 - (i % 2) * 2.4]} phase={i * 1.3} />)}
      {/* farolillos flotantes de ambiente */}
      {[[8, -14], [12, -22], [-10, -18], [4, -28]].map(([x, z], i) => <PaperLantern key={i} position={[x, 0.5, z]} scale={0.5} glow={1.8} />)}
      <StaticCam pos={[2.5, 4.2, 9]} look={[2, 1.2, -4]} sway={0.9} />
    </>
  );
}
