import React, { useState} from "react";
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
  FaQuoteLeft,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ScheduleMeetingModal from "../components/common/ScheduleMeetingModal";

export default function About() {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
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

  // Structured Data (JSON-LD) for SEO
  // This helps Google understand that Trivixa IT Solution is a Business
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ITService",
    name: "Trivixa IT Solution",
    url: "https://trivixa.in",
    logo: "https://trivixa.in/logo.png",
    sameAs: [
      "https://www.linkedin.com/company/trivixa-it-solution",
      "https://twitter.com/trivixa",
    ],
    founder: {
      "@type": "Person",
      name: "Krishna Avtar", // Assuming Sachin is the lead/CEO based on list position, edit if needed
      jobTitle: "CEO & Founder",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    description:
      "Trivixa IT Solution is a premier web development and digital strategy agency helping businesses scale through technology.",
  };

  const teamMembers = [
    {
      name: "Krishna Avtar",
      role: "Founder & CEO",
      bio: "The visionary behind Trivixa.in. With over a decade of experience in SEO and System Architecture, Sachin leads the company's strategic direction.",
      image: "/images/team-1.jpg",
    },
    {
      name: "Mani Chauhan",
      role: "Lead Full Stack Dev",
      bio: "Architecting scalable cloud solutions and robust backend systems that power enterprise applications.",
      image: "/images/team-5.jpg",
    },
    {
      name: "Kanika Gahlot",
      role: "Tech Content Lead",
      bio: "Translating complex code logic into compelling user narratives and technical documentation.",
      image: "/images/team-3.jpg",
    },
    {
      name: "Km. Meenakshi",
      role: "Head of UI/UX",
      bio: "Crafting intuitive digital experiences that delight users and drive conversion rates.",
      image: "/images/team-4.jpg",
    },
    {
      name: "Chanchal Singh",
      role: "Digital Marketing Manager",
      bio: "Executing data-driven campaigns to maximize ROI and brand visibility across digital channels.",
      image: "/images/team-2.jpg",
    },
    {
      name: "Mayank Chauhan",
      role: "Senior Frontend Engineer",
      bio: "Specializing in React.js and modern interactive interfaces for high-performance web apps.",
      image: "/images/team-6.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] overflow-hidden text-gray-900 dark:text-white relative transition-colors duration-500">
      <SEO
        title="About Trivixa IT Solution | CEO & Team | Web Development Experts"
        description="Meet the team at Trivixa IT Solution. Read a message from our CEO, explore our mission, and discover why we are the top choice for web development at trivixa.in."
        keywords="Trivixa IT Solution CEO, About Trivixa, trivixa.in team, IT Company India, Web Development Agency, Software Solutions Founder"
        og={{
          title: "About Trivixa IT Solution - Leadership & Vision",
          description:
            "Empowering businesses through innovation. Meet the leadership driving Trivixa IT Solution.",
          type: "website",
          url: "https://trivixa.in/about",
        }}
      />

      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
              Since 2022
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight text-gray-900 dark:text-white">
              We Are{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                Trivixa IT Solution
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Your strategic partner in <strong>Digital Transformation</strong>.
              At trivixa.in, we bridge the gap between complex business
              challenges and elegant, scalable software solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- CEO / Founder's Message Section (High SEO Value) --- */}
      <section className="py-20 px-6 relative z-10 bg-white dark:bg-black/20 border-y border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* CEO Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10">
                <img
                  src="http://trivixa.in/api/upload/file/trivixa-owner-11012026-1849.png"
                  alt="CEO of Trivixa IT Solution"
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <h3 className="text-white text-2xl font-bold">
                    Krishna Avtar
                  </h3>
                  <p className="text-[#F47C26] font-medium">Founder & CEO</p>
                </div>
              </div>
              {/* Decorative Element */}
              <div className="absolute -z-10 top-10 -left-10 w-full h-full border-2 border-[#F47C26]/30 rounded-2xl"></div>
            </motion.div>

            {/* CEO Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <FaQuoteLeft className="text-4xl text-[#F47C26]/20" />
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  A Note from the Founder
                </h2>
              </div>

              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  "When I established <strong>Trivixa IT Solution</strong>, the
                  goal wasn't just to open another IT agency. The vision was to
                  create a hub where innovation meets reliability. In an era
                  where businesses are rapidly moving online, simply having a
                  website isn't enough. You need a digital ecosystem that
                  breathes, grows, and converts."
                </p>
                <p>
                  At <strong>trivixa.in</strong>, we don't treat our clients as
                  'projects'—we treat them as partners. Whether we are
                  architecting a complex MERN stack application, optimizing an
                  e-commerce platform for SEO, or designing a brand identity,
                  our focus remains singular:{" "}
                  <strong>Revenue Growth for our Clients.</strong>
                </p>
                <p>
                  Our team is built on a foundation of relentless curiosity. We
                  dive deep into your industry problems to engineer custom
                  software solutions that provide a competitive edge. My promise
                  to you is transparency, technical excellence, and a
                  partnership that lasts beyond the deployment date."
                </p>
              </div>

              <div className="pt-6">
                <img
                  src="/images/signature.png" // Optional: Add a signature image
                  alt="CEO Signature"
                  className="h-12 opacity-70 dark:invert"
                  onError={(e) => (e.target.style.display = "none")}
                />
                <p className="mt-2 font-bold text-gray-900 dark:text-white">
                  — Krishna Avtar
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- Narrative & Mission Section --- */}
      <section className="py-20 px-6 relative z-10">
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
                  Why Leading Brands Choose Trivixa
                </h2>
                <div className="w-16 h-1 bg-[#F47C26] mb-6"></div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  Trivixa IT Solution stands at the forefront of the Indian IT
                  sector, delivering enterprise-grade development services. We
                  combine the agility of a startup with the process maturity of
                  a large corporation. From{" "}
                  <strong>Custom Web Development</strong> to
                  <strong>AI-driven Marketing Strategies</strong>, our portfolio
                  covers the full spectrum of digital needs.
                </p>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  Our Mission
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  To democratize access to high-end technology, empowering
                  businesses of all sizes to automate workflows, enhance user
                  engagement, and unlock new revenue streams through
                  <strong>Trivixa's</strong> proven digital methodologies.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
              >
                {[
                  { icon: <FaCode />, text: "MERN Stack Experts" },
                  { icon: <FaRocket />, text: "SEO-First Approach" },
                  { icon: <FaShieldAlt />, text: "Cybersecurity Ready" },
                  { icon: <FaUsers />, text: "Dedicated Support" },
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
                  number="2+"
                  label="Years of Excellence"
                  color="text-[#F47C26]"
                />
                <StatCard
                  number="21+"
                  label="Projects Delivered"
                  color="text-blue-500"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-4">
                <StatCard
                  number="98%"
                  label="Client Retention"
                  color="text-purple-500"
                />
                <StatCard
                  number="24/7"
                  label="Technical Support"
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
              The Trivixa Value System
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              The principles that guide every line of code we write at Trivixa
              IT Solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaLightbulb />,
                title: "Innovation",
                desc: "We don't follow trends; we build solutions that set them using the latest tech stacks.",
              },
              {
                icon: <FaUsers />,
                title: "Collaboration",
                desc: "We work as an extension of your team, not just a vendor. Your success is our KPI.",
              },
              {
                icon: <FaShieldAlt />,
                title: "Integrity",
                desc: "Transparent pricing, clear communication, and secure, documented code.",
              },
              {
                icon: <FaRocket />,
                title: "Excellence",
                desc: "We are obsessed with performance, speed (Core Web Vitals), and quality assurance.",
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
              The architects, designers, and strategists behind Trivixa IT
              Solution's success.
            </p>
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
                {/* <div className="relative h-80 overflow-hidden bg-gray-200 dark:bg-[#0a0f2d]">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10"></div>
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.role} at Trivixa`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x500/0a0f2d/ffffff?text=Trivixa+Member";
                    }}
                  />

                  
                  <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 bg-gradient-to-t from-black/80 to-transparent flex gap-4 justify-center">
                    <a
                      href="#"
                      className="text-white hover:text-[#F47C26]"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedinIn />
                    </a>
                    <a
                      href="#"
                      className="text-white hover:text-[#F47C26]"
                      aria-label="Twitter"
                    >
                      <FaTwitter />
                    </a>
                  </div>
                </div> */}

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
                Ready to Transform Your Business?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Partner with <strong>Trivixa IT Solution</strong> and let's
                build technology that drives real revenue. From website design
                to complex software engines.
              </p>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="inline-flex items-center gap-2 bg-white text-[#d5671f] font-bold py-3.5 px-8 rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Your Project <FaRocket />
              </button>
            </div>
          </motion.div>

          <p className="text-center text-gray-500 mt-12 text-sm">
            Trivixa IT Solution — Engineering Excellence Since 2022 | trivixa.in
          </p>
        </div>
      </section>
      <AnimatePresence>
        {isScheduleModalOpen && (
          <ScheduleMeetingModal
            isOpen={isScheduleModalOpen}
            onClose={() => setIsScheduleModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Component for Stats
const StatCard = ({ number, label, color }) => (
  <div className="bg-white dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 p-6 rounded-2xl shadow-sm dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
    <h4 className={`text-4xl font-bold mb-1 ${color}`}>{number}</h4>
    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
      {label}
    </p>
  </div>
);
