import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import {
  HelmetProvider,
} from "react-helmet-async"

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
    