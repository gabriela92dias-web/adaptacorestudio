import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import {
  HelmetProvider,
} from "react-helmet-async"

import { supabase } from './helpers/supabase';

// Recarregar a página caso haja erro de chunk falho ao buscar o módulo dinâmico após um novo deploy no Render.
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});
window.addEventListener('error', (e) => {
  if (e.message && e.message.includes('Failed to fetch dynamically imported module')) {
    e.preventDefault();
    window.location.reload();
  }
});

// Monkeypatch fetch para injetar tokens em todas as chamadas `_api/coreact/*`.
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource, config] = args;
  
  // Extrai a URL para garantir a verificação correta.
  let urlString = '';
  if (typeof resource === 'string') {
    urlString = resource;
  } else if (resource instanceof URL) {
    urlString = resource.toString();
  } else if (resource instanceof Request) {
    urlString = resource.url;
  }

  if (urlString.includes('_api/coreact')) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      const newConfig: any = config ? { ...config } : {};
      let newHeaders = new Headers();
      if (resource instanceof Request) {
         newHeaders = new Headers(resource.headers);
      } else if (newConfig.headers) {
         newHeaders = new Headers(newConfig.headers);
      }

      if (!newHeaders.has("Authorization")) {
        newHeaders.set("Authorization", `Bearer ${session.access_token}`);
      }
      
      newConfig.headers = newHeaders;

      if (resource instanceof Request) {
          const newRequest = new Request(resource, newConfig);
          return originalFetch(newRequest);
      } else {
          return originalFetch(resource, newConfig);
      }
    }
  }
  return originalFetch(...args);
};

console.log("🔥 ENTRYPOINT INDEX.TSX STARTING EXECUTION! 🔥");

try {
  const container = document.getElementById("root") as HTMLDivElement;
  if (!container) {
    console.error("🔥 ERROR: ROOT CONTAINER NOT FOUND! 🔥");
  } else {
    console.log("🔥 ROOT CONTAINER FOUND, MOUNTING REACT... 🔥");
    createRoot(container).render(<HelmetProvider><App /></HelmetProvider>);
    console.log("🔥 REACT MOUNT COMMAND ISSUED! 🔥");
  }
} catch (e) {
  console.error("🔥 CRITICAL ERROR DURING REACT MOUNT 🔥", e);
}
    