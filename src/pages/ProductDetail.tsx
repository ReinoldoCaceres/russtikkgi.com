import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  if (!id) {
    return <div>Product not found</div>;
  }
  
  const product = getProductById(id);
  
  if (!product) {
    return (
      <div className="product-detail product-detail--not-found">
        <div className="container">
          <h1>Product not found</h1>
          <p>The product you're looking for doesn't exist.</p>
          <Link to="/" className="product-detail__back-btn">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Please select a size and color');
      return;
    }
    
    if (!product.inStock) {
      alert('This product is currently out of stock');
      return;
    }
    
    addToCart(product, selectedSize, selectedColor, quantity);
    // Product successfully added to cart - the cart count in header will update automatically
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'swimwear': return 'Swimwear';
      case 'ball-gowns': return 'Ball Gowns';
      case 'revamp': return 'ReVamp';
      default: return 'Products';
    }
  };

  return (
    <div className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <div className="product-detail__breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/collection/${product.category}`}>
            {getCategoryName(product.category)}
          </Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-detail__content">
          {/* Product Images */}
          <div className="product-detail__images">
            <div className="product-detail__main-image">
              <div className="product-detail__image-placeholder">
                {product.image}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="product-detail__info">
            <div className="product-detail__header">
              <h1 className="product-detail__title">{product.name}</h1>
              <div className="product-detail__price">${product.price}</div>
            </div>

            <div className="product-detail__description">
              <p>{product.description}</p>
            </div>

            {/* Size Selection */}
            <div className="product-detail__options">
              <div className="product-detail__option-group">
                <label className="product-detail__label">Size:</label>
                <div className="product-detail__sizes">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className={`product-detail__size-btn ${selectedSize === size ? 'product-detail__size-btn--selected' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div className="product-detail__option-group">
                <label className="product-detail__label">Color:</label>
                <div className="product-detail__colors">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      className={`product-detail__color-btn ${selectedColor === color ? 'product-detail__color-btn--selected' : ''}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="product-detail__option-group">
                <label className="product-detail__label">Quantity:</label>
                <div className="product-detail__quantity">
                  <button 
                    className="product-detail__quantity-btn"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="product-detail__quantity-value">{quantity}</span>
                  <button 
                    className="product-detail__quantity-btn"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="product-detail__actions">
              <button 
                className="product-detail__add-to-cart"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Stock Status */}
            <div className="product-detail__stock">
              <span className={`product-detail__stock-status ${product.inStock ? 'product-detail__stock-status--in-stock' : 'product-detail__stock-status--out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 