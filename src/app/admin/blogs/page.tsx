'use client';

import { useEffect, useState } from 'react';
import { blogService } from '@/services/blogService';
import { Blog } from '@/types';
import Link from 'next/link';
import { Plus, ExternalLink, Calendar, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { revalidateBlogs } from '@/app/actions';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blog: Blog) => {
    if (confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await blogService.deleteBlog(blog.id);
        await revalidateBlogs(blog.slug);
        fetchBlogs();
      } catch (err) {
        alert('Error deleting post');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-heading mb-2">
            Blog <span className="text-maac-gold">CMS</span>
          </h1>
          <p className="text-white/20 text-xs uppercase tracking-[0.2em]">Manage creative insights</p>
        </div>
        
        <Link 
          href="/admin/blogs/new" 
          className="bg-maac-gold text-obsidian-black px-8 py-3 font-heading text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-maac-gold/5"
        >
          <Plus size={18} /> New Story
        </Link>
      </div>

      {loading ? (
        <div className="text-white/20 font-sans animate-pulse">Fetching Insights...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, idx) => (
            <motion.div 
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-deep-navy border border-white/5 group hover:border-maac-gold/30 transition-all flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                 <img src={blog.coverImageUrl} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-maac-gold mb-3">
                  <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <h3 className="font-heading text-lg group-hover:text-maac-gold transition-colors line-clamp-2 leading-tight">{blog.title}</h3>
                <p className="text-xs text-white/40 font-sans mt-4 line-clamp-3">{blog.excerpt}</p>
                
                <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                   <Link 
                    href={`/blog/${blog.slug}`} 
                    target="_blank"
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-[10px] uppercase tracking-widest"
                   >
                    View Live <ExternalLink size={12} />
                   </Link>
                   
                   <div className="flex items-center gap-4">
                     <Link 
                      href={`/admin/blogs/${blog.id}`}
                      className="text-royal-blue/40 hover:text-royal-blue transition-all"
                      title="Edit Story"
                     >
                      <Edit2 size={14} />
                     </Link>
                     <button 
                      onClick={() => handleDelete(blog)}
                      className="text-electric-red/40 hover:text-electric-red transition-all"
                      title="Delete Post"
                     >
                      <Trash2 size={14} />
                     </button>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}

          {blogs.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-white/5 text-white/20 italic font-sans">
               No stories published yet. Create your first masterpiece!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
