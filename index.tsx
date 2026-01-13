import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const mount = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const hideLoader = () => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        if (loader.parentNode) loader.remove();
      }, 500);
    }
  };

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    // Success path - ensure loader is gone
    hideLoader();
  } catch (err) {
    console.error("Mounting error:", err);
    // Even on error, clear loader to let diagnostic screen show
    hideLoader();
  }
};

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mount();
} else {
  document.addEventListener('DOMContentLoaded', mount);
}