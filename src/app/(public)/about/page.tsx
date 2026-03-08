import AboutSection from '@/components/sections/AboutSection';
import { settingsService } from '@/services/settingsService';

export default async function AboutPage() {
  const settings = await settingsService.getSettings();

  return (
    <div className="pt-24 min-h-screen bg-obsidian-black">
      {/* Introduction Section */}
      <AboutSection imageUrl={settings.aboutImageUrl} />
      
      {/* Detailed Mission and History */}
      <section className="py-32 border-t border-deep-navy relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-maac-gold/5 blur-[120px] rounded-full" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-heading text-maac-gold mb-10 leading-tight uppercase">Our Mission</h2>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-sans mb-16">
              To empower the next generation of creative storytellers in Dibrugarh. We bridge the gap between imagination and industry reality through rigorous studio-grade training.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12">
               <div className="space-y-6">
                  <h3 className="text-2xl font-heading text-white border-l-4 border-maac-gold pl-6">Advanced Infrastructure</h3>
                  <p className="text-white/50 font-sans text-lg">Our academy is equipped with high-end workstations and the latest production-grade software used in Hollywood and Bollywood alike.</p>
               </div>
               <div className="space-y-6">
                  <h3 className="text-2xl font-heading text-white border-l-4 border-electric-red pl-6">Placement Support</h3>
                  <p className="text-white/50 font-sans text-lg">We provide extensive placement assistance, connecting our certified artists with top studios and media houses across the globe.</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
