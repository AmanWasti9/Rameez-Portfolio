import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/bricolage-grotesque/standard.css';
import '@fontsource-variable/geist';
import './styles.css';
import App from './App';
import { startLenis } from './lib/motion';

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
startLenis();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
