import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, withAuth } from './context/AuthContext';
import StripeProvider from './components/StripeProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import ProductManagement from './pages/ProductManagement';
import AdminSignIn from './pages/AdminSignIn';
import './App.css';

// Protected Admin Components
const ProtectedAdmin = withAuth(Admin);
const ProtectedProductManagement = withAuth(ProductManagement);

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminPage && <Header />}
      <main className={isAdminPage ? 'admin-main' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection/:category" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="/admin/products" element={<ProtectedProductManagement />} />
        </Routes>
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StripeProvider>
      <CartProvider>
        <AuthProvider>
          <Router>
            <AppLayout />
          </Router>
        </AuthProvider>
      </CartProvider>
    </StripeProvider>
  );
};

export default App; 