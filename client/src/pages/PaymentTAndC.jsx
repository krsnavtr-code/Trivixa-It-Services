import React from "react";
import SEO from "../components/SEO";
import {
  FaMoneyBillWave,
  FaShieldAlt,
  FaLock,
  FaGavel,
  FaExclamationTriangle,
  FaCheckCircle,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const PaymentTAndC = () => {
  const lastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      <SEO
        title="Payment Terms & Conditions | FirstVITE"
        description="Review our payment terms and conditions. Understand your rights and responsibilities when making payments on FirstVITE's learning platform."
        keywords="payment terms, payment conditions, refund policy, online payment terms, FirstVITE payment, course payment terms"
        og={{
          title: "Payment Terms & Conditions | FirstVITE",
          description:
            "Understand the terms and conditions governing payments on the FirstVITE platform.",
          type: "article",
        }}
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
              Financial Policy
            </span>
            <h1 className="mt-6 text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Payment Terms &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Conditions
              </span>
            </h1>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">
              Last updated: {lastUpdated}
            </p>
          </div>

          {/* --- Content Card --- */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-8 md:p-12 rounded-3xl shadow-xl dark:shadow-2xl relative overflow-hidden">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-[#F47C26] to-purple-500"></div>

            <div className="space-y-10">
              {/* Introduction */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                    <FaFileInvoiceDollar className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    General Provisions
                  </h2>
                </div>

                <ul className="space-y-4">
                  <ListItem icon={<FaMoneyBillWave />} title="Source of Funds">
                    By making this payment, I hereby confirm that the funds used
                    for this transaction belong solely to me and have been
                    lawfully earned through legitimate means. I am making this
                    payment voluntarily and of my own free will, without any
                    coercion, pressure, or compulsion.
                  </ListItem>

                  <ListItem
                    icon={<FaShieldAlt />}
                    title="Liability & Responsibility"
                  >
                    I fully understand and accept that I am solely responsible
                    for the source and usage of these funds. In the event of any
                    legal, financial, or other issues arising from this payment,
                    I acknowledge that the entire responsibility lies with me
                    and I shall not hold the company or its representatives
                    accountable.
                  </ListItem>

                  <ListItem icon={<FaLock />} title="Finality of Payment">
                    I understand that payments made are final and non-refundable
                    unless explicitly stated otherwise in a written agreement or
                    refund policy shared by the company. It is my responsibility
                    to review all relevant policies before proceeding.
                  </ListItem>

                  <ListItem icon={<FaGavel />} title="Legal Compliance">
                    I agree to comply with all applicable laws, regulations, and
                    policies related to digital payments and financial
                    transactions. I certify that this payment does not violate
                    any local, national, or international law.
                  </ListItem>
                </ul>
              </section>

              {/* Refund Policy Section */}
              <section className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FaExclamationTriangle className="text-red-500 dark:text-red-400 text-xl" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Refund Policy
                  </h3>
                </div>

                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                  <p className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                    <span>
                      Any <strong>scholarship admission</strong> fee is strictly
                      non-refundable.
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                    <span>
                      The <strong>registration amount</strong> is non-refundable
                      under any circumstances.
                    </span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                    <span>
                      Once a student gains access to the portal or is{" "}
                      <strong>allocated a batch</strong>, the fee becomes
                      non-refundable.
                    </span>
                  </p>
                </div>

                {/* Visual Context: Payment Process Flow */}
                <div className="mt-6 opacity-90 border border-red-200 dark:border-red-500/30 rounded-xl overflow-hidden bg-white/50 dark:bg-black/20 p-2 text-center text-xs text-gray-500"></div>
              </section>

              {/* Final Acknowledgment */}
              <section className="border-t border-gray-200 dark:border-white/10 pt-8">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <FaCheckCircle className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Acknowledgment
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      By completing this transaction, you acknowledge that you
                      have read, understood, and agreed to all the terms and
                      conditions mentioned above.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for List Items
const ListItem = ({ children, title, icon }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
    <div className="mt-1 text-[#F47C26] dark:text-[#F47C26] text-lg shrink-0">
      {icon}
    </div>
    <div>
      <strong className="text-gray-900 dark:text-white block mb-1 text-lg">
        {title}
      </strong>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
        {children}
      </p>
    </div>
  </div>
);

export default PaymentTAndC;
