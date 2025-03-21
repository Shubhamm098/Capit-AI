import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [phrase, setPhrase] = useState({
    text: 'YOUR AI-POWERED PATH TO FINANCIAL FREEDOM',
    highlight: 'FINANCIAL FREEDOM',
    color: 'green'
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const phrases = [
    { text: 'YOUR AI-POWERED PATH TO FINANCIAL FREEDOM', highlight: 'FINANCIAL FREEDOM', color: 'green' },
    { text: 'SMARTER FINANCIAL PLANNING STARTS HERE', highlight: 'FINANCIAL PLANNING', color: 'red' },
    { text: 'AI-DRIVEN FINANCIAL GUIDANCE FOR YOUR BEST FUTURE', highlight: 'FINANCIAL GUIDANCE', color: 'blue' }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
        setIsTransitioning(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderPhrase = () => {
    const words = phrase.text.split(' ');
    const highlightWords = phrase.highlight.split(' ');
    return words.map((word, index) => (
      <span key={index} className={`word ${highlightWords.includes(word) ? `highlight ${phrase.color}` : ''}`}>
        {word}{' '}
      </span>
    ));
  };

  return (
    <section className="hero">
      <h1 className={`dynamic-text ${isTransitioning ? 'transitioning' : ''}`}>
        {renderPhrase()}
      </h1>
      <p>  Discover smarter financial planning with Capit-AI. Our AI-powered personal financial advisor helps you track expenses, optimize investments, save on taxes, and plan for retirement—all in one intuitive platform. Start making data-driven decisions that secure your financial future today!</p>
      <div className="cta-buttons">
        <button className="cta-button red-button">Get Started</button>
        <button className="cta-button green-button">Learn More</button>
      </div>
      <video className="hero-image" autoPlay loop muted>
        <source src="stock-market-financial-graph-chart-for-investment-3d-rendering-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  );
};

export default HeroSection;
