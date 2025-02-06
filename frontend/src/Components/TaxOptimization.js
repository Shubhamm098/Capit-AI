import React, { useState } from 'react';
import './TaxOptimization.css'; // Import CSS for styling
import FinancialData from './FinancialData'; // Import the FinancialData component
import { FaCalculator, FaMoneyBillWave } from 'react-icons/fa'; // Import icons

const TaxOptimization = () => {
  const [activeTab, setActiveTab] = useState('taxOptimization');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="tax-optimization-container">
      <div className="tab-header">
        <button className={`tab-button ${activeTab === 'taxOptimization' ? 'active' : ''}`} onClick={() => handleTabChange('taxOptimization')}>
          <FaCalculator /> Tax Calculator
        </button>
        <button className={`tab-button ${activeTab === 'financialData' ? 'active' : ''}`} onClick={() => handleTabChange('financialData')}>
          <FaMoneyBillWave /> Financial Data
        </button>
      </div>

      {activeTab === 'taxOptimization' && (
        <div className="tax-optimization-card">
          <h1 className="title">Tax Calculator</h1>
          <div className="input-group">
            <label>
              Annual Income (₹):
              <input type="number" />
            </label>
            <label>
              Tax Regime:
              <select>
                <option value="new">New Regime</option>
                <option value="old">Old Regime</option>
              </select>
            </label>
          </div>
          <button className="calculate-button">Calculate Tax</button>
        </div>
      )}

      {activeTab === 'financialData' && (
        <FinancialData />
      )}
    </div>
  );
};

export default TaxOptimization;
