'use client';

import { useEffect, useState, use } from 'react';
import { blogService } from '@/services/blogService';
import { BlogPost } from '@/types';
import PostForm from '@/components/admin/PostForm';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogService.getPostById(id);
        setPost(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-maac-gold pt-32 text-center">Loading Story Data...</div>;
  if (!post) return <div className="text-white pt-32 text-center">Post not found.</div>;

  return <PostForm initialData={post} id={id} />;
}
