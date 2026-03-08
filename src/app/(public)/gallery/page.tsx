import { galleryService } from '@/services/galleryService';
import GalleryGrid from '@/components/GalleryGrid';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Student Gallery - MAAC Dibrugarh',
  description: 'Explore the breathtaking animation, VFX, and digital art created by the talented students of MAAC Dibrugarh.',
};

export default async function GalleryPage() {
  // Fetch all items statically on the server to protect Firebase read quotas
  const galleryItems = await galleryService.getAllItems();

  return (
    <div className="pt-32 pb-24 bg-obsidian-black min-h-screen text-white">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h1 className="text-5xl md:text-6xl font-heading mb-4 uppercase tracking-tight">
            Student <span className="text-maac-gold">Showcase</span>
          </h1>
          <p className="text-white/40 font-sans tracking-widest uppercase text-sm">
            A window into the next generation of creative masters
          </p>
        </div>

        {galleryItems.length > 0 ? (
          <GalleryGrid items={galleryItems} />
        ) : (
          <div className="text-center py-24 border border-dashed border-white/10 italic text-white/20 font-sans">
            Our masterpiece gallery is being curated. Check back soon to see amazing student work.
          </div>
        )}
      </div>
    </div>
  );
}
