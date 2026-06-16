import { useEffect, useState } from "react";
import "./App.css";
import type { AppState } from "./types";

// Composants
import SetupWizard from "./components/SetupWizard";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Stock from "./components/Stock";
import Sales from "./components/Sales";
import Reports from "./components/Reports";
import Settings from "./components/Settings";

function App() {
  const [appState, setAppState] = useState<AppState>({
    isConfigured: false
  });
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');
  const [db, setDb] = useState<any>(null);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      // Détection de l'environnement Tauri de manière plus fiable
      // En mode web avec vite.config.web.ts, __TAURI__ est défini comme undefined
      // En mode desktop, __TAURI__ est un objet
      const isTauri = typeof window !== 'undefined' && 
                      '__TAURI__' in window && 
                      (window as any).__TAURI__ !== undefined &&
                      typeof (window as any).__TAURI__ === 'object';
      
      console.log('Environnement détecté:', isTauri ? 'Tauri (Desktop)' : 'Web (Browser)');
      
      // Charger le service database approprié
      let database;
      if (isTauri) {
        // Mode Desktop - Utiliser Tauri Store
        const dbModule = await import('./services/database');
        database = dbModule.db;
        console.log('Service chargé: database.ts (Tauri Store)');
      } else {
        // Mode Web - Utiliser localStorage
        const dbModule = await import('./services/database.web');
        database = dbModule.db;
        console.log('Service chargé: database.web.ts (localStorage)');
      }
      
      setDb(database);
      
      const state = await database.getAppState();
      setAppState(state);
      
      // Créer une sauvegarde automatique au démarrage (seulement en mode desktop)
      if (state.isConfigured && isTauri) {
        await database.createAutoBackup();
      }
      
      // Écouter l'événement de chargement des données de démo (mode web uniquement)
      if (!isTauri && 'loadDemoData' in database) {
        window.addEventListener('load-demo-data', async () => {
          await (database as any).loadDemoData();
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupComplete = async (companyInfo: any) => {
    if (!db) return;
    await db.setConfigured(companyInfo);
    setAppState({
      isConfigured: true,
      companyInfo
    });
  };

  if (loading) {
    const isTauri = typeof window !== 'undefined' && 
                    '__TAURI__' in window && 
                    (window as any).__TAURI__ !== undefined &&
                    typeof (window as any).__TAURI__ === 'object';
    
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-main)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '6px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <h2 style={{ color: 'var(--text-primary)' }}>Chargement de LOGIMAK...</h2>
          {!isTauri && (
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Mode démonstration
            </p>
          )}
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!appState.isConfigured) {
    return <SetupWizard onComplete={handleSetupComplete} />;
  }

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Tableau de Bord';
      case 'stock': return 'Gestion du Stock';
      case 'sales': return 'Gestion des Ventes';
      case 'reports': return 'Rapports';
      case 'settings': return 'Paramètres';
      default: return 'LOGIMAK';
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'stock':
        return <Stock />;
      case 'sales':
        return <Sales />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={setCurrentView}
      pageTitle={getPageTitle()}
    >
      {renderView()}
    </Layout>
  );
}

export default App;
