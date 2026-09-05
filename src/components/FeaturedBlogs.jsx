import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

const formatDate = (date) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
}).format(new Date(date));

const mapPost = (post) => ({
  ...post,
  coverUrl: post.cover_url,
  readTime: post.read_time || 1,
  category: post.categories?.name || 'Uncategorized',
  author: post.profiles?.display_name || 'Shashwat Mishra'
});

function FeaturedBlogs({ onReadMore }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let active = true;

    supabase
      .from('posts')
      .select('id, title, excerpt, cover_url, published_at, read_time, featured, categories(name), profiles!posts_author_id_fkey(display_name)')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(3)
      .then(({ data, error }) => {
        if (error) {
          console.error('Unable to load featured blog posts:', error);
          return;
        }
        if (active) setPosts((data || []).map(mapPost));
      });

    return () => {
      active = false;
    };
  }, []);

  if (!isSupabaseConfigured || posts.length === 0) return null;

  return (
    <section className="px-4 py-20 md:px-6 lg:px-8" id="featured-writing">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-500">From the writing desk</p>
              <h2 className="text-4xl font-bold md:text-5xl">Latest <span className="text-green-500">thinking</span></h2>
              <div className="mt-4 h-1 w-20 bg-green-500" />
            </div>
            <button onClick={onReadMore} className="flex items-center gap-2 self-start text-sm font-semibold text-green-500 transition hover:gap-3 sm:self-auto">
              View all posts <ArrowRight size={17} />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {post.coverUrl ? (
                  <img src={post.coverUrl} alt="" className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-44 items-center justify-center bg-green-500/10"><FileText className="text-green-500" size={34} /></div>
                )}
                <div className="p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-500">
                    <span>{post.category}</span><span className="text-gray-300">•</span><span>{formatDate(post.published_at)}</span>
                  </div>
                  <h3 className="line-clamp-2 text-xl font-bold">{post.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{post.excerpt}</p>
                  <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-700">
                    <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.author}</span>
                  </div>
                  <button onClick={onReadMore} className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-500 transition hover:gap-3">
                    Read more <ArrowRight size={16} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturedBlogs;
