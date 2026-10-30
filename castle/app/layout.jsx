import './globals.css';
import Shell from '@/components/ui/Shell';

const SITE = 'https://ruby570bocadito.github.io';
const TITLE = 'Rafael Gálvez — Blue Team & Detection Engineer';
const DESC =
  'El castillo vigía (見張りの城): portfolio 3D en estilo ukiyo-e de Rafael Gálvez Silipo — SOC, Blue Team, detection engineering y DFIR. I learn by building. / 作って学ぶ';

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: TITLE, template: '%s' },
  description: DESC,
  authors: [{ name: 'Rafael Gálvez Silipo', url: 'https://github.com/Ruby570bocadito' }],
  keywords: ['Blue Team', 'SOC', 'Detection Engineering', 'DFIR', 'Sigma', 'YARA', 'MITRE ATT&CK', 'portfolio', 'Rafael Gálvez'],
  icons: { icon: '/castle-icon.svg' },
  openGraph: {
    type: 'website', siteName: '見張りの城 — Rafael Gálvez', title: TITLE, description: DESC, url: SITE,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Castillo japonés al atardecer en estilo ukiyo-e' }],
    locale: 'es_ES', alternateLocale: ['en_US', 'ja_JP'],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: ['/og.png'] },
};

export const viewport = { themeColor: '#1F3A5F', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Shippori Mincho (títulos y kanji) · Inter (texto) · JetBrains Mono (terminal) */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;600&family=Shippori+Mincho:wght@500;700;800&display=swap"
        />
      </head>
      <body className="washi">
        <noscript>
          <style>{'.loader{display:none!important}'}</style>
        </noscript>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
