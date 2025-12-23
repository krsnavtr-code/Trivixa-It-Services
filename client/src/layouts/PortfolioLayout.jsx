import React from "react";
import { Outlet } from "react-router-dom";
import PortfolioNavbar from "../components/portfolio/PortfolioNavbar";
import PortfolioFooter from "../components/portfolio/PortfolioFooter";

const PortfolioLayout = () => {
  const getBaseUrl = () => {
    if (window.location.hostname === "portfolio.trivixa.in") {
      return "/";
    }
    return "/portfolio";
  };

  return (
    // Updated dark mode background to match the Navbar's deep emerald theme
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#020e0a] transition-colors duration-500">
      <PortfolioNavbar baseUrl={getBaseUrl()} />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <PortfolioFooter baseUrl={getBaseUrl()} />
    </div>
  );
};

export default PortfolioLayout;
