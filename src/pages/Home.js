import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard'; // The ProductCard component is now used
import './Home.css';
import { Link } from 'react-router-dom'; 

// Data for the main hero slider
const spiceData = [
    { name: "Negin Saffron", tagline: "The Gilded Essence of Persia", image: "/saffron-hero.png", themeColor: "#D48C00" },
    { name: "Ceylon Cinnamon", tagline: "The Warmth of a Tropical Dawn", image: "/cinnamon-hero.png", themeColor: "#B85B14" },
    { name: "Black Pepper", tagline: "The Bold Heartbeat of Spice", image: "/pepper-hero.png", themeColor: "#4A5568" }
];


// Data for the featured products grid below the hero
const featuredProducts = [
  { 
    name: 'The gold of spice Premium Quality Negin Saffron', 
    image: '/saffron-hero.png', 
    accentColor: '#D48C00',
  price: "2,450.00/1g",
    currency: 'Rs.'
  },
  { 
    name: 'Premium Quality Ceylon Black Pepper Powder', 
    image: '/pepper-hero.png', 
    accentColor: '#4A5568',
  price: "195.00/50g",
    currency: 'Rs.'
  },
  { 
    name: 'Premium Quality Ceylon Cinnamon Powder', 
    image: '/cinnamon-hero.png', 
    accentColor: '#B85B14',
  price: "385.00/50g",
    currency: 'Rs.'
  },
];

// Animation variants for the hero section text and image
const textContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
};
const textLineVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};
const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -5 },
    visible: { scale: 1, opacity: 1, rotate: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

// Animation variants for the "Featured Products" section
const productSectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};
const productCardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const Home = () => {
    const [currentSpiceIndex, setCurrentSpiceIndex] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSpiceIndex(prevIndex => (prevIndex + 1) % spiceData.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="home-container">
            {/* --- HERO SECTION --- */}
            <div className="hero-section">
                <div className="animated-gradient-bg"></div>
                <div className="hero-content">
                    {spiceData.map((spice, index) => (
                        <motion.div
                            key={index}
                            className="spice-layer"
                            initial="hidden"
                            animate={index === currentSpiceIndex ? "visible" : "hidden"}
                            style={{ pointerEvents: index === currentSpiceIndex ? 'auto' : 'none' }}
                            variants={{
                                visible: { opacity: 1, transition: { duration: 1 } },
                                hidden: { opacity: 0, transition: { duration: 1 } }
                            }}
                        >
                            <motion.div className="hero-text" variants={textContainerVariants}>
                                <div className="text-reveal-wrapper">
                                    <motion.h1 style={{ color: spice.themeColor }} variants={textLineVariants}>
                                        {spice.name}
                                    </motion.h1>
                                </div>
                                <div className="text-reveal-wrapper">
                                    <motion.p variants={textLineVariants}>{spice.tagline}</motion.p>
                                </div>
                                <motion.div variants={textLineVariants}>
                                    <Link to="/products">
                                    <motion.button 
                                        whileHover={{ scale: 1.05, y: -3 }} 
                                        whileTap={{ scale: 0.95 }} 
                                        className="cta-button"
                                        style={{ 
                                            backgroundColor: spice.themeColor,
                                            boxShadow: `0 10px 25px -5px ${spice.themeColor}55`
                                        }}
                                    >
                                        View Prices
                                    </motion.button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                            <motion.div className="hero-image-container" variants={imageVariants}>
                                <motion.img 
                                    src={spice.image} 
                                    alt={spice.name}
                                    animate={{ y: [0, -12, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* --- FEATURED PRODUCTS SECTION --- */}
            <motion.div 
                className="featured-products"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={productSectionVariants}
            >
                <h2 className="section-title">Discover Our Premium Selection</h2>
                <motion.div className="products-grid">
                    {featuredProducts.map((product, index) => (
                        <motion.div key={index} variants={productCardVariants}>
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;