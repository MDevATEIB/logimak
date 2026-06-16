import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Configuration Vite pour la version WEB (démo en ligne)
export default defineConfig({
  plugins: [react()],
  
  // Utiliser index.web.html comme point d'entrée
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.web.html')
      }
    },
    outDir: 'dist-web'
  },
  
  // Configuration du serveur de développement
  server: {
    port: 5174, // Port différent pour éviter les conflits
    strictPort: false,
    open: true
  },
  
  // Base URL pour le déploiement sur GitHub Pages
  base: './',
  
  // Définir explicitement que nous ne sommes pas dans Tauri
  define: {
    '__TAURI__': 'undefined',
    '__TAURI_METADATA__': 'undefined'
  }
});
