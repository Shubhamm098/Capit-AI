import React from 'react'
import './ProjectsSection.css'

const ProjectsSection = () => {
  return (
    <section className="projects">
      <h2>Our Success Stories</h2>
      <p>See how Capit-AI has transformed the financial lives of our clients.</p>
      <div className="project-grid">
        <div className="project-item">
          <img src="https://via.placeholder.com/400x300.png?text=Retirement+Planning" alt="Retirement Planning Revolution" />
          <h3>Retirement Planning Revolution</h3>
          <p>How we helped a client optimize their retirement savings and achieve financial freedom.</p>
        </div>
        <div className="project-item">
          <img src="https://via.placeholder.com/400x300.png?text=Debt+Management" alt="Debt Management Success" />
          <h3>Debt Management Success</h3>
          <p>Our AI-powered strategies helped a family eliminate $50,000 in debt in just 18 months.</p>
        </div>
        <div className="project-item">
          <img src="https://via.placeholder.com/400x300.png?text=Investment+Portfolio" alt="Investment Portfolio Optimization" />
          <h3>Investment Portfolio Optimization</h3>
          <p>How we increased a client's investment returns by 15% through AI-driven portfolio rebalancing.</p>
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection