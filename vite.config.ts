import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/status': {
        target: 'https://global-tools-api-534113739138.europe-west1.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/status/, '/api/status'),
        secure: true,
      },
      '/api/outbound-call': {
        target: 'https://phone-outbound-534113739138.europe-west1.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/outbound-call/, '/outbound-call'),
      },
      '/api': {
        target: 'https://yaytravel-backend-534113739138.europe-west1.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
