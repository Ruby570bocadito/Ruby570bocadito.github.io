'use client';
import * as THREE from 'three';
import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';

const EASE = gsap.parseEase('power2.inOut');
import { Sky, Water, Layer, Pine, Sakura, Petals, StoneLantern, Box } from './kit';
import { Keep, Wall, Otemon, Bridge } from './Castle';
import { Engawa, NorenDoor, Kura, Pond, Avatar, Ninja, Cranes } from './Grounds';
import { canvasTexture, PALETTE as P } from './textures';
import { mountainSVG, cloudSVG, waveSVG } from './art';
import { useStore } from '@/lib/store';
import { pick } from '@/lib/i18n';
import { useNav } from '@/lib/nav';
import rooms from '@/content/rooms.json';

export const DOOR_Z = [-8, -16.5, -25, -33.5, -42];

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const introPos = new THREE.CatmullRomCurve3([V(-3, 5.5, 44), V(-1, 3.4, 22), V(0, 2.4, 12), V(0, 1.9, 6.2)]);
const introLook = new THREE.CatmullRomCurve3([V(5, 10, -20), V(0, 4, 4), V(0, 2.2, 0), V(0, 1.55, 0)]);
const walkPos = new THREE.CatmullRomCurve3([V(0, 1.9, 6.2), V(0.4, 2.3, 0), V(1.2, 2.5, -6), V(1.4, 2.5, -20), V(1.4, 2.5, -36), V(0.6, 2.5, -44), V(-0.6, 2.6, -48.5)]);

const AVATAR = V(0, 1.55, 0), KURA = V(-1, 3, -60);

export function enterCastle() {
  const s = useStore.getState();
  if (s.phase !== 'intro') return;
  useStore.setState({ phase: 'crossing' });
}

function CameraRig() {
  const { camera, pointer } = useThree();
  const phase = useStore((s) => s.phase);
  const cross = useRef({ u: 0, k: 0 });
  const smooth = useRef(useStore.getState().phase === 'walk' ? useStore.getState().walkT : 0);
  const look = useRef(new THREE.Vector3(5, 10, -20));
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), l: new THREE.Vector3(), t: new THREE.Vector3() }), []);
  const lastDoor = useRef(-2);

  useEffect(() => {
    if (phase === 'crossing') cross.current = { u: 0, k: 0 };
  }, [phase]);

  useFrame((_, dt) => {
    const s = useStore.getState();
    const { p, l, t } = tmp;
    if (s.phase === 'intro' || s.phase === 'crossing') {
      if (s.phase === 'crossing') {
        // cruce del portón: 3,6 s con easing power2.inOut de GSAP
        cross.current.k = Math.min(1, cross.current.k + Math.min(dt, 0.25) / 3.6);
        cross.current.u = EASE(cross.current.k);
        if (cross.current.k >= 1) { useStore.setState({ phase: 'walk' }); s.award('enter'); }
      }
      const u = s.phase === 'intro' ? 0 : cross.current.u;
      introPos.getPoint(u, p);
      introLook.getPoint(u, l);
      if (s.phase === 'intro') { p.x += pointer.x * 1.2; p.y += pointer.y * 0.6; }
    } else {
      smooth.current = THREE.MathUtils.damp(smooth.current, s.walkT, 4, dt);
      const k = smooth.current;
      walkPos.getPointAt(k, p);
      walkPos.getTangentAt(Math.min(k, 0.999), t);
      l.set(-6, 2.2, p.z + t.z * 9 - 2.5);
      // al principio mira al avatar; al final, al kura
      const a = THREE.MathUtils.smoothstep(k, 0, 0.08);
      l.lerpVectors(AVATAR, l, a);
      const b = THREE.MathUtils.smoothstep(k, 0.86, 1);
      l.lerp(KURA, b);
      // puerta cercana
      const door = DOOR_Z.findIndex((z) => z < p.z - 4 && z > p.z - 13);
      const near = k > 0.95 ? 5 : door;
      if (near !== lastDoor.current) { lastDoor.current = near; useStore.setState({ nearDoor: near }); }
      if (s.walkT > 0.96) s.award('patrol');
    }
    camera.position.lerp(p, 1 - Math.exp(-dt * 6));
    look.current.lerp(l, 1 - Math.exp(-dt * 6));
    camera.lookAt(look.current);
  });
  return null;
}

export default function HomeWorld() {
  const lang = useStore((s) => s.lang);
  const phase = useStore((s) => s.phase);
  const nearDoor = useStore((s) => s.nearDoor);
  const caught = useStore((s) => !!s.stamps.hunter);
  const nav = useNav();
  const tex = useMemo(() => ({
    mountain: canvasTexture('mountain', 1024, 512, { svg: mountainSVG }),
    cloudW: canvasTexture('cloudW', 1024, 180, { svg: cloudSVG(P.washi, 3) }),
    cloudO: canvasTexture('cloudO', 1024, 180, { svg: cloudSVG(P.ochre, 7) }),
    cloudW2: canvasTexture('cloudW2', 1024, 180, { svg: cloudSVG(P.washi, 11) }),
    wave: canvasTexture('wave', 1024, 256, { svg: waveSVG }),
  }), []);

  return (
    <>
      <fog attach="fog" args={[P.washi, 70, 260]} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[-30, 40, 30]} intensity={1.4} />
      <CameraRig />
      <Sky top={P.ai} mid={P.ochre} bottom={P.washi} midAt={0.62} />

      {/* fondo: monte, nubes en bandas y grullas */}
      <Layer map={tex.mountain} w={300} h={150} position={[-40, 50, -230]} />
      <Layer map={tex.cloudW} w={180} h={32} position={[-70, 22, -180]} />
      <Layer map={tex.cloudO} w={160} h={28} position={[80, 34, -170]} opacity={0.95} />
      <Layer map={tex.cloudW2} w={120} h={20} position={[30, 10, -120]} />
      <Layer map={tex.cloudO} w={90} h={15} position={[-50, 6, -90]} />
      <Layer map={tex.cloudW} w={70} h={11} position={[40, 52, -110]} />
      <Cranes count={5} y={30} z={-80} />

      {/* mar con olas estilizadas */}
      <Water size={[900, 900]} position={[0, 0, 0]} />
      {[[-26, 28, 28], [24, 26, 26], [-40, 50, 34], [42, 48, 34], [-14, 36, 20], [16, 38, 22]].map(([x, z, w], i) => (
        <Layer key={i} map={tex.wave} w={w} h={w / 4} position={[x, w / 9 - 0.6, z]} bob={0.4} bobSpeed={0.9} phase={i * 1.7} />
      ))}

      {/* recinto */}
      <Box args={[140, 0.6, 100]} color={P.washiDark} outline={0} position={[0, 0.3, -40]} />
      <Wall length={60} position={[-34, 0.6, 10]} />
      <Wall length={60} position={[34, 0.6, 10]} />
      <Wall length={90} position={[-62, 0.6, -40]} rotation-y={Math.PI / 2} />
      <Bridge from={10.5} to={46} />
      <Otemon position={[0, 0.6, 10]} open={phase !== 'intro'} onEnter={enterCastle} />
      <Keep position={[16, 0.6, -44]} scale={1.5} />
      <Pine position={[-14, 0.6, 4]} scale={1.6} seed={2} />
      <Pine position={[9, 0.6, 3]} scale={1.3} seed={5} />
      <Pine position={[24, 0.6, -14]} scale={1.8} seed={9} />
      <Pine position={[-20, 0.6, -30]} scale={2} seed={4} />

      {/* patio y pasarela */}
      <group position={[0, 0.6, 0]}>
        <Avatar position={[0, 0, 0]} />
        <Engawa from={-2} to={-50} />
        {rooms.slice(0, 5).map((r, i) => (
          <NorenDoor
            key={r.id}
            room={r}
            label={pick(r.label, lang)}
            active={nearDoor === i}
            position={[-7.45, 0.5, DOOR_Z[i]]}
            rotation-y={Math.PI / 2}
            onOpen={() => nav(r.path)}
          />
        ))}
        <Kura position={[-1, 0, -62]} onOpen={() => nav('/kura/')} />
        <Ninja position={[-8.6, 7.1, -29.4]} rotation-y={Math.PI / 2.6} caught={caught} onCaught={() => useStore.getState().award('hunter')} />
        <Pond position={[4.2, 0, -22]} />
        {[-4, -14, -30, -40, -48].map((z, i) => <StoneLantern key={z} position={[0.8 + (i % 2) * 0.6, 0, z]} />)}
        <Sakura position={[3.5, 0, -10]} scale={1.3} />
        <Sakura position={[6.5, 0, -32]} scale={1.5} />
        <Sakura position={[-3, 0, 2.5]} scale={1.1} />
        <Pine position={[8, 0, -16]} scale={1.2} seed={7} />
        <Pine position={[4, 0, -48]} scale={1.4} seed={12} />
        <Petals count={160} area={[14, 8, 60]} center={[1, 0, -24]} />
      </group>
    </>
  );
}
