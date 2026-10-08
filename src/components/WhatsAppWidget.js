import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppWidget.css';

const WhatsAppWidget = () => {
  const whatsappUrl = "https://wa.me/+94778567622?text=Hello%20Spicera!%20I%20have%20an%20inquiry%20about%20your%20spices.";

  return (
    <aside aria-label="WhatsApp quick contact" className="whatsapp-floating-widget">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat with Spicera on WhatsApp"
      >
        <span className="whatsapp-pulse"></span>
        <FaWhatsapp className="whatsapp-icon" />
        <span className="whatsapp-tooltip">Chat with Spicera</span>
      </a>
    </aside>
  );
};

export default WhatsAppWidget;
