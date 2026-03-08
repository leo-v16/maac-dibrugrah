import { courseService } from '@/services/courseService';
import CourseGrid from '@/components/sections/CourseGrid';

export default async function CoursesPage() {
  const courses = await courseService.getPublished();

  return (
    <div className="pt-32 pb-24 bg-obsidian-black min-h-screen text-white">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-heading mb-4 uppercase tracking-tight">
            Our <span className="text-maac-gold">Courses</span>
          </h1>
          <p className="text-white/40 font-sans tracking-widest uppercase text-sm">
            Professional Career Programs in Digital Arts
          </p>
        </div>

        {courses.length > 0 ? (
          <CourseGrid courses={courses} />
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 italic text-white/20 font-sans">
            No courses are currently listed. Please check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
