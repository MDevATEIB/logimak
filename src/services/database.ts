// Service de gestion de la base de données locale avec Tauri Store
import { Store } from '@tauri-apps/plugin-store';
import { join } from '@tauri-apps/api/path';
import { exists, mkdir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { save, open } from '@tauri-apps/plugin-dialog';
import type {
  CompanyInfo,
  Product,
  Category,
  Sale,
  StockMovement,
  AppState
} from '../types';

class Database {
  private store: Store | null = null;
  private backupDir: string | null = null;

  async init() {
    if (!this.store) {
      this.store = await Store.load('logimak.db');
    }
    return this.store;
  }

  async getBackupDir(): Promise<string> {
    if (!this.backupDir) {
      // Utiliser le dossier Documents de l'utilisateur au lieu de AppData
      const { documentDir } = await import('@tauri-apps/api/path');
      const docsDir = await documentDir();
      this.backupDir = await join(docsDir, 'LOGIMAK', 'db_logimak');
      
      // Créer le dossier s'il n'existe pas
      const dirExists = await exists(this.backupDir);
      if (!dirExists) {
        await mkdir(this.backupDir, { recursive: true });
      }
    }
    return this.backupDir;
  }

  // Sauvegarde automatique quotidienne
  async createAutoBackup(): Promise<void> {
    try {
      const backupDir = await this.getBackupDir();
      const now = new Date();
      // Format de date avec tirets pour éviter de créer des sous-dossiers
      // Exemple: db_2026-06-16.json au lieu de db_2026/06/16.json
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const fileName = `db_${dateStr}.json`;
      const backupPath = await join(backupDir, fileName);
      
      // Vérifier si une sauvegarde existe déjà pour aujourd'hui
      const fileExists = await exists(backupPath);
      if (!fileExists) {
        await this.exportData(backupPath);
        console.log(`Sauvegarde automatique créée: ${fileName}`);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  }

  // Exporter toutes les données
  async exportData(filePath?: string): Promise<void> {
    const store = await this.init();
    
    // Récupérer toutes les données
    const data = {
      isConfigured: await store.get<boolean>('isConfigured') || false,
      companyInfo: await store.get<CompanyInfo>('companyInfo') || null,
      products: await store.get<Product[]>('products') || [],
      categories: await store.get<Category[]>('categories') || [],
      sales: await store.get<Sale[]>('sales') || [],
      stockMovements: await store.get<StockMovement[]>('stockMovements') || [],
      exportDate: new Date().toISOString()
    };

    const jsonData = JSON.stringify(data, null, 2);

    if (filePath) {
      // Sauvegarde automatique avec chemin spécifié
      await writeTextFile(filePath, jsonData);
    } else {
      // Export manuel avec dialogue
      const savePath = await save({
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }],
        defaultPath: `logimak_backup_${new Date().toISOString().split('T')[0]}.json`
      });

      if (savePath) {
        await writeTextFile(savePath, jsonData);
      }
    }
  }

  // Importer des données
  async importData(): Promise<boolean> {
    try {
      const openPath = await open({
        filters: [{
          name: 'JSON',
          extensions: ['json']
        }],
        multiple: false
      });

      if (!openPath || typeof openPath !== 'string') {
        return false;
      }

      const jsonData = await readTextFile(openPath);
      const data = JSON.parse(jsonData);

      const store = await this.init();

      // Restaurer toutes les données
      if (data.isConfigured !== undefined) {
        await store.set('isConfigured', data.isConfigured);
      }
      if (data.companyInfo) {
        await store.set('companyInfo', data.companyInfo);
      }
      if (data.products) {
        await store.set('products', data.products);
      }
      if (data.categories) {
        await store.set('categories', data.categories);
      }
      if (data.sales) {
        await store.set('sales', data.sales);
      }
      if (data.stockMovements) {
        await store.set('stockMovements', data.stockMovements);
      }

      await store.save();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
      return false;
    }
  }

  // Réinitialiser la base de données
  async resetDatabase(): Promise<void> {
    const store = await this.init();
    
    // Garder uniquement la configuration de l'entreprise
    const companyInfo = await store.get<CompanyInfo>('companyInfo');
    
    // Effacer toutes les autres données
    await store.set('products', []);
    await store.set('categories', []);
    await store.set('sales', []);
    await store.set('stockMovements', []);
    
    // Garder isConfigured à true si l'entreprise est configurée
    if (companyInfo) {
      await store.set('isConfigured', true);
      await store.set('companyInfo', companyInfo);
    }
    
    await store.save();
  }

  // Configuration de l'application
  async getAppState(): Promise<AppState> {
    const store = await this.init();
    const isConfigured = await store.get<boolean>('isConfigured') || false;
    const companyInfo = await store.get<CompanyInfo>('companyInfo');
    
    return {
      isConfigured,
      companyInfo
    };
  }

  async setConfigured(companyInfo: CompanyInfo) {
    const store = await this.init();
    await store.set('isConfigured', true);
    await store.set('companyInfo', companyInfo);
    await store.save();
  }

  async getCompanyInfo(): Promise<CompanyInfo | null> {
    const store = await this.init();
    return await store.get<CompanyInfo>('companyInfo') || null;
  }

  async updateCompanyInfo(companyInfo: CompanyInfo) {
    const store = await this.init();
    await store.set('companyInfo', companyInfo);
    await store.save();
  }

  // Gestion des produits
  async getProducts(): Promise<Product[]> {
    const store = await this.init();
    return await store.get<Product[]>('products') || [];
  }

  async addProduct(product: Product) {
    const store = await this.init();
    const products = await this.getProducts();
    products.push(product);
    await store.set('products', products);
    await store.save();
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    const store = await this.init();
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === id);
    
    if (index !== -1) {
      products[index] = { ...products[index], ...updates, updatedAt: new Date().toISOString() };
      await store.set('products', products);
      await store.save();
    }
  }

  async deleteProduct(id: string) {
    const store = await this.init();
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    await store.set('products', filtered);
    await store.save();
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const products = await this.getProducts();
    return products.find(p => p.id === id);
  }

  // Gestion des catégories
  async getCategories(): Promise<Category[]> {
    const store = await this.init();
    return await store.get<Category[]>('categories') || [];
  }

  async addCategory(category: Category) {
    const store = await this.init();
    const categories = await this.getCategories();
    categories.push(category);
    await store.set('categories', categories);
    await store.save();
  }

  async deleteCategory(id: string) {
    const store = await this.init();
    const categories = await this.getCategories();
    const filtered = categories.filter(c => c.id !== id);
    await store.set('categories', filtered);
    await store.save();
  }

  // Gestion des ventes
  async getSales(): Promise<Sale[]> {
    const store = await this.init();
    return await store.get<Sale[]>('sales') || [];
  }

  async addSale(sale: Sale) {
    const store = await this.init();
    const sales = await this.getSales();
    sales.push(sale);
    await store.set('sales', sales);
    await store.save();

    // Mettre à jour les quantités des produits
    for (const item of sale.items) {
      const product = await this.getProduct(item.productId);
      if (product) {
        await this.updateProduct(item.productId, {
          quantity: product.quantity - item.quantity
        });
      }
    }
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
    const store = await this.init();
    return await store.get<StockMovement[]>('stockMovements') || [];
  }

  async addStockMovement(movement: StockMovement) {
    const store = await this.init();
    const movements = await this.getStockMovements();
    movements.push(movement);
    await store.set('stockMovements', movements);
    await store.save();
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
}

export const db = new Database();
