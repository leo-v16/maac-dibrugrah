'use client';

import { useState } from 'react';
import { uploadMedia } from '@/lib/utils';
import { courseService } from '@/services/courseService';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Upload, Image as ImageIcon, Video, Music } from 'lucide-react';
import Link from 'next/link';
import { revalidateCourses } from '@/app/actions';

export default function NewCoursePage() {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    duration: '',
    content: '',
    status: 'draft' as 'draft' | 'published'
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnail) return alert("Thumbnail is required");

    setLoading(true);
    try {
      // Upload all media in parallel
      const [thumbnailUrl, videoUrl, audioUrl] = await Promise.all([
        uploadMedia(thumbnail),
        video ? uploadMedia(video) : Promise.resolve(""),
        audio ? uploadMedia(audio) : Promise.resolve("")
      ]);

      const slug = formData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const courseData: any = {
        ...formData,
        slug,
        thumbnailUrl,
      };

      if (videoUrl) courseData.videoUrl = videoUrl;
      if (audioUrl) courseData.audioUrl = audioUrl;

      await courseService.create(courseData);

      // Trigger On-Demand Revalidation for static pages
      await revalidateCourses(slug);

      router.push("/admin/courses");
    } catch (error) {
      console.error(error);
      alert("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/courses" className="text-white/40 hover:text-white transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-heading">
          New <span className="text-maac-gold">Course</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-deep-navy border border-white/5 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">Course Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors"
              placeholder="e.g., Advanced 3D Animation"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-white/40">Duration</label>
            <input
              type="text"
              required
              value={formData.duration}
              onChange={e => setFormData({ ...formData, duration: e.target.value })}
              className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors"
              placeholder="e.g., 12 Months"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40">Short Excerpt</label>
          <textarea
            required
            value={formData.excerpt}
            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors resize-none"
            placeholder="A brief summary for the grid view..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest text-white/40">Full Syllabus / Content</label>
          <textarea
            required
            rows={10}
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors font-sans"
            placeholder="Detailed course modules..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <ImageIcon size={14} /> Thumbnail *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setThumbnail(e.target.files?.[0] || null)}
              className="text-xs text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-white/10"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Video size={14} /> Preview Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={e => setVideo(e.target.files?.[0] || null)}
              className="text-xs text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-white/10"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Music size={14} /> Audio Intro
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={e => setAudio(e.target.files?.[0] || null)}
              className="text-xs text-white/40 file:bg-white/5 file:border-none file:text-white file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-white/10"
            />
          </div>
        </div>

        <div className="pt-8">
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-heading uppercase tracking-widest">Status:</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as any })}
              className="bg-obsidian-black border border-white/10 px-4 py-2 outline-none focus:border-maac-gold"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-maac-gold hover:bg-white text-obsidian-black py-5 font-heading uppercase tracking-[0.2em] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>Processing Assets...</>
            ) : (
              <>
                <Save size={20} /> Create Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
