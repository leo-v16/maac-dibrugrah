import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc,
  deleteDoc,
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

  async getBlogById(id: string): Promise<Blog | null> {
    const docRef = doc(db, "blogs", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
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
  },

  async updateBlog(id: string, blog: Partial<Blog>): Promise<void> {
    const docRef = doc(db, "blogs", id);
    await updateDoc(docRef, blog);
  },

  async deleteBlog(id: string): Promise<void> {
    const docRef = doc(db, "blogs", id);
    await deleteDoc(docRef);
  }
};
