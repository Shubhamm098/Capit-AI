import React, { useState } from 'react';
import './TaxOptimization.css'; // Import CSS for styling
import FinancialData from './FinancialData'; // Import the FinancialData component
import { FaCalculator, FaMoneyBillWave, FaSpinner, FaChartLine, FaPiggyBank, FaHandHoldingUsd, FaHome, FaGraduationCap, FaHeart, FaLock, FaChartBar, FaUserTie, FaSyncAlt } from 'react-icons/fa'; // Import icons

const TaxOptimization = () => {
  const [activeTab, setActiveTab] = useState('calculator');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [income, setIncome] = useState('');
  const [regime, setRegime] = useState('new');
  const [taxResult, setTaxResult] = useState(null);
  const [formData, setFormData] = useState({
    income: '',
    expenses: '',
    health_insurance: '',
    home_loan: '',
    elss: '',
    nps: '',
    ppf: '',
    house_rent: '',
    previous_tax_amount: '',
    state: 'MH',
    filing_status: 'Single',
    tax_credits: 0,
    age: '',
    risk_appetite: 'Medium',
    investment_horizon: 'Long',
    existing_investments: {
      stocks: '',
      mutual_funds: ''
    }
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'stocks' || name === 'mutual_funds') {
      setFormData(prev => ({
        ...prev,
        existing_investments: {
          ...prev.existing_investments,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          income: parseFloat(formData.income),
          expenses: parseFloat(formData.expenses),
          health_insurance: parseFloat(formData.health_insurance),
          home_loan: parseFloat(formData.home_loan),
          elss: parseFloat(formData.elss),
          nps: parseFloat(formData.nps),
          ppf: parseFloat(formData.ppf),
          house_rent: parseFloat(formData.house_rent),
          previous_tax_amount: parseFloat(formData.previous_tax_amount),
          age: parseInt(formData.age),
          existing_investments: {
            stocks: parseFloat(formData.existing_investments.stocks),
            mutual_funds: parseFloat(formData.existing_investments.mutual_funds)
          }
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tax-optimization-container">
      <div className="tab-header">
        <button 
          className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`} 
          onClick={() => setActiveTab('calculator')}
        >
          <FaCalculator /> Tax Calculator
        </button>
        <button 
          className={`tab-button ${activeTab === 'optimizer' ? 'active' : ''}`} 
          onClick={() => setActiveTab('optimizer')}
        >
          <FaChartLine /> Tax Optimizer
        </button>
      </div>

      {activeTab === 'calculator' && (
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

      {activeTab === 'optimizer' && (
        <div className="tax-optimization-card">
          <h1 className="title">Tax Optimizer</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Income (₹)</label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Expenses (₹)</label>
                <input
                  type="number"
                  name="expenses"
                  value={formData.expenses}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Health Insurance (₹)</label>
                <input
                  type="number"
                  name="health_insurance"
                  value={formData.health_insurance}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Home Loan (₹)</label>
                <input
                  type="number"
                  name="home_loan"
                  value={formData.home_loan}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">ELSS (₹)</label>
                <input
                  type="number"
                  name="elss"
                  value={formData.elss}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">NPS (₹)</label>
                <input
                  type="number"
                  name="nps"
                  value={formData.nps}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">PPF (₹)</label>
                <input
                  type="number"
                  name="ppf"
                  value={formData.ppf}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">House Rent (₹)</label>
                <input
                  type="number"
                  name="house_rent"
                  value={formData.house_rent}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Previous Tax Amount (₹)</label>
                <input
                  type="number"
                  name="previous_tax_amount"
                  value={formData.previous_tax_amount}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="MH">Maharashtra</option>
                  <option value="DL">Delhi</option>
                  <option value="KA">Karnataka</option>
                  <option value="TN">Tamil Nadu</option>
                  <option value="WB">West Bengal</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Filing Status</label>
                <select
                  name="filing_status"
                  value={formData.filing_status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Risk Appetite</label>
                <select
                  name="risk_appetite"
                  value={formData.risk_appetite}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Investment Horizon</label>
                <select
                  name="investment_horizon"
                  value={formData.investment_horizon}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="Short">Short</option>
                  <option value="Medium">Medium</option>
                  <option value="Long">Long</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Existing Investments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Stocks (₹)</label>
                  <input
                    type="number"
                    name="stocks"
                    value={formData.existing_investments.stocks}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Mutual Funds (₹)</label>
                  <input
                    type="number"
                    name="mutual_funds"
                    value={formData.existing_investments.mutual_funds}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Calculate Tax Optimization'}
            </button>
          </form>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Current Tax Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Tax</p>
                    <p className="text-lg font-semibold">₹{result.current_tax.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taxable Income</p>
                    <p className="text-lg font-semibold">₹{result.taxable_income.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Deductions</p>
                    <p className="text-lg font-semibold">₹{result.total_deductions.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Projected Savings</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Projected Tax</p>
                    <p className="text-lg font-semibold">₹{result.projected_savings.projected_tax.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Potential Savings</p>
                    <p className="text-lg font-semibold">₹{result.projected_savings.potential_savings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Savings Percentage</p>
                    <p className="text-lg font-semibold">{result.projected_savings.savings_percentage.toFixed(2)}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Risk Analysis</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Risk Category</p>
                    <p className="text-lg font-semibold">{result.risk_analysis.risk_category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Score</p>
                    <p className="text-lg font-semibold">{result.risk_analysis.risk_score.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="recommendations-section">
                <h2 className="recommendations-title">
                  <FaChartLine /> Tax Optimization Recommendations
                </h2>
                <ul className="recommendations-list">
                  {[...new Set(result.recommendations)].map((rec, index) => {
                    // Clean up the recommendation text
                    const cleanRec = rec
                      .replace(/\*\*/g, '')
                      .replace(/^\d+\.\s*/, '')
                      .split(':')
                      .map(part => part.trim());

                    const title = cleanRec[0];
                    const description = cleanRec[1] || '';

                    // Check if this is an investment amount recommendation
                    const isInvestmentAmount = title.toLowerCase().includes('you can invest');
                    
                    if (isInvestmentAmount) {
                      return (
                        <li key={index} className="investment-suggestion">
                          <span className="suggestion-icon">
                            <FaMoneyBillWave />
                          </span>
                          <div className="suggestion-content">
                            {title}
                          </div>
                        </li>
                      );
                    }

                    // Regular recommendations
                    let icon = <FaSyncAlt />;
                    if (title.toLowerCase().includes('80c')) {
                      icon = <FaPiggyBank />;
                    } else if (title.toLowerCase().includes('nps')) {
                      icon = <FaHandHoldingUsd />;
                    } else if (title.toLowerCase().includes('home loan')) {
                      icon = <FaHome />;
                    } else if (title.toLowerCase().includes('80e')) {
                      icon = <FaGraduationCap />;
                    } else if (title.toLowerCase().includes('80g')) {
                      icon = <FaHeart />;
                    } else if (title.toLowerCase().includes('80tta')) {
                      icon = <FaLock />;
                    } else if (title.toLowerCase().includes('tax loss')) {
                      icon = <FaChartBar />;
                    } else if (title.toLowerCase().includes('review')) {
                      icon = <FaSyncAlt />;
                    } else if (title.toLowerCase().includes('mutual fund')) {
                      icon = <FaChartLine />;
                    }

                    return (
                      <li key={index} className="recommendation-item">
                        <span className="recommendation-icon">
                          {icon}
                        </span>
                        <div className="recommendation-content">
                          <span className="recommendation-title">{title}</span>
                          {description && ': '}
                          <span className="recommendation-description">{description}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {result.projected_savings && result.projected_savings.nps_additional && (
                  <div className="investment-suggestion">
                    <span className="suggestion-icon">
                      <FaMoneyBillWave />
                    </span>
                    <div className="suggestion-content">
                      You can invest ₹{result.projected_savings.nps_additional.toLocaleString()} more in NPS under Section 80CCD(1B)
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaxOptimization;
