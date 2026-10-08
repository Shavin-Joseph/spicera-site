import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaCheck,
  FaStar,
  FaWhatsapp,
  FaShieldAlt,
  FaSeedling,
  FaAward,
  FaShippingFast
} from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { subscribeProducts } from '../firebase/productsService';
import { DEFAULT_PRODUCTS } from '../data/defaultProducts';
import './Home.css';

// Data for the main hero slider (default 3 signature spices)
const defaultHeroSpices = [
  {
    name: "Negin Saffron",
    tagline: "The Gilded Essence of Persia",
    image: "/saffron-hero.png",
    themeColor: "#D48C00"
  },
  {
    name: "Ceylon Cinnamon",
    tagline: "The Warmth of a Tropical Dawn",
    image: "/cinnamon-hero.png",
    themeColor: "#B85B14"
  },
  {
    name: "Black Pepper",
    tagline: "The Bold Heartbeat of Spice",
    image: "/pepper-hero.png",
    themeColor: "#4A5568"
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "The aroma of Spicera Ceylon Cinnamon is incomparable to store brands. You can tell it is genuine Alba grade quills freshly milled.",
    author: "Chef K. Wickramasinghe",
    location: "Colombo, Sri Lanka",
    rating: 5
  },
  {
    quote: "Ordered Negin Saffron for our signature biryani. The color bloom and pure scent are world class. Ordering via WhatsApp was instant and easy.",
    author: "Nadeeka Perera",
    location: "Kandy, Sri Lanka",
    rating: 5
  },
  {
    quote: "Authentic high piperine black pepper that actually packs natural heat and citrus brightness. Packaging is pristine.",
    author: "Dr. Anura Fernando",
    location: "Mount Lavinia, Sri Lanka",
    rating: 5
  }
];

// Animation variants
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

const productSectionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const productCardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }
};

const Home = () => {
  const [currentSpiceIndex, setCurrentSpiceIndex] = useState(0);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);

  // Real-time synchronization with Firestore
  useEffect(() => {
    const unsubscribe = subscribeProducts(
      (data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      },
      (error) => {
        console.warn('Home subscription note:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Hero timer rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSpiceIndex((prevIndex) => (prevIndex + 1) % defaultHeroSpices.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Select featured products
  const featuredList = products.filter((p) => p.featured);
  const displayProducts = featuredList.length > 0 ? featuredList.slice(0, 4) : products.slice(0, 4);

  return (
    <div className="home-container">
      {/* --- HERO SECTION --- */}
      <section className="hero-section">
        <div className="animated-gradient-bg"></div>
        <div className="hero-content">
          {defaultHeroSpices.map((spice, index) => (
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
                  <span className="hero-kicker" style={{ color: spice.themeColor }}>
                    100% Pure Ceylon Single Harvest
                  </span>
                  <motion.h1 style={{ color: spice.themeColor }} variants={textLineVariants}>
                    {spice.name}
                  </motion.h1>
                </div>
                <div className="text-reveal-wrapper">
                  <motion.p variants={textLineVariants}>{spice.tagline}</motion.p>
                </div>
                <motion.div variants={textLineVariants} className="hero-actions-row">
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
                      View Prices and Order
                    </motion.button>
                  </Link>

                  <a
                    href="https://wa.me/+94778567622?text=Hello%20Spicera!%20I%20would%20like%20to%20inquire%20about%20your%20spices."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-secondary-btn"
                  >
                    <FaWhatsapp /> Quick WhatsApp Chat
                  </a>
                </motion.div>
              </motion.div>

              <motion.div className="hero-image-container" variants={imageVariants}>
                <motion.img
                  src={spice.image}
                  alt={spice.name}
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Hero Slider Dots */}
        <div className="hero-slider-dots">
          {defaultHeroSpices.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              className={`slider-dot ${dotIdx === currentSpiceIndex ? 'active' : ''}`}
              onClick={() => setCurrentSpiceIndex(dotIdx)}
              aria-label={`Go to spice ${dotIdx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* --- HERITAGE PILLARS SECTION --- */}
      <section className="heritage-pillars-section">
        <div className="pillars-container">
          <div className="pillar-item">
            <div className="pillar-icon-box">
              <FaSeedling />
            </div>
            <h4>Single Origin Harvest</h4>
            <p>Direct from lush generational family gardens across central and southern Sri Lanka.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon-box">
              <FaShieldAlt />
            </div>
            <h4>Zero Additives or Fillers</h4>
            <p>No artificial dyes, starch fillers, or sulfur treatments. Pure authentic natural spice.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon-box">
              <FaAward />
            </div>
            <h4>Gourmet Potency</h4>
            <p>Naturally high volatile oil content and uncompromised aroma profiles.</p>
          </div>

          <div className="pillar-item">
            <div className="pillar-icon-box">
              <FaShippingFast />
            </div>
            <h4>Swift Islandwide Delivery</h4>
            <p>Direct door to door courier service across Sri Lanka with real time WhatsApp updates.</p>
          </div>
        </div>
      </section>

      {/* --- FEATURED PRODUCTS SECTION --- */}
      <motion.section
        className="featured-products"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={productSectionVariants}
      >
        <div className="section-header-wrap">
          <span className="section-eyebrow">Artisanal Selection</span>
          <h2 className="section-title">Discover Our Premium Selection</h2>
          <p className="section-subtitle">
            Carefully curated and stone milled to honor the ancient island traditions of authentic Ceylon spice.
          </p>
        </div>

        <motion.div className="products-grid">
          {displayProducts.map((product) => (
            <motion.div key={product.id} variants={productCardVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <div className="view-all-products-banner">
          <Link to="/products" className="view-all-btn">
            Browse All {products.length} Spices
          </Link>
        </div>
      </motion.section>

      {/* --- ARTISANAL PROCESS / FROM SOIL TO SAVOR --- */}
      <section className="process-story-section">
        <div className="process-content-wrapper">
          <div className="process-text-col">
            <span className="section-eyebrow">The Spicera Promise</span>
            <h3>From Ceylon Soil to Gourmet Kitchen</h3>
            <p>
              Sri Lanka tropical sunshine, mineral rich soils, and mountain mists yield spices with unmatched volatile oil density.
              At Spicera, we preserve this delicate botanical character at every step.
            </p>
            <ul className="process-checklist">
              <li>
                <FaCheck className="check-icon" />
                <span><strong>Selective Harvesting:</strong> Only mature berries, rhizomes, and bark quills are picked.</span>
              </li>
              <li>
                <FaCheck className="check-icon" />
                <span><strong>Gentle Dehydration:</strong> Sun cured on raised tables to preserve aromatic terpenes.</span>
              </li>
              <li>
                <FaCheck className="check-icon" />
                <span><strong>Low Temperature Stone Milling:</strong> Friction heat is minimized to avoid burning delicate natural oils.</span>
              </li>
              <li>
                <FaCheck className="check-icon" />
                <span><strong>Hermetic Sealing:</strong> Packed immediately to lock in intense aroma until opened in your kitchen.</span>
              </li>
            </ul>
          </div>

          <div className="process-card-col">
            <div className="process-highlight-card">
              <div className="highlight-card-header">
                <span className="ceylon-seal">100% CEYLON AUTHENTIC</span>
                <h4>True Ceylon Quality</h4>
              </div>
              <p>
                Unlike generic cassia cinnamon or adulterated pepper, Spicera supplies pure unblended single varietal spices directly traceable to certified estates.
              </p>
              <div className="highlight-quote">
                "Experience the fragrance that captivated ancient maritime navigators for centuries."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section className="testimonials-section">
        <div className="section-header-wrap">
          <span className="section-eyebrow">Customer Experiences</span>
          <h2 className="section-title">Trusted by Spice Lovers and Chefs</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(t.rating)].map((_, sIdx) => (
                  <FaStar key={sIdx} />
                ))}
              </div>
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author">
                <strong>{t.author}</strong>
                <span>{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- WHATSAPP INQUIRY CALLOUT BANNER --- */}
      <section className="whatsapp-callout-section">
        <div className="whatsapp-callout-box">
          <div className="callout-text">
            <h3>Need Bulk Orders or Custom Spice Gift Boxes?</h3>
            <p>
              We cater to restaurants, hotels, corporate gifting, and special events. Chat directly with our team on WhatsApp for personalized pricing and customized packaging.
            </p>
          </div>
          <a
            href="https://wa.me/+94778567622?text=Hello%20Spicera!%20I%20am%20interested%20in%20a%20bulk%20or%20custom%20spice%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="callout-whatsapp-btn"
          >
            <FaWhatsapp /> Chat for Custom Orders
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;