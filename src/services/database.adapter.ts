// Adaptateur qui détecte automatiquement l'environnement et charge le bon service
// Desktop (Tauri) ou Web (Browser)

// Détection de l'environnement
const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

// Export conditionnel du bon service
export const db = isTauri 
  ? await import('./database').then(m => m.db)
  : await import('./database.web').then(m => m.db);

// Type helper pour TypeScript
export type Database = typeof db;
