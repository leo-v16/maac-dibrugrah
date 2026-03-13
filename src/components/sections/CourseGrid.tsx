'use client';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Award, Clock } from 'lucide-react';
import { Course } from '@/types';
import { MouseEvent } from 'react';
import { useEnquiryModal } from '@/context/EnquiryContext';

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
  const { openModal } = useEnquiryModal();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightStyle = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(255, 215, 0, 0.1), transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      className="group relative bg-[#161B22] rounded-[24px] p-[20px] border border-white/5 overflow-hidden flex flex-col hover:border-maac-gold/30 transition-all duration-500 spotlight-card shadow-xl hover:shadow-maac-gold/5"
    >
      {/* Interactive Spotlight Layer */}
      <motion.div 
        className="pointer-events-none absolute -inset-px z-10 opacity-0 group-hover:opacity-100 transition duration-300 rounded-[24px]"
        style={{ background: spotlightStyle }}
      />

      {/* Header: Media Area */}
      <div className="relative aspect-video rounded-[12px] overflow-hidden bg-black mb-4">
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
        
        {/* Glassmorphism Badge */}
        <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full z-20 max-w-[80%]">
          <span className="text-[9px] font-heading uppercase tracking-widest text-white flex items-center gap-2 truncate">
            <div className="w-1.5 h-1.5 bg-maac-gold rounded-full animate-pulse flex-shrink-0" />
            {course.title}
          </span>
        </div>

        {/* Play/Award Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <div className="w-14 h-14 rounded-full bg-maac-gold/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-maac-gold animate-float shadow-2xl">
             {isVideoFunc(course.thumbnailUrl) ? <Play size={24} fill="currentColor" /> : <Award size={24} />}
          </div>
        </div>
      </div>

      {/* Typography Section */}
      <div className="flex-1 flex flex-col relative z-20">
        <h3 className="text-2xl font-bold font-sans text-white mb-3 group-hover:text-maac-gold transition-colors duration-300 leading-tight">
          {course.title}
        </h3>
        
        {/* Quick Info Row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Clock size={14} className="text-maac-gold" />
            {course.duration}
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
            <Award size={14} className="text-maac-gold" />
            Certified
          </div>
        </div>

        <p className="text-white/40 text-sm mb-8 line-clamp-2 font-sans leading-relaxed group-hover:text-white/60 transition-colors">
          {course.excerpt}
        </p>
        
        {/* Actions: Dual Button Row */}
        <div className="mt-auto grid grid-cols-2 gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="bg-linear-to-r from-maac-gold to-[#FF8C00] hover:brightness-110 text-obsidian-black h-[48px] rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-maac-gold/10 active:scale-95"
          >
            Details
          </Link>
          <button
            onClick={() => openModal(course.title)}
            className="border-2 border-maac-gold text-maac-gold hover:bg-maac-gold/5 h-[48px] rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          >
            Enquire
          </button>
        </div>
      </div>
      
      {/* Bottom Shimmer Accent */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-maac-gold to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left" />
    </motion.div>
  );
}
