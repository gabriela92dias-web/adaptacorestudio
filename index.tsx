import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import {
  HelmetProvider,
} from "react-helmet-async"

import { supabase } from './helpers/supabase';

// Monkeypatch fetch para injetar tokens em todas as chamadas `_api/coreact/*`.
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const [resource, config] = args;
  if (typeof resource === 'string' && resource.startsWith('/_api/coreact/')) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      const newConfig = config || {};
      const newHeaders = new Headers(newConfig.headers || {});
      if (!newHeaders.has("Authorization")) {
        newHeaders.set("Authorization", `Bearer ${session.access_token}`);
      }
      newConfig.headers = newHeaders;
      return originalFetch(resource, newConfig);
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
    