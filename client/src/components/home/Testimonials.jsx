import React from "react";
import { FaQuoteRight, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Vikram Malhotra",
    role: "CEO, FinTech Global",
    content:
      "Trivixa didn't just build our app; they engineered a scalable ecosystem. Their understanding of financial security and user experience is unmatched in the industry.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Founder, E-Com Pro",
    content:
      "We saw a 200% increase in conversions after the site redesign. The team is responsive, agile, and truly cares about the business outcome, not just the code.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Arjun Reddy",
    role: "CTO, NextGen Health",
    content:
      "Finding a team that understands HIPPA compliance and complex backend architecture is hard. Trivixa delivered flawlessly on both fronts.",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
    rating: 5,
  },
  {
    id: 4,
    name: "Emily Chen",
    role: "Director of Ops, LogisticsCo",
    content:
      "Their custom ERP solution automated 80% of our manual workflows. The ROI on this project was realized in less than 3 months.",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
  },
  {
    id: 5,
    name: "David Ross",
    role: "Product Manager, TechFlow",
    content:
      "The best part about working with Trivixa is their transparency. Weekly sprints, clear communication, and zero surprises at launch.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 4,
  },
  {
    id: 6,
    name: "Priya Patel",
    role: "Co-Founder, EdLearn",
    content:
      "We needed a robust LMS with live streaming capabilities. Trivixa executed the vision perfectly, handling thousands of concurrent users with ease.",
    image: "https://randomuser.me/api/portraits/women/29.jpg",
    rating: 5,
  },
];

const renderStars = (rating) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={`text-sm ${
            i < rating ? "text-[#F47C26]" : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Testimonials = () => {
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply dark:mix-blend-normal pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-200/40 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span className="px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 text-[#F47C26] text-xs font-bold uppercase tracking-wider">
            Client Success Stories
          </motion.span>
          <motion.h2
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Industry Leaders
            </span>
          </motion.h2>
          <motion.p
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Don't just take our word for it. See what founders, CTOs, and
            Product Managers have to say about working with Trivixa.
          </motion.p>
        </div>

        {/* Testimonial Grid */}
        <motion.div
          variants={containerVariants}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="group relative flex flex-col p-8 bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none dark:hover:bg-white/[0.07] dark:hover:border-[#F47C26]/30 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-8 text-4xl text-gray-100 dark:text-white/5 group-hover:text-orange-50 dark:group-hover:text-[#F47C26]/20 transition-colors duration-500">
                <FaQuoteRight />
              </div>

              {/* Content */}
              <div className="flex-grow mb-6 relative z-10">
                <div className="mb-4">{renderStars(item.rating)}</div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-white/10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F47C26] to-orange-600 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                    {item.name.split(" ").length > 1
                      ? `${item.name.split(" ")[0][0]}${
                          item.name.split(" ")[1][0]
                        }`
                      : item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F47C26] rounded-full flex items-center justify-center text-[8px] text-white">
                    <FaQuoteRight />
                  </div>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-bold text-sm group-hover:text-[#F47C26] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-500 text-xs uppercase tracking-wide font-semibold">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div transition={{ delay: 0.5 }} className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Want to be our next success story?
          </p>
          <a
            href="/contact"
            className="inline-block border-b border-[#F47C26] text-[#F47C26] font-bold pb-1 hover:text-gray-900 dark:hover:text-white hover:border-gray-900 dark:hover:border-white transition-all"
          >
            Start a Conversation
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
