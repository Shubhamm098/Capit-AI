import React, { useState } from 'react';
import './FinancialData.css'; // Import CSS for styling

const FinancialData = () => {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [homeLoan, setHomeLoan] = useState('');
  const [elss, setElss] = useState('');
  const [nps, setNps] = useState('');
  const [ppf, setPpf] = useState('');
  const [houseRent, setHouseRent] = useState('');
  const [previousTaxAmount, setPreviousTaxAmount] = useState('');
  const [state, setState] = useState('');
  const [filingStatus, setFilingStatus] = useState('Single');
  const [taxCredits, setTaxCredits] = useState('');
  const [suggestions, setSuggestions] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    generateSuggestions();
  };

  // Function to generate suggestions based on user input
  const generateSuggestions = () => {
    let suggestions = '';

    if (parseFloat(income) > 1000000) {
      suggestions += 'Consider investing in ELSS for tax benefits. ';
    }
    if (parseFloat(healthInsurance) < 25000) {
      suggestions += 'Increase your health insurance coverage to maximize deductions. ';
    }
    if (parseFloat(homeLoan) > 0) {
      suggestions += 'You can claim deductions on home loan interest. ';
    }
    if (parseFloat(nps) < 50000) {
      suggestions += 'Consider contributing to NPS for additional tax benefits. ';
    }
    if (parseFloat(expenses) > 300000) {
      suggestions += 'Review your expenses to identify potential savings. ';
    }

    setSuggestions(suggestions || 'No specific suggestions available based on the provided data.');
  };

  return (
    <div className="financial-data">
      <h2>Financial Data Input</h2>
      <form onSubmit={handleSubmit} className="financial-form">
        <div className="input-group">
          <label>
            Income (₹):
            <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} required />
          </label>
          <label>
            Expenses (₹):
            <input type="number" value={expenses} onChange={(e) => setExpenses(e.target.value)} required />
          </label>
          <label>
            Health Insurance (₹):
            <input type="number" value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} />
          </label>
          <label>
            Home Loan (₹):
            <input type="number" value={homeLoan} onChange={(e) => setHomeLoan(e.target.value)} />
          </label>
          <label>
            ELSS (₹):
            <input type="number" value={elss} onChange={(e) => setElss(e.target.value)} />
          </label>
          <label>
            NPS (₹):
            <input type="number" value={nps} onChange={(e) => setNps(e.target.value)} />
          </label>
          <label>
            PPF (₹):
            <input type="number" value={ppf} onChange={(e) => setPpf(e.target.value)} />
          </label>
          <label>
            House Rent (₹):
            <input type="number" value={houseRent} onChange={(e) => setHouseRent(e.target.value)} />
          </label>
          <label>
            Previous Tax Amount (₹):
            <input type="number" value={previousTaxAmount} onChange={(e) => setPreviousTaxAmount(e.target.value)} />
          </label>
          <label>
            State:
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
          </label>
          <label>
            Filing Status:
            <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)}>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>
          </label>
          <label>
            Tax Credits (₹):
            <input type="number" value={taxCredits} onChange={(e) => setTaxCredits(e.target.value)} />
          </label>
        </div>
        <button type="submit">Get Suggestions</button>
      </form>
      <div className="suggestions">
        <h3>Suggestions:</h3>
        <p>{suggestions}</p> {/* Display suggestions */}
      </div>
    </div>
  );
};

export default FinancialData;
