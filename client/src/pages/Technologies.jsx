import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaAndroid,
  FaApple,
  FaAws,
  FaDocker,
  FaGitAlt,
  FaDatabase,
  FaCode,
  FaMobileAlt,
  FaServer,
  FaCloud,
  FaTools,
  FaArrowRight,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiFlutter,
  SiKotlin,
  SiSwift,
  SiMongodb,
  SiPostgresql,
  SiFirebase,
  SiGraphql,
  SiKubernetes,
  SiFigma,
  SiJira,
  SiLaravel,
  SiVuedotjs,
} from "react-icons/si";

// --- Tech Stack Data ---
const techCategories = [
  {
    id: "frontend",
    title: "Frontend & Web",
    description:
      "Building lightning-fast, responsive, and interactive user interfaces.",
    icon: <FaCode />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-100 dark:border-blue-500/20",
    stack: [
      { name: "React.js", icon: <FaReact /> },
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "Vue.js", icon: <SiVuedotjs /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
    ],
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    description: "Native and cross-platform solutions for iOS and Android.",
    icon: <FaMobileAlt />,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-500/10",
    border: "border-green-100 dark:border-green-500/20",
    stack: [
      { name: "Flutter", icon: <SiFlutter /> },
      { name: "React Native", icon: <FaReact /> },
      { name: "Android (Kotlin)", icon: <SiKotlin /> },
      { name: "iOS (Swift)", icon: <SiSwift /> },
      { name: "Google Play", icon: <FaAndroid /> },
      { name: "App Store", icon: <FaApple /> },
    ],
  },
  {
    id: "backend",
    title: "Backend & API",
    description: "Robust server-side architecture for scalable applications.",
    icon: <FaServer />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-100 dark:border-purple-500/20",
    stack: [
      { name: "Node.js", icon: <FaNodeJs /> },
      { name: "Python", icon: <FaPython /> },
      { name: "Laravel", icon: <SiLaravel /> },
      { name: "GraphQL", icon: <SiGraphql /> },
      { name: "REST API", icon: <FaServer /> },
    ],
  },
  {
    id: "database",
    title: "Database & Storage",
    description: "Secure and efficient data management systems.",
    icon: <FaDatabase />,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-500/10",
    border: "border-yellow-100 dark:border-yellow-500/20",
    stack: [
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "PostgreSQL", icon: <SiPostgresql /> },
      { name: "Firebase", icon: <SiFirebase /> },
      { name: "MySQL", icon: <FaDatabase /> },
    ],
  },
  {
    id: "cloud",
    title: "Cloud & DevOps",
    description: "Deploying, scaling, and managing infrastructure with ease.",
    icon: <FaCloud />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    border: "border-orange-100 dark:border-orange-500/20",
    stack: [
      { name: "AWS", icon: <FaAws /> },
      { name: "Docker", icon: <FaDocker /> },
      { name: "Kubernetes", icon: <SiKubernetes /> },
      { name: "CI/CD Pipelines", icon: <FaGitAlt /> },
    ],
  },
  {
    id: "tools",
    title: "Design & Tools",
    description: "The essential toolkit for collaboration and design.",
    icon: <FaTools />,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-50 dark:bg-pink-500/10",
    border: "border-pink-100 dark:border-pink-500/20",
    stack: [
      { name: "Figma", icon: <SiFigma /> },
      { name: "Git / GitHub", icon: <FaGitAlt /> },
      { name: "Jira", icon: <SiJira /> },
      { name: "VS Code", icon: <FaCode /> },
    ],
  },
];

const Technologies = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f2d] text-gray-900 dark:text-white font-sans relative overflow-hidden selection:bg-[#F47C26] selection:text-white transition-colors duration-500">
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#F47C26]/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
        {/* --- Hero Section --- */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#F47C26] font-bold tracking-widest uppercase text-sm mb-4 block">
              Our Tech Stack
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
              Technologies We <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-900 dark:from-[#F47C26] dark:to-orange-400">
                Master
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              We don't just use tools; we leverage the{" "}
              <strong>right technology</strong> to build scalable, secure, and
              future-proof solutions. From cutting-edge frameworks to rock-solid
              infrastructure.
            </p>
          </motion.div>
        </div>

        {/* --- Technology Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          {techCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[2rem] p-8 hover:border-[#F47C26]/50 dark:hover:border-[#F47C26]/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 group"
            >
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`p-4 rounded-2xl text-3xl ${category.color} ${category.bg} border ${category.border} group-hover:scale-110 transition-transform`}
                >
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Stack Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {category.stack.map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-[#0F1430] border border-gray-200 dark:border-white/5 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-100 dark:hover:text-white dark:hover:border-[#F47C26]/30 transition-colors"
                  >
                    <span className={`${category.color}`}>{tech.icon}</span>
                    {tech.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Why This Stack Section --- */}
        <div className="mb-32">
          <div className="bg-white dark:bg-gradient-to-br dark:from-[#0F1430] dark:to-[#0a0f2d] border border-gray-200 dark:border-white/10 rounded-[3rem] p-10 md:p-16 relative overflow-hidden shadow-xl dark:shadow-none">
            {/* Glow effect for dark mode */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F47C26]/10 rounded-full blur-[100px] hidden dark:block"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                  Why we choose <br />
                  <span className="text-[#F47C26]">Modern Tech?</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                  Legacy systems hold businesses back. We select our stack based
                  on three non-negotiable principles:
                </p>
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-[#F47C26] hover:bg-[#d5671f] text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 inline-flex items-center gap-2"
                >
                  Build Your Project <FaArrowRight />
                </Link>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: "Scalability",
                    desc: "Architectures that grow with your user base without breaking.",
                    icon: "📈",
                  },
                  {
                    title: "Performance",
                    desc: "Lightning-fast load times and optimized code for better SEO.",
                    icon: "⚡",
                  },
                  {
                    title: "Security",
                    desc: "Enterprise-grade security standards to protect your data.",
                    icon: "🛡️",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm dark:shadow-none"
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h4 className="text-gray-900 dark:text-white font-bold">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- CTA Section --- */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Not sure which tech you need?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Don't worry. We analyze your business goals and recommend the
            perfect stack optimized for your specific requirements.
          </p>
          <Link
            to="/contact"
            className="text-[#F47C26] font-bold text-lg hover:text-orange-600 dark:hover:text-white transition-colors border-b-2 border-[#F47C26] pb-1 hover:border-orange-600 dark:hover:border-white"
          >
            Schedule a Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Technologies;
