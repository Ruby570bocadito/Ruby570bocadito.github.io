import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource/eczar/500.css';
import '@fontsource/eczar/600.css';
import '@fontsource/eczar/700.css';
import '@fontsource-variable/work-sans';
import App from './App.jsx';
// Después de App: así styles.css va detrás de los CSS de los componentes y los puede ajustar.
import './styles.css';

// En producción el HTML llega prerenderizado (scripts/build.mjs) y se hidrata; en desarrollo se renderiza.
const root = document.getElementById('root');
if (root.firstElementChild) hydrateRoot(root, <App />);
else createRoot(root).render(<App />);
