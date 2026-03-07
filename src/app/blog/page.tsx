'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import { Calendar, User, ChevronRight } from 'lucide-react';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching published posts...");
        const publishedPosts = await blogService.getPublishedPosts();
        console.log("Posts received:", publishedPosts);
        setPosts(publishedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian-black">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-heading mb-4">
            Creative <span className="text-maac-gold">Insights</span>
          </h1>
          <p className="text-white/40 font-sans tracking-widest uppercase text-sm">Latest from the world of VFX, Animation & AI</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-deep-navy h-96 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-deep-navy border border-white/5 overflow-hidden flex flex-col"
              >
                <Link href={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-maac-gold mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> 
                      {post.createdAt ? (typeof post.createdAt.toDate === 'function' ? post.createdAt.toDate().toLocaleDateString() : 'Recent') : 'Recent'}
                    </span>
                    <span className="flex items-center gap-1"><User size={12} /> {post.author || 'MAAC Team'}</span>
                  </div>
                  
                  <h2 className="text-xl font-heading mb-4 group-hover:text-maac-gold transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  
                  <p className="text-white/50 font-sans text-sm line-clamp-3 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-2 text-maac-gold font-heading text-xs tracking-widest uppercase hover:gap-4 transition-all"
                  >
                    Read More <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/10">
            <p className="text-white/40 font-sans italic">No stories published yet. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
