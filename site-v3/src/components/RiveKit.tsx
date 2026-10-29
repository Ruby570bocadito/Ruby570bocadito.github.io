// Puente React ↔ Rive: un único portfolio.riv (generado por scripts/build-riv.mjs) compartido
// por todos los lienzos, y un hook para manejar las entradas de cada máquina de estados.
import {
  Alignment,
  Fit,
  Layout,
  Rive as RiveRuntime,
  RuntimeLoader,
  useRive,
  useRiveFile,
  type RiveFile,
  type StateMachineInput
} from '@rive-app/react-canvas-lite';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { asset, usePrefersReducedMotion } from '../lib/hooks';

// WASM servido desde la propia web (sin CDN) y sin avisos de entradas legacy.
RuntimeLoader.setWasmUrl(asset('rive/rive.wasm'));
RuntimeLoader.setWasmFallbackUrl(asset('rive/rive_fallback.wasm'));
RiveRuntime.suppressDeprecationWarnings = ['state-machine-inputs'];

const RiveFileContext = createContext<RiveFile | null>(null);

export function RiveProvider({ children }: { children: ReactNode }) {
  const { riveFile, status } = useRiveFile({ src: asset('rive/portfolio.riv') });
  // useRiveFile publica el archivo antes de que termine de cargar: solo se comparte ya cargado.
  return <RiveFileContext.Provider value={status === 'success' ? riveFile : null}>{children}</RiveFileContext.Provider>;
}

type Options = {
  artboard: string;
  stateMachine: string;
  /** Activa los listeners de Rive (hover/click dentro del lienzo). */
  listeners?: boolean;
  fit?: Fit;
};

/** Carga un artboard del archivo compartido y expone set/fire para sus entradas. */
export function useRiveArtboard({ artboard, stateMachine, listeners = false, fit = Fit.Contain }: Options) {
  const riveFile = useContext(RiveFileContext);
  const reduced = usePrefersReducedMotion();
  const { rive, RiveComponent } = useRive(
    riveFile
      ? {
          riveFile,
          artboard,
          stateMachine,
          autoplay: !reduced,
          layout: new Layout({ fit, alignment: Alignment.Center }),
          shouldDisableRiveListeners: !listeners,
          isTouchScrollEnabled: true
        }
      : null,
    { shouldUseIntersectionObserver: true }
  );

  const inputs = useMemo(() => {
    const map = new Map<string, StateMachineInput>();
    if (rive) for (const input of rive.stateMachineInputs(stateMachine) ?? []) map.set(input.name, input);
    return map;
  }, [rive, stateMachine]);

  // Valores pedidos antes de que Rive cargase: se aplican al estar listo.
  const pending = useRef(new Map<string, number | boolean>());
  useEffect(() => {
    if (!inputs.size) return;
    for (const [name, value] of pending.current) {
      const input = inputs.get(name);
      if (input) input.value = value;
    }
    pending.current.clear();
  }, [inputs]);

  const set = useCallback(
    (name: string, value: number | boolean) => {
      const input = inputs.get(name);
      if (input) {
        if (input.value !== value) input.value = value;
      } else pending.current.set(name, value);
    },
    [inputs]
  );
  const fire = useCallback((name: string) => inputs.get(name)?.fire(), [inputs]);

  return { rive, RiveComponent, set, fire, ready: inputs.size > 0 };
}

export { Fit };
