import { motion } from 'framer-motion';
import { ui, type Lang } from '../content';
import { useLang } from '../i18n';

/** Selector ES / EN con indicador deslizante. */
export function LangToggle({ className = '', id = 'lang' }: { className?: string; id?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t(ui.langLabel)} className={`relative inline-flex items-center rounded-full border border-[#D7E2EA]/25 p-1 ${className}`}>
      {(['es', 'en'] as Lang[]).map(code => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`relative z-10 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest transition-colors duration-200 md:text-sm ${
            lang === code ? 'text-[#0C0C0C]' : 'text-[#D7E2EA] hover:text-white'
          }`}
        >
          {lang === code && (
            <motion.span
              layoutId={`${id}-pill`}
              className="absolute inset-0 -z-10 rounded-full bg-[#D7E2EA]"
              transition={{ type: 'spring', stiffness: 500, damping: 38 }}
            />
          )}
          {code}
        </button>
      ))}
    </div>
  );
}
