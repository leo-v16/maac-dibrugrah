'use client';

import { useState, useEffect } from 'react';
import { settingsService, SiteSettings } from '@/services/settingsService';
import { uploadMedia } from '@/lib/utils';
import { Save, Video, Globe, RefreshCcw, Phone, Mail, MapPin, Instagram, Facebook, Youtube, Type, Clock, Image as ImageIcon } from 'lucide-react';
import { revalidateAll } from '@/app/actions';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !settings) return;

    setSaving(true);
    try {
      let finalSettings = { ...settings };

      if (aboutImageFile) {
        const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_BLOGS as string;
        const uploadedUrl = await uploadMedia(aboutImageFile, preset);
        if (uploadedUrl) {
          finalSettings.aboutImageUrl = uploadedUrl;
        }
      }

      await settingsService.updateSettings(finalSettings);
      await revalidateAll();
      alert('Settings updated successfully!');
      setAboutImageFile(null); // Clear selected file
    } catch (err) {
      console.error("Save Error:", err);
      alert('Failed to update settings. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-obsidian-black flex items-center justify-center">
        <div className="text-maac-gold font-heading flex items-center gap-3 animate-pulse uppercase tracking-widest">
          <RefreshCcw className="animate-spin" /> Fetching System Config...
        </div>
      </div>
    );
  }

  if (!settings) return <div className="p-8 text-white">Error loading settings. Please refresh.</div>;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-3xl font-heading mb-2 uppercase">
            Site <span className="text-maac-gold">Settings</span>
          </h1>
          <p className="text-white/20 text-xs uppercase tracking-[0.2em]">Manage global academy configuration</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-maac-gold text-obsidian-black px-10 py-4 font-heading text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-maac-gold/5"
        >
          {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Syncing...' : 'Save All Changes'}
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-12">
        
        {/* Section 1: Hero & Showreel */}
        <div className="bg-deep-navy border border-white/5 p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <Type className="text-maac-gold" size={20} />
            <h2 className="text-xl font-heading text-white uppercase">Hero & Branding</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 block">Main Headline (Big Text)</label>
              <textarea
                value={settings.heroHeading}
                onChange={(e) => updateField('heroHeading', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white font-heading text-lg"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 block">Sub-headline (Starting Text)</label>
              <input
                type="text"
                value={settings.heroSubheading}
                onChange={(e) => updateField('heroSubheading', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-maac-gold font-heading"
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <label className="text-[10px] uppercase tracking-widest text-white/40 block">Showreel Embed URL (YouTube/Vimeo)</label>
              <input
                type="url"
                value={settings.showreelUrl}
                onChange={(e) => updateField('showreelUrl', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors text-white font-mono text-sm"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Contact & Social */}
        <div className="bg-deep-navy border border-white/5 p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <Phone className="text-royal-blue" size={20} />
            <h2 className="text-xl font-heading text-white uppercase">Contact & Social Links</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2"><Phone size={12}/> Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => updateField('contactPhone', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2"><Mail size={12}/> Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateField('contactEmail', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2"><MapPin size={12}/> Studio Address</label>
              <input
                type="text"
                value={settings.contactAddress}
                onChange={(e) => updateField('contactAddress', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2"><Clock size={12}/> Operating Hours</label>
              <input
                type="text"
                value={settings.operatingHours}
                onChange={(e) => updateField('operatingHours', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2"><Instagram size={12}/> Instagram</label>
              <input
                type="url"
                value={settings.instagramUrl}
                onChange={(e) => updateField('instagramUrl', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-3 focus:border-maac-gold outline-none text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2"><Facebook size={12}/> Facebook</label>
              <input
                type="url"
                value={settings.facebookUrl}
                onChange={(e) => updateField('facebookUrl', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-3 focus:border-maac-gold outline-none text-xs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2"><Youtube size={12}/> Youtube</label>
              <input
                type="url"
                value={settings.youtubeUrl}
                onChange={(e) => updateField('youtubeUrl', e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-3 focus:border-maac-gold outline-none text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 3: About Banner */}
        <div className="bg-deep-navy border border-white/5 p-8 md:p-10 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <ImageIcon className="text-electric-red" size={20} />
            <h2 className="text-xl font-heading text-white uppercase">Academy Banner</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest text-white/40 block">Change Banner (Upload)</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setAboutImageFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className={`text-xs p-6 border border-dashed transition-colors flex flex-col items-center gap-2 ${aboutImageFile ? 'border-maac-gold text-maac-gold' : 'border-white/10 text-white/20 group-hover:border-white/30'}`}>
                    <ImageIcon size={24} />
                    {aboutImageFile ? aboutImageFile.name : 'Select New Image...'}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40 block">Or Paste Direct URL</label>
                <input
                  type="url"
                  value={settings.aboutImageUrl}
                  onChange={(e) => updateField('aboutImageUrl', e.target.value)}
                  className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none text-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="aspect-video bg-obsidian-black border border-white/5 overflow-hidden flex items-center justify-center relative group">
               <img 
                src={settings.aboutImageUrl} 
                alt="Banner Preview" 
                className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" 
               />
               <div className="absolute top-2 right-2 bg-black/50 text-[8px] uppercase tracking-widest px-2 py-1">Live Preview</div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
