import React, { useState, useCallback, useRef } from 'react'
import './ServicesSection.css'

const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const services = [
    {
      title: 'Tax Optimization',
      description: 'Receive personalized strategies that help minimize your tax liabilities and maximize your savings, all while ensuring compliance with the latest tax laws.',
      icon: 'serv-taxy.webp' // Update with actual image path
    },
    {
      title: 'Expenditure Ledger',
      description: 'Track, categorize, and analyze all your expenses in real time. Our AI-driven ledger provides insights into your spending habits and highlights potential areas for savings.',
      icon: 'serv-expense.png' // Update with actual image path
    },
    {
      title: 'Smart Invest Recommendation',
      description: 'Get AI-powered investment advice tailored to your risk profile and financial goals. Our system constantly analyzes market trends to recommend the best investment opportunities.',
      icon: 'serv-invest.jpg' // Update with actual image path
    },
    {
      title: 'Retirement Planning',
      description: 'Plan for a secure and comfortable retirement with personalized strategies that ensure you\'re on track to meet your long-term financial goals.',
      icon: 'serv-retirement.gif' // Update with actual image path
    },
    {
      title: 'Portfolio Optimization',
      description: 'Optimize your investment portfolio with real-time, AI-driven analysis to maximize returns while minimizing risk, tailored to your unique financial situation.',
      icon: 'serv-portfolio.jpg' // Update with actual image path
    }
  ];

  const totalSlides = services.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  return (
    <section className="services">
      <h2>OUR SERVICES</h2>
      <div className="carousel-container">
        <button className="carousel-button prev" onClick={prevSlide}>&#10094;</button>
        <div 
          className="service-carousel" 
          ref={carouselRef}
          style={{ transform: `translateX(-${activeIndex * (100 / 3)}%)` }}
        >
          {services.map((service, index) => (
            <div key={index} className="card">
              <div className="image">
                <img src={service.icon} alt={`${service.title} Icon`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="content">
                <a href="#">
                  <span className="title">{service.title}</span>
                </a>
                <p className="desc">{service.description}</p>
                <a className="action" href="#">
                  Learn More
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
        <button className="carousel-button next" onClick={nextSlide}>&#10095;</button>
      </div>
    </section>
  );
};

export default ServicesSection;
