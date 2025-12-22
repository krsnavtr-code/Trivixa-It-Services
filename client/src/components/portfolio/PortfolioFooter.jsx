import React from 'react';
import { Link } from 'react-router-dom';

const PortfolioFooter = ({ baseUrl = "/portfolio" }) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Projects",
      links: [
        { name: "Web Development", href: `${baseUrl}/projects?category=web` },
        { name: "Mobile Apps", href: `${baseUrl}/projects?category=mobile` },
        { name: "UI/UX Design", href: `${baseUrl}/projects?category=design` },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: `${baseUrl}/about` },
        { name: "Contact", href: `${baseUrl}/contact` },
        { name: "Blog", href: `${baseUrl}/blog` },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
      ],
    },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: "github" },
    { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
    { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { name: "Dribbble", href: "https://dribbble.com", icon: "dribbble" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h3 className="text-white text-2xl font-bold">Portfolio</h3>
            <p className="text-gray-400 text-sm">
              Showcasing my best work and projects. Let's create something
              amazing together!
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">{item.name}</span>
                  <i className={`fab fa-${item.icon} text-xl`}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="text-sm font-semibold text-white tracking-wider uppercase">
                  {section.title}
                </h3>
                <div className="mt-4 space-y-4">
                  {section.links.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-base text-gray-400 hover:text-white block"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {currentYear} Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
