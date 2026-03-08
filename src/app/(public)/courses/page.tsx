'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getPublished().then(data => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-32 pb-24 bg-obsidian-black min-h-screen text-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-heading mb-4">
            Our <span className="text-maac-gold">Courses</span>
          </h1>
          <p className="text-white/40 font-sans tracking-widest uppercase text-sm">
            Professional Career Programs in Digital Arts
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-deep-navy aspect-video animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-deep-navy border border-white/5 overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-obsidian-black/80 backdrop-blur px-3 py-1 text-[10px] font-heading uppercase tracking-widest text-maac-gold border border-maac-gold/20">
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
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/10 italic text-white/20">
            No courses are currently listed. Please check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
