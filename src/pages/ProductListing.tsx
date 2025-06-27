import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductListing.css';

const ProductListing: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const { addToCart } = useCart();
  
  if (!category) return <div>Category not found</div>;
  
  const products = getProductsByCategory(category);
  
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
    const product = products.find(p => p.id === productId);
    if (product && product.inStock) {
      addToCart(product, product.sizes[0], product.colors[0], 1);
    }
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
            <div key={product.id} className="product-listing__item">
              <Link to={`/product/${product.id}`} className="product-listing__link">
                <div className="product-listing__image">
                  <div className="product-listing__placeholder">
                    {product.image}
                  </div>
                  {!product.inStock && (
                    <div className="product-listing__sold-out">
                      Sold Out
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
                    onClick={() => handleQuickAdd(product.id)}
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

        {products.length === 0 && (
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