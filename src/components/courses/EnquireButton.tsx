'use client';

import { useEnquiryModal } from '@/context/EnquiryContext';

export default function EnquireButton({ courseTitle }: { courseTitle: string }) {
  const { openModal } = useEnquiryModal();

  return (
    <button 
      onClick={() => openModal(courseTitle)}
      className="w-full bg-maac-gold text-obsidian-black py-4 font-heading uppercase tracking-widest text-xs hover:bg-white transition-all"
    >
      Enquire for Batches
    </button>
  );
}
