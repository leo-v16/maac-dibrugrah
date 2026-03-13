'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { parseDriveUrl } from '@/utils/drive';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
  const isDirectVideo = videoUrl?.includes('/video/upload/') || videoUrl?.match(/\.(mp4|webm|ogg|mov)$/i);
  const isDrive = videoUrl?.includes('drive.google.com');
  
  // Choose the best URL based on the source
  const finalUrl = isDrive 
    ? parseDriveUrl(videoUrl, isDirectVideo ? 'direct' : 'preview')
    : videoUrl;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-250 flex items-center justify-center p-4 md:p-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-6xl aspect-video bg-black shadow-2xl border border-white/10"
          >
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 text-white/50 hover:text-white flex items-center gap-2 font-heading text-xs uppercase tracking-widest transition-colors"
            >
              Close <X size={20} />
            </button>

            {finalUrl ? (
              isDirectVideo ? (
                <video 
                  src={finalUrl} 
                  controls 
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <iframe
                  src={finalUrl}
                  className="w-full h-full"
                  allow="fullscreen; picture-in-picture"
                  allowFullScreen
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/20 font-heading text-xs uppercase tracking-[0.3em] italic">
                Media source not found
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
