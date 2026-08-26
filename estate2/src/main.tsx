import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { RootProvider } from '@/state/RootProvider';
import '@/styles/tokens.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <RootProvider>
        <App />
      </RootProvider>
    </BrowserRouter>
  </StrictMode>
);
