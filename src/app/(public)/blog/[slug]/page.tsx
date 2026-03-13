import { blogService } from '@/services/blogService';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cleanHtml } from '@/utils/sanitize';
import { parseDriveUrl } from '@/utils/drive';
import { Metadata } from 'next';

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
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-black">
        <img
          src={parseDriveUrl(blog.coverImageUrl)}
          alt={blog.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-linear-to-t from-obsidian-black via-transparent to-transparent" />
        
        <div className="absolute top-8 left-8 z-20">
          <Link 
            href="/blog" 
            className="group flex items-center gap-3 bg-obsidian-black/40 hover:bg-maac-gold backdrop-blur-md border border-white/10 hover:border-maac-gold px-6 py-3 transition-all duration-300"
          >
            <ArrowLeft size={20} className="text-maac-gold group-hover:text-obsidian-black transition-colors" />
            <span className="font-heading text-sm uppercase tracking-[0.2em] text-white group-hover:text-obsidian-black transition-colors">
              Back to Insights
            </span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-maac-gold font-heading text-[10px] uppercase tracking-[0.3em] mb-6">
            <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-heading mb-12 leading-tight uppercase">
            {blog.title}
          </h1>

          <div 
            className="prose prose-invert prose-lg max-w-none font-sans text-white/70 leading-relaxed selection:bg-maac-gold selection:text-obsidian-black"
            dangerouslySetInnerHTML={{ __html: cleanHtml(blog.content) }}
          />
        </div>
      </div>
    </div>
  );
}
