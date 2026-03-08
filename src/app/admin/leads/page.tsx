'use client';

import { useEffect, useState } from 'react';
import { leadService } from '@/services/leadService';
import { StudentLead } from '@/types';
import { Mail, Phone, Calendar, User, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<StudentLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getAllLeads();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        fetchLeads();
      } catch (err) {
        alert('Error deleting lead');
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-heading mb-10 uppercase">Student <span className="text-maac-gold">Leads</span></h1>

      {loading ? (
        <div className="text-white/20 font-sans animate-pulse">Loading Enquiries...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.2em] text-white/40">
                <th className="px-6 py-4 font-heading">Date</th>
                <th className="px-6 py-4 font-heading">Student</th>
                <th className="px-6 py-4 font-heading">Course Interest</th>
                <th className="px-6 py-4 font-heading">Contact</th>
                <th className="px-6 py-4 font-heading text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm">
              {leads.map((lead, idx) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-6 text-white/30 text-xs">
                    {lead.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-white/5 flex items-center justify-center text-white/20 group-hover:text-maac-gold transition-colors">
                          <User size={14} />
                       </div>
                       <span className="font-semibold text-white/80">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-maac-gold/80 font-heading text-xs tracking-wider">
                    {lead.courseInterest}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                       {lead.email && (
                         <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs">
                            <Mail size={12} /> {lead.email}
                         </a>
                       )}
                       <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs">
                          <Phone size={12} /> {lead.phone}
                       </a>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button 
                      onClick={() => handleDelete(lead.id)}
                      className="p-3 bg-white/5 hover:bg-electric-red/20 text-white/40 hover:text-electric-red transition-all"
                      title="Delete Lead"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {leads.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/5 text-white/20 italic font-sans">
               No leads captured yet. Your marketing engine is warming up!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
