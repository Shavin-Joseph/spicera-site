import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes,
  FaWhatsapp,
  FaShoppingBag,
  FaCheck,
  FaLeaf,
  FaMapMarkerAlt,
  FaWind,
  FaPlus,
  FaMinus
} from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ProductQuickView.css';

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart, getSingleProductWhatsAppUrl } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWhatsAppOrder = () => {
    const url = getSingleProductWhatsAppUrl(product, quantity);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="quickview-backdrop" onClick={onClose}>
        <motion.div
          className="quickview-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="quickview-close-btn" onClick={onClose} aria-label="Close modal">
            <FaTimes />
          </button>

          <div
            className="quickview-accent-strip"
            style={{ backgroundColor: product.accentColor || '#D48C00' }}
          />

          <div className="quickview-content">
            {/* Image Column */}
            <div className="quickview-image-col">
              <div className="quickview-image-wrap">
                <img src={product.image} alt={product.name} />
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="quickview-tags">
                  {product.tags.map((t, idx) => (
                    <span key={idx} className="quickview-tag-pill">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="quickview-details-col">
              <span className="quickview-category-badge">
                {product.category || 'Pure Ceylon Spice'}
              </span>

              <h2 className="quickview-title">{product.name}</h2>
              {product.subtitle && <p className="quickview-subtitle">{product.subtitle}</p>}

              <div className="quickview-price-section">
                <span className="quickview-currency">{product.currency || 'Rs.'}</span>
                <span className="quickview-price-val">{product.price}</span>
                <span className="quickview-unit">/ {product.unit || 'pack'}</span>
              </div>

              {/* Badges / Highlights */}
              <div className="quickview-specs-grid">
                {product.origin && (
                  <div className="spec-item">
                    <FaMapMarkerAlt className="spec-icon" />
                    <div>
                      <strong>Origin:</strong>
                      <span>{product.origin}</span>
                    </div>
                  </div>
                )}
                {product.aroma && (
                  <div className="spec-item">
                    <FaWind className="spec-icon" />
                    <div>
                      <strong>Aroma Notes:</strong>
                      <span>{product.aroma}</span>
                    </div>
                  </div>
                )}
                <div className="spec-item">
                  <FaLeaf className="spec-icon" />
                  <div>
                    <strong>Purity:</strong>
                    <span>100% Single Harvest Natural</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="quickview-desc">
                {product.description ||
                  'Grown and harvested in Sri Lanka under optimal tropical conditions, dried naturally, and sealed to preserve peak volatile oils and culinary character.'}
              </p>

              {/* Quantity Selector & Action Buttons */}
              <div className="quickview-actions">
                <div className="quickview-qty-picker">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus style={{ fontSize: '0.75rem' }} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <FaPlus style={{ fontSize: '0.75rem' }} />
                  </button>
                </div>

                <button
                  type="button"
                  className="quickview-add-bag-btn"
                  onClick={handleAdd}
                >
                  {isAdded ? (
                    <>
                      <FaCheck /> Added to Bag
                    </>
                  ) : (
                    <>
                      <FaShoppingBag /> Add to Bag
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="quickview-whatsapp-btn"
                  onClick={handleWhatsAppOrder}
                >
                  <FaWhatsapp /> Order on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductQuickView;
