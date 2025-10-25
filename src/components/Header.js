import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    // State to track if the page is scrolled
    const [isScrolled, setIsScrolled] = useState(false);
    // State for the mobile menu
    const [menuOpen, setMenuOpen] = useState(false);

    // Effect to add a scroll event listener
    useEffect(() => {
        const handleScroll = () => {
            // Set isScrolled to true if user scrolls more than 50px, else false
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup function to remove the event listener
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        // The 'scrolled' and 'menu-open' classes are added dynamically
        <header className={`header ${isScrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
             <div className="logo">
                {/* We are adding the <img> tag right before the name "Spicera" */}
                <Link to="/">
                    <img src="/logo.png" alt="Spicera Logo" />
                    Spicera
                </Link>
            </div>

            {/* Part 2: The Hamburger Icon for Mobile */}
            <div className="hamburger" onClick={toggleMenu}>
                <div className="line"></div>
                <div className="line"></div>
                <div className="line"></div>
            </div>

            {/* The navigation links, now ready for mobile */}
            <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li onClick={() => setMenuOpen(false)}><Link to="/">Home</Link></li>
                    <li onClick={() => setMenuOpen(false)}><Link to="/products">Products</Link></li>
                    <li onClick={() => setMenuOpen(false)}><Link to="/about">About Us</Link></li>
                    <li onClick={() => setMenuOpen(false)}><Link to="/contact">Contact</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;