'use client';

import ContactSection from '@/components/sections/ContactSection';
import MapSection from '@/components/sections/MapSection';

export default function ContactPage() {
  return (
    <div className="pt-24 min-h-screen bg-obsidian-black flex flex-col">
      <ContactSection />
      <MapSection />
    </div>
  );
}
