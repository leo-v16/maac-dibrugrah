import { blogService } from '@/services/blogService';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';

export default async function BlogsPage() {
  const blogs = await blogService.getAllBlogs();

  return (
    <div className="pt-32 pb-24 bg-obsidian-black min-h-screen text-white">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-heading mb-4 uppercase tracking-tight">
            Creative <span className="text-maac-gold">Insights</span>
          </h1>
          <p className="text-white/40 font-sans tracking-widest uppercase text-sm">
            Latest stories from the world of VFX & Animation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogs.map((blog) => (
            <Link 
              href={`/blog/${blog.slug}`} 
              key={blog.id}
              className="group flex flex-col bg-deep-navy border border-white/5 overflow-hidden"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={blog.coverImageUrl}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-maac-gold mb-4">
                  <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <h2 className="text-2xl font-heading mb-4 group-hover:text-maac-gold transition-colors leading-tight">
                  {blog.title}
                </h2>
                <p className="text-white/50 text-sm mb-8 line-clamp-3 leading-relaxed font-sans">
                  {blog.excerpt}
                </p>
                <div className="mt-auto flex items-center gap-2 text-white font-heading text-[10px] uppercase tracking-[0.2em]">
                  Read Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-24 border border-dashed border-white/10 italic text-white/20">
            No insights published yet. Stay tuned!
          </div>
        )}
      </div>
    </div>
  );
}
