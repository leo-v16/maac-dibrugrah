'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, Instagram, Facebook, Youtube, Linkedin, MessageCircle } from 'lucide-react';
import { leadService } from '@/services/leadService';
import { useEnquiryModal } from '@/context/EnquiryContext';
import { SiteSettings } from '@/services/settingsService';

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  const { availableCourses } = useEnquiryModal();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    courseInterest: 'Select Your Interest'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.courseInterest === 'Select Your Interest') {
      alert('Please select your interest.');
      return;
    }
    
    setLoading(true);
    try {
      await leadService.createLead(formData as any);
      setSubmitted(true);
      setFormData({ name: '', phone: '', courseInterest: 'Select Your Interest' });
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
    <section id="contact" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-obsidian-black snap-start py-8 md:py-0">
      <div className="container mx-auto px-6 py-8 md:py-20">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          
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
              
              <div className="space-y-8 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-deep-navy border border-white/10 flex items-center justify-center text-maac-gold">
                    <MapPin className="w-12 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm tracking-widest text-white/40 mb-1">Location</h4>
                    <p className="font-sans text-lg">{settings.contactAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-deep-navy border border-white/10 flex items-center justify-center text-maac-gold">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm tracking-widest text-white/40 mb-1">Call Us</h4>
                    <p className="font-sans text-lg">{settings.contactPhone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-deep-navy border border-white/10 flex items-center justify-center text-maac-gold">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm tracking-widest text-white/40 mb-1">Email</h4>
                    <p className="font-sans text-lg">{settings.contactEmail}</p>
                  </div>
                </div>

                <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group/wa">
                  <div className="w-12 h-12 bg-deep-navy border border-white/10 flex items-center justify-center text-maac-gold group-hover/wa:border-maac-gold/50 group-hover/wa:bg-maac-gold/5 transition-all">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-heading text-sm tracking-widest text-white/40 mb-1">WhatsApp</h4>
                    <p className="font-sans text-lg group-hover/wa:text-maac-gold transition-colors">Click to chat</p>
                  </div>
                </a>
              </div>

              {/* Social Media Links */}
              <div className="space-y-4">
                <h4 className="font-heading text-sm tracking-widest text-white/40 uppercase">Follow Our Studio</h4>
                <div className="flex gap-4">
                  <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-deep-navy border border-white/5 flex items-center justify-center text-white/40 hover:text-maac-gold hover:border-maac-gold/30 transition-all" title="WhatsApp">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-deep-navy border border-white/5 flex items-center justify-center text-white/40 hover:text-maac-gold hover:border-maac-gold/30 transition-all">
                    <Instagram size={20} />
                  </a>
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-deep-navy border border-white/5 flex items-center justify-center text-white/40 hover:text-maac-gold hover:border-maac-gold/30 transition-all">
                    <Facebook size={20} />
                  </a>
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-deep-navy border border-white/5 flex items-center justify-center text-white/40 hover:text-maac-gold hover:border-maac-gold/30 transition-all">
                    <Youtube size={20} />
                  </a>
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-deep-navy border border-white/5 flex items-center justify-center text-white/40 hover:text-maac-gold hover:border-maac-gold/30 transition-all">
                    <Linkedin size={20} />
                  </a>
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
                <h3 className="text-2xl font-heading mb-8 uppercase">Quick Enquiry</h3>
                
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
                  <div className="space-y-4">
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., +91 9876543210"
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
                    <option disabled value="Select Your Interest">Select Your Interest</option>
                    {availableCourses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
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
