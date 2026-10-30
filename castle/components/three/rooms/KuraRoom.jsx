'use client';
import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { Ink, Box, PaperLantern, TileRoof, toon } from '../kit';
import { canvasTexture, plankTexture, woodTexture, namakoTexture, crestTexture, PALETTE as P } from '../textures';
import { MBox } from '../Castle';
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

/** Cofre nagamochi con herrajes de hierro, asas de cuerda y tapa que se entreabre. */
function Chest({ item, x }) {
  const [hover, setHover] = useState(false);
  const lid = useRef();
  const tex = useMemo(() => plate(item), [item]);
  useFrame((_, dt) => {
    if (lid.current) lid.current.rotation.x = THREE.MathUtils.damp(lid.current.rotation.x, hover ? -0.75 : 0, 6, dt);
  });
  return (
    <group
      position={[x, 0, -5.5]}
      onClick={(e) => { e.stopPropagation(); sfx('wood'); useStore.setState({ kuraItem: item.id }); }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
    >
      {[-0.85, 0.85].map((fx) => <Box key={fx} args={[0.3, 0.22, 1.5]} color={P.sumi} outline={1.2} position={[fx, 0.11, 0]} />)}
      <Box args={[2.3, 1.25, 1.4]} color="#6b4a2a" wood={x + 10} position={[0, 0.85, 0]} />
      {/* herrajes de esquina */}
      {[-1, 1].map((sx) => [-1, 1].map((sz) => (
        <Box key={sx + ':' + sz} args={[0.24, 1.28, 0.24]} color={P.sumi} outline={0} position={[sx * 1.06, 0.85, sz * 0.61]} />
      )))}
      {[0.5, 1.25].map((y) => <Box key={y} args={[2.34, 0.08, 1.44]} color={P.sumi} outline={0} position={[0, y, 0]} />)}
      {/* asas de cuerda */}
      {[-1, 1].map((sx) => (
        <Ink key={sx} color={P.ochre} outline={1} position={[sx * 1.2, 1.0, 0]} rotation-y={Math.PI / 2}><torusGeometry args={[0.14, 0.035, 6, 14, Math.PI]} /></Ink>
      ))}
      <group ref={lid} position={[0, 1.48, -0.72]}>
        <Box args={[2.42, 0.3, 1.5]} color="#7a5a36" wood={x + 3} position={[0, 0.15, 0.72]} emissive={hover ? P.ochre : undefined} emissiveIntensity={0.35} />
        <Box args={[2.46, 0.08, 1.54]} color={P.sumi} outline={0} position={[0, 0.02, 0.72]} />
        <Box args={[0.34, 0.24, 0.08]} color={P.ochre} outline={1} position={[0, 0.0, 1.49]} />
      </group>
      {hover ? <pointLight position={[0, 1.8, 0.4]} color={P.ochre} intensity={6} distance={4} /> : null}
      <mesh position={[0, 0.85, 0.72]}>
        <planeGeometry args={[1.6, 0.5]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Estanterías laterales con cajas de madera atadas (instanciadas). */
function Shelves({ x, flip = 1 }) {
  const boxes = useRef();
  const data = useMemo(() => {
    const out = [];
    let s = 11 + x;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    [0.75, 2.55, 4.35].forEach((y) => {
      let z = -8.6;
      while (z < -1) {
        const w = 0.7 + r() * 0.7, h = 0.5 + r() * 0.8;
        if (r() > 0.2) out.push({ p: [x - flip * 0.05, y + h / 2 + 0.1, z + w / 2], s: [0.9, h, w] });
        z += w + 0.12;
      }
    });
    return out;
  }, [x, flip]);
  const geo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const mat = useMemo(() => toon('#8a6a43', { map: woodTexture(14) }), []);
  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    data.forEach((d, i) => { o.position.set(...d.p); o.scale.set(...d.s); o.updateMatrix(); boxes.current.setMatrixAt(i, o.matrix); });
    boxes.current.instanceMatrix.needsUpdate = true;
  }, [data]);
  return (
    <group>
      {[0.75, 2.55, 4.35].map((y) => <Box key={y} args={[1.2, 0.12, 8]} color={P.woodDark} wood position={[x, y, -5]} />)}
      {[-8.8, -5, -1.2].map((z) => <Box key={z} args={[1.2, 5.2, 0.14]} color={P.woodDark} position={[x, 2.6, z]} />)}
      <instancedMesh ref={boxes} args={[geo, mat, data.length]} frustumCulled={false}>
        <Outlines thickness={1.4} color={P.sumi} />
      </instancedMesh>
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
  const mats = useMemo(() => {
    const floor = toon('#6b4a2a', { map: plankTexture(10), repeat: [7, 4] });
    const side = toon(P.woodDark);
    const nam = toon('#ffffff', { map: namakoTexture(), repeat: [4, 1.4] });
    const dark = toon('#2f323a');
    return { floor: [side, side, floor, side, side, side], namako: [dark, dark, dark, dark, nam, nam], wall: toon('#4a3522', { map: plankTexture(11), repeat: [6, 2] }) };
  }, []);
  const crest = useMemo(() => crestTexture(P.sumi), []);

  useFrame((_, dt) => {
    const k = open ? 1 : 0;
    if (doorL.current) {
      doorL.current.position.x = THREE.MathUtils.damp(doorL.current.position.x, -1.5 - k * 2.9, 3, dt);
      doorR.current.position.x = THREE.MathUtils.damp(doorR.current.position.x, 1.5 + k * 2.9, 3, dt);
    }
    if (lock.current) {
      lock.current.rotation.z = THREE.MathUtils.damp(lock.current.rotation.z, k * 1.6, 4, dt);
      lock.current.position.y = THREE.MathUtils.damp(lock.current.position.y, open ? -0.5 : 2.6, 2, dt);
      lock.current.visible = lock.current.position.y > 0;
    }
    pos.set(0, open ? 3.2 : 3, open ? 0.6 : 13);
    look.set(0, open ? 0.9 : 3, open ? -5.5 : 0);
    camera.position.lerp(pos, 1 - Math.exp(-dt * 2.5));
    camera.lookAt(look);
  });

  return (
    <>
      <color attach="background" args={['#120d08']} />
      <fog attach="fog" args={['#120d08', 9, 30]} />
      <ambientLight intensity={open ? 1.0 : 0.65} />
      <directionalLight position={[0, 8, 10]} intensity={0.9} />
      <pointLight position={[0, 3.5, -4.5]} color={P.ochre} intensity={open ? 14 : 0} distance={12} />
      {/* interior */}
      <MBox args={[14, 0.2, 12]} mats={mats.floor} position={[0, -0.1, -4]} />
      <mesh material={mats.wall} position={[0, 3, -9.5]}><boxGeometry args={[14, 6, 0.3]} /></mesh>
      <mesh material={mats.wall} position={[-6.8, 3, -4]}><boxGeometry args={[0.3, 6, 11]} /></mesh>
      <mesh material={mats.wall} position={[6.8, 3, -4]}><boxGeometry args={[0.3, 6, 11]} /></mesh>
      {[-8, -4.5, -1].map((z) => <Box key={z} args={[14, 0.45, 0.45]} color={P.woodDark} wood position={[0, 5.6, z]} />)}
      <Box args={[0.5, 0.5, 11]} color={P.woodDark} wood position={[0, 5.9, -4]} />
      <Shelves x={-6.0} flip={1} />
      <Shelves x={6.0} flip={-1} />
      {offensive.items.map((it, i) => <Chest key={it.id} item={it} x={(i - 1.5) * 2.75} />)}
      <PaperLantern position={[-3.8, 4.4, -7]} light glow={1.2} mark="蔵" />
      <PaperLantern position={[3.8, 4.4, -7]} light glow={1.2} mark="蔵" />
      {/* fachada: enlucido, muro namako y puertas gruesas */}
      <group position={[0, 0, 1.5]}>
        <Box args={[6.4, 7, 0.6]} color={P.plaster} paper position={[-6.5, 3.5, 0]} />
        <Box args={[6.4, 7, 0.6]} color={P.plaster} paper position={[6.5, 3.5, 0]} />
        <Box args={[6.2, 1.6, 0.6]} color={P.plaster} paper position={[0, 6.2, 0]} />
        <MBox args={[6.4, 2.4, 0.7]} mats={mats.namako} position={[-6.5, 1.2, 0.02]} />
        <MBox args={[6.4, 2.4, 0.7]} mats={mats.namako} position={[6.5, 1.2, 0.02]} />
        <Box args={[19.6, 0.3, 0.8]} color={P.plaster} paper position={[0, 2.5, 0.05]} />
        <TileRoof w={10.4} d={2.2} h={1.8} tw={8.6} td={0.07} wi={9.8} di={0.4} lift={0.4} position={[0, 7.0, -0.4]} />
        <mesh position={[4.9, 5.1, 0.32]}>
          <circleGeometry args={[0.7, 32]} />
          <meshBasicMaterial map={crest} transparent toneMapped={false} />
        </mesh>
        <group ref={doorL} position={[-1.5, 0, 0.45]}>
          <Box args={[3, 5.4, 0.5]} color={P.plaster} paper position={[0, 2.7, 0]} />
          {[1.0, 2.7, 4.4].map((y) => <Box key={y} args={[3, 0.18, 0.56]} color={P.sumi} outline={0} position={[0, y, 0]} />)}
        </group>
        <group ref={doorR} position={[1.5, 0, 0.45]}>
          <Box args={[3, 5.4, 0.5]} color={P.plaster} paper position={[0, 2.7, 0]} />
          {[1.0, 2.7, 4.4].map((y) => <Box key={y} args={[3, 0.18, 0.56]} color={P.sumi} outline={0} position={[0, y, 0]} />)}
        </group>
        <group
          ref={lock}
          position={[0, 2.6, 0.85]}
          onClick={(e) => { e.stopPropagation(); if (!open) { sfx('wood'); useStore.setState({ kuraOpen: true }); } }}
          onPointerOver={(e) => { e.stopPropagation(); setLockHover(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { setLockHover(false); document.body.style.cursor = ''; }}
        >
          <Box args={[0.95, 0.72, 0.3]} color={P.ochre} emissive={lockHover ? P.ochre : undefined} emissiveIntensity={0.6} />
          <Ink color={P.ochre} position={[0, 0.45, 0]}><torusGeometry args={[0.3, 0.07, 8, 16, Math.PI]} /></Ink>
          <Box args={[0.08, 0.26, 0.05]} color={P.sumi} outline={0} position={[0, -0.02, 0.17]} />
          <Ink color={P.sumi} position={[0, 0.12, 0.17]} rotation-x={Math.PI / 2} outline={0}><cylinderGeometry args={[0.07, 0.07, 0.04, 10]} /></Ink>
        </group>
      </group>
    </>
  );
}
