'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useEnquiryModal } from '@/context/EnquiryContext';
import { leadService } from '@/services/leadService';

export default function EnquiryModal() {
  const { isOpen, closeModal, availableCourses, selectedCourseName, contactPhone } = useEnquiryModal();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    courseInterest: 'Select Course'
  });

  // Sync with selected course from context when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        courseInterest: selectedCourseName || 'Select Course'
      }));
    }
  }, [isOpen, selectedCourseName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.courseInterest === 'Select Course') {
      alert('Please select a course of interest.');
      return;
    }
    
    setLoading(true);
    try {
      await leadService.createLead(formData as any);
      setSubmitted(true);
      setFormData({ name: '', phone: '', courseInterest: 'Select Course' });
    } catch (err) {
      console.error(err);
      alert('Failed to send enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-obsidian-black/90 backdrop-blur-md"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-deep-navy border border-white/10 shadow-2xl p-8 md:p-12 overflow-hidden"
          >
            {/* Decorative Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-maac-gold/5 blur-[50px]" />
            
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-maac-gold/10 border border-maac-gold/20 flex items-center justify-center mx-auto rounded-full text-maac-gold">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-heading text-white">Application Received</h2>
                <p className="text-white/50 font-sans max-w-xs mx-auto">Our academic experts will review your request and reach out within 24 hours.</p>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    closeModal();
                  }}
                  className="bg-maac-gold text-obsidian-black px-8 py-3 font-heading uppercase tracking-widest text-xs hover:bg-white transition-all"
                >
                  Close Modal
                </button>
              </motion.div>
            ) : (
              <div className="relative z-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-heading mb-2 leading-tight">
                    Start Your <span className="text-maac-gold">Career</span>
                  </h2>
                  <p className="text-white/40 font-sans uppercase tracking-[0.2em] text-[10px]">
                    Fill the form below to get started
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-white/30">Full Name</label>
                    <input 
                      type="text" name="name" required
                      value={formData.name} onChange={handleChange}
                      placeholder="e.g., Your Name"
                      className="w-full bg-obsidian-black border border-white/5 p-4 font-sans text-white focus:outline-none focus:border-maac-gold/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-white/30">Phone Number</label>
                    <input 
                      type="tel" name="phone" required
                      value={formData.phone} onChange={handleChange}
                      placeholder="e.g., +91 9876543210"
                      className="w-full bg-obsidian-black border border-white/5 p-4 font-sans text-white focus:outline-none focus:border-maac-gold/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-white/30">Course of Interest</label>
                    <select 
                      name="courseInterest" required
                      value={formData.courseInterest} onChange={handleChange}
                      className="w-full bg-obsidian-black border border-white/5 p-4 font-sans text-white focus:outline-none focus:border-maac-gold/50 transition-colors appearance-none"
                    >
                      <option disabled value="Select Course">Select Course</option>
                      {availableCourses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" disabled={loading}
                    className="w-full bg-electric-red text-white font-heading uppercase tracking-widest py-5 flex items-center justify-center gap-2 hover:bg-maac-gold hover:text-obsidian-black transition-all mt-6 disabled:opacity-50 group"
                  >
                    {loading ? 'Sending Request...' : 'Apply Now'} <Send size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
