import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18N } from './i18n.js';

const LangContext = createContext(null);

export function LangProvider({ initial = 'en', children }) {
  const [lang, setLangState] = useState(initial);

  useEffect(() => {
    const d = I18N[lang] || I18N.en;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.removeAttribute('data-lang-pending');
    document.title = d['meta.title'];
    document.querySelector('meta[name="description"]')?.setAttribute('content', d['meta.desc']);
  }, [lang]);

  const setLang = useCallback(next => {
    setLangState(next);
    try {
      localStorage.setItem('rgs_lang', next);
    } catch (e) {}
  }, []);

  const value = useMemo(() => {
    const d = I18N[lang] || I18N.en;
    const t = k => (d[k] != null ? d[k] : I18N.en[k] || '');
    return { lang, setLang, t, locale: lang === 'es' ? 'es-ES' : 'en-US' };
  }, [lang, setLang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

/** HTML de un nodo de contenido: {k: clave_i18n} o {h: html literal}. */
export function useHtml() {
  const { t } = useLang();
  return useCallback(v => (v == null ? '' : typeof v === 'string' ? t(v) : v.k ? t(v.k) : v.h), [t]);
}

/** Texto plano (sin etiquetas) de un nodo de contenido. */
export const plain = html =>
  html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

/** Renderiza un nodo de contenido (o una clave i18n) conservando su HTML (<b>, <em>, <br>). */
export function Tx({ v, as: Tag = 'span', ...rest }) {
  const html = useHtml();
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: html(v) }} />;
}

/** Divide un título con <br> y <em> en líneas de segmentos {text, em}. */
export function lines(html) {
  return html.split(/<br\s*\/?>/i).map(line => {
    const out = [];
    const re = /<em>(.*?)<\/em>/gi;
    let last = 0;
    let m;
    while ((m = re.exec(line))) {
      if (m.index > last) out.push({ text: plain(line.slice(last, m.index)), em: false });
      out.push({ text: plain(m[1]), em: true });
      last = re.lastIndex;
    }
    if (last < line.length) out.push({ text: plain(line.slice(last)), em: false });
    return out;
  });
}
