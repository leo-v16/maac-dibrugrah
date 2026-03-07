'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { leadService } from '@/services/leadService';

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseInterest: 'Select Course'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.courseInterest === 'Select Course') {
      alert('Please select a course of interest.');
      return;
    }
    
    setLoading(true);
    try {
      await leadService.createLead(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', courseInterest: 'Select Course' });
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
    <section id="contact" className="relative h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start">
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          
          {/* Contact Details */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-heading mb-8 leading-tight">
                Let's <span className="text-maac-gold">Connect</span>
              </h2>
              <p className="text-white/60 mb-10 font-sans text-lg max-w-md">
                Have questions about our courses or career opportunities? Our team is ready to help you start your journey.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-deep-navy border border-white/10 flex items-center justify-center text-maac-gold">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm tracking-widest text-white/40 mb-1">Location</h4>
                    <p className="font-sans text-lg">Dibrugarh, Assam, India</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-deep-navy border border-white/10 flex items-center justify-center text-maac-gold">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm tracking-widest text-white/40 mb-1">Call Us</h4>
                    <p className="font-sans text-lg">+91 XXXXX XXXXX</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-deep-navy border border-white/10 flex items-center justify-center text-maac-gold">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm tracking-widest text-white/40 mb-1">Email</h4>
                    <p className="font-sans text-lg">info@maacdibrugarh.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enquiry Form */}
          <div className="flex-1 w-full bg-deep-navy border border-white/5 p-8 md:p-12 relative overflow-hidden group min-h-[500px] flex flex-col justify-center">
             {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-maac-gold/5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-maac-gold/10 transition-colors" />
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 relative z-10"
              >
                <div className="w-20 h-20 bg-maac-gold/10 border border-maac-gold/20 flex items-center justify-center mx-auto rounded-full text-maac-gold">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-heading text-white">Message Sent!</h3>
                <p className="text-white/50 font-sans max-w-xs mx-auto">Thank you for reaching out. Our academic counselor will contact you shortly.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-maac-gold font-heading text-xs tracking-widest uppercase border-b border-maac-gold pb-1 hover:text-white hover:border-white transition-all"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 relative z-10"
                onSubmit={handleSubmit}
              >
                <h3 className="text-2xl font-heading mb-8">Quick Enquiry</h3>
                
                <div className="space-y-4">
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Your Name" 
                    className="w-full bg-obsidian-black border border-white/10 p-4 font-sans text-white focus:outline-none focus:border-maac-gold transition-colors"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., example@email.com" 
                      className="w-full bg-obsidian-black border border-white/10 p-4 font-sans text-white focus:outline-none focus:border-maac-gold transition-colors"
                    />
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number" 
                      className="w-full bg-obsidian-black border border-white/10 p-4 font-sans text-white focus:outline-none focus:border-maac-gold transition-colors"
                    />
                  </div>
                  <select 
                    name="courseInterest"
                    required
                    value={formData.courseInterest}
                    onChange={handleChange}
                    className="w-full bg-obsidian-black border border-white/10 p-4 font-sans text-white focus:outline-none focus:border-maac-gold transition-colors appearance-none"
                  >
                    <option disabled>Select Course</option>
                    <option>3D Animation</option>
                    <option>VFX (Visual Effects)</option>
                    <option>Game Design</option>
                    <option>Digital Marketing</option>
                    <option>AI for Digital Content</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-maac-gold text-obsidian-black font-heading uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'} <Send size={18} />
                </button>
              </motion.form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
