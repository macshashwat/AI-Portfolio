import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialLinks = [
    { icon: Github, href: 'https://github.com/macshashwat', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/macshashwat', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:shashwatmishra717@gmail.com', label: 'Email' }
  ];

  const roleText = "Fullstack / Backend Developer";
  const words = roleText.split(" ");

  // Container staggers the words
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  // Words stagger the characters
  const wordVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  // Characters animate in
  const letterVariants = {
    hidden: { opacity: 0, y: 10, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 200
      }
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 dark:from-green-500/10 dark:via-transparent dark:to-green-500/10"></div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-green-500 text-lg md:text-xl font-semibold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Hello, I'm
            </motion.h2>

            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Shashwat Mishra
            </motion.h1>

            {/* Animated Role Text */}
            <motion.div
              className="mb-8 text-center"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="inline-block whitespace-nowrap mr-2 md:mr-3"
                >
                  {word.split("").map((char, j) => (
                    <motion.span
                      key={j}
                      variants={letterVariants}
                      className="text-2xl md:text-3xl lg:text-4xl font-bold inline-block text-gray-700 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-300"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              ))}
            </motion.div>

            <motion.p
              className="text-lg md:text-xl text-left md:text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3 }}
            >
              Building scalable AI web applications with modern technologies and best practices.
              Passionate about creating efficient, user-friendly solutions.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
            >
              <Button
                onClick={scrollToContact}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get In Touch
              </Button>

              <Button
                variant="outline"
                className="border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-950 px-8 py-6 text-lg rounded-lg transition-all duration-300"
                onClick={() => window.open('https://drive.google.com/file/d/1lc46lr73OOg9b5ABg0OTdBfVcDBa8vUT/view?usp=sharing', '_blank')}
              >
                Download Resume
              </Button>
            </motion.div>

            <motion.div
              className="relative -top-2 flex items-center justify-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-500 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.7 + index * 0.1 }}
                >
                  <social.icon size={28} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="text-green-500" size={32} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;