'use client';

import { useEffect, useState } from 'react';
import { blogService } from '@/services/blogService';
import { leadService } from '@/services/leadService';
import { FileText, Users, Eye, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, leads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [posts, leads] = await Promise.all([
          blogService.getAllPosts(),
          leadService.getAllLeads()
        ]);
        setStats({ posts: posts.length, leads: leads.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Total Posts', value: stats.posts, icon: FileText, color: 'text-maac-gold' },
    { label: 'Total Leads', value: stats.leads, icon: Users, color: 'text-royal-blue' },
    { label: 'Site Views', value: '---', icon: Eye, color: 'text-electric-red' },
    { label: 'Conversion', value: '---', icon: TrendingUp, color: 'text-white' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-heading mb-10">System <span className="text-maac-gold">Overview</span></h1>
      
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

      <div className="mt-12 p-12 border border-dashed border-white/5 text-center">
        <p className="text-white/20 font-sans tracking-[0.2em] uppercase text-xs">More analytics coming soon</p>
      </div>
    </div>
  );
}
