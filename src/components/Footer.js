import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa'; // Import the icons
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h2 className="logo-text">
                        <img src="/logo.png" alt="Spicera Logo" className="footer-logo" />
                        Spicera
                    </h2>
                    <p>
                        Bringing the authentic taste of Ceylon's finest spices from our home to yours.
                    </p>
                </div>

                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h2>Contact Info</h2>
                    <div className="contact-item">
                        <FaMapMarkerAlt className="icon" />
                        {/* REPLACE with your actual address */}
                        <span>65/3, Kerawalapitiya Road, Hendala, Wattala, Sri Lanaka.</span>
                    </div>
                    <div className="contact-item">
                        <FaPhoneAlt className="icon" />
                        {/* REPLACE with your actual phone number */}
                        <span>+94 77 856 7622</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} spicera.site | All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;