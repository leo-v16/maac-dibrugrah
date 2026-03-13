import { blogService } from '@/services/blogService';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cleanHtml } from '@/utils/sanitize';
import { parseDriveUrl } from '@/utils/drive';
import { Metadata } from 'next';
import BlogMobileCTA from '@/components/sections/BlogMobileCTA';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = await blogService.getBlogBySlug(slug);

  if (!blog) return { title: 'Insight Not Found' };

  return {
    title: `${blog.title} | MAAC Dibrugarh Insights`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImageUrl],
      type: 'article',
    },
  };
}

export async function generateStaticParams() {
  const blogs = await blogService.getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await blogService.getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImageUrl,
    datePublished: blog.createdAt,
    author: {
      '@type': 'Organization',
      name: 'MAAC Dibrugarh',
    },
  };

  return (
    <div className="pt-24 min-h-screen bg-obsidian-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-black overflow-hidden">
        <img
          src={parseDriveUrl(blog.coverImageUrl)}
          alt={blog.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-obsidian-black via-transparent to-transparent" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
          <Link 
            href="/blog" 
            className="group flex items-center gap-2 md:gap-3 bg-obsidian-black/40 hover:bg-maac-gold backdrop-blur-md border border-white/10 hover:border-maac-gold px-4 py-2 md:px-6 md:py-3 transition-all duration-300"
          >
            <ArrowLeft size={18} className="text-maac-gold group-hover:text-obsidian-black transition-colors" />
            <span className="font-heading text-[10px] md:text-sm uppercase tracking-[0.2em] text-white group-hover:text-obsidian-black transition-colors">
              All Insights
            </span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 md:py-20">
        <article className="max-w-4xl mx-auto">
          <header className="mb-12 md:mb-16">
            <div className="flex items-center gap-4 text-maac-gold font-heading text-[10px] uppercase tracking-[0.3em] mb-6">
              <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
            
            <h1 className="text-4xl md:text-7xl font-heading leading-tight uppercase mb-8">
              {blog.title}
            </h1>
            
            {blog.excerpt && (
              <p className="text-xl md:text-2xl text-white/40 font-sans italic border-l-2 border-maac-gold pl-6 leading-relaxed">
                {blog.excerpt}
              </p>
            )}
          </header>

          <div 
            className="prose prose-invert prose-lg max-w-none font-sans text-white/70 leading-relaxed selection:bg-maac-gold selection:text-obsidian-black
              prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-wide
              prose-a:text-maac-gold hover:prose-a:text-white transition-colors"
            dangerouslySetInnerHTML={{ __html: cleanHtml(blog.content) }}
          />
          
          <footer className="mt-20 pt-10 border-t border-white/5">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                   <h4 className="font-heading text-sm uppercase tracking-widest text-white/20 mb-2">Published By</h4>
                   <p className="font-heading text-lg">MAAC Dibrugarh Editorial</p>
                </div>
                <Link 
                  href="/contact"
                  className="bg-deep-navy hover:bg-maac-gold text-white hover:text-obsidian-black border border-white/10 hover:border-maac-gold px-10 py-4 font-heading text-xs uppercase tracking-widest transition-all"
                >
                  Discuss Your Career
                </Link>
             </div>
          </footer>
        </article>
      </div>

      {/* Mobile Fixed CTA */}
      <BlogMobileCTA />
    </div>
  );
}
