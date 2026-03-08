'use client';

import { useEffect, useState } from 'react';
import { blogService } from '@/services/blogService';
import { leadService } from '@/services/leadService';
import { courseService } from '@/services/courseService';
import { galleryService } from '@/services/galleryService';
import { FileText, Users, LayoutDashboard, Image as ImageIcon, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ blogs: 0, leads: 0, courses: 0, gallery: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogs, leads, courses, gallery] = await Promise.all([
          blogService.getAllBlogs(),
          leadService.getAllLeads(),
          courseService.getAll(),
          galleryService.getAllItems()
        ]);
        setStats({ 
          blogs: blogs.length, 
          leads: leads.length,
          courses: courses.length,
          gallery: gallery.length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Blog Posts', value: stats.blogs, icon: FileText, color: 'text-maac-gold' },
    { label: 'Student Leads', value: stats.leads, icon: Users, color: 'text-royal-blue' },
    { label: 'Active Courses', value: stats.courses, icon: LayoutDashboard, color: 'text-electric-red' },
    { label: 'Gallery Items', value: stats.gallery, icon: ImageIcon, color: 'text-white' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-heading mb-10 uppercase">System <span className="text-maac-gold">Overview</span></h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-deep-navy border border-white/5 p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <card.icon size={64} />
            </div>
            
            <span className="text-white/40 text-[10px] uppercase tracking-widest block mb-2">{card.label}</span>
            <div className={`text-4xl font-heading ${card.color}`}>
              {loading ? '...' : card.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-deep-navy border border-white/5 p-8">
            <h3 className="text-xl font-heading mb-6 flex items-center gap-2">
               <TrendingUp size={20} className="text-maac-gold" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
               <a href="/admin/blogs/new" className="p-4 bg-obsidian-black border border-white/5 hover:border-maac-gold/30 transition-all text-xs uppercase tracking-widest text-white/60 hover:text-white text-center">New Blog Post</a>
               <a href="/admin/courses/new" className="p-4 bg-obsidian-black border border-white/5 hover:border-maac-gold/30 transition-all text-xs uppercase tracking-widest text-white/60 hover:text-white text-center">Add Course</a>
               <a href="/admin/gallery/new" className="p-4 bg-obsidian-black border border-white/5 hover:border-maac-gold/30 transition-all text-xs uppercase tracking-widest text-white/60 hover:text-white text-center">Upload Masterpiece</a>
               <a href="/admin/ads/new" className="p-4 bg-obsidian-black border border-white/5 hover:border-maac-gold/30 transition-all text-xs uppercase tracking-widest text-white/60 hover:text-white text-center">Create Ad</a>
            </div>
         </div>

         <div className="bg-deep-navy border border-white/5 p-8 flex flex-col justify-center items-center text-center">
            <p className="text-white/20 font-sans tracking-[0.2em] uppercase text-xs">MAAC Dibrugarh Administration Console v1.0</p>
         </div>
      </div>
    </div>
  );
}
