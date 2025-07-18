import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminSignIn.css';

const AdminSignIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/admin'); // Redirect to admin orders page
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-signin">
      <div className="admin-signin__container">
        <div className="admin-signin__card">
          <div className="admin-signin__header">
            <h1 className="admin-signin__title">russtikk</h1>
            <p className="admin-signin__subtitle">Admin Portal</p>
          </div>

          <form className="admin-signin__form" onSubmit={handleSubmit}>
            <div className="admin-signin__form-group">
              <label htmlFor="username" className="admin-signin__label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="admin-signin__input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={loading}
              />
            </div>

            <div className="admin-signin__form-group">
              <label htmlFor="password" className="admin-signin__label">
                Password
              </label>
              <div className="admin-signin__password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="admin-signin__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="admin-signin__password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="admin-signin__error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="admin-signin__submit"
              disabled={loading || !username || !password}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="admin-signin__footer">
            <p className="admin-signin__footer-text">
              Secure admin access for russtikk.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn; 