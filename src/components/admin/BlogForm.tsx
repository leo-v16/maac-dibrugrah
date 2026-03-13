'use client';

import { useState } from 'react';
import { uploadMedia } from '@/lib/utils';
import { blogService } from '@/services/blogService';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Type, FileText, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { revalidateBlogs } from '@/app/actions';
import { Blog } from '@/types';

interface BlogFormProps {
  initialData?: Blog;
  id?: string;
}

export default function BlogForm({ initialData, id }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    coverImageUrl: initialData?.coverImageUrl || '',
  });

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id && !coverImageFile && !formData.coverImageUrl) return alert("Cover Image (File or URL) is required");

    setLoading(true);
    try {
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_BLOGS as string;
      
      let finalCoverImageUrl = formData.coverImageUrl;
      
      // If a new file is selected, it takes priority and uploads to Cloudinary
      if (coverImageFile) {
        finalCoverImageUrl = await uploadMedia(coverImageFile, preset);
      }

      const slug = formData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const blogData = {
        ...formData,
        slug,
        coverImageUrl: finalCoverImageUrl
      };

      if (id) {
        await blogService.updateBlog(id, blogData);
      } else {
        await blogService.createBlog(blogData);
      }

      // Trigger On-Demand Revalidation
      await revalidateBlogs(slug);

      router.push("/admin/blogs");
    } catch (error) {
      console.error(error);
      alert("Failed to save blog post. Please try again.");
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
          {id ? 'Edit' : 'New'} <span className="text-maac-gold">Blog Post</span>
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
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white"
            placeholder="e.g., The Impact of AI in VFX"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40">Short Excerpt</label>
          <textarea
            required
            value={formData.excerpt}
            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors resize-none text-white"
            placeholder="A brief summary for the grid view..."
          />
        </div>

        <div className="space-y-4">
          <div className="bg-maac-gold/5 border border-maac-gold/20 p-4 rounded-lg flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-maac-gold font-bold">Styling Direction</p>
              <p className="text-xs text-white/60 font-sans leading-relaxed">
                Use **inline vanilla CSS** for designing the layout and colors. Tailwind classes will not work. 
                Include this text in your AI prompt: <span className="text-white italic">"Use ONLY inline vanilla CSS for all styling (colors, layout, spacing). Do NOT use Tailwind CSS classes."</span>
              </p>
            </div>
            <button 
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('Use ONLY inline vanilla CSS for all styling (colors, layout, spacing). Do NOT use Tailwind CSS classes as they will not be rendered.');
                alert('Prompt hint copied!');
              }}
              className="px-3 py-1.5 bg-maac-gold text-obsidian-black text-[10px] font-heading uppercase tracking-widest hover:bg-white transition-all shrink-0"
            >
              Copy Prompt
            </button>
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
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors font-sans leading-relaxed text-white"
              placeholder="Write your story using HTML tags for formatting..."
            />
          </div>
        </div>

        {/* Image Source Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${coverImageFile ? 'text-maac-gold' : 'text-white/40'}`}>
              <ImageIcon size={14} /> Upload File
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={e => setCoverImageFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className={`text-xs p-4 border border-dashed transition-colors ${coverImageFile ? 'border-maac-gold text-maac-gold' : 'border-white/10 text-white/20 group-hover:border-white/30'}`}>
                {coverImageFile ? coverImageFile.name : 'Select Image...'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${formData.coverImageUrl ? 'text-maac-gold' : 'text-white/40'}`}>
              <LinkIcon size={14} /> Direct Image URL / Drive Link
            </label>
            <input
              type="url"
              value={formData.coverImageUrl}
              onChange={e => setFormData({ ...formData, coverImageUrl: e.target.value })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white text-xs font-mono"
              placeholder="https://drive.google.com/..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-maac-gold hover:bg-white text-obsidian-black py-5 font-heading uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>Processing Assets...</>
          ) : (
            <>
              <Save size={20} /> {id ? 'Update' : 'Publish'} Blog
            </>
          )}
        </button>
      </form>
    </div>
  );
}
