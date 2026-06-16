import { useEffect, useState } from 'react';
import { Plus, ShoppingCart, Printer, Trash2, X } from 'lucide-react';
import { db } from '../services/database';
import type { Product, Sale, SaleItem } from '../types';

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [showNewSale, setShowNewSale] = useState(false);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const productsData = await db.getProducts();
    const salesData = await db.getSales();
    setProducts(productsData);
    setSales(salesData.sort((a, b) => b.date.localeCompare(a.date)));
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !quantity || parseInt(quantity) <= 0) {
      alert('Veuillez sélectionner un produit et une quantité valide');
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const qty = parseInt(quantity);
    if (qty > product.quantity) {
      alert(`Stock insuffisant. Disponible: ${product.quantity}`);
      return;
    }

    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + qty, total: (item.quantity + qty) * item.unitPrice }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        unitPrice: product.price,
        total: product.price * qty
      };
      setCart([...cart, newItem]);
    }

    setSelectedProduct('');
    setQuantity('1');
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  };

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      alert('Le panier est vide');
      return;
    }

    const invoiceNumber = await db.getNextInvoiceNumber();
    
    const sale: Sale = {
      id: Date.now().toString(),
      items: cart,
      total: getTotalAmount(),
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      date: new Date().toISOString(),
      invoiceNumber
    };

    await db.addSale(sale);
    await loadData();
    
    // Imprimer la facture
    printInvoice(sale);
    
    // Réinitialiser le formulaire
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setShowNewSale(false);
  };

  const printInvoice = async (sale: Sale) => {
    const companyInfo = await db.getCompanyInfo();
    if (!companyInfo) return;

    // Créer le HTML de la facture
    const invoiceHTML = generateInvoiceHTML(sale, companyInfo);
    
    // Créer un conteneur temporaire pour l'impression
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
    frameDoc.write(invoiceHTML);
    frameDoc.close();
    
    // Attendre que le contenu soit chargé
    printFrame.onload = () => {
      setTimeout(() => {
        printFrame.contentWindow?.print();
        // Nettoyer après l'impression
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 100);
      }, 250);
    };
  };

  const generateInvoiceHTML = (sale: Sale, companyInfo: any) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        minimumFractionDigits: 0
      }).format(amount);
    };

    return `
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Facture ${sale.invoiceNumber}</title>
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
          
          /* En-tête simple */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
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
          
          /* Titre */
          .invoice-title-section {
            text-align: right;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: 300;
            color: #222;
            letter-spacing: 2px;
            margin-bottom: 8px;
          }
          .invoice-meta {
            font-size: 12px;
            color: #666;
            line-height: 1.6;
          }
          
          /* Client */
          .client-section {
            margin-bottom: 30px;
          }
          .client-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #888;
            margin-bottom: 5px;
          }
          .client-name {
            font-size: 14px;
            font-weight: 600;
            color: #222;
          }
          .client-info {
            font-size: 12px;
            color: #666;
          }
          
          /* Tableau */
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
          }
          .items-table thead th {
            padding: 10px 8px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #888;
            font-weight: 600;
            border-bottom: 1px solid #ddd;
          }
          .items-table tbody tr {
            border-bottom: 1px solid #f0f0f0;
          }
          .items-table tbody td {
            padding: 12px 8px;
            color: #333;
          }
          .items-table .text-center {
            text-align: center;
          }
          .items-table .text-right {
            text-align: right;
          }
          
          /* Total */
          .totals-section {
            margin-left: auto;
            width: 250px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            font-size: 16px;
            font-weight: 600;
            color: #222;
            border-top: 2px solid #222;
          }
          
          /* Notes */
          .notes {
            margin-top: 30px;
            padding: 12px;
            background: #fafafa;
            border-left: 3px solid #ddd;
            font-size: 11px;
            color: #666;
            line-height: 1.6;
          }
          
          /* Pied de page */
          .footer {
            margin-top: 50px;
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
          <div class="invoice-title-section">
            <div class="invoice-title">FACTURE</div>
            <div class="invoice-meta">
              N° ${sale.invoiceNumber}<br>
              ${new Date(sale.date).toLocaleDateString('fr-FR', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
              })}
            </div>
          </div>
        </div>

        ${sale.customerName || sale.customerPhone ? `
          <div class="client-section">
            <div class="client-label">Client</div>
            ${sale.customerName ? `<div class="client-name">${sale.customerName}</div>` : ''}
            ${sale.customerPhone ? `<div class="client-info">${sale.customerPhone}</div>` : ''}
          </div>
        ` : ''}

        <table class="items-table">
          <thead>
            <tr>
              <th>Désignation</th>
              <th class="text-center">Qté</th>
              <th class="text-right">Prix U.</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${sale.items.map(item => `
              <tr>
                <td>${item.productName}</td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-right">${formatCurrency(item.unitPrice)}</td>
                <td class="text-right">${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals-section">
          <div class="total-row">
            <span>TOTAL</span>
            <span>${formatCurrency(sale.total)}</span>
          </div>
        </div>

        ${companyInfo.additionalInfo ? `
          <div class="notes">${companyInfo.additionalInfo}</div>
        ` : ''}

        <div class="footer">
          Document généré par LOGIMAK · Propulsé par MakkaDev
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

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="card-title">Gestion des Ventes</h2>
              <p className="card-description">Créez des ventes et générez des factures</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowNewSale(true)}>
              <Plus size={20} />
              Nouvelle vente
            </button>
          </div>
        </div>
      </div>

      {showNewSale && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="card-title">Nouvelle vente</h2>
              <button className="btn btn-ghost" onClick={() => {
                setShowNewSale(false);
                setCart([]);
                setCustomerName('');
                setCustomerPhone('');
              }}>
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2" style={{ marginBottom: 'var(--spacing-lg)' }}>
              <div className="form-group">
                <label className="form-label">Nom du client</label>
                <input
                  type="text"
                  className="form-input"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Nom du client (optionnel)"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Téléphone (optionnel)"
                />
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-md)', 
              marginBottom: 'var(--spacing-lg)',
              alignItems: 'end'
            }}>
              <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                <label className="form-label">Produit</label>
                <select
                  className="form-select"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                >
                  <option value="">Sélectionner un produit</option>
                  {products.filter(p => p.quantity > 0).map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(product.price)} (Stock: {product.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ width: '150px', marginBottom: 0 }}>
                <label className="form-label">Quantité</label>
                <input
                  type="number"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddToCart}>
                <Plus size={20} />
                Ajouter
              </button>
            </div>

            {cart.length > 0 ? (
              <>
                <div className="table-container" style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th>Quantité</th>
                        <th>Prix unitaire</th>
                        <th>Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.productId}>
                          <td style={{ fontWeight: 600 }}>{item.productName}</td>
                          <td>{item.quantity}</td>
                          <td>{formatCurrency(item.unitPrice)}</td>
                          <td style={{ fontWeight: 600 }}>{formatCurrency(item.total)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-ghost"
                              onClick={() => handleRemoveFromCart(item.productId)}
                              style={{ color: 'var(--danger)' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <div style={{ 
                    background: 'var(--bg-main)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    minWidth: '300px'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--primary)'
                    }}>
                      <span>TOTAL:</span>
                      <span>{formatCurrency(getTotalAmount())}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)' }}>
                  <button className="btn btn-outline" onClick={() => {
                    setCart([]);
                    setCustomerName('');
                    setCustomerPhone('');
                  }}>
                    Annuler
                  </button>
                  <button className="btn btn-success" onClick={handleCompleteSale}>
                    <Printer size={20} />
                    Finaliser et imprimer
                  </button>
                </div>
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-2xl)',
                background: 'var(--bg-main)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <ShoppingCart size={48} style={{ 
                  margin: '0 auto var(--spacing-md)', 
                  color: 'var(--text-muted)' 
                }} />
                <p style={{ color: 'var(--text-secondary)' }}>
                  Le panier est vide. Ajoutez des produits pour commencer.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Historique des ventes</h2>
          <p className="card-description">Liste de toutes les transactions</p>
        </div>
        <div className="card-body">
          {sales.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
              <ShoppingCart size={64} style={{ 
                margin: '0 auto var(--spacing-lg)', 
                color: 'var(--text-muted)' 
              }} />
              <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Aucune vente enregistrée</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Les ventes apparaîtront ici une fois effectuées
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Facture</th>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Articles</th>
                    <th>Montant total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map(sale => (
                    <tr key={sale.id}>
                      <td style={{ fontWeight: 600 }}>{sale.invoiceNumber}</td>
                      <td>
                        {new Date(sale.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>{sale.customerName || '-'}</td>
                      <td>{sale.items.length} article(s)</td>
                      <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                        {formatCurrency(sale.total)}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => printInvoice(sale)}
                        >
                          <Printer size={16} />
                          Réimprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
