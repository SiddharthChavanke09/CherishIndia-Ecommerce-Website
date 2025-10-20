import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { orders, loading } = useOrders();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffa500',
      processing: '#3498db',
      shipped: '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="user-dashboard">
      <motion.div 
        className="dashboard-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sidebar */}
        <motion.aside 
          className="dashboard-sidebar"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="user-profile-card">
            <div className="avatar-wrapper">
              <div className="avatar-gradient">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <h2>{user?.name}</h2>
            <p>{user?.email}</p>
          </div>

          <nav className="dashboard-nav">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="nav-icon">{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
            <motion.button
              className="nav-item logout-btn"
              onClick={handleLogout}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="nav-icon">🚪</span>
              <span>Logout</span>
            </motion.button>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <motion.main 
          className="dashboard-main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === 'orders' && (
            <div className="orders-section">
              <div className="section-header">
                <h1>My Orders</h1>
                <p>Track and manage your orders</p>
              </div>

              {loading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <motion.div 
                  className="empty-state"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="empty-icon">📦</div>
                  <h3>No orders yet</h3>
                  <p>Start shopping and your orders will appear here</p>
                  <button className="cta-button" onClick={() => navigate('/')}>
                    Start Shopping
                  </button>
                </motion.div>
              ) : (
                <div className="orders-grid">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order._id}
                      className="order-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
                    >
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order #{order.orderNumber || order._id.slice(-8)}</h3>
                          <p className="order-date">
                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div 
                          className="order-status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {order.status}
                        </div>
                      </div>

                      <div className="order-items">
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="order-item-preview">
                            <img src={item.image} alt={item.name} />
                            <div>
                              <p className="item-name">{item.name}</p>
                              <p className="item-quantity">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <p className="more-items">+{order.items.length - 2} more items</p>
                        )}
                      </div>

                      <div className="order-footer">
                        <div className="order-total">
                          <span>Total:</span>
                          <strong>${order.total?.toFixed(2)}</strong>
                        </div>
                        <motion.button
                          className="track-btn"
                          onClick={() => navigate(`/order-tracking/${order._id}`)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Track Order
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h1>My Profile</h1>
                <p>Manage your personal information</p>
              </div>
              <motion.div 
                className="profile-form-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user?.name} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user?.email} disabled />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue={user?.phone || ''} />
                </div>
                <motion.button 
                  className="save-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Changes
                </motion.button>
              </motion.div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="addresses-section">
              <div className="section-header">
                <h1>Saved Addresses</h1>
                <p>Manage your delivery addresses</p>
              </div>
              <motion.button 
                className="add-address-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                + Add New Address
              </motion.button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="section-header">
                <h1>Settings</h1>
                <p>Customize your account preferences</p>
              </div>
              <motion.div 
                className="settings-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="setting-item">
                  <div>
                    <h3>Email Notifications</h3>
                    <p>Receive order updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div>
                    <h3>SMS Notifications</h3>
                    <p>Receive delivery updates via SMS</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </motion.div>
            </div>
          )}
        </motion.main>
      </motion.div>
    </div>
  );
};

export default UserDashboard;
