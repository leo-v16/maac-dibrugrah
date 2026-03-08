import { Metadata } from 'next';
import { courseService } from '@/services/courseService';
import { blogService } from '@/services/blogService';

const BASE_URL = 'https://maacdibrugarh.com';

export default async function sitemap() {
  // Static routes
  const staticRoutes = ['', '/about', '/courses', '/blog', '/gallery', '/contact'].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic courses
  const courses = await courseService.getPublished();
  const courseRoutes = courses.map((course) => ({
    url: `${BASE_URL}/courses/${course.slug}`,
    lastModified: course.createdAt || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Fetch dynamic blogs
  const blogs = await blogService.getAllBlogs();
  const blogRoutes = blogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: blog.createdAt || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...blogRoutes];
}
