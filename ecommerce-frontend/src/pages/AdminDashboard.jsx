import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/App.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
    totalUsers: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    description: '',
    stock: '',
    rating: 4.5,
    reviews: 0,
    badge: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      const [ordersRes, productsRes, usersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/orders', config),
        axios.get('http://localhost:5000/api/products', config),
        axios.get('http://localhost:5000/api/users', config),
        axios.get('http://localhost:5000/api/admin/stats', config)
      ]);

      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
        stock: parseInt(newProduct.stock) || 100,
        rating: parseFloat(newProduct.rating) || 4.5,
        reviews: parseInt(newProduct.reviews) || 0
      };

      await axios.post('http://localhost:5000/api/products', productData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('✅ Product added successfully!');
      setShowAddProductModal(false);
      setNewProduct({
        name: '',
        price: '',
        originalPrice: '',
        category: '',
        image: '',
        description: '',
        stock: '',
        rating: 4.5,
        reviews: 0,
        badge: ''
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('❌ Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/products/${productId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Product deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('User deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert('Order status updated!');
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>🛍️ ShopHub Admin</h2>
          <p>Welcome, {user?.name}</p>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="nav-icon">📦</span>
            <span>Orders</span>
            {stats.pendingOrders > 0 && (
              <span className="badge">{stats.pendingOrders}</span>
            )}
          </button>
          <button
            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <span className="nav-icon">🛒</span>
            <span>Products</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon">👥</span>
            <span>Users</span>
            <span className="badge">{stats.totalUsers}</span>
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="admin-content"
            >
              <h1 className="page-title">Dashboard Overview</h1>

              {/* Stats Grid */}
              <div className="stats-grid">
                <motion.div className="stat-card" whileHover={{ y: -5 }}>
                  <div className="stat-icon total-orders">📦</div>
                  <div className="stat-info">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                  </div>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ y: -5 }}>
                  <div className="stat-icon total-revenue">💰</div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ y: -5 }}>
                  <div className="stat-icon total-products">🛒</div>
                  <div className="stat-info">
                    <h3>Total Products</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                  </div>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ y: -5 }}>
                  <div className="stat-icon pending-orders">⏳</div>
                  <div className="stat-info">
                    <h3>Pending Orders</h3>
                    <p className="stat-value">{stats.pendingOrders}</p>
                  </div>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ y: -5 }}>
                  <div className="stat-icon total-users">👥</div>
                  <div className="stat-info">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                </motion.div>

                <motion.div className="stat-card" whileHover={{ y: -5 }}>
                  <div className="stat-icon active-users">✅</div>
                  <div className="stat-info">
                    <h3>Active Users (30d)</h3>
                    <p className="stat-value">{stats.activeUsers}</p>
                  </div>
                </motion.div>
              </div>

              {/* Recent Orders */}
              <div className="recent-section">
                <h2>Recent Orders</h2>
                <div className="orders-table-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id}>
                          <td>#{order.orderNumber}</td>
                          <td>{order.shippingInfo?.name || 'N/A'}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>${order.total?.toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${order.status}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="admin-content"
            >
              <div className="page-header-actions">
                <h1 className="page-title">Products Management</h1>
                <motion.button
                  className="add-product-btn"
                  onClick={() => setShowAddProductModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">➕</span>
                  <span>Add New Product</span>
                </motion.button>
              </div>

              <div className="products-grid">
                {products.map((product) => (
                  <motion.div
                    key={product._id}
                    className="product-admin-card"
                    whileHover={{ y: -5 }}
                  >
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">${product.price?.toFixed(2)}</p>
                    <p className="product-stock">Stock: {product.stock || 0}</p>
                    <motion.button
                      className="delete-product-btn"
                      onClick={() => handleDeleteProduct(product._id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🗑️ Delete
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Orders & Users tabs remain the same... */}
        </AnimatePresence>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddProductModal && (
          <>
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddProductModal(false)}
            />
            <motion.div
              className="add-product-modal"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
            >
              <div className="modal-header">
                <h2>➕ Add New Product</h2>
                <button
                  className="close-modal-btn"
                  onClick={() => setShowAddProductModal(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="product-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Wireless Headphones"
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      required
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      <option value="">Select Category</option>
                      <option value="electronics">Electronics</option>
                      <option value="sports">Sports</option>
                      <option value="footwear">Footwear</option>
                      <option value="accessories">Accessories</option>
                      <option value="home">Home</option>
                      <option value="clothing">Clothing</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="99.99"
                    />
                  </div>

                  <div className="form-group">
                    <label>Original Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                      placeholder="129.99"
                    />
                  </div>

                  <div className="form-group">
                    <label>Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                      placeholder="100"
                    />
                  </div>

                  <div className="form-group">
                    <label>Badge</label>
                    <select
                      value={newProduct.badge}
                      onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                    >
                      <option value="">No Badge</option>
                      <option value="hot">Hot Deal</option>
                      <option value="new">New</option>
                      <option value="sale">Sale</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Image URL *</label>
                    <input
                      type="url"
                      required
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="https://images.unsplash.com/photo..."
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Product description..."
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowAddProductModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="submit-btn">
                    ✅ Add Product
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
