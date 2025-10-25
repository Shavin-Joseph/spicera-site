import React from 'react';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    // Generate the WhatsApp URL with the simplified product info
    const message = `I'm interested in ordering ${product.name} for ${product.currency} ${product.price}.`;
    const whatsappUrl = `https://wa.me/+94778567622?text=${encodeURIComponent(message)}`;

    return (
        <Tilt className="Tilt" scale={1.05} transitionSpeed={2000}>
            <motion.div className="product-card">
                <div className="product-card-accent" style={{ backgroundColor: product.accentColor }}></div>
                <div className="product-card-content">
                    <img src={product.image} alt={product.name} />
                    <h3>{product.name}</h3>
                    
                    {/* --- NEW SIMPLIFIED PRICE DISPLAY --- */}
                    <div className="price-display">
                        <h2>{product.currency} {product.price}</h2>
                    </div>
                    
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
                      Order on WhatsApp
                    </a>
                </div>
            </motion.div>
        </Tilt>
    );
};

export default ProductCard;