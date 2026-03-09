'use client';

import React from 'react';
import Link from 'next/link';

export default function EventsPromo() {
  return (
    <section 
      className="py-16 lg:py-24 px-6 lg:px-12 relative overflow-hidden snap-start min-h-screen flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, #383F4B 0%, #212436 50%, #2D144B 100%)' 
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-maac-gold/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-royal-blue/5 blur-3xl rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <h2 className="text-[8vw] sm:text-[6vw] lg:text-5xl font-heading font-bold text-white leading-tight uppercase text-center lg:text-left">
              MAAC Dibrugarh Events: <br className="hidden md:block" />
              <span className="text-maac-gold">Celebrating Creativity and Innovation</span>
            </h2>
            
            <div className="space-y-6 text-center lg:text-left">
              <p className="text-white text-xl font-heading font-medium">
                MAAC Dibrugarh is where talent comes to shine!
              </p>
              <p className="text-white/80 text-lg font-sans leading-relaxed">
                Our dynamic events and competitions are designed to ignite creativity, showcase the skills of budding animators, designers, and filmmakers, and provide hands-on experience to prepare students for real-world challenges.
              </p>
            </div>

            <div className="pt-4 flex justify-center lg:justify-start">
              <Link 
                href="/courses"
                className="inline-block border-2 border-maac-gold text-maac-gold rounded-full px-10 py-4 font-heading uppercase tracking-widest text-sm hover:bg-maac-gold hover:text-obsidian-black transition-all duration-300"
              >
                Explore All Courses
              </Link>
            </div>
          </div>

          {/* Right Column: Certification Vertical Banners Side-by-Side */}
          <div className="flex flex-row items-center justify-center lg:justify-end gap-4 md:gap-8 order-1 lg:order-2">
            
            {/* Logo 1 Card: Skill India Vertical Banner */}
            <div className="bg-white px-6 py-12 rounded-2xl shadow-2xl flex items-center justify-center aspect-[2/3] w-full max-w-[160px] md:max-w-[220px] group hover:-translate-y-2 transition-all duration-500">
              <img 
                src="https://www.uxdt.nic.in/wp-content/uploads/2020/06/Skill-India_Preview.png" 
                alt="Skill India Certification" 
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Logo 2 Card: NSDC Vertical Banner */}
            <div className="bg-white px-6 py-12 rounded-2xl shadow-2xl flex items-center justify-center aspect-[2/3] w-full max-w-[160px] md:max-w-[220px] group hover:-translate-y-2 transition-all duration-500">
              <img 
                src="https://www.uxdt.nic.in/wp-content/uploads/2020/06/NSDC-Preview.png" 
                alt="NSDC Certification" 
                className="w-full h-auto object-contain"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
