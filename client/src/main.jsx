import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Check if we're on the portfolio subdomain or local development
const isPortfolioSubdomain = false;

// A loading component to show while translations are being loaded
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingFallback />}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter basename={isPortfolioSubdomain ? "/" : "/"}>
          <HelmetProvider>
            <AuthProvider>
              <div
                className={`${
                  !isPortfolioSubdomain
                    ? "dark:bg-slate-900 dark:text-white"
                    : ""
                }`}
              >
                <App isPortfolioSubdomain={isPortfolioSubdomain} />
              </div>
            </AuthProvider>
          </HelmetProvider>
        </BrowserRouter>
      </I18nextProvider>
    </Suspense>
  </React.StrictMode>
);
