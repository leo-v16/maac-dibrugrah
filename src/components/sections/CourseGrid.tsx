'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Course } from '@/types';

export default function CourseGrid({ courses }: { courses: Course[] }) {
  const isVideo = (url: string) => {
    return url.includes('/video/upload/') || url.match(/\.(mp4|webm|ogg|mov)$/i);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course, idx) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-deep-navy border border-white/5 overflow-hidden group flex flex-col"
        >
          <div className="relative aspect-video overflow-hidden bg-black">
            {isVideo(course.thumbnailUrl) ? (
              <video
                src={course.thumbnailUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <Image
                src={course.thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            )}
            <div className="absolute top-4 right-4 bg-obsidian-black/80 backdrop-blur px-3 py-1 text-[10px] font-heading uppercase tracking-widest text-maac-gold border border-maac-gold/20 z-10">
              {course.duration}
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <h3 className="text-xl font-heading mb-3 group-hover:text-maac-gold transition-colors">
              {course.title}
            </h3>
            <p className="text-white/40 text-sm mb-8 line-clamp-2 font-sans leading-relaxed">
              {course.excerpt}
            </p>
            
            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
              <Link
                href={`/courses/${course.slug}`}
                className="inline-flex items-center gap-2 bg-electric-red hover:bg-white text-white hover:text-obsidian-black px-6 py-3 font-heading text-[10px] uppercase tracking-[0.2em] transition-all"
              >
                View Details <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
