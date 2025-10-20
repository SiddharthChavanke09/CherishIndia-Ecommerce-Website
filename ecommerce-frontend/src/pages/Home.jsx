import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/ProductCard';

import '../styles/App.css';


const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const { addToCart } = useCart();
  const { isDarkMode } = useTheme();

  // Mock products data
 const products = [
  { 
    id: 1, 
    name: 'Wireless Bluetooth Headphones', 
    price: 99.99, 
    originalPrice: 129.99, 
    category: 'electronics', 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&fit=crop&auto=format',
    rating: 4.5, 
    reviews: 128, 
    badge: 'hot' 
  },
  { 
    id: 2, 
    name: 'Smart Fitness Watch', 
    price: 199.99, 
    originalPrice: 249.99, 
    category: 'electronics', 
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&fit=crop&auto=format',
    rating: 4.3, 
    reviews: 89, 
    badge: 'new' 
  },
  { 
    id: 3, 
    name: 'Premium Yoga Mat', 
    price: 49.99, 
    category: 'sports', 
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80&fit=crop&auto=format',
    rating: 4.7, 
    reviews: 234, 
    badge: null 
  },
  { 
    id: 4, 
    name: 'Running Shoes', 
    price: 129.99, 
    category: 'footwear', 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&fit=crop&auto=format',
    rating: 4.7, 
    reviews: 342, 
    badge: 'hot' 
  },
  { 
    id: 5, 
    name: 'Laptop Backpack', 
    price: 59.99, 
    category: 'accessories', 
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&fit=crop&auto=format',
    rating: 4.4, 
    reviews: 167, 
    badge: null 
  },
  { 
    id: 6, 
    name: 'Coffee Maker', 
    price: 89.99, 
    category: 'home', 
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80&fit=crop&auto=format',
    rating: 4.6, 
    reviews: 198, 
    badge: 'new' 
  },
  { 
    id: 7, 
    name: 'Wireless Earbuds', 
    price: 79.99, 
    category: 'electronics', 
    image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=800&q=80&fit=crop&auto=format',
    rating: 4.3, 
    reviews: 189, 
    badge: 'hot' 
  },
  { 
    id: 8, 
    name: 'Designer Sunglasses', 
    price: 89.99, 
    category: 'accessories', 
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80&fit=crop&auto=format',
    rating: 4.5, 
    reviews: 156, 
    badge: null 
  }
];
  const categories = [
    { id: 'all', name: 'All Products', icon: '🛍️', count: products.length },
    { id: 'electronics', name: 'Electronics', icon: '📱', count: products.filter(p => p.category === 'electronics').length },
    { id: 'sports', name: 'Sports', icon: '⚽', count: products.filter(p => p.category === 'sports').length },
    { id: 'footwear', name: 'Footwear', icon: '👟', count: products.filter(p => p.category === 'footwear').length },
    { id: 'accessories', name: 'Accessories', icon: '🎒', count: products.filter(p => p.category === 'accessories').length },
    { id: 'home', name: 'Home', icon: '🏠', count: products.filter(p => p.category === 'home').length }
  ];

  const features = [
    { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50', color: '#667eea' },
    { icon: '🔒', title: 'Secure Payment', desc: '100% secure transactions', color: '#f5576c' },
    { icon: '💳', title: 'Easy Returns', desc: '30-day return policy', color: '#4facfe' },
    { icon: '🎁', title: 'Gift Cards', desc: 'Perfect for any occasion', color: '#fbbf24' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className={`home-page ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Compact Hero Section - No Image */}
      <section className="compact-hero">
        <motion.div 
          className="hero-background-gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </motion.div>

        <div className="container">
          <motion.div 
            className="hero-content-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="hero-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              🎉 Welcome to ShopHub
            </motion.div>

            <h1 className="hero-title">
              Discover Amazing <span className="gradient-text">Products</span>
            </h1>

            <p className="hero-description">
              Shop the latest trends in electronics, fashion, and home essentials.
              Enjoy free shipping on orders over $50!
            </p>

            <div className="hero-cta-group">
              <motion.a
                href="#products"
                className="cta-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="btn-icon">🛍️</span>
                <span>Shop Now</span>
              </motion.a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <strong>10k+</strong>
                <span>Products</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>50k+</strong>
                <span>Happy Customers</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <strong>4.8★</strong>
                <span>Average Rating</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <motion.div 
                  className="feature-icon"
                  animate={{ 
                    scale: hoveredFeature === index ? 1.2 : 1,
                    rotate: hoveredFeature === index ? 360 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" id="categories">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our curated collections</p>
          </motion.div>

          <div className="categories-scroll">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="chip-icon">{category.icon}</span>
                <span className="chip-text">
                  <strong>{category.name}</strong>
                  <small>{category.count} items</small>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section" id="products">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'Featured Products' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="section-subtitle">
              Showing {filteredProducts.length} amazing products
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {filteredProducts.length > 0 ? (
              <motion.div
                className="products-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key={selectedCategory}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="no-products"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="no-products-icon">📦</div>
                <h3>No products found</h3>
                <p>Try selecting a different category</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <motion.div 
            className="newsletter-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="newsletter-content">
              <div className="newsletter-icon">📧</div>
              <h2>Get Exclusive Deals</h2>
              <p>Subscribe to our newsletter and get 20% off your first order!</p>
              <form className="newsletter-form">
                <input 
                  type="email" 
                  className="newsletter-input" 
                  placeholder="Enter your email address" 
                />
                <motion.button 
                  type="submit" 
                  className="newsletter-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </form>
              <p className="newsletter-privacy">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
