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
    <div className="min-h-screen bg-[#0a0f2d] text-white relative overflow-hidden">
      <SEO
        title="Privacy Policy | Trivixa IT Solutions"
        description="Read Trivixa's Privacy Policy to understand how we collect, use, and protect your business data and personal information."
        keywords="privacy policy, data protection, GDPR, IT security, data handling, Trivixa policy"
      />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none fixed"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#F47C26]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F47C26] text-xs font-bold uppercase tracking-wider">
              Legal
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
              Privacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Policy
              </span>
            </h1>
            <p className="mt-4 text-gray-400">Last updated: {lastUpdated}</p>
          </div>

          {/* Policy Content Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-[#F47C26] to-purple-500"></div>

            <div className="space-y-12">
              {/* Introduction */}
              <section>
                <p className="text-gray-300 leading-relaxed text-lg">
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <FaUserShield />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    1. Information We Collect
                  </h2>
                </div>
                <p className="text-gray-400 mb-4">
                  We collect information to provide better services to our
                  clients:
                </p>
                <ul className="space-y-3">
                  <ListItem>
                    <strong>Personal Information:</strong> Name, email address,
                    phone number, and company details provided via forms.
                  </ListItem>
                  <ListItem>
                    <strong>Project Data:</strong> Technical specifications,
                    business requirements, and assets shared during
                    consultations.
                  </ListItem>
                  <ListItem>
                    <strong>Technical Data:</strong> IP address, browser type,
                    and usage patterns to optimize our website performance.
                  </ListItem>
                </ul>
              </section>

              {/* 2. Usage of Information */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#F47C26]/10 text-[#F47C26]">
                    <FaServer />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    2. How We Use Your Data
                  </h2>
                </div>
                <ul className="space-y-3">
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                    <FaLock />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    3. Security & Confidentiality
                  </h2>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  We implement enterprise-grade security measures, including
                  encryption and secure servers, to protect your data. For
                  client projects, we are happy to sign a{" "}
                  <strong>Non-Disclosure Agreement (NDA)</strong> to ensure your
                  intellectual property and trade secrets remain strictly
                  confidential.
                </p>
              </section>

              {/* 4. Third Parties */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4">
                  4. Third-Party Services
                </h2>
                <p className="text-gray-400 mb-4">
                  We may employ third-party companies (e.g., cloud hosting
                  providers like AWS, payment gateways like Razorpay) to
                  facilitate our services. These parties have access to your
                  data only to perform specific tasks on our behalf and are
                  obligated not to disclose or use it for any other purpose.
                </p>
              </section>

              {/* 5. Contact Us */}
              <section className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  5. Contact Us
                </h2>
                <p className="text-gray-400 mb-6">
                  If you have any questions about this Privacy Policy or wish to
                  exercise your data rights, please contact us:
                </p>
                <address className="not-italic text-gray-300 bg-white/5 p-6 rounded-xl border border-white/10">
                  <strong className="text-white block mb-2">
                    Trivixa IT Solutions
                  </strong>
                  <span className="block mb-1">H-161 BSI Sector-63</span>
                  <span className="block mb-3">
                    Noida, Gautam Budh Nagar, UP 201301
                  </span>
                  <a
                    href="mailto:info@firstvite.com"
                    className="text-[#F47C26] hover:text-white transition-colors"
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
const ListItem = ({ children }) => (
  <li className="flex items-start gap-3 text-gray-400">
    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F47C26] shrink-0"></span>
    <span>{children}</span>
  </li>
);

export default PrivacyPolicy;
