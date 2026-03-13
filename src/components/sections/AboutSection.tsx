'use client';

import { motion, Variants } from 'framer-motion';
import { 
  Award, 
  Users, 
  Globe, 
  Star, 
  Camera, 
  CheckCircle2, 
  MonitorPlay, 
  Laptop, 
  Trophy, 
  Briefcase, 
  GraduationCap, 
  CalendarDays, 
  FolderKanban,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { parseDriveUrl } from '@/utils/drive';

const features = [
  { label: 'Free Demo Class', icon: MonitorPlay },
  { label: 'Independent Practise Sessions', icon: Laptop },
  { label: 'National & International Competitions', icon: Trophy },
  { label: 'Direct Classes with Industry Experts', icon: Briefcase },
  { label: 'Highly Experienced Faculties', icon: GraduationCap },
  { label: 'Monthly Events', icon: CalendarDays },
  { label: 'Portfolio Creation', icon: FolderKanban },
  { label: '100% Guaranteed Job Placement Assistance', icon: Award }
];

export default function AboutSection({ 
  imageUrl, 
  isAboutPage = false 
}: { 
  imageUrl: string;
  isAboutPage?: boolean;
}) {
  const welcomeText = "Welcome to ";
  const brandName = "MAAC Dibrugarh";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.3,
      },
    },
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: [0, 1, 0, 1], // Flickering "Lightning" effect
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section 
      id="about" 
      className={cn(
        "relative min-h-screen flex justify-center overflow-hidden bg-deep-navy snap-start",
        isAboutPage ? "items-start py-4 md:py-0" : "items-center py-24 md:py-0"
      )}
    >
      <div 
        className={cn(
          "container mx-auto px-6 flex flex-col md:flex-row lg:items-center gap-12 lg:gap-16",
          isAboutPage ? "pt-4 md:pt-8 items-start" : "items-center"
        )}
      >
        
        {/* Left Content */}
        <div className="flex-1 min-w-0 w-full text-center md:text-left order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-[4.2vw] sm:text-[4vw] md:text-4xl lg:text-5xl font-heading mb-4 leading-tight uppercase text-white whitespace-nowrap overflow-visible"
            >
              {welcomeText.split("").map((char, index) => (
                <motion.span key={`welcome-${index}`} variants={letterVariants} className="inline-block">
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <span className="text-maac-gold">
                {brandName.split("").map((char, index) => (
                  <motion.span key={`brand-${index}`} variants={letterVariants} className="inline-block">
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            </motion.h2>

            <p className="text-white/70 font-sans text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto md:mx-0">
              Best Animation (AVGC) Institute in Assam. Our campus is designed to give you the experience of a professional production studio environment, ensuring students are industry-ready from day one.
            </p>

            {!isAboutPage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12"
              >
                <Link 
                  href="/about"
                  className="inline-flex items-center gap-2 bg-deep-navy border border-white/10 text-white px-8 py-3 font-heading text-xs uppercase tracking-widest hover:bg-maac-gold hover:text-obsidian-black hover:border-maac-gold transition-all"
                >
                  Read Our Story <ChevronRight size={16} />
                </Link>
              </motion.div>
            )}
            
            <p className="text-white/40 font-sans text-xs md:text-sm uppercase tracking-widest mb-8 block text-left">We also Provide:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-left">
              {features.map((feature, idx) => (
                <motion.div 
                  key={feature.label} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                  className="flex items-center gap-5 group"
                >
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-maac-gold/10 border border-maac-gold/20 flex items-center justify-center flex-shrink-0 transition-all group-hover:bg-maac-gold/20 group-hover:scale-110">
                    <feature.icon size={28} className="text-maac-gold" />
                  </div>
                  <div>
                    <span className="text-white font-heading text-xs md:text-sm lg:text-base uppercase tracking-widest leading-tight block">{feature.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Image/Visuals */}
        <div className="flex-1 w-full max-w-md md:max-w-lg aspect-square relative order-1 md:order-2 mb-8 md:mb-0 pt-12 md:pt-24 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full h-full border border-white/10 rounded-sm p-3 md:p-4"
          >
            <div className="w-full h-full overflow-hidden flex items-center justify-center bg-obsidian-black relative">
              {imageUrl?.includes('/video/upload/') || imageUrl?.match(/\.(mp4|webm|ogg|mov)$/i) || imageUrl?.includes('drive.google.com') ? (
                <video 
                  src={parseDriveUrl(imageUrl)} 
                  autoPlay muted loop playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={parseDriveUrl(imageUrl)} 
                  alt="MAAC Dibrugarh Showcase" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            
            {/* Animated Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 border border-maac-gold opacity-20 animate-float"
            />
            <motion.div
              style={{ animationDelay: '1s' }}
              className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 w-20 h-20 md:w-24 md:h-24 border border-royal-blue opacity-20 animate-float"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
