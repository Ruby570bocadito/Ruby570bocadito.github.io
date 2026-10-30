(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,69234,t=>{"use strict";let e="#1A1A1A",s="#1F3A5F",l="#3c5a80",a="#D9A441",i="#4A6B4F",r="#F2E8D5",o=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512" viewBox="0 0 1024 512">
<defs>
 <linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s}"/><stop offset=".55" stop-color="${l}"/><stop offset="1" stop-color="${l}" stop-opacity="0"/></linearGradient>
 <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="${r}"/></linearGradient>
</defs>
<path d="M0 512 L120 420 C230 330 330 250 430 150 C462 118 478 96 500 92 L536 92 C560 98 580 120 610 150 C720 260 830 350 1024 470 L1024 512 Z" fill="url(#b)"/>
<path d="M0 512 L120 420 C230 330 330 250 430 150 C462 118 478 96 500 92 L536 92 C560 98 580 120 610 150 C720 260 830 350 1024 470" fill="none" stroke="${e}" stroke-width="7" stroke-linejoin="round"/>
<path d="M430 150 C462 118 478 96 500 92 L536 92 C560 98 580 120 610 150 L590 168 L566 150 L548 192 L522 160 L500 210 L478 162 L456 190 L446 162 Z" fill="url(#s)" stroke="${e}" stroke-width="6" stroke-linejoin="round"/>
<path d="M500 210 L470 300 M548 192 L560 280 M456 190 L400 290 M590 168 L650 260" stroke="${e}" stroke-width="3" opacity=".45" fill="none"/>
</svg>`;function d(t=r,s=1){let l=[],a=60,i=s,o=()=>(i=(9301*i+49297)%233280)/233280;for(;a<940;){let t=70+110*o();l.push([a,t,26+30*o()]),a+=.8*t}let n="M40 150 C20 150 10 120 40 108 ";return l.forEach(([t,e,s])=>{n+=`C${t+.2*e} ${108-s} ${t+.8*e} ${108-s} ${t+e} 104 `}),n+="C1010 104 1016 150 984 150 Z",`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="180" viewBox="0 0 1024 180">
<path d="${n}" fill="${t}" stroke="${e}" stroke-width="6" stroke-linejoin="round"/>
<path d="M90 132 L930 132" stroke="${e}" stroke-width="2.5" opacity=".25"/>
</svg>`}let n=(()=>{let t="",a="",i="";for(let e=0;e<4;e++){let s=256*e;t+=`M${s} 256 L${s} 150 C${s+40} 80 ${s+120} 40 ${s+190} 70 C${s+225} 85 ${s+240} 110 ${s+256} 150 L${s+256} 256 Z `,a+=`M${s+120} 52 C${s+160} 30 ${s+210} 50 ${s+228} 92 C${s+214} 80 ${s+204} 84 ${s+206} 96 C${s+194} 82 ${s+182} 86 ${s+184} 98 C${s+172} 84 ${s+160} 88 ${s+160} 100 C${s+148} 82 ${s+132} 72 ${s+120} 52 Z `,i+=`M${s+20} 170 C${s+70} 110 ${s+130} 90 ${s+190} 110 M${s+30} 205 C${s+80} 150 ${s+150} 140 ${s+220} 160 `}return`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="256" viewBox="0 0 1024 256">
<defs><linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${l}"/><stop offset=".6" stop-color="${s}"/></linearGradient></defs>
<path d="${t}" fill="url(#w)" stroke="${e}" stroke-width="6" stroke-linejoin="round"/>
<path d="${i}" fill="none" stroke="${r}" stroke-width="4" opacity=".7"/>
<path d="${a}" fill="${r}" stroke="${e}" stroke-width="4.5" stroke-linejoin="round"/>
</svg>`})(),c=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="160" viewBox="0 0 256 160">
<g stroke="${e}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round">
<path d="M70 86 C110 70 150 72 180 84 L236 66 L240 72 L186 94 C150 104 108 104 70 96 Z" fill="${r}"/>
<path d="M236 66 L252 64 L240 72 Z" fill="${e}"/>
<circle cx="233" cy="64" r="4" fill="${a}"/>
<path d="M110 84 C90 50 70 22 30 6 C58 30 70 54 84 86 Z" fill="${r}"/>
<path d="M30 6 C46 18 56 28 64 40 L52 44 C46 30 40 20 30 6 Z" fill="${e}"/>
<path d="M120 90 C100 120 70 140 24 150 C60 128 80 110 96 92 Z" fill="${r}"/>
<path d="M24 150 C40 140 52 132 62 124 L70 132 C58 140 44 146 24 150 Z" fill="${e}"/>
<path d="M70 92 L16 100 M72 96 L20 108" fill="none"/>
</g></svg>`,h=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="1024" viewBox="0 0 512 1024">
<g stroke="${e}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
 <!-- piernas y zapatillas -->
 <path d="M190 640 L176 930 L236 930 L250 690 L268 930 L328 930 L320 640 Z" fill="#26303d"/>
 <path d="M160 930 L240 930 L244 962 L150 962 Z M262 930 L344 930 L352 962 L258 962 Z" fill="${r}"/>
 <path d="M150 962 L244 962 M258 962 L352 962" stroke-width="10"/>
 <!-- sudadera -->
 <path d="M150 360 C170 320 210 304 256 304 C302 304 342 320 362 360 L380 560 L360 660 L152 660 L132 560 Z" fill="${s}"/>
 <path d="M200 310 C210 350 240 370 256 372 C272 370 302 350 312 310" fill="${l}"/>
 <path d="M230 372 L226 450 M282 372 L286 450" stroke-width="5"/>
 <path d="M196 560 L316 560 L310 620 L202 620 Z" fill="${l}"/>
 <path d="M160 640 L352 640" stroke-width="5" opacity=".6"/>
 <!-- brazo izquierdo con port\xe1til -->
 <path d="M150 360 C128 420 118 500 130 560 L176 566 C172 510 178 450 190 400 Z" fill="${s}"/>
 <path d="M96 520 L250 470 L262 500 L108 552 Z" fill="#9aa3ad"/>
 <path d="M96 520 L108 552" stroke-width="5"/>
 <path d="M150 506 L188 494" stroke="${a}" stroke-width="6"/>
 <path d="M130 556 C126 540 140 530 156 534 C168 538 170 556 160 566 Z" fill="${r}"/>
 <!-- cuello y cabeza -->
 <path d="M236 270 L236 306 L276 306 L276 270 Z" fill="${r}"/>
 <path d="M188 196 C188 130 220 100 256 100 C296 100 326 130 326 196 C326 252 296 286 256 286 C216 286 188 252 188 196 Z" fill="${r}"/>
 <!-- pelo negro estilizado -->
 <path d="M180 200 C170 120 210 76 262 78 C320 80 344 128 334 196 C320 168 300 150 270 146 C284 160 286 170 282 178 C262 156 236 150 210 158 C214 168 210 182 200 190 Z" fill="${e}"/>
 <path d="M240 98 C246 88 254 84 262 84" fill="none" stroke="${r}" stroke-width="3" opacity=".5"/>
 <!-- rostro: trazos finos ukiyo-e -->
 <path d="M220 206 C228 200 238 200 244 206 M270 206 C276 200 286 200 294 206" fill="none" stroke-width="5"/>
 <path d="M222 192 C232 186 240 186 246 190 M268 190 C276 186 284 186 292 192" fill="none" stroke-width="4"/>
 <path d="M256 214 C254 228 252 236 258 240" fill="none" stroke-width="4"/>
 <path d="M240 256 C250 262 262 262 272 256" fill="none" stroke-width="5"/>
 <path d="M188 210 C180 210 178 232 192 236 M326 210 C334 210 336 232 322 236" fill="${r}" stroke-width="5"/>
</g></svg>`,f=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="512" viewBox="0 0 256 512">
<g stroke="${e}" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
 <path d="M60 470 C70 380 96 280 130 190 L176 206 C150 290 128 380 112 480 Z" fill="${s}"/>
 <path d="M112 470 L64 462" stroke-width="5" opacity=".5"/>
 <path d="M130 190 C118 160 116 120 128 96 L142 70 C148 62 156 66 152 76 L146 100 L160 56 C164 46 176 50 172 60 L162 96 L178 60 C182 50 194 54 190 64 L176 104 L194 78 C200 70 210 76 204 86 L180 140 C178 170 172 196 176 206 Z" fill="${r}"/>
</g></svg>`,x=`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
<g stroke="${e}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">
 <path d="M60 236 C50 190 64 150 96 130 L160 130 C192 150 206 190 196 236 Z" fill="#14202f"/>
 <path d="M84 120 C80 70 104 44 130 44 C158 44 178 70 172 120 C160 134 96 134 84 120 Z" fill="#14202f"/>
 <path d="M96 84 L164 84 L162 104 L98 104 Z" fill="${r}"/>
 <circle cx="116" cy="94" r="5" fill="${e}" stroke="none"/><circle cx="146" cy="94" r="5" fill="${e}" stroke="none"/>
 <path d="M172 60 C196 50 214 62 226 48 M172 70 C194 70 206 82 222 76" fill="none" stroke-width="5"/>
 <path d="M196 150 L236 108" stroke="#9aa3ad" stroke-width="7"/>
</g></svg>`;function p(t){let o=(t,s=r)=>`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="512" viewBox="0 0 1024 512">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}" stop-opacity=".35"/><stop offset=".5" stop-color="${s}" stop-opacity="0"/></linearGradient></defs>
<rect width="1024" height="512" fill="${r}"/>
<rect width="1024" height="512" fill="url(#g)"/>
<g stroke="${e}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round">${t}</g>
<path d="M-10 60 C120 30 240 70 380 48 C520 26 640 64 780 44 C900 28 980 46 1040 40 L1040 -10 L-10 -10 Z" fill="${a}" stroke="${e}" stroke-width="5"/>
<path d="M-10 470 C140 440 300 486 460 462 C620 438 760 486 1040 456 L1040 522 L-10 522 Z" fill="${a}" stroke="${e}" stroke-width="5"/>
</svg>`,d=(t,s,l=1)=>`<g transform="translate(${t} ${s}) scale(${l})">
   <path d="M-40 160 L-30 60 C-28 40 28 40 30 60 L40 160 Z" fill="${i}"/>
   <circle cx="0" cy="20" r="34" fill="${r}"/><path d="M-36 14 C-34 -20 34 -24 36 10 C20 -2 -10 -4 -36 14 Z" fill="${e}"/>
   <path d="M-14 26 L-6 26 M8 26 L16 26" stroke-width="4"/></g>`;switch(t){case"unity":return o(`
   <path d="M120 420 L900 420" stroke-width="5"/>
   <rect x="380" y="250" width="300" height="160" fill="${r}"/>
   <rect x="400" y="268" width="260" height="120" fill="${s}"/>
   <path d="M530 290 L580 318 L580 370 L530 398 L480 370 L480 318 Z" fill="${r}" stroke-width="5"/>
   <path d="M530 290 L530 340 L480 318 M530 340 L580 318 M530 340 L530 398" stroke-width="4"/>
   <path d="M440 410 L620 410 L640 440 L420 440 Z" fill="${e}"/>
   <path d="M415 300 L440 300 M415 316 L452 316 M415 332 L436 332" stroke="${a}" stroke-width="4"/>
   ${d(260,250,1.1)}
   <path d="M720 380 C740 330 790 320 820 350 C850 320 900 340 880 390 Z" fill="${i}"/>
   <path d="M800 390 L800 420" stroke-width="8"/>`);case"offense":return o(`
   <path d="M80 420 L940 420" stroke-width="5"/>
   <path d="M160 420 L160 250 L360 250 L360 420" fill="${l}"/>
   <path d="M140 250 L260 180 L380 250 Z" fill="${e}"/>
   <rect x="220" y="320" width="80" height="100" fill="${e}"/>
   <path d="M600 410 C600 330 640 300 680 300 C720 300 760 330 760 410 Z" fill="${e}"/>
   <circle cx="680" cy="270" r="40" fill="${e}"/>
   <path d="M654 266 L706 266" stroke="${r}" stroke-width="8"/>
   <path d="M420 200 C480 160 540 160 600 200" fill="none" stroke-dasharray="14 12"/>
   <path d="M590 186 L604 204 L580 206" fill="none"/>
   <rect x="780" y="300" width="120" height="80" fill="${r}"/><path d="M790 316 L860 316 M790 334 L880 334 M790 352 L840 352" stroke="${s}" stroke-width="5"/>`);case"blue":return o(`
   <path d="M80 420 L940 420" stroke-width="5"/>
   <path d="M420 420 L440 180 L580 180 L600 420 Z" fill="${r}"/>
   <path d="M400 190 L510 110 L620 190 Z" fill="${s}"/>
   <path d="M380 120 L510 50 L640 120 L620 128 L510 74 L400 128 Z" fill="${s}"/>
   <rect x="470" y="220" width="80" height="60" fill="${e}"/>
   <path d="M510 300 C470 300 460 330 460 350 C460 390 500 410 510 414 C520 410 560 390 560 350 C560 330 550 300 510 300 Z" fill="${s}"/>
   <path d="M488 352 L506 372 L536 336" stroke="${r}" stroke-width="8" fill="none"/>
   <path d="M600 230 C700 210 800 230 900 200 M600 260 C700 250 800 270 900 250" fill="none" stroke="${a}" stroke-width="5"/>
   ${d(250,260,1)}`);case"smr":return o(`
   <path d="M80 420 L940 420" stroke-width="5"/>
   <rect x="300" y="210" width="420" height="210" fill="${r}"/>
   <path d="M280 214 L510 120 L740 214 Z" fill="${i}"/>
   ${[0,1,2,3].map(t=>`<rect x="${330+96*t}" y="250" width="60" height="60" fill="${s}"/>`).join("")}
   <rect x="470" y="330" width="80" height="90" fill="${e}"/>
   <path d="M140 420 L140 300 M100 330 L140 300 L180 330" fill="none" stroke-width="5"/>
   <circle cx="140" cy="290" r="18" fill="${a}"/>
   <path d="M800 420 L800 330 M800 330 L880 330 L880 420 M760 330 L840 280 L920 330" fill="none" stroke-width="5"/>`);case"hackathon":return o(`
   <path d="M80 420 L940 420" stroke-width="5"/>
   <rect x="430" y="170" width="150" height="250" rx="22" fill="${e}"/>
   <rect x="446" y="196" width="118" height="190" fill="${r}"/>
   <path d="M505 230 C470 230 466 290 480 320 C492 346 518 346 530 320 C544 290 540 230 505 230 Z" fill="${a}"/>
   <path d="M505 230 L510 210 C520 204 532 210 530 220" fill="${i}"/>
   <path d="M620 260 C650 240 650 300 620 280 M660 240 C710 210 710 330 660 300 M700 220 C770 180 770 350 700 320" fill="none" stroke="${s}" stroke-width="6"/>
   <path d="M150 410 L150 300 C150 270 200 270 200 300 L200 410 Z" fill="${r}"/>
   <circle cx="175" cy="250" r="36" fill="${r}"/><path d="M140 246 C140 210 210 206 212 244 C190 232 160 232 140 246 Z" fill="${r}"/>
   <path d="M160 254 L168 254 M182 254 L190 254" stroke-width="4"/>
   ${d(300,260,1)}`);default:return o("")}}let m=`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="520" viewBox="0 0 600 520">
<g stroke="${e}" stroke-width="6" stroke-linejoin="round">
 <path d="M110 520 L150 380 L450 380 L490 520 Z" fill="#9d9584"/>
 <path d="M135 430 L465 430 M122 476 L478 476" stroke-width="3" opacity=".5"/>
 <rect x="170" y="300" width="260" height="80" fill="${r}"/>
 <path d="M120 312 C180 296 220 270 300 262 C380 270 420 296 480 312 L470 296 C420 286 380 250 300 244 C220 250 180 286 130 296 Z" fill="${s}"/>
 <rect x="205" y="200" width="190" height="62" fill="${r}"/>
 <path d="M160 214 C210 200 250 176 300 170 C350 176 390 200 440 214 L430 198 C390 188 350 158 300 152 C250 158 210 188 170 198 Z" fill="${s}"/>
 <path d="M262 208 L300 178 L338 208 Z" fill="${s}"/>
 <rect x="240" y="110" width="120" height="48" fill="${r}"/>
 <path d="M200 124 C240 112 270 92 300 88 C330 92 360 112 400 124 L390 108 C360 98 330 70 300 66 C270 70 240 98 210 108 Z" fill="${s}"/>
 <path d="M272 70 L300 30 L328 70 Z" fill="${s}"/>
 <path d="M282 34 L270 14 L290 26 Z M318 34 L330 14 L310 26 Z" fill="${a}"/>
 ${[0,1,2,3].map(t=>`<rect x="${196+56*t}" y="324" width="28" height="30" fill="${e}"/>`).join("")}
 ${[0,1,2].map(t=>`<rect x="${226+56*t}" y="218" width="24" height="26" fill="${e}"/>`).join("")}
 <rect x="268" y="122" width="22" height="22" fill="${e}"/><rect x="310" y="122" width="22" height="22" fill="${e}"/>
</g></svg>`;t.s(["armSVG",0,f,"avatarSVG",0,h,"castle2dSVG",0,m,"cloudSVG",()=>d,"craneSVG",0,c,"mountainSVG",0,o,"ninjaSVG",0,x,"scrollSceneSVG",()=>p,"waveSVG",0,n])},27735,t=>{"use strict";var e=t.i(43476),s=t.i(71645),l=t.i(87006),a=t.i(16166),i=t.i(41800),r=t.i(82757),o=t.i(41268),d=t.i(56938),n=t.i(69234),c=t.i(41155),h=t.i(41681),f=t.i(92578),x=t.i(46472),p=t.i(67399),m=t.i(62437),u=t.i(2714);function g({stamp:t}){let a=(0,s.useRef)();return(0,s.useEffect)(()=>{let e=new IntersectionObserver(([e])=>e.isIntersecting&&l.useStore.getState().award(t),{threshold:1});return a.current&&e.observe(a.current),()=>e.disconnect()},[t]),(0,e.jsx)("div",{ref:a,className:"h-1","aria-hidden":"true"})}function w({id:t,sub:s}){let i=(0,l.useStore)(t=>t.lang),r=f.default.find(e=>e.id===t);return(0,e.jsxs)("header",{className:"mb-8 border-b-[3px] border-sumi pb-4",children:[(0,e.jsx)("p",{className:"font-serif text-sm font-bold uppercase tracking-[0.3em] text-ai",children:(0,a.pick)(r.label,i)}),(0,e.jsxs)("h1",{className:"mt-1 font-serif text-4xl font-extrabold md:text-6xl",children:[(0,e.jsx)("span",{className:"mr-3 text-ai",lang:"ja",children:r.kanji}),r.name]}),s?(0,e.jsx)("p",{className:"mt-3 font-serif text-xl",children:s}):null]})}function L(){let t=(0,i.useNav)(),s=(0,l.useStore)(t=>t.lang);return(0,e.jsxs)("nav",{"aria-label":"Salas / Rooms",className:"mt-16 border-t-[3px] border-sumi pt-6",children:[(0,e.jsx)("ul",{className:"grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6",children:f.default.map(l=>(0,e.jsx)("li",{children:(0,e.jsxs)("a",{href:l.path,onClick:e=>{e.preventDefault(),t(l.path)},className:"ink inkshadow block bg-ai p-3 text-center text-washi transition-transform hover:-translate-y-1",children:[(0,e.jsx)("span",{className:"block font-serif text-2xl font-extrabold",lang:"ja",children:l.kanji}),(0,e.jsx)("span",{className:"block text-xs font-bold tracking-wider",children:l.name}),(0,e.jsx)("span",{className:"block text-xs text-ochre",children:(0,a.pick)(l.label,s)})]})},l.id))}),(0,e.jsxs)("p",{className:"mt-6 text-center text-sm text-sumi/70",children:["© ",c.default.name," · ",(0,e.jsx)("span",{lang:"ja",children:c.default.mottoJa})," · ",(0,e.jsx)("a",{className:"underline",href:"/classic/",children:(0,a.useT)()("classic")})]})]})}function j(){let t=(0,a.useT)(),s=(0,i.useNav)(),{lang:r,stamps:d}=(0,l.useStore)();return(0,e.jsxs)("div",{children:[(0,e.jsx)("section",{className:"woodframe relative overflow-hidden bokashi-dusk","aria-label":"見張りの城",children:(0,e.jsxs)("div",{className:"relative aspect-[16/10] w-full md:aspect-[16/7]",children:[(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n.mountainSVG),alt:"",className:"absolute bottom-[18%] left-[-10%] w-[80%] opacity-90"}),(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent((0,n.cloudSVG)("#F2E8D5",3)),alt:"",className:"absolute left-[-5%] top-[22%] w-[55%]"}),(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent((0,n.cloudSVG)("#D9A441",7)),alt:"",className:"absolute right-[-8%] top-[10%] w-[50%]"}),(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n.craneSVG),alt:"",className:"absolute left-[40%] top-[8%] w-[9%]"}),(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n.craneSVG),alt:"",className:"absolute left-[52%] top-[15%] w-[6%]"}),(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n.castle2dSVG),alt:"Castillo japonés al atardecer en estilo ukiyo-e",className:"absolute bottom-[10%] right-[8%] w-[46%] md:w-[34%]"}),d.hunter?null:(0,e.jsx)("button",{onClick:()=>l.useStore.getState().award("hunter"),className:"absolute bottom-[58%] right-[22%] w-[4%] min-w-6 opacity-90 md:bottom-[62%] md:right-[18%]","aria-label":"?",children:(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n.ninjaSVG),alt:""})}),(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n.waveSVG),alt:"",className:"absolute bottom-0 left-0 w-1/2"}),(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent(n.waveSVG),alt:"",className:"absolute bottom-0 right-0 w-1/2"}),(0,e.jsxs)("div",{className:"absolute left-[4%] top-[8%] wood woodframe flex flex-col items-center px-3 py-4",children:[(0,e.jsx)("span",{className:"vertical font-serif text-2xl font-extrabold tracking-[0.2em] text-washi md:text-5xl",lang:"ja",children:c.default.katakana}),(0,e.jsx)("span",{className:"mt-3 max-w-[6rem] text-center font-serif text-xs font-extrabold text-washi md:text-sm",children:c.default.short})]})]})}),(0,e.jsxs)("section",{className:"mt-10 grid gap-8 md:grid-cols-[1.4fr_1fr]",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("h1",{className:"font-serif text-4xl font-extrabold md:text-5xl",children:c.default.name}),(0,e.jsx)("p",{className:"mt-2 font-serif text-xl text-ai",children:c.default.roles.join(" · ")}),(0,e.jsx)("p",{className:"mt-4 text-lg leading-relaxed",children:(0,a.pick)(c.default.bio,r)}),(0,e.jsxs)("p",{className:"mt-4 font-serif text-lg",children:["“",c.default.motto.en,"” / ",(0,e.jsx)("span",{lang:"ja",children:c.default.mottoJa})]}),(0,e.jsxs)("div",{className:"mt-6 flex flex-wrap gap-3",children:[(0,e.jsxs)(o.WoodButton,{onClick:()=>{l.useStore.getState().award("enter"),s("/watchtower/")},className:"bg-ai! text-washi! px-4! py-2!",children:["入城 · ",t("enter")," →"]}),(0,e.jsxs)(o.WoodButton,{onClick:()=>s("/harbor/"),children:["港 ",(0,a.pick)(f.default[4].label,r)]})]})]}),(0,e.jsxs)("aside",{className:"washi woodframe p-5",children:[(0,e.jsx)("p",{className:"font-serif text-sm font-bold uppercase tracking-widest text-sumi/70",children:"Status"}),(0,e.jsxs)("p",{className:"mt-2 font-serif text-xl font-extrabold",children:[(0,e.jsx)(o.Hanko,{children:"募集中"})," ",(0,a.pick)(c.default.status,r)]}),(0,e.jsx)("p",{className:"mt-3",children:(0,a.pick)(c.default.location,r)}),(0,e.jsx)("ul",{className:"mt-3 list-disc pl-5 text-sm",children:c.default.focus.map(t=>(0,e.jsx)("li",{children:t},t))})]})]}),(0,e.jsx)(L,{}),(0,e.jsx)(g,{stamp:"patrol"})]})}function $(){let t=(0,l.useStore)(t=>t.lang);return(0,e.jsxs)("div",{children:[(0,e.jsx)(w,{id:"about",sub:(0,a.pick)(c.default.bio,t)}),(0,e.jsx)("ol",{className:"space-y-10",children:m.default.scenes.map(s=>(0,e.jsxs)("li",{className:"grid items-center gap-5 md:grid-cols-[1.2fr_1fr]",children:[(0,e.jsx)("img",{src:"data:image/svg+xml;charset=utf-8,"+encodeURIComponent((0,n.scrollSceneSVG)(s.id)),alt:"",className:"ink washi w-full",loading:"lazy"}),(0,e.jsxs)("div",{children:[(0,e.jsxs)("p",{className:"font-serif font-bold text-ai",children:[(0,e.jsx)(o.Hanko,{size:"text-sm",children:s.kanji})," ",s.year]}),(0,e.jsx)("h2",{className:"mt-2 font-serif text-2xl font-extrabold",children:(0,a.pick)(s.title,t)}),(0,e.jsx)("p",{className:"mt-2 leading-relaxed",children:(0,a.pick)(s.text,t)})]})]},s.id))}),(0,e.jsxs)("section",{className:"mt-12",children:[(0,e.jsx)("h2",{className:"font-serif text-3xl font-extrabold",children:(0,a.pick)(m.default.learn.title,t)}),(0,e.jsx)("ol",{className:"mt-4 grid gap-4 md:grid-cols-3",children:m.default.learn.steps.map(s=>(0,e.jsxs)("li",{className:"washi woodframe p-5",children:[(0,e.jsx)("span",{className:"font-serif text-5xl font-extrabold text-ai",lang:"ja",children:s.kanji}),(0,e.jsx)("h3",{className:"mt-2 font-serif text-xl font-extrabold",children:s.name}),(0,e.jsx)("p",{className:"mt-1",children:(0,a.pick)(s.text,t)})]},s.name))})]}),(0,e.jsxs)("section",{className:"washi woodframe mt-10 p-6",children:[(0,e.jsxs)("h2",{className:"font-serif text-2xl font-extrabold",children:[(0,e.jsx)(o.Hanko,{children:"確認"})," ",(0,a.pick)(m.default.ai.title,t)]}),(0,e.jsx)("p",{className:"mt-2 text-lg leading-relaxed",children:(0,a.pick)(m.default.ai.text,t)})]}),(0,e.jsx)(g,{stamp:"story"}),(0,e.jsx)(L,{})]})}function k(){return(0,e.jsxs)("div",{children:[(0,e.jsx)(w,{id:"watchtower"}),(0,e.jsx)("ul",{className:"space-y-6",children:h.default.map(t=>(0,e.jsx)("li",{className:`washi woodframe ${t.featured?"ring-4 ring-ochre":""}`,children:(0,e.jsxs)("details",{onToggle:t=>t.currentTarget.open&&l.useStore.getState().award("analyze"),open:t.featured,children:[(0,e.jsxs)("summary",{className:"flex cursor-pointer list-none items-center gap-4 p-4 hover:bg-washi-dark",children:[(0,e.jsx)("span",{className:"font-serif text-4xl font-extrabold text-ai",lang:"ja","aria-hidden":"true",children:t.kanji}),(0,e.jsx)("span",{className:"font-serif text-xl font-extrabold",children:t.name}),t.band?(0,e.jsx)("span",{className:"ink hidden bg-ochre px-2 text-xs font-bold sm:inline",children:t.band}):null,(0,e.jsx)("span",{className:"ml-auto font-mono text-sm",children:"+"})]}),(0,e.jsx)("div",{className:"border-t-[3px] border-sumi",children:(0,e.jsx)(d.ProjectDetail,{p:t,headingLevel:2})})]})},t.id))}),(0,e.jsx)(L,{})]})}function C(){let t=(0,l.useStore)(t=>t.lang);return(0,e.jsxs)("div",{children:[(0,e.jsx)(w,{id:"dojo",sub:(0,a.pick)(x.default.title,t)}),(0,e.jsx)("ul",{className:"grid gap-5 md:grid-cols-2",children:x.default.categories.map(s=>(0,e.jsxs)("li",{className:"washi woodframe p-5",children:[(0,e.jsxs)("h2",{className:"font-serif text-2xl font-extrabold",children:[(0,e.jsx)("span",{className:"text-ai",lang:"ja",children:s.kanji})," ",(0,a.pick)(s.name,t)," ",(0,e.jsxs)("span",{className:"text-sm font-bold text-sumi/60",children:["· ",(0,a.pick)(s.weaponName,t)]})]}),(0,e.jsx)("ul",{className:"mt-3 flex flex-wrap gap-2",children:s.items.map(t=>(0,e.jsx)("li",{children:(0,e.jsx)(o.Hanko,{size:"text-sm",children:t})},t))})]},s.id))}),(0,e.jsx)(L,{})]})}function M(){return(0,e.jsxs)("div",{children:[(0,e.jsx)(w,{id:"archive"}),(0,e.jsx)("ul",{className:"grid gap-5 sm:grid-cols-2 lg:grid-cols-3",children:[...p.default.items,...p.default.achievements].map(t=>(0,e.jsx)("li",{children:(0,e.jsx)(d.CertDetail,{c:t})},t.id))}),(0,e.jsx)(L,{})]})}function b(){let t=(0,l.useStore)(t=>t.lang);return(0,e.jsxs)("div",{children:[(0,e.jsx)(w,{id:"harbor",sub:(0,a.pick)(c.default.status,t)}),(0,e.jsxs)("div",{className:"grid gap-8 md:grid-cols-[1fr_1.3fr]",children:[(0,e.jsx)("ul",{className:"space-y-3",children:r.CHANNELS.filter(t=>"message"!==t.id).map(s=>(0,e.jsx)("li",{children:(0,e.jsxs)("a",{href:s.href,...s.download?{download:"Rafael-Galvez-CV.pdf"}:/^https?:/.test(s.href)?{target:"_blank",rel:"noopener noreferrer"}:{},onClick:()=>l.useStore.getState().award("contact"),className:"ink inkshadow flex items-center justify-between bg-ai px-4 py-3 font-serif text-lg font-bold text-washi hover:-translate-y-0.5",children:[(0,e.jsxs)("span",{children:["boat"===s.kind?"舟":"灯"," ",(0,a.pick)(s.label,t)]}),(0,e.jsx)("span",{className:"text-sm text-ochre",children:"email"===s.id?c.default.email:"↗"})]})},s.id))}),(0,e.jsx)(d.LetterForm,{})]}),(0,e.jsx)(L,{})]})}function v(){let t=(0,l.useStore)(t=>t.lang);return(0,e.jsxs)("div",{children:[(0,e.jsx)(w,{id:"kura",sub:(0,a.pick)(u.default.motto,t)}),(0,e.jsx)("p",{className:"mb-6 text-sumi/80",children:(0,a.pick)(u.default.disclaimer,t)}),(0,e.jsx)("ul",{className:"grid gap-6 md:grid-cols-2",children:u.default.items.map(t=>(0,e.jsx)("li",{className:"washi woodframe",children:(0,e.jsx)(d.KuraDetail,{k:t})},t.id))}),(0,e.jsx)(L,{})]})}let N={home:j,about:$,watchtower:k,dojo:C,archive:M,harbor:b,kura:v};function y({id:t}){let s=N[t]||j;return(0,e.jsx)(s,{})}t.s(["About2D",()=>$,"Archive2D",()=>M,"Dojo2D",()=>C,"Harbor2D",()=>b,"Home2D",()=>j,"Kura2D",()=>v,"Nav2D",()=>L,"ROOMS_2D",0,N,"Watchtower2D",()=>k,"default",()=>y])}]);