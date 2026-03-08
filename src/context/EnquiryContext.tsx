'use client';

import React, { createContext, useContext, useState } from 'react';

interface EnquiryContextType {
  isOpen: boolean;
  openModal: (courseName?: string) => void;
  closeModal: () => void;
  availableCourses: string[];
  selectedCourseName: string | null;
  contactPhone: string;
}

const EnquiryContext = createContext<EnquiryContextType | undefined>(undefined);

export function EnquiryProvider({ 
  children, 
  initialCourses = [],
  contactPhone = ''
}: { 
  children: React.ReactNode; 
  initialCourses?: string[];
  contactPhone?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState<string | null>(null);

  const openModal = (courseName?: string) => {
    if (courseName) {
      setSelectedCourseName(courseName);
    } else {
      setSelectedCourseName(null);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCourseName(null);
  };

  return (
    <EnquiryContext.Provider value={{ 
      isOpen, 
      openModal, 
      closeModal, 
      availableCourses: initialCourses,
      selectedCourseName,
      contactPhone
    }}>
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
