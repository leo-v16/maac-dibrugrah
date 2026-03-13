'use client';

import { useState, MouseEvent } from 'react';
import { GalleryItem } from '@/types';
import { parseDriveUrl } from '@/utils/drive';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Play, Image as ImageIcon } from 'lucide-react';

export default function GalleryCard({ item }: { item: GalleryItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const parsedThumbnail = parseDriveUrl(item.thumbnailUrl);
  const parsedVideo = item.videoUrl ? parseDriveUrl(item.videoUrl) : '';

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightStyle = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255, 215, 0, 0.1), transparent 80%)`;

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#161B22] overflow-hidden border border-white/5 transition-all duration-500 hover:border-maac-gold/30 hover:shadow-2xl hover:shadow-maac-gold/5 spotlight-card"
    >
      {/* Interactive Spotlight */}
      <motion.div 
        className="pointer-events-none absolute -inset-px z-10 opacity-0 group-hover:opacity-100 transition duration-300"
        style={{ background: spotlightStyle }}
      />

      {/* Media Area */}
      <div className="relative aspect-video overflow-hidden bg-black flex items-center justify-center">
        {item.mediaType === 'image' ? (
          <img 
            src={parsedThumbnail} 
            alt={item.title} 
            loading="lazy" 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
          />
        ) : (
          <>
            {isHovered && parsedVideo ? (
              <video 
                src={parsedVideo} 
                autoPlay 
                playsInline 
                muted 
                loop
                className="object-cover w-full h-full" 
              />
            ) : (
              <img 
                src={parsedThumbnail} 
                alt={item.title} 
                loading="lazy" 
                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" 
              />
            )}
            
            {/* Visual Type Indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className={`w-14 h-14 bg-maac-gold/10 border border-maac-gold/20 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-500 ${isHovered ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}>
                {item.mediaType === 'video' ? (
                  <Play size={24} className="text-maac-gold fill-current ml-1" />
                ) : (
                  <ImageIcon size={24} className="text-maac-gold" />
                )}
              </div>
            </div>
          </>
        )}
        
        {/* Hover Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-obsidian-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
      </div>

      {/* Text Area */}
      <div className="p-6 relative z-20">
        <h3 className="text-lg font-heading text-white line-clamp-1 mb-1 group-hover:text-maac-gold transition-colors duration-300 uppercase tracking-tight">
          {item.title}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40 font-sans tracking-widest uppercase">
            Artist: <span className="text-white/60">{item.studentName}</span>
          </p>
          <div className="w-1 h-1 bg-maac-gold rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Border Accent */}
      <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-maac-gold group-hover:w-full transition-all duration-700" />
    </motion.div>
  );
}
