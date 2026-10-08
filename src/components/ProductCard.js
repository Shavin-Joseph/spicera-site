import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEye, FaShoppingBag, FaCheck } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import ProductQuickView from './ProductQuickView';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, getSingleProductWhatsAppUrl } = useCart();
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Exact WhatsApp link using the preserved format
  const whatsappUrl = getSingleProductWhatsAppUrl(product);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleOpenQuickView = (e) => {
    e.preventDefault();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <Tilt className="Tilt" scale={1.03} transitionSpeed={2000} tiltMaxAngleX={8} tiltMaxAngleY={8}>
        <motion.div className="product-card" whileHover={{ y: -6 }}>
          <div
            className="product-card-accent"
            style={{
              background: product.accentColor && product.accentColor !== '#4A5568'
                ? `linear-gradient(90deg, ${product.accentColor}, #D48C00)`
                : 'linear-gradient(90deg, #D48C00, #E5A93C, #B85B14)'
            }}
          />

          <div className="product-card-top-badges">
            {product.category && (
              <span className="card-category-badge">{product.category}</span>
            )}
            {product.inStock !== false ? (
              <span className="card-stock-badge in-stock">Fresh Harvest</span>
            ) : (
              <span className="card-stock-badge out-stock">Pre Order</span>
            )}
          </div>

          <div className="product-card-image-box" onClick={handleOpenQuickView}>
            <img src={product.image} alt={product.name} loading="lazy" />
            <button
              type="button"
              className="quickview-floating-trigger"
              onClick={handleOpenQuickView}
              title="Quick View Details"
              aria-label="Quick View Details"
            >
              <FaEye />
            </button>
          </div>

          <div className="product-card-content">
            <h3 className="product-card-title" onClick={handleOpenQuickView}>
              {product.name}
            </h3>

            {product.subtitle && (
              <p className="product-card-subtitle">{product.subtitle}</p>
            )}

            <div className="price-display">
              <span className="price-currency">{product.currency || 'Rs.'}</span>
              <span className="price-val">{product.price}</span>
              {product.unit && <span className="price-unit">/{product.unit}</span>}
            </div>

            <div className="product-card-cta-group">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-button"
                aria-label={`Order ${product.name} on WhatsApp`}
              >
                <FaWhatsapp className="btn-icon" />
                <span>Order on WhatsApp</span>
              </a>

              <button
                type="button"
                className={`add-bag-icon-btn ${justAdded ? 'added' : ''}`}
                onClick={handleQuickAdd}
                title="Add to WhatsApp Order Bag"
                aria-label="Add to WhatsApp Order Bag"
              >
                {justAdded ? <FaCheck /> : <FaShoppingBag />}
              </button>
            </div>
          </div>
        </motion.div>
      </Tilt>

      <ProductQuickView
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;