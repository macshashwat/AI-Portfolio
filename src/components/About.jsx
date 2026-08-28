import React from 'react';
import { motion } from 'framer-motion';
import { Code, Database, Server, Zap } from 'lucide-react';
import aboutImage from '../assets/about-me-new.jpg';

const About = () => {
  const highlights = [
    {
      icon: Code,
      title: 'Frontend Development',
      description: 'Building responsive and interactive user interfaces with modern frameworks'
    },
    {
      icon: Server,
      title: 'Backend Development',
      description: 'Creating robust APIs and server-side applications with scalable architecture'
    },
    {
      icon: Database,
      title: 'Database Design',
      description: 'Designing efficient database schemas and optimizing query performance'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimizing applications for speed, efficiency, and best user experience'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            About <span className="text-green-500">Me</span>
          </h2>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-lg transform rotate-3"></div>
                <img
                  className="relative z-10 rounded-lg shadow-2xl w-full h-[400px] object-cover"
                  alt="Professional developer working"
                  src={aboutImage}
                  loading="lazy"
                  decoding="async" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                I'm a passionate Fullstack/Backend Developer with expertise in building scalable web applications.
                With a strong foundation in both frontend and backend technologies, I create seamless digital experiences
                that combine beautiful design with robust functionality.
              </p>

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                My journey in software development has equipped me with the skills to tackle complex challenges
                and deliver high-quality solutions. I'm constantly learning and staying updated with the latest
                industry trends and best practices.
              </p>

              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects,
                or sharing knowledge with the developer community.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-green-500/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="text-green-500" size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;