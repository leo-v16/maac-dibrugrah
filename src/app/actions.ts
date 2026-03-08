'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateCourses(slug?: string) {
  revalidatePath('/');
  revalidatePath('/courses');
  if (slug) {
    revalidatePath(`/courses/${slug}`);
  }
  revalidatePath('/courses/[slug]', 'page');
}

export async function revalidateGallery() {
  revalidatePath('/');
  revalidatePath('/gallery');
}

export async function revalidateBlogs(slug?: string) {
  revalidatePath('/blog');
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidatePath('/blog/[slug]', 'page');
}

export async function revalidateAll() {
  revalidatePath('/', 'layout');
}
