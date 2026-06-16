// Types pour LOGIMAK

export interface CompanyInfo {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  fiscalId?: string;
  additionalInfo?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  minQuantity?: number;
  barcode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  customerName?: string;
  customerPhone?: string;
  date: string;
  invoiceNumber: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  reason: string;
}

export interface DashboardStats {
  dailyRevenue: number;
  monthlyRevenue: number;
  totalSales: number;
  totalProducts: number;
  lowStockProducts: number;
}

export interface AppState {
  isConfigured: boolean;
  companyInfo?: CompanyInfo;
}
