'use client';

import CoursesSection from '@/components/sections/CoursesSection';

export default function CoursesPage() {
  return (
    <div className="pt-24 min-h-screen bg-obsidian-black">
      <CoursesSection />
      <section className="py-24 border-t border-deep-navy">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-heading mb-12 text-center">Upcoming Batches & Workshops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Simple placeholder for upcoming content */}
             {[1, 2, 3].map(i => (
               <div key={i} className="bg-deep-navy border border-white/5 p-8">
                  <span className="text-maac-gold text-xs font-heading uppercase tracking-widest block mb-2">Next Batch</span>
                  <h4 className="text-xl font-heading mb-4">Advance VFX Plus</h4>
                  <p className="text-white/40 font-sans mb-6">Starting 15th April 2026. Limited seats available.</p>
                  <button className="text-white font-heading text-sm uppercase tracking-wider border-b border-maac-gold pb-1">Register Now</button>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
}
