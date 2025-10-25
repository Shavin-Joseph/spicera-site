import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaMapMarkerAlt, FaStore } from 'react-icons/fa'; // Import icons
import './About.css'; // We will create this file next

const About = () => {
    return (
        <div className="about-page-container">
            <motion.div 
                className="about-intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="about-page-title">Our Story</h1>
                <p>
                    Spicera was born from a passion for authentic flavors and a deep respect for the rich agricultural heritage of Ceylon. We believe that a simple meal can be transformed into a memorable experience with the right ingredients. Our mission is to source the highest quality, single rigin spices and deliver them directly to you, preserving the freshness and potency that nature intended.
                </p>
            </motion.div>

            <div className="details-section">
                {/* --- Owner Details Card --- */}
                <motion.div 
                    className="details-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <FaUser className="card-icon" />
                    <h2>The Owner</h2>
                    {/* REPLACE with your actual owner details */}
                    <p><strong>Name:</strong> Namal Caldera</p>
                    <p>A lifelong spice enthusiast dedicated to quality and authenticity.</p>
                </motion.div>

                {/* --- Location Details Card --- */}
                <motion.div 
                    className="details-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <FaStore className="card-icon" />
                    <h2>Our Physical Location</h2>
                    {/* REPLACE with your actual address */}
                    <p><strong>Address:</strong> 65/3, Kerawalapitiya Road, Hendala, Wattala, Sri Lanaka.</p>
                    <p>Visit us to experience the aroma and quality of our products firsthand.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default About;