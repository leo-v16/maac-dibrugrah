'use client';

import { useEffect } from 'react';
import { useEnquiryModal } from '@/context/EnquiryContext';
import { usePathname } from 'next/navigation';

export default function EnquiryOnLoad() {
  const { openModal } = useEnquiryModal();
  const pathname = usePathname();

  useEffect(() => {
    // Don't show on admin pages
    if (pathname.startsWith('/admin')) return;

    // Check if the user has already seen the popup in this session
    const hasSeen = sessionStorage.getItem('has_seen_enquiry_popup');

    if (!hasSeen) {
      const timer = setTimeout(() => {
        openModal();
        // Mark as seen for this session
        sessionStorage.setItem('has_seen_enquiry_popup', 'true');
      }, 5000); // Show after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [openModal, pathname]);

  return null; // This component doesn't render anything itself
}
