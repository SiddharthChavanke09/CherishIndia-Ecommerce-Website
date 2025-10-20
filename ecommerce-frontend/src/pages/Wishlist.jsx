import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import '../styles/App.css';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      originalPrice: 129.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      rating: 4.5,
      reviews: 128,
      inStock: true,
      color: 'Black',
      size: 'Standard'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      originalPrice: 249.99,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      rating: 4.3,
      reviews: 89,
      inStock: true,
      color: 'Silver',
      size: 'Medium'
    },
    {
      id: 4,
      name: 'Running Shoes',
      price: 129.99,
      category: 'footwear',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      rating: 4.7,
      reviews: 342,
      inStock: true,
      color: 'Blue',
      size: 'US 10'
    },
    {
      id: 7,
      name: 'Wireless Earbuds',
      price: 79.99,
      category: 'electronics',
      image: 'https://www.google.com/imgres?q=wireless%20earphones&imgurl=https%3A%2F%2Favstore.in%2Fcdn%2Fshop%2Ffiles%2F1.AVStore-Denon-AH-C630-W-Front-View-With-Charging-Case-Black.jpg%3Fv%3D1708340888&imgrefurl=https%3A%2F%2Favstore.in%2Fproducts%2Fdenon-ah-c630w%3Fsrsltid%3DAfmBOoo2VTyEIkB_2c84INNpvPlTIpXwsCturSe9gjeG5IPxdUdte4Mr&docid=rpf1kCUuaYsWoM&tbnid=rmhaO9WYc-pTIM&vet=12ahUKEwiY6uLBhrOQAxX2RmwGHTTkAGEQM3oECBUQAA..i&w=2000&h=2000&hcb=2&ved=2ahUKEwiY6uLBhrOQAxX2RmwGHTTkAGEQM3oECBUQAA',
      rating: 4.3,
      reviews: 189,
      inStock: false,
      color: 'White',
      size: 'Standard'
    },
    {
      id: 8,
      name: 'Designer Sunglasses',
      price: 89.99,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      rating: 4.5,
      reviews: 156,
      inStock: true,
      color: 'Gold',
      size: 'Medium'
    }
  ]);

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('default');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const { addToCart } = useCart();

  const showNotify = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const removeFromWishlist = (id, name) => {
    setWishlist(wishlist.filter(item => item.id !== id));
    showNotify(`${name} removed from wishlist`);
  };

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id, product.name);
    showNotify(`${product.name} moved to cart!`);
  };

  const addAllToCart = () => {
    const inStockItems = wishlist.filter(item => item.inStock);
    inStockItems.forEach(item => addToCart(item));
    setWishlist(wishlist.filter(item => !item.inStock));
    showNotify(`${inStockItems.length} items added to cart!`);
  };

  const sortWishlist = (items) => {
    switch (sortBy) {
      case 'price-low':
        return [...items].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...items].sort((a, b) => b.price - a.price);
      case 'rating':
        return [...items].sort((a, b) => b.rating - a.rating);
      case 'name':
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return items;
    }
  };

  const sortedWishlist = sortWishlist(wishlist);
  const totalValue = wishlist.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = wishlist.reduce((sum, item) => sum + (item.originalPrice ? item.originalPrice - item.price : 0), 0);
  const inStockCount = wishlist.filter(item => item.inStock).length;

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <motion.div
            className="empty-wishlist"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="empty-wishlist-icon"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💝
            </motion.div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you love to your wishlist and shop them later!</p>
            <Link to="/">
              <motion.button 
                className="btn btn-primary"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(102, 126, 234, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🛍️</span>
                <span>Start Shopping</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="wishlist-notification"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <span className="notification-icon">✓</span>
            <span>{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="wishlist-container">
        {/* Header with Stats */}
        <motion.div
          className="wishlist-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="wishlist-title-section">
            <h1>My Wishlist ❤️</h1>
            <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
          </div>

          <div className="wishlist-stats">
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <div className="stat-info">
                <span className="stat-label">Total Value</span>
                <span className="stat-value">${totalValue.toFixed(2)}</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎉</span>
              <div className="stat-info">
                <span className="stat-label">You Save</span>
                <span className="stat-value savings">${totalSavings.toFixed(2)}</span>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <span className="stat-label">In Stock</span>
                <span className="stat-value">{inStockCount}/{wishlist.length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          className="wishlist-toolbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <span>⊞</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <span>☰</span>
            </button>
          </div>

          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {inStockCount > 0 && (
            <motion.button
              className="add-all-btn"
              onClick={addAllToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🛒</span>
              <span>Add All to Cart ({inStockCount})</span>
            </motion.button>
          )}
        </motion.div>

        {/* Wishlist Grid/List */}
        <div className={`wishlist-${viewMode}`}>
          <AnimatePresence>
            {sortedWishlist.map((item, index) => (
              <motion.div
                key={item.id}
                className="wishlist-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                layout
              >
                {/* Stock Badge */}
                {!item.inStock && (
                  <motion.div 
                    className="out-of-stock-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    Out of Stock
                  </motion.div>
                )}

                {/* Remove Button */}
                <motion.button
                  className="remove-wishlist-btn"
                  onClick={() => removeFromWishlist(item.id, item.name)}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  title="Remove from wishlist"
                >
                  ✕
                </motion.button>

                {/* Product Image */}
                <Link to={`/product/${item.id}`}>
                  <motion.div 
                    className="wishlist-item-image"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={item.image} alt={item.name} />
                    {item.originalPrice && (
                      <div className="discount-badge">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </motion.div>
                </Link>

                {/* Product Info */}
                <div className="wishlist-item-info">
                  <div className="wishlist-item-category">{item.category}</div>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="wishlist-item-name">{item.name}</h3>
                  </Link>
                  
                  {/* Rating */}
                  <div className="wishlist-item-rating">
                    <div className="stars">{'⭐'.repeat(Math.floor(item.rating))}</div>
                    <span className="rating-count">{item.rating} ({item.reviews})</span>
                  </div>

                  {/* Attributes */}
                  <div className="item-attributes">
                    <span className="attribute">
                      <span className="attr-icon">🎨</span>
                      {item.color}
                    </span>
                    <span className="attribute">
                      <span className="attr-icon">📏</span>
                      {item.size}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="wishlist-item-price">
                    <span className="price">${item.price}</span>
                    {item.originalPrice && (
                      <>
                        <span className="original-price">${item.originalPrice}</span>
                        <span className="savings-badge">
                          Save ${(item.originalPrice - item.price).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="item-actions">
                    <motion.button
                      className={`move-to-cart-btn ${!item.inStock ? 'disabled' : ''}`}
                      onClick={() => item.inStock && moveToCart(item)}
                      disabled={!item.inStock}
                      whileHover={item.inStock ? { scale: 1.02 } : {}}
                      whileTap={item.inStock ? { scale: 0.98 } : {}}
                    >
                      {item.inStock ? (
                        <>
                          <span>🛒</span>
                          <span>Move to Cart</span>
                        </>
                      ) : (
                        <>
                          <span>🔔</span>
                          <span>Notify When Available</span>
                        </>
                      )}
                    </motion.button>

                    <Link to={`/product/${item.id}`}>
                      <motion.button
                        className="view-details-btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        View Details
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <motion.div
          className="wishlist-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/">
            <motion.button
              className="continue-shopping"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>←</span>
              <span>Continue Shopping</span>
            </motion.button>
          </Link>

          <div className="share-wishlist">
            <motion.button
              className="share-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🔗</span>
              <span>Share Wishlist</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist;
