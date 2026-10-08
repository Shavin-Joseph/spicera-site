import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaStore, FaSeedling, FaHistory, FaCheckCircle, FaAward } from 'react-icons/fa';
import './About.css';

const About = () => {
  return (
    <div className="about-page-container">
      <motion.div
        className="about-intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="about-eyebrow">Our Heritage and Craft</span>
        <h1 className="about-page-title">The Story of Spicera</h1>
        <p>
          Spicera was born from an unyielding passion for authentic island flavors and deep respect for the legendary agricultural heritage of Ceylon.
          We believe every meal is elevated when prepared with pure, unadulterated spices.
          Our mission is to source the highest quality, single origin spices directly from generational Sri Lankan cultivators, preserving the volatile oils, aroma, and therapeutic potency that nature intended.
        </p>
      </motion.div>

      {/* Value Pillars */}
      <div className="about-values-grid">
        <motion.div
          className="about-value-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FaSeedling className="value-icon" />
          <h3>Ethically Sourced</h3>
          <p>Partnering with independent spice growers in Matale, Kandy, and Galle to sustain fair trade and biodiverse organic cultivation.</p>
        </motion.div>

        <motion.div
          className="about-value-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FaAward className="value-icon" />
          <h3>Export Grade Purity</h3>
          <p>Every harvest is thoroughly batch inspected for color, density, and fragrance without preservatives, radiation, or artificial polishing.</p>
        </motion.div>

        <motion.div
          className="about-value-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FaHistory className="value-icon" />
          <h3>Centuries of Tradition</h3>
          <p>Honoring the ancient maritime spice routes that made Ceylon spices the envy of global gourmet trade for thousands of years.</p>
        </motion.div>
      </div>

      <div className="details-section">
        {/* --- Owner Details Card --- */}
        <motion.div
          className="details-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-icon-wrap">
            <FaUser className="card-icon" />
          </div>
          <h2>The Founder</h2>
          <p className="owner-title"><strong>Namal Caldera</strong>, Founder and Spice Connoisseur</p>
          <p>
            A lifelong advocate for Sri Lankan culinary authenticity, Namal personally curates estate partnerships to guarantee uncompromised purity for every Spicera patron.
          </p>
          <div className="founder-badge">
            <FaCheckCircle /> 100% Quality Guaranteed
          </div>
        </motion.div>

        {/* --- Location Details Card --- */}
        <motion.div
          className="details-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="card-icon-wrap">
            <FaStore className="card-icon" />
          </div>
          <h2>Our Physical Headquarters</h2>
          <p>
            <strong>Address:</strong> 65/3, Kerawalapitiya Road, Hendala, Wattala, Sri Lanka.
          </p>
          <p>
            Visit us to experience the aroma, texture, and uncompromising grading of our spices firsthand, or order conveniently online via WhatsApp.
          </p>
          <div className="founder-badge">
            <FaCheckCircle /> Islandwide Delivery Available
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;