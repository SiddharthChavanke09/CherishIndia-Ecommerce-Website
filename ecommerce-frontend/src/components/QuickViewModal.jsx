import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/App.css';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  if (!isOpen || !product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    // Show success feedback
    const button = document.querySelector('.quick-view-add-to-cart');
    if (button) {
      button.classList.add('success');
      setTimeout(() => button.classList.remove('success'), 2000);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'filled' : 'empty'}>
          {i <= rating ? '⭐' : '☆'}
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="modal-overlay quick-view-overlay" onClick={onClose}>
      <div className="modal-content quick-view-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="quick-view-container">
          <div className="quick-view-images">
            <div className="main-image">
              <img src={product.images?.[selectedImage] || product.image} alt={product.name} />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="quick-view-details">
            <h2>{product.name}</h2>
            
            <div className="quick-view-meta">
              <div className="rating">
                {getRatingStars(product.rating)}
                <span>({product.reviews} reviews)</span>
              </div>
              <div className={`stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>

            <div className="price">${product.price}</div>

            <div className="quick-view-description">
              <p>{product.description}</p>
            </div>

            {product.features && (
              <div className="quick-view-features">
                <h4>Key Features:</h4>
                <ul>
                  {product.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="quick-view-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  onClick={handleAddToCart}
                  className="quick-view-add-to-cart"
                  disabled={!product.inStock}
                >
                  Add to Cart ({quantity})
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                >
                  {isWishlisted ? '❤️' : '🤍'}
                </button>
              </div>
            </div>

            <div className="quick-view-footer">
              <div className="shipping-info">
                <span>🚚 Free shipping on orders over $50</span>
              </div>
              <div className="return-info">
                <span>↩️ 30-day return policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;