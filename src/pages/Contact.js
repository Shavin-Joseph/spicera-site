import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const yourPhoneNumber = '+94778567622';
  const yourEmail = 'spicerainternational@gmail.com';
  const yourAddress = '65/3, Kerawalapitiya Road, Hendala, Wattala, Sri Lanka';

  const [inquiryName, setInquiryName] = useState('');
  const [inquiryTopic, setInquiryTopic] = useState('Product Order Inquiry');
  const [inquiryMsg, setInquiryMsg] = useState('');

  const handleCustomWhatsApp = (e) => {
    e.preventDefault();
    let text = `Hello Spicera! 🌿\n\n`;
    if (inquiryName) text += `*Name:* ${inquiryName}\n`;
    text += `*Topic:* ${inquiryTopic}\n`;
    if (inquiryMsg) text += `*Message:* ${inquiryMsg}\n`;
    text += `\nPlease let me know how to proceed. Thank you!`;

    const url = `https://wa.me/${yourPhoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const defaultWhatsappMessage = `Hello Spicera! I'd like to ask a question regarding your Ceylon spices.`;
  const defaultWhatsappUrl = `https://wa.me/${yourPhoneNumber}?text=${encodeURIComponent(defaultWhatsappMessage)}`;

  return (
    <div className="contact-page-container">
      <motion.div
        className="contact-intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="contact-eyebrow">Connect With Us</span>
        <h1 className="contact-page-title">We’d Love to Hear From You</h1>
        <p>
          Whether you need advice on spice pairings, bulk estate orders, custom gift boxes, or have delivery questions, our dedicated team is at your service.
        </p>
      </motion.div>

      {/* Contact Cards Grid */}
      <motion.div
        className="contact-cards-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* WhatsApp Card */}
        <a
          href={defaultWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card whatsapp-feature"
        >
          <div className="contact-card-icon-wrap whatsapp">
            <FaWhatsapp className="card-icon whatsapp" />
          </div>
          <h2>Instant WhatsApp Chat</h2>
          <p>The fastest way to place orders, confirm stock, and receive prompt delivery assistance.</p>
          <span className="contact-link">Chat +94 77 856 7622</span>
        </a>

        {/* Email Card */}
        <a href={`mailto:${yourEmail}`} className="contact-card">
          <div className="contact-card-icon-wrap email">
            <FaEnvelope className="card-icon email" />
          </div>
          <h2>Direct Email</h2>
          <p>For wholesale inquiries, restaurant supply, and international distribution.</p>
          <span className="contact-link">{yourEmail}</span>
        </a>

        {/* Location Card */}
        <div className="contact-card">
          <div className="contact-card-icon-wrap location">
            <FaMapMarkerAlt className="card-icon location" />
          </div>
          <h2>Store Location</h2>
          <p>Visit our showroom to inspect the freshness and aroma of our single origin harvests.</p>
          <span className="contact-address">{yourAddress}</span>
        </div>
      </motion.div>

      {/* Interactive Quick WhatsApp Form */}
      <div className="quick-inquiry-box">
        <div className="inquiry-form-header">
          <FaWhatsapp className="inquiry-wa-icon" />
          <div>
            <h3>Send Direct WhatsApp Message</h3>
            <p>Type your message below and launch WhatsApp with your inquiry pre-filled!</p>
          </div>
        </div>

        <form onSubmit={handleCustomWhatsApp} className="inquiry-form-grid">
          <div className="inquiry-field">
            <label htmlFor="inq-name">Your Name</label>
            <input
              id="inq-name"
              type="text"
              placeholder="e.g. Ruwan Silva"
              value={inquiryName}
              onChange={(e) => setInquiryName(e.target.value)}
            />
          </div>

          <div className="inquiry-field">
            <label htmlFor="inq-topic">Inquiry Type</label>
            <select
              id="inq-topic"
              value={inquiryTopic}
              onChange={(e) => setInquiryTopic(e.target.value)}
            >
              <option value="Product Order Inquiry">Product Order Inquiry</option>
              <option value="Bulk & Wholesale Supply">Bulk & Wholesale Supply</option>
              <option value="Custom Gift Hampers">Custom Gift Hampers</option>
              <option value="Delivery Status Check">Delivery Status Check</option>
              <option value="General Question">General Question</option>
            </select>
          </div>

          <div className="inquiry-field full-width">
            <label htmlFor="inq-msg">Message / Spice Requirements</label>
            <textarea
              id="inq-msg"
              rows="3"
              placeholder="Tell us what you'd like to order or ask..."
              value={inquiryMsg}
              onChange={(e) => setInquiryMsg(e.target.value)}
            />
          </div>

          <button type="submit" className="inquiry-submit-btn">
            <FaPaperPlane /> Open in WhatsApp
          </button>
        </form>

        <div className="operating-hours-note">
          <FaClock className="clock-icon" />
          <span>Support Hours: Monday to Saturday from 8:30 AM to 7:30 PM IST</span>
        </div>
      </div>
    </div>
  );
};

export default Contact;