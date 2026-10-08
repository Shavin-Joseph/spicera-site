import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h2 className="logo-text">
            <img src="/logo.png" alt="Spicera Logo" className="footer-logo" />
            <span>Spicera</span>
          </h2>
          <p>
            Bringing the authentic taste and uncompromised aroma of Ceylon finest single harvest spices from our family gardens directly to yours.
          </p>
          <div className="footer-whatsapp-badge">
            <FaWhatsapp className="footer-wa-icon" />
            <span>Direct WhatsApp Orders: <strong>+94 77 856 7622</strong></span>
          </div>
        </div>

        <div className="footer-section links">
          <h2>Quick Links</h2>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">All Spices</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h2>Contact Info</h2>
          <div className="contact-item">
            <FaMapMarkerAlt className="icon" />
            <span>65/3, Kerawalapitiya Road, Hendala, Wattala, Sri Lanka.</span>
          </div>
          <div className="contact-item">
            <FaPhoneAlt className="icon" />
            <span>+94 77 856 7622</span>
          </div>
          <div className="contact-item">
            <FaWhatsapp className="icon" />
            <a
              href="https://wa.me/+94778567622"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-wa-link"
            >
              Order and Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>&copy; {new Date().getFullYear()} Spicera.store | Pure Ceylon Spices | All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;