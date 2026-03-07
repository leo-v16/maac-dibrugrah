'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

export default function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogService.getPostBySlug(slug);
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) return <div className="pt-32 min-h-screen bg-obsidian-black flex items-center justify-center text-maac-gold">Loading Story...</div>;

  if (!post) return (
    <div className="pt-32 min-h-screen bg-obsidian-black flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-heading uppercase tracking-[0.2em] opacity-30">Story Not Found</h1>
      <Link href="/blog" className="text-maac-gold flex items-center gap-2 font-heading tracking-widest uppercase text-sm border-b border-maac-gold pb-1">
        <ArrowLeft size={16} /> Back to Blog
      </Link>
    </div>
  );

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian-black">
      <div className="container mx-auto px-6">
        <Link href="/blog" className="text-maac-gold/50 flex items-center gap-2 font-heading tracking-widest uppercase text-[10px] mb-12 hover:text-maac-gold transition-colors">
          <ArrowLeft size={14} /> Back to Insights
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-maac-gold mb-6">
            <span className="flex items-center gap-2"><Calendar size={14} /> {post.createdAt?.toDate().toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><User size={14} /> {post.author}</span>
            <span className="flex items-center gap-2"><Clock size={14} /> 5 Min Read</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading mb-12 leading-tight">
            {post.title}
          </h1>

          <div className="aspect-[21/9] w-full mb-16 overflow-hidden border border-white/5">
            <img
              src={post.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div 
            className="prose prose-invert prose-lg max-w-none font-sans text-white/70 leading-relaxed selection:bg-maac-gold selection:text-obsidian-black"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </div>
    </div>
  );
}
