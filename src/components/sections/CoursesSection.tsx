'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Course } from '@/types';
import Link from 'next/link';
import CourseGrid from './CourseGrid';

export default function CoursesSection({ courses }: { courses: Course[] }) {
  const interests = [
    "Graphic Design", "2D Animation", "3D Animation", 
    "Visual Effects (VFX)", "Video Editing", "Game Design", 
    "Interior Design", "Web Design (UI/UX)"
  ];

  return (
    <section id="courses" className="relative overflow-hidden bg-obsidian-black snap-start py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-3xl text-left"
          >
            <h2 className="text-4xl md:text-6xl font-heading mb-6 uppercase tracking-tighter">
              Our Flagship <span className="text-maac-gold">Programs</span>
            </h2>
            <p className="text-white/60 font-sans text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              We offer a wide range of career-oriented courses designed to make you industry-ready from day one.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1px] bg-maac-gold/50" />
                <p className="text-maac-gold font-heading text-[10px] md:text-xs uppercase tracking-[0.3em]">Specialized Tracks</p>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-4 border-l border-white/5 pl-6 md:pl-8 overflow-visible">
                {interests.map((interest) => (
                  <div key={interest} className="group flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full bg-maac-gold/20 group-hover:bg-maac-gold transition-all duration-300 group-hover:scale-125 flex-shrink-0" />
                    <span className="text-white/30 font-sans text-[9px] md:text-[11px] uppercase tracking-[0.15em] group-hover:text-white transition-colors cursor-default whitespace-nowrap">
                      {interest}
                    </span>
                  </div>
                ))}
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
              className="group flex items-center gap-3 text-maac-gold font-heading text-xs md:text-sm uppercase tracking-[0.2em] transition-all hover:text-white border border-maac-gold/20 hover:border-white/40 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10"
            >
              Explore All <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {courses.length > 0 ? (
          <CourseGrid courses={courses} />
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 italic text-white/20 font-sans">
            Our flagship programs are being updated. Check back soon.
          </div>
        )}
      </div>
    </section>
  );
}
