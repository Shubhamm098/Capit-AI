import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import './MutualFunds.css';

// Define a modern color palette
const COLORS = {
  primary: '#6366F1',    // Indigo
  secondary: '#8B5CF6',  // Purple
  accent: '#EC4899',     // Pink
  chart1: '#6366F1',     // Indigo for primary chart line
  chart2: '#EC4899',     // Pink for comparison chart line
  success: '#0EA5E9',    // Sky blue
  text: '#F3F4F6',
  muted: '#9CA3AF'
};

const MutualFund = () => {
  const [schemeCodes, setSchemeCodes] = useState(['', '']);
  const [fundsData, setFundsData] = useState([]);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [compareMode, setCompareMode] = useState(false);

  const handleInputChange = (index, value) => {
    const newSchemeCodes = [...schemeCodes];
    newSchemeCodes[index] = value;
    setSchemeCodes(newSchemeCodes);
  };

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fundsToFetch = compareMode ? schemeCodes : [schemeCodes[0]];
      const validCodes = fundsToFetch.filter(code => code.trim());

      if (validCodes.length === 0) {
        throw new Error('Please enter at least one scheme code');
      }

      const responses = await Promise.all(
        validCodes.map(code => axios.get(`https://api.mfapi.in/mf/${code}`))
      );

      const processedData = responses.map(response => {
        const data = response.data;
        const historicalNav = data.data.slice(0, 365).map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          nav: parseFloat(item.nav)
        })).reverse();

        const returns = historicalNav.map((item, index) => {
          if (index === 0) return 0;
          return (item.nav - historicalNav[index - 1].nav) / historicalNav[index - 1].nav;
        });

        const annualizedVolatility = (Math.std(returns) * Math.sqrt(252) * 100).toFixed(2);
        const annualizedReturn = ((Math.pow(1 + returns.reduce((a, b) => a + b) / returns.length, 252) - 1) * 100).toFixed(2);
        const sharpeRatio = ((annualizedReturn - 6) / annualizedVolatility).toFixed(2);

        return {
          meta: data.meta,
          latestNav: data.data[0],
          historicalNav,
          metrics: {
            volatility: annualizedVolatility,
            return: annualizedReturn,
            sharpe: sharpeRatio
          }
        };
      });

      setFundsData(processedData);

      // Prepare comparative historical data
      if (processedData.length > 0) {
        const combinedHistoricalData = processedData[0].historicalNav.map(item => {
          const dataPoint = { date: item.date };
          processedData.forEach((fund, index) => {
            const fundNav = fund.historicalNav.find(nav => nav.date === item.date);
            if (fundNav) {
              dataPoint[`nav${index + 1}`] = fundNav.nav;
              dataPoint[`name${index + 1}`] = fund.meta.scheme_name;
            }
          });
          return dataPoint;
        });
        setHistoricalData(combinedHistoricalData);
      }

    } catch (err) {
      setError(err.message || 'Error fetching data. Please check the scheme codes.');
      setFundsData([]);
      setHistoricalData(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateRiskReturnData = (historicalNav) => {
    const windowSize = 30; // 30-day rolling window
    const riskReturnData = [];

    for (let i = windowSize; i < historicalNav.length; i++) {
      const window = historicalNav.slice(i - windowSize, i);
      const returns = window.map((item, index) => {
        if (index === 0) return 0;
        return (item.nav - window[index - 1].nav) / window[index - 1].nav * 100;
      });

      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const volatility = Math.std(returns);

      riskReturnData.push({
        date: historicalNav[i].date,
        risk: volatility,
        return: avgReturn,
        z: 1 // Size of scatter point
      });
    }

    return riskReturnData;
  };

  return (
    <div className="mutual-fund-page">
      <div className="header-section">
        <h1>Mutual Fund Analytics</h1>
        <p className="subtitle">Advanced analysis and comparison of mutual fund performance</p>
        <div className="mode-toggle">
          <button 
            className={`mode-button ${!compareMode ? 'active' : ''}`}
            onClick={() => setCompareMode(false)}
          >
            <span className="icon">📊</span> Single Fund
          </button>
          <button 
            className={`mode-button ${compareMode ? 'active' : ''}`}
            onClick={() => setCompareMode(true)}
          >
            <span className="icon">🔄</span> Compare Funds
          </button>
        </div>
        <div className="search-container glass-effect">
          <input
            type="text"
            placeholder="Enter First Scheme Code"
            value={schemeCodes[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
            className="scheme-input"
          />
          {compareMode && (
            <input
              type="text"
              placeholder="Enter Second Scheme Code"
              value={schemeCodes[1]}
              onChange={(e) => handleInputChange(1, e.target.value)}
              className="scheme-input"
            />
          )}
          <button 
            onClick={handleFetchData} 
            className="fetch-button"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Analyze Fund(s)'}
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {fundsData.length > 0 && (
        <div className={`dashboard-grid ${compareMode ? 'compare-mode' : 'single-mode'}`}>
          {/* Fund Overview Cards */}
          {fundsData.map((fund, index) => (
            <div key={index} className="dashboard-card fund-overview">
              <h2>{fund.meta.scheme_name}</h2>
              <div className="fund-details">
                <p><strong>Category:</strong> {fund.meta.scheme_category}</p>
                <p><strong>Type:</strong> {fund.meta.scheme_type}</p>
                <p><strong>Latest NAV:</strong> ₹{fund.latestNav.nav}</p>
                <p><strong>NAV Date:</strong> {fund.latestNav.date}</p>
              </div>
              <div className="metrics-grid">
                <div className="metric">
                  <h3>Volatility</h3>
                  <p>{fund.metrics.volatility}%</p>
                </div>
                <div className="metric">
                  <h3>Annual Return</h3>
                  <p>{fund.metrics.return}%</p>
                </div>
                <div className="metric">
                  <h3>Sharpe Ratio</h3>
                  <p>{fund.metrics.sharpe}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Risk-Return Distribution Plot (only in single mode) */}
          {!compareMode && (
            <div className="dashboard-card risk-return-plot">
              <h2>Risk-Return Distribution</h2>
              <ResponsiveContainer width="100%" height="85%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="risk" 
                    name="Risk (Volatility)" 
                    label={{ value: 'Risk (%)', position: 'bottom' }}
                    domain={['auto', 'auto']}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="return" 
                    name="Return" 
                    label={{ value: 'Return (%)', angle: -90, position: 'left' }}
                    domain={['auto', 'auto']}
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 50]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={<RiskReturnTooltip />}
                  />
                  <Scatter 
                    name={fundsData[0].meta.scheme_name}
                    data={calculateRiskReturnData(fundsData[0].historicalNav)}
                    fill={COLORS.primary}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* NAV Chart */}
          <div className="dashboard-card nav-chart">
            <h2>NAV History {compareMode ? 'Comparison ' : ''}(Last 365 Days)</h2>
            <ResponsiveContainer width="100%" height="85%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: COLORS.text }}
                  interval={30}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: COLORS.text }}
                  domain={['auto', 'auto']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {fundsData.map((_, index) => (
                  <Line
                    key={index}
                    type="monotone"
                    dataKey={`nav${index + 1}`}
                    name={`${historicalData[0][`name${index + 1}`]}`}
                    stroke={index === 0 ? COLORS.chart1 : COLORS.chart2}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toFixed(2)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for risk-return plot
const RiskReturnTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <p className="label">Date: {data.date}</p>
        <p style={{ color: COLORS.primary }}>Risk: {data.risk.toFixed(2)}%</p>
        <p style={{ color: COLORS.primary }}>Return: {data.return.toFixed(2)}%</p>
      </div>
    );
  }
  return null;
};

// Helper function for standard deviation
Math.std = function (arr) {
  const mean = arr.reduce((a, b) => a + b) / arr.length;
  return Math.sqrt(
    arr.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / arr.length
  );
};

export default MutualFund;
