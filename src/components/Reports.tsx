import { useEffect, useState } from 'react';
import { FileText, Calendar, Printer, TrendingUp, Package } from 'lucide-react';
import type { Sale, Product } from '../types';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReportsProps {
  db: any;
}

export default function Reports({ db }: ReportsProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reportType, setReportType] = useState<'sales' | 'stock' | 'revenue'>('sales');
  const [dateRange, setDateRange] = useState<'today' | 'month' | 'year' | 'custom'>('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const salesData = await db.getSales();
    const productsData = await db.getProducts();
    setSales(salesData);
    setProducts(productsData);
  };

  const getFilteredSales = () => {
    const now = new Date();
    let filtered = sales;

    switch (dateRange) {
      case 'today':
        const today = format(now, 'yyyy-MM-dd');
        filtered = sales.filter(s => s.date.startsWith(today));
        break;
      case 'month':
        const monthStart = format(startOfMonth(now), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(now), 'yyyy-MM-dd');
        filtered = sales.filter(s => s.date >= monthStart && s.date <= monthEnd);
        break;
      case 'year':
        const yearStart = format(startOfYear(now), 'yyyy-MM-dd');
        const yearEnd = format(endOfYear(now), 'yyyy-MM-dd');
        filtered = sales.filter(s => s.date >= yearStart && s.date <= yearEnd);
        break;
      case 'custom':
        if (startDate && endDate) {
          filtered = sales.filter(s => s.date >= startDate && s.date <= endDate);
        }
        break;
    }

    return filtered;
  };

  const getSalesReport = () => {
    const filteredSales = getFilteredSales();
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = filteredSales.length;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      filteredSales,
      totalRevenue,
      totalTransactions,
      averageTransaction
    };
  };

  const getStockReport = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockProducts = products.filter(p => p.minQuantity && p.quantity <= p.minQuantity);
    const outOfStockProducts = products.filter(p => p.quantity === 0);

    return {
      totalProducts,
      totalValue,
      lowStockProducts,
      outOfStockProducts,
      products
    };
  };

  const printReport = async () => {
    const companyInfo = await db.getCompanyInfo();
    if (!companyInfo) {
      alert('Veuillez configurer les informations de l\'entreprise dans les paramètres');
      return;
    }

    // Générer le HTML du rapport
    const reportHTML = generateReportHTML(companyInfo);
    
    // Créer un iframe temporaire pour l'impression
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
    
    const frameDoc = printFrame.contentWindow?.document;
    if (!frameDoc) return;
    
    frameDoc.open();
    frameDoc.write(reportHTML);
    frameDoc.close();
    
    // Attendre que le contenu soit chargé
    setTimeout(() => {
      printFrame.contentWindow?.print();
      // Nettoyer après l'impression
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 100);
    }, 250);
  };

  const generateReportHTML = (companyInfo: any) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(amount);
    };

    const now = new Date();
    const reportTitle = reportType === 'sales' ? 'Rapport des Ventes' :
                       reportType === 'stock' ? 'Rapport du Stock' :
                       'Rapport du Chiffre d\'Affaires';
    
    let reportContent = '';
    
    if (reportType === 'sales') {
      const salesData = getSalesReport();
      reportContent = `
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-label">Chiffre d'affaires</div>
            <div class="stat-value">${formatCurrency(salesData.totalRevenue)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Transactions</div>
            <div class="stat-value">${salesData.totalTransactions}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Panier moyen</div>
            <div class="stat-value">${formatCurrency(salesData.averageTransaction)}</div>
          </div>
        </div>
        
        ${salesData.filteredSales.length > 0 ? `
          <h3>Détail des ventes</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Facture</th>
                <th>Date</th>
                <th>Client</th>
                <th>Articles</th>
                <th style="text-align: right">Montant</th>
              </tr>
            </thead>
            <tbody>
              ${salesData.filteredSales.map(sale => `
                <tr>
                  <td><strong>${sale.invoiceNumber}</strong></td>
                  <td>${format(new Date(sale.date), 'd MMM yyyy HH:mm', { locale: fr })}</td>
                  <td>${sale.customerName || '-'}</td>
                  <td>${sale.items.length}</td>
                  <td style="text-align: right"><strong>${formatCurrency(sale.total)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="no-data">Aucune vente pour cette période</p>'}
      `;
    } else if (reportType === 'stock') {
      const stockData = getStockReport();
      reportContent = `
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-label">Total produits</div>
            <div class="stat-value">${stockData.totalProducts}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Valeur totale</div>
            <div class="stat-value">${formatCurrency(stockData.totalValue)}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Stock faible</div>
            <div class="stat-value">${stockData.lowStockProducts.length}</div>
          </div>
        </div>
        
        ${stockData.lowStockProducts.length > 0 ? `
          <h3>Produits en stock faible</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité actuelle</th>
                <th>Stock minimum</th>
                <th style="text-align: right">Valeur</th>
              </tr>
            </thead>
            <tbody>
              ${stockData.lowStockProducts.map(product => `
                <tr>
                  <td><strong>${product.name}</strong></td>
                  <td>${product.quantity}</td>
                  <td>${product.minQuantity}</td>
                  <td style="text-align: right">${formatCurrency(product.price * product.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
        
        <h3>Inventaire complet</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th style="text-align: right">Prix unitaire</th>
              <th style="text-align: right">Quantité</th>
              <th style="text-align: right">Valeur totale</th>
            </tr>
          </thead>
          <tbody>
            ${stockData.products.map(product => `
              <tr>
                <td>
                  <strong>${product.name}</strong>
                  ${product.description ? `<br><span style="font-size: 11px; color: #666">${product.description}</span>` : ''}
                </td>
                <td style="text-align: right">${formatCurrency(product.price)}</td>
                <td style="text-align: right"><strong>${product.quantity}</strong></td>
                <td style="text-align: right"><strong>${formatCurrency(product.price * product.quantity)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } else {
      const salesData = getSalesReport();
      const stockData = getStockReport();
      reportContent = `
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-label">Chiffre d'affaires</div>
            <div class="stat-value">${formatCurrency(salesData.totalRevenue)}</div>
            <div class="stat-note">${salesData.totalTransactions} transaction(s)</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Valeur du stock</div>
            <div class="stat-value">${formatCurrency(stockData.totalValue)}</div>
            <div class="stat-note">${stockData.totalProducts} produit(s)</div>
          </div>
        </div>
        
        <h3>Résumé financier</h3>
        <table class="summary-table">
          <tr>
            <td>Ventes totales</td>
            <td style="text-align: right"><strong>${formatCurrency(salesData.totalRevenue)}</strong></td>
          </tr>
          <tr>
            <td>Valeur du stock</td>
            <td style="text-align: right"><strong>${formatCurrency(stockData.totalValue)}</strong></td>
          </tr>
          <tr class="total-row">
            <td><strong>Valeur totale</strong></td>
            <td style="text-align: right"><strong>${formatCurrency(salesData.totalRevenue + stockData.totalValue)}</strong></td>
          </tr>
        </table>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle} - ${getPeriodLabel()}</title>
        <style>
          @page {
            size: A4;
            margin: 2cm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            font-size: 13px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 35px;
            padding-bottom: 15px;
            border-bottom: 1px solid #ddd;
          }
          .company-section {
            flex: 1;
          }
          .company-logo {
            max-width: 100px;
            max-height: 50px;
            margin-bottom: 10px;
          }
          .company-name {
            font-size: 16px;
            font-weight: 600;
            color: #222;
            margin-bottom: 5px;
          }
          .company-details {
            font-size: 11px;
            color: #666;
            line-height: 1.6;
          }
          .title-section {
            text-align: right;
          }
          .report-title {
            font-size: 24px;
            font-weight: 300;
            color: #222;
            letter-spacing: 2px;
            margin-bottom: 5px;
          }
          .period {
            font-size: 12px;
            color: #666;
          }
          .stats-row {
            display: flex;
            gap: 15px;
            margin: 30px 0;
          }
          .stat-item {
            flex: 1;
            padding: 15px;
            border: 1px solid #e5e5e5;
            border-radius: 4px;
          }
          .stat-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #888;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }
          .stat-value {
            font-size: 20px;
            font-weight: 600;
            color: #222;
          }
          .stat-note {
            font-size: 11px;
            color: #888;
            margin-top: 5px;
          }
          h3 {
            font-size: 14px;
            font-weight: 600;
            margin: 25px 0 12px 0;
            color: #222;
          }
          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .data-table thead th {
            padding: 10px 8px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            color: #888;
            font-weight: 600;
            border-bottom: 1px solid #ddd;
            letter-spacing: 0.5px;
          }
          .data-table tbody tr {
            border-bottom: 1px solid #f0f0f0;
          }
          .data-table tbody td {
            padding: 10px 8px;
            font-size: 12px;
            color: #333;
          }
          .summary-table {
            width: 100%;
            margin: 20px 0;
          }
          .summary-table td {
            padding: 10px 0;
            font-size: 13px;
            border-bottom: 1px solid #f0f0f0;
          }
          .summary-table .total-row td {
            font-size: 15px;
            padding-top: 15px;
            border-top: 2px solid #222;
            border-bottom: none;
          }
          .no-data {
            text-align: center;
            padding: 30px;
            color: #999;
            font-size: 12px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #999;
          }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-section">
            ${companyInfo.logo ? `<img src="${companyInfo.logo}" class="company-logo">` : ''}
            <div class="company-name">${companyInfo.name}</div>
            <div class="company-details">
              ${companyInfo.address}<br>
              Tél: ${companyInfo.phone}<br>
              ${companyInfo.email}
              ${companyInfo.fiscalId ? `<br>NIF: ${companyInfo.fiscalId}` : ''}
            </div>
          </div>
          <div class="title-section">
            <div class="report-title">${reportTitle}</div>
            <div class="period">${getPeriodLabel()}</div>
          </div>
        </div>
        
        ${reportContent}
        
        <div class="footer">
          Rapport généré le ${format(now, 'd MMMM yyyy à HH:mm', { locale: fr })} par LOGIMAK · Propulsé par MakkaDev
        </div>
      </body>
      </html>
    `;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPeriodLabel = () => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return `Aujourd'hui - ${format(now, 'd MMMM yyyy', { locale: fr })}`;
      case 'month':
        return format(now, 'MMMM yyyy', { locale: fr });
      case 'year':
        return format(now, 'yyyy', { locale: fr });
      case 'custom':
        if (startDate && endDate) {
          return `Du ${format(new Date(startDate), 'd MMM yyyy', { locale: fr })} au ${format(new Date(endDate), 'd MMM yyyy', { locale: fr })}`;
        }
        return 'Période personnalisée';
      default:
        return '';
    }
  };

  const salesReport = getSalesReport();
  const stockReport = getStockReport();

  return (
    <div>
      <div className="card no-print" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Rapports et Statistiques</h2>
              <p className="card-description">Analysez les performances de votre activité</p>
            </div>
            <button className="btn btn-primary" onClick={printReport}>
              <Printer size={20} />
              Imprimer le rapport
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-3">
            <div className="form-group">
              <label className="form-label">Type de rapport</label>
              <select
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
              >
                <option value="sales">Rapport des ventes</option>
                <option value="stock">Rapport du stock</option>
                <option value="revenue">Rapport du chiffre d'affaires</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Période</label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
              >
                <option value="today">Aujourd'hui</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
                <option value="custom">Personnalisée</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div className="form-group">
                  <label className="form-label">Date de début</label>
                  <input
                    type="date"
                    className="form-input"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date de fin</label>
                  <input
                    type="date"
                    className="form-input"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* En-tête du rapport imprimable */}
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-body">
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
              {reportType === 'sales' && 'Rapport des Ventes'}
              {reportType === 'stock' && 'Rapport du Stock'}
              {reportType === 'revenue' && 'Rapport du Chiffre d\'Affaires'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              <Calendar size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
              {getPeriodLabel()}
            </p>
          </div>

          {reportType === 'sales' && (
            <div>
              <div className="grid grid-cols-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                  <div className="stat-label">Chiffre d'affaires</div>
                  <div className="stat-value" style={{ fontSize: '1.75rem' }}>
                    {formatCurrency(salesReport.totalRevenue)}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Transactions</div>
                  <div className="stat-value" style={{ fontSize: '1.75rem' }}>
                    {salesReport.totalTransactions}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Panier moyen</div>
                  <div className="stat-value" style={{ fontSize: '1.75rem' }}>
                    {formatCurrency(salesReport.averageTransaction)}
                  </div>
                </div>
              </div>

              {salesReport.filteredSales.length > 0 ? (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Facture</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Articles</th>
                        <th>Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesReport.filteredSales.map(sale => (
                        <tr key={sale.id}>
                          <td style={{ fontWeight: 600 }}>{sale.invoiceNumber}</td>
                          <td>
                            {format(new Date(sale.date), 'd MMM yyyy HH:mm', { locale: fr })}
                          </td>
                          <td>{sale.customerName || '-'}</td>
                          <td>{sale.items.length}</td>
                          <td style={{ fontWeight: 600 }}>
                            {formatCurrency(sale.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                  <FileText size={64} style={{ margin: '0 auto var(--spacing-md)', color: 'var(--text-muted)' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Aucune vente pour cette période
                  </p>
                </div>
              )}
            </div>
          )}

          {reportType === 'stock' && (
            <div>
              <div className="grid grid-cols-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                  <div className="stat-label">Total produits</div>
                  <div className="stat-value" style={{ fontSize: '1.75rem' }}>
                    {stockReport.totalProducts}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Valeur totale</div>
                  <div className="stat-value" style={{ fontSize: '1.75rem' }}>
                    {formatCurrency(stockReport.totalValue)}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Stock faible</div>
                  <div className="stat-value" style={{ fontSize: '1.75rem', color: 'var(--warning)' }}>
                    {stockReport.lowStockProducts.length}
                  </div>
                </div>
              </div>

              {stockReport.lowStockProducts.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                  <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--warning)' }}>
                    Produits en stock faible
                  </h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Produit</th>
                          <th>Quantité actuelle</th>
                          <th>Stock minimum</th>
                          <th>Valeur</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockReport.lowStockProducts.map(product => (
                          <tr key={product.id}>
                            <td style={{ fontWeight: 600 }}>{product.name}</td>
                            <td style={{ color: 'var(--warning)' }}>{product.quantity}</td>
                            <td>{product.minQuantity}</td>
                            <td>{formatCurrency(product.price * product.quantity)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Inventaire complet</h3>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Prix unitaire</th>
                      <th>Quantité</th>
                      <th>Valeur totale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockReport.products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{product.name}</div>
                          {product.description && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {product.description}
                            </div>
                          )}
                        </td>
                        <td>{formatCurrency(product.price)}</td>
                        <td style={{ fontWeight: 600 }}>{product.quantity}</td>
                        <td style={{ fontWeight: 600 }}>
                          {formatCurrency(product.price * product.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {reportType === 'revenue' && (
            <div>
              <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-label">Chiffre d'affaires total</div>
                    </div>
                    <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                      <TrendingUp size={24} />
                    </div>
                  </div>
                  <div className="stat-value">{formatCurrency(salesReport.totalRevenue)}</div>
                  <div className="stat-change positive">
                    {salesReport.totalTransactions} transaction(s)
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-header">
                    <div>
                      <div className="stat-label">Valeur du stock</div>
                    </div>
                    <div className="stat-icon" style={{ background: '#e0e7ff', color: 'var(--info)' }}>
                      <Package size={24} />
                    </div>
                  </div>
                  <div className="stat-value">{formatCurrency(stockReport.totalValue)}</div>
                  <div className="stat-change">
                    {stockReport.totalProducts} produit(s)
                  </div>
                </div>
              </div>

              <div style={{ 
                padding: 'var(--spacing-xl)',
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-lg)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Résumé financier</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <span>Ventes totales:</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(salesReport.totalRevenue)}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-md)',
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <span>Valeur du stock:</span>
                    <span style={{ fontWeight: 600 }}>{formatCurrency(stockReport.totalValue)}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-md)',
                    background: 'var(--primary-light)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '1.125rem'
                  }}>
                    <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Valeur totale:</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {formatCurrency(salesReport.totalRevenue + stockReport.totalValue)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="no-print" style={{ 
        textAlign: 'center', 
        padding: 'var(--spacing-lg)',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        Rapport généré le {format(new Date(), 'd MMMM yyyy à HH:mm', { locale: fr })} par LOGIMAK
      </div>
    </div>
  );
}
