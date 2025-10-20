import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Redirect to home if no order details
    if (!orderDetails) {
      navigate('/');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null;
  }

  const { orderNumber, items, total, customerInfo, estimatedDelivery } = orderDetails;

  return (
    <motion.div 
      className="order-success-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="order-success-container">
        {/* Success Animation */}
        <motion.div
          className="success-animation"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <motion.div
            className="success-checkmark"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <svg viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" />
              <motion.path
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          className="success-content"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h1>🎉 Order Placed Successfully!</h1>
          <p className="success-subtitle">
            Thank you for your purchase! Your order has been confirmed.
          </p>
          
          <div className="order-number-box">
            <span className="order-label">Order Number</span>
            <span className="order-number">{orderNumber}</span>
          </div>

          <p className="confirmation-text">
            A confirmation email has been sent to <strong>{customerInfo.email}</strong>
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          className="order-details-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="order-card-header">
            <h2>Order Summary</h2>
            <span className="estimated-delivery">
              📦 Estimated Delivery: <strong>{estimatedDelivery}</strong>
            </span>
          </div>

          {/* Ordered Items */}
          <div className="ordered-items">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                className="ordered-item"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <div className="item-image-wrapper">
                  <img src={item.image} alt={item.name} />
                  <span className="item-qty">×{item.quantity}</span>
                </div>
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">${item.price.toFixed(2)}</p>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Total */}
          <div className="order-total-section">
            <div className="total-row">
              <span>Total Amount</span>
              <span className="total-amount">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="shipping-info">
            <h3>📍 Shipping Address</h3>
            <p>{customerInfo.firstName} {customerInfo.lastName}</p>
            <p>{customerInfo.address}</p>
            <p>{customerInfo.city}, {customerInfo.zipCode}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="success-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <Link to="/">
            <motion.button
              className="btn-continue-shopping"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🛍️</span>
              <span>Continue Shopping</span>
            </motion.button>
          </Link>

          <motion.button
            className="btn-track-order"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('Track order feature coming soon!')}
          >
            <span>📦</span>
            <span>Track Order</span>
          </motion.button>
        </motion.div>

        {/* Auto Redirect Timer */}
        <motion.div
          className="redirect-timer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          Redirecting to home in <strong>{countdown}</strong> seconds...
        </motion.div>

        {/* Features */}
        <motion.div
          className="order-features"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <div className="feature-item">
            <span className="feature-icon">🚚</span>
            <h4>Free Shipping</h4>
            <p>Track your package</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <h4>Secure Payment</h4>
            <p>100% Protected</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💳</span>
            <h4>Easy Returns</h4>
            <p>30-day policy</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📞</span>
            <h4>24/7 Support</h4>
            <p>Always here to help</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderSuccess;
