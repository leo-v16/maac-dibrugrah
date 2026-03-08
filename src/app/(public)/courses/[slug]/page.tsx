import { courseService } from '@/services/courseService';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Award, Play, Headphones, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Force 100% Static Generation
export async function generateStaticParams() {
  const courses = await courseService.getPublished();
  return courses.map((course) => ({
    slug: course.slug,
  }));
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await courseService.getBySlug(slug);

  if (!course) {
    notFound();
  }

  return (
    <div className="pt-24 min-h-screen bg-obsidian-black text-white">
      {/* Hero Section (Video or Image) */}
      <section className="w-full aspect-video md:h-[60vh] bg-black relative overflow-hidden">
        {course.videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src={course.videoUrl} />
          </video>
        ) : (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-black via-obsidian-black/20 to-transparent" />
        
        <div className="absolute bottom-12 left-0 w-full px-6">
          <div className="container mx-auto">
             <div className="flex items-center gap-2 text-maac-gold font-heading text-[10px] uppercase tracking-[0.3em] mb-4">
               {course.videoUrl ? <Play size={12} fill="currentColor" /> : <Award size={12} />} 
               {course.videoUrl ? 'Previewing Course' : 'Career Program'}
             </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <Link href="/courses" className="text-white/30 hover:text-maac-gold flex items-center gap-2 text-[10px] uppercase tracking-widest mb-8 transition-colors">
                  <ArrowLeft size={14} /> All Courses
                </Link>
                <h1 className="text-4xl md:text-6xl font-heading mb-6 leading-tight uppercase">
                  {course.title}
                </h1>
                <div className="flex flex-wrap items-center gap-8 text-[10px] uppercase tracking-widest text-maac-gold/60">
                  <span className="flex items-center gap-2"><Clock size={14} /> {course.duration}</span>
                  <span className="flex items-center gap-2"><Award size={14} /> Industry Certified</span>
                  <span className="flex items-center gap-2"><Calendar size={14} /> New Batch Starting Soon</span>
                </div>
              </div>

              <div 
                className="prose prose-invert prose-lg max-w-none font-sans text-white/70 leading-relaxed selection:bg-maac-gold selection:text-obsidian-black"
                dangerouslySetInnerHTML={{ __html: course.content }}
              />

              {course.audioUrl && (
                <div className="p-8 bg-deep-navy border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Headphones size={64} />
                  </div>
                  <h4 className="font-heading text-sm mb-6 flex items-center gap-2">
                    <Headphones size={18} className="text-maac-gold" /> Listen to Course Introduction
                  </h4>
                  <audio controls className="w-full h-10 filter invert">
                    <source src={course.audioUrl} />
                  </audio>
                </div>
              )}
            </div>

            {/* Sidebar / CTA */}
            <aside className="space-y-8">
               <div className="bg-deep-navy border border-white/5 p-8 sticky top-32">
                  <h3 className="text-xl font-heading mb-6 uppercase">Enroll Now</h3>
                  <p className="text-white/40 text-sm font-sans mb-8 leading-relaxed">
                    Start your journey in the world of High-End Animation and VFX with MAAC Dibrugarh.
                  </p>
                  <button className="w-full bg-maac-gold text-obsidian-black py-4 font-heading uppercase tracking-widest text-xs hover:bg-white transition-all">
                    Enquire for Batches
                  </button>
                  <div className="mt-6 flex items-center justify-center gap-4 text-[10px] uppercase tracking-widest text-white/20">
                    <span>EMI Available</span>
                    <span>•</span>
                    <span>100% Placement Support</span>
                  </div>
               </div>
            </aside>

          </div>
        </div>
      </div>
    </div>
  );
}
