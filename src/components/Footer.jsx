import React from 'react';
import { Github, Linkedin, Mail, Twitter, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/macshashwat', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/macshashwat', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/whirlwind_149', label: 'Twitter' },
    { icon: Mail, href: 'mailto:shashwatmishra717@gmail.com', label: 'Email' }
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-2xl font-bold text-green-500">SM</span>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Fullstack / Backend Developer
            </p>
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-500 transition-colors"
                aria-label={social.label}
              >
                <social.icon size={22} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 flex-wrap">
            <span>© {currentYear} Shashwat Mishra. All rights reserved.</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center gap-1">
              Made with <Heart size={16} className="text-green-500 fill-green-500" /> and passion
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;