import type { Metadata } from 'next';
import { Montserrat, Poppins } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-montserrat',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'MAAC Dibrugarh - Animation, VFX, and Digital Content Academy',
  description: 'Official website for MAAC Dibrugarh, the premier academy for Animation, VFX, 3D, and AI-driven marketing solutions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased text-white bg-obsidian-black selection:bg-maac-gold selection:text-obsidian-black">
        <div className="noise-overlay" />
        <Navbar />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
