'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEnquiryModal } from '@/context/EnquiryContext';
import { BRAND_ASSETS } from '@/lib/constants';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Courses', href: '/courses' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { openModal } = useEnquiryModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide Navbar on Admin routes
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-4 bg-obsidian-black border-b border-deep-navy',
        scrolled ? 'py-3' : 'py-4'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img 
            src={BRAND_ASSETS.LOGO} 
            alt="MAAC Dibrugarh Logo" 
            className="h-16 w-auto transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'text-sm uppercase tracking-widest transition-colors hover:text-maac-gold',
                pathname === link.href ? 'text-maac-gold font-semibold' : 'text-white/70'
              )}
            >
              {link.name}
            </Link>
          ))}
          <button 
            onClick={() => openModal()}
            className="bg-electric-red hover:bg-electric-red/90 text-white px-6 py-2 text-sm uppercase tracking-widest font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            Enquire Now <ChevronRight size={16} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-[72px] bg-obsidian-black z-40 md:hidden flex flex-col p-8 gap-6 border-t border-deep-navy"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'text-2xl font-heading uppercase tracking-wider',
                  pathname === link.href ? 'text-maac-gold' : 'text-white'
                )}
              >
                {link.name}
              </Link>
            ))}
            <button 
              onClick={() => {
                setIsOpen(false);
                openModal();
              }}
              className="mt-4 bg-electric-red text-white w-full py-4 font-heading uppercase tracking-widest text-lg"
            >
              Enquire Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
