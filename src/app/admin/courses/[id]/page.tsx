'use client';

import { useEffect, useState, use } from 'react';
import { courseService } from '@/services/courseService';
import { Course } from '@/types';
import CourseForm from '@/components/admin/CourseForm';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getById(id);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="text-maac-gold pt-32 text-center font-heading uppercase tracking-widest">Loading Program Data...</div>;
  if (!course) return <div className="text-white pt-32 text-center font-heading uppercase tracking-widest">Program not found.</div>;

  return <CourseForm initialData={course} id={id} />;
}
