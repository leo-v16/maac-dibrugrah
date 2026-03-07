'use client';

import { useEffect, useState } from 'react';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import { Plus, Trash2, Edit2, Eye, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const allPosts = await blogService.getAllPosts();
      setPosts(allPosts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await blogService.deletePost(id);
        fetchPosts();
      } catch (err) {
        alert('Error deleting post');
      }
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await blogService.updatePost(id, { published: !currentStatus });
      fetchPosts();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-heading">Blog <span className="text-maac-gold">CMS</span></h1>
        <Link href="/admin/posts/new" className="bg-maac-gold text-obsidian-black px-6 py-2 font-heading text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors">
          <Plus size={18} /> New Story
        </Link>
      </div>

      {loading ? (
        <div className="text-white/20">Loading Posts...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-deep-navy border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex items-center gap-6">
                 <div className="w-16 h-16 bg-obsidian-black border border-white/5 overflow-hidden">
                    <img src={post.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'} alt="" className="w-full h-full object-cover opacity-50" />
                 </div>
                 <div>
                    <h3 className="text-lg font-heading text-white group-hover:text-maac-gold transition-colors">{post.title}</h3>
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/30 mt-1">
                       <span>{post.createdAt?.toDate().toLocaleDateString()}</span>
                       <span className={post.published ? 'text-maac-gold' : 'text-electric-red'}>
                          {post.published ? 'Published' : 'Draft'}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => togglePublish(post.id, post.published)}
                  className="p-3 bg-white/5 hover:bg-maac-gold/20 hover:text-maac-gold transition-all text-white/40"
                  title={post.published ? 'Unpublish' : 'Publish'}
                 >
                    {post.published ? <Eye size={18} /> : <Eye size={18} className="opacity-20" />}
                 </button>
                 <Link href={`/admin/posts/${post.id}`} className="p-3 bg-white/5 hover:bg-royal-blue/20 hover:text-royal-blue transition-all text-white/40" title="Edit">
                    <Edit2 size={18} />
                 </Link>
                 <Link href={`/blog/${post.slug}`} target="_blank" className="p-3 bg-white/5 hover:bg-white/10 hover:text-white transition-all text-white/40" title="View">
                    <ExternalLink size={18} />
                 </Link>
                 <button 
                  onClick={() => handleDelete(post.id)}
                  className="p-3 bg-white/5 hover:bg-electric-red/20 hover:text-electric-red transition-all text-white/40" 
                  title="Delete"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))}

          {posts.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/5 text-white/20 italic">
               No stories found. Create your first masterpiece!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
