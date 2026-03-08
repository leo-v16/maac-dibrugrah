import HomeHero from '@/components/sections/HomeHero';
import AboutSection from '@/components/sections/AboutSection';
import CoursesSection from '@/components/sections/CoursesSection';
import ContactSection from '@/components/sections/ContactSection';
import MapSection from '@/components/sections/MapSection';
import { courseService } from '@/services/courseService';

export default async function Home() {
  const allCourses = await courseService.getPublished();
  const topCourses = allCourses.slice(0, 3);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-proximity scroll-smooth">
      <HomeHero />
      <AboutSection />
      <CoursesSection courses={topCourses} />
      <ContactSection />
      <MapSection />
    </div>
  );
}
