import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-logo">
          <h2>Capit-AI</h2>
          <p>Your AI-powered financial companion</p>
        </div>
        <div className="footer-grid">
          <div className="footer-column">
            <h3>Our Services</h3>
            <ul>
              <li><a href="#">AI-Powered Analysis</a></li>
              <li><a href="#">Investment Planning</a></li>
              <li><a href="#">Budget Optimization</a></li>
              <li><a href="#">Financial Education</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Whitepaper</a></li>
              <li><a href="#">Case Studies</a></li>
              <li><a href="#">FAQs</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
            </div>
            <div className="newsletter">
              <h4>Subscribe to our newsletter</h4>
              <form>
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Capit-AI. All rights reserved</p>
        <nav>
          <a href="#">Terms and Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer