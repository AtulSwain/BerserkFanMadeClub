import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { SpoilerProvider } from '@/context/SpoilerContext';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/system.css';
import './styles/chrome.css';
import './styles/pages.css';

// Hash routing for static hosts without SPA fallback (e.g. a single-file preview);
// path routing under the configured base everywhere else (e.g. GitHub Pages).
const useHash = import.meta.env.VITE_ROUTER === 'hash';
const Router = useHash ? HashRouter : BrowserRouter;
const basename = useHash ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename={basename}>
      <SpoilerProvider>
        <App />
      </SpoilerProvider>
    </Router>
  </StrictMode>,
);
