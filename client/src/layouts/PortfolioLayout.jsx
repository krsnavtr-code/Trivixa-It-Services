import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PortfolioNavbar from "../components/portfolio/PortfolioNavbar";
import PortfolioFooter from "../components/portfolio/PortfolioFooter";

const PortfolioLayout = ({ children }) => {
  const location = useLocation();

  // Ensure we're using the correct base URL for navigation
  const getBaseUrl = () => {
    if (window.location.hostname === "portfolio.trivixa.in") {
      return "/";
    }
    return "/portfolio";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PortfolioNavbar baseUrl={getBaseUrl()} />
      <main className="flex-grow pt-16">
        {" "}
        {/* Add padding top for fixed navbar */}
        {children}
      </main>
      <PortfolioFooter baseUrl={getBaseUrl()} />
    </div>
  );
};

export default PortfolioLayout;
