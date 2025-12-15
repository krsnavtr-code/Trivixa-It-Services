import React, { useEffect, useState, createContext, useContext } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Contexts & Hooks ---
import { useAuth } from "./contexts/AuthContext"; // Assuming you have this
import useContactFormPopup from "./hooks/useContactFormPopup.jsx";

// --- Layouts & Common Components ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ChatButton from "./components/common/ChatButton";
import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./components/admin/AdminLayout";

// --- Public Pages ---
import Home from "./home/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import PaymentTAndC from "./pages/PaymentTAndC";
import ThankYouPage from "./pages/ThankYouPage";
import Careers from "./pages/Careers";
import Unauthorized from "./pages/Unauthorized";
import SuspendedAccount from "./pages/SuspendedAccount";

// --- Service & Course Pages ---
import ServicesByCategory from "./pages/user/ServicesByCategory.jsx";
import AllCategories from "./pages/user/AllCategories";
import CourseDetail from "./pages/user/CourseDetail";
import FreeCourses from "./pages/FreeCourses";
import CorporateTraining from "./pages/user/CorporateTraining";

// --- Auth Pages ---
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// --- Admin Components & Pages ---
import AdminDashboard from "./components/admin/AdminDashboard";
import CategoriesList from "./components/admin/categories/CategoriesList";
import CategoryForm from "./components/admin/categories/CategoryForm";
import CoursesList from "./components/admin/services/CoursesList";
import CourseForm from "./components/admin/services/CourseForm";
import Users from "./components/admin/Users";
import ContactsList from "./components/admin/ContactsList";
import ManageFAQs from "./pages/admin/ManageFAQs";
import MediaGallery from "./pages/admin/MediaGallery";
import ImageGallery from "./components/admin/ImageGallery";
import ImageUploadDemo from "./pages/admin/ImageUploadDemo";
import AdminEnrollments from "./pages/admin/Enrollments";
import PaymentsList from "./pages/admin/PaymentsList";
import PaymentDetails from "./pages/admin/PaymentDetails";
import SendBrochure from "./pages/admin/SendBrochure";
import SendProposal from "./pages/admin/SendProposal";
import EmailRecords from "./pages/admin/EmailRecords";
import CandidatesPage from "./pages/admin/CandidatesPage.jsx";

// --- Blog Components ---
import BlogListPage from "./pages/blog/BlogListPage";
import BlogDetailPage from "./pages/blog/BlogDetailPage";
import BlogPostList from "./pages/admin/BlogListPage";
import BlogPostForm from "./pages/admin/BlogPostForm";

// --- Theme Context Setup ---
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check local storage or system preference
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// --- Main Layout Component ---
const MainLayout = ({ children }) => {
  const location = useLocation();

  // Define routes where Navbar/Footer should be hidden
  // Note: Admin routes are handled by their own layout, but we check here just in case
  const isHiddenRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === "/suspended" ||
    location.pathname === "/unauthorized";

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white">
      <ScrollToTop />

      {!isHiddenRoute && <Navbar />}

      <main className={`flex-grow ${!isHiddenRoute ? "pt-16" : ""}`}>
        {children}
      </main>

      {!isHiddenRoute && <Footer />}
      {!isHiddenRoute && <ChatButton />}
    </div>
  );
};

function App() {
  const { ContactFormPopup } = useContactFormPopup();

  return (
    <HelmetProvider>
      <ThemeProvider>
        {/* Global Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#333",
              color: "#fff",
              zIndex: 9999,
            },
            success: {
              iconTheme: { primary: "#10B981", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "white" },
            },
          }}
        />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />

        {/* Global Popup */}
        <ContactFormPopup />

        <Routes>
          {/* ====================
              PUBLIC ROUTES 
          ==================== */}

          {/* Landing & Info */}
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
            path="/faq"
            element={
              <MainLayout>
                <FAQPage />
              </MainLayout>
            }
          />
          <Route
            path="/career"
            element={
              <MainLayout>
                <Careers />
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

          {/* Services & Courses */}
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
          <Route
            path="/course/:id"
            element={
              <MainLayout>
                <CourseDetail />
              </MainLayout>
            }
          />
          <Route
            path="/free-courses"
            element={
              <MainLayout>
                <FreeCourses />
              </MainLayout>
            }
          />
          <Route
            path="/corporate-training"
            element={
              <MainLayout>
                <CorporateTraining />
              </MainLayout>
            }
          />

          {/* Blog */}
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

          {/* ====================
              AUTH ROUTES 
          ==================== */}
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

          {/* ====================
              ADMIN ROUTES (PROTECTED)
          ==================== */}
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

            {/* Project/Services Management */}
            <Route path="/admin/services" element={<CoursesList />} />
            <Route
              path="/admin/services/new"
              element={<CourseForm isEdit={false} />}
            />
            <Route
              path="/admin/services/:id/edit"
              element={<CourseForm isEdit={true} />}
            />
            <Route path="/admin/course/:id" element={<CourseDetail />} />

            {/* Category Management */}
            <Route path="/admin/categories" element={<CategoriesList />} />
            <Route path="/admin/categories/new" element={<CategoryForm />} />
            <Route
              path="/admin/categories/:id/edit"
              element={<CategoryForm />}
            />

            {/* Content Management */}
            <Route path="/admin/blog" element={<BlogPostList />} />
            <Route path="/admin/blog/new" element={<BlogPostForm />} />
            <Route path="/admin/blog/edit/:id" element={<BlogPostForm />} />
            <Route path="/admin/faqs" element={<ManageFAQs />} />
            <Route path="/admin/image-gallery" element={<ImageGallery />} />
            <Route path="/admin/media" element={<MediaGallery />} />
            <Route path="/admin/image-upload" element={<ImageUploadDemo />} />

            {/* CRM & Sales */}
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/candidates" element={<CandidatesPage />} />
            <Route path="/admin/contacts" element={<ContactsList />} />
            <Route path="/admin/enrollments" element={<AdminEnrollments />} />
            <Route path="/admin/payments" element={<PaymentsList />} />
            <Route path="/admin/payments/:id" element={<PaymentDetails />} />

            {/* Communications */}
            <Route path="/admin/email-records" element={<EmailRecords />} />
            <Route path="/admin/send-brochure" element={<SendBrochure />} />
            <Route path="/admin/send-proposal" element={<SendProposal />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
