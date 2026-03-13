import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import GlobalAdPopup from '@/components/GlobalAdPopup';
import EnquiryModal from '@/components/layout/EnquiryModal';
import EnquiryOnLoad from '@/components/layout/EnquiryOnLoad';
import { EnquiryProvider } from '@/context/EnquiryContext';
import { courseService } from '@/services/courseService';
import { settingsService } from '@/services/settingsService';

export const metadata: Metadata = {
  metadataBase: new URL('https://maacdibrugarh.com'),
  title: 'MAAC Dibrugarh - Animation, VFX, and Digital Content Academy',
  description: 'Official website for MAAC Dibrugarh, the premier academy for Animation, VFX, 3D, and AI-driven marketing solutions.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [publishedCourses, settings] = await Promise.all([
    courseService.getPublished(),
    settingsService.getSettings()
  ]);
  
  const courseTitles = publishedCourses.map(c => c.title);

  return (
    <html lang="en">
      <body className="font-sans antialiased text-white bg-obsidian-black selection:bg-maac-gold selection:text-obsidian-black">
        <EnquiryProvider initialCourses={courseTitles} contactPhone={settings.contactPhone}>
          <div className="noise-overlay" />
          <Navbar />
          <GlobalAdPopup />
          <EnquiryModal />
          <EnquiryOnLoad />
          <main className="relative">
            {children}
          </main>
        </EnquiryProvider>
      </body>
    </html>
  );
}
