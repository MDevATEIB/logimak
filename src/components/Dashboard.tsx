import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  FileText
} from 'lucide-react';
import { db } from '../services/database';
import type { DashboardStats } from '../types';

interface DashboardProps {
  onNavigate?: (view: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps = {}) {
  const [stats, setStats] = useState<DashboardStats>({
    dailyRevenue: 0,
    monthlyRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    lowStockProducts: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await db.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid var(--border)',
            borderTopColor: 'var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: 'var(--text-secondary)' }}>Chargement des données...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Chiffre d'affaires du jour</div>
            </div>
            <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              <DollarSign size={24} />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.dailyRevenue)}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>Aujourd'hui</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Chiffre d'affaires du mois</div>
            </div>
            <div className="stat-icon" style={{ background: '#dcfce7', color: 'var(--success)' }}>
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="stat-value">{formatCurrency(stats.monthlyRevenue)}</div>
          <div className="stat-change positive">
            <TrendingUp size={16} />
            <span>Ce mois</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Nombre de ventes</div>
            </div>
            <div className="stat-icon" style={{ background: '#fef3c7', color: 'var(--warning)' }}>
              <ShoppingCart size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.totalSales}</div>
          <div className="stat-change">
            <span>Total des transactions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Produits en stock</div>
            </div>
            <div className="stat-icon" style={{ background: '#e0e7ff', color: 'var(--info)' }}>
              <Package size={24} />
            </div>
          </div>
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-change">
            <span>Articles disponibles</span>
          </div>
        </div>
      </div>

      {stats.lowStockProducts > 0 && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-body" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--spacing-md)',
            background: '#fef3c7',
            borderLeft: '4px solid var(--warning)'
          }}>
            <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
            <div>
              <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                Alerte stock faible
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {stats.lowStockProducts} produit(s) ont atteint ou dépassé le seuil minimum de stock
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Aperçu rapide</h2>
            <p className="card-description">Vue d'ensemble de votre activité</p>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: 'var(--spacing-md)',
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ventes du jour</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(stats.dailyRevenue)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: 'var(--spacing-md)',
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Ventes du mois</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(stats.monthlyRevenue)}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: 'var(--spacing-md)',
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total transactions</span>
                <span style={{ fontWeight: 600 }}>{stats.totalSales}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Actions rapides</h2>
            <p className="card-description">Accès direct aux fonctionnalités principales</p>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNavigate('sales')}
              >
                <ShoppingCart size={20} />
                Nouvelle vente
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNavigate('stock')}
              >
                <Package size={20} />
                Ajouter un produit
              </button>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'flex-start' }}
                onClick={() => handleNavigate('reports')}
              >
                <FileText size={20} />
                Voir les rapports
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <h2 className="card-title">Bienvenue dans LOGIMAK</h2>
          <p className="card-description">
            Votre solution de gestion commerciale professionnelle
          </p>
        </div>
        <div className="card-body">
          <p style={{ marginBottom: 'var(--spacing-md)', lineHeight: 1.6 }}>
            LOGIMAK est conçu pour vous aider à gérer efficacement votre activité commerciale. 
            Avec une interface intuitive et des fonctionnalités puissantes, vous pouvez suivre 
            vos stocks, gérer vos ventes et générer des rapports détaillés en toute simplicité.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 'var(--spacing-md)',
            marginTop: 'var(--spacing-lg)'
          }}>
            <div style={{ 
              padding: 'var(--spacing-md)', 
              background: 'var(--bg-main)', 
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <Package size={32} style={{ margin: '0 auto var(--spacing-sm)', color: 'var(--primary)' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Gestion du stock</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Suivez vos produits et gérez les quantités facilement
              </p>
            </div>
            <div style={{ 
              padding: 'var(--spacing-md)', 
              background: 'var(--bg-main)', 
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <ShoppingCart size={32} style={{ margin: '0 auto var(--spacing-sm)', color: 'var(--success)' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Ventes rapides</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Créez des factures professionnelles en quelques clics
              </p>
            </div>
            <div style={{ 
              padding: 'var(--spacing-md)', 
              background: 'var(--bg-main)', 
              borderRadius: 'var(--radius-md)',
              textAlign: 'center'
            }}>
              <FileText size={32} style={{ margin: '0 auto var(--spacing-sm)', color: 'var(--warning)' }} />
              <h4 style={{ marginBottom: '0.5rem' }}>Rapports détaillés</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Analysez vos performances avec des rapports complets
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
