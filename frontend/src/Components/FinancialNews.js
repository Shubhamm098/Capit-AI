import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FinancialNews.css';

const FinancialNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using Alpha Vantage API for financial news
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=financial_markets&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
        );
        setNews(response.data.feed.slice(0, 12)); // Get first 12 news items
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleArticleClick = (article) => {
    setSelectedArticle(selectedArticle?.title === article.title ? null : article);
  };

  if (loading) return (
    <div className="news-loading">
      <div className="loading-spinner"></div>
      <p>Loading financial news...</p>
    </div>
  );

  if (error) return <div className="news-error">{error}</div>;

  return (
    <div className="financial-news-section">
      <div className="news-header">
        <h2>Latest Financial News</h2>
        <p className="subtitle">Stay updated with the latest market insights and financial trends</p>
      </div>

      <div className="news-grid">
        {news.map((article, index) => (
          <div 
            key={index} 
            className={`news-card ${selectedArticle?.title === article.title ? 'expanded' : ''}`}
            onClick={() => handleArticleClick(article)}
          >
            <div className="news-card-content">
              <div className="news-image-container">
                <img 
                  src={article.banner_image || '/default-news-image.jpg'} 
                  alt={article.title}
                  className="news-image"
                  onError={(e) => {
                    e.target.src = '/default-news-image.jpg';
                  }}
                />
                <div className="news-category">{article.category}</div>
              </div>
              <div className="news-text">
                <h3>{article.title}</h3>
                <p className="news-preview">{article.summary}</p>
                <div className="news-metadata">
                  <span className="news-source">{article.source}</span>
                  <span className="news-date">
                    {new Date(article.time_published).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {selectedArticle?.title === article.title && (
              <div className="news-details">
                <p>{article.summary}</p>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="read-more-btn"
                >
                  Read Full Article
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinancialNews;
