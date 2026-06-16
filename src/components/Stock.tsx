import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Package, Search, AlertCircle } from 'lucide-react';
import { db } from '../services/database';
import type { Product, Category } from '../types';

export default function Stock() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    minQuantity: '',
    barcode: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const productsData = await db.getProducts();
    const categoriesData = await db.getCategories();
    setProducts(productsData);
    setCategories(categoriesData);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price || !productForm.quantity) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity),
      minQuantity: productForm.minQuantity ? parseInt(productForm.minQuantity) : undefined,
      barcode: productForm.barcode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await db.addProduct(product);
    await loadData();
    setShowProductModal(false);
    resetProductForm();
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    await db.updateProduct(editingProduct.id, {
      name: productForm.name,
      description: productForm.description,
      category: productForm.category,
      price: parseFloat(productForm.price),
      quantity: parseInt(productForm.quantity),
      minQuantity: productForm.minQuantity ? parseInt(productForm.minQuantity) : undefined,
      barcode: productForm.barcode
    });

    await loadData();
    setShowProductModal(false);
    setEditingProduct(null);
    resetProductForm();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await db.deleteProduct(id);
      await loadData();
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      minQuantity: product.minQuantity?.toString() || '',
      barcode: product.barcode || ''
    });
    setShowProductModal(true);
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
      minQuantity: '',
      barcode: ''
    });
  };

  const handleAddCategory = async () => {
    if (!categoryForm.name) {
      alert('Veuillez entrer un nom de catégorie');
      return;
    }

    const category: Category = {
      id: Date.now().toString(),
      name: categoryForm.name,
      description: categoryForm.description
    };

    await db.addCategory(category);
    await loadData();
    setShowCategoryModal(false);
    setCategoryForm({ name: '', description: '' });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
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
              <h2 className="card-title">Gestion du Stock</h2>
              <p className="card-description">Gérez vos produits et catégories</p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <button className="btn btn-outline" onClick={() => setShowCategoryModal(true)}>
                Catégories
              </button>
              <button className="btn btn-primary" onClick={() => {
                setEditingProduct(null);
                resetProductForm();
                setShowProductModal(true);
              }}>
                <Plus size={20} />
                Ajouter un produit
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} style={{ 
                position: 'absolute', 
                left: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }} />
              <input
                type="text"
                className="form-input"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '200px' }}
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-2xl)'
          }}>
            <Package size={64} style={{ 
              margin: '0 auto var(--spacing-lg)', 
              color: 'var(--text-muted)' 
            }} />
            <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>
              Aucun produit trouvé
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
              Commencez par ajouter des produits à votre stock
            </p>
            <button className="btn btn-primary" onClick={() => setShowProductModal(true)}>
              <Plus size={20} />
              Ajouter votre premier produit
            </button>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Stock min.</th>
                <th>Valeur totale</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{product.name}</div>
                      {product.description && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {product.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">
                      {getCategoryName(product.category)}
                    </span>
                  </td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>{product.quantity}</span>
                      {product.minQuantity && product.quantity <= product.minQuantity && (
                        <AlertCircle size={16} style={{ color: 'var(--warning)' }} />
                      )}
                    </div>
                  </td>
                  <td>{product.minQuantity || '-'}</td>
                  <td style={{ fontWeight: 600 }}>
                    {formatCurrency(product.price * product.quantity)}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn btn-sm btn-ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Produit */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => {
          setShowProductModal(false);
          setEditingProduct(null);
        }}>
          <div className="modal" style={{ width: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </h2>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label form-label-required">Nom du produit</label>
                <input
                  type="text"
                  className="form-input"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Ex: Sac de riz 50kg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Description détaillée du produit"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label form-label-required">Catégorie</label>
                  <select
                    className="form-select"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-required">Prix unitaire (FCFA)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2">
                <div className="form-group">
                  <label className="form-label form-label-required">Quantité en stock</label>
                  <input
                    type="number"
                    className="form-input"
                    value={productForm.quantity}
                    onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock minimum</label>
                  <input
                    type="number"
                    className="form-input"
                    value={productForm.minQuantity}
                    onChange={(e) => setProductForm({...productForm, minQuantity: e.target.value})}
                    placeholder="0"
                    min="0"
                  />
                  <p className="form-description">
                    Alerte si le stock descend en dessous
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Code-barres</label>
                <input
                  type="text"
                  className="form-input"
                  value={productForm.barcode}
                  onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
                  placeholder="Code-barres du produit"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => {
                setShowProductModal(false);
                setEditingProduct(null);
              }}>
                Annuler
              </button>
              <button 
                className="btn btn-primary"
                onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
              >
                {editingProduct ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Catégorie */}
      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal" style={{ width: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Gérer les catégories</h2>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label form-label-required">Nom de la catégorie</label>
                <input
                  type="text"
                  className="form-input"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  placeholder="Ex: Alimentation"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  placeholder="Description de la catégorie"
                />
              </div>

              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleAddCategory}>
                <Plus size={20} />
                Ajouter la catégorie
              </button>

              {categories.length > 0 && (
                <>
                  <hr style={{ margin: 'var(--spacing-lg) 0', border: 'none', borderTop: '1px solid var(--border)' }} />
                  <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Catégories existantes</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                    {categories.map(cat => (
                      <div key={cat.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 'var(--spacing-md)',
                        background: 'var(--bg-main)',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>{cat.name}</div>
                          {cat.description && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              {cat.description}
                            </div>
                          )}
                        </div>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={async () => {
                            if (confirm('Supprimer cette catégorie ?')) {
                              await db.deleteCategory(cat.id);
                              await loadData();
                            }
                          }}
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowCategoryModal(false)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
