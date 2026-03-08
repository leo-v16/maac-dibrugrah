'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { GalleryItem } from '@/types';
import GalleryCard from '../GalleryCard';
import Link from 'next/link';

export default function GallerySection({ items }: { items: GalleryItem[] }) {
  return (
    <section id="gallery" className="relative h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start">
      <div className="container mx-auto px-6 py-20 flex flex-col h-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-heading mb-4 uppercase">
              Student <span className="text-maac-gold">Showcase</span>
            </h2>
            <p className="text-white/40 font-sans tracking-widest uppercase text-sm">
              Discover the next generation of VFX & Animation masters
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Link 
              href="/gallery"
              className="group flex items-center gap-2 text-maac-gold font-heading text-xs uppercase tracking-[0.2em] border-b border-maac-gold/20 pb-2 hover:text-white hover:border-white transition-all"
            >
              View Full Gallery <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="h-full"
            >
              <GalleryCard item={item} />
            </motion.div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/5 text-white/20 italic font-sans">
            Our showcase is coming soon.
          </div>
        )}
      </div>
    </section>
  );
}
