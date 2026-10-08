import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const SPICERA_WHATSAPP_NUMBER = '+94778567622';
const CART_STORAGE_KEY = 'spicera_order_bag';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  }, [cartItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit || '50g',
            currency: product.currency || 'Rs.',
            image: product.image,
            accentColor: product.accentColor || '#D48C00',
            quantity
          }
        ];
      }
    });

    showToast(`Added "${product.name.slice(0, 28)}..." to order bag`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    showToast('Item removed from order bag');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Helper to parse price string like "2,450.00" or "195.00/50g" into a number
  const parseNumericPrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    const cleaned = priceStr.split('/')[0].replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  const getTotalCount = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  const getTotalEstimatedAmount = () => {
    return cartItems.reduce((acc, item) => {
      const num = parseNumericPrice(item.price);
      return acc + num * item.quantity;
    }, 0);
  };

  /**
   * Generates WhatsApp order inquiry URL for direct messaging
   */
  const getWhatsAppCartUrl = (customerNote = '') => {
    if (cartItems.length === 0) {
      return `https://wa.me/${SPICERA_WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hello Spicera! I would like to inquire about your spices.'
      )}`;
    }

    const totalStr = getTotalEstimatedAmount().toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    let message = `🌿 *SPICERA ORDER INQUIRY* 🌿\n\n`;
    message += `Hello! I would like to place an order for the following pure spices:\n\n`;

    cartItems.forEach((item, idx) => {
      const priceNum = parseNumericPrice(item.price);
      const subtotal = (priceNum * item.quantity).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      message += `${idx + 1}. *${item.name}*\n   • Quantity: ${item.quantity} (Pack: ${item.unit || 'Standard'})\n   • Est. Price: ${item.currency} ${subtotal}\n\n`;
    });

    message += `• • • • • • • • • • • • • • • •\n`;
    message += `*Total Estimated:* Rs. ${totalStr}\n`;
    if (customerNote) {
      message += `*Note / Delivery Area:* ${customerNote}\n`;
    } else {
      message += `*Note:* Please let me know product availability, bank details, and delivery arrangement.\n`;
    }
    message += `• • • • • • • • • • • • • • • •\n`;
    message += `Sent from spicera.store`;

    return `https://wa.me/${SPICERA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  /**
   * Single product direct WhatsApp URL (the classic Spicera order flow preserved exactly)
   */
  const getSingleProductWhatsAppUrl = (product, quantity = 1) => {
    const qtyText = quantity > 1 ? ` (Quantity: ${quantity})` : '';
    const message = `Hello Spicera! I'm interested in ordering ${product.name}${qtyText} for ${product.currency || 'Rs.'} ${product.price}. Please provide delivery options and payment details.`;
    return `https://wa.me/${SPICERA_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalCount,
    getTotalEstimatedAmount,
    getWhatsAppCartUrl,
    getSingleProductWhatsAppUrl,
    isDrawerOpen,
    setIsDrawerOpen,
    toastMessage,
    showToast,
    whatsappNumber: SPICERA_WHATSAPP_NUMBER
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
