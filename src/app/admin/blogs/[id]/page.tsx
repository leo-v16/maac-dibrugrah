'use client';

import { useEffect, useState, use } from 'react';
import { blogService } from '@/services/blogService';
import { Blog } from '@/types';
import BlogForm from '@/components/admin/BlogForm';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getBlogById(id);
        setBlog(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <div className="text-maac-gold pt-32 text-center font-heading uppercase tracking-widest">Loading Story Data...</div>;
  if (!blog) return <div className="text-white pt-32 text-center font-heading uppercase tracking-widest">Story not found.</div>;

  return <BlogForm initialData={blog} id={id} />;
}
