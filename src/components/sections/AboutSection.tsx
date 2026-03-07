'use client';

import { motion } from 'framer-motion';
import { Award, Users, Camera, Globe } from 'lucide-react';

const stats = [
  { icon: Award, label: 'Industry Awards', value: '50+' },
  { icon: Users, label: 'Expert Faculty', value: '12+' },
  { icon: Camera, label: 'Modern Studios', value: '5+' },
  { icon: Globe, label: 'Alumni Network', value: '1000+' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative h-screen flex items-center justify-center overflow-hidden bg-deep-navy snap-start">
      <div className="container mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading mb-6 leading-tight">
              A Studio-Driven <span className="text-maac-gold">Learning</span> Experience
            </h2>
            <p className="text-white/70 font-sans text-lg mb-8 leading-relaxed max-w-xl">
              At MAAC Dibrugarh, we don't just teach software; we cultivate artists. Our campus is designed to mimic a professional production studio environment, ensuring students are industry-ready from day one.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex flex-col"
                >
                  <stat.icon className="text-maac-gold mb-2" size={24} />
                  <span className="text-2xl font-heading text-white">{stat.value}</span>
                  <span className="text-xs uppercase tracking-widest text-white/40">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Image/Visuals (Placeholder) */}
        <div className="flex-1 w-full max-w-lg aspect-square relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full border border-white/10 rounded-sm p-4"
          >
            <div className="w-full h-full bg-gradient-to-tr from-maac-gold/20 via-obsidian-black to-royal-blue/20 flex items-center justify-center">
              <span className="text-maac-gold font-heading tracking-widest text-lg opacity-20">STUDIO_CAMPUS_PREVIEW</span>
            </div>
            
            {/* Animated Floating Elements */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-6 -right-6 w-32 h-32 border border-maac-gold opacity-20"
            />
            <motion.div
              animate={{ x: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-6 -left-6 w-24 h-24 border border-royal-blue opacity-20"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
