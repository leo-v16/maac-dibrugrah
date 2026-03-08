'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import Link from 'next/link';

const borderColors = [
  'border-maac-gold',
  'border-electric-red',
  'border-royal-blue',
];

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getPublished();
        // Show only the top 3 on the home page for impact
        setCourses(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch courses for home page", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

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
  }, [loading]); // Re-bind if loading state changes

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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-deep-navy h-[400px] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`group spotlight-hover bg-deep-navy border-t-2 ${borderColors[idx % borderColors.length]} flex flex-col justify-between aspect-[3/4] cursor-pointer transition-all duration-500 hover:-translate-y-4 relative overflow-hidden`}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={course.thumbnailUrl} 
                    alt="" 
                    className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-deep-navy/80 to-transparent" />
                </div>

                <Link href={`/courses/${course.slug}`} className="absolute inset-0 z-20" />
                
                <div className="relative z-10 p-10">
                   <span className="text-white/20 font-heading text-6xl mb-6 block">0{idx + 1}</span>
                   <h3 className="text-2xl font-heading mb-4 group-hover:text-maac-gold transition-colors">{course.title}</h3>
                   <p className="text-white/60 font-sans leading-relaxed line-clamp-4">{course.excerpt}</p>
                </div>
                
                <div className="relative z-10 p-10 pt-0 flex items-center gap-2 text-maac-gold font-heading text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-12 text-white/20 italic">
            Check back soon for our latest programs.
          </div>
        )}
      </div>
    </section>
  );
}
