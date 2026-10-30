/**
 * Arte 2D original en estilo ukiyo-e: contornos sumi gruesos, tintas planas
 * y bokashi. Todo dibujado a mano en SVG para este portfolio.
 */
const S = '#1A1A1A', AI = '#1F3A5F', AIS = '#3c5a80', OC = '#D9A441', PI = '#4A6B4F', WA = '#F2E8D5';

export const mountainSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512" viewBox="0 0 1024 512">
<defs>
 <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${AI}"/><stop offset=".55" stop-color="${AIS}"/><stop offset="1" stop-color="${AIS}" stop-opacity="0"/></linearGradient>
 <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="${WA}"/></linearGradient>
</defs>
<path d="M0 512 L120 420 C230 330 330 250 430 150 C462 118 478 96 500 92 L536 92 C560 98 580 120 610 150 C720 260 830 350 1024 470 L1024 512 Z" fill="url(#b)"/>
<path d="M0 512 L120 420 C230 330 330 250 430 150 C462 118 478 96 500 92 L536 92 C560 98 580 120 610 150 C720 260 830 350 1024 470" fill="none" stroke="${S}" stroke-width="7" stroke-linejoin="round"/>
<path d="M430 150 C462 118 478 96 500 92 L536 92 C560 98 580 120 610 150 L590 168 L566 150 L548 192 L522 160 L500 210 L478 162 L456 190 L446 162 Z" fill="url(#s)" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
<path d="M500 210 L470 300 M548 192 L560 280 M456 190 L400 290 M590 168 L650 260" stroke="${S}" stroke-width="3" opacity=".45" fill="none"/>
</svg>`;

export function cloudSVG(fill = WA, seed = 1) {
  // franja kasumi alargada con bultos redondeados
  const bumps = [];
  let x = 60;
  let s = seed;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  while (x < 940) { const w = 70 + r() * 110; bumps.push([x, w, 26 + r() * 30]); x += w * 0.8; }
  let top = `M40 150 C20 150 10 120 40 108 `;
  bumps.forEach(([bx, bw, bh]) => { top += `C${bx + bw * 0.2} ${108 - bh} ${bx + bw * 0.8} ${108 - bh} ${bx + bw} 104 `; });
  top += `C1010 104 1016 150 984 150 Z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="180" viewBox="0 0 1024 180">
<path d="${top}" fill="${fill}" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
<path d="M90 132 L930 132" stroke="${S}" stroke-width="2.5" opacity=".25"/>
</svg>`;
}

export const waveSVG = (() => {
  // fila de crestas con espuma en garras (diseño original)
  let body = '', foam = '', lines = '';
  for (let i = 0; i < 4; i++) {
    const x = i * 256;
    body += `M${x} 256 L${x} 150 C${x + 40} 80 ${x + 120} 40 ${x + 190} 70 C${x + 225} 85 ${x + 240} 110 ${x + 256} 150 L${x + 256} 256 Z `;
    foam += `M${x + 120} 52 C${x + 160} 30 ${x + 210} 50 ${x + 228} 92 C${x + 214} 80 ${x + 204} 84 ${x + 206} 96 C${x + 194} 82 ${x + 182} 86 ${x + 184} 98 C${x + 172} 84 ${x + 160} 88 ${x + 160} 100 C${x + 148} 82 ${x + 132} 72 ${x + 120} 52 Z `;
    lines += `M${x + 20} 170 C${x + 70} 110 ${x + 130} 90 ${x + 190} 110 M${x + 30} 205 C${x + 80} 150 ${x + 150} 140 ${x + 220} 160 `;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="256" viewBox="0 0 1024 256">
<defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${AIS}"/><stop offset=".6" stop-color="${AI}"/></linearGradient></defs>
<path d="${body}" fill="url(#w)" stroke="${S}" stroke-width="6" stroke-linejoin="round"/>
<path d="${lines}" fill="none" stroke="${WA}" stroke-width="4" opacity=".7"/>
<path d="${foam}" fill="${WA}" stroke="${S}" stroke-width="4.5" stroke-linejoin="round"/>
</svg>`;
})();

export const craneSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="160" viewBox="0 0 256 160">
<g stroke="${S}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
<path d="M70 86 C110 70 150 72 180 84 L236 66 L240 72 L186 94 C150 104 108 104 70 96 Z" fill="${WA}"/>
<path d="M236 66 L252 64 L240 72 Z" fill="${S}"/>
<circle cx="233" cy="64" r="4" fill="${OC}"/>
<path d="M110 84 C90 50 70 22 30 6 C58 30 70 54 84 86 Z" fill="${WA}"/>
<path d="M30 6 C46 18 56 28 64 40 L52 44 C46 30 40 20 30 6 Z" fill="${S}"/>
<path d="M120 90 C100 120 70 140 24 150 C60 128 80 110 96 92 Z" fill="${WA}"/>
<path d="M24 150 C40 140 52 132 62 124 L70 132 C58 140 44 146 24 150 Z" fill="${S}"/>
<path d="M70 92 L16 100 M72 96 L20 108" fill="none"/>
</g></svg>`;

export const avatarSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="1024" viewBox="0 0 512 1024">
<g stroke="${S}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
 <!-- piernas y zapatillas -->
 <path d="M190 640 L176 930 L236 930 L250 690 L268 930 L328 930 L320 640 Z" fill="#26303d"/>
 <path d="M160 930 L240 930 L244 962 L150 962 Z M262 930 L344 930 L352 962 L258 962 Z" fill="${WA}"/>
 <path d="M150 962 L244 962 M258 962 L352 962" stroke-width="10"/>
 <!-- sudadera -->
 <path d="M150 360 C170 320 210 304 256 304 C302 304 342 320 362 360 L380 560 L360 660 L152 660 L132 560 Z" fill="${AI}"/>
 <path d="M200 310 C210 350 240 370 256 372 C272 370 302 350 312 310" fill="${AIS}"/>
 <path d="M230 372 L226 450 M282 372 L286 450" stroke-width="5"/>
 <path d="M196 560 L316 560 L310 620 L202 620 Z" fill="${AIS}"/>
 <path d="M160 640 L352 640" stroke-width="5" opacity=".6"/>
 <!-- brazo izquierdo con portátil -->
 <path d="M150 360 C128 420 118 500 130 560 L176 566 C172 510 178 450 190 400 Z" fill="${AI}"/>
 <path d="M96 520 L250 470 L262 500 L108 552 Z" fill="#9aa3ad"/>
 <path d="M96 520 L108 552" stroke-width="5"/>
 <path d="M150 506 L188 494" stroke="${OC}" stroke-width="6"/>
 <path d="M130 556 C126 540 140 530 156 534 C168 538 170 556 160 566 Z" fill="${WA}"/>
 <!-- cuello y cabeza -->
 <path d="M236 270 L236 306 L276 306 L276 270 Z" fill="${WA}"/>
 <path d="M188 196 C188 130 220 100 256 100 C296 100 326 130 326 196 C326 252 296 286 256 286 C216 286 188 252 188 196 Z" fill="${WA}"/>
 <!-- pelo negro estilizado -->
 <path d="M180 200 C170 120 210 76 262 78 C320 80 344 128 334 196 C320 168 300 150 270 146 C284 160 286 170 282 178 C262 156 236 150 210 158 C214 168 210 182 200 190 Z" fill="${S}"/>
 <path d="M240 98 C246 88 254 84 262 84" fill="none" stroke="${WA}" stroke-width="3" opacity=".5"/>
 <!-- rostro: trazos finos ukiyo-e -->
 <path d="M220 206 C228 200 238 200 244 206 M270 206 C276 200 286 200 294 206" fill="none" stroke-width="5"/>
 <path d="M222 192 C232 186 240 186 246 190 M268 190 C276 186 284 186 292 192" fill="none" stroke-width="4"/>
 <path d="M256 214 C254 228 252 236 258 240" fill="none" stroke-width="4"/>
 <path d="M240 256 C250 262 262 262 272 256" fill="none" stroke-width="5"/>
 <path d="M188 210 C180 210 178 232 192 236 M326 210 C334 210 336 232 322 236" fill="${WA}" stroke-width="5"/>
</g></svg>`;

/** Brazo derecho que saluda; pivota en el hombro (abajo-izquierda del lienzo). */
export const armSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="512" viewBox="0 0 256 512">
<g stroke="${S}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
 <path d="M60 470 C70 380 96 280 130 190 L176 206 C150 290 128 380 112 480 Z" fill="${AI}"/>
 <path d="M112 470 L64 462" stroke-width="5" opacity=".5"/>
 <path d="M130 190 C118 160 116 120 128 96 L142 70 C148 62 156 66 152 76 L146 100 L160 56 C164 46 176 50 172 60 L162 96 L178 60 C182 50 194 54 190 64 L176 104 L194 78 C200 70 210 76 204 86 L180 140 C178 170 172 196 176 206 Z" fill="${WA}"/>
</g></svg>`;

export const ninjaSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
<g stroke="${S}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
 <path d="M60 236 C50 190 64 150 96 130 L160 130 C192 150 206 190 196 236 Z" fill="#14202f"/>
 <path d="M84 120 C80 70 104 44 130 44 C158 44 178 70 172 120 C160 134 96 134 84 120 Z" fill="#14202f"/>
 <path d="M96 84 L164 84 L162 104 L98 104 Z" fill="${WA}"/>
 <circle cx="116" cy="94" r="5" fill="${S}" stroke="none"/><circle cx="146" cy="94" r="5" fill="${S}" stroke="none"/>
 <path d="M172 60 C196 50 214 62 226 48 M172 70 C194 70 206 82 222 76" fill="none" stroke-width="5"/>
 <path d="M196 150 L236 108" stroke="#9aa3ad" stroke-width="7"/>
</g></svg>`;

/** Ilustración de cada escena del emakimono (sin texto). */
export function scrollSceneSVG(id) {
  const frame = (inner, sky = WA) => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512" viewBox="0 0 1024 512">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${OC}" stop-opacity=".35"/><stop offset=".5" stop-color="${sky}" stop-opacity="0"/></linearGradient></defs>
<rect width="1024" height="512" fill="${WA}"/>
<rect width="1024" height="512" fill="url(#g)"/>
<g stroke="${S}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">${inner}</g>
<path d="M-10 60 C120 30 240 70 380 48 C520 26 640 64 780 44 C900 28 980 46 1040 40 L1040 -10 L-10 -10 Z" fill="${OC}" stroke="${S}" stroke-width="5"/>
<path d="M-10 470 C140 440 300 486 460 462 C620 438 760 486 1040 456 L1040 522 L-10 522 Z" fill="${OC}" stroke="${S}" stroke-width="5"/>
</svg>`;
  const kid = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
   <path d="M-40 160 L-30 60 C-28 40 28 40 30 60 L40 160 Z" fill="${PI}"/>
   <circle cx="0" cy="20" r="34" fill="${WA}"/><path d="M-36 14 C-34 -20 34 -24 36 10 C20 -2 -10 -4 -36 14 Z" fill="${S}"/>
   <path d="M-14 26 L-6 26 M8 26 L16 26" stroke-width="4"/></g>`;
  switch (id) {
    case 'unity':
      return frame(`
   <path d="M120 420 L900 420" stroke-width="5"/>
   <rect x="380" y="250" width="300" height="160" fill="${WA}"/>
   <rect x="400" y="268" width="260" height="120" fill="${AI}"/>
   <path d="M530 290 L580 318 L580 370 L530 398 L480 370 L480 318 Z" fill="${WA}" stroke-width="5"/>
   <path d="M530 290 L530 340 L480 318 M530 340 L580 318 M530 340 L530 398" stroke-width="4"/>
   <path d="M440 410 L620 410 L640 440 L420 440 Z" fill="${S}"/>
   <path d="M415 300 L440 300 M415 316 L452 316 M415 332 L436 332" stroke="${OC}" stroke-width="4"/>
   ${kid(260, 250, 1.1)}
   <path d="M720 380 C740 330 790 320 820 350 C850 320 900 340 880 390 Z" fill="${PI}"/>
   <path d="M800 390 L800 420" stroke-width="8"/>`);
    case 'offense':
      return frame(`
   <path d="M80 420 L940 420" stroke-width="5"/>
   <path d="M160 420 L160 250 L360 250 L360 420" fill="${AIS}"/>
   <path d="M140 250 L260 180 L380 250 Z" fill="${S}"/>
   <rect x="220" y="320" width="80" height="100" fill="${S}"/>
   <path d="M600 410 C600 330 640 300 680 300 C720 300 760 330 760 410 Z" fill="${S}"/>
   <circle cx="680" cy="270" r="40" fill="${S}"/>
   <path d="M654 266 L706 266" stroke="${WA}" stroke-width="8"/>
   <path d="M420 200 C480 160 540 160 600 200" fill="none" stroke-dasharray="14 12"/>
   <path d="M590 186 L604 204 L580 206" fill="none"/>
   <rect x="780" y="300" width="120" height="80" fill="${WA}"/><path d="M790 316 L860 316 M790 334 L880 334 M790 352 L840 352" stroke="${AI}" stroke-width="5"/>`);
    case 'blue':
      return frame(`
   <path d="M80 420 L940 420" stroke-width="5"/>
   <path d="M420 420 L440 180 L580 180 L600 420 Z" fill="${WA}"/>
   <path d="M400 190 L510 110 L620 190 Z" fill="${AI}"/>
   <path d="M380 120 L510 50 L640 120 L620 128 L510 74 L400 128 Z" fill="${AI}"/>
   <rect x="470" y="220" width="80" height="60" fill="${S}"/>
   <path d="M510 300 C470 300 460 330 460 350 C460 390 500 410 510 414 C520 410 560 390 560 350 C560 330 550 300 510 300 Z" fill="${AI}"/>
   <path d="M488 352 L506 372 L536 336" stroke="${WA}" stroke-width="8" fill="none"/>
   <path d="M600 230 C700 210 800 230 900 200 M600 260 C700 250 800 270 900 250" fill="none" stroke="${OC}" stroke-width="5"/>
   ${kid(250, 260, 1)}`);
    case 'smr':
      return frame(`
   <path d="M80 420 L940 420" stroke-width="5"/>
   <rect x="300" y="210" width="420" height="210" fill="${WA}"/>
   <path d="M280 214 L510 120 L740 214 Z" fill="${PI}"/>
   ${[0, 1, 2, 3].map((i) => `<rect x="${330 + i * 96}" y="250" width="60" height="60" fill="${AI}"/>`).join('')}
   <rect x="470" y="330" width="80" height="90" fill="${S}"/>
   <path d="M140 420 L140 300 M100 330 L140 300 L180 330" fill="none" stroke-width="5"/>
   <circle cx="140" cy="290" r="18" fill="${OC}"/>
   <path d="M800 420 L800 330 M800 330 L880 330 L880 420 M760 330 L840 280 L920 330" fill="none" stroke-width="5"/>`);
    case 'hackathon':
      return frame(`
   <path d="M80 420 L940 420" stroke-width="5"/>
   <rect x="430" y="170" width="150" height="250" rx="22" fill="${S}"/>
   <rect x="446" y="196" width="118" height="190" fill="${WA}"/>
   <path d="M505 230 C470 230 466 290 480 320 C492 346 518 346 530 320 C544 290 540 230 505 230 Z" fill="${OC}"/>
   <path d="M505 230 L510 210 C520 204 532 210 530 220" fill="${PI}"/>
   <path d="M620 260 C650 240 650 300 620 280 M660 240 C710 210 710 330 660 300 M700 220 C770 180 770 350 700 320" fill="none" stroke="${AI}" stroke-width="6"/>
   <path d="M150 410 L150 300 C150 270 200 270 200 300 L200 410 Z" fill="${WA}"/>
   <circle cx="175" cy="250" r="36" fill="${WA}"/><path d="M140 246 C140 210 210 206 212 244 C190 232 160 232 140 246 Z" fill="${WA}"/>
   <path d="M160 254 L168 254 M182 254 L190 254" stroke-width="4"/>
   ${kid(300, 260, 1)}`);
    default:
      return frame(``);
  }
}

/** Castillo completo para la versión 2D (cabecera y Open Graph). */
export const castle2dSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="520" viewBox="0 0 600 520">
<g stroke="${S}" stroke-width="6" stroke-linejoin="round">
 <path d="M110 520 L150 380 L450 380 L490 520 Z" fill="#9d9584"/>
 <path d="M135 430 L465 430 M122 476 L478 476" stroke-width="3" opacity=".5"/>
 <rect x="170" y="300" width="260" height="80" fill="${WA}"/>
 <path d="M120 312 C180 296 220 270 300 262 C380 270 420 296 480 312 L470 296 C420 286 380 250 300 244 C220 250 180 286 130 296 Z" fill="${AI}"/>
 <rect x="205" y="200" width="190" height="62" fill="${WA}"/>
 <path d="M160 214 C210 200 250 176 300 170 C350 176 390 200 440 214 L430 198 C390 188 350 158 300 152 C250 158 210 188 170 198 Z" fill="${AI}"/>
 <path d="M262 208 L300 178 L338 208 Z" fill="${AI}"/>
 <rect x="240" y="110" width="120" height="48" fill="${WA}"/>
 <path d="M200 124 C240 112 270 92 300 88 C330 92 360 112 400 124 L390 108 C360 98 330 70 300 66 C270 70 240 98 210 108 Z" fill="${AI}"/>
 <path d="M272 70 L300 30 L328 70 Z" fill="${AI}"/>
 <path d="M282 34 L270 14 L290 26 Z M318 34 L330 14 L310 26 Z" fill="${OC}"/>
 ${[0, 1, 2, 3].map((i) => `<rect x="${196 + i * 56}" y="324" width="28" height="30" fill="${S}"/>`).join('')}
 ${[0, 1, 2].map((i) => `<rect x="${226 + i * 56}" y="218" width="24" height="26" fill="${S}"/>`).join('')}
 <rect x="268" y="122" width="22" height="22" fill="${S}"/><rect x="310" y="122" width="22" height="22" fill="${S}"/>
</g></svg>`;
