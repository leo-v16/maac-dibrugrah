export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  createdAt: any;
}

export interface Ad {
  id: string;
  title: string;
  mediaUrl: string;
  targetLink: string;
  isActive: boolean;
  targetPages: string[];
  delaySeconds: number;
  createdAt: any;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  duration: string;
  content: string;
  thumbnailUrl: string;
  videoUrl?: string;
  audioUrl?: string;
  embeddedHtml?: string;
  status: 'draft' | 'published';
  createdAt: any;
}

export interface StudentLead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  courseInterest: string;
  createdAt: any;
}

export interface GalleryItem {
  id: string;
  title: string;
  studentName: string;
  mediaType: 'image' | 'video';
  thumbnailUrl: string;
  videoUrl?: string;
  createdAt: any;
}
