import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => ({
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    assetsDir: "_assets",
  },
  server: {
    host: true,
    port: 3001,
    strictPort: true,
    proxy: {
      '/_api': 'http://127.0.0.1:3333'
    }
  }
}));
