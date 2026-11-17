import '@fontsource-variable/stack-sans-notch/wght.css';
import '@fontsource-variable/stack-sans-text/wght.css';
import './styles/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
