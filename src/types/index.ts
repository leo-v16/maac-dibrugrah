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
