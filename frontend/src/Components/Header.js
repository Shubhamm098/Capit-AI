import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const handleNavClick = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <img src='capitLogo.png' alt="Capit-AI Logo" className="logo-image" />
        </div>
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="menu">
            <li>
              <Link 
                to="/" 
                className={activePage === 'home' ? 'active' : ''} 
                onClick={() => handleNavClick('home')}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/tax-optimization" 
                className={activePage === 'tax-optimization' ? 'active' : ''} 
                onClick={() => handleNavClick('tax-optimization')}
              >
                TAX TAILOR
              </Link>
            </li>
            <li>
              <Link 
                to="/mutual-funds" 
                className={activePage === 'mutual-funds' ? 'active' : ''} 
                onClick={() => handleNavClick('mutual-funds')}
              >
                SMART INVEST
              </Link>
            </li>
            <li>
              <Link 
                to="/news" 
                className={activePage === 'news' ? 'active' : ''} 
                onClick={() => handleNavClick('news')}
              >
                NEWS
              </Link>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="btn btn-login">Login</button>
          <button className="btn btn-signup">Sign Up</button>
        </div>
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
