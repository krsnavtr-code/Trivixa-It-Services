import React from "react";
import SEO from "../components/SEO";
import {
  FaFileContract,
  FaHandshake,
  FaGavel,
  FaBalanceScale,
} from "react-icons/fa";

const TermsOfService = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0a0f2d] text-white relative overflow-hidden">
      <SEO
        title="Terms of Service | Trivixa IT Solutions"
        description="Review the Terms of Service for engaging with Trivixa. Understand rights, responsibilities, payments, and IP ownership for your software projects."
        keywords="terms of service, service agreement, IT contract, software development terms, Trivixa legal"
      />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none fixed"></div>
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#F47C26]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#F47C26] text-xs font-bold uppercase tracking-wider">
              Legal
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-white">
              Terms of{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Service
              </span>
            </h1>
            <p className="mt-4 text-gray-400">Last updated: {lastUpdated}</p>
          </div>

          {/* Terms Content Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-[#F47C26] to-purple-500"></div>

            <div className="space-y-12">
              {/* Introduction */}
              <section>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Welcome to <strong>Trivixa IT Solutions</strong>. By engaging
                  our services for software development, consulting, or digital
                  transformation, you agree to be bound by these Terms of
                  Service. These terms govern the contractual relationship
                  between Trivixa ("we", "us") and the Client ("you").
                </p>
              </section>

              {/* 1. Scope of Services */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <FaHandshake />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    1. Scope of Services
                  </h2>
                </div>
                <p className="text-gray-400 mb-4">
                  Trivixa agrees to perform the services described in the
                  specific Project Proposal or Statement of Work (SOW) signed by
                  both parties. Services may include, but are not limited to:
                </p>
                <ul className="space-y-3">
                  <ListItem>Custom Software & Web Development</ListItem>
                  <ListItem>UI/UX Design & Prototyping</ListItem>
                  <ListItem>Cloud Infrastructure Setup & Maintenance</ListItem>
                  <ListItem>IT Consulting & Strategy</ListItem>
                </ul>
              </section>

              {/* 2. Client Obligations */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-[#F47C26]/10 text-[#F47C26]">
                    <FaFileContract />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    2. Client Obligations
                  </h2>
                </div>
                <p className="text-gray-400 mb-4">
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                    <FaBalanceScale />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    3. Payments & Invoicing
                  </h2>
                </div>
                <ul className="space-y-3">
                  <ListItem>
                    <strong>Milestones:</strong> Payments are typically tied to
                    project milestones (e.g., 30% upfront, 40% beta, 30%
                    launch).
                  </ListItem>
                  <ListItem>
                    <strong>Late Fees:</strong> Invoices are due within 15 days
                    of receipt. A late fee of 5% may apply to overdue balances.
                  </ListItem>
                  <ListItem>
                    <strong>Refunds:</strong> Deposits are non-refundable once
                    work has commenced. Refunds are not issued for completed
                    milestones.
                  </ListItem>
                </ul>
              </section>

              {/* 4. Intellectual Property */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4">
                  4. Intellectual Property (IP)
                </h2>
                <p className="text-gray-400 mb-4">
                  Upon full payment of all invoices, Trivixa grants the Client{" "}
                  <strong>exclusive ownership</strong> of the final custom code,
                  designs, and assets created for the project. Trivixa retains
                  the right to use generic code libraries and frameworks
                  developed prior to or during the project for other clients.
                </p>
              </section>

              {/* 5. Warranty & Support */}
              <section>
                <h2 className="text-xl font-bold text-white mb-4">
                  5. Warranty & Support
                </h2>
                <p className="text-gray-400 mb-4">
                  We provide a standard <strong>30-day bug-fix warranty</strong>{" "}
                  after project launch. This covers technical errors in our
                  code. It does not cover issues caused by third-party API
                  changes, hosting server failures, or client modifications.
                  Extended support packages are available separately.
                </p>
              </section>

              {/* 6. Liability & Termination */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <FaGavel />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    6. Liability & Termination
                  </h2>
                </div>
                <p className="text-gray-400 mb-4">
                  <strong>Limitation of Liability:</strong> Trivixa shall not be
                  liable for any indirect, incidental, or consequential damages
                  (including lost profits) arising from the use of the software.
                </p>
                <p className="text-gray-400">
                  <strong>Termination:</strong> Either party may terminate the
                  agreement with written notice if the other party breaches
                  material terms. The Client must pay for all work completed up
                  to the termination date.
                </p>
              </section>

              {/* 7. Contact Us */}
              <section className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-bold text-white mb-4">
                  7. Contact & Legal Inquiries
                </h2>
                <p className="text-gray-400 mb-6">
                  For questions regarding these Terms or to request a formal
                  Service Agreement, please contact us:
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

export default TermsOfService;
