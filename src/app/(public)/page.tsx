import HomeHero from '@/components/sections/HomeHero';
import AboutSection from '@/components/sections/AboutSection';
import CoursesSection from '@/components/sections/CoursesSection';
import ContactSection from '@/components/sections/ContactSection';
import MapSection from '@/components/sections/MapSection';
import EventsPromo from '@/components/sections/EventsPromo';
import { courseService } from '@/services/courseService';
import { settingsService } from '@/services/settingsService';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MAAC Dibrugarh | Best Animation, VFX & Gaming Institute in Assam',
  description: 'Join MAAC Dibrugarh for world-class training in 3D Animation, Visual Effects, Game Design, and Digital Content Creation. Master the art of visual storytelling.',
  keywords: ['Animation', 'VFX', 'Gaming', 'MAAC', 'Dibrugarh', 'Career Courses', 'Multimedia'],
  openGraph: {
    title: 'MAAC Dibrugarh - Official Website',
    description: 'Premier academy for Animation, VFX, and Digital Arts.',
    url: 'https://maacdibrugarh.com',
    siteName: 'MAAC Dibrugarh',
    type: 'website',
  },
};

export default async function Home() {
  const [allCourses, settings] = await Promise.all([
    courseService.getPublished(),
    settingsService.getSettings()
  ]);

  const topCourses = allCourses.slice(0, 3);

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth">
      <HomeHero 
        showreelUrl={settings.showreelUrl} 
        heading={settings.heroHeading}
        subheading={settings.heroSubheading}
      />
      <CoursesSection courses={topCourses} />
      <AboutSection 
        imageUrl={settings.aboutImageUrl}
      />
      <EventsPromo />
      <ContactSection settings={settings} />
      <MapSection 
        address={settings.contactAddress}
        operatingHours={settings.operatingHours}
      />
    </div>
  );
}
