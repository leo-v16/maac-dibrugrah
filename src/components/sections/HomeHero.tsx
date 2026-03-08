'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEnquiryModal } from '@/context/EnquiryContext';
import { BRAND_ASSETS } from '@/lib/constants';
import VideoModal from '../VideoModal';

const InteractiveHeroBackground = dynamic(
  () => import('@/components/3d/InteractiveHeroBackground'),
  { ssr: false }
);

export default function HomeHero() {
  const { openModal } = useEnquiryModal();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start">
      {/* 3D Interactive Background */}
      <InteractiveHeroBackground />
      
      {/* Gradient Overlay for seamless blending with content */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-obsidian-black/50 via-transparent to-obsidian-black pointer-events-none" />

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
            <button 
              onClick={openModal}
              className="group bg-electric-red text-white px-10 py-4 font-heading uppercase tracking-widest text-lg transition-all hover:pr-8"
            >
              <span className="flex items-center gap-2">
                Explore Courses <ChevronRight className="transition-transform group-hover:translate-x-2" />
              </span>
            </button>
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="group border border-white/20 hover:border-maac-gold hover:text-maac-gold text-white px-10 py-4 font-heading uppercase tracking-widest text-lg transition-all flex items-center gap-3"
            >
              <Play size={18} className="transition-transform group-hover:scale-110" /> Watch Reel
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

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        videoUrl={BRAND_ASSETS.SHOWREEL_URL} 
      />
    </section>
  );
}
