import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const { getTotalCount, setIsDrawerOpen } = useCart();
  const bagCount = getTotalCount();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="logo">
        <Link to="/">
          <img src="/logo.png" alt="Spicera Logo" />
          <span>Spicera</span>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/" className={isActive('/') ? 'active-link' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className={isActive('/products') ? 'active-link' : ''}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'active-link' : ''}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive('/contact') ? 'active-link' : ''}>
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* Right Action Icons: Cart/Bag */}
      <div className="header-actions">
        <button
          type="button"
          className="header-bag-btn"
          onClick={() => setIsDrawerOpen(true)}
          aria-label="View Spice Order Bag"
          title="Spice Order Bag"
        >
          <FaShoppingBag />
          {bagCount > 0 && <span className="bag-badge">{bagCount}</span>}
        </button>

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;