import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';

import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Blog from '@/components/Blog';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabase';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [showBlog, setShowBlog] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  useEffect(() => {
    const authCallback = window.location.hash.includes('access_token')
      || new URLSearchParams(window.location.search).has('code');
    if (!authCallback) return undefined;

    let active = true;
    const finishAuthCallback = (session) => {
      if (active && session) {
        setShowBlog(true);
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/[?&]auth=callback/, ''));
      }
    };
    const { data: listener } = supabase?.auth.onAuthStateChange((_event, session) => finishAuthCallback(session)) || {};
    supabase?.auth.getSession().then(({ data }) => finishAuthCallback(data.session));
    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <>
      <Helmet>
        <title>Shashwat Mishra - Fullstack/Backend Developer Portfolio</title>
        <meta name="description" content="Professional portfolio of Shashwat Mishra, a skilled Fullstack and Backend Developer specializing in modern web technologies and scalable applications." />
      </Helmet>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
        {!showBlog && <Header isDark={isDark} toggleTheme={toggleTheme} onBlogClick={() => setShowBlog(true)} />}

        {/* The theme toggle button was moved to Header.jsx */}

        {showBlog ? <Blog onClose={() => setShowBlog(false)} /> : <>
          <Hero />
          <About />
          <Projects />
          <Contact />
          <Footer />
        </>}
        <Toaster />
      </div>
    </>
  );
}

export default App;