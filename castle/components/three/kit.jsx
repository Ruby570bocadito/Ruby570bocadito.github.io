'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { toonRamp, woodTexture, paperTexture, PALETTE as P } from './textures';

/** Material toon de tintas planas (+ veta de madera o papel opcional). */
export function Toon({ color = P.washi, wood, paper, emissive, emissiveIntensity = 1, side, transparent, opacity }) {
  const map = useMemo(() => (wood ? woodTexture(typeof wood === 'number' ? wood : 3) : paper ? paperTexture() : null), [wood, paper]);
  return (
    <meshToonMaterial
      color={color}
      gradientMap={toonRamp()}
      map={map}
      emissive={emissive || '#000000'}
      emissiveIntensity={emissive ? emissiveIntensity : 0}
      side={side}
      transparent={transparent}
      opacity={opacity}
    />
  );
}

/** Malla con contorno negro sumi (casco invertido). */
export function Ink({ children, color, wood, paper, emissive, emissiveIntensity, outline = 2.4, side, ...props }) {
  return (
    <mesh {...props}>
      {children}
      <Toon color={color} wood={wood} paper={paper} emissive={emissive} emissiveIntensity={emissiveIntensity} side={side} />
      {outline ? <Outlines thickness={outline} color={P.sumi} angle={Math.PI} /> : null}
    </mesh>
  );
}

export const Box = ({ args = [1, 1, 1], ...p }) => <Ink {...p}><boxGeometry args={args} /></Ink>;

/** Tejado a cuatro aguas con alero curvado (pirámide truncada aplanada). */
export function Roof({ w = 4, d = 4, h = 1.4, color = P.ai, ...p }) {
  const geo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.2, 0.75, h, 4, 1, false, Math.PI / 4);
    g.scale(w, 1, d);
    // alero ligeramente levantado en las esquinas
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y < 0) {
        const x = pos.getX(i), z = pos.getZ(i);
        const corner = Math.abs(x) / (w * 0.53) * (Math.abs(z) / (d * 0.53));
        pos.setY(i, y + corner * h * 0.28);
      }
    }
    g.computeVertexNormals();
    return g;
  }, [w, d, h]);
  return <Ink geometry={geo} color={color} {...p} />;
}

/** Cielo con degradado bokashi y bandas horizontales. */
export function Sky({ top = P.ai, mid = P.ochre, bottom = P.washi, midAt = 0.55 }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: { top: { value: new THREE.Color(top) }, mid: { value: new THREE.Color(mid) }, bottom: { value: new THREE.Color(bottom) }, midAt: { value: midAt } },
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 mid; uniform vec3 bottom; uniform float midAt; varying vec3 vP;
          float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
          void main(){
            float y = clamp(vP.y * 1.6 + 0.08, 0.0, 1.0);
            float t = 1.0 - y;
            vec3 c = t < midAt ? mix(top, mid, smoothstep(0.0, midAt, t)) : mix(mid, bottom, smoothstep(midAt, 1.0, t));
            // bokashi impreso: pequeños escalones de tinta
            c = floor(c * 22.0 + h(gl_FragCoord.xy) * 0.6) / 22.0;
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [top, mid, bottom, midAt]
  );
  return (
    <mesh material={mat} renderOrder={-10}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}

/** Agua índigo con líneas de oleaje en tinta crema. */
export function Water({ size = [600, 600], position = [0, 0, 0], deep = P.aiDeep, light = P.aiSoft, lines = P.washi, speed = 1 }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { t: { value: 0 }, deep: { value: new THREE.Color(deep) }, light: { value: new THREE.Color(light) }, ln: { value: new THREE.Color(lines) } },
        vertexShader: `varying vec2 vW; varying float vD; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xz; vec4 mv = viewMatrix * w; vD = -mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `uniform float t; uniform vec3 deep; uniform vec3 light; uniform vec3 ln; varying vec2 vW; varying float vD;
          void main(){
            float k = smoothstep(20.0, 160.0, vD);
            vec3 c = mix(deep, light, k * 0.8);
            float wave = sin(vW.x * 0.35 + sin(vW.y * 0.25 + t * 0.6) * 1.6 + t * 0.4) * 0.5 + 0.5;
            float band = smoothstep(0.93, 0.97, fract(vW.y * 0.18 + wave * 0.35 + t * 0.05));
            float fade = 1.0 - smoothstep(30.0, 120.0, vD);
            c = mix(c, ln, band * 0.75 * fade);
            gl_FragColor = vec4(c, 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [deep, light, lines]
  );
  useFrame((_, dt) => (mat.uniforms.t.value += dt * speed));
  return (
    <mesh material={mat} rotation-x={-Math.PI / 2} position={position}>
      <planeGeometry args={size} />
    </mesh>
  );
}

/** Plano con textura (capa 2D del parallax). */
export function Layer({ map, w, h, opacity = 1, fog = false, bob = 0, bobSpeed = 1, phase = 0, children, ...p }) {
  const ref = useRef();
  const base = p.position ? p.position[1] : 0;
  useFrame(({ clock }) => {
    if (bob && ref.current) ref.current.position.y = base + Math.sin(clock.elapsedTime * bobSpeed + phase) * bob;
  });
  return (
    <mesh ref={ref} {...p}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={map} transparent opacity={opacity} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} alphaTest={0.02} fog={fog} />
      {children}
    </mesh>
  );
}

/** Pino estilo ukiyo-e: tronco torcido y almohadillas de agujas planas. */
export function Pine({ scale = 1, seed = 1, ...p }) {
  const pads = useMemo(() => {
    let s = seed * 7919;
    const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: 5 }, (_, i) => [(r() - 0.5) * 2.6, 2.2 + i * 0.75 + r() * 0.3, (r() - 0.5) * 1.6, 1 + r() * 0.7 - i * 0.12]);
  }, [seed]);
  return (
    <group scale={scale} {...p}>
      <Ink color={P.woodDark} position={[0, 1.6, 0]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.12, 0.28, 3.4, 6]} />
      </Ink>
      {pads.map(([x, y, z, r], i) => (
        <Ink key={i} color={i % 2 ? P.pine : P.pineDark} position={[x * 0.6, y, z * 0.6]} scale={[r * 1.3, r * 0.34, r]}>
          <sphereGeometry args={[1, 10, 6]} />
        </Ink>
      ))}
    </group>
  );
}

/** Cerezo de flor crema (washi) — sin rosa, fiel a la paleta. */
export function Sakura({ scale = 1, ...p }) {
  return (
    <group scale={scale} {...p}>
      <Ink color={P.woodDark} position={[0, 1.4, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.1, 0.25, 2.8, 6]} />
      </Ink>
      {[[0, 3.1, 0, 1.3], [-1, 2.7, 0.4, 0.9], [1, 2.8, -0.3, 1], [0.3, 3.6, 0.3, 0.8]].map(([x, y, z, r], i) => (
        <Ink key={i} color={i % 2 ? P.washi : '#f6ecdc'} position={[x, y, z]} scale={[r, r * 0.75, r]}>
          <icosahedronGeometry args={[1, 1]} />
        </Ink>
      ))}
    </group>
  );
}

/** Pétalos que caen (instanciados). */
export function Petals({ count = 140, area = [20, 10, 60], center = [0, 0, -25], color = P.washi }) {
  const ref = useRef();
  const data = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * area[0], y: Math.random() * area[1], z: (Math.random() - 0.5) * area[2],
        s: 0.3 + Math.random() * 0.6, r: Math.random() * 6, v: 0.3 + Math.random() * 0.5,
      })),
    [count, area]
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    data.forEach((d, i) => {
      d.y -= d.v * dt; d.r += dt * d.s * 2; d.x += Math.sin(d.r) * dt * 0.4;
      if (d.y < 0) d.y = area[1];
      dummy.position.set(center[0] + d.x, center[1] + d.y, center[2] + d.z);
      dummy.rotation.set(d.r, d.r * 0.7, 0);
      dummy.scale.setScalar(0.09);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[null, null, count]}>
      <circleGeometry args={[1, 5]} />
      <meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  );
}

/** Farolillo de papel (chōchin) con luz ocre. */
export function PaperLantern({ glow = 1.2, light = false, kanji, ...p }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = Math.sin(clock.elapsedTime * 1.2 + (p.position?.[2] || 0)) * 0.05;
  });
  return (
    <group ref={ref} {...p}>
      <Ink color={P.sumi} position={[0, 0.62, 0]} outline={0}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
      </Ink>
      <Ink color={P.washi} emissive={P.ochre} emissiveIntensity={glow} paper scale={[0.42, 0.55, 0.42]}>
        <sphereGeometry args={[1, 16, 12]} />
      </Ink>
      <Ink color={P.sumi} position={[0, -0.6, 0]} outline={0}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
      </Ink>
      {light ? <pointLight color={P.ochre} intensity={6} distance={7} decay={1.6} /> : null}
    </group>
  );
}

/** Linterna de piedra (tōrō). */
export function StoneLantern(p) {
  return (
    <group {...p}>
      <Box args={[0.7, 0.2, 0.7]} color={P.stone} position={[0, 0.1, 0]} />
      <Ink color={P.stone} position={[0, 0.7, 0]}><cylinderGeometry args={[0.12, 0.16, 1, 6]} /></Ink>
      <Box args={[0.7, 0.15, 0.7]} color={P.stone} position={[0, 1.25, 0]} />
      <Box args={[0.5, 0.5, 0.5]} color={P.washi} emissive={P.ochre} emissiveIntensity={0.9} position={[0, 1.57, 0]} />
      <Ink color={P.stone} position={[0, 2.0, 0]}><coneGeometry args={[0.62, 0.45, 6]} /></Ink>
      <Ink color={P.stone} position={[0, 2.3, 0]}><sphereGeometry args={[0.1, 8, 6]} /></Ink>
    </group>
  );
}
