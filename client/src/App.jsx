import React, { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";
import { FaWifi, FaServer, FaRedo } from "react-icons/fa";
import { ThemeProvider } from "./context/ThemeContext.jsx";

// --- Contexts ---
import { ChatProvider } from "./context/ChatContext";
import useContactFormPopup from "./hooks/useContactFormPopup.jsx";

// --- Layouts ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatButton from "./components/common/ChatButton";
import SocialMediaFloating from "./components/common/SocialMediaFloating";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./components/admin/AdminLayout";
import PortfolioLayout from "./layouts/PortfolioLayout"; // Ensure this exists

// --- Pages (Public) ---
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

// --- Pages (Services/User) ---
import AllCategories from "./pages/user/AllCategories";
import Profile from "./pages/user/Profile";
import Services from "./pages/user/Services.jsx";
import ServiceDetail from "./pages/user/ServiceDetail.jsx";
import WebServices from "./pages/WebServices.jsx";
import AndroidServices from "./pages/AndroidServices.jsx";
import Technologies from "./pages/Technologies.jsx";
import Pricing from "./pages/Pricing.jsx";
import WeServed from "./pages/WeServed.jsx";


// --- Pages (Auth) ---
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// --- Pages (Admin) ---
import AdminDashboard from "./components/admin/AdminDashboard";
import CategoriesList from "./pages/admin/Categories.jsx";
import CategoryForm from "./components/admin/CategoryForm.jsx";
import SubcategoriesList from "./pages/admin/SubCategories.jsx";
import SubCategoryForm from "./components/admin/SubCategoryForm.jsx";
import ProjectList from "./pages/admin/ProjectList";
import ProjectForm from "./components/admin/ProjectForm.jsx";
import Users from "./pages/admin/Users.jsx";
import ContactsList from "./pages/admin/Contacts.jsx";
import MediaGallery from "./components/admin/MediaUploder.jsx";
import MediaTags from "./pages/admin/MediaTags.jsx";
import ImageGallery from "./pages/admin/MediaGallery.jsx";
import PaymentsList from "./pages/admin/PaymentsList";
import PaymentDetails from "./pages/admin/PaymentDetails";
import SendBrochure from "./components/admin/SendBrochure.jsx";
import SendProposal from "./components/admin/SendProposal";
import EmailRecords from "./components/admin/EmailRecords.jsx";
import FaqsPage from "./pages/admin/FaqsPage";
import Mailer from "./pages/admin/MailSender.jsx";
import BlogListPage from "./pages/blog/BlogListPage";
import BlogDetailPage from "./pages/blog/BlogDetailPage";
import BlogPostList from "./pages/admin/Blog.jsx";
import BlogPostForm from "./components/admin/BlogForm.jsx";

// ==========================================
// 🎨 Import Portfolio Pages ---
// ==========================================

import PHome from "./pages/portfolio/PHome.jsx";
import PAbout from "./pages/portfolio/About.jsx";
import PContact from "./pages/portfolio/Contact.jsx";
import PWork from "./pages/portfolio/Work.jsx";

// ==========================================
// 🎨 UI COMPONENTS (Internal)
// ==========================================

// 1. High-Tech Loader
const TrivixaLoader = ({ message = "Initializing System..." }) => (
  <div className="fixed inset-0 z-[9999] bg-[#0a0f2d] flex flex-col items-center justify-center text-white overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 border-4 border-[#F47C26]/30 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-t-[#F47C26] rounded-full animate-spin"></div>
      <div className="absolute inset-4 border-4 border-b-blue-500 rounded-full animate-spin-slow"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
      </div>
    </div>
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

// 2. System Status Screen
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
        <FaRedo className="mr-2 group-hover:rotate-180 transition-transform duration-500" />{" "}
        System Retry
      </button>
    </motion.div>
  </div>
);

// ==========================================
// 🏗️ MAIN LAYOUT
// ==========================================
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isHiddenRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
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
function App() {
  const { ContactFormPopup } = useContactFormPopup();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverOnline, setServerOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // --- SUBDOMAIN LOGIC ---
  const hostname = window.location.hostname;
  const isPortfolioSubdomain = hostname.startsWith("portfolio.");

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setIsChecking(false);
    };

    const checkServerStatus = async () => {
      try {
        const response = await fetch("/api/health");
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

  if (isChecking) return <TrivixaLoader message="Establishing Connection..." />;
  if (!isOnline)
    return (
      <SystemStatusScreen
        icon={<FaWifi />}
        color="text-red-500 bg-red-500"
        title="Connection Lost"
        message="Unable to connect to the global network."
        onRetry={() => window.location.reload()}
      />
    );

  // Wrap the entire app with ThemeProvider
  const AppContent = () => (
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
          {/* ==========================================================
                BRANCH 1: PORTFOLIO SUBDOMAIN (portfolio.trivixa.in)
               ========================================================== */}
          {isPortfolioSubdomain && (
            <>
              <Route path="/" element={<PortfolioLayout />}>
                <Route index element={<PHome />} />
                <Route path="projects" element={<PWork />} />
                <Route path="about" element={<PAbout />} />
                <Route path="contact" element={<PContact />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {/* ==========================================================
                BRANCH 2: MAIN SITE (trivixa.in)
               ========================================================== */}
          {!isPortfolioSubdomain && (
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

              {/* Services */}
              <Route
                path="/services"
                element={
                  <MainLayout>
                    <Services />
                  </MainLayout>
                }
              />
              <Route
                path="/services/:slug"
                element={
                  <MainLayout>
                    <ServiceDetail />
                  </MainLayout>
                }
              />
              <Route
                path="/web-services"
                element={
                  <MainLayout>
                    <WebServices />
                  </MainLayout>
                }
              />
              <Route
                path="/android-services"
                element={
                  <MainLayout>
                    <AndroidServices />
                  </MainLayout>
                }
              />
              <Route
                path="/technologies"
                element={
                  <MainLayout>
                    <Technologies />
                  </MainLayout>
                }
              />
              <Route
                path="/packages"
                element={
                  <MainLayout>
                    <Pricing />
                  </MainLayout>
                }
              />
              <Route
                path="/we-serve"
                element={
                  <MainLayout>
                    <WeServed />
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

              {/* System Pages */}
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
                <Route
                  path="/admin/categories/new"
                  element={<CategoryForm />}
                />
                <Route
                  path="/admin/categories/:id/edit"
                  element={<CategoryForm />}
                />
                <Route
                  path="/admin/subcategories"
                  element={<SubcategoriesList />}
                />
                <Route
                  path="/admin/subcategories/new"
                  element={<SubCategoryForm />}
                />
                <Route
                  path="/admin/subcategories/:id/edit"
                  element={<SubCategoryForm />}
                />
                <Route path="/admin/projects" element={<ProjectList />} />
                <Route path="/admin/projects/new" element={<ProjectForm />} />
                <Route
                  path="/admin/projects/:id/edit"
                  element={<ProjectForm />}
                />

                <Route path="/admin/blog" element={<BlogPostList />} />
                <Route path="/admin/blog/new" element={<BlogPostForm />} />
                <Route path="/admin/blog/edit/:id" element={<BlogPostForm />} />
                <Route path="/admin/media-gallery" element={<ImageGallery />} />
                <Route
                  path="/admin/media-gallery/upload"
                  element={<MediaGallery />}
                />
                <Route path="/admin/media/tags" element={<MediaTags />} />
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
                <Route
                  path="/admin/payments/:id"
                  element={<PaymentDetails />}
                />
                <Route path="/admin/faqs" element={<FaqsPage />} />
              </Route>

              <Route
                path="*"
                element={<Navigate to="/unauthorized" replace />}
              />
            </>
          )}
        </Routes>
      </ChatProvider>
    </ThemeProvider>
  );

  return (
    <HelmetProvider>
      <AppContent />
    </HelmetProvider>
  );
}

export default App;
