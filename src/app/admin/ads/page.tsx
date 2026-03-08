'use client';

import { useEffect, useState } from 'react';
import { adService } from '@/services/adService';
import { Ad } from '@/types';
import Link from 'next/link';
import { Plus, Trash2, Eye, EyeOff, ExternalLink, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { revalidateAll } from '@/app/actions';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const data = await adService.getAllAds();
      setAds(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        await adService.deleteAd(id);
        await revalidateAll();
        fetchAds();
      } catch (err) {
        alert('Error deleting ad');
      }
    }
  };

  const toggleActive = async (ad: Ad) => {
    try {
      if (!ad.isActive) {
        // Only one active ad at a time
        await adService.deactivateAllAds();
      }
      await adService.updateAd(ad.id, { isActive: !ad.isActive });
      await revalidateAll();
      fetchAds();
    } catch (err) {
      console.error(err);
      alert('Error updating ad status');
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-heading mb-2">
            Pop-up Ad <span className="text-maac-gold">CMS</span>
          </h1>
          <p className="text-white/20 text-xs uppercase tracking-[0.2em]">Global site promotions</p>
        </div>
        
        <Link 
          href="/admin/ads/new" 
          className="bg-maac-gold text-obsidian-black px-8 py-3 font-heading text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-maac-gold/5"
        >
          <Plus size={18} /> New Ad
        </Link>
      </div>

      {loading ? (
        <div className="text-white/20 font-sans animate-pulse">Fetching Ads...</div>
      ) : (
        <div className="grid gap-4">
          {ads.map((ad, idx) => (
            <motion.div 
              key={ad.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-deep-navy p-6 flex flex-col md:flex-row justify-between items-center border border-white/5 group hover:border-maac-gold/30 transition-all"
            >
              <div className="flex items-center gap-6">
                 <div className="w-20 h-12 bg-obsidian-black border border-white/5 overflow-hidden hidden sm:block relative">
                    {ad.mediaUrl.includes('video') ? (
                      <video src={ad.mediaUrl} className="w-full h-full object-cover opacity-50" />
                    ) : (
                      <img src={ad.mediaUrl} alt="" className="w-full h-full object-cover opacity-50" />
                    )}
                 </div>
                 <div>
                    <h3 className="font-heading text-lg group-hover:text-maac-gold transition-colors">{ad.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                       <span className={`text-[10px] uppercase tracking-widest flex items-center gap-1 ${ad.isActive ? 'text-maac-gold' : 'text-electric-red'}`}>
                          {ad.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                          {ad.isActive ? 'Active' : 'Inactive'}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-2 mt-6 md:mt-0">
                <button 
                  onClick={() => toggleActive(ad)}
                  className={`p-3 bg-white/5 transition-all ${ad.isActive ? 'hover:bg-maac-gold/20 text-maac-gold' : 'hover:bg-white/10 text-white/40'}`}
                  title={ad.isActive ? 'Deactivate' : 'Set as Active'}
                >
                  {ad.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <Link 
                  href={`/admin/ads/${ad.id}`}
                  className="p-3 bg-white/5 hover:bg-royal-blue/20 text-white/40 hover:text-royal-blue transition-all"
                  title="Edit Ad"
                >
                  <Edit2 size={18} />
                </Link>
                <a 
                  href={ad.targetLink} 
                  target="_blank"
                  className="p-3 bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                  title="Target Link"
                >
                  <ExternalLink size={18} />
                </a>
                <button 
                  onClick={() => handleDelete(ad.id)}
                  className="p-3 bg-white/5 hover:bg-electric-red/20 text-white/40 hover:text-electric-red transition-all"
                  title="Delete Ad"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}

          {ads.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/5 text-white/20 italic font-sans">
               No ads found. Create your first promotion!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
