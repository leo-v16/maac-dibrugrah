'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { Ad } from '@/types';
import { parseDriveUrl } from '@/utils/drive';

export default function AdOverlay({ ads }: { ads: Ad[] }) {
  const pathname = usePathname();
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Find the first ad that matches the current path
    const matchedAd = ads.find(ad => 
      ad.targetPages?.some(p => p === '*' || p === 'all' || p === pathname)
    );

    if (matchedAd) {
      // Check session storage
      const hasSeen = sessionStorage.getItem(`ad_${matchedAd.id}`);
      if (!hasSeen) {
        const delay = matchedAd.delaySeconds ?? 3;
        const timer = setTimeout(() => {
          setActiveAd(matchedAd);
          setIsOpen(true);
        }, delay * 1000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsOpen(false);
      setActiveAd(null);
    }
  }, [ads, pathname]);

  const handleClose = () => {
    if (activeAd) {
      sessionStorage.setItem(`ad_${activeAd.id}`, 'true');
    }
    setIsOpen(false);
  };

  if (!activeAd || !isOpen) return null;

  const parsedMediaUrl = parseDriveUrl(activeAd.mediaUrl);
  const isVideo = activeAd.mediaUrl.includes('video') || activeAd.mediaUrl.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-obsidian-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-deep-navy border border-maac-gold/20 shadow-[0_0_50px_rgba(255,215,0,0.1)] overflow-hidden group rounded-sm"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 bg-obsidian-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-electric-red transition-all rounded-full"
          >
            <X size={20} />
          </button>

          <a href={activeAd.targetLink} target="_blank" rel="noopener noreferrer" className="block relative aspect-[4/5] md:aspect-[21/9] overflow-hidden">
            {isVideo ? (
              <video
                src={parsedMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <img
                src={parsedMediaUrl}
                alt={activeAd.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            
            {/* Always-on gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-black via-obsidian-black/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
            
            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div className="flex-1">
                   <span className="inline-block px-3 py-1 bg-electric-red text-white text-[9px] font-heading uppercase tracking-widest mb-3 animate-pulse">
                     Special Announcement
                   </span>
                   <h2 className="text-3xl md:text-5xl font-heading text-white leading-tight drop-shadow-lg">
                     {activeAd.title}
                   </h2>
                 </div>
                 
                 <div className="shrink-0">
                   <div className="flex items-center gap-3 bg-maac-gold text-obsidian-black px-8 py-4 font-heading text-sm uppercase tracking-widest hover:bg-white transition-colors">
                      Learn More <ExternalLink size={16} />
                   </div>
                 </div>
               </div>
            </div>
          </a>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
