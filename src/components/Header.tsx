import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header__top-bar">
        <div className="container">
          <div className="header__top-content">
            <div className="header__shipping">
              Complimentary shipping for all orders
            </div>
            <div className="header__location">
              SHIPPING TO: United States ($) | LANGUAGE: English
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header__main">
        <div className="container">
          <div className="header__content">
            {/* Left Navigation */}
            <nav className="header__nav header__nav--left">
              <button 
                className="header__menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="header__menu-text">Menu</span>
                <div className="header__menu-icon">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </button>
            </nav>

            {/* Logo */}
            <div className="header__logo">
              <Link to="/">
                <h1>russtikk</h1>
              </Link>
            </div>

            {/* Right Navigation */}
            <nav className="header__nav header__nav--right">
              <button className="header__nav-btn">
                <span className="sr-only">Search</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
              <button className="header__nav-btn">
                <span>Login</span>
              </button>
              <Link to="/cart" className="header__nav-btn header__cart">
                <span className="header__cart-text">{getTotalItems()} item(s) in the cart</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 01-8 0"></path>
                </svg>
                {getTotalItems() > 0 && (
                  <span className="header__cart-count">{getTotalItems()}</span>
                )}
              </Link>
            </nav>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="header__categories">
        <div className="container">
          <nav className="header__category-nav">
            <Link to="/" className="header__category-link">New In</Link>
            <Link to="/collection/swimwear" className="header__category-link">Swimwear</Link>
            <Link to="/collection/ball-gowns" className="header__category-link">Ball Gowns</Link>
            <Link to="/collection/revamp" className="header__category-link">ReVamp</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="header__mobile-menu">
          <div className="header__mobile-content">
            <button 
              className="header__close-btn"
              onClick={() => setIsMenuOpen(false)}
            >
              ✕
            </button>
            <nav className="header__mobile-nav">
              <Link to="/" className="header__mobile-link" onClick={() => setIsMenuOpen(false)}>New In</Link>
              <Link to="/collection/swimwear" className="header__mobile-link" onClick={() => setIsMenuOpen(false)}>Swimwear</Link>
              <Link to="/collection/ball-gowns" className="header__mobile-link" onClick={() => setIsMenuOpen(false)}>Ball Gowns</Link>
              <Link to="/collection/revamp" className="header__mobile-link" onClick={() => setIsMenuOpen(false)}>ReVamp</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 