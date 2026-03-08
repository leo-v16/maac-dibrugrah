export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  createdAt: any;
  updatedAt: any;
  author: string;
}

export interface StudentLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseInterest: string;
  createdAt: any;
}

export interface PopupAd {
  id: string;
  name: string;
  imageUrl: string;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink: string;
  targetPages: string[];
  delaySeconds: number;
  isActive: boolean;
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
