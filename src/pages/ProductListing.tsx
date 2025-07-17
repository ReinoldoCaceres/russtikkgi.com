import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory } from '../data/products';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import './ProductListing.css';

const ProductListing: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadProducts = async () => {
      if (!category) {
        setError('Category not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productList = await getProductsByCategory(category);
        setProducts(productList);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category]);
  
  if (!category) {
    return (
      <div className="product-listing">
        <div className="container">
          <div className="product-listing__error">Category not found</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="product-listing">
        <div className="product-listing__header">
          <div className="container">
            <h1 className="product-listing__title">Loading...</h1>
            <p className="product-listing__description">Please wait while we load the products.</p>
          </div>
        </div>
        <div className="container">
          <div className="product-listing__loading">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-listing">
        <div className="product-listing__header">
          <div className="container">
            <h1 className="product-listing__title">Error</h1>
            <p className="product-listing__description">{error}</p>
          </div>
        </div>
        <div className="container">
          <div className="product-listing__error">
            <Link to="/">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }
  
  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'swimwear': return 'Swimwear';
      case 'ball-gowns': return 'Ball Gowns';
      case 'revamp': return 'ReVamp';
      default: return 'Products';
    }
  };

  const getCategoryDescription = (cat: string) => {
    switch (cat) {
      case 'swimwear': return 'Luxury swimwear collection featuring elegant designs and premium materials for the modern woman.';
      case 'ball-gowns': return 'Exquisite evening gowns crafted with meticulous attention to detail for your most special occasions.';
      case 'revamp': return 'Premium denim collection combining classic cuts with contemporary luxury and innovative design.';
      default: return '';
    }
  };

  const handleQuickAdd = (productId: string) => {
    const product = products.find(p => p.id === productId || p._id === productId);
    if (product && product.inStock) {
      addToCart(product, product.sizes[0], product.colors[0], 1);
    }
  };

  const getProductImageSrc = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    return primaryImage?.path || primaryImage?.filename;
  };

  const getProductImageAlt = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    return primaryImage?.alt || product.name;
  };

  return (
    <div className="product-listing">
      <div className="product-listing__header">
        <div className="container">
          <h1 className="product-listing__title">{getCategoryTitle(category)}</h1>
          <p className="product-listing__description">{getCategoryDescription(category)}</p>
        </div>
      </div>

      <div className="container">
        <div className="product-listing__filters">
          <div className="product-listing__filter-group">
            <span className="product-listing__filter-label">Sort by:</span>
            <select className="product-listing__filter-select">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <div className="product-listing__results">
            {products.length} products
          </div>
        </div>

        <div className="product-listing__grid">
          {products.map(product => (
            <div key={product.id || product._id} className="product-listing__item">
              <Link to={`/product/${product.id || product._id}`} className="product-listing__link">
                                  <div className="product-listing__image">
                    {getProductImageSrc(product) ? (
                      <img 
                        src={getProductImageSrc(product)} 
                        alt={getProductImageAlt(product)}
                        className="product-listing__img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                        }}
                      />
                    ) : null}
                    <div className="product-listing__placeholder" style={{ display: getProductImageSrc(product) ? 'none' : 'flex' }}>
                      No Image
                    </div>
                    {!product.inStock && (
                      <div className="product-listing__sold-out">
                        Sold Out
                      </div>
                    )}
                    {product.images && product.images.length > 1 && (
                      <div className="product-listing__image-count">
                        +{product.images.length - 1} more
                      </div>
                    )}
                  </div>
                
                <div className="product-listing__info">
                  <h3 className="product-listing__name">{product.name}</h3>
                  <p className="product-listing__price">${product.price}</p>
                  <div className="product-listing__colors">
                    {product.colors.slice(0, 4).map(color => (
                      <div 
                        key={color}
                        className="product-listing__color"
                        style={{ backgroundColor: color.toLowerCase() === 'white' ? '#f0f0f0' : color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                    {product.colors.length > 4 && (
                      <span className="product-listing__color-count">+{product.colors.length - 4}</span>
                    )}
                  </div>
                </div>
              </Link>
              
              <div className="product-listing__actions">
                {product.inStock ? (
                  <button 
                    className="product-listing__quick-add"
                    onClick={() => handleQuickAdd(product.id || product._id || '')}
                  >
                    Quick Add
                  </button>
                ) : (
                  <button 
                    className="product-listing__quick-add product-listing__quick-add--disabled"
                    disabled
                  >
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && !error && (
          <div className="product-listing__empty">
            <h2>No products found</h2>
            <p>Check back soon for new arrivals.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListing; 