import React, { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaLaptopCode,
  FaHeart,
  FaRocket,
  FaCoffee,
  FaGlobeAmericas,
  FaArrowRight,
  FaGraduationCap,
  FaMedal,
  FaEnvelope,
  FaWhatsapp,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- Application Popup Component ---
const ApplicationPopup = ({ job, onClose }) => {
  const handleEmailClick = () => {
    const subject = `Application for ${job.title} - [Your Name]`;
    const body = `Dear Hiring Team at Trivixa IT Solution,\n\nI am writing to express my interest in the ${job.title} position.\n\n[Please describe your experience here]\n\nLink to Portfolio/Resume:\n\nBest regards,\n[Your Name]`;
    window.location.href = `mailto:krishna.trivixa@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsAppClick = () => {
    const message = `Hi, I am interested in applying for the *${job.title}* position at Trivixa IT Solution. My name is [Your Name].`;
    const phoneNumber = "+919084407615";
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
      ></motion.div>

      <motion.div
        className="relative w-full max-w-lg bg-white dark:bg-[#0a0f2d] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-[#F47C26] to-purple-500"></div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <div className="p-8 md:p-10">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#F47C26] uppercase tracking-widest mb-2 block">
              Join the Team
            </span>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Apply for {job.title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Select a method to send your CV and Portfolio.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleEmailClick}
              className="group w-full flex items-center justify-between p-5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FaEnvelope className="text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-white">
                    Send via Email
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Official Application
                  </p>
                </div>
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-blue-500 transition-colors" />
            </button>

            <button
              onClick={handleWhatsAppClick}
              className="group w-full flex items-center justify-between p-5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <FaWhatsapp className="text-xl" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 dark:text-white">
                    WhatsApp Chat
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Fast Track Inquiry
                  </p>
                </div>
              </div>
              <FaArrowRight className="text-gray-400 group-hover:text-green-500 transition-colors" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Page Component ---
const Careers = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationPopup, setShowApplicationPopup] = useState(false);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationPopup(true);
    document.body.style.overflow = "hidden";
  };

  const handleClosePopup = () => {
    setShowApplicationPopup(false);
    setSelectedJob(null);
    document.body.style.overflow = "auto";
  };

  // Expanded Data for SEO content
  const benefits = [
    {
      icon: <FaClock />,
      title: "Flexible & Remote",
      description:
        "Trivixa IT Solution promotes a healthy work-life balance with remote-first options.",
    },
    {
      icon: <FaLaptopCode />,
      title: "Latest Tech Stack",
      description:
        "Work with cutting-edge tools: React, Next.js, Laravel, Node.js, and AWS.",
    },
    {
      icon: <FaGraduationCap />,
      title: "Growth & Learning",
      description:
        "Paid access to Udemy courses and mentorship from senior developers.",
    },
    {
      icon: <FaMedal />,
      title: "Performance Bonus",
      description:
        "Quarterly incentives for timely project delivery and code excellence.",
    },
  ];

  const jobOpenings = [
    {
      id: 1,
      title: "Senior MERN Stack Developer",
      type: "Full-time",
      location: "Remote / Hybrid",
      department: "Engineering",
      salary: "Competitive",
      datePosted: "2026-01-10",
      description:
        "We are looking for an experienced Full Stack Developer to lead our web application projects. You will architect scalable solutions using MongoDB, Express, React, and Node.js.",
      responsibilities: [
        "Develop high-performance RESTful APIs.",
        "Optimize frontend for maximum speed and scalability.",
        "Collaborate with the design team to implement UI/UX.",
      ],
      tags: ["React.js", "Node.js", "MongoDB", "Redux"],
    },
    {
      id: 2,
      title: "SEO & Digital Strategist",
      type: "Full-time",
      location: "Remote",
      department: "Marketing",
      salary: "Competitive",
      datePosted: "2026-01-11",
      description:
        "Lead the organic growth strategy for Trivixa and our clients. You should have deep knowledge of on-page SEO, link building, and Google Analytics.",
      responsibilities: [
        "Conduct keyword research and competitor analysis.",
        "Manage content strategy and blog optimization.",
        "Monitor search rankings and generate reports.",
      ],
      tags: ["SEO", "Google Analytics", "Content Marketing", "SEM"],
    },
    {
      id: 3,
      title: "UI/UX Designer",
      type: "Contract / Freelance",
      location: "Remote",
      department: "Design",
      salary: "Project Based",
      datePosted: "2026-01-08",
      description:
        "Create intuitive user interfaces for e-commerce and corporate websites. Mastery of Figma and Adobe XD is required.",
      responsibilities: [
        "Create wireframes, storyboards, and user flows.",
        "Design high-fidelity mockups for mobile and web.",
        "Ensure design consistency across all products.",
      ],
      tags: ["Figma", "Adobe XD", "Prototyping", "Web Design"],
    },
  ];

  // Generate Structured Data for Google Jobs
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jobOpenings.map((job, index) => ({
      "@type": "JobPosting",
      position: index + 1,
      title: job.title,
      description: job.description,
      identifier: {
        "@type": "PropertyValue",
        name: "Trivixa IT Solution",
        value: `TRIV-${job.id}`,
      },
      datePosted: job.datePosted,
      validThrough: "2026-12-31",
      employmentType: job.type === "Full-time" ? "FULL_TIME" : "CONTRACTOR",
      hiringOrganization: {
        "@type": "Organization",
        name: "Trivixa IT Solution",
        sameAs: "https://trivixa.in",
        logo: "https://trivixa.in/logo.png",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
          addressRegion: "Remote",
        },
      },
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "INR",
        value: {
          "@type": "QuantitativeValue",
          unitText: "MONTH",
          value: job.salary === "Competitive" ? 25000 : undefined,
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-500">
      <SEO
        title="Careers at Trivixa IT Solution | Web Dev & SEO Jobs"
        description="Join Trivixa IT Solution. We are hiring MERN Stack Developers, SEO Experts, and UI Designers. Build the future of technology with us at trivixa.in."
        keywords="Trivixa Careers, IT Jobs India, Remote Web Developer Jobs, MERN Stack Jobs, SEO Jobs, Trivixa IT Solution Hiring"
      />

      {/* Inject Job Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* --- Atmospheric Background --- */}
      <div className="absolute inset-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 dark:opacity-10 mix-blend-multiply dark:mix-blend-normal"></div>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-orange-400/10 dark:bg-[#F47C26]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10">
        {/* --- Hero Section --- */}
        <section className="pt-32 pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-[#F47C26] dark:bg-white/5 dark:border-white/10 dark:text-[#F47C26] text-xs font-bold uppercase tracking-wider shadow-sm dark:shadow-none">
                Careers at Trivixa
              </span>
              <h1 className="mt-6 text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Code Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47C26] to-[#ff9e5e]">
                  Legacy
                </span>
              </h1>
              <p className="mt-6 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                Join <strong>Trivixa IT Solution</strong>. We are a team of
                innovators building next-gen web applications and digital
                strategies.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-6">
                {/* Visual Trust Indicators */}
                <div className="flex flex-col items-center p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg dark:shadow-none min-w-[120px]">
                  <span className="text-3xl font-bold text-blue-500">
                    4.6/5
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                    Employee Satisfaction
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-lg dark:shadow-none min-w-[120px]">
                  <span className="text-3xl font-bold text-green-500">
                    100%
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                    Remote Friendly
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- Culture & Benefits --- */}
        <section className="py-20 px-6 bg-white/50 dark:bg-black/20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Why Trivixa?</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                We believe that happy people write the best code. We invest
                heavily in our culture and your personal growth.
              </p>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-8 rounded-3xl hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-2xl text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* --- Hiring Process Visualization --- */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[#F47C26] font-bold text-xs uppercase tracking-widest mb-2 block">
                  Transparency
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Our Hiring Process
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  We value your time. Our process is designed to be streamlined
                  and respectful.
                </p>

                <ul className="space-y-8">
                  {[
                    {
                      title: "CV Review",
                      desc: "We check your portfolio and experience alignment.",
                    },
                    {
                      title: "Culture Fit",
                      desc: "A casual chat to see if our values align.",
                    },
                    {
                      title: "Skill Assessment",
                      desc: "A practical, real-world task. No whiteboards.",
                    },
                    {
                      title: "Welcome Aboard",
                      desc: "Offer letter and onboarding.",
                    },
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 relative">
                      {/* Connecting Line */}
                      {i < 3 && (
                        <div className="absolute left-[15px] top-8 bottom-[-32px] w-0.5 bg-gray-200 dark:bg-white/10"></div>
                      )}

                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#F47C26] text-white flex items-center justify-center font-bold text-sm z-10">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{step.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {step.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diagram / Visual Context */}
              <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex items-center justify-center min-h-[300px]">
                <div className="text-center opacity-60">
                  <FaUsers className="text-6xl mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm">Collaborative Hiring Flow</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- Job Listings --- */}
        <section
          className="py-20 px-6 bg-gray-50 dark:bg-black/20"
          id="openings"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
              <div className="w-16 h-1 bg-[#F47C26] mx-auto rounded-full"></div>
            </div>

            {jobOpenings.length > 0 ? (
              <div className="space-y-6">
                {jobOpenings.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-3xl hover:border-blue-300 dark:hover:border-[#F47C26]/50 transition-all duration-300 hover:shadow-lg dark:shadow-none"
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wide">
                            {job.department}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 text-[10px] font-bold uppercase tracking-wide">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#F47C26] transition-colors">
                          {job.title}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt /> {job.location}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <FaBriefcase /> {job.salary}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed text-sm">
                          {job.description}
                        </p>

                        {/* Rich Content: Responsibilities */}
                        <div className="mb-4">
                          <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">
                            Key Responsibilities:
                          </h4>
                          <ul className="space-y-1">
                            {job.responsibilities.map((resp, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400"
                              >
                                <FaCheckCircle className="text-[#F47C26] mt-0.5 text-xs shrink-0" />{" "}
                                {resp}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.tags?.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 shrink-0">
                        <button
                          onClick={() => handleApplyClick(job)}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-[#0a0f2d] font-bold rounded-xl hover:bg-[#F47C26] dark:hover:bg-[#F47C26] dark:hover:text-white transition-all shadow-md w-full md:w-auto"
                        >
                          Apply Now <FaArrowRight className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-white/5 rounded-3xl border border-dashed border-gray-300 dark:border-white/10">
                <p className="text-gray-500 dark:text-gray-400">
                  There are no open positions at the moment. Please check back
                  later.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0B2545] dark:bg-black/40 skew-y-3 transform origin-bottom-right z-0"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Don't See Your Dream Job?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              We are always looking for talented individuals. Send us your
              resume and we'll contact you when a position matches your skills.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-[#F47C26] hover:bg-[#d5671f] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1"
            >
              Contact HR Team
            </Link>
          </div>
        </section>
      </div>

      {/* Application Popup */}
      <AnimatePresence>
        {showApplicationPopup && selectedJob && (
          <ApplicationPopup job={selectedJob} onClose={handleClosePopup} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;
