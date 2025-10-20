import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Cart from './Cart';
import AuthModal from './AuthModal';
import '../styles/App.css'



const Header = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { cartItems, getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Wishlist', path: '/wishlist', icon: '❤️' }
  ];

  const isActive = (path) => location.pathname === path;
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <motion.header 
        className={`header ${isScrolled ? 'scrolled' : ''} ${isDarkMode ? 'dark' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-wrapper">
          <div className="header-content">
            {/* Logo */}
            <Link to="/" className="logo">
              <motion.span 
                className="logo-icon"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                🛒
              </motion.span>
              <div className="logo-info">
                <span className="logo-text">ShopHub</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="main-nav">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="header-search">
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-wrapper">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            {/* Header Actions */}
            <div className="header-actions">
              {/* Theme Toggle */}
              <motion.button
                className="icon-btn theme-toggle"
                onClick={toggleTheme}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </motion.button>

              {/* User Authentication & Dashboard */}
              {user ? (
                <>
                  {/* Dashboard Link */}
                  {user.role === 'admin' ? (
                    <Link to="/admin">
                      <motion.button
                        className="icon-btn dashboard-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Admin Dashboard"
                      >
                        ⚙️
                      </motion.button>
                    </Link>
                  ) : (
                    <Link to="/dashboard">
                      <motion.button
                        className="icon-btn dashboard-btn"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="My Dashboard"
                      >
                        📊
                      </motion.button>
                    </Link>
                  )}

                  {/* User Menu */}
                  <div 
                    className="user-menu" 
                    onMouseEnter={() => setShowUserMenu(true)} 
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <motion.button 
                      className="user-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="user-icon">👤</span>
                      <span className="user-name">{user.name}</span>
                    </motion.button>
                    
                    <AnimatePresence>
                      {showUserMenu && (
                        <motion.div 
                          className="user-dropdown"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link to="/dashboard" onClick={() => setShowUserMenu(false)}>
                            <span className="dropdown-icon">📊</span>
                            Dashboard
                          </Link>
                          {user.role === 'admin' && (
                            <Link to="/admin" onClick={() => setShowUserMenu(false)}>
                              <span className="dropdown-icon">⚙️</span>
                              Admin Panel
                            </Link>
                          )}
                          <button onClick={handleLogout}>
                            <span className="dropdown-icon">🚪</span>
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <motion.button
                  className="sign-in-btn"
                  onClick={() => setIsAuthModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">👤</span>
                  <span className="btn-text">Sign In</span>
                </motion.button>
              )}

              {/* Notifications */}
              <motion.button
                className="icon-btn notification-btn"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Notifications"
              >
                🔔
                <span className="icon-badge">5</span>
              </motion.button>

              {/* Cart Button - FIXED: Added Link wrapper */}
              <Link to="/cart" style={{ textDecoration: 'none' }}>
                <motion.button
                  className="cart-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">🛒</span>
                  <span className="btn-text">Cart</span>
                  {cartItemsCount > 0 && (
                    <motion.span 
                      className="cart-count"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Mobile Menu Button */}
              <button
                className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu - Rest of the code remains same */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="mobile-menu-header">
                <h3>Menu</h3>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {user && (
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">👤</div>
                  <div className="mobile-user-details">
                    <p className="mobile-user-name">{user.name}</p>
                    <p className="mobile-user-email">{user.email}</p>
                  </div>
                </div>
              )}

              <nav className="mobile-nav">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="mobile-nav-icon">{item.icon}</span>
                    <span className="mobile-nav-text">{item.name}</span>
                  </Link>
                ))}

                {user && (
                  <>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/dashboard'}
                      className="mobile-nav-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mobile-nav-icon">
                        {user.role === 'admin' ? '⚙️' : '📊'}
                      </span>
                      <span className="mobile-nav-text">
                        {user.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
                      </span>
                    </Link>

                    <button
                      className="mobile-nav-link mobile-logout-btn"
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <span className="mobile-nav-icon">🚪</span>
                      <span className="mobile-nav-text">Logout</span>
                    </button>
                  </>
                )}

                {!user && (
                  <button
                    className="mobile-nav-link mobile-login-btn"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span className="mobile-nav-icon">👤</span>
                    <span className="mobile-nav-text">Sign In</span>
                  </button>
                )}
              </nav>

              <div className="mobile-menu-footer">
                <button 
                  className="mobile-theme-toggle"
                  onClick={toggleTheme}
                >
                  {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && <Cart onClose={() => setShowCart(false)} />}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Header;
