import React from "react";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaCode,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";

const FeaturedResources = () => {
  // Mock Data relevant to Trivixa (IT Agency)
  const resources = [
    {
      id: 1,
      title: "Full-Stack React Mastery",
      author: "Trivixa Academy",
      price: "₹2999",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Development",
      level: "Advanced",
    },
    {
      id: 2,
      title: "AI & Machine Learning 101",
      author: "Trivixa Data Lab",
      price: "₹3499",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Data Science",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "AWS Cloud Architecture",
      author: "Trivixa Cloud Team",
      price: "₹4999",
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Cloud Computing",
      level: "Expert",
    },
    {
      id: 4,
      title: "UI/UX Design Systems",
      author: "Trivixa Creative Studio",
      price: "₹2499",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      category: "Design",
      level: "Beginner",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-[#F47C26] text-xs" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStar key={i} className="text-[#F47C26] text-xs opacity-50" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-600 text-xs" />);
      }
    }
    return stars;
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="relative py-24 bg-[#0a0f2d] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F47C26]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-bold uppercase tracking-wider"
          >
            Knowledge Hub
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-3xl md:text-5xl font-extrabold text-white"
          >
            Master the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
              Future of Tech
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Premium courses and resources curated by Trivixa's top engineers and
            designers.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {resources.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#F47C26]/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f2d] via-transparent to-transparent opacity-80"></div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-[#0a0f2d]/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-colors">
                  <FaHeart className="text-sm" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      item.level === "Beginner"
                        ? "border-green-500/30 text-green-400 bg-green-500/10"
                        : item.level === "Intermediate"
                        ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10"
                        : "border-red-500/30 text-red-400 bg-red-500/10"
                    }`}
                  >
                    {item.level}
                  </span>
                  <div className="flex items-center gap-1">
                    {renderStars(item.rating)}
                    <span className="text-[10px] text-gray-500 ml-1">
                      ({item.rating})
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-[#F47C26] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs mb-4">by {item.author}</p>

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xl font-bold text-white">
                    {item.price}
                  </span>
                  <button className="px-4 py-2 bg-white/5 hover:bg-[#F47C26] text-white text-xs font-bold rounded-lg border border-white/10 hover:border-[#F47C26] transition-all duration-300 flex items-center gap-2 group/btn">
                    Enroll{" "}
                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-3 bg-transparent border border-[#F47C26] text-[#F47C26] hover:bg-[#F47C26] hover:text-white font-bold rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(244,124,38,0.2)] hover:shadow-[0_0_25px_rgba(244,124,38,0.4)]">
            Explore All Resources
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedResources;
