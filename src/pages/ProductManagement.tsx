import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { productApi } from '../services/api';
import { getAllProducts, invalidateProductsCache } from '../data/products';
import { useAuth } from '../context/AuthContext';
import './ProductManagement.css';

interface ProductFormData {
  name: string;
  price: number;
  category: 'swimwear' | 'ball-gowns' | 'revamp';
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  stockQuantity?: number;
  featured?: boolean;
  tags?: string[];
  images: any[]; // Will be handled separately with file upload
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    category: 'swimwear',
    description: '',
    sizes: [],
    colors: [],
    inStock: true,
    stockQuantity: 0,
    featured: false,
    tags: [],
    images: []
  });
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const { logout, admin } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productList = await getAllProducts();
      setProducts(productList);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      category: 'swimwear',
      description: '',
      sizes: [],
      colors: [],
      inStock: true,
      stockQuantity: 0,
      featured: false,
      tags: [],
      images: []
    });
    setSelectedImages(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      sizes: product.sizes,
      colors: product.colors,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || 0,
      featured: product.featured || false,
      tags: product.tags || [],
      images: product.images || []
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let savedProduct: Product;
      
      if (editingProduct) {
        // Update existing product (exclude images to avoid overwriting)
        const { images, ...updateData } = formData;
        savedProduct = await productApi.updateProduct(editingProduct._id || editingProduct.id!, updateData);
      } else {
        // Create new product
        savedProduct = await productApi.createProduct(formData);
      }

      // Upload images if selected
      if (selectedImages && selectedImages.length > 0) {
        setUploading(true);
        try {
          await productApi.uploadImages(savedProduct._id || savedProduct.id!, selectedImages);
        } catch (uploadError) {
          console.error('Failed to upload images:', uploadError);
          alert('Product saved but failed to upload images. You can try uploading them later.');
        } finally {
          setUploading(false);
        }
      }

      // Refresh product list
      invalidateProductsCache();
      await loadProducts();
      resetForm();
      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
    } catch (err) {
      console.error('Error saving product:', err);
      alert(`Failed to ${editingProduct ? 'update' : 'create'} product: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      await productApi.deleteProduct(product._id || product.id!);
      invalidateProductsCache();
      await loadProducts();
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    }
  };

  const handleArrayInput = (value: string, field: 'sizes' | 'colors' | 'tags') => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const getProductImageSrc = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    return primaryImage?.path || primaryImage?.filename;
  };

  const getProductImageAlt = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    return primaryImage?.alt || product.name;
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!editingProduct || !window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await productApi.deleteImage(editingProduct._id || editingProduct.id!, imageId);
      
      // Update local state optimistically
      const updatedImages = editingProduct.images.filter(img => img._id !== imageId);
      const updatedProduct = { ...editingProduct, images: updatedImages };
      setEditingProduct(updatedProduct);
      
      // Refresh products list
      invalidateProductsCache();
      await loadProducts();
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    }
  };

  const handleSetPrimaryImage = async (imageId: string) => {
    if (!editingProduct) return;

    try {
      await productApi.setPrimaryImage(editingProduct._id || editingProduct.id!, imageId);
      
      // Update local state optimistically
      const updatedImages = editingProduct.images.map(img => ({
        ...img,
        isPrimary: img._id === imageId
      }));
      const updatedProduct = { ...editingProduct, images: updatedImages };
      setEditingProduct(updatedProduct);
      
      // Refresh products list
      invalidateProductsCache();
      await loadProducts();
    } catch (err) {
      console.error('Error setting primary image:', err);
      alert('Failed to set primary image');
    }
  };

  if (loading) {
    return (
      <div className="product-management">
        <div className="container">
          <div className="product-management__loading">Loading products...</div>
        </div>
      </div>
    );
  }

    return (
    <div className="product-management">
      <div className="container">
        {/* Admin Navigation */}
        <div className="admin-nav">
          <div className="admin-nav__links">
            <a href="/admin" className="admin-nav__link">Orders</a>
            <a href="/admin/products" className="admin-nav__link admin-nav__link--active">Products</a>
          </div>
          <div className="admin-nav__user">
            <span className="admin-nav__welcome">Welcome, {admin?.username}</span>
            <button className="admin-nav__logout" onClick={logout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              Logout
            </button>
          </div>
        </div>

        <div className="product-management__header">
          <h1 className="product-management__title">Product Management</h1>
          <button 
            className="product-management__add-btn"
            onClick={() => {
              console.log('Add New Product clicked');
              setShowForm(true);
            }}
          >
            Add New Product
          </button>
        </div>

        {error && (
          <div className="product-management__error">{error}</div>
        )}

        {showForm && (
          <div className="product-management__form-overlay">
            <div className="product-management__form">
              <div className="product-management__form-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button 
                  className="product-management__close-btn"
                  onClick={resetForm}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="product-management__form-grid">
                  <div className="product-management__form-group">
                    <label>Product Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="product-management__form-group">
                    <label>Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      required
                    />
                  </div>

                  <div className="product-management__form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      required
                    >
                      <option value="swimwear">Swimwear</option>
                      <option value="ball-gowns">Ball Gowns</option>
                      <option value="revamp">ReVamp</option>
                    </select>
                  </div>

                  <div className="product-management__form-group">
                    <label>Stock Quantity</label>
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) }))}
                    />
                  </div>

                  <div className="product-management__form-group product-management__form-group--full">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="product-management__form-group">
                    <label>Sizes (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.sizes.join(', ')}
                      onChange={(e) => handleArrayInput(e.target.value, 'sizes')}
                      placeholder="XS, S, M, L, XL"
                    />
                  </div>

                  <div className="product-management__form-group">
                    <label>Colors (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.colors.join(', ')}
                      onChange={(e) => handleArrayInput(e.target.value, 'colors')}
                      placeholder="Black, White, Navy"
                    />
                  </div>

                  <div className="product-management__form-group">
                    <label>Tags (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.tags?.join(', ') || ''}
                      onChange={(e) => handleArrayInput(e.target.value, 'tags')}
                      placeholder="luxury, summer, trending"
                    />
                  </div>

                  {/* Existing Images */}
                  {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                    <div className="product-management__form-group product-management__form-group--full">
                      <label>Current Images</label>
                      <div className="product-management__existing-images">
                        {editingProduct.images.map((image, index) => (
                          <div key={image._id || index} className="product-management__image-item">
                            <div className="product-management__image-preview">
                              <img 
                                src={image.path || image.filename} 
                                alt={image.alt || editingProduct.name}
                                className="product-management__image-thumb"
                              />
                              {image.isPrimary && (
                                <div className="product-management__primary-badge">Primary</div>
                              )}
                            </div>
                            <div className="product-management__image-actions">
                              {!image.isPrimary && (
                                <button
                                  type="button"
                                  className="product-management__image-btn product-management__image-btn--primary"
                                  onClick={() => handleSetPrimaryImage(image._id!)}
                                  title="Set as primary image"
                                >
                                  Set Primary
                                </button>
                              )}
                              <button
                                type="button"
                                className="product-management__image-btn product-management__image-btn--delete"
                                onClick={() => handleDeleteImage(image._id!)}
                                title="Delete this image"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="product-management__form-group product-management__form-group--full">
                    <label>Add New Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setSelectedImages(e.target.files)}
                    />
                    <div className="product-management__upload-hint">
                      These images will be added to the existing ones
                    </div>
                    {selectedImages && (
                      <div className="product-management__selected-files">
                        {Array.from(selectedImages).map((file, index) => (
                          <span key={index} className="product-management__file-name">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="product-management__form-group product-management__checkboxes">
                    <label className="product-management__checkbox">
                      <input
                        type="checkbox"
                        checked={formData.inStock}
                        onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                      />
                      In Stock
                    </label>

                    <label className="product-management__checkbox">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      />
                      Featured Product
                    </label>
                  </div>
                </div>

                <div className="product-management__form-actions">
                  <button type="button" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : (editingProduct ? 'Update Product' : 'Create Product')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="product-management__list">
          <div className="product-management__table">
            <div className="product-management__table-header">
              <div>Image</div>
              <div>Product</div>
              <div>Category</div>
              <div>Price</div>
              <div>Stock</div>
              <div>Actions</div>
            </div>

            {products.map(product => (
              <div key={product._id || product.id} className="product-management__table-row">
                <div className="product-management__image">
                  {getProductImageSrc(product) ? (
                    <img 
                      src={getProductImageSrc(product)} 
                      alt={getProductImageAlt(product)}
                      className="product-management__img"
                    />
                  ) : (
                    <div className="product-management__image-placeholder">
                      No Image
                    </div>
                  )}
                </div>

                <div className="product-management__product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                </div>

                <div className="product-management__category">
                  {product.category}
                </div>

                <div className="product-management__price">
                  ${product.price}
                </div>

                <div className="product-management__stock">
                  <span className={`product-management__stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  {product.stockQuantity && <span>({product.stockQuantity})</span>}
                </div>

                <div className="product-management__actions">
                  <button
                    className="product-management__edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="product-management__delete-btn"
                    onClick={() => handleDelete(product)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div className="product-management__empty">
              <h3>No products found</h3>
              <p>Create your first product to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement; 