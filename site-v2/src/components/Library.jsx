import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useT } from '../i18n.jsx';
import { BOOKS, KINDS, SHELVES, eventStamp } from '../library.js';
import { PeriSprite } from './Peri.jsx';
import { Icon, SectionHead, asset } from './ui.jsx';

const norm = s => (s ?? '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const plain = v => (typeof v === 'string' ? v : v?.es ?? '');

// Medidas y tono de cada lomo: siempre las mismas para el mismo libro (sin azar), así el HTML prerenderizado
// coincide con el del navegador. El ancho depende del largo del título en el idioma que se ve.
function spine(book, title) {
  const h = hash(book.id);
  const height = 172 + (h % 4) * 14;
  const perLine = Math.max(10, Math.floor((height - 62) / 7.6));
  const lines = Math.min(3, Math.ceil(title.length / perLine));
  return { height, width: 26 + lines * 17 + (h % 3) * 2, tone: h % 3 };
}

const STAMP_INK = {
  'Código abierto': 'green', Completado: 'green', Participé: 'green',
  'Solo laboratorio': 'red', 'Ahora mismo': 'red',
  Obtenida: 'blue', Próximamente: 'blue',
  'En curso': 'amber', Finalista: 'gold', Diploma: 'gold'
};

const BookIcon = ({ book, size }) =>
  book.logo ? <img className="book-logo" src={asset(book.logo)} alt="" width={size} height={size} /> : <span aria-hidden="true">{book.emoji}</span>;

// El README llega ya limpio de public/readmes (scripts/fetch-readmes.mjs lo pasa por sanitize-html al generarlo).
function Readme({ repo, url }) {
  const { t } = useT();
  const [html, setHtml] = useState(null);
  useEffect(() => {
    let alive = true;
    fetch(asset(`readmes/${repo}.html`))
      .then(r => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then(text => alive && setHtml(text))
      .catch(() => alive && setHtml(''));
    return () => {
      alive = false;
    };
  }, [repo]);
  if (html === null) {
    return (
      <div className="ficha-loading">
        <PeriSprite decorative pose="detective" className="ficha-peri" />
        <p>{t('ficha.loading')}</p>
      </div>
    );
  }
  if (!html) {
    return <p className="ficha-note">{t('ficha.error')} <a className="link-arrow" href={url} target="_blank" rel="noreferrer">{t('ficha.openGithub')}</a></p>;
  }
  return <article className="readme" dangerouslySetInnerHTML={{ __html: html }} />;
}

// Lo que dice la ficha cuando el libro no tiene ni imagen ni README.
function emptyNote(book, t, tr) {
  if (book.shelf === 'red') return { pose: 'detective', text: t('empty.red') };
  if (book.kind === 'certificaciones') return { pose: 'glasses', text: t('empty.cert') };
  if (book.kind === 'hackatones') return { pose: 'party', text: tr(book.date) ?? t('empty.hack') };
  return { pose: 'thumbsup', text: t('empty.project') };
}

function Ficha({ book, stampKey, onClose }) {
  const { t, tr, stamp } = useT();
  const close = useRef(null);
  useEffect(() => {
    close.current?.focus();
    const onKey = e => e.key === 'Escape' && onClose();
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      root.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const title = tr(book.title);
  const links = [book.url && { label: book.kind === 'proyectos' ? t('ficha.github') : t('ficha.repo'), href: book.url }, ...(book.links ?? [])].filter(Boolean);
  const big = Boolean(book.image || book.readme);
  const empty = big ? null : emptyNote(book, t, tr);
  return (
    <motion.div className="ficha-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.article
        className={`ficha${big ? ' ficha-big' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ficha-title"
        onClick={e => e.stopPropagation()}
        initial={{ y: 60, rotate: -3, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, rotate: big ? 0 : -0.8, opacity: 1, scale: 1 }}
        exit={{ y: 40, rotate: 2, opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <header className="ficha-head">
          <span className={`ficha-icon book-${book.shelf}`}><BookIcon book={book} size={38} /></span>
          <div className="ficha-heading">
            <p className="ficha-sig">{t('ficha.sig')} <b>{book.id}</b> · {tr(book.shelfLabel)}</p>
            <h3 id="ficha-title">{title}</h3>
          </div>
          {stampKey && <span className={`stamp stamp-${STAMP_INK[stampKey] ?? 'blue'}`} aria-label={t('ficha.state', { s: stamp(stampKey) })}>{stamp(stampKey)}</span>}
          <button ref={close} type="button" className="ficha-close" onClick={onClose} aria-label={t('ficha.close')}>×</button>
        </header>
        <div className="ficha-body">
          <aside className="ficha-side">
            <dl className="ficha-fields">
              <div><dt>{t('ficha.author')}</dt><dd>Gálvez Silipo, Rafael</dd></div>
              {book.org && <div><dt>{t('ficha.org')}</dt><dd>{tr(book.org)}</dd></div>}
              {book.date ? <div><dt>{t('ficha.date')}</dt><dd>{tr(book.date)}</dd></div> : book.year && <div><dt>{t('ficha.edition')}</dt><dd>{book.year}</dd></div>}
              {book.lang && <div><dt>{t('ficha.lang')}</dt><dd>{book.lang}</dd></div>}
              {book.stars > 0 && <div><dt>{t('ficha.stars')}</dt><dd>{t('ficha.starsValue', { n: book.stars })}</dd></div>}
            </dl>
            <p className="ficha-text">{tr(book.text)}</p>
            {book.tags?.length > 0 && <div className="chips">{book.tags.map(tag => <span key={plain(tag)}>{tr(tag)}</span>)}</div>}
            {links.length > 0 && (
              <div className="ficha-links">
                {links.map(l => <a key={l.href} className="link-arrow" href={l.href} target="_blank" rel="noreferrer">{tr(l.label)} <Icon.external width={16} height={16} /></a>)}
              </div>
            )}
          </aside>
          {big ? (
            <div className="ficha-main">
              {book.image && (
                <a className="ficha-doc" href={asset(book.image)} target="_blank" rel="noreferrer" title={t('ficha.full')}>
                  <img src={asset(book.image)} alt={t('ficha.cert', { title })} />
                </a>
              )}
              {book.readme && <Readme repo={book.readme} url={book.url} />}
            </div>
          ) : (
            <div className="ficha-empty">
              <PeriSprite decorative pose={empty.pose} className="ficha-peri" />
              <p>{empty.text}</p>
            </div>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function Library() {
  const { t, tr, lang } = useT();
  const [kind, setKind] = useState('todo');
  const [query, setQuery] = useState('');
  const [view, setView] = useState('shelf');
  const [open, setOpen] = useState(null);
  const [now, setNow] = useState(null); // también indica que ya estamos en el navegador
  const opener = useRef(null);
  useEffect(() => setNow(new Date()), []);

  // Se busca en los dos idiomas a la vez: así "redes" y "networking" encuentran lo mismo.
  const matches = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return BOOKS;
    const both = v => (v && typeof v === 'object' && 'es' in v ? `${v.es} ${v.en}` : v ?? '');
    return BOOKS.filter(b => norm([b.title, b.text, b.org, b.lang, b.date, b.shelfLabel, ...(b.tags ?? [])].map(both).join(' ')).includes(q));
  }, [query]);
  const counts = useMemo(() => {
    const c = { todo: matches.length };
    for (const b of matches) c[b.kind] = (c[b.kind] ?? 0) + 1;
    return c;
  }, [matches]);
  const shown = kind === 'todo' ? matches : matches.filter(b => b.kind === kind);
  const shelves = SHELVES.map(s => ({ ...s, books: shown.filter(b => b.shelf === s.id) })).filter(s => s.books.length);
  const count = n => `${n} ${n === 1 ? t('lib.book') : t('lib.books')}`;

  const openBook = (book, el) => {
    opener.current = el;
    setOpen(book);
  };
  const closeBook = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  return (
    <section className="section section-alt library" id="biblioteca">
      <div className="wrap">
        <SectionHead kicker={t('lib.kicker')} title={t('lib.title')} lead={t('lib.lead')} />

        <div className="lib-toolbar">
          <div className="lib-tabs" role="group" aria-label={t('lib.show')}>
            {KINDS.map(k => (
              <button key={k.id} type="button" aria-pressed={kind === k.id} onClick={() => setKind(k.id)}>
                {kind === k.id && <motion.span layoutId="lib-tab" className="lib-tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{tr(k.label)}</span>
                <span className="lib-count">{counts[k.id] ?? 0}</span>
              </button>
            ))}
          </div>
          <label className="lib-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={t('lib.search')} aria-label={t('lib.searchLabel')} />
          </label>
          <div className="lib-view" role="group" aria-label={t('lib.view')}>
            <button type="button" aria-pressed={view === 'shelf'} onClick={() => setView('shelf')}>{t('lib.shelves')}</button>
            <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>{t('lib.list')}</button>
          </div>
        </div>
        <p className="lib-result" aria-live="polite">{count(shown.length)}{query && t('lib.for', { q: query })}</p>

        {shown.length === 0 && (
          <div className="lib-empty">
            <PeriSprite decorative pose="sorry" className="lib-empty-peri" />
            <p>{t('lib.empty', { q: query })}</p>
          </div>
        )}

        {view === 'shelf' ? (
          <div className="shelves">
            {shelves.map(s => (
              <div key={s.id} className="shelf">
                <div className="shelf-head">
                  <h3 className="shelf-plaque"><span aria-hidden="true">{s.emoji}</span> {tr(s.label)}</h3>
                  <span className="shelf-count">{count(s.books.length)}</span>
                  {s.note && <span className="shelf-note">{tr(s.note)}</span>}
                </div>
                <div className="shelf-unit">
                  <ul className="shelf-row">
                    <AnimatePresence initial={false} mode="popLayout">
                      {s.books.map(b => {
                        const title = tr(b.title);
                        const m = spine(b, title);
                        return (
                          <motion.li key={b.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
                            <button
                              type="button"
                              className={`book book-${b.shelf} tone-${m.tone}`}
                              style={{ height: m.height, width: m.width }}
                              title={title}
                              data-book={b.id}
                              aria-label={t('lib.open', { title, shelf: tr(b.shelfLabel) })}
                              onClick={e => openBook(b, e.currentTarget)}
                            >
                              <span className="book-emoji"><BookIcon book={b} size={22} /></span>
                              <span className="book-title">{title}</span>
                              <span className="book-foot">{b.year || b.lang || '·'}</span>
                            </button>
                          </motion.li>
                        );
                      })}
                    </AnimatePresence>
                    {s.id === 'ai' && (
                      <li className="bookend">
                        <PeriSprite pose="detective" every={6500} className="bookend-peri" label={t('lib.bookend')} />
                      </li>
                    )}
                  </ul>
                  <div className="shelf-board" aria-hidden="true" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="lib-list">
            <AnimatePresence initial={false} mode="popLayout">
              {shown.map(b => (
                <motion.li key={b.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.2 }}>
                  <button type="button" className={`lib-item book-${b.shelf} tone-${spine(b, tr(b.title)).tone}`} onClick={e => openBook(b, e.currentTarget)}>
                    <span className="lib-spine" aria-hidden="true" />
                    <span className="lib-body">
                      <small><BookIcon book={b} size={16} /> {tr(b.shelfLabel)}{b.year ? ` · ${b.year}` : ''}</small>
                      <b>{tr(b.title)}</b>
                      <span>{tr(b.text)}</span>
                    </span>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {/* En <body>, para que la ficha quede por encima de todo (también de Peri). */}
      {now && createPortal(
        <AnimatePresence>
          {open && <Ficha key={`${open.id}-${lang}`} book={open} stampKey={eventStamp(open, now)} onClose={closeBook} />}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
