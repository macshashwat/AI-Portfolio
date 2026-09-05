import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import FeaturedBlogs from '@/components/FeaturedBlogs';

import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Blog from '@/components/Blog';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { supabase } from '@/lib/supabase';

function App() {
  const [isDark, setIsDark] = useState(true);
  const [showBlog, setShowBlog] = useState(() => Boolean(new URLSearchParams(window.location.search).get('blog')));
  const [selectedBlogId, setSelectedBlogId] = useState(() => new URLSearchParams(window.location.search).get('blog'));

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  useEffect(() => {
    let active = true;
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    const hasHashAuth = hashParams.has('access_token') || hashParams.has('error');
    const searchParams = new URLSearchParams(window.location.search);
    const hasCodeAuth = searchParams.has('code');
    const callbackRequested = hasHashAuth
      || hasCodeAuth
      || searchParams.get('auth') === 'callback'
      || sessionStorage.getItem('oauth_blog_redirect') === 'true';

    // Supabase stores hash-based OAuth sessions automatically, but the fragment
    // itself is not removed from the browser URL.
    if (hasHashAuth) {
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
    }

    const finishAuthCallback = (session) => {
      if (active && session && callbackRequested) {
        setShowBlog(true);
        sessionStorage.removeItem('oauth_blog_redirect');
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('auth');
        cleanUrl.hash = '';
        window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search);
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

        {showBlog ? <Blog initialPostId={selectedBlogId} onClose={() => { setSelectedBlogId(null); setShowBlog(false); window.history.replaceState({}, document.title, window.location.pathname); }} /> : <>
          <Hero />
          <About />
          <FeaturedBlogs onReadMore={(post) => {
            const blogId = post?.id || null;
            setSelectedBlogId(blogId);
            setShowBlog(true);
            if (blogId) window.history.pushState({}, document.title, `${window.location.pathname}?blog=${encodeURIComponent(blogId)}`);
          }} />
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