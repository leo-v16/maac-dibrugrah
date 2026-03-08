import HomeHero from '@/components/sections/HomeHero';
import AboutSection from '@/components/sections/AboutSection';
import CoursesSection from '@/components/sections/CoursesSection';
import ContactSection from '@/components/sections/ContactSection';
import MapSection from '@/components/sections/MapSection';
import GallerySection from '@/components/sections/GallerySection';
import { courseService } from '@/services/courseService';
import { galleryService } from '@/services/galleryService';

export default async function Home() {
  const [allCourses, allGalleryItems] = await Promise.all([
    courseService.getPublished(),
    galleryService.getAllItems()
  ]);

  const topCourses = allCourses.slice(0, 3);
  const topGalleryItems = allGalleryItems.slice(0, 4);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-proximity scroll-smooth">
      <HomeHero />
      <AboutSection />
      <CoursesSection courses={topCourses} />
      <GallerySection items={topGalleryItems} />
      <ContactSection />
      <MapSection />
    </div>
  );
}
