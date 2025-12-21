import React from "react";
import SEO from "../components/SEO";
import {
  FaFileContract,
  FaHandshake,
  FaGavel,
  FaBalanceScale,
  FaCopyright,
  FaShieldAlt,
} from "react-icons/fa";

const TermsOfService = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      <SEO
        title="Terms of Service | Trivixa IT Solutions"
        description="Review the Terms of Service for engaging with Trivixa. Understand rights, responsibilities, payments, and IP ownership for your software projects."
        keywords="terms of service, service agreement, IT contract, software development terms, Trivixa legal"
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
              Legal Framework
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
              Terms of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Service
              </span>
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* --- Terms Content Card --- */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-[#F47C26] to-purple-500"></div>

            <div className="space-y-12">
              {/* Introduction */}
              <section>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-light">
                  Welcome to <strong>Trivixa IT Solutions</strong>. By engaging
                  our services for software development, consulting, or digital
                  transformation, you agree to be bound by these Terms of
                  Service. These terms govern the contractual relationship
                  between Trivixa ("we", "us") and the Client ("you").
                </p>
              </section>

              {/* 1. Scope of Services */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                    <FaHandshake className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    1. Scope of Services
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  Trivixa agrees to perform the services described in the
                  specific Project Proposal or Statement of Work (SOW) signed by
                  both parties. Services may include, but are not limited to:
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  <ListItem>Custom Software Development</ListItem>
                  <ListItem>UI/UX Design & Prototyping</ListItem>
                  <ListItem>Cloud Architecture Setup</ListItem>
                  <ListItem>IT Consulting & Strategy</ListItem>
                </ul>
              </section>

              {/* 2. Client Obligations */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-orange-50 dark:bg-[#F47C26]/10 text-[#F47C26] border border-orange-100 dark:border-[#F47C26]/20">
                    <FaFileContract className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    2. Client Obligations
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  To ensure project success, the Client agrees to:
                </p>
                <ul className="space-y-3">
                  <ListItem>
                    Provide necessary assets (logos, content, credentials) in a
                    timely manner.
                  </ListItem>
                  <ListItem>
                    Review and approve deliverables within the agreed timeframe
                    (typically 3-5 business days).
                  </ListItem>
                  <ListItem>
                    Designate a single point of contact for project
                    communication.
                  </ListItem>
                </ul>
              </section>

              {/* 3. Payments & Invoicing */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20">
                    <FaBalanceScale className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    3. Payments & Invoicing
                  </h2>
                </div>
                <div className="bg-gray-50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5 space-y-4">
                  <ListItem title="Milestones">
                    Payments are typically tied to project milestones (e.g., 30%
                    upfront, 40% beta, 30% launch).
                  </ListItem>
                  <ListItem title="Late Fees">
                    Invoices are due within 15 days of receipt. A late fee of 5%
                    may apply to overdue balances.
                  </ListItem>
                  <ListItem title="Refunds">
                    Deposits are non-refundable once work has commenced. Refunds
                    are not issued for completed milestones.
                  </ListItem>
                </div>
              </section>

              {/* 4. Intellectual Property */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
                    <FaCopyright className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    4. Intellectual Property (IP)
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Upon full payment of all invoices, Trivixa grants the Client{" "}
                  <strong className="text-gray-900 dark:text-white">
                    exclusive ownership
                  </strong>{" "}
                  of the final custom code, designs, and assets created for the
                  project. Trivixa retains the right to use generic code
                  libraries and frameworks developed prior to or during the
                  project for other clients.
                </p>

                {/* Visual Aid: IP Transfer */}
                <div className="mt-4 opacity-90 border border-gray-100 dark:border-white/10 rounded-xl overflow-hidden"></div>
              </section>

              {/* 5. Warranty & Support */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                    <FaShieldAlt className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    5. Warranty & Support
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                  We provide a standard{" "}
                  <strong className="text-gray-900 dark:text-white">
                    30-day bug-fix warranty
                  </strong>{" "}
                  after project launch. This covers technical errors in our
                  code. It does not cover issues caused by third-party API
                  changes, hosting server failures, or client modifications.
                  Extended support packages are available separately.
                </p>
              </section>

              {/* 6. Liability & Termination */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">
                    <FaGavel className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    6. Liability & Termination
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-gray-900 dark:text-white block mb-1">
                      Limitation of Liability:
                    </strong>
                    Trivixa shall not be liable for any indirect, incidental, or
                    consequential damages (including lost profits) arising from
                    the use of the software.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    <strong className="text-gray-900 dark:text-white block mb-1">
                      Termination:
                    </strong>
                    Either party may terminate the agreement with written notice
                    if the other party breaches material terms. The Client must
                    pay for all work completed up to the termination date.
                  </p>
                </div>
              </section>

              {/* 7. Contact Us */}
              <section className="border-t border-gray-200 dark:border-white/10 pt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  7. Contact & Legal Inquiries
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  For questions regarding these Terms or to request a formal
                  Service Agreement, please contact us:
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
                    href="mailto:info@trivixa.com"
                    className="inline-flex items-center gap-2 text-[#F47C26] font-bold hover:text-[#d5671f] transition-colors"
                  >
                    info@trivixa.com
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

export default TermsOfService;
