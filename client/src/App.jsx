import React, { useEffect, useState, createContext, useContext } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { FaWifi, FaServer, FaRedo, FaPowerOff } from "react-icons/fa";

// --- Portfolio Components ---
import Portfolio from "./pages/portfolio/Portfolio.jsx";
import PortfolioLayout from "./layouts/PortfolioLayout";

// --- Contexts & Hooks ---
import useContactFormPopup from "./hooks/useContactFormPopup.jsx";

// --- Layouts & Common Components ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatButton from "./components/common/ChatButton";
import SocialMediaFloating from "./components/common/SocialMediaFloating";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./components/admin/AdminLayout";

// --- Public Pages ---
import Home from "./home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PaymentTAndC from "./pages/PaymentTAndC";
import ThankYouPage from "./pages/ThankYouPage";
import Unauthorized from "./pages/Unauthorized";
import SuspendedAccount from "./pages/SuspendedAccount";
import Faqs from "./pages/Faqs";

// --- Service Pages ---
import ServicesByCategory from "./pages/user/ServicesByCategory.jsx";
import AllCategories from "./pages/user/AllCategories";

// --- Auth Pages ---
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import Profile from "./pages/user/Profile";

// --- Admin Components & Pages ---
import AdminDashboard from "./components/admin/AdminDashboard";
import CategoriesList from "./pages/admin/Categories.jsx";
import CategoryForm from "./components/admin/CategoryForm.jsx";
import Users from "./pages/admin/Users.jsx";
import ContactsList from "./pages/admin/Contacts.jsx";
import MediaGallery from "./components/admin/MediaUploder.jsx";
import ImageGallery from "./pages/admin/MediaGallery.jsx";
import PaymentsList from "./pages/admin/PaymentsList";
import PaymentDetails from "./pages/admin/PaymentDetails";
import SendBrochure from "./components/admin/SendBrochure.jsx";
import SendProposal from "./components/admin/SendProposal";
import EmailRecords from "./components/admin/EmailRecords.jsx";
import FaqsPage from "./pages/admin/FaqsPage";
import Mailer from "./pages/admin/MailSender.jsx";

// --- Blog Components ---
import BlogListPage from "./pages/blog/BlogListPage";
import BlogDetailPage from "./pages/blog/BlogDetailPage";
import BlogPostList from "./pages/admin/Blog.jsx";
import BlogPostForm from "./components/admin/BlogForm.jsx";

import { ChatProvider } from "./context/ChatContext";

// ==========================================
// 🎨 UI COMPONENTS (Internal)
// ==========================================

// 1. High-Tech Loader
const TrivixaLoader = ({ message = "Initializing System..." }) => (
  <div className="fixed inset-0 z-[9999] bg-[#0a0f2d] flex flex-col items-center justify-center text-white overflow-hidden">
    {/* Background Grid */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F47C26]/10 rounded-full blur-[120px]"></div>

    {/* Spinner */}
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 border-4 border-[#F47C26]/30 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47C26] rounded-full animate-spin"></div>
      <div className="absolute inset-4 border-4 border-b-blue-500 rounded-full animate-spin-slow"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
      </div>
    </div>

    {/* Text */}
    <motion.h2
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      className="text-xl font-mono text-[#F47C26] tracking-widest uppercase"
    >
      {message}
    </motion.h2>
  </div>
);

// 2. System Status Screen (Offline/Error)
const SystemStatusScreen = ({ icon, title, message, onRetry, color }) => (
  <div className="min-h-screen bg-[#0a0f2d] flex items-center justify-center p-6 relative overflow-hidden">
    <div
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] ${color}/10 rounded-full blur-[120px]`}
    ></div>

    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl max-w-lg w-full text-center shadow-2xl"
    >
      <div
        className={`mx-auto w-20 h-20 rounded-full ${color}/20 flex items-center justify-center text-4xl ${color} mb-6`}
      >
        {icon}
      </div>
      <h1 className="text-3xl font-black text-white mb-3">{title}</h1>
      <p className="text-gray-400 mb-8 leading-relaxed">{message}</p>

      <button
        onClick={onRetry}
        className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-[#F47C26] font-lg rounded-xl hover:bg-[#d5671f] hover:scale-105 focus:outline-none ring-offset-2 focus:ring-2 ring-[#F47C26]"
      >
        <FaRedo className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
        System Retry
      </button>
    </motion.div>
  </div>
);

// ==========================================
// 🧩 THEME CONTEXT
// ==========================================
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ==========================================
// 🏗️ MAIN LAYOUT
// ==========================================
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHiddenRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname === "/suspended" ||
    location.pathname === "/unauthorized";

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white">
      <ScrollToTop />
      {!isHiddenRoute && <Navbar />}
      <main className={`flex-grow ${!isHiddenRoute ? "pt-16" : ""}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isHiddenRoute && <Footer />}
      <SocialMediaFloating />
      {!isHiddenRoute && <ChatButton />}
    </div>
  );
};

// ==========================================
// 🚀 APP COMPONENT
// ==========================================
function App({ isPortfolioSubdomain }) {
  const { ContactFormPopup } = useContactFormPopup();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverOnline, setServerOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsChecking(false);
    };

    const checkServerStatus = async () => {
      try {
        const response = await fetch("/api/health"); // Ensure this endpoint exists
        if (response.ok) setServerOnline(true);
        else setServerOnline(false);
      } catch (error) {
        setServerOnline(false);
      } finally {
        setIsChecking(false);
      }
    };

    if (navigator.onLine) checkServerStatus();
    else setIsChecking(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // --- Render States ---

  if (isChecking) return <TrivixaLoader message="Establishing Connection..." />;

  if (!isOnline) {
    return (
      <SystemStatusScreen
        icon={<FaWifi />}
        color="text-red-500 bg-red-500"
        title="Connection Lost"
        message="Unable to connect to the global network. Please verify your internet connection settings."
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Optional: You can uncomment this if you want to block the app completely when the backend is down
  if (!serverOnline) {
    return (
      <SystemStatusScreen
        icon={<FaServer />}
        color="text-yellow-500 bg-yellow-500"
        title="Server Maintenance"
        message="Our core systems are currently unreachable. Engineers have been notified. Please try again shortly."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <HelmetProvider>
      <ThemeProvider>
        <ChatProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#0a0f2d",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              },
              success: {
                iconTheme: { primary: "#10B981", secondary: "white" },
              },
              error: { iconTheme: { primary: "#EF4444", secondary: "white" } },
            }}
          />
          <ToastContainer theme="dark" />
          <ContactFormPopup />

          <Routes>
            {/* Public */}
            {!isPortfolioSubdomain ? (
              <>
                <Route
                  path="/"
                  element={
                    <MainLayout>
                      <Home />
                    </MainLayout>
                  }
                />
                <Route
                  path="/portfolio/*"
                  element={
                    <PortfolioLayout>
                      <Routes>
                        <Route index element={<Portfolio />} />
                        <Route
                          path="projects"
                          element={<div>Projects Page</div>}
                        />
                        <Route path="about" element={<div>About Page</div>} />
                        <Route
                          path="contact"
                          element={<div>Contact Page</div>}
                        />
                      </Routes>
                    </PortfolioLayout>
                  }
                />
              </>
            ) : (
              <Route
                path="/*"
                element={
                  <PortfolioLayout>
                    <Routes>
                      <Route index element={<Portfolio />} />
                      <Route
                        path="projects"
                        element={<div>Projects Page</div>}
                      />
                      <Route path="about" element={<div>About Page</div>} />
                      <Route path="contact" element={<div>Contact Page</div>} />
                    </Routes>
                  </PortfolioLayout>
                }
              />
            )}
            <Route
              path="/about"
              element={
                <MainLayout>
                  <About />
                </MainLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainLayout>
                  <Contact />
                </MainLayout>
              }
            />
            <Route
              path="/thank-you"
              element={
                <MainLayout>
                  <ThankYouPage />
                </MainLayout>
              }
            />

            {/* Legal */}
            <Route
              path="/privacy-policy"
              element={
                <MainLayout>
                  <PrivacyPolicy />
                </MainLayout>
              }
            />
            <Route
              path="/terms-of-service"
              element={
                <MainLayout>
                  <TermsOfService />
                </MainLayout>
              }
            />
            <Route
              path="/payment-t-and-c"
              element={
                <MainLayout>
                  <PaymentTAndC />
                </MainLayout>
              }
            />

            {/* Services */}
            <Route
              path="/services"
              element={
                <MainLayout>
                  <ServicesByCategory />
                </MainLayout>
              }
            />
            <Route
              path="/services/category/:categoryName"
              element={
                <MainLayout>
                  <ServicesByCategory />
                </MainLayout>
              }
            />
            <Route
              path="/categories"
              element={
                <MainLayout>
                  <AllCategories />
                </MainLayout>
              }
            />

            {/* Content */}
            <Route
              path="/blog"
              element={
                <MainLayout>
                  <BlogListPage />
                </MainLayout>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <MainLayout>
                  <BlogDetailPage />
                </MainLayout>
              }
            />
            <Route
              path="/faqs"
              element={
                <MainLayout>
                  <Faqs />
                </MainLayout>
              }
            />

            {/* Auth */}
            <Route
              path="/login"
              element={
                <MainLayout>
                  <LoginPage />
                </MainLayout>
              }
            />
            <Route
              path="/register"
              element={
                <MainLayout>
                  <RegisterPage />
                </MainLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            {/* Errors */}
            <Route
              path="/unauthorized"
              element={
                <MainLayout>
                  <Unauthorized />
                </MainLayout>
              }
            />
            <Route
              path="/suspended"
              element={
                <MainLayout>
                  <SuspendedAccount />
                </MainLayout>
              }
            />

            {/* Admin Routes */}
            <Route
              element={
                <PrivateRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route
                path="/admin"
                element={<Navigate to="dashboard" replace />}
              />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/admin/categories" element={<CategoriesList />} />
              <Route path="/admin/categories/new" element={<CategoryForm />} />
              <Route
                path="/admin/categories/:id/edit"
                element={<CategoryForm />}
              />

              <Route path="/admin/blog" element={<BlogPostList />} />
              <Route path="/admin/blog/new" element={<BlogPostForm />} />
              <Route path="/admin/blog/edit/:id" element={<BlogPostForm />} />

              <Route path="/admin/media-gallery" element={<ImageGallery />} />
              <Route
                path="/admin/media-gallery/upload"
                element={<MediaGallery />}
              />

              <Route path="/admin/mail-sender" element={<Mailer />} />
              <Route
                path="/admin/mail-sender/brochure"
                element={<SendBrochure />}
              />
              <Route
                path="/admin/mail-sender/proposal"
                element={<SendProposal />}
              />
              <Route
                path="/admin/mail-sender/email-records"
                element={<EmailRecords />}
              />

              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/inquiries" element={<ContactsList />} />
              <Route path="/admin/payments" element={<PaymentsList />} />
              <Route path="/admin/payments/:id" element={<PaymentDetails />} />
              <Route path="/admin/faqs" element={<FaqsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/unauthorized" replace />} />
          </Routes>
        </ChatProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
export default App;
