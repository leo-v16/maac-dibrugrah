'use client';

import { useState, useEffect } from 'react';
import { uploadMedia } from '@/lib/utils';
import { courseService } from '@/services/courseService';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Image as ImageIcon, Video, Music, Code } from 'lucide-react';
import Link from 'next/link';
import { revalidateCourses } from '@/app/actions';
import { Course } from '@/types';

interface CourseFormProps {
  initialData?: Course;
  id?: string;
}

export default function CourseForm({ initialData, id }: CourseFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    duration: initialData?.duration || '',
    content: (initialData?.content || '') + (initialData?.embeddedHtml ? `\n\n${initialData.embeddedHtml}` : ''),
    status: initialData?.status || 'draft' as 'draft' | 'published'
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id && !thumbnail) return alert("Thumbnail is required for new courses");

    setLoading(true);
    try {
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_COURSES as string;
      // Upload media if changed
      const [thumbnailUrl, videoUrl, audioUrl] = await Promise.all([
        thumbnail ? uploadMedia(thumbnail, preset) : Promise.resolve(initialData?.thumbnailUrl || ""),
        video ? uploadMedia(video, preset) : Promise.resolve(initialData?.videoUrl || ""),
        audio ? uploadMedia(audio, preset) : Promise.resolve(initialData?.audioUrl || "")
      ]);

      const slug = formData.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

      const courseData: any = {
        ...formData,
        slug,
        thumbnailUrl,
        embeddedHtml: "" // Explicitly clear old field
      };

      if (videoUrl) courseData.videoUrl = videoUrl;
      if (audioUrl) courseData.audioUrl = audioUrl;

      if (id) {
        await courseService.update(id, courseData);
      } else {
        await courseService.create(courseData);
      }

      // Trigger On-Demand Revalidation
      await revalidateCourses(slug);

      router.push("/admin/courses");
    } catch (error) {
      console.error(error);
      alert("Failed to save course. Please try again.");
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
          {id ? 'Edit' : 'New'} <span className="text-maac-gold">Course</span>
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
          <label className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Code size={12} /> Course Content (Supports HTML & Text)
          </label>
          <textarea
            required
            rows={15}
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            className="w-full bg-obsidian-black border border-white/10 p-4 focus:border-maac-gold outline-none transition-colors font-sans text-sm leading-relaxed"
            placeholder="Detailed course modules or custom HTML snippets..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Thumbnail */}
          <div className="space-y-3">
            <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${thumbnail || initialData?.thumbnailUrl ? 'text-maac-gold' : 'text-white/40'}`}>
              <ImageIcon size={14} /> Thumbnail * (Image or Video)
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={e => setThumbnail(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className={`text-xs p-3 border border-dashed transition-colors ${thumbnail || initialData?.thumbnailUrl ? 'border-maac-gold text-maac-gold' : 'border-white/10 text-white/20 group-hover:border-white/30'}`}>
                {thumbnail ? thumbnail.name : (initialData?.thumbnailUrl ? 'Current Thumbnail Attached' : 'Select Media...')}
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="space-y-3">
            <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${video || initialData?.videoUrl ? 'text-maac-gold' : 'text-white/40'}`}>
              <Video size={14} /> Preview Video (Optional)
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="video/*"
                onChange={e => setVideo(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className={`text-xs p-3 border border-dashed transition-colors ${video || initialData?.videoUrl ? 'border-maac-gold text-maac-gold' : 'border-white/10 text-white/20 group-hover:border-white/30'}`}>
                {video ? video.name : (initialData?.videoUrl ? 'Current Video Attached' : 'Select Video...')}
              </div>
            </div>
          </div>

          {/* Audio */}
          <div className="space-y-3">
            <label className={`text-[10px] uppercase tracking-widest flex items-center gap-2 ${audio || initialData?.audioUrl ? 'text-maac-gold' : 'text-white/40'}`}>
              <Music size={14} /> Audio Intro (Optional)
            </label>
            <div className="relative group">
              <input
                type="file"
                accept="audio/*"
                onChange={e => setAudio(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className={`text-xs p-3 border border-dashed transition-colors ${audio || initialData?.audioUrl ? 'border-maac-gold text-maac-gold' : 'border-white/10 text-white/20 group-hover:border-white/30'}`}>
                {audio ? audio.name : (initialData?.audioUrl ? 'Current Audio Attached' : 'Select Audio...')}
              </div>
            </div>
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
                <Save size={20} /> {id ? 'Update' : 'Create'} Course
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
