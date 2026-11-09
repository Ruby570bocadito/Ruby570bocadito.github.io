"""Genera las animaciones Rive propias del portfolio en public/rive: python rive/build.py

Cada .riv sale de un script (shield.py) con rivwriter.py, el escritor del formato de Rive de FriendlyPear (MIT),
que lee el esquema de rive-runtime (schema.json). Para cambiar una animación, cambia su script y vuelve a ejecutar.
El resto de public/rive viene tal cual de FriendlyPear: pulse, next, send, burst, glint y scan."""
import os, subprocess, sys

here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, "..", "public", "rive")
os.makedirs(out, exist_ok=True)
for name in ("shield",):
    subprocess.run([sys.executable, os.path.join(here, f"{name}.py"), os.path.join(out, f"{name}.riv")], check=True)
    print(f"{name}.riv")
