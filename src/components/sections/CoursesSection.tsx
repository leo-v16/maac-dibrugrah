'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const courses = [
  {
    title: '3D Animation',
    desc: 'Master character animation, lighting, and cinematic storytelling.',
    color: 'border-maac-gold',
    hover: 'group-hover:bg-maac-gold/10'
  },
  {
    title: 'VFX (Visual Effects)',
    desc: 'Create explosive, Hollywood-grade visual effects and simulations.',
    color: 'border-electric-red',
    hover: 'group-hover:bg-electric-red/10'
  },
  {
    title: 'Game Design & AR/VR',
    desc: 'Build immersive worlds for next-gen gaming and metaverses.',
    color: 'border-royal-blue',
    hover: 'group-hover:bg-royal-blue/10'
  }
];

export default function CoursesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cards = container.getElementsByClassName('spotlight-hover');
      for (const card of cards as any) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="courses" className="relative h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start">
      <div className="container mx-auto px-6 py-20" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            Master the <span className="text-maac-gold">Digital</span> Arts
          </h2>
          <p className="text-white/40 font-sans tracking-widest uppercase text-sm">Our Signature Career Programs</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course, idx) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`group spotlight-hover bg-deep-navy border-t-2 ${course.color} p-10 flex flex-col justify-between aspect-[3/4] cursor-pointer transition-all duration-500 hover:-translate-y-4`}
            >
              <div>
                 <span className="text-white/20 font-heading text-6xl mb-6 block">0{idx + 1}</span>
                 <h3 className="text-2xl font-heading mb-4 group-hover:text-maac-gold transition-colors">{course.title}</h3>
                 <p className="text-white/60 font-sans leading-relaxed">{course.desc}</p>
              </div>
              
              <div className="flex items-center gap-2 text-maac-gold font-heading text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
