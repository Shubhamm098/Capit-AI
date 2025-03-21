import React from 'react'
import './Landing.css'

const Landing = () => {
  return (
    <div className="landing">
      <section className="hero">
        <h1>Capit-AI: Your AI-Powered Personal Financial Advisor</h1>
        <h2>Make smart financial decisions with tailored advice, powered by AI.</h2>
        <button className="cta-button">Start Your Free Consultation</button>
        {/* TODO: Add AI and financial data graphic */}
      </section>

      <section className="features">
        <h2>Our Features</h2>
        {/* TODO: Add feature items with icons and descriptions */}
      </section>

      <section className="benefits">
        <h2>Benefits</h2>
        <ul>
          <li>Manage your finances like a pro with real-time AI insights.</li>
          <li>Save more, invest smarter, and plan better for the future.</li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>What Our Clients Say</h2>
        {/* TODO: Add testimonials or client reviews */}
      </section>

      <section className="cta">
        <h2>Ready to transform your financial future?</h2>
        <button className="cta-button">Get Started Now</button>
      </section>
    </div>
  )
}

export default Landing
