import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/App.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isDarkMode } = useTheme();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="product-card-link">
      <motion.div
        className={`product-card ${isDarkMode ? 'dark' : ''}`}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        <div className="product-image-container">
          {!imageError ? (
            <img src={product.image} alt={product.name} className="product-image"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="product-image-placeholder">
              <span className="placeholder-icon">📦</span>
              <span className="placeholder-text">Product Image</span>
            </div>
          )}
          
          {/* Badges positioned at top corners */}
          {discount > 0 && (
            <motion.div 
              className="product-badge discount-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {discount}% OFF
            </motion.div>
          )}
          
          {product.badge === 'new' && (
            <motion.div 
              className="product-badge new-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🆕 NEW
            </motion.div>
          )}
          
          {product.badge === 'hot' && (
            <motion.div 
              className="product-badge hot-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🔥 Hot Deal
            </motion.div>
          )}
        </div>

        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-rating">
            <div className="stars">
              {'⭐'.repeat(Math.floor(product.rating))}
            </div>
            <span className="reviews-count">({product.reviews || 0})</span>
          </div>

          <div className="product-price-section">
            <div className="price-group">
              <span className="current-price">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </div>

          <motion.button
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isAdded ? (
              <>
                <span className="btn-icon">✓</span>
                <span className="btn-text">Added to Cart!</span>
              </>
            ) : (
              <>
                <span className="btn-icon">🛒</span>
                <span className="btn-text">Add to Cart</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
