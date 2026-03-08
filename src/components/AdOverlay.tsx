'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Ad } from '@/types';

export default function AdOverlay({ ad }: { ad: Ad | null }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (ad) {
      // Check session storage to show once per session
      const hasSeen = sessionStorage.getItem(`ad_${ad.id}`);
      if (!hasSeen) {
        setIsOpen(true);
      }
    }
  }, [ad]);

  const handleClose = () => {
    if (ad) {
      sessionStorage.setItem(`ad_${ad.id}`, 'true');
    }
    setIsOpen(false);
  };

  if (!ad || !isOpen) return null;

  const isVideo = ad.mediaUrl.includes('video') || ad.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-deep-navy border border-white/10 shadow-2xl overflow-hidden group"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-electric-red transition-all rounded-full"
          >
            <X size={24} />
          </button>

          <a href={ad.targetLink} target="_blank" rel="noopener noreferrer" className="block relative aspect-video md:aspect-[21/9]">
            {isVideo ? (
              <video
                src={ad.mediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={ad.mediaUrl}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
               <div className="flex items-center gap-3 bg-maac-gold text-black px-6 py-3 font-heading text-xs uppercase tracking-widest shadow-xl">
                  Learn More <ExternalLink size={14} />
               </div>
            </div>
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
