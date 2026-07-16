import React from 'react';
import ReactDOM from 'react-dom/client';
import { inject } from '@vercel/analytics';
import App from './App';
import './index.css';
import 'katex/dist/katex.min.css';

// A deploy replaces the hashed chunk files, so a tab that loaded the old
// index.html 404s on its next lazy import. Vite reports those as
// 'vite:preloadError' — reload once to pick up the fresh manifest. The
// timestamp guard keeps a persistent failure (offline, blocked chunk) from
// reload-looping: a second failure inside the window falls through to the
// router's error screen instead.
const PRELOAD_RELOAD_AT_KEY = 'vitePreloadErrorReloadedAt';
const PRELOAD_RELOAD_MIN_INTERVAL_MS = 30_000;

window.addEventListener('vite:preloadError', (event) => {
  let lastReloadAt = 0;
  try {
    lastReloadAt = Number(globalThis.sessionStorage.getItem(PRELOAD_RELOAD_AT_KEY)) || 0;
    globalThis.sessionStorage.setItem(PRELOAD_RELOAD_AT_KEY, String(Date.now()));
  } catch {
    // Without storage the loop guard can't work across reloads; let the
    // error screen (with its own "Try again") handle it instead.
    return;
  }

  if (Date.now() - lastReloadAt < PRELOAD_RELOAD_MIN_INTERVAL_MS) {
    return;
  }

  event.preventDefault();
  window.location.reload();
});

// Privacy-friendly page analytics (no cookies). Enable Web Analytics for the
// project in the Vercel dashboard; outside production this only debug-logs.
inject();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
