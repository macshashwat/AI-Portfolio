import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button component

const Header = ({ isDark, toggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },

    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled || isMobileMenuOpen
          ? 'bg-white/95 dark:bg-black/95 backdrop-blur-sm shadow-lg border-b border-gray-200 dark:border-gray-800'
          : 'bg-transparent'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className="text-2xl font-bold text-green-500 hover:text-green-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SM
          </motion.a>

          <div className="hidden md:flex items-center space-x-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 bg-white dark:bg-black border-2 border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300 shadow-lg"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-green-500" />
                ) : (
                  <Moon className="h-5 w-5 text-green-500" />
                )}
              </Button>
            </motion.div>
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-500 transition-colors relative group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
              </motion.a>
            ))}
          </div>

          <div className="flex items-center md:hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mr-4"
            >
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="rounded-full w-10 h-10 bg-white dark:bg-black border-2 border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition-all duration-300 shadow-lg"
              >
                {isDark ? (
                  <Sun className="h-5 w-5 text-green-500" />
                ) : (
                  <Moon className="h-5 w-5 text-green-500" />
                )}
              </Button>
            </motion.div>
            <button
              className="text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => scrollToSection(e, item.href)}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-500 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
};

export default Header;