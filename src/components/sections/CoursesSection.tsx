'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Course } from '@/types';
import Link from 'next/link';

const borderColors = [
  'border-maac-gold',
  'border-electric-red',
  'border-royal-blue',
];

export default function CoursesSection({ courses }: { courses: Course[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isVideo = (url: string) => {
    return url?.includes('/video/upload/') || url?.match(/\.(mp4|webm|ogg|mov)$/i);
  };

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
    <section id="courses" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start py-8 md:py-0">
      <div className="container mx-auto px-6 py-8" ref={containerRef}>
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-2xl text-left"
          >
            <h2 className="text-2xl md:text-4xl font-heading mb-2 uppercase">
              Our Flagship <span className="text-maac-gold">Programs</span>
            </h2>
            <p className="text-white/60 font-sans text-xs md:text-sm leading-relaxed mb-4">
              We offer a wide range of career-oriented courses designed to make you industry-ready from day one.
            </p>
            <div className="space-y-3">
              <p className="text-maac-gold font-heading text-xs md:text-sm uppercase tracking-widest">So which are you interested in?</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-white/50 font-sans text-[10px] md:text-xs uppercase tracking-wider">
                <span className="hover:text-maac-gold transition-colors cursor-default">Graphic Design</span>
                <span className="text-maac-gold/30">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">2D Animation</span>
                <span className="text-maac-gold/30">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">3D Animation</span>
                <span className="text-maac-gold/30">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Visual Effects (VFX)</span>
                <span className="text-maac-gold/30">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Video Editing</span>
                <span className="text-maac-gold/30">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Game Design</span>
                <span className="text-maac-gold/30">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Interior Design</span>
                <span className="text-maac-gold/30">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Web Design (UI/UX)</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="w-full flex justify-center md:w-auto md:block"
          >
            <Link 
              href="/courses"
              className="group flex items-center gap-3 text-maac-gold font-heading text-xs md:text-sm uppercase tracking-[0.2em] transition-all hover:text-white border border-maac-gold/20 hover:border-white/40 px-6 py-3 rounded-full bg-white/5 hover:bg-white/10"
            >
              View All Courses <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`group spotlight-hover bg-deep-navy border-t-2 ${borderColors[idx % borderColors.length]} flex flex-col justify-between aspect-video md:aspect-[4/3] lg:aspect-[1.2/1] cursor-pointer transition-all duration-500 hover:-translate-y-2 relative overflow-hidden`}
            >
              {/* Background Media with Overlay */}
              <div className="absolute inset-0 z-0 bg-black">
                {isVideo(course.thumbnailUrl) ? (
                  <video 
                    src={course.thumbnailUrl} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700"
                  />
                ) : (
                  <img 
                    src={course.thumbnailUrl} 
                    alt="" 
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" 
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/60 to-transparent" />
              </div>

              <Link href={`/courses/${course.slug}`} className="absolute inset-0 z-20" />
              
              <div className="relative z-10 p-6">
                 <h3 className="text-xl md:text-2xl font-heading mb-3 group-hover:text-maac-gold transition-colors uppercase leading-tight line-clamp-2">{course.title}</h3>
                 <p className="text-white/70 font-sans text-xs leading-relaxed line-clamp-3">{course.excerpt}</p>
              </div>
              
              <div className="relative z-10 p-6 pt-0 flex items-center gap-2 text-maac-gold font-heading text-[10px] tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Learn More <ChevronRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-8 text-white/20 italic font-sans text-sm">
            Check back soon for our latest programs.
          </div>
        )}
      </div>
    </section>
  );
}
