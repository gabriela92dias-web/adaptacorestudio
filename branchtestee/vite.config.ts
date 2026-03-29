import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig(() => ({
  plugins: [
    react(),
  ],
  build: {
    assetsDir: "_assets",
  },
  server: {
    host: true,
    port: 5555,
    strictPort: true,
    proxy: {
      '/_api': 'http://127.0.0.1:3333'
    }
  }
}));
