'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryContext';

const features = [
  'Industry Expert Mentors',
  '100% Placement Assistance',
  'State-of-the-art Labs',
  'Global Certification'
];

export default function HomeCTA() {
  const { openModal } = useEnquiryModal();

  return (
    <section className="bg-maac-gold rounded-t-[3rem] px-6 py-20 md:py-32 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-obsidian-black/5 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-center lg:text-left">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-heading text-white leading-tight mb-8 uppercase">
              Start Your <span className="text-obsidian-black underline decoration-white/20">Journey</span> Today.
            </h2>
            <p className="text-white text-lg md:text-xl font-sans leading-relaxed mb-12 opacity-90">
              Not sure which course is right for you? Get a free career counseling session with our experts and discover your potential in the world of digital arts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 text-left">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <span className="text-white font-heading text-xs uppercase tracking-widest">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => openModal()}
              className="bg-obsidian-black text-white px-12 py-5 rounded-full font-heading uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-obsidian-black transition-all flex items-center justify-center lg:justify-start gap-3 shadow-2xl shadow-black/20 mx-auto lg:mx-0"
            >
              Get Free Counseling <ArrowRight size={18} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hidden lg:block relative"
          >
            <div className="aspect-square bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
               <div className="w-full h-full bg-obsidian-black/10 rounded-lg flex items-center justify-center border border-white/5">
                  <span className="text-white/20 font-heading text-xl uppercase tracking-[0.5em] rotate-90 whitespace-nowrap">Career_Consultation</span>
               </div>
               {/* Floating elements */}
               <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-12 right-12 w-24 h-24 bg-white/10 rounded-full border border-white/20" 
               />
               <motion.div 
                animate={{ x: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-12 left-12 w-32 h-32 border-2 border-white/10" 
               />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
