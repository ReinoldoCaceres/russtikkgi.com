import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart();

  const handleQuantityChange = (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(productId, size, color, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string, size: string, color: string) => {
    removeFromCart(productId, size, color);
  };

  const getProductImageSrc = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    return primaryImage?.path || primaryImage?.filename;
  };

  const getProductImageAlt = (product: Product) => {
    const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
    return primaryImage?.alt || product.name;
  };

  const getProductId = (product: Product) => {
    return product.id || product._id || '';
  };

  if (items.length === 0) {
    return (
      <div className="cart cart--empty">
        <div className="container">
          <div className="cart__empty">
            <h1 className="cart__title">Your Shopping Bag</h1>
            <div className="cart__empty-content">
              <h2>Your bag is empty</h2>
              <p>Add some luxury items to your bag and they'll appear here.</p>
              <Link to="/" className="cart__continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <h1 className="cart__title">Your Shopping Bag ({getTotalItems()} items)</h1>
        
        <div className="cart__content">
          <div className="cart__items">
            {items.map((item) => {
              const productId = getProductId(item.product);
              return (
                <div key={`${productId}-${item.size}-${item.color}`} className="cart__item">
                  <div className="cart__item-image">
                    {getProductImageSrc(item.product) ? (
                      <img 
                        src={getProductImageSrc(item.product)} 
                        alt={getProductImageAlt(item.product)}
                        className="cart__item-img"
                      />
                    ) : (
                      <div className="cart__item-placeholder">
                        No Image
                      </div>
                    )}
                  </div>
                  
                  <div className="cart__item-details">
                    <h3 className="cart__item-name">{item.product.name}</h3>
                    <p className="cart__item-price">${item.product.price}</p>
                    <div className="cart__item-options">
                      <span className="cart__item-option">Size: {item.size}</span>
                      <span className="cart__item-option">Color: {item.color}</span>
                    </div>
                  </div>
                  
                  <div className="cart__item-quantity">
                    <label className="cart__quantity-label">Qty:</label>
                    <div className="cart__quantity-controls">
                      <button 
                        className="cart__quantity-btn"
                        onClick={() => handleQuantityChange(productId, item.size, item.color, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="cart__quantity-value">{item.quantity}</span>
                      <button 
                        className="cart__quantity-btn"
                        onClick={() => handleQuantityChange(productId, item.size, item.color, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="cart__item-total">
                    <p className="cart__item-total-price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  <button 
                    className="cart__item-remove"
                    onClick={() => handleRemoveItem(productId, item.size, item.color)}
                    aria-label="Remove item"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="cart__summary">
            <h2 className="cart__summary-title">Order Summary</h2>
            
            <div className="cart__summary-line">
              <span>Subtotal ({getTotalItems()} items)</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            
            <div className="cart__summary-line">
              <span>Shipping</span>
              <span>FREE</span>
            </div>
            
            <div className="cart__summary-line">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className="cart__summary-total">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            
            <Link to="/checkout" className="cart__checkout-btn">
              Proceed to Checkout
            </Link>
            
            <Link to="/" className="cart__continue-shopping">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 