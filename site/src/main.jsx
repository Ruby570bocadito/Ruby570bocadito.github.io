import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

const root = document.getElementById('root');
const lang = window.__initialLang === 'es' ? 'es' : 'en';
const app = <App initialLang={lang} />;

// El HTML viene prerenderizado en inglés: se hidrata si coincide el idioma, si no se renderiza de nuevo.
if (root.hasChildNodes() && lang === 'en') hydrateRoot(root, app);
else createRoot(root).render(app);
