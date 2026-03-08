import { courseService } from '@/services/courseService';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Award, Play, Headphones, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cleanHtml } from '@/utils/sanitize';
import EnquireButton from '@/components/courses/EnquireButton';

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

  const isVideo = (url: string) => {
    return url?.includes('/video/upload/') || url?.match(/\.(mp4|webm|ogg|mov)$/i);
  };

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
        ) : isVideo(course.thumbnailUrl) ? (
          <video
            src={course.thumbnailUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-black via-obsidian-black/20 to-transparent" />
        
        {/* All Courses Back Button */}
        <div className="absolute top-8 left-8 z-20">
          <Link 
            href="/courses" 
            className="group flex items-center gap-3 bg-obsidian-black/40 hover:bg-maac-gold backdrop-blur-md border border-white/10 hover:border-maac-gold px-6 py-3 transition-all duration-300"
          >
            <ArrowLeft size={20} className="text-maac-gold group-hover:text-obsidian-black transition-colors" />
            <span className="font-heading text-sm uppercase tracking-[0.2em] text-white group-hover:text-obsidian-black transition-colors">
              All Courses
            </span>
          </Link>
        </div>

        <div className="absolute bottom-12 left-0 w-full px-6">
          <div className="container mx-auto">
             <div className="flex items-center gap-2 text-maac-gold font-heading text-[10px] uppercase tracking-[0.3em] mb-4">
               {(course.videoUrl || isVideo(course.thumbnailUrl)) ? <Play size={12} fill="currentColor" /> : <Award size={12} />} 
               {(course.videoUrl || isVideo(course.thumbnailUrl)) ? 'Previewing Course' : 'Career Program'}
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

              {/* Secure Injected HTML Section */}
              {course.embeddedHtml && (
                <div 
                  className="prose prose-invert max-w-none border-t border-white/5 pt-12 mt-12"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(course.embeddedHtml) }}
                />
              )}

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
                  <EnquireButton courseTitle={course.title} />
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
