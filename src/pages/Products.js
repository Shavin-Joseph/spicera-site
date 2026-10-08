import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { subscribeProducts } from '../firebase/productsService';
import { DEFAULT_PRODUCTS, SPICE_CATEGORIES } from '../data/defaultProducts';
import './Products.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

const Products = () => {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('All Spices');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Real-time Firestore sync
  useEffect(() => {
    const unsubscribe = subscribeProducts(
      (data) => {
        if (data && data.length > 0) {
          setProducts(data);
        }
      },
      (error) => {
        console.warn('Products catalog subscription notice:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper to parse price string like "2,450.00" or "195.00/50g" into a number
  const parseNumericPrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    const cleaned = priceStr.split('/')[0].replace(/[^0-9.]/g, '');
    return parseFloat(cleaned) || 0;
  };

  // Filter & Sort
  const filteredProducts = products
    .filter((prod) => {
      const matchCat =
        selectedCategory === 'All Spices' || prod.category === selectedCategory;
      const matchSearch =
        !searchQuery ||
        prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.tags && prod.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchStock = !inStockOnly || prod.inStock !== false;

      return matchCat && matchSearch && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === 'featured') {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      if (sortBy === 'price-low') {
        return parseNumericPrice(a.price) - parseNumericPrice(b.price);
      }
      if (sortBy === 'price-high') {
        return parseNumericPrice(b.price) - parseNumericPrice(a.price);
      }
      if (sortBy === 'name-az') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleResetFilters = () => {
    setSelectedCategory('All Spices');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
  };

  return (
    <div className="products-page-container">
      {/* Header Banner */}
      <div className="products-hero-banner">
        <span className="products-eyebrow">The Complete Spice Vault</span>
        <h1 className="products-page-title">All Our Pure Ceylon Spices</h1>
        <p className="products-page-desc">
          Uncompromised natural freshness, intense culinary aroma, and single origin provenance direct to your doorstep.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="products-filter-bar">
        {/* Category Pills */}
        <div className="category-tabs-scroll">
          {SPICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search, Sort & Stock Toolbar */}
        <div className="products-toolbar-row">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search spices, aroma, or grade..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="toolbar-controls-right">
            <label className="stock-filter-toggle">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>

            <div className="sort-dropdown-wrap">
              <FaFilter className="sort-icon" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="results-counter-row">
        <span>
          Showing <strong>{filteredProducts.length}</strong> of {products.length} pure spices
        </span>
        {(searchQuery || selectedCategory !== 'All Spices' || inStockOnly) && (
          <button type="button" className="reset-filter-btn" onClick={handleResetFilters}>
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="no-products-found">
          <h3>No matching spices found</h3>
          <p>We couldn't find any items matching your selected search or filter criteria.</p>
          <button type="button" className="reset-btn" onClick={handleResetFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <motion.div
          className="products-page-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${selectedCategory}-${sortBy}-${searchQuery}-${inStockOnly}`}
        >
          {filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Products;