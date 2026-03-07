'use client';

import { useEffect, useState } from 'react';
import { popupService } from '@/services/popupService';
import { PopupAd } from '@/types';
import { Plus, Trash2, Edit2, Eye, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPopupsPage() {
  const [popups, setPopups] = useState<PopupAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<PopupAd, 'id' | 'createdAt'>>({
    name: '',
    imageUrl: '',
    heading: '',
    subheading: '',
    buttonText: '',
    buttonLink: '',
    targetPages: ['*'],
    delaySeconds: 3,
    isActive: false,
  });

  useEffect(() => {
    fetchPopups();
  }, []);

  const fetchPopups = async () => {
    try {
      const data = await popupService.getAllPopups();
      setPopups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      imageUrl: '',
      heading: '',
      subheading: '',
      buttonText: '',
      buttonLink: '',
      targetPages: ['*'],
      delaySeconds: 3,
      isActive: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (popup: PopupAd) => {
    setEditingId(popup.id);
    setFormData({
      name: popup.name,
      imageUrl: popup.imageUrl || '',
      heading: popup.heading || '',
      subheading: popup.subheading || '',
      buttonText: popup.buttonText || '',
      buttonLink: popup.buttonLink || '',
      targetPages: popup.targetPages || ['*'],
      delaySeconds: popup.delaySeconds || 3,
      isActive: popup.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this popup?')) {
      await popupService.deletePopup(id);
      fetchPopups();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await popupService.updatePopup(id, { isActive: !currentStatus });
    fetchPopups();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    
    setSaving(true);
    try {
      if (editingId) {
        await popupService.updatePopup(editingId, formData);
      } else {
        await popupService.createPopup(formData);
      }
      setIsModalOpen(false);
      fetchPopups();
    } catch (err) {
      console.error(err);
      alert('Error saving popup');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-heading">Popup <span className="text-maac-gold">Manager</span></h1>
        <button 
          onClick={openNewModal}
          className="bg-maac-gold text-obsidian-black px-6 py-2 font-heading text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors"
        >
          <Plus size={18} /> New Popup
        </button>
      </div>

      {loading ? (
        <div className="text-white/20">Loading Popups...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {popups.map((popup) => (
            <div key={popup.id} className="bg-deep-navy border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div>
                <h3 className="text-lg font-heading text-white">{popup.name}</h3>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-white/30 mt-1">
                  <span>Delay: {popup.delaySeconds}s</span>
                  <span>Pages: {popup.targetPages.join(', ')}</span>
                  <span className={popup.isActive ? 'text-maac-gold' : 'text-electric-red'}>
                    {popup.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleActive(popup.id, popup.isActive)}
                  className="p-3 bg-white/5 hover:bg-maac-gold/20 hover:text-maac-gold transition-all text-white/40"
                  title={popup.isActive ? 'Deactivate' : 'Activate'}
                >
                  {popup.isActive ? <Eye size={18} /> : <Eye size={18} className="opacity-20" />}
                </button>
                <button 
                  onClick={() => openEditModal(popup)}
                  className="p-3 bg-white/5 hover:bg-royal-blue/20 hover:text-royal-blue transition-all text-white/40" 
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(popup.id)}
                  className="p-3 bg-white/5 hover:bg-electric-red/20 hover:text-electric-red transition-all text-white/40" 
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          {popups.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/5 text-white/20 italic">
               No popups created yet.
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-deep-navy border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-deep-navy z-10">
                <h2 className="text-xl font-heading">{editingId ? 'Edit' : 'Create'} Popup</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40">Internal Name</label>
                    <input 
                      type="text" required 
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-obsidian-black border border-white/10 p-3 font-sans text-white focus:outline-none focus:border-maac-gold"
                      placeholder="e.g., Summer Batch Promo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40">Delay (Seconds)</label>
                    <input 
                      type="number" required min="0"
                      value={formData.delaySeconds} onChange={e => setFormData({...formData, delaySeconds: parseInt(e.target.value)})}
                      className="w-full bg-obsidian-black border border-white/10 p-3 font-sans text-white focus:outline-none focus:border-maac-gold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Target Pages (Comma separated, use * for all)</label>
                  <input 
                    type="text" required 
                    value={formData.targetPages.join(', ')} 
                    onChange={e => setFormData({...formData, targetPages: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})}
                    className="w-full bg-obsidian-black border border-white/10 p-3 font-sans text-white focus:outline-none focus:border-maac-gold"
                    placeholder="/, /courses, /about"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Image URL</label>
                  <input 
                    type="url" required 
                    value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full bg-obsidian-black border border-white/10 p-3 font-sans text-white focus:outline-none focus:border-maac-gold"
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Heading</label>
                  <input 
                    type="text" required 
                    value={formData.heading} onChange={e => setFormData({...formData, heading: e.target.value})}
                    className="w-full bg-obsidian-black border border-white/10 p-3 font-sans text-white focus:outline-none focus:border-maac-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40">Subheading</label>
                  <input 
                    type="text" required 
                    value={formData.subheading} onChange={e => setFormData({...formData, subheading: e.target.value})}
                    className="w-full bg-obsidian-black border border-white/10 p-3 font-sans text-white focus:outline-none focus:border-maac-gold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40">Button Text</label>
                    <input 
                      type="text" required 
                      value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})}
                      className="w-full bg-obsidian-black border border-white/10 p-3 font-sans text-white focus:outline-none focus:border-maac-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/40">Button Link</label>
                    <input 
                      type="text" required 
                      value={formData.buttonLink} onChange={e => setFormData({...formData, buttonLink: e.target.value})}
                      className="w-full bg-obsidian-black border border-white/10 p-3 font-sans text-white focus:outline-none focus:border-maac-gold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input 
                    type="checkbox" id="isActive"
                    checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 accent-maac-gold"
                  />
                  <label htmlFor="isActive" className="text-xs uppercase tracking-widest text-white">Active</label>
                </div>

                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-maac-gold text-obsidian-black font-heading uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors mt-8 disabled:opacity-50"
                >
                  <Save size={18} /> {saving ? 'Saving...' : 'Save Popup'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
