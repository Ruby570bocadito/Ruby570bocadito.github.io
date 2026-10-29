import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { meta, type L, type Lang } from './content';

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (value: string | L) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

declare global {
  interface Window {
    __initialLang?: Lang;
  }
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() =>
    typeof window !== 'undefined' && window.__initialLang === 'en' ? 'en' : 'es'
  );

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem('rgs_lang', next);
    } catch {
      /* almacenamiento no disponible: el idioma solo dura esta visita */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = meta.title[lang];
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description[lang]);
  }, [lang]);

  const t = useCallback((value: string | L) => (typeof value === 'string' ? value : value[lang]), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
