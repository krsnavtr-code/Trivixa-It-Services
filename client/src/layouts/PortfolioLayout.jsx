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
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <PortfolioNavbar baseUrl={getBaseUrl()} />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <PortfolioFooter baseUrl={getBaseUrl()} />
    </div>
  );
};

export default PortfolioLayout;
