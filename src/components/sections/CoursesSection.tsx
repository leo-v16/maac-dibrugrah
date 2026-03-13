'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Course } from '@/types';
import Link from 'next/link';
import CourseGrid from './CourseGrid';

export default function CoursesSection({ courses }: { courses: Course[] }) {
  return (
    <section id="courses" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start py-12 md:py-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-2xl text-left"
          >
            <h2 className="text-3xl md:text-5xl font-heading mb-4 uppercase">
              Our Flagship <span className="text-maac-gold">Programs</span>
            </h2>
            <p className="text-white/60 font-sans text-sm md:text-base leading-relaxed mb-6">
              We offer a wide range of career-oriented courses designed to make you industry-ready from day one.
            </p>
            <div className="space-y-4">
              <p className="text-maac-gold font-heading text-xs md:text-sm uppercase tracking-widest">Select Your Interest</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-white/40 font-sans text-[10px] md:text-xs uppercase tracking-wider">
                <span className="hover:text-maac-gold transition-colors cursor-default">Graphic Design</span>
                <span className="text-maac-gold/20">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">2D Animation</span>
                <span className="text-maac-gold/20">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">3D Animation</span>
                <span className="text-maac-gold/20">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Visual Effects (VFX)</span>
                <span className="text-maac-gold/20">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Video Editing</span>
                <span className="text-maac-gold/20">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Game Design</span>
                <span className="text-maac-gold/20">•</span>
                <span className="hover:text-maac-gold transition-colors cursor-default">Interior Design</span>
                <span className="text-maac-gold/20">•</span>
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
