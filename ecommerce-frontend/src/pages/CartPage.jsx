import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/App.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  const [removingItems, setRemovingItems] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Handle remove with animation
  const handleRemove = (itemId) => {
    setRemovingItems([...removingItems, itemId]);
    setTimeout(() => {
      removeFromCart(itemId);
      setRemovingItems(removingItems.filter(id => id !== itemId));
    }, 300);
  };

  // Handle coupon apply
  const handleApplyCoupon = () => {
    const code = couponCode.toUpperCase();
    if (code === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 10 });
    } else if (code === 'WELCOME20') {
      setAppliedCoupon({ code: 'WELCOME20', discount: 20 });
    } else {
      alert('❌ Invalid coupon code! Try SAVE10 or WELCOME20');
      return;
    }
    setCouponCode('');
    setShowCouponInput(false);
  };

  // Handle checkout navigation
  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Empty cart state
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={`modern-cart-page empty ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="cart-wrapper">
          <motion.div
            className="empty-cart-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="empty-icon-wrapper"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🛒
            </motion.div>
            <h1>Your Cart is Empty</h1>
            <p>Start adding items to your cart and they'll appear here</p>
            
            <div className="quick-action-cards">
              <motion.div whileHover={{ y: -5 }} className="action-card">
                <div className="card-icon">📱</div>
                <h3>Electronics</h3>
                <p>Latest gadgets</p>
                <Link to="/?category=electronics">Explore →</Link>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="action-card">
                <div className="card-icon">👕</div>
                <h3>Fashion</h3>
                <p>Trending styles</p>
                <Link to="/?category=fashion">Explore →</Link>
              </motion.div>
              <motion.div whileHover={{ y: -5 }} className="action-card">
                <div className="card-icon">🎁</div>
                <h3>Deals</h3>
                <p>Special offers</p>
                <Link to="/">Explore →</Link>
              </motion.div>
            </div>
            
            <Link to="/">
              <motion.button
                className="start-shopping-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Shopping
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal + shipping + tax - couponDiscount;
  const freeShippingRemaining = Math.max(50 - subtotal, 0);

  return (
    <div className={`modern-cart-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="cart-wrapper">
        {/* Breadcrumb Navigation */}
        <nav className="cart-breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">›</span>
          <span className="current">Shopping Cart</span>
        </nav>

        {/* Page Header */}
        <div className="cart-page-header">
          <div className="header-left">
            <h1 className="page-title">Shopping Cart</h1>
            <p className="items-count">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
          </div>
          <motion.button
            className="clear-all-btn"
            onClick={() => setShowClearConfirm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="btn-icon">🗑️</span>
            Clear Cart
          </motion.button>
        </div>

        {/* Free Shipping Progress Bar */}
        {freeShippingRemaining > 0 ? (
          <motion.div 
            className="shipping-progress-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="progress-info">
              <span className="icon">🚚</span>
              <p>
                Add <strong>${freeShippingRemaining.toFixed(2)}</strong> more to unlock <strong>FREE SHIPPING</strong>
              </p>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="free-shipping-unlocked"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <span className="icon">🎉</span>
            <p>Congratulations! You've unlocked <strong>FREE SHIPPING!</strong></p>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="cart-main-grid">
          {/* Cart Items Section */}
          <div className="cart-items-container">
            <div className="cart-items-header">
              <div className="header-col product-col">Product</div>
              <div className="header-col price-col">Price</div>
              <div className="header-col qty-col">Quantity</div>
              <div className="header-col total-col">Total</div>
              <div className="header-col action-col"></div>
            </div>

            <div className="cart-items-list">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`cart-item-row ${removingItems.includes(item.id) ? 'removing' : ''}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <div className="item-product">
                      <div className="product-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{item.name}</h3>
                        <p className="product-category">{item.category}</p>
                        {item.color && <p className="product-variant">Color: {item.color}</p>}
                        {item.size && <p className="product-variant">Size: {item.size}</p>}
                      </div>
                    </div>

                    <div className="item-price">
                      <span className="mobile-label">Price:</span>
                      <span className="price-amount">${item.price.toFixed(2)}</span>
                    </div>

                    <div className="item-quantity">
                      <span className="mobile-label">Quantity:</span>
                      <div className="quantity-selector">
                        <motion.button
                          className="qty-btn decrease"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </motion.button>
                        <span className="qty-value">{item.quantity}</span>
                        <motion.button
                          className="qty-btn increase"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>

                    <div className="item-total">
                      <span className="mobile-label">Total:</span>
                      <span className="total-amount">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    <div className="item-actions">
                      <motion.button
                        className="remove-btn"
                        onClick={() => handleRemove(item.id)}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        title="Remove item"
                      >
                        ✕
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary-sidebar">
            <div className="summary-card">
              <h2 className="summary-title">Order Summary</h2>

              {/* Coupon Section */}
              <div className="coupon-section">
                <motion.button
                  className="coupon-toggle-btn"
                  onClick={() => setShowCouponInput(!showCouponInput)}
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="coupon-icon">🎟️</span>
                  <span>Have a Coupon Code?</span>
                  <span className="toggle-arrow">{showCouponInput ? '−' : '+'}</span>
                </motion.button>

                <AnimatePresence>
                  {showCouponInput && (
                    <motion.div
                      className="coupon-input-container"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div className="coupon-input-group">
                        <input
                          type="text"
                          className="coupon-input"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        />
                        <motion.button
                          className="apply-coupon-btn"
                          onClick={handleApplyCoupon}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Apply
                        </motion.button>
                      </div>
                      <div className="coupon-hints">
                        <small>💡 Try: <strong>SAVE10</strong> or <strong>WELCOME20</strong></small>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {appliedCoupon && (
                  <motion.div
                    className="applied-coupon-badge"
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                  >
                    <span className="badge-text">
                      ✓ {appliedCoupon.code} applied ({appliedCoupon.discount}% off)
                    </span>
                    <button
                      className="remove-coupon-btn"
                      onClick={() => setAppliedCoupon(null)}
                    >
                      ✕
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span className="row-label">Subtotal</span>
                  <span className="row-value">${subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row">
                  <span className="row-label">Shipping</span>
                  <span className="row-value shipping-value">
                    {shipping === 0 ? <span className="free-tag">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="price-row">
                  <span className="row-label">Tax (8%)</span>
                  <span className="row-value">${tax.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="price-row discount-row">
                    <span className="row-label">Discount</span>
                    <span className="row-value discount-value">−${couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="price-row total-row">
                  <span className="row-label">Total</span>
                  <span className="row-value total-value">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="summary-actions">
                <motion.button
                  className="proceed-checkout-btn"
                  onClick={handleCheckout}
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="btn-icon">💳</span>
                  <span>Proceed to Checkout</span>
                </motion.button>
                
                <Link to="/">
                  <button className="continue-shopping-link">
                    ← Continue Shopping
                  </button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="trust-badges-grid">
                <div className="trust-badge">
                  <div className="badge-icon">🔒</div>
                  <div className="badge-content">
                    <strong>Secure Payment</strong>
                    <small>SSL Encrypted</small>
                  </div>
                </div>
                <div className="trust-badge">
                  <div className="badge-icon">🚚</div>
                  <div className="badge-content">
                    <strong>Fast Delivery</strong>
                    <small>2-4 Business Days</small>
                  </div>
                </div>
                <div className="trust-badge">
                  <div className="badge-icon">↩️</div>
                  <div className="badge-content">
                    <strong>Easy Returns</strong>
                    <small>30-Day Policy</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Cart Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <>
              <motion.div
                className="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowClearConfirm(false)}
              />
              <motion.div
                className="confirm-modal"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
              >
                <div className="modal-icon-wrapper">🗑️</div>
                <h3>Clear Shopping Cart?</h3>
                <p>Are you sure you want to remove all {cartItems.length} items from your cart?</p>
                <div className="modal-button-group">
                  <motion.button
                    className="modal-btn cancel-btn"
                    onClick={() => setShowClearConfirm(false)}
                    whileHover={{ scale: 1.05 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="modal-btn confirm-btn"
                    onClick={() => {
                      clearCart();
                      setShowClearConfirm(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Clear Cart
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CartPage;
