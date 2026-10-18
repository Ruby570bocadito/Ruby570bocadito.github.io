import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El sitio se publica desde la raíz del repo (GitHub Pages, rama main).
// En desarrollo, la raíz del repo hace de carpeta pública (assets/, projects/, cv.pdf...).
// En build, el JS/CSS va a ../static y scripts/build.mjs escribe ../index.html prerenderizado.
export default defineConfig(({ command, isSsrBuild }) => ({
  plugins: [react()],
  publicDir: command === 'serve' ? '..' : false,
  build: isSsrBuild
    ? { outDir: '.ssr', emptyOutDir: true, copyPublicDir: false }
    : { outDir: '.client', emptyOutDir: true, assetsDir: 'static', copyPublicDir: false }
}));
