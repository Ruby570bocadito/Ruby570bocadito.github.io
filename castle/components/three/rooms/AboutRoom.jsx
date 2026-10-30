'use client';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Ink, Box } from '../kit';
import { canvasTexture, PALETTE as P } from '../textures';
import { scrollSceneSVG } from '../art';
import { useStore } from '@/lib/store';
import { pick } from '@/lib/i18n';
import story from '@/content/story.json';

export const PANEL_W = 8, PANEL_H = 4;

/** Paneles del emakimono: 5 escenas + Cómo aprendo + IA. */
export function usePanels(lang) {
  return useMemo(() => {
    const scenes = story.scenes.map((s) =>
      canvasTexture(`scroll-${s.id}-${lang}`, 1024, 512, {
        svg: scrollSceneSVG(s.id),
        text: s.kanji + pick(s.title, lang),
        draw: (c, w) => {
          c.fillStyle = P.sumi; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
          c.font = '800 46px "Shippori Mincho"';
          c.fillText(pick(s.title, lang), 40, 120);
          // sello con el kanji de la escena
          c.fillStyle = P.shu; c.fillRect(w - 120, 80, 80, 80);
          c.fillStyle = P.washi; c.font = '800 58px "Shippori Mincho"'; c.textAlign = 'center';
          c.fillText(s.kanji, w - 80, 142);
          c.fillStyle = P.sumi; c.font = '600 26px "Inter", sans-serif'; c.textAlign = 'left';
          c.fillText(s.year, 42, 160);
        },
      })
    );
    const learn = canvasTexture(`scroll-learn-${lang}`, 1024, 512, {
      svg: scrollSceneSVG('none'),
      text: '読作験' + pick(story.learn.title, lang),
      draw: (c) => {
        c.fillStyle = P.sumi; c.font = '800 46px "Shippori Mincho"'; c.textAlign = 'left';
        c.fillText(pick(story.learn.title, lang), 40, 120);
        story.learn.steps.forEach((st, i) => {
          const x = 220 + i * 300, y = 290;
          c.fillStyle = [P.ai, P.pine, P.ochre][i];
          c.beginPath(); c.arc(x, y, 92, 0, 7); c.fill();
          c.lineWidth = 7; c.strokeStyle = P.sumi; c.stroke();
          c.fillStyle = P.washi; c.textAlign = 'center'; c.font = '800 96px "Shippori Mincho"';
          c.fillText(st.kanji, x, y + 32);
          c.fillStyle = P.sumi; c.font = '700 34px "Inter", sans-serif';
          c.fillText(st.name, x, y + 140);
          if (i < 2) { c.lineWidth = 6; c.beginPath(); c.moveTo(x + 110, y); c.lineTo(x + 186, y); c.lineTo(x + 170, y - 12); c.stroke(); }
        });
      },
    });
    const ai = canvasTexture(`scroll-ai-${lang}`, 1024, 512, {
      svg: scrollSceneSVG('none'),
      text: '確認' + pick(story.ai.title, lang),
      draw: (c) => {
        c.fillStyle = P.sumi; c.font = '800 46px "Shippori Mincho"'; c.textAlign = 'left';
        c.fillText(pick(story.ai.title, lang), 40, 120);
        // ojo que revisa: el humano supervisa a la IA
        c.lineWidth = 8; c.strokeStyle = P.sumi; c.fillStyle = P.washi;
        c.beginPath(); c.moveTo(300, 290); c.quadraticCurveTo(470, 150, 640, 290); c.quadraticCurveTo(470, 430, 300, 290); c.fill(); c.stroke();
        c.fillStyle = P.ai; c.beginPath(); c.arc(470, 290, 62, 0, 7); c.fill(); c.stroke();
        c.fillStyle = P.sumi; c.beginPath(); c.arc(470, 290, 26, 0, 7); c.fill();
        c.fillStyle = P.shu; c.fillRect(720, 210, 170, 170);
        c.fillStyle = P.washi; c.textAlign = 'center'; c.font = '800 70px "Shippori Mincho"';
        c.fillText('確', 805, 288); c.fillText('認', 805, 360);
      },
    });
    return [...scenes, learn, ai];
  }, [lang]);
}

export default function AboutRoom() {
  const lang = useStore((s) => s.lang);
  const panels = usePanels(lang);
  const n = panels.length;
  const meshes = useRef([]);
  const roller = useRef();
  const smooth = useRef(0);
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);

  useMemo(() => panels.forEach((t) => { t.wrapS = THREE.ClampToEdgeWrapping; }), [panels]);

  useFrame((_, dt) => {
    const t = useStore.getState().scrollT;
    smooth.current = THREE.MathUtils.damp(smooth.current, t, 5, dt);
    const E = 0.6 + smooth.current * (n * PANEL_W - 0.6); // extensión desenrollada
    panels.forEach((tex, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const frac = THREE.MathUtils.clamp((E - i * PANEL_W) / PANEL_W, 0, 1);
      m.visible = frac > 0.001;
      m.scale.x = Math.max(frac, 0.001);
      m.position.x = i * PANEL_W + (frac * PANEL_W) / 2;
      tex.repeat.x = frac; tex.offset.x = 0;
    });
    if (roller.current) roller.current.position.x = E + 0.25;
    pos.set(E - 4.5, 6.2, 6.4);
    look.set(E - 4, 0, -0.6);
    camera.position.lerp(pos, 1 - Math.exp(-dt * 5));
    camera.lookAt(look);
    if (t > 0.985) useStore.getState().award('story');
  });

  return (
    <>
      <color attach="background" args={[P.washiDark]} />
      <fog attach="fog" args={[P.washiDark, 14, 40]} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[5, 10, 6]} intensity={1.2} />
      {/* tatami bajo el pergamino */}
      {Array.from({ length: 16 }, (_, i) => (
        <Box key={i} args={[3.9, 0.2, 7.8]} color={i % 2 ? '#c9b98c' : '#cdbf93'} outline={1.2} position={[-6 + i * 4, -0.1, 0]} />
      ))}
      {/* varilla inicial (jiku) */}
      <Ink color={P.woodDark} position={[-0.2, 0.25, 0]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.18, 0.18, PANEL_H + 0.8, 12]} /></Ink>
      {panels.map((tex, i) => (
        <mesh key={i} ref={(el) => (meshes.current[i] = el)} rotation-x={-Math.PI / 2} position={[i * PANEL_W + PANEL_W / 2, 0.08, 0]}>
          <planeGeometry args={[PANEL_W, PANEL_H]} />
          <meshBasicMaterial map={tex} toneMapped={false} />
        </mesh>
      ))}
      <group ref={roller}>
        <Ink color={P.washi} paper position={[0, 0.42, 0]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.42, 0.42, PANEL_H, 20]} /></Ink>
        <Ink color={P.woodDark} position={[0, 0.42, 0]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.16, 0.16, PANEL_H + 0.8, 10]} /></Ink>
      </group>
    </>
  );
}

