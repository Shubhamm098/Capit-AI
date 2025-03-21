import React, { useState } from 'react';
import './FAQSection.css';
import FinancialNews from './FinancialNews'; // Import the FinancialNews component

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How does Capit-AI's tax optimization work?",
      answer: "Our AI-driven tax optimization analyzes your financial data and current tax laws to identify legal strategies for minimizing your tax liability. It considers factors such as deductions, credits, and timing of income and expenses to provide personalized recommendations."
    },
    {
      question: "Is my financial data secure with Capit-AI?",
      answer: "Absolutely. We employ bank-level encryption and security measures to protect your data. Our systems are regularly audited and updated to ensure the highest level of security. We never share your personal information with third parties without your explicit consent."
    },
    {
      question: "How accurate are Capit-AI's investment recommendations?",
      answer: "Our investment recommendations are based on advanced AI algorithms that analyze market trends, economic indicators, and your personal risk profile. While no investment is without risk, our recommendations are designed to optimize your portfolio based on the most current and comprehensive data available."
    },
    {
      question: "Can Capit-AI help with retirement planning?",
      answer: "Yes, Capit-AI offers comprehensive retirement planning services. Our AI takes into account your current financial situation, retirement goals, and projected expenses to create a personalized retirement strategy. We continuously adjust this plan based on market conditions and changes in your life circumstances."
    },
    {
      question: "How often should I review my financial plan with Capit-AI?",
      answer: "While Capit-AI continuously monitors and adjusts your financial plan, we recommend a thorough review at least quarterly. However, you should also review your plan after any significant life events such as marriage, birth of a child, job change, or major asset purchase or sale."
    },
    {
      question: "How often should I review my financial plan with Capit-AI?",
      answer: "While Capit-AI continuously monitors and adjusts your financial plan, we recommend a thorough review at least quarterly. However, you should also review your plan after any significant life events such as marriage, birth of a child, job change, or major asset purchase or sale."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className='newsy'>
        <h2>Whats new in the Market !!</h2>
      <div className="empty-div">
        {/* <FinancialNews /> Render the FinancialNews component here */}
      </div>
      </div>
     
      <div className="faq-container">
        <div className="faq-content">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`} 
              key={index}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span className="faq-number">{index + 1}</span>
                {faq.question}
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
