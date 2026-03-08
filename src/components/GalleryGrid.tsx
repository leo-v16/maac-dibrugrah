'use client';

import { useState } from 'react';
import { GalleryItem } from '@/types';
import GalleryCard from './GalleryCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [visibleCount, setVisibleCount] = useState(10);
  
  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {visibleItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 10) * 0.05 }}
            >
              <GalleryCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={loadMore}
            className="group flex items-center gap-3 bg-deep-navy border border-white/10 px-10 py-4 font-heading text-xs uppercase tracking-[0.2em] text-white hover:bg-maac-gold hover:text-obsidian-black hover:border-maac-gold transition-all duration-300"
          >
            Load More Masterpieces
            <ChevronDown size={16} className="transition-transform group-hover:translate-y-1" />
          </button>
        </div>
      )}
    </div>
  );
}
