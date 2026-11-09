import { useEffect } from 'react';
import { Rive, RuntimeLoader } from '@rive-app/canvas-lite';
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas-lite';
import wasmUrl from '@rive-app/canvas-lite/rive.wasm?url';

// El runtime de Rive (WASM) se sirve desde la propia web, sin depender de un CDN.
RuntimeLoader.setWasmUrl(wasmUrl);
// Los .riv de rivwriter.py usan entradas de máquina de estados (aún no data binding): sin aviso en consola.
Rive.suppressDeprecationWarnings = ['state-machine-inputs'];

// Reproduce public/rive/<src> con su máquina de estados; `value` alimenta su entrada numérica.
export default function RivePlayer({ src, stateMachine, input, value }) {
  const { rive, RiveComponent } = useRive({
    src: `${import.meta.env.BASE_URL}rive/${src}`,
    stateMachine,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center })
  });
  const smInput = useStateMachineInput(rive, stateMachine, input);

  useEffect(() => {
    if (!smInput || value === undefined) return;
    try {
      smInput.value = value;
    } catch {
      // La animación ya se desmontó (por ejemplo, al recargar el módulo en desarrollo): no hay nada que mover.
    }
  }, [smInput, value]);

  return <RiveComponent className="rive-canvas" />;
}
