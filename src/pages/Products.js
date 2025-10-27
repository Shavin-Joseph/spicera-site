import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard'; // Make sure this is imported
import './Products.css'; // We will create the styles for this page

// This is your data array, placed inside the component file
const products = [
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
  { 
    name: 'Premium Quality Ceylon Moringa Leaf Powder', 
    image: '/moringa.png',
    accentColor: '#556B2F',
  price: "215.00/50g",
    currency: 'Rs.'
  },
  { 
    name: 'Premium Quality Ceylon Turmeric Powder', 
    image: '/turmeric.png',
    accentColor: '#FFA500',
  price: "200.00/50g",
    currency: 'Rs.'
  },
];

// Animation variants for the page
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

// This is the main function that creates the "Products" page
const Products = () => {
  return (
    <div className="products-page-container">
      <h1 className="products-page-title">All Our Products</h1>
      <motion.div 
        className="products-page-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product, index) => (
          <motion.div key={index} variants={itemVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Products; // This line is crucial