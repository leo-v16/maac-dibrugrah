'use client';

import { useEnquiryModal } from '@/context/EnquiryContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';

export default function BlogMobileCTA() {
  const { openModal } = useEnquiryModal();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 400px
      setIsVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 w-full z-40 lg:hidden p-4 bg-obsidian-black/80 backdrop-blur-lg border-t border-white/10"
        >
          <button
            onClick={() => openModal()}
            className="w-full bg-maac-gold text-obsidian-black py-4 font-heading uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            Ask about courses <MessageSquare size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
