import React from 'react';
import PortfolioNavbar from '../components/portfolio/PortfolioNavbar';
import PortfolioFooter from '../components/portfolio/PortfolioFooter';

const PortfolioLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PortfolioNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <PortfolioFooter />
    </div>
  );
};

export default PortfolioLayout;
