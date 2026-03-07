'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function HomeHero() {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start">
      {/* Background Video (Placeholder) */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30 scale-110"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-stars-in-the-night-sky-flowing-slowly-39833-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-black via-transparent to-obsidian-black" />
      </div>

      {/* Video Text Clipping - Visual Impact */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="relative inline-block mb-4">
             <h1 className="text-7xl md:text-9xl font-heading leading-none tracking-tighter text-white mix-blend-difference">
              VFX<br />
              <span className="text-maac-gold">STUDIO</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-2xl text-white/60 max-w-2xl mx-auto font-sans mt-8 uppercase tracking-widest">
            MAAC DIBRUGARH: Master the Art of <span className="text-white">Animation</span>
          </p>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <button className="group bg-electric-red text-white px-10 py-4 font-heading uppercase tracking-widest text-lg transition-all hover:pr-8">
              <span className="flex items-center gap-2">
                Explore Courses <ChevronRight className="transition-transform group-hover:translate-x-2" />
              </span>
            </button>
            <button className="border border-white/20 hover:border-maac-gold hover:text-maac-gold text-white px-10 py-4 font-heading uppercase tracking-widest text-lg transition-all">
              Watch Reel
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-maac-gold/50"
      >
        <div className="w-px h-16 bg-gradient-to-b from-maac-gold/0 via-maac-gold to-maac-gold/0 mx-auto" />
      </motion.div>
    </section>
  );
}
