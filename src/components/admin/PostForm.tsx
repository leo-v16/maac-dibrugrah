'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Eye, Layout, Type, Image as ImageIcon, FileText, Send } from 'lucide-react';
import Link from 'next/link';

interface PostFormProps {
  initialData?: BlogPost;
  id?: string;
}

export default function PostForm({ initialData, id }: PostFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    content: initialData?.content || '',
    excerpt: initialData?.excerpt || '',
    coverImage: initialData?.coverImage || '',
    published: initialData?.published ?? false,
    author: initialData?.author || 'Admin',
  });

  const [previewMode, setPreviewMode] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!id && formData.title) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (id) {
        await blogService.updatePost(id, formData);
      } else {
        await blogService.createPost(formData);
      }
      router.push('/admin/posts');
    } catch (err) {
      console.error(err);
      alert('Error saving post. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-obsidian-black/80 backdrop-blur-md py-6 mb-12 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-6">
          <Link href="/admin/posts" className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-heading">{id ? 'Edit' : 'Create'} <span className="text-maac-gold">Story</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-heading flex items-center gap-2 border border-white/10 transition-all ${previewMode ? 'bg-maac-gold text-obsidian-black' : 'text-white/40 hover:text-white'}`}
          >
            {previewMode ? <Layout size={14} /> : <Eye size={14} />} {previewMode ? 'Editor' : 'Preview'}
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-electric-red text-white px-8 py-2 text-xs uppercase tracking-widest font-heading flex items-center gap-2 hover:bg-white hover:text-obsidian-black transition-all disabled:opacity-50"
          >
            <Save size={14} /> {loading ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Editor Side */}
        <div className={`lg:col-span-2 space-y-8 ${previewMode ? 'hidden lg:block opacity-20 pointer-events-none' : ''}`}>
           {/* Main Title Area */}
           <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                <Type size={12} /> Post Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="The Future of 3D Animation..."
                className="w-full bg-deep-navy border border-white/5 p-6 text-3xl font-heading text-white focus:outline-none focus:border-maac-gold/30 transition-all"
              />
           </div>

           {/* Content Editor */}
           <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                <FileText size={12} /> Narrative Content (HTML/Markdown)
              </label>
              <textarea
                name="content"
                required
                value={formData.content}
                onChange={handleChange}
                rows={20}
                placeholder="Start telling your story. Use standard HTML tags for formatting..."
                className="w-full bg-deep-navy border border-white/5 p-8 font-sans text-white/70 leading-relaxed focus:outline-none focus:border-maac-gold/30 transition-all resize-none"
              />
           </div>
        </div>

        {/* Sidebar Settings / Preview Overlay */}
        <div className={`space-y-10 ${previewMode ? 'lg:block' : ''}`}>
           
           {/* Quick Preview Widget */}
           {previewMode && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-deep-navy border border-white/5 p-8 space-y-6 max-h-[80vh] overflow-y-auto"
             >
                <h3 className="text-xl font-heading mb-6 border-b border-white/5 pb-4">Live <span className="text-maac-gold">Preview</span></h3>
                <div className="prose prose-invert prose-sm max-w-none font-sans" dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-white/20 italic">No content yet...</p>' }} />
             </motion.div>
           )}

           {!previewMode && (
             <>
                {/* Meta Settings */}
                <div className="bg-deep-navy border border-white/5 p-8 space-y-8">
                  <h3 className="text-sm font-heading uppercase tracking-widest text-maac-gold">Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 block">Slug (URL Path)</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        className="w-full bg-obsidian-black border border-white/5 p-3 text-xs font-sans text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-white/30 block">Author</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        className="w-full bg-obsidian-black border border-white/5 p-3 text-xs font-sans text-white focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 py-4">
                      <input
                        type="checkbox"
                        id="published"
                        name="published"
                        checked={formData.published}
                        onChange={handleChange}
                        className="w-4 h-4 accent-maac-gold"
                      />
                      <label htmlFor="published" className="text-xs uppercase tracking-widest text-white font-heading">Set as Published</label>
                    </div>
                  </div>
                </div>

                {/* Media Widget */}
                <div className="bg-deep-navy border border-white/5 p-8 space-y-6">
                  <h3 className="text-sm font-heading uppercase tracking-widest flex items-center gap-2"><ImageIcon size={16} /> Cover Image</h3>
                  <div className="aspect-video bg-obsidian-black border border-dashed border-white/10 flex items-center justify-center overflow-hidden">
                    {formData.coverImage ? (
                      <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] uppercase tracking-widest text-white/20 text-center px-4">Provide image URL below</span>
                    )}
                  </div>
                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-obsidian-black border border-white/5 p-3 text-xs font-sans text-white focus:outline-none"
                  />
                </div>

                {/* Excerpt Widget */}
                <div className="bg-deep-navy border border-white/5 p-8 space-y-4">
                  <h3 className="text-sm font-heading uppercase tracking-widest">Excerpt</h3>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Briefly describe what this story is about..."
                    className="w-full bg-obsidian-black border border-white/5 p-4 text-xs font-sans text-white/60 focus:outline-none transition-all resize-none"
                  />
                </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
