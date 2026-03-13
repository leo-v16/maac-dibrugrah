import { courseService } from '@/services/courseService';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Award, Play, Headphones, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cleanHtml } from '@/utils/sanitize';
import EnquireButton from '@/components/courses/EnquireButton';
import CourseMobileCTA from '@/components/courses/CourseMobileCTA';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = await courseService.getBySlug(slug);

  if (!course) return { title: 'Course Not Found' };

  return {
    title: `${course.title} | MAAC Dibrugarh`,
    description: course.excerpt,
    openGraph: {
      title: course.title,
      description: course.excerpt,
      images: [course.thumbnailUrl],
      type: 'article',
    },
  };
}

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

  const isVideo = (url: string): boolean => {
    return !!(url?.includes('/video/upload/') || url?.match(/\.(mp4|webm|ogg|mov)$/i));
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.excerpt,
    provider: {
      '@type': 'EducationOrganization',
      name: 'MAAC Dibrugarh',
      sameAs: 'https://maacdibrugarh.com',
    },
  };

  return (
    <div className="pt-24 min-h-screen bg-obsidian-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section (Video or Image) */}
      <section className="w-full h-[40vh] md:h-[60vh] bg-black relative overflow-hidden">
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
        <div className="absolute inset-0 bg-linear-to-t from-obsidian-black via-obsidian-black/20 to-transparent" />
        
        {/* All Courses Back Button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <Link 
            href="/courses" 
            className="group flex items-center gap-2 md:gap-3 bg-obsidian-black/40 hover:bg-maac-gold backdrop-blur-md border border-white/10 hover:border-maac-gold px-4 py-2 md:px-6 md:py-3 transition-all duration-300"
          >
            <ArrowLeft size={18} className="text-maac-gold group-hover:text-obsidian-black transition-colors" />
            <span className="font-heading text-[10px] md:text-sm uppercase tracking-[0.2em] text-white group-hover:text-obsidian-black transition-colors">
              All Courses
            </span>
          </Link>
        </div>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <div className="container mx-auto">
             <div className="flex items-center gap-2 text-maac-gold font-heading text-[10px] uppercase tracking-[0.3em] mb-4">
               {(course.videoUrl || isVideo(course.thumbnailUrl)) ? <Play size={12} fill="currentColor" /> : <Award size={12} />} 
               {(course.videoUrl || isVideo(course.thumbnailUrl)) ? 'Previewing Course' : 'Career Program'}
             </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
            
            {/* Main Content (Dominant 75%) */}
            <div className="lg:col-span-3 space-y-12 md:space-y-20">
              <div className="space-y-8">
                <h1 className="text-4xl md:text-8xl font-heading leading-[1.1] uppercase tracking-tighter">
                  {course.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 text-[10px] uppercase tracking-[0.2em] text-maac-gold/60 border-y border-white/5 py-6">
                  <span className="flex items-center gap-3 border-r border-white/10 pr-10"><Clock size={16} /> {course.duration}</span>
                  <span className="flex items-center gap-3 border-r border-white/10 pr-10"><Award size={16} /> Industry Certified</span>
                  <span className="flex items-center gap-3"><Calendar size={16} /> New Batch Starting Soon</span>
                </div>
              </div>

              <div 
                className="prose prose-invert prose-xl max-w-none font-sans text-white/70 leading-relaxed selection:bg-maac-gold selection:text-obsidian-black"
                dangerouslySetInnerHTML={{ __html: course.content }}
              />

              {/* Secure Injected HTML Section */}
              {course.embeddedHtml && (
                <div 
                  className="prose prose-invert max-w-none border-t border-white/5 pt-16 mt-16"
                  dangerouslySetInnerHTML={{ __html: cleanHtml(course.embeddedHtml) }}
                />
              )}

              {course.audioUrl && (
                <div className="p-10 bg-deep-navy border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Headphones size={80} />
                  </div>
                  <h4 className="font-heading text-xs mb-8 flex items-center gap-3 uppercase tracking-widest text-white/40">
                    <Headphones size={18} className="text-maac-gold" /> Listen to Course Introduction
                  </h4>
                  <audio controls className="w-full h-10 filter invert opacity-80 hover:opacity-100 transition-opacity">
                    <source src={course.audioUrl} />
                  </audio>
                </div>
              )}
            </div>

            {/* Sidebar (Slim 25%) */}
            <aside className="lg:col-span-1">
               <div className="lg:sticky lg:top-32 space-y-10">
                  <div className="bg-deep-navy/50 backdrop-blur-sm border border-white/10 p-8 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-0 bg-maac-gold group-hover:h-full transition-all duration-500" />
                    
                    <div className="relative">
                      <h3 className="text-xl font-heading uppercase mb-2 tracking-tight">Enroll Now</h3>
                      <p className="text-white/40 text-xs font-sans leading-relaxed">
                        Start your journey in High-End Animation and VFX with MAAC Dibrugarh.
                      </p>
                    </div>

                    <EnquireButton courseTitle={course.title} />

                    <div className="space-y-4 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-[10px] text-white/30 uppercase tracking-widest">
                        <Award size={14} className="text-maac-gold" /> Placement Support
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-white/30 uppercase tracking-widest">
                        <Award size={14} className="text-maac-gold" /> Studio Environment
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block border-l border-white/5 pl-8 py-4">
                    <h4 className="font-heading text-[10px] uppercase tracking-[0.3em] text-white/20 mb-4">Explore More</h4>
                    <Link href="/courses" className="block text-xs uppercase tracking-widest text-white/40 hover:text-maac-gold transition-colors mb-3">All Programs</Link>
                    <Link href="/gallery" className="block text-xs uppercase tracking-widest text-white/40 hover:text-maac-gold transition-colors">Student Work</Link>
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Mobile Fixed CTA */}
      <CourseMobileCTA courseTitle={course.title} />
    </div>
  );
}
