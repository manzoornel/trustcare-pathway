
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { FestivalProvider } from '@/contexts/FestivalContext'

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

// The static SEO title/description/canonical (written at build time for crawlers)
// are removed once the app runs, so react-helmet's per-page tags don't duplicate them.
document.querySelectorAll("meta[data-static-seo], link[data-static-seo]").forEach((el) => el.remove());

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Installability is a nice-to-have, not a hard requirement — if
      // registration fails for any reason, the site still works normally.
    });
  });
}

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <FestivalProvider>
            <App />
          </FestivalProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
