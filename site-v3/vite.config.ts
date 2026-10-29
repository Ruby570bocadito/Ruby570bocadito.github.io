import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// La v3 se publica en https://ruby570bocadito.github.io/v3/ (carpeta /v3 del repo),
// sin tocar la web actual de la raíz.
export default defineConfig({
  base: '/v3/',
  plugins: [react()],
  build: {
    outDir: '../v3',
    emptyOutDir: true,
    assetsDir: 'assets',
    chunkSizeWarningLimit: 900
  }
});
