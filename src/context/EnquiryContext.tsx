'use client';

import React, { createContext, useContext, useState } from 'react';

interface EnquiryContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <EnquiryContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiryModal() {
  const context = useContext(EnquiryContext);
  if (context === undefined) {
    throw new Error('useEnquiryModal must be used within an EnquiryProvider');
  }
  return context;
}
