'use client';

import { useEffect, useState } from 'react';
import { galleryService } from '@/services/galleryService';
import { GalleryItem } from '@/types';
import Link from 'next/link';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { revalidateGallery } from '@/app/actions';

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await galleryService.getAllItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this masterpiece from the gallery?')) {
      try {
        await galleryService.deleteItem(id);
        await revalidateGallery();
        fetchItems();
      } catch (err) {
        alert('Error deleting item');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-heading mb-2">
            Gallery <span className="text-maac-gold">CMS</span>
          </h1>
          <p className="text-white/20 text-xs uppercase tracking-[0.2em]">Manage student masterpieces</p>
        </div>
        
        <Link 
          href="/admin/gallery/new" 
          className="bg-maac-gold text-obsidian-black px-8 py-3 font-heading text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all shadow-lg shadow-maac-gold/5"
        >
          <Plus size={18} /> Add Masterpiece
        </Link>
      </div>

      {loading ? (
        <div className="text-white/20 font-sans animate-pulse">Fetching Showcase Data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-deep-navy border border-white/5 group hover:border-maac-gold/30 transition-all flex flex-col"
            >
              <div className="relative aspect-video overflow-hidden bg-black">
                 <img src={item.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-obsidian-black/80 text-electric-red hover:bg-electric-red hover:text-white transition-all rounded-sm"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                 </div>
              </div>
              
              <div className="p-4 flex-1">
                <h3 className="font-heading text-sm group-hover:text-maac-gold transition-colors line-clamp-1">{item.title}</h3>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">By {item.studentName}</p>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] uppercase tracking-[0.2em]">
                   <span className={item.mediaType === 'video' ? 'text-royal-blue' : 'text-maac-gold'}>{item.mediaType}</span>
                   <span className="text-white/10">{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-white/5 text-white/20 italic font-sans">
               The showcase is currently empty. Add your first student masterpiece!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
