import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SpoilerProvider } from '@/context/SpoilerContext';
import App from './App';
import './styles/tokens.css';
import './styles/base.css';
import './styles/system.css';
import './styles/chrome.css';
import './styles/pages.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SpoilerProvider>
        <App />
      </SpoilerProvider>
    </BrowserRouter>
  </StrictMode>,
);
