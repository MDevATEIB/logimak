import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration Vite pour la version WEB (démo en ligne)
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'rename-index',
      closeBundle: async () => {
        const fs = await import('fs');
        const path = await import('path');
        const distPath = path.resolve(__dirname, 'dist-web');
        const webHtmlPath = path.join(distPath, 'index.web.html');
        const indexHtmlPath = path.join(distPath, 'index.html');
        
        if (fs.existsSync(webHtmlPath)) {
          fs.renameSync(webHtmlPath, indexHtmlPath);
          console.log('✓ Renamed index.web.html to index.html');
        }
      }
    }
  ],
  
  // Utiliser index.web.html comme point d'entrée
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.web.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: 'dist-web',
    emptyOutDir: true
  },
  
  // Configuration du serveur de développement
  server: {
    port: 5174,
    strictPort: false,
    open: true
  },
  
  // Base URL pour le déploiement sur GitHub Pages
  base: '/logimak/',
  
  // Définir explicitement que nous ne sommes pas dans Tauri
  define: {
    '__TAURI__': 'undefined',
    '__TAURI_METADATA__': 'undefined'
  }
});
