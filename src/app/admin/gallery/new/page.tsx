'use client';

import { useState } from 'react';
import { galleryService } from '@/services/galleryService';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Video, User, Type, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { revalidateGallery } from '@/app/actions';

export default function NewGalleryItemPage() {
  const [formData, setFormData] = useState({
    title: '',
    studentName: '',
    mediaType: 'image' as 'image' | 'video',
    thumbnailUrl: '',
    videoUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.thumbnailUrl) return alert("Thumbnail URL is required (Google Drive direct link)");
    if (formData.mediaType === 'video' && !formData.videoUrl) return alert("Video URL is required for video items");

    setLoading(true);
    try {
      const itemData: any = {
        title: formData.title,
        studentName: formData.studentName,
        mediaType: formData.mediaType,
        thumbnailUrl: formData.thumbnailUrl,
      };

      if (formData.mediaType === 'video') {
        itemData.videoUrl = formData.videoUrl;
      }

      await galleryService.createItem(itemData);
      
      // Trigger On-Demand Revalidation
      await revalidateGallery();

      router.push("/admin/gallery");
    } catch (error) {
      console.error(error);
      alert("Failed to add to gallery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/gallery" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-heading">
          New <span className="text-maac-gold">Masterpiece</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-deep-navy border border-white/5 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Type size={12} /> Project Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors"
              placeholder="e.g., Cyberpunk City VFX"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <User size={12} /> Student Name
            </label>
            <input
              type="text"
              required
              value={formData.studentName}
              onChange={e => setFormData({ ...formData, studentName: e.target.value })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors"
              placeholder="e.g., Your Name"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest text-white/40 block">Media Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, mediaType: 'image' })}
              className={`flex-1 py-4 border transition-all flex items-center justify-center gap-3 font-heading text-xs uppercase tracking-widest ${formData.mediaType === 'image' ? 'bg-maac-gold text-obsidian-black border-maac-gold' : 'bg-obsidian-black text-white/40 border-white/5 hover:border-white/20'}`}
            >
              <ImageIcon size={18} /> Static Image
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, mediaType: 'video' })}
              className={`flex-1 py-4 border transition-all flex items-center justify-center gap-3 font-heading text-xs uppercase tracking-widest ${formData.mediaType === 'video' ? 'bg-maac-gold text-obsidian-black border-maac-gold' : 'bg-obsidian-black text-white/40 border-white/5 hover:border-white/20'}`}
            >
              <Video size={18} /> Video Project
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <LinkIcon size={12} /> Thumbnail URL (Google Drive Link)
            </label>
            <input
              type="url"
              required
              value={formData.thumbnailUrl}
              onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors font-mono text-sm text-maac-gold/80"
              placeholder="https://drive.google.com/file/d/..."
            />
          </div>

          {formData.mediaType === 'video' && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                <LinkIcon size={12} /> Video File URL (Google Drive Link)
              </label>
              <input
                type="url"
                required
                value={formData.videoUrl}
                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors font-mono text-sm text-maac-gold/80"
                placeholder="https://drive.google.com/file/d/..."
              />
            </div>
          )}
        </div>

        <div className="pt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maac-gold hover:bg-white text-obsidian-black py-5 font-heading uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>Uploading to Showcase...</>
            ) : (
              <>
                <Save size={20} /> Publish to Gallery
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-12 p-6 bg-obsidian-black border border-maac-gold/10 text-white/40 text-xs font-sans leading-relaxed">
        <h4 className="text-maac-gold uppercase font-heading tracking-widest mb-3 text-[10px]">Google Drive Guide:</h4>
        <ol className="list-decimal list-inside space-y-2">
          <li>Upload your image/video to Google Drive.</li>
          <li>Right-click the file &gt; <strong>Share</strong>.</li>
          <li>Set access to <strong>"Anyone with the link"</strong>.</li>
          <li>Copy the link and paste it above. The system will handle the rest!</li>
        </ol>
      </div>
    </div>
  );
}
