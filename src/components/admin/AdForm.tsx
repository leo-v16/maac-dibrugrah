'use client';

import { useState } from 'react';
import { uploadMedia } from '@/lib/utils';
import { adService } from '@/services/adService';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon, Type, Clock, Globe } from 'lucide-react';
import Link from 'next/link';
import { revalidateAll } from '@/app/actions';
import { Ad } from '@/types';

interface AdFormProps {
  initialData?: Ad;
  id?: string;
}

export default function AdForm({ initialData, id }: AdFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    targetLink: initialData?.targetLink || '',
    mediaUrl: initialData?.mediaUrl || '',
    isActive: initialData?.isActive || false,
    delaySeconds: initialData?.delaySeconds || 3,
    targetPages: initialData?.targetPages || ['*'],
  });

  const [adMediaFile, setAdMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id && !adMediaFile && !formData.mediaUrl) return alert("Ad Media (File or URL) is required");

    setLoading(true);
    try {
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_ADS as string;
      
      let finalMediaUrl = formData.mediaUrl;
      
      if (adMediaFile) {
        finalMediaUrl = await uploadMedia(adMediaFile, preset);
      }

      const adData = {
        ...formData,
        mediaUrl: finalMediaUrl
      };

      if (id) {
        await adService.updateAd(id, adData);
      } else {
        await adService.createAd(adData);
      }

      // Clear cache across entire site
      await revalidateAll();

      router.push("/admin/ads");
    } catch (error) {
      console.error(error);
      alert("Failed to save ad. Please try again.");
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
          {id ? 'Edit' : 'New'} <span className="text-maac-gold">Global Ad</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Clock size={12} /> Display Delay (Seconds)
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.delaySeconds}
              onChange={e => setFormData({ ...formData, delaySeconds: parseInt(e.target.value) })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Globe size={12} /> Target Pages (comma separated, * for all)
            </label>
            <input
              type="text"
              required
              value={formData.targetPages.join(', ')}
              onChange={e => setFormData({ ...formData, targetPages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white"
              placeholder="*, /courses, /about"
            />
          </div>
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

        {/* Media Source Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${adMediaFile || initialData?.mediaUrl ? 'text-maac-gold' : 'text-white/40'}`}>
              <ImageIcon size={14} /> {id ? 'Change' : 'Upload'} Ad Media
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={e => setAdMediaFile(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className={`text-xs p-4 border border-dashed transition-colors ${adMediaFile || initialData?.mediaUrl ? 'border-maac-gold text-maac-gold' : 'border-white/10 text-white/20 group-hover:border-white/30'}`}>
                {adMediaFile ? adMediaFile.name : (initialData?.mediaUrl ? 'Current Media Attached' : 'Select File...')}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${formData.mediaUrl ? 'text-maac-gold' : 'text-white/40'}`}>
              <LinkIcon size={14} /> Direct Media URL / Drive Link
            </label>
            <input
              type="url"
              value={formData.mediaUrl}
              onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white text-xs font-mono"
              placeholder="https://drive.google.com/..."
            />
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
            <>Processing Assets...</>
          ) : (
            <>
              <Save size={20} /> {id ? 'Update' : 'Deploy'} Ad
            </>
          )}
        </button>
      </form>
    </div>
  );
}
