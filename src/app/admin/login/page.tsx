'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, ChevronRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate Limiting
    const now = Date.now();
    const lastAttempts = JSON.parse(localStorage.getItem('admin_login_attempts') || '[]');
    const fifteenMinsAgo = now - 900000;
    const recentAttempts = lastAttempts.filter((t: number) => t > fifteenMinsAgo);

    if (recentAttempts.length >= 5) {
      setError('Too many failed attempts. Please wait 15 minutes.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.removeItem('admin_login_attempts'); // Clear on success
      router.push('/admin');
    } catch (err: any) {
      recentAttempts.push(now);
      localStorage.setItem('admin_login_attempts', JSON.stringify(recentAttempts));
      setError('Invalid credentials. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-black flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-deep-navy border border-white/5 p-10 relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-maac-gold/5 blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 text-center mb-10">
          <div className="w-12 h-12 bg-maac-gold flex items-center justify-center mx-auto mb-6 rounded-sm">
            <Lock className="text-obsidian-black" size={24} />
          </div>
          <h1 className="text-2xl font-heading mb-2">Admin Portal</h1>
          <p className="text-white/40 font-sans text-xs tracking-[0.2em] uppercase">Secure Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-maac-gold transition-colors" size={18} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 pl-12 font-sans text-white focus:outline-none focus:border-maac-gold transition-colors"
              />
            </div>
            
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-maac-gold transition-colors" size={18} />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-black border border-white/10 p-4 pl-12 font-sans text-white focus:outline-none focus:border-maac-gold transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-electric-red text-xs font-sans text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maac-gold text-obsidian-black font-heading uppercase tracking-widest py-4 flex items-center justify-center gap-2 hover:bg-white transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Enter Dashboard'} <ChevronRight size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
