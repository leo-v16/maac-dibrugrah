'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function MapSection({ 
  address, 
  operatingHours 
}: { 
  address: string;
  operatingHours: string;
}) {
  return (
    <section id="location" className="relative h-screen w-full flex items-center justify-center bg-deep-navy snap-start overflow-hidden">
      <div className="container mx-auto px-6 py-12 flex flex-col h-full max-h-screen">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-6 shrink-0"
        >
          <h2 className="text-3xl md:text-5xl font-heading mb-2 uppercase">
            Visit Our <span className="text-maac-gold">Academy</span>
          </h2>
          <p className="text-white/40 font-sans tracking-widest uppercase text-[10px] md:text-xs flex items-center justify-center gap-2">
            <MapPin size={12} className="text-maac-gold" /> {address}
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 w-full bg-obsidian-black border border-white/10 overflow-hidden shadow-2xl relative"
        >
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3410.9077439522307!2d94.9081493753035!3d27.47022077631938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3740992d5ba3742b%3A0x6a87e83c629d7f77!2sMAAC%20Dibrugarh%2C%20Best%20Animation%20Institute%20in%20Assam.!5e1!3m2!1sen!2sin!4v1772963735642!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          
          {/* Overlay styling for studio feel */}
          <div className="absolute inset-0 pointer-events-none border-[10px] md:border-[20px] border-deep-navy opacity-40" />
        </motion.div>
        
        {/* Footer Info */}
        <div className="mt-6 text-center shrink-0">
           <div className="inline-block px-6 py-3 bg-obsidian-black border border-white/5 rounded-sm">
              <h4 className="text-maac-gold font-heading text-[10px] md:text-xs uppercase tracking-widest mb-1">Operating Hours</h4>
              <p className="text-white/60 font-sans text-[10px] md:text-sm tracking-wide">{operatingHours}</p>
           </div>
        </div>

      </div>
    </section>
  );
}
