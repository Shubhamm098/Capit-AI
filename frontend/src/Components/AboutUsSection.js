import React from 'react';
import './AboutUsSection.css';

const AboutContent = () => (
  <div className="abtty">
    <img src="about-sect.webp" alt="" />
    <div className="about-content">
  <h2 className="about-title">About Capit-AI</h2>
  <p className="about-lead">Revolutionizing financial management with AI-driven solutions</p>
  <p>At Capit-AI, we're passionate about empowering individuals and businesses to make smarter financial decisions. Our cutting-edge AI technology analyzes complex financial data to provide personalized insights and recommendations, ensuring that users can confidently manage their finances with ease.</p>
  <ul className="about-features">
    <li>Advanced AI-powered financial analysis</li>
    <li>Personalized investment strategies</li>
    <li>Real-time tax optimization</li>
    <li>Secure and confidential data handling</li>
    <li>Comprehensive expense tracking and retirement planning</li>
  </ul>
  <button className="about-cta">Learn More</button>
</div>

  </div>
  
);

// const ContactForm = () => (
//   <div className="contact-form">
//     <h2 className="contact-title">Contact Us</h2>
//     <form>
//       <input type="text" placeholder="Name" required />
//       <input type="email" placeholder="Email" required />
//       <textarea placeholder="Message" required></textarea>
//       <button type="submit" className="contact-submit">Submit</button>
//     </form>
//   </div>
// );

const AboutUsSection = () => {
  return (
    <section className="about-us">
      <div className="about-contar">
        <AboutContent />
        
      </div>
    </section>
  );
};

export default AboutUsSection;
