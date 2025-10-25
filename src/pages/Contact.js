import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'; // Import the icons we need
import './Contact.css'; // We will create this file next

const Contact = () => {
    // --- REPLACE YOUR DETAILS HERE ---
    const yourPhoneNumber = '+94778567622';
    const yourEmail = 'spicerainternational@gmail.com';
    const yourAddress = '65/3, Kerawalapitiya Road, Hendala, Wattala, Sri Lanaka';
    // ---------------------------------

    const whatsappMessage = `Hello Spicera! I'd like to ask a question.`;
    const whatsappUrl = `https://wa.me/${yourPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="contact-page-container">
            <motion.div 
                className="contact-intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="contact-page-title">Get In Touch</h1>
                <p>
                    We're here to help with any questions, special orders, or feedback you may have. Choose your preferred way to connect with us below.
                </p>
            </motion.div>

            <motion.div 
                className="contact-cards-grid"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {/* --- WhatsApp Card --- */}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="contact-card">
                    <FaWhatsapp className="card-icon whatsapp" />
                    <h2>Chat on WhatsApp</h2>
                    <p>For the quickest response and for placing orders, chat with us directly.</p>
                    <span className="contact-link">Start Chat</span>
                </a>

                {/* --- Email Card --- */}
                <a href={`mailto:${yourEmail}`} className="contact-card">
                    <FaEnvelope className="card-icon email" />
                    <h2>Send Us an Email</h2>
                    <p>For partnership inquiries or detailed questions, feel free to send an email.</p>
                    <span className="contact-link">{yourEmail}</span>
                </a>

                {/* --- Location Card --- */}
                <div className="contact-card">
                    <FaMapMarkerAlt className="card-icon location" />
                    <h2>Visit Our Store</h2>
                    <p>Experience the aroma and quality of our spices firsthand at our physical location.</p>
                    <span className="contact-link">{yourAddress}</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;