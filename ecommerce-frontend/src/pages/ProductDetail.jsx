import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import '../styles/App.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [showNotification, setShowNotification] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);

  // Mock product data - in real app, fetch from API
  const product = {
    id: parseInt(id),
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviews: 1247,
    category: 'Electronics',
    brand: 'AudioPro',
    inStock: true,
    stockCount: 23,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800'
    ],
    colors: [
      { name: 'black', hex: '#000000', label: 'Midnight Black' },
      { name: 'white', hex: '#ffffff', label: 'Pearl White' },
      { name: 'blue', hex: '#4169E1', label: 'Ocean Blue' },
      { name: 'red', hex: '#DC143C', label: 'Ruby Red' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Experience audio like never before with our Premium Wireless Headphones. Featuring active noise cancellation, 40-hour battery life, and superior sound quality that brings your music to life.',
    features: [
      '🎵 Active Noise Cancellation (ANC)',
      '🔋 40-hour battery life',
      '📱 Bluetooth 5.0 connectivity',
      '🎧 Premium leather ear cushions',
      '🎤 Crystal clear microphone',
      '🔊 Hi-Res audio certified'
    ],
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Impedance': '32 Ohms',
      'Sensitivity': '110 dB',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.0, 3.5mm jack'
    }
  };

  const relatedProducts = [
    {
      id: 2,
      name: 'Wireless Earbuds Pro',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=300',
      rating: 4.5
    },
    {
      id: 3,
      name: 'Portable Speaker',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300',
      rating: 4.3
    },
    {
      id: 4,
      name: 'Audio Cable Premium',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
      rating: 4.7
    },
    {
      id: 5,
      name: 'Headphone Stand',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300',
      rating: 4.6
    }
  ];

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor: product.colors.find(c => c.name === selectedColor)
    });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div 
      className="product-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="add-to-cart-notification"
            initial={{ opacity: 0, y: -100, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.5 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <span className="notification-icon">✓</span>
            <div className="notification-content">
              <h4>Added to Cart!</h4>
              <p>{product.name}</p>
            </div>
            <Link to="/cart">
              <motion.button
                className="notification-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Cart →
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="product-detail-container">
        {/* Breadcrumb */}
        <motion.nav 
          className="breadcrumb"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/">Products</Link>
          <span>/</span>
          <span className="current">{product.category}</span>
        </motion.nav>

        {/* Main Product Section */}
        <div className="product-detail-grid">
          {/* Image Gallery */}
          <motion.div 
            className="product-images"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <motion.div 
              className={`main-image ${isZoomed ? 'zoomed' : ''}`}
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {discount > 0 && (
                <motion.div 
                  className="discount-badge-large"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  {discount}% OFF
                </motion.div>
              )}

              {!product.inStock && (
                <div className="out-of-stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnail Gallery */}
            <motion.div 
              className="thumbnail-gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {product.images.map((img, index) => (
                <motion.div
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="product-info-main"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Brand & Stock */}
            <div className="product-meta">
              <span className="brand-badge">{product.brand}</span>
              {product.inStock && (
                <span className="stock-badge in-stock">
                  ✓ {product.stockCount} In Stock
                </span>
              )}
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {product.name}
            </motion.h1>

            {/* Rating */}
            <motion.div 
              className="product-rating-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stars-large">
                {'⭐'.repeat(Math.floor(product.rating))}
                {product.rating % 1 !== 0 && '⭐'}
              </div>
              <span className="rating-number">{product.rating}</span>
              <span className="reviews-count">({product.reviews} reviews)</span>
            </motion.div>

            {/* Price */}
            <motion.div 
              className="price-section"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              <span className="current-price">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="original-price-detail">${product.originalPrice}</span>
                  <span className="save-amount">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
                </>
              )}
            </motion.div>

            {/* Description */}
            <motion.p 
              className="product-description-short"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {product.description}
            </motion.p>

            {/* Color Selection */}
            <motion.div 
              className="color-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h4>Color: <span className="selected-color">{product.colors.find(c => c.name === selectedColor)?.label}</span></h4>
              <div className="color-options">
                {product.colors.map((color) => (
                  <motion.button
                    key={color.name}
                    className={`color-option ${selectedColor === color.name ? 'active' : ''}`}
                    onClick={() => setSelectedColor(color.name)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    title={color.label}
                  >
                    <span 
                      className="color-swatch"
                      style={{ backgroundColor: color.hex }}
                    />
                    {selectedColor === color.name && (
                      <motion.span 
                        className="color-checkmark"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div 
              className="size-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h4>Size: <span className="selected-size">{selectedSize}</span></h4>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    className={`size-option ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div 
              className="quantity-selector-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h4>Quantity:</h4>
              <div className="quantity-controls">
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={quantity <= 1}
                >
                  −
                </motion.button>
                <motion.span 
                  className="quantity-display"
                  key={quantity}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {quantity}
                </motion.span>
                <motion.button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={quantity >= 10}
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="product-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <motion.button
                className="btn-add-to-cart-large"
                onClick={handleAddToCart}
                disabled={!product.inStock}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-icon">🛒</span>
                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </motion.button>

              <motion.button
                className="btn-buy-now"
                disabled={!product.inStock}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="btn-icon">⚡</span>
                <span>Buy Now</span>
              </motion.button>

              <motion.button
                className="btn-wishlist-large"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                ❤️
              </motion.button>
            </motion.div>

            {/* Features List */}
            <motion.div 
              className="quick-features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {product.features.slice(0, 3).map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-item-small"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  {feature}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div 
          className="product-tabs-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="tabs-header">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <motion.button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="tab-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'description' && (
                <div className="description-content">
                  <h3>Product Description</h3>
                  <p>{product.description}</p>
                  <h4>Key Features:</h4>
                  <ul className="features-list">
                    {product.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="specifications-content">
                  <h3>Technical Specifications</h3>
                  <table className="specs-table">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value], index) => (
                        <motion.tr
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className="spec-label">{key}</td>
                          <td className="spec-value">{value}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="reviews-content">
                  <div className="reviews-summary">
                    <div className="rating-overview">
                      <span className="big-rating">{product.rating}</span>
                      <div>
                        <div className="stars-large">{'⭐'.repeat(Math.floor(product.rating))}</div>
                        <p>{product.reviews} reviews</p>
                      </div>
                    </div>
                  </div>
                  <div className="reviews-list">
                    <p className="no-reviews">Reviews coming soon...</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Related Products */}
        <motion.section 
          className="related-products-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>You May Also Like</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                className="related-product-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="related-product-image">
                  <img src={relatedProduct.image} alt={relatedProduct.name} />
                </div>
                <h4>{relatedProduct.name}</h4>
                <div className="related-product-rating">
                  {'⭐'.repeat(Math.floor(relatedProduct.rating))}
                </div>
                <p className="related-product-price">${relatedProduct.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
