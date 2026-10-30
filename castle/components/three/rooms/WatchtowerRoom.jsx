'use client';
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Ink, Box, Sky, Water, Roof, Layer } from '../kit';
import { canvasTexture, PALETTE as P } from '../textures';
import { cloudSVG } from '../art';
import { useStore } from '@/lib/store';
import { pick } from '@/lib/i18n';
import { sfx } from '@/lib/audio';
import projects from '@/content/projects.json';

const EMA = new THREE.Shape();
EMA.moveTo(-1, -0.8); EMA.lineTo(1, -0.8); EMA.lineTo(1, 0.45); EMA.lineTo(0, 0.95); EMA.lineTo(-1, 0.45); EMA.closePath();

function emaTexture(p, lang) {
  return canvasTexture(`ema-${p.id}-${lang}`, 512, 448, {
    text: p.kanji + p.name,
    draw: (c, w, h) => {
      const path = new Path2D(`M8 ${h - 8} L${w - 8} ${h - 8} L${w - 8} 128 L${w / 2} 8 L8 128 Z`);
      c.fillStyle = p.featured ? '#c9a46a' : '#b8925f'; c.fill(path);
      c.save(); c.clip(path);
      for (let i = 0; i < 40; i++) {
        c.strokeStyle = `rgba(70,45,20,${0.08 + (i % 5) * 0.03})`; c.lineWidth = 1 + (i % 3);
        c.beginPath(); c.moveTo(0, 20 + i * 11); c.bezierCurveTo(w * 0.3, 10 + i * 11 + (i % 4) * 4, w * 0.7, 30 + i * 11, w, 18 + i * 11); c.stroke();
      }
      // tejadillo pintado
      c.fillStyle = P.ai; c.beginPath(); c.moveTo(0, 128); c.lineTo(w / 2, 8); c.lineTo(w, 128); c.lineTo(w, 150); c.lineTo(w / 2, 34); c.lineTo(0, 150); c.fill();
      c.restore();
      c.lineWidth = 10; c.strokeStyle = P.sumi; c.stroke(path);
      c.fillStyle = P.sumi; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = '800 120px "Shippori Mincho"'; c.fillText(p.kanji, w / 2, 222);
      c.font = `800 ${p.name.length > 12 ? 40 : 50}px "Shippori Mincho"`; c.fillText(p.name, w / 2, 322);
      c.font = '500 22px "Inter", sans-serif'; c.fillStyle = '#3b2a17';
      const line = pick(p.tagline, lang);
      const words = line.split(' '); let l1 = '', l2 = '';
      words.forEach((wd) => ((l1 + wd).length < 36 && !l2 ? (l1 += wd + ' ') : (l2 += wd + ' ')));
      c.fillText(l1.trim(), w / 2, 372); c.fillText(l2.trim().slice(0, 40), w / 2, 400);
      if (p.featured) {
        c.save(); c.translate(w / 2, h - 18);
        c.fillStyle = P.ochre; c.fillRect(-w / 2 + 8, -26, w - 16, 26);
        c.fillStyle = P.sumi; c.font = '700 17px "Inter", sans-serif'; c.fillText(p.band.toUpperCase(), 0, -12);
        c.restore();
      }
    },
  });
}

function Ema({ p, angle, radius, dragging }) {
  const lang = useStore((s) => s.lang);
  const tex = useMemo(() => emaTexture(p, lang), [p, lang]);
  const [hover, setHover] = useState(false);
  const ref = useRef();
  const s = p.featured ? 1.45 : 1;
  useFrame(({ clock }, dt) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.3 + angle * 3) * 0.03;
    const k = THREE.MathUtils.damp(ref.current.scale.x, s * (hover ? 1.08 : 1), 8, dt);
    ref.current.scale.setScalar(k);
  });
  const x = Math.sin(angle) * radius, z = -Math.cos(angle) * radius;
  return (
    <group position={[x, 0, z]} rotation-y={-angle}>
      {/* cordón ocre */}
      <mesh position={[0, 3.55, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.9, 4]} />
        <meshBasicMaterial color={P.ochre} />
      </mesh>
      <group
        ref={ref}
        position={[0, 2.3, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (dragging.current > 6) return;
          sfx('wood');
          useStore.setState({ project: p.id });
          useStore.getState().award('analyze');
        }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
      >
        <Ink color={P.wood} wood={8} position={[0, 0, -0.06]} scale={[0.8, 0.8, 1]}>
          <extrudeGeometry args={[EMA, { depth: 0.08, bevelEnabled: false }]} />
        </Ink>
        <mesh position={[0, 0.06, 0.04]} scale={[0.8, 0.8, 1]}>
          <planeGeometry args={[2, 1.75]} />
          <meshBasicMaterial map={tex} transparent alphaTest={0.05} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export default function WatchtowerRoom() {
  const { camera, gl } = useThree();
  const yaw = useRef(0), target = useRef(0), dragging = useRef(0);
  const cloud = useMemo(() => canvasTexture('cloudW', 1024, 180, { svg: cloudSVG(P.washi, 3) }), []);
  const list = useMemo(() => [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)), []);
  // FriendlyPear al frente y el resto alternando a izquierda y derecha
  const angles = useMemo(() => list.map((_, i) => (i === 0 ? 0 : (Math.ceil(i / 2) * (i % 2 ? 1 : -1)) * 0.52)), [list]);
  const R = 5.2;

  useEffect(() => {
    const el = gl.domElement;
    let down = false, sx = 0, start = 0;
    const d = (e) => { down = true; sx = e.clientX; start = target.current; dragging.current = 0; };
    const m = (e) => {
      if (!down) return;
      const dx = e.clientX - sx;
      dragging.current = Math.abs(dx);
      target.current = THREE.MathUtils.clamp(start - dx * 0.005, -1.9, 1.9);
    };
    const u = () => { down = false; setTimeout(() => (dragging.current = 0), 30); };
    const k = (e) => {
      if (e.key === 'ArrowLeft') target.current = Math.max(-1.9, target.current - 0.52);
      if (e.key === 'ArrowRight') target.current = Math.min(1.9, target.current + 0.52);
    };
    el.addEventListener('pointerdown', d);
    window.addEventListener('pointermove', m);
    window.addEventListener('pointerup', u);
    window.addEventListener('keydown', k);
    return () => {
      el.removeEventListener('pointerdown', d);
      window.removeEventListener('pointermove', m);
      window.removeEventListener('pointerup', u);
      window.removeEventListener('keydown', k);
    };
  }, [gl]);

  useFrame((_, dt) => {
    yaw.current = THREE.MathUtils.damp(yaw.current, target.current, 5, dt);
    camera.position.set(Math.sin(yaw.current) * 0.5, 2.4, Math.cos(yaw.current) * 0.5 + 0.5);
    camera.lookAt(Math.sin(yaw.current) * 6, 2.1, -Math.cos(yaw.current) * 6);
  });

  return (
    <>
      <fog attach="fog" args={[P.washi, 30, 300]} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[6, 10, 4]} intensity={1.2} />
      <Sky top={P.ai} mid={P.ochre} bottom={P.washi} midAt={0.66} />
      <Water size={[900, 900]} position={[0, -30, 0]} />
      <Layer map={cloud} w={160} h={28} position={[-30, -6, -140]} />
      <Layer map={cloud} w={120} h={20} position={[80, 4, -100]} rotation-y={-0.6} />
      {/* suelo y muro curvo de la torre con vanos */}
      <Ink color={P.wood} wood={4} position={[0, -0.1, 0]}><cylinderGeometry args={[R + 1.5, R + 1.5, 0.2, 24]} /></Ink>
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return (
          <group key={i} rotation-y={-a}>
            <Box args={[0.45, 5.2, 0.45]} color={P.woodDark} wood position={[0, 2.6, -R - 0.8]} />
            <Box args={[2.4, 0.9, 0.2]} color={P.wood} wood={i} position={[0, 0.45, -R - 0.8]} />
            <Box args={[2.4, 0.5, 0.25]} color={P.woodDark} wood position={[0, 4.95, -R - 0.8]} />
          </group>
        );
      })}
      <Roof w={17} d={17} h={2.6} color={P.ai} position={[0, 6.6, 0]} />
      {/* barra de la que cuelgan las tablillas */}
      <Ink color={P.woodDark} position={[0, 4.0, 0]} rotation-x={Math.PI / 2}><torusGeometry args={[R, 0.06, 6, 48]} /></Ink>
      {list.map((p, i) => <Ema key={p.id} p={p} angle={angles[i]} radius={R} dragging={dragging} />)}
    </>
  );
}
