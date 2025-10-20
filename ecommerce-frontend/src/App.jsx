import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OrderTracking from './pages/OrderTracking';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

// Footer Component
const Footer = () => {
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: 'All Products', path: '/' },
      { name: 'Electronics', path: '/?category=electronics' },
      { name: 'Fashion', path: '/?category=fashion' },
      { name: 'Home & Garden', path: '/?category=home' }
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Blog', path: '/blog' }
    ],
    support: [
      { name: 'Help Center', path: '/help' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Track Order', path: '/tracking' },
      { name: 'Returns', path: '/returns' }
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Sitemap', path: '/sitemap' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#', color: '#1877f2' },
    { name: 'Twitter', icon: '🐦', url: '#', color: '#1da1f2' },
    { name: 'Instagram', icon: '📷', url: '#', color: '#e4405f' },
    { name: 'LinkedIn', icon: '💼', url: '#', color: '#0077b5' },
    { name: 'YouTube', icon: '▶️', url: '#', color: '#ff0000' }
  ];

  return (
    <footer className={`app-footer ${isDarkMode ? 'dark' : ''}`}>
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <motion.h3
                  whileHover={{ scale: 1.05 }}
                >
                  🛒 ShopHub
                </motion.h3>
              </Link>
              <p className="footer-tagline">
                Your one-stop destination for amazing products at incredible prices.
              </p>
              
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    className="social-icon"
                    aria-label={social.name}
                    whileHover={{ 
                      scale: 1.2, 
                      y: -3,
                      backgroundColor: social.color 
                    }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>

              <div className="app-download">
                <p className="download-text">Download Our App</p>
                <div className="download-buttons">
                  <motion.button 
                    className="download-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="btn-icon">🍎</span>
                    <div className="btn-text">
                      <small>Download on</small>
                      <strong>App Store</strong>
                    </div>
                  </motion.button>
                  <motion.button 
                    className="download-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="btn-icon">📱</span>
                    <div className="btn-text">
                      <small>Get it on</small>
                      <strong>Google Play</strong>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="footer-links-section">
              <h4>Shop</h4>
              <ul className="footer-links">
                {footerLinks.shop.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={link.path}>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4>Company</h4>
              <ul className="footer-links">
                {footerLinks.company.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={link.path}>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4>Support</h4>
              <ul className="footer-links">
                {footerLinks.support.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={link.path}>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="footer-links-section">
              <h4>Legal</h4>
              <ul className="footer-links">
                {footerLinks.legal.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={link.path}>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} ShopHub. All rights reserved.
            </p>
            
            <div className="payment-methods">
              <span className="payment-label">We accept:</span>
              <div className="payment-icons">
                {['💳', '💳', '💳', '💳', '💳'].map((icon, index) => (
                  <motion.span 
                    key={index} 
                    className="payment-icon"
                    whileHover={{ scale: 1.2, y: -2 }}
                  >
                    {icon}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

function AppContent() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <AppContent />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
