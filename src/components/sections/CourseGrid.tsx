'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Award } from 'lucide-react';
import { Course } from '@/types';
import { MouseEvent } from 'react';

export default function CourseGrid({ courses }: { courses: Course[] }) {
  const isVideo = (url: string): boolean => {
    return !!(url?.includes('/video/upload/') || url?.match(/\.(mp4|webm|ogg|mov)$/i));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course, idx) => (
        <CourseCard key={course.id} course={course} idx={idx} isVideoFunc={isVideo} />
      ))}
    </div>
  );
}

function CourseCard({ course, idx, isVideoFunc }: { course: Course, idx: number, isVideoFunc: (url: string) => boolean }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightStyle = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255, 215, 0, 0.08), transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      className="group relative bg-deep-navy border border-white/5 overflow-hidden flex flex-col hover:border-maac-gold/30 transition-colors duration-500 spotlight-card"
    >
      {/* Interactive Spotlight Layer */}
      <motion.div 
        className="pointer-events-none absolute -inset-px z-10 opacity-0 group-hover:opacity-100 transition duration-300"
        style={{ background: spotlightStyle }}
      />

      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-black">
        {isVideoFunc(course.thumbnailUrl) ? (
          <video
            src={course.thumbnailUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}
        
        {/* Floating Tag */}
        <div className="absolute top-4 right-4 bg-obsidian-black/80 backdrop-blur px-3 py-1 text-[10px] font-heading uppercase tracking-widest text-maac-gold border border-maac-gold/20 z-20 group-hover:bg-maac-gold group-hover:text-obsidian-black transition-all">
          {course.duration}
        </div>

        {/* Play/Award Overlay */}
        <div className="absolute inset-0 bg-obsidian-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full bg-maac-gold/10 backdrop-blur-md border border-maac-gold/20 flex items-center justify-center text-maac-gold animate-float">
             {isVideoFunc(course.thumbnailUrl) ? <Play size={20} fill="currentColor" /> : <Award size={20} />}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col relative z-20">
        <h3 className="text-xl font-heading mb-3 group-hover:text-maac-gold transition-colors duration-300 tracking-tight">
          {course.title}
        </h3>
        <p className="text-white/40 text-sm mb-8 line-clamp-2 font-sans leading-relaxed group-hover:text-white/60 transition-colors">
          {course.excerpt}
        </p>
        
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <Link
            href={`/courses/${course.slug}`}
            className="btn-pulse inline-flex items-center gap-2 bg-electric-red hover:bg-maac-gold text-white hover:text-obsidian-black px-6 py-3 font-heading text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
          >
            Explore Course <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      {/* Bottom Shimmer */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-maac-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
    </motion.div>
  );
}
