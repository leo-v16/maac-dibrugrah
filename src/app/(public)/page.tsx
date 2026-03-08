import HomeHero from '@/components/sections/HomeHero';
import AboutSection from '@/components/sections/AboutSection';
import CoursesSection from '@/components/sections/CoursesSection';
import ContactSection from '@/components/sections/ContactSection';
import MapSection from '@/components/sections/MapSection';

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto snap-y snap-proximity scroll-smooth">
      <HomeHero />
      <AboutSection />
      <CoursesSection />
      <ContactSection />
      <MapSection />
    </div>
  );
}
