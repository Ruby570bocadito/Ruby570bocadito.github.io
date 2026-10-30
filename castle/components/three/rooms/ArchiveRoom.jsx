'use client';
import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { Ink, Box, PaperLantern, toon } from '../kit';
import { canvasTexture, plankTexture, woodTexture, PALETTE as P } from '../textures';
import { MBox } from '../Castle';
import { StaticCam, Kakejiku } from './common';
import { useStore } from '@/lib/store';
import { sfx } from '@/lib/audio';
import certs from '@/content/certs.json';

const TAG = { obtained: P.pine, preparing: P.ochre, course: P.ai };
const COLS = 4, CW = 2.6, ROWS = 2, RH = 3;
const cellX = (c) => -3.9 + c * CW;
const cellY = (r) => 5.1 - r * RH;

/** Etiqueta colgante (tanzaku) con el sello de estado y el nombre. */
function tagTexture(item) {
  const st = certs.statuses[item.status];
  const seal = item.seal || st.seal;
  const name = item.title.split(' —')[0];
  return canvasTexture('tag-' + item.id, 160, 420, {
    text: seal + name,
    draw: (x, w, h) => {
      x.fillStyle = '#f4ecdb'; x.fillRect(0, 0, w, h);
      x.strokeStyle = '#1A1A1A'; x.lineWidth = 6; x.strokeRect(3, 3, w - 6, h - 6);
      x.fillStyle = '#C8402A'; x.fillRect(w / 2 - 50, 22, 100, 34 + seal.length * 42);
      x.fillStyle = '#F2E8D5'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = '800 40px "Shippori Mincho"';
      [...seal].forEach((ch, i) => x.fillText(ch, w / 2, 58 + i * 42));
      x.fillStyle = '#1A1A1A';
      x.save(); x.translate(w / 2, 90 + seal.length * 42 + 10); x.rotate(Math.PI / 2);
      x.font = `700 ${name.length > 14 ? 26 : 32}px "Inter", sans-serif`; x.textAlign = 'left';
      x.fillText(name, 0, 0);
      x.restore();
    },
  });
}

function Scroll({ item, pos }) {
  const [hover, setHover] = useState(false);
  const ref = useRef();
  const tag = useMemo(() => tagTexture(item), [item]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.position.z = THREE.MathUtils.damp(ref.current.position.z, hover ? 0.75 : 0, 8, dt);
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
          <cylinderGeometry args={[0.3, 0.3, 1.7, 18]} />
        </Ink>
        <Ink color={color} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.31, 0.31, 0.22, 18]} /></Ink>
        {[-0.95, 0.95].map((x) => (
          <Ink key={x} color={P.sumi} position={[x, 0, 0]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.13, 0.13, 0.22, 10]} /></Ink>
        ))}
        {/* cordón y etiqueta legible */}
        <mesh position={[0.45, -0.42, 0.3]}><cylinderGeometry args={[0.012, 0.012, 0.3, 4]} /><meshBasicMaterial color={P.ochre} /></mesh>
        <mesh position={[0.45, -0.98, 0.31]}>
          <planeGeometry args={[0.32, 0.84]} />
          <meshBasicMaterial map={tag} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Pergaminos de relleno apilados en cada casilla (instanciados). */
function ScrollPiles({ cells }) {
  const body = useRef(), caps = useRef();
  const data = useMemo(() => {
    const out = [];
    let s = 7;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    cells.forEach(([cx, cy]) => {
      for (let row = 0; row < 3; row++) for (let k = 0; k < 4 - row; k++) {
        const rad = 0.17 + r() * 0.05;
        out.push({ x: cx - 0.75 + k * 0.42 + row * 0.2 + (r() - 0.5) * 0.06, y: cy - 1.41 + rad + row * 0.36, z: -0.35 - r() * 0.2, rad, len: 0.9 + r() * 0.5, cap: ['#1F3A5F', '#4A6B4F', '#D9A441', '#1A1A1A', '#5e4429'][Math.floor(r() * 5)] });
      }
    });
    return out;
  }, [cells]);
  const geo = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 12), []);
  const paper = useMemo(() => toon(P.washi), []);
  const capMat = useMemo(() => toon('#ffffff'), []);
  useLayoutEffect(() => {
    const o = new THREE.Object3D(), c = new THREE.Color();
    data.forEach((d, i) => {
      o.position.set(d.x, d.y, d.z); o.rotation.set(Math.PI / 2, 0, 0); o.scale.set(d.rad, d.len, d.rad); o.updateMatrix();
      body.current.setMatrixAt(i, o.matrix);
      [-1, 1].forEach((k, j) => {
        o.scale.set(d.rad * 1.08, 0.07, d.rad * 1.08); o.position.set(d.x, d.y, d.z + (k * d.len) / 2); o.updateMatrix();
        caps.current.setMatrixAt(i * 2 + j, o.matrix);
        caps.current.setColorAt(i * 2 + j, c.set(d.cap));
      });
    });
    body.current.instanceMatrix.needsUpdate = true;
    caps.current.instanceMatrix.needsUpdate = true;
    if (caps.current.instanceColor) caps.current.instanceColor.needsUpdate = true;
  }, [data]);
  return (
    <>
      <instancedMesh ref={caps} args={[geo, capMat, data.length * 2]} frustumCulled={false} />
      <instancedMesh ref={body} args={[geo, paper, data.length]} frustumCulled={false}>
        <Outlines thickness={1.4} color={P.sumi} />
      </instancedMesh>
    </>
  );
}

export default function ArchiveRoom() {
  const items = [...certs.items, ...certs.achievements];
  const cells = useMemo(() => Array.from({ length: COLS * ROWS }, (_, i) => [cellX(i % COLS), cellY(Math.floor(i / COLS))]), []);
  const mats = useMemo(() => {
    const floor = toon(P.wood, { map: plankTexture(6), repeat: [9, 3] });
    const side = toon(P.woodDark);
    return { floor: [side, side, floor, side, side, side], back: toon('#3a2a1a', { map: woodTexture(12) }) };
  }, []);
  return (
    <>
      <color attach="background" args={[P.washiDark]} />
      <ambientLight intensity={1.55} />
      <directionalLight position={[2, 8, 8]} intensity={1.2} />
      {/* sala */}
      <MBox args={[18, 0.3, 12]} mats={mats.floor} position={[0, -0.15, 0]} />
      <Box args={[18, 8, 0.3]} color={P.plaster} paper position={[0, 4, -6]} />
      <Box args={[0.3, 8, 12]} color={P.plaster} paper position={[-9, 4, 0]} />
      <Box args={[0.3, 8, 12]} color={P.plaster} paper position={[9, 4, 0]} />
      {[-8.6, -6.2, 6.2, 8.6].map((x) => <Box key={x} args={[0.4, 8, 0.4]} color={P.woodDark} wood position={[x, 4, -5.7]} />)}
      <Box args={[18, 0.5, 0.5]} color={P.woodDark} wood position={[0, 7.75, -5.7]} />
      {/* estantería de casillas */}
      <group position={[0, 0, -4.6]}>
        <mesh material={mats.back} position={[0, 3.6, -1.0]}><boxGeometry args={[10.6, 6.2, 0.2]} /></mesh>
        {[-5.2, -2.6, 0, 2.6, 5.2].map((x) => <Box key={x} args={[0.2, 6.4, 1.6]} color={P.woodDark} wood position={[x, 3.6, -0.25]} />)}
        {[6.6, 3.6, 0.6].map((y) => <Box key={y} args={[10.8, 0.18, 1.7]} color={P.wood} wood position={[0, y, -0.2]} />)}
        <ScrollPiles cells={cells.map(([x, y]) => [x, y])} />
        {items.map((it, i) => <Scroll key={it.id} item={it} pos={[cellX(i % COLS), cellY(Math.floor(i / COLS)) - 0.1, 0.62]} />)}
        <Box args={[11.4, 0.4, 1.9]} color={P.woodDark} wood position={[0, 6.85, -0.2]} />
        <Box args={[11.4, 0.6, 1.9]} color={P.woodDark} wood position={[0, 0.3, -0.2]} />
      </group>
      <Kakejiku text="巻物庫" position={[-7.5, 4.1, -5.65]} w={1.2} h={3.8} />
      <Kakejiku text="継続" sub="学" position={[7.5, 4.1, -5.65]} w={1.2} h={3.8} />
      <PaperLantern position={[-5.4, 6.4, -2]} light glow={1.4} mark="巻" />
      <PaperLantern position={[5.4, 6.4, -2]} light glow={1.4} mark="巻" />
      {/* atril con un pergamino abierto */}
      <group position={[0, 0, 2.6]}>
        <Box args={[3.2, 0.12, 1.2]} color={P.sumi} position={[0, 0.82, 0]} />
        {[-1.4, 1.4].map((x) => <Box key={x} args={[0.12, 0.8, 1.0]} color={P.sumi} position={[x, 0.4, 0]} />)}
        <Box args={[2.2, 0.03, 0.8]} color={P.washi} paper position={[0, 0.9, 0]} />
        {[-1.15, 1.15].map((x) => <Ink key={x} color={P.woodDark} position={[x, 0.95, 0]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.06, 0.06, 0.9, 8]} /></Ink>)}
      </group>
      <StaticCam pos={[0, 3.8, 8.4]} look={[0, 3.4, -5]} sway={0.9} />
    </>
  );
}
