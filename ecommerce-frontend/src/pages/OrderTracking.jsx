import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useOrders } from '../context/OrderContext';
import '../styles/App.css';

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const orderData = await getOrderById(orderId);
      setOrder(orderData);
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="error-container">
        <h2>Order not found</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const trackingSteps = order.trackingSteps || [];
  const currentStepIndex = trackingSteps.findIndex(step => !step.completed);

  return (
    <div className="order-tracking-page">
      <motion.div 
        className="tracking-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="tracking-header">
          <motion.button 
            className="back-btn"
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back to Dashboard
          </motion.button>
          <h1>Track Your Order</h1>
          <p className="order-number">Order #{order.orderNumber || order._id.slice(-8)}</p>
        </div>

        {/* Order Summary Card */}
        <motion.div 
          className="order-summary-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="summary-row">
            <div className="summary-item">
              <span className="label">Order Date</span>
              <span className="value">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="summary-item">
              <span className="label">Total Amount</span>
              <span className="value amount">${order.total.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Delivery Address</span>
              <span className="value">{order.shippingInfo?.address}</span>
            </div>
          </div>
        </motion.div>

        {/* Tracking Timeline */}
        <motion.div 
          className="tracking-timeline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2>Order Progress</h2>
          <div className="timeline">
            {trackingSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`timeline-step ${step.completed ? 'completed' : ''} ${index === currentStepIndex ? 'active' : ''}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="step-marker">
                  {step.completed ? (
                    <motion.div 
                      className="checkmark"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      ✓
                    </motion.div>
                  ) : (
                    <div className="step-number">{index + 1}</div>
                  )}
                </div>
                <div className="step-content">
                  <h3>{step.status}</h3>
                  {step.date && (
                    <p className="step-date">
                      {new Date(step.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
                {index < trackingSteps.length - 1 && (
                  <div className={`timeline-connector ${step.completed ? 'completed' : ''}`} />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div 
          className="order-items-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2>Order Items</h2>
          <div className="items-list">
            {order.items?.map((item, index) => (
              <motion.div
                key={index}
                className="tracking-item-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}
              >
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div 
          className="support-card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3>Need Help?</h3>
          <p>Contact our customer support for any queries</p>
          <div className="support-contacts">
            <div className="contact-item">
              <span className="icon">📧</span>
              <span>support@shophub.com</span>
            </div>
            <div className="contact-item">
              <span className="icon">📞</span>
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderTracking;
