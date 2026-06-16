// Service de gestion de la base de données pour la version WEB (démo)
// Utilise localStorage au lieu de Tauri Store

import type {
  CompanyInfo,
  Product,
  Category,
  Sale,
  StockMovement,
  AppState
} from '../types';

class WebDatabase {
  private storageKey = 'logimak_web_demo';

  // Charger toutes les données
  private loadData(): any {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        return this.getDefaultData();
      }
    }
    return this.getDefaultData();
  }

  // Sauvegarder toutes les données
  private saveData(data: any): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Données par défaut pour la démo
  private getDefaultData(): any {
    return {
      isConfigured: false,
      companyInfo: null,
      products: [],
      categories: [],
      sales: [],
      stockMovements: []
    };
  }

  async init() {
    // Pas besoin d'initialisation spéciale pour le web
    return Promise.resolve();
  }

  async getBackupDir(): Promise<string> {
    // Non applicable pour la version web
    return Promise.resolve('browser_storage');
  }

  async createAutoBackup(): Promise<void> {
    // Sauvegarde automatique dans localStorage
    console.log('Sauvegarde automatique (localStorage)');
  }

  async exportData(_filePath?: string): Promise<void> {
    const data = this.loadData();
    data.exportDate = new Date().toISOString();
    
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `logimak_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async importData(): Promise<boolean> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      
      input.onchange = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(false);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonData = event.target?.result as string;
            const data = JSON.parse(jsonData);
            this.saveData(data);
            resolve(true);
          } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            resolve(false);
          }
        };
        reader.readAsText(file);
      };
      
      input.click();
    });
  }

  async resetDatabase(): Promise<void> {
    const data = this.loadData();
    const companyInfo = data.companyInfo;
    
    const resetData = {
      isConfigured: companyInfo ? true : false,
      companyInfo: companyInfo,
      products: [],
      categories: [],
      sales: [],
      stockMovements: []
    };
    
    this.saveData(resetData);
  }

  // Configuration de l'application
  async getAppState(): Promise<AppState> {
    const data = this.loadData();
    return {
      isConfigured: data.isConfigured || false,
      companyInfo: data.companyInfo
    };
  }

  async setConfigured(companyInfo: CompanyInfo) {
    const data = this.loadData();
    data.isConfigured = true;
    data.companyInfo = companyInfo;
    this.saveData(data);
  }

  async getCompanyInfo(): Promise<CompanyInfo | null> {
    const data = this.loadData();
    return data.companyInfo || null;
  }

  async updateCompanyInfo(companyInfo: CompanyInfo) {
    const data = this.loadData();
    data.companyInfo = companyInfo;
    this.saveData(data);
  }

  // Gestion des produits
  async getProducts(): Promise<Product[]> {
    const data = this.loadData();
    return data.products || [];
  }

  async addProduct(product: Product) {
    const data = this.loadData();
    data.products.push(product);
    this.saveData(data);
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    const data = this.loadData();
    const index = data.products.findIndex((p: Product) => p.id === id);
    
    if (index !== -1) {
      data.products[index] = { ...data.products[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveData(data);
    }
  }

  async deleteProduct(id: string) {
    const data = this.loadData();
    data.products = data.products.filter((p: Product) => p.id !== id);
    this.saveData(data);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  // Gestion des catégories
  async getCategories(): Promise<Category[]> {
    const data = this.loadData();
    return data.categories || [];
  }

  async addCategory(category: Category) {
    const data = this.loadData();
    data.categories.push(category);
    this.saveData(data);
  }

  async deleteCategory(id: string) {
    const data = this.loadData();
    data.categories = data.categories.filter((c: Category) => c.id !== id);
    this.saveData(data);
  }

  // Gestion des ventes
  async getSales(): Promise<Sale[]> {
    const data = this.loadData();
    return data.sales || [];
  }

  async addSale(sale: Sale) {
    const data = this.loadData();
    data.sales.push(sale);
    
    // Mettre à jour les quantités des produits
    for (const item of sale.items) {
      const productIndex = data.products.findIndex((p: Product) => p.id === item.productId);
      if (productIndex !== -1) {
        data.products[productIndex].quantity -= item.quantity;
      }
    }
    
    this.saveData(data);
  }

  async getNextInvoiceNumber(): Promise<string> {
    const sales = await this.getSales();
    const year = new Date().getFullYear();
    const salesThisYear = sales.filter(s => s.invoiceNumber.startsWith(`INV-${year}`));
    const number = salesThisYear.length + 1;
    return `INV-${year}-${String(number).padStart(5, '0')}`;
  }

  // Gestion des mouvements de stock
  async getStockMovements(): Promise<StockMovement[]> {
    const data = this.loadData();
    return data.stockMovements || [];
  }

  async addStockMovement(movement: StockMovement) {
    const data = this.loadData();
    data.stockMovements.push(movement);
    this.saveData(data);
  }

  // Statistiques
  async getDashboardStats() {
    const sales = await this.getSales();
    const products = await this.getProducts();
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const dailySales = sales.filter(s => s.date.startsWith(today));
    const monthlySales = sales.filter(s => s.date.startsWith(currentMonth));

    const dailyRevenue = dailySales.reduce((sum, sale) => sum + sale.total, 0);
    const monthlyRevenue = monthlySales.reduce((sum, sale) => sum + sale.total, 0);

    const lowStockProducts = products.filter(p => 
      p.minQuantity && p.quantity <= p.minQuantity
    ).length;

    return {
      dailyRevenue,
      monthlyRevenue,
      totalSales: sales.length,
      totalProducts: products.length,
      lowStockProducts
    };
  }

  // Charger des données de démonstration
  async loadDemoData() {
    const demoData = {
      isConfigured: true,
      companyInfo: {
        name: 'Boutique Démo',
        address: 'Avenue Mobutu, Quartier Chagoua, N\'Djamena, Tchad',
        phone: '+235 66 64 76 40',
        email: 'demo@logimak.com',
        website: 'www.logimak.com',
        fiscalId: 'NIF123456789',
        additionalInfo: 'Ceci est une démonstration de LOGIMAK',
        logo: ''
      },
      categories: [
        { id: '1', name: 'Électronique', createdAt: new Date().toISOString() },
        { id: '2', name: 'Alimentaire', createdAt: new Date().toISOString() },
        { id: '3', name: 'Vêtements', createdAt: new Date().toISOString() }
      ],
      products: [
        {
          id: '1',
          name: 'Smartphone Samsung Galaxy',
          description: 'Téléphone Android dernier cri',
          price: 250000,
          quantity: 15,
          minQuantity: 5,
          categoryId: '1',
          barcode: '123456789',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Riz 50kg',
          description: 'Sac de riz importé',
          price: 35000,
          quantity: 50,
          minQuantity: 10,
          categoryId: '2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'T-shirt Homme',
          description: 'T-shirt coton 100%',
          price: 5000,
          quantity: 3,
          minQuantity: 5,
          categoryId: '3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Laptop Dell',
          description: 'Ordinateur portable 15 pouces',
          price: 450000,
          quantity: 8,
          minQuantity: 3,
          categoryId: '1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      sales: [
        {
          id: '1',
          invoiceNumber: 'INV-2026-00001',
          items: [
            {
              productId: '1',
              productName: 'Smartphone Samsung Galaxy',
              quantity: 2,
              unitPrice: 250000,
              total: 500000
            }
          ],
          total: 500000,
          customerName: 'Jean Dupont',
          customerPhone: '+235 66 12 34 56',
          date: new Date().toISOString()
        },
        {
          id: '2',
          invoiceNumber: 'INV-2026-00002',
          items: [
            {
              productId: '2',
              productName: 'Riz 50kg',
              quantity: 5,
              unitPrice: 35000,
              total: 175000
            }
          ],
          total: 175000,
          customerName: 'Marie Koné',
          date: new Date().toISOString()
        }
      ],
      stockMovements: []
    };
    
    this.saveData(demoData);
  }
}

export const db = new WebDatabase();
