import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Sample project data - replace with your actual projects
const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with product listings, cart, and payment integration.',
    category: 'web',
    image: 'https://source.unsplash.com/random/600x400?ecommerce',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe']
  },
  {
    id: 2,
    title: 'Mobile Task Manager',
    description: 'A cross-platform mobile app for managing tasks and productivity.',
    category: 'mobile',
    image: 'https://source.unsplash.com/random/600x400?mobile,app',
    tags: ['React Native', 'Firebase', 'Redux']
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'A modern and responsive portfolio website built with React and Tailwind CSS.',
    category: 'web',
    image: 'https://source.unsplash.com/random/600x400?portfolio,website',
    tags: ['React', 'Tailwind CSS', 'Framer Motion']
  },
  {
    id: 4,
    title: 'UI/UX Dashboard',
    description: 'A clean and intuitive admin dashboard with analytics and user management.',
    category: 'design',
    image: 'https://source.unsplash.com/random/600x400?dashboard',
    tags: ['Figma', 'UI/UX', 'Prototyping']
  },
];

const PHome = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [isHovered, setIsHovered] = useState(null);

  const categories = ['all', 'web', 'mobile', 'design'];

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) => project.category === activeFilter)
      );
    }
  }, [activeFilter]);

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            My Portfolio
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Check out my latest projects and works. I create beautiful, functional, and user-centered digital experiences.
          </motion.p>
        </section>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setIsHovered(project.id)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 ${
                    isHovered === project.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div>
                    <h3 className="text-white text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-gray-200 text-sm mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-1 text-xs bg-white/20 text-white rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {project.description}
                </p>
                <Link
                  to={`/portfolio/projects/${project.id}`}
                  className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium text-sm"
                >
                  View Project
                  <svg
                    className="ml-1 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="mt-20 bg-indigo-50 dark:bg-gray-800 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Have a project in mind?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always looking for new and exciting projects to work on. Let's create something amazing together!
          </p>
          <Link
            to="/portfolio/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PHome;
