'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { popupService } from '@/services/popupService';
import { PopupAd } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function PopupManager() {
  const pathname = usePathname();
  const [activePopup, setActivePopup] = useState<PopupAd | null>(null);

  useEffect(() => {
    // Don't show popups on admin routes
    if (pathname.startsWith('/admin')) {
      setActivePopup(null);
      return;
    }

    const checkAndShowPopup = async () => {
      try {
        console.log("PopupManager: Checking for active popups...");
        const popups = await popupService.getActivePopups();
        console.log(`PopupManager: Found ${popups.length} active popups in DB.`);
        
        // Find the first popup that matches the current page (or '*')
        const matchedPopup = popups.find(p => {
          const isGlobal = p.targetPages.some(page => page === '*' || page === 'all');
          const isExactMatch = p.targetPages.some(page => page === pathname);
          return isGlobal || isExactMatch;
        });

        if (matchedPopup) {
          console.log("PopupManager: Matched popup found:", matchedPopup.name);
          // Check session storage to prevent annoyance
          const hasSeen = sessionStorage.getItem(`popup_${matchedPopup.id}`);
          if (!hasSeen) {
            console.log(`PopupManager: Showing in ${matchedPopup.delaySeconds}s`);
            setTimeout(() => {
              setActivePopup(matchedPopup);
            }, matchedPopup.delaySeconds * 1000);
          } else {
            console.log("PopupManager: Already seen in this session.");
          }
        } else {
          console.log("PopupManager: No popup matches current path:", pathname);
        }
      } catch (err) {
        console.error("PopupManager Error:", err);
      }
    };

    checkAndShowPopup();
  }, [pathname]);

  const handleClose = () => {
    if (activePopup) {
      sessionStorage.setItem(`popup_${activePopup.id}`, 'true');
      setActivePopup(null);
    }
  };

  return (
    <AnimatePresence>
      {activePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-obsidian-black/80 backdrop-blur-sm"
          />
          
          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-deep-navy border border-white/10 flex flex-col md:flex-row overflow-hidden shadow-2xl"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-obsidian-black/50 backdrop-blur flex items-center justify-center text-white/50 hover:text-white hover:bg-electric-red transition-all"
            >
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden bg-obsidian-black">
              <div className="absolute inset-0 bg-gradient-to-t from-deep-navy via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-deep-navy z-10" />
              <img 
                src={activePopup.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'} 
                alt="Promotion" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text Section */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
               {/* Decorative glow */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-maac-gold/5 blur-[50px]" />
               
               <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
               >
                 <h2 className="text-3xl md:text-4xl font-heading mb-4 leading-tight">
                   {activePopup.heading.split(' ').map((word, i) => (
                     <span key={i} className={i % 2 !== 0 ? 'text-maac-gold' : ''}>{word} </span>
                   ))}
                 </h2>
                 <p className="text-white/60 font-sans text-lg mb-8 leading-relaxed">
                   {activePopup.subheading}
                 </p>
                 
                 <Link 
                   href={activePopup.buttonLink}
                   onClick={handleClose}
                   className="inline-flex group bg-electric-red text-white px-8 py-4 font-heading uppercase tracking-widest text-sm transition-all hover:pr-6"
                 >
                   <span className="flex items-center gap-2">
                     {activePopup.buttonText} <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                   </span>
                 </Link>
               </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
