'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export default function MapSection() {
  return (
    <section id="location" className="relative h-screen flex items-center justify-center overflow-hidden bg-deep-navy snap-start">
      <div className="container mx-auto px-6 py-20 flex flex-col h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            Visit Our <span className="text-maac-gold">Studio</span>
          </h2>
          <p className="text-white/40 font-sans tracking-widest uppercase text-sm flex items-center justify-center gap-2">
            <MapPin size={14} className="text-maac-gold" /> {CONTACT_INFO.ADDRESS}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
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
          
          {/* Overlay to catch initial clicks/scrolls if needed, or just for styling */}
          <div className="absolute inset-0 pointer-events-none border-[20px] border-deep-navy opacity-50" />
        </motion.div>
        
        <div className="mt-12 text-center">
           <div className="inline-block px-8 py-4 bg-obsidian-black border border-white/5 rounded-sm">
              <h4 className="text-maac-gold font-heading text-sm uppercase tracking-widest mb-1">Operating Hours</h4>
              <p className="text-white/60 font-sans text-sm tracking-wide">Mon - Sat: 10:00 AM - 7:00 PM</p>
           </div>
        </div>
      </div>
    </section>
  );
}
