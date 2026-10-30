/** Exportación estática para GitHub Pages (ruby570bocadito.github.io).
 *  trailingSlash genera /about/index.html, así cada sala funciona al recargar
 *  o al abrirla directamente, sin 404. */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
