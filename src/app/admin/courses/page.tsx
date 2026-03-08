'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await courseService.getAll();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this career program?')) {
      try {
        await courseService.delete(id);
        fetchCourses();
      } catch (err) {
        alert('Error deleting course');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-heading mb-2">
            Course <span className="text-maac-gold">CMS</span>
          </h1>
          <p className="text-white/20 text-xs uppercase tracking-[0.2em]">Manage academic programs</p>
        </div>
        
        <Link 
          href="/admin/courses/new" 
          className="bg-maac-gold text-obsidian-black px-8 py-3 font-heading text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-maac-gold/5"
        >
          <Plus size={18} /> New Course
        </Link>
      </div>

      {loading ? (
        <div className="text-white/20 font-sans animate-pulse">Fetching Curriculum Data...</div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course, idx) => (
            <motion.div 
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-deep-navy p-6 flex flex-col md:flex-row justify-between items-center border border-white/5 group hover:border-maac-gold/30 transition-all"
            >
              <div className="flex items-center gap-6">
                 <div className="w-20 h-12 bg-obsidian-black border border-white/5 overflow-hidden hidden sm:block">
                    <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div>
                    <h3 className="font-heading text-lg group-hover:text-maac-gold transition-colors">{course.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                       <span className="text-[10px] text-white/30 uppercase tracking-widest">{course.duration}</span>
                       <span className={`text-[10px] uppercase tracking-widest flex items-center gap-1 ${course.status === 'published' ? 'text-maac-gold' : 'text-electric-red'}`}>
                          {course.status === 'published' ? <Eye size={10} /> : <EyeOff size={10} />}
                          {course.status}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-2 mt-6 md:mt-0">
                <Link 
                  href={`/courses/${course.slug}`} 
                  target="_blank"
                  className="p-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                  title="View Public Page"
                >
                  <ExternalLink size={18} />
                </Link>
                <button 
                  className="p-3 bg-white/5 hover:bg-royal-blue/20 text-white/40 hover:text-royal-blue transition-all"
                  title="Edit Course"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(course.id)}
                  className="p-3 bg-white/5 hover:bg-electric-red/20 text-white/40 hover:text-electric-red transition-all"
                  title="Delete Course"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}

          {courses.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/5 text-white/20 italic font-sans">
               Your academy curriculum is empty. Add your first program to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
