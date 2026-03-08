'use client';

import { useState } from 'react';
import { uploadMedia } from '@/lib/utils';
import { blogService } from '@/services/blogService';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Type, FileText } from 'lucide-react';
import Link from 'next/link';
import { revalidateBlogs } from '@/app/actions';

export default function NewBlogPage() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage) return alert("Cover Image is required");

    setLoading(true);
    try {
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_BLOGS as string;
      const coverImageUrl = await uploadMedia(coverImage, preset);

      const slug = formData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      await blogService.createBlog({
        ...formData,
        slug,
        coverImageUrl
      });

      // Trigger On-Demand Revalidation
      await revalidateBlogs(slug);

      router.push("/admin/blogs");
    } catch (error) {
      console.error(error);
      alert("Failed to create blog post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/blogs" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-heading uppercase">
          New <span className="text-maac-gold">Blog Post</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-deep-navy border border-white/5 p-8 md:p-12">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Type size={12} /> Post Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors"
            placeholder="e.g., The Impact of AI in VFX"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40">Short Excerpt</label>
          <textarea
            required
            value={formData.excerpt}
            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors resize-none"
            placeholder="A brief summary for the grid view..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
            <FileText size={12} /> Narrative Content (HTML)
          </label>
          <textarea
            required
            rows={15}
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors font-sans leading-relaxed"
            placeholder="Write your story using HTML tags for formatting..."
          />
        </div>

        <div className="space-y-3">
          <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${coverImage ? 'text-maac-gold' : 'text-white/40'}`}>
            <ImageIcon size={14} /> Cover Image *
          </label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              required
              onChange={e => setCoverImage(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className={`text-xs p-4 border border-dashed transition-colors ${coverImage ? 'border-maac-gold text-maac-gold' : 'border-white/10 text-white/20 group-hover:border-white/30'}`}>
              {coverImage ? coverImage.name : 'Select Cover Image...'}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-maac-gold hover:bg-white text-obsidian-black py-5 font-heading uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>Publishing Masterpiece...</>
          ) : (
            <>
              <Save size={20} /> Publish Blog
            </>
          )}
        </button>
      </form>
    </div>
  );
}
