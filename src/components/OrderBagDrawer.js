import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaWhatsapp, FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './OrderBagDrawer.css';

const OrderBagDrawer = () => {
  const {
    cartItems,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalCount,
    getTotalEstimatedAmount,
    getWhatsAppCartUrl
  } = useCart();

  const [customerNote, setCustomerNote] = useState('');

  if (!isDrawerOpen) return null;

  const totalStr = getTotalEstimatedAmount().toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleWhatsAppSend = () => {
    const url = getWhatsAppCartUrl(customerNote);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      <div className="order-drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
        <motion.div
          className="order-drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="order-drawer-header">
            <div className="drawer-title-group">
              <FaShoppingBag className="drawer-title-icon" />
              <h3>Your Spice Order Bag ({getTotalCount()})</h3>
            </div>
            <button
              className="drawer-close-btn"
              onClick={() => setIsDrawerOpen(false)}
              aria-label="Close Order Bag"
            >
              <FaTimes />
            </button>
          </div>

          {/* Body */}
          <div className="order-drawer-body">
            {cartItems.length === 0 ? (
              <div className="empty-bag-state">
                <div className="empty-bag-icon-wrapper">
                  <FaShoppingBag />
                </div>
                <h4>Your Spice Bag is Empty</h4>
                <p>Browse our premium Ceylon spices and add your favorites to build your WhatsApp order inquiry.</p>
                <button
                  className="browse-spices-btn"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="drawer-items-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="drawer-item-card">
                    <div
                      className="item-accent-bar"
                      style={{ backgroundColor: item.accentColor || '#D48C00' }}
                    />
                    <img src={item.image} alt={item.name} className="drawer-item-img" />
                    <div className="drawer-item-details">
                      <h4 className="drawer-item-name">{item.name}</h4>
                      <div className="drawer-item-meta">
                        <span className="drawer-item-unit">{item.unit || 'Standard Pack'}</span>
                        <span className="drawer-item-price">
                          {item.currency} {item.price}
                        </span>
                      </div>

                      <div className="drawer-item-actions">
                        <div className="qty-control">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <FaMinus />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="order-drawer-footer">
              <div className="customer-note-group">
                <label htmlFor="customer-note">Delivery Location / Special Instructions:</label>
                <input
                  id="customer-note"
                  type="text"
                  placeholder="e.g. Colombo 03, deliver by Thursday"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                />
              </div>

              <div className="drawer-total-row">
                <span>Estimated Total:</span>
                <span className="drawer-total-amount">Rs. {totalStr}</span>
              </div>

              <p className="whatsapp-process-note">
                Orders are processed directly via WhatsApp with our team for quick confirmation and dispatch.
              </p>

              <button
                type="button"
                className="whatsapp-checkout-btn"
                onClick={handleWhatsAppSend}
              >
                <FaWhatsapp className="whatsapp-checkout-icon" />
                <span>Confirm Order via WhatsApp</span>
              </button>

              <button
                type="button"
                className="clear-bag-btn"
                onClick={clearCart}
              >
                Clear Bag
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderBagDrawer;
