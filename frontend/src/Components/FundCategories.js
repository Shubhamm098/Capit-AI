import React from 'react';
import './FundCategories.css';

const FundCategories = () => {
  const categories = [
    { name: 'Equity', icon: 'path/to/equity-icon.png' },
    { name: 'Debt', icon: 'path/to/debt-icon.png' },
    { name: 'Hybrid', icon: 'path/to/hybrid-icon.png' },
  ];

  return (
    <section className="fund-categories">
      <h2>Fund Categories</h2>
      <div className="categories-container">
        {categories.map((category, index) => (
          <div className="category-card" key={index}>
            <img src={category.icon} alt={category.name} />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FundCategories;

