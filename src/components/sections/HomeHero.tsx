'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEnquiryModal } from '@/context/EnquiryContext';
import VideoModal from '../VideoModal';

const InteractiveHeroBackground = dynamic(
  () => import('@/components/3d/InteractiveHeroBackground'),
  { ssr: false }
);

export default function HomeHero({ 
  showreelUrl,
  heading,
  subheading 
}: { 
  showreelUrl: string;
  heading: string;
  subheading: string;
}) {
  const { openModal } = useEnquiryModal();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start">
      {/* 3D Interactive Background */}
      <InteractiveHeroBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-obsidian-black/50 via-transparent to-obsidian-black pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-6 text-center pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow Label */}
          <div className="mb-4">
            <span className="text-maac-gold text-xs font-heading uppercase tracking-[0.3em]">
              Best Animation Academy
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-heading leading-tight tracking-tighter text-white uppercase max-w-5xl">
            Transform Your <span className="text-maac-gold">Creativity</span> Into A Career.
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-sans mt-8 leading-relaxed">
            {subheading}
          </p>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <Link 
              href="/courses"
              className="group bg-maac-gold text-obsidian-black px-10 py-4 rounded-full font-heading uppercase tracking-widest text-sm transition-all hover:bg-white flex items-center gap-2"
            >
              Explore Courses <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <button 
              onClick={() => setIsVideoModalOpen(true)}
              className="px-10 py-4 rounded-full bg-deep-navy text-white font-heading uppercase tracking-widest text-sm transition-all hover:bg-white/10 border border-white/5"
            >
              Our Story
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
        videoUrl={showreelUrl} 
      />
    </section>
  );
}
