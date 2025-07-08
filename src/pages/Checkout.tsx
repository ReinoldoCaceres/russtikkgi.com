import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CheckoutFormData } from '../types';
import PaymentForm from '../components/PaymentForm';
import './Checkout.css';

const Checkout: React.FC = () => {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'card'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form data
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address || !formData.city || !formData.zipCode) {
      alert('Please fill in all required fields');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentIntent: any) => {
    setOrderComplete(true);
    clearCart();
  };

  const handlePaymentError = (error: string) => {
    alert(`Payment failed: ${error}`);
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="checkout checkout--empty">
        <div className="container">
          <h1 className="checkout__title">Checkout</h1>
          <div className="checkout__empty">
            <h2>Your bag is empty</h2>
            <p>Add some items to your bag before proceeding to checkout.</p>
            <a href="/" className="checkout__continue-shopping">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout checkout--complete">
        <div className="container">
          <div className="checkout__success">
            <div className="checkout__success-icon">✓</div>
            <h1 className="checkout__success-title">Order Confirmed</h1>
            <p className="checkout__success-message">
              Thank you for your purchase! Your order has been successfully placed.
            </p>
            <p className="checkout__success-details">
              You will receive a confirmation email shortly with your order details and tracking information.
            </p>
            <a href="/" className="checkout__continue-shopping">
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <div className="container">
        <h1 className="checkout__title">Checkout</h1>
        
        <div className="checkout__content">
          <div className="checkout__form-section">
            {!showPayment ? (
              <form onSubmit={handleFormSubmit} className="checkout__form">
              <div className="checkout__section">
                <h2 className="checkout__section-title">Contact Information</h2>
                <div className="checkout__form-group">
                  <label htmlFor="email" className="checkout__label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="checkout__input"
                    required
                  />
                </div>
              </div>

              <div className="checkout__section">
                <h2 className="checkout__section-title">Shipping Address</h2>
                <div className="checkout__form-row">
                  <div className="checkout__form-group">
                    <label htmlFor="firstName" className="checkout__label">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="checkout__input"
                      required
                    />
                  </div>
                  <div className="checkout__form-group">
                    <label htmlFor="lastName" className="checkout__label">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="checkout__input"
                      required
                    />
                  </div>
                </div>
                
                <div className="checkout__form-group">
                  <label htmlFor="address" className="checkout__label">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="checkout__input"
                    required
                  />
                </div>
                
                <div className="checkout__form-row">
                  <div className="checkout__form-group">
                    <label htmlFor="city" className="checkout__label">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="checkout__input"
                      required
                    />
                  </div>
                  <div className="checkout__form-group">
                    <label htmlFor="zipCode" className="checkout__label">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="checkout__input"
                      required
                    />
                  </div>
                </div>
                
                <div className="checkout__form-group">
                  <label htmlFor="country" className="checkout__label">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="checkout__select"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="checkout__submit"
              >
                Continue to Payment
              </button>
            </form>
            ) : (
              <div className="checkout__payment-section">
                <button 
                  onClick={() => setShowPayment(false)}
                  className="checkout__back-btn"
                >
                  ← Back to Shipping
                </button>
                <PaymentForm
                  amount={getTotalPrice()}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                  customerInfo={formData}
                />
              </div>
            )}
          </div>

          <div className="checkout__summary">
            <h2 className="checkout__summary-title">Order Summary</h2>
            
            <div className="checkout__items">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="checkout__item">
                  <div className="checkout__item-image">
                    <div className="checkout__item-placeholder">
                      {item.product.image}
                    </div>
                    <span className="checkout__item-quantity">{item.quantity}</span>
                  </div>
                  <div className="checkout__item-details">
                    <h4 className="checkout__item-name">{item.product.name}</h4>
                    <p className="checkout__item-options">
                      {item.size} / {item.color}
                    </p>
                    <p className="checkout__item-price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout__totals">
              <div className="checkout__total-row">
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="checkout__total-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="checkout__total-row">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="checkout__total-row checkout__total-row--final">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 