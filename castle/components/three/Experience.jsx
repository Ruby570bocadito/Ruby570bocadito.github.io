'use client';
import { Suspense, lazy, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import { useStore } from '@/lib/store';

// Carga diferida: cada sala es su propio chunk.
const SCENES = {
  home: lazy(() => import('./HomeWorld')),
  about: lazy(() => import('./rooms/AboutRoom')),
  watchtower: lazy(() => import('./rooms/WatchtowerRoom')),
  dojo: lazy(() => import('./rooms/DojoRoom')),
  archive: lazy(() => import('./rooms/ArchiveRoom')),
  harbor: lazy(() => import('./rooms/HarborRoom')),
  kura: lazy(() => import('./rooms/KuraRoom')),
};

/** ?stats en la URL: registra llamadas de dibujo y triángulos (diagnóstico de rendimiento). */
function Stats() {
  const { gl, camera } = useThree();
  const t = useRef(0), frames = useRef(0);
  useFrame((_, dt) => {
    t.current += dt;
    frames.current++;
    if (t.current > 3) {
      console.info('[stats]', JSON.stringify({ fps: +(frames.current / t.current).toFixed(1), cam: camera.position.toArray().map((v) => +v.toFixed(2)), calls: gl.info.render.calls, tris: gl.info.render.triangles, geos: gl.info.memory.geometries, tex: gl.info.memory.textures }));
      t.current = 0; frames.current = 0;
    }
  });
  return null;
}

function Ready() {
  const n = useRef(0);
  useFrame(() => {
    if (++n.current === 3) useStore.setState({ sceneReady: true });
  });
  useEffect(() => () => useStore.setState({ sceneReady: false }), []);
  return null;
}

export default function Experience({ room }) {
  const Scene = SCENES[room] || SCENES.home;
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.6]}
        camera={{ fov: 50, near: 0.1, far: 900, position: [0, 5, 40] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor onDecline={() => useStore.setState({ lowPower: true })} />
        <AdaptiveDpr pixelated={false} />
        <Suspense fallback={null}>
          <Scene key={room} />
          <Ready key={'r' + room} />
          {typeof window !== 'undefined' && window.location.search.includes('stats') ? <Stats /> : null}
        </Suspense>
      </Canvas>
    </div>
  );
}
