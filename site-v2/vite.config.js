import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El portfolio se publica en la raíz de https://ruby570bocadito.github.io/ (GitHub Pages, rama main).
// scripts/build.mjs construye cliente + SSR, prerenderiza el HTML y lo copia a la raíz del repo.
export default defineConfig(({ isSsrBuild }) => ({
  base: '/',
  plugins: [react()],
  server: { port: 5180, strictPort: true },
  build: isSsrBuild
    ? { outDir: '.ssr', emptyOutDir: true, copyPublicDir: false }
    : { outDir: '.client', emptyOutDir: true, assetsDir: 'static' }
}));
