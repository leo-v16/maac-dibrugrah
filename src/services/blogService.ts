import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Blog } from "@/types";

const blogCollection = collection(db, "blogs");

export const blogService = {
  async getAllBlogs(): Promise<Blog[]> {
    const q = query(blogCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      } as Blog;
    });
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const q = query(blogCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docData = querySnapshot.docs[0];
    const data = docData.data();
    return {
      id: docData.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    } as Blog;
  },

  async createBlog(blog: Omit<Blog, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(blogCollection, {
      ...blog,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
};
