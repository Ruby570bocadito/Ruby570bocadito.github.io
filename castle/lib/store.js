'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Los seis sellos del goshuinchō (libro de sellos). */
export const STAMPS = [
  { id: 'enter', kanji: '入城', label: { en: 'Enter the castle', es: 'Entrar al castillo', ja: '入城する' } },
  { id: 'patrol', kanji: '巡回', label: { en: 'Walk the whole engawa', es: 'Recorrer la pasarela', ja: '縁側を巡回する' } },
  { id: 'story', kanji: '物語', label: { en: 'Read the whole scroll', es: 'Leer el pergamino completo', ja: '絵巻を読み終える' } },
  { id: 'analyze', kanji: '分析', label: { en: 'Inspect a project', es: 'Inspeccionar un proyecto', ja: '作品を分析する' } },
  { id: 'hunter', kanji: '狩人', label: { en: 'Hunt the hidden ninja', es: 'Cazar al ninja escondido', ja: '隠れた忍者を狩る' } },
  { id: 'contact', kanji: '連絡', label: { en: 'Use a contact channel', es: 'Usar un canal de contacto', ja: '連絡する' } },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // idioma y modo
      lang: 'es',
      setLang: (lang) => set({ lang }),
      mode: null, // '3d' | '2d' — se decide en el cliente
      modePref: null, // preferencia explícita del usuario
      setMode: (mode, remember = true) => set(remember ? { mode, modePref: mode } : { mode }),

      // carga
      progress: 0,
      sceneReady: false,
      loaderDone: false,

      // intro → portón → pasarela
      phase: 'intro', // 'intro' | 'crossing' | 'walk'
      setPhase: (phase) => set({ phase }),
      walkT: 0,
      savedScroll: 0,

      // transición shōji
      shoji: 'open', // 'open' | 'closing' | 'closed' | 'opening'

      // paneles
      panel: null, // 'map' | 'book' | 'audio' | 'menu' | null
      togglePanel: (p) => set({ panel: get().panel === p ? null : p }),
      terminal: false,
      project: null,
      cert: null,
      kuraItem: null,
      kuraOpen: false,
      hovered: null,
      letter: false,
      scrollT: 0,

      // audio (siempre empieza silenciado)
      muted: true,
      music: 0.6,
      sfx: 0.8,

      // sellos
      stamps: {},
      toast: null,
      award: (id) => {
        if (get().stamps[id]) return;
        set({ stamps: { ...get().stamps, [id]: Date.now() }, toast: id });
        if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('stamp', { detail: id }));
      },
    }),
    {
      name: 'castillo-vigia',
      skipHydration: true,
      partialize: (s) => ({ lang: s.lang, stamps: s.stamps, music: s.music, sfx: s.sfx, modePref: s.modePref }),
    }
  )
);
