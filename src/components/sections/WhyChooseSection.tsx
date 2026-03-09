'use client';

import { motion } from 'framer-motion';
import { BookOpen, Users, Cpu, Rocket, Palette, Briefcase } from 'lucide-react';

const pillars = [
  {
    icon: BookOpen,
    title: 'Industry-Aligned Curriculum',
    description: 'Our industry-aligned curriculum is meticulously updated to reflect the rapidly evolving demands of the global VFX and animation industry, ensuring that every student masters the most relevant skills.',
    color: 'border-maac-gold'
  },
  {
    icon: Users,
    title: 'Expert Mentorship',
    description: 'Students benefit from expert mentorship delivered by certified professionals who bring years of practical production experience into the classroom.',
    color: 'border-electric-red'
  },
  {
    icon: Cpu,
    title: 'State-of-the-Art Infrastructure',
    description: 'To facilitate high-level learning, our center boasts state-of-the-art infrastructure, giving you hands-on access to high-end workstations, advanced Wacom pentablets, and the same pro-grade software utilized by top-tier international studios.',
    color: 'border-royal-blue'
  },
  {
    icon: Palette,
    title: 'Specialized Programs',
    description: 'Whether your interest lies in 3D animation filmmaking, visual effects (VFX), graphic design, UI/UX web development, or 2D digital art, our specialized programs provide the technical depth required for success.',
    color: 'border-maac-gold'
  },
  {
    icon: Briefcase,
    title: 'Robust Placement Support',
    description: 'Beyond the classroom, MAAC Dibrugarh offers robust placement support, providing dedicated career guidance and networking opportunities to help students secure lucrative roles in top production houses, gaming studios, and creative advertising agencies.',
    color: 'border-white/20'
  }
];

export default function WhyChooseSection() {
  return (
    <section className="py-24 bg-obsidian-black relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-maac-gold/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-royal-blue/5 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-heading font-bold text-white uppercase mb-8 leading-tight"
          >
            Why Choose <span className="text-maac-gold">MAAC Dibrugarh?</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-lg md:text-xl font-sans leading-relaxed"
          >
            Choosing MAAC Dibrugarh means investing in a premier career-oriented ecosystem specifically designed to bridge the gap between creative passion and professional excellence. As a leading media and entertainment powerhouse in Upper Assam, we provide a comprehensive learning environment that focuses on transforming aspiring artists into job-ready digital professionals.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-deep-navy/50 backdrop-blur-sm p-8 md:p-10 border-l-4 ${pillar.color} group hover:bg-deep-navy transition-all duration-500 flex flex-col h-full`}
            >
              <div className="w-14 h-14 bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-maac-gold/10 transition-all duration-500 shrink-0">
                <pillar.icon className="text-maac-gold" size={28} />
              </div>
              <h3 className="text-xl font-heading text-white uppercase mb-4 group-hover:text-maac-gold transition-colors">{pillar.title}</h3>
              <p className="text-white/50 font-sans text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 pt-12 border-t border-white/5 text-center"
        >
          <p className="text-white/40 font-sans italic text-lg max-w-4xl mx-auto leading-relaxed">
            "By choosing us, you are joining a multimedia training institute committed to excellence, innovation, and your future career growth."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
