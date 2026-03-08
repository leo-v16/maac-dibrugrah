'use client';

import { useState } from 'react';
import { uploadMedia } from '@/lib/utils';
import { adService } from '@/services/adService';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Type } from 'lucide-react';
import Link from 'next/link';
import { revalidateAll } from '@/app/actions';

export default function NewAdPage() {
  const [formData, setFormData] = useState({
    title: '',
    targetLink: '',
    isActive: false,
  });

  const [adMedia, setAdMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adMedia) return alert("Ad Media is required");

    setLoading(true);
    try {
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_ADS as string;
      const mediaUrl = await uploadMedia(adMedia, preset);

      if (formData.isActive) {
        // Ensure only one active ad
        await adService.deactivateAllAds();
      }

      await adService.createAd({
        ...formData,
        mediaUrl
      });

      // Clear cache across entire site
      await revalidateAll();

      router.push("/admin/ads");
    } catch (error) {
      console.error(error);
      alert("Failed to create ad. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/ads" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-heading uppercase">
          New <span className="text-maac-gold">Global Ad</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-deep-navy border border-white/5 p-8 md:p-12">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Type size={12} /> Internal Ad Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white"
            placeholder="e.g., Summer Admission Open"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
            <LinkIcon size={12} /> Target Destination URL
          </label>
          <input
            type="url"
            required
            value={formData.targetLink}
            onChange={e => setFormData({ ...formData, targetLink: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-3">
          <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${adMedia ? 'text-maac-gold' : 'text-white/40'}`}>
            <ImageIcon size={14} /> Ad Media * (Image/Video)
          </label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*,video/*"
              required
              onChange={e => setAdMedia(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className={`text-xs p-4 border border-dashed transition-colors ${adMedia ? 'border-maac-gold text-maac-gold' : 'border-white/10 text-white/20 group-hover:border-white/30'}`}>
              {adMedia ? adMedia.name : 'Select Image or Video...'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 py-2">
          <input 
            type="checkbox" 
            id="isActive"
            checked={formData.isActive} 
            onChange={e => setFormData({...formData, isActive: e.target.checked})}
            className="w-4 h-4 accent-maac-gold"
          />
          <label htmlFor="isActive" className="text-xs uppercase tracking-widest text-white font-heading">Set as Active Ad</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-maac-gold hover:bg-white text-obsidian-black py-5 font-heading uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>Processing Media...</>
          ) : (
            <>
              <Save size={20} /> Deploy Ad
            </>
          )}
        </button>
      </form>
    </div>
  );
}
