import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Chatbot from './Components/Chatbot';

// Import components
import Header from './Components/Header';
import Footer from './Components/Footer';
import ServicesSection from './Components/ServicesSection';
import ProjectsSection from './Components/ProjectsSection';
import ContactSection from './Components/ContactSection';
import BlogSection from './Components/BlogSection';
import HeroSection from './Components/HeroSection';
import BenefitsSection from './Components/BenefitsSection';
import FAQSection from './Components/FAQSection';
import AboutUsSection from './Components/AboutUsSection';
import FinancialNews from './Components/FinancialNews';
import MutualFund from './Components/MutualFunds';
import TaxOptimization from './Components/TaxOptimization';
import FinancialData from './Components/FinancialData';
import NewsPage from './Components/NewsPage';

// Create a separate component for the news section on home page
const HomeNewsSection = () => {
  return (
    <div className="home-news-section">
      {/* Your existing news section for home page */}
      <BlogSection />
    </div>
  );
};

function App() {
  return (
    <Router>
      <>
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection/>
              <ServicesSection/>
              {/* <HomeNewsSection/>  */}
              <FAQSection/>
              <AboutUsSection/>
              <Footer/>
              {/* <MutualFund/> */}
            </>
          } />
          <Route path="/tax-optimization" element={<TaxOptimization />} />
          <Route path="/mutual-funds" element={<MutualFund />} />
          <Route path="/news" element={<NewsPage />} />
        </Routes>
        <Chatbot />
      </>
    </Router>
  );
}

export default App;
