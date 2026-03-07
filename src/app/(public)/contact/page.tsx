'use client';

import ContactSection from '@/components/sections/ContactSection';

export default function ContactPage() {
  return (
    <div className="pt-24 min-h-screen bg-obsidian-black">
      <ContactSection />
      
      {/* Map or more details */}
      <section className="py-24 border-t border-deep-navy bg-deep-navy">
        <div className="container mx-auto px-6 text-center">
           <h3 className="text-3xl font-heading mb-8">Visit Our Studio</h3>
           <div className="w-full h-96 bg-obsidian-black border border-white/5 flex items-center justify-center opacity-50 mb-12">
              <span className="font-heading tracking-[0.3em] uppercase opacity-20">INTERACTIVE_MAP_PREVIEW</span>
           </div>
           
           <div className="max-w-2xl mx-auto space-y-4">
              <h4 className="text-maac-gold font-heading text-lg">Operating Hours</h4>
              <p className="text-white/60 font-sans tracking-widest uppercase text-sm">Mon - Sat: 10:00 AM - 7:00 PM</p>
           </div>
        </div>
      </section>
    </div>
  );
}
