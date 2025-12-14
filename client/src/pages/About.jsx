import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import {
  FaRocket,
  FaLightbulb,
  FaUsers,
  FaShieldAlt,
  FaCode,
  FaLinkedinIn,
  FaTwitter,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function About() {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const teamMembers = [
    {
      name: "Sachin Sharma",
      role: "SEO Strategist",
      bio: "Driving organic growth and digital visibility for enterprise clients.",
      image: "/images/team-1.jpg",
    },
    {
      name: "Krishna Avtar",
      role: "Lead Full Stack Dev",
      bio: "Architecting scalable cloud solutions and robust backend systems.",
      image: "/images/team-5.jpg",
    },
    {
      name: "Ritik Kumar",
      role: "Tech Content Lead",
      bio: "Translating complex code logic into compelling user narratives.",
      image: "/images/team-3.jpg",
    },
    {
      name: "Sudev Mohan",
      role: "UI/UX Designer",
      bio: "Crafting intuitive digital experiences that delight users.",
      image: "/images/team-4.jpg",
    },
    {
      name: "Kiran Rawat",
      role: "Digital Marketing",
      bio: "Executing data-driven campaigns to maximize ROI.",
      image: "/images/team-2.jpg",
    },
    {
      name: "Mohit Rajput",
      role: "Frontend Developer",
      bio: "Specializing in React.js and modern interactive interfaces.",
      image: "/images/team-6.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden text-gray-900 dark:text-white relative transition-colors duration-500">
      <SEO
        title="About Us | Trivixa IT Solutions"
        description="Learn about Trivixa's mission to drive digital transformation. Discover our story, values, and the expert team behind our innovative IT solutions."
        keywords="about Trivixa, IT agency, software development, digital transformation, web development team"
        og={{
          title: "About Trivixa - Innovating Digital Futures",
          description:
            "We are a team of architects, developers, and strategists building the future of tech.",
          type: "website",
        }}
      />

      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      {/* --- Hero Section --- */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[#F47C26] dark:bg-white/5 dark:border-white/10 dark:text-[#F47C26] text-xs font-bold uppercase tracking-wider mb-6 inline-block shadow-sm dark:shadow-none">
              Our Story
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white">
              We Are{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Trivixa
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Bridging the gap between complex business challenges and elegant
              digital solutions. We don't just write code; we engineer growth.
            </p>

            <div className="mt-12 flex justify-center opacity-90"></div>
          </motion.div>
        </div>
      </section>

      {/* --- Narrative Section --- */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            {/* Left Column: Text */}
            <div className="space-y-10">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                  Innovating the Future
                </h2>
                <div className="w-16 h-1 bg-[#F47C26] mb-6"></div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  Trivixa began with a clear purpose: to deliver
                  enterprise-grade IT solutions that are accessible, scalable,
                  and future-proof. Backed by a passionate team of architects
                  and developers, we are committed to driving digital
                  transformation for businesses of all sizes.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Our Mission
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  To empower organizations with technology that automates
                  workflows, enhances user engagement, and unlocks new revenue
                  streams.
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 opacity-90"></div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
              >
                {[
                  { icon: <FaCode />, text: "Modern Tech Stack" },
                  { icon: <FaRocket />, text: "Agile Delivery" },
                  { icon: <FaShieldAlt />, text: "Secure Architecture" },
                  { icon: <FaUsers />, text: "Client-Centric" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-xl shadow-sm dark:shadow-none"
                  >
                    <span className="text-[#F47C26]">{item.icon}</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {item.text}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Visual Cards (Stats) */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="space-y-4 mt-8">
                <StatCard
                  number="5+"
                  label="Years Experience"
                  color="text-[#F47C26]"
                />
                <StatCard
                  number="100+"
                  label="Projects Shipped"
                  color="text-blue-500"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-4">
                <StatCard
                  number="50+"
                  label="Happy Clients"
                  color="text-purple-500"
                />
                <StatCard
                  number="24/7"
                  label="Active Support"
                  color="text-green-500"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- Core Values Grid --- */}
      <section className="py-20 px-6 relative z-10 bg-white/50 dark:bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The principles that guide every line of code we write.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaLightbulb />,
                title: "Innovation",
                desc: "We don't follow trends; we build solutions that set them.",
              },
              {
                icon: <FaUsers />,
                title: "Collaboration",
                desc: "We work as an extension of your team, not just a vendor.",
              },
              {
                icon: <FaShieldAlt />,
                title: "Integrity",
                desc: "Transparent pricing, clear communication, and secure code.",
              },
              {
                icon: <FaRocket />,
                title: "Excellence",
                desc: "We are obsessed with performance, speed, and quality.",
              },
            ].map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-2xl hover:shadow-xl dark:hover:bg-white/[0.08] transition-all duration-300 group shadow-sm"
              >
                <div className="text-3xl text-blue-500 dark:text-blue-400 mb-4 group-hover:text-[#F47C26] transition-colors">
                  {val.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {val.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Team Section --- */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Meet The Minds
            </h2>
            <div className="w-20 h-1 bg-[#F47C26] mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The architects, designers, and strategists behind Trivixa.
            </p>

            {/* Visual Context: Organizational Structure */}
            <div className="mt-8 flex justify-center opacity-80">
              [Image of IT agency organizational structure]
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-orange-200 dark:hover:border-[#F47C26]/30 transition-all duration-300 shadow-lg dark:shadow-none"
              >
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gray-200 dark:bg-[#0a0f2d]">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x500/0a0f2d/ffffff?text=Trivixa+Member";
                    }}
                  />

                  {/* Social Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 bg-gradient-to-t from-black/80 to-transparent flex gap-4 justify-center">
                    <a href="#" className="text-white hover:text-[#F47C26]">
                      <FaLinkedinIn />
                    </a>
                    <a href="#" className="text-white hover:text-[#F47C26]">
                      <FaTwitter />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#F47C26] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3 uppercase tracking-wide">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#F47C26] to-[#d5671f] rounded-3xl p-12 text-center shadow-2xl shadow-orange-500/20 relative overflow-hidden"
          >
            {/* Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Digitalize Your Vision?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Partner with Trivixa and let's build technology that drives real
                business results.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-[#d5671f] font-bold py-3.5 px-8 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Your Project <FaRocket />
              </Link>
            </div>
          </motion.div>

          <p className="text-center text-gray-500 mt-12 text-sm">
            Trivixa IT Solutions — Engineering Excellence Since 2019.
          </p>
        </div>
      </section>
    </div>
  );
}

// Helper Component for Stats
const StatCard = ({ number, label, color }) => (
  <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm dark:shadow-none">
    <h4 className={`text-4xl font-bold mb-1 ${color}`}>{number}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
  </div>
);
