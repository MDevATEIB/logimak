import { ReactNode } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  Building2
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
  pageTitle: string;
}

const navItems = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { id: 'stock', label: 'Stock', icon: Package },
  { id: 'sales', label: 'Ventes', icon: ShoppingCart },
  { id: 'reports', label: 'Rapports', icon: FileText },
  { id: 'settings', label: 'Paramètres', icon: Settings }
];

export default function Layout({ children, currentView, onNavigate, pageTitle }: LayoutProps) {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Building2 size={32} />
            <span>LOGIMAK</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <p>Propulsé par MakkaDev</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
            Version 1.0.0
          </p>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <h1 className="topbar-title">{pageTitle}</h1>
          <div className="topbar-actions">
            <div style={{ 
              padding: '0.5rem 1rem',
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)'
            }}>
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
