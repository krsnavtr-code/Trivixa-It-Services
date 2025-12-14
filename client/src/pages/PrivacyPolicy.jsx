import React from "react";
import SEO from "../components/SEO";
import { FaShieldAlt, FaLock, FaUserShield, FaServer } from "react-icons/fa";

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      <SEO
        title="Privacy Policy | Trivixa IT Solutions"
        description="Read Trivixa's Privacy Policy to understand how we collect, use, and protect your business data and personal information."
        keywords="privacy policy, data protection, GDPR, IT security, data handling, Trivixa policy"
      />

      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* --- Header --- */}
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[#F47C26] dark:bg-white/5 dark:border-white/10 dark:text-[#F47C26] text-xs font-bold uppercase tracking-wider shadow-sm dark:shadow-none">
              Legal
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Privacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Policy
              </span>
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm font-medium">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* --- Policy Content Card --- */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-[#F47C26] to-purple-500"></div>

            <div className="space-y-12">
              {/* Introduction */}
              <section>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  At <strong>Trivixa IT Solutions</strong>, we value your trust
                  and are committed to protecting your privacy. This policy
                  outlines how we handle data collected through our website,
                  software services, and client interactions. We adhere to
                  strict data protection standards to ensure the security of
                  your business intelligence and personal information.
                </p>
              </section>

              {/* 1. Information Collection */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                    <FaUserShield className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    1. Information We Collect
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We collect information to provide better services to our
                  clients:
                </p>
                <ul className="space-y-4">
                  <ListItem title="Personal Information">
                    Name, email address, phone number, and company details
                    provided via forms.
                  </ListItem>
                  <ListItem title="Project Data">
                    Technical specifications, business requirements, and assets
                    shared during consultations.
                  </ListItem>
                  <ListItem title="Technical Data">
                    IP address, browser type, and usage patterns to optimize our
                    website performance.
                  </ListItem>
                </ul>
              </section>

              {/* 2. Usage of Information */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-orange-50 dark:bg-[#F47C26]/10 text-[#F47C26] border border-orange-100 dark:border-[#F47C26]/20">
                    <FaServer className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    2. How We Use Your Data
                  </h2>
                </div>
                <ul className="space-y-4">
                  <ListItem>
                    To deliver and maintain our software solutions and services.
                  </ListItem>
                  <ListItem>
                    To communicate regarding project updates, invoices, and
                    support.
                  </ListItem>
                  <ListItem>
                    To improve our digital infrastructure and user experience.
                  </ListItem>
                  <ListItem>
                    To comply with legal obligations and enforce our agreements.
                  </ListItem>
                </ul>
              </section>

              {/* 3. Confidentiality & Security */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                    <FaLock className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    3. Security & Confidentiality
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                  We implement enterprise-grade security measures, including
                  encryption and secure servers, to protect your data. For
                  client projects, we are happy to sign a{" "}
                  <strong className="text-gray-900 dark:text-white">
                    Non-Disclosure Agreement (NDA)
                  </strong>{" "}
                  to ensure your intellectual property and trade secrets remain
                  strictly confidential.
                </p>
              </section>

              {/* 4. Third Parties */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pl-4 border-l-4 border-[#F47C26]">
                  4. Third-Party Services
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  We may employ third-party companies (e.g., cloud hosting
                  providers like AWS, payment gateways like Razorpay) to
                  facilitate our services. These parties have access to your
                  data only to perform specific tasks on our behalf and are
                  obligated not to disclose or use it for any other purpose.
                </p>
              </section>

              {/* 5. Contact Us */}
              <section className="border-t border-gray-200 dark:border-white/10 pt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  5. Contact Us
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  If you have any questions about this Privacy Policy or wish to
                  exercise your data rights, please contact us:
                </p>
                <address className="not-italic text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 p-8 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                  <strong className="text-gray-900 dark:text-white block mb-2 text-lg">
                    Trivixa IT Solutions
                  </strong>
                  <span className="block mb-1">H-161 BSI Sector-63</span>
                  <span className="block mb-4">
                    Noida, Gautam Budh Nagar, UP 201301
                  </span>
                  <a
                    href="mailto:info@firstvite.com"
                    className="inline-flex items-center gap-2 text-[#F47C26] font-bold hover:text-[#d5671f] transition-colors"
                  >
                    info@firstvite.com
                  </a>
                </address>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for List Items
const ListItem = ({ children, title }) => (
  <li className="flex items-start gap-4 text-gray-600 dark:text-gray-400 group">
    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F47C26] shrink-0 group-hover:scale-150 transition-transform"></span>
    <span className="leading-relaxed">
      {title && (
        <strong className="text-gray-900 dark:text-white block mb-1">
          {title}
        </strong>
      )}
      {children}
    </span>
  </li>
);

export default PrivacyPolicy;
