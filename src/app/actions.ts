'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateCourses(slug?: string) {
  revalidatePath('/');
  revalidatePath('/courses');
  if (slug) {
    revalidatePath(`/courses/${slug}`);
  }
  // Also revalidate the dynamic route pattern
  revalidatePath('/courses/[slug]', 'page');
}

export async function revalidateGallery() {
  revalidatePath('/');
  revalidatePath('/gallery');
}
