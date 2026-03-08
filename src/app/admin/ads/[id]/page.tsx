'use client';

import { useEffect, useState, use } from 'react';
import { adService } from '@/services/adService';
import { Ad } from '@/types';
import AdForm from '@/components/admin/AdForm';

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const data = await adService.getAdById(id);
        setAd(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  if (loading) return <div className="text-maac-gold pt-32 text-center font-heading uppercase tracking-widest">Loading Ad Data...</div>;
  if (!ad) return <div className="text-white pt-32 text-center font-heading uppercase tracking-widest">Ad not found.</div>;

  return <AdForm initialData={ad} id={id} />;
}
