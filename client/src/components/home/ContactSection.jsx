import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaCheck,
} from "react-icons/fa";

export default function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setDone(false), 5000);
    }, 1500);
  };

  return (
    <section className="relative py-28 bg-slate-50 dark:bg-[#0a0f2d] overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-orange-400/20 blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-indigo-400/20 blur-[140px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span className="inline-block px-5 py-1.5 rounded-full bg-orange-100 dark:bg-white/5 border border-orange-200 dark:border-white/10 text-[#F47C26] text-xs font-bold tracking-widest">
            CONTACT
          </motion.span>
          <motion.h2
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            Let’s Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
              Great
            </span>
          </motion.h2>
          <motion.p
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-gray-600 dark:text-gray-400"
          >
            Share your idea with us. Our team will reach out within 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            {[
              // {
              //   icon: <FaMapMarkerAlt />,
              //   title: "Office",
              //   text: "H-161 BSI Sector-63, Noida",
              // },
              {
                icon: <FaPhone />,
                title: "Phone",
                text: "+91 9084407615",
              },
              {
                icon: <FaEnvelope />,
                title: "Email",
                text: "info@trivixa.com",
              },
              {
                icon: <FaEnvelope />,
                title: "Email",
                text: "krishna.trivixa@gmail.com",
              },
            ].map((i, idx) => (
              <motion.div
                key={idx}
                transition={{ delay: idx * 0.1 }}
                className="group flex gap-5 p-6 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 hover:shadow-xl transition"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#F47C26] to-[#ff9e5e] text-white text-lg shadow-lg group-hover:scale-110 transition">
                  {i.icon}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    {i.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {i.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form */}
          <motion.div transition={{ delay: 0.2 }} className="lg:col-span-3">
            <div className="relative rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl p-8 md:p-10 shadow-2xl">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F47C26] via-indigo-500 to-purple-500" />

              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div key="done" className="text-center py-20">
                    <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                      <FaCheck className="text-green-600 dark:text-green-400 text-2xl" />
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                      Message Sent
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      We’ll contact you shortly.
                    </p>
                    <button
                      onClick={() => setDone(false)}
                      className="mt-8 px-6 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                    >
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        required
                        placeholder="Full Name"
                        className="input"
                      />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={onChange}
                        required
                        placeholder="Email Address"
                        className="input"
                      />
                    </div>
                    <input
                      name="subject"
                      value={form.subject}
                      onChange={onChange}
                      required
                      placeholder="Subject"
                      className="input"
                    />
                    <textarea
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={onChange}
                      required
                      placeholder="Your message"
                      className="input resize-none"
                    />

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#F47C26] to-[#d5671f] shadow-lg shadow-orange-500/30 disabled:opacity-70"
                    >
                      {loading ? (
                        "Sending…"
                      ) : (
                        <>
                          <FaPaperPlane /> Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Input styles moved to global CSS */}
      <style>{`
        .input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(243, 244, 246, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.08);
        }
        .dark .input {
          background: rgba(10, 15, 45, 0.6);
          border-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .input:focus {
          outline: none;
          border-color: #f47c26;
          box-shadow: 0 0 0 1px #f47c26;
        }
      `}</style>
    </section>
  );
}
