'use client';
import { useStore } from '@/lib/store';
import { useT } from '@/lib/i18n';
import { toKanji } from '@/lib/kanji';

/** Plancha de madera estampando el grabado capa a capa: índigo → ocre → bermellón → contorno. */
export default function Loader() {
  const progress = useStore((s) => s.progress);
  const done = useStore((s) => s.loaderDone);
  const t = useT();
  const layers = progress <= 0 ? 0 : Math.min(4, Math.floor(progress / 25) + 1);
  const show = (k) => ({ opacity: layers > k ? 1 : 0, transition: 'opacity .35s ease .25s' });
  return (
    <div
      className={`loader washi fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 transition-opacity duration-700 ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      role="status"
      aria-live="polite"
      aria-hidden={done}
    >
      <div className="relative h-[260px] w-[260px]">
        {/* plancha que baja a estampar en cada capa */}
        <div
          key={layers}
          className="wood absolute -inset-3 z-10 border-[3px] border-sumi"
          style={{ animation: progress < 100 ? 'press .9s ease-in-out both' : 'none', opacity: 0 }}
        />
        <svg viewBox="0 0 260 260" className="ink h-full w-full bg-washi" aria-hidden="true">
          <g style={show(0)}>
            <rect width="260" height="110" fill="#1F3A5F" />
            <rect y="110" width="260" height="40" fill="#3c5a80" />
            <path d="M0 210 C30 180 60 180 80 200 C100 175 130 175 150 200 C170 178 200 178 220 200 C235 185 250 185 260 195 L260 260 L0 260 Z" fill="#1F3A5F" />
          </g>
          <g style={show(1)}>
            <circle cx="190" cy="70" r="26" fill="#D9A441" />
            <path d="M20 92 C40 80 90 80 110 92 C120 98 110 104 100 104 L30 104 C14 104 10 98 20 92 Z" fill="#D9A441" />
            <rect x="96" y="128" width="68" height="40" fill="#F2E8D5" />
            <rect x="106" y="100" width="48" height="24" fill="#F2E8D5" />
          </g>
          <g style={show(2)}>
            <rect x="204" y="214" width="40" height="40" rx="4" fill="#C8402A" />
            <text x="224" y="242" textAnchor="middle" fontSize="26" fontWeight="800" fill="#F2E8D5" fontFamily="Shippori Mincho, serif">城</text>
          </g>
          <g style={show(3)} fill="none" stroke="#1A1A1A" strokeWidth="4" strokeLinejoin="round">
            <path d="M80 130 L180 130 L166 118 L94 118 Z M90 102 L170 102 L154 88 L106 88 Z M110 80 L130 66 L150 80" />
            <path d="M96 128 L96 168 L164 168 L164 128 M106 100 L106 124 M154 100 L154 124" />
            <path d="M70 168 L190 168 L200 182 L60 182 Z" />
            <path d="M0 210 C30 180 60 180 80 200 C100 175 130 175 150 200 C170 178 200 178 220 200 C235 185 250 185 260 195" />
            <circle cx="190" cy="70" r="26" />
            <rect x="2" y="2" width="256" height="256" strokeWidth="5" />
          </g>
        </svg>
      </div>
      <div className="text-center">
        <p className="font-serif text-5xl font-extrabold text-ai" aria-hidden="true">{toKanji(progress)}</p>
        <p className="mt-1 font-mono text-sm text-sumi/70">{Math.round(progress)}%</p>
        <p className="mt-3 font-serif text-lg font-bold">{t('loading')}</p>
      </div>
      <style>{`@keyframes press{0%{opacity:0;transform:translateY(-40px)}35%{opacity:1;transform:translateY(0)}60%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-50px)}}`}</style>
    </div>
  );
}
