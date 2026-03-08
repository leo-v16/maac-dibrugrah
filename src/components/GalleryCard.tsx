'use client';

import { useState } from 'react';
import { GalleryItem } from '@/types';
import { parseDriveUrl } from '@/utils/drive';

export default function GalleryCard({ item }: { item: GalleryItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const parsedThumbnail = parseDriveUrl(item.thumbnailUrl);
  const parsedVideo = item.videoUrl ? parseDriveUrl(item.videoUrl) : '';

  return (
    <div 
      className="bg-[#161B22] rounded-xl overflow-hidden border border-white/5 transition-all duration-300 hover:border-maac-gold/30 hover:shadow-2xl hover:shadow-maac-gold/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Media Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-black flex items-center justify-center">
        {item.mediaType === 'image' ? (
          <img 
            src={parsedThumbnail} 
            alt={item.title} 
            loading="lazy" 
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
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
                className="object-cover w-full h-full" 
              />
            )}
            {!isHovered && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 bg-maac-gold/80 rounded-full flex items-center justify-center pl-1 backdrop-blur-sm">
                  <div className="border-t-[8px] border-t-transparent border-l-[12px] border-l-obsidian-black border-b-[8px] border-b-transparent" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Text Area */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white line-clamp-1 mb-1 group-hover:text-maac-gold transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-400 font-sans tracking-wide">
          By {item.studentName}
        </p>
      </div>
    </div>
  );
}
