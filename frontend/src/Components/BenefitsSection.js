import React from 'react'
import './BenefitsSection.css'

const BenefitsSection = () => {
  return (
    <section className="benefits">
      <h2>OUR IMPACT</h2>
      <div className="benefit-grid">
        <div className="benefit-item">
          <h3>$100M+</h3>
          <p>Client savings</p>
        </div>
        <div className="benefit-item">
          <h3>50,000+</h3>
          <p>Active users</p>
        </div>
        <div className="benefit-item">
          <h3>98%</h3>
          <p>Client satisfaction</p>
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection