import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Only register service worker if not in StackBlitz
const isStackBlitz = window.location.hostname.includes('stackblitz');

if (!isStackBlitz) {
  registerSW({ 
    immediate: true,
    onNeedRefresh() {
      // Handle PWA updates if needed
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);