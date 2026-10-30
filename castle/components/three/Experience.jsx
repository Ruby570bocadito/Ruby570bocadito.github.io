'use client';
import { Suspense, lazy, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
        </Suspense>
      </Canvas>
    </div>
  );
}
