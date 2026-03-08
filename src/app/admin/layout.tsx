'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { LayoutDashboard, FileText, Users, LogOut, ExternalLink, Menu, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BRAND_ASSETS } from '@/lib/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        if (!pathname.includes('/admin/login')) {
          router.push('/admin/login');
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) return <div className="min-h-screen bg-obsidian-black flex items-center justify-center text-maac-gold">Verifying Session...</div>;
  
  if (!user && !pathname.includes('/admin/login')) return null;
  if (pathname.includes('/admin/login')) return <>{children}</>;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: FileText, label: 'Blog Posts', href: '/admin/blogs' },
    { icon: LayoutDashboard, label: 'Courses', href: '/admin/courses' },
    { icon: FileText, label: 'Student Gallery', href: '/admin/gallery' },
    { icon: LayoutDashboard, label: 'Pop-up Ads', href: '/admin/ads' },
    { icon: Users, label: 'Student Leads', href: '/admin/leads' },
    { icon: Settings, label: 'Settings', href: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-obsidian-black flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-deep-navy border-b border-white/5">
        <Link href="/admin" className="group">
          <img src={BRAND_ASSETS.LOGO} alt="Logo" className="h-14 w-auto" />
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-deep-navy border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8">
          <Link href="/admin" className="block mb-12">
            <img src={BRAND_ASSETS.LOGO} alt="MAAC Admin" className="h-14 w-auto" />
          </Link>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-sans tracking-widest uppercase transition-all",
                  (item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)) 
                    ? "bg-maac-gold text-obsidian-black font-bold" 
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 border-t border-white/5">
           <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm text-white/40 hover:text-white mb-2">
            <ExternalLink size={18} /> View Site
          </Link>
          <button 
            onClick={() => signOut(auth)}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm text-electric-red hover:bg-electric-red/10 transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
