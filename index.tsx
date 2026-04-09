import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import {
  HelmetProvider,
} from "react-helmet-async"

import { supabase } from './helpers/supabase-client';

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
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // Forçando log sempre como erro para que apareça na tela do usuário que está filtrando
    console.error(`[A V I S O   F E T C H] Interceptado:`, urlString);
    
    if (error) console.error(`[A V I S O   F E T C H] Supabase GetSession Error:`, error);

    if (session?.access_token) {
      console.error(`[A V I S O   F E T C H] Token encontrado para o usuário. Injetando...`);
      const newConfig: any = config ? { ...config } : {};
      let newHeaders = new Headers();
      if (resource instanceof Request) {
         newHeaders = new Headers(resource.headers);
      } else if (newConfig.headers) {
         newHeaders = new Headers(newConfig.headers);
      }

      newHeaders.set("Authorization", `Bearer ${session.access_token}`);
      newHeaders.set("X-Coreact-Auth", `Bearer ${session.access_token}`);
      
      newConfig.headers = newHeaders;

      if (resource instanceof Request) {
          const newRequest = new Request(resource, newConfig);
          return originalFetch(newRequest);
      } else {
          return originalFetch(resource, newConfig);
      }
    } else {
      console.error(`[A V I S O   F E T C H] Sem sessão existente! Requisição poderá falhar (401).`);
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
    