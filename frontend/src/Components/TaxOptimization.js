import React, { useState } from 'react';
import './TaxOptimization.css'; // Import CSS for styling
import FinancialData from './FinancialData'; // Import the FinancialData component
import { FaCalculator, FaMoneyBillWave } from 'react-icons/fa'; // Import icons

const TaxOptimization = () => {
  const [activeTab, setActiveTab] = useState('taxOptimization');
  const [income, setIncome] = useState('');
  const [regime, setRegime] = useState('new');
  const [taxResult, setTaxResult] = useState(null);

  const calculateTax = () => {
    const annualIncome = parseFloat(income);
    let tax = 0;

    if (regime === 'new') {
      // New Tax Regime 2024-25
      if (annualIncome <= 300000) {
        tax = 0;
      } else if (annualIncome <= 600000) {
        tax = (annualIncome - 300000) * 0.05;
      } else if (annualIncome <= 900000) {
        tax = 15000 + (annualIncome - 600000) * 0.10;
      } else if (annualIncome <= 1200000) {
        tax = 45000 + (annualIncome - 900000) * 0.15;
      } else if (annualIncome <= 1500000) {
        tax = 90000 + (annualIncome - 1200000) * 0.20;
      } else {
        tax = 150000 + (annualIncome - 1500000) * 0.30;
      }
    } else {
      // Old Tax Regime
      if (annualIncome <= 250000) {
        tax = 0;
      } else if (annualIncome <= 500000) {
        tax = (annualIncome - 250000) * 0.05;
      } else if (annualIncome <= 1000000) {
        tax = 12500 + (annualIncome - 500000) * 0.20;
      } else {
        tax = 112500 + (annualIncome - 1000000) * 0.30;
      }
    }

    // Calculate cess (4% of tax)
    const cess = tax * 0.04;
    const totalTax = tax + cess;

    setTaxResult({
      basicTax: tax,
      cess: cess,
      totalTax: totalTax
    });
  };

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
              <input 
                type="number" 
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your annual income"
              />
            </label>
            <label>
              Tax Regime:
              <select value={regime} onChange={(e) => setRegime(e.target.value)}>
                <option value="new">New Regime (2024-25)</option>
                <option value="old">Old Regime</option>
              </select>
            </label>
          </div>
          <button className="calculate-button" onClick={calculateTax}>
            Calculate Tax
          </button>

          {taxResult && (
            <div className="tax-result">
              <h2>Tax Calculation Results</h2>
              <p>Basic Tax: ₹{taxResult.basicTax.toFixed(2)}</p>
              <p>Health & Education Cess (4%): ₹{taxResult.cess.toFixed(2)}</p>
              <p>Total Tax Liability: ₹{taxResult.totalTax.toFixed(2)}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'financialData' && (
        <FinancialData />
      )}
    </div>
  );
};

export default TaxOptimization;
