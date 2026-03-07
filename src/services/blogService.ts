import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/types";

const blogCollection = collection(db, "posts");

export const blogService = {
  async getPublishedPosts(): Promise<BlogPost[]> {
    const q = query(
      blogCollection, 
      where("published", "==", true), 
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  },

  async getAllPosts(): Promise<BlogPost[]> {
    const q = query(blogCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  },

  async getPostById(id: string): Promise<BlogPost | null> {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as BlogPost;
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const q = query(blogCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docData = querySnapshot.docs[0];
    return { id: docData.id, ...docData.data() } as BlogPost;
  },

  async createPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const docRef = await addDoc(blogCollection, {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updatePost(id: string, post: Partial<BlogPost>): Promise<void> {
    const docRef = doc(db, "posts", id);
    await updateDoc(docRef, {
      ...post,
      updatedAt: serverTimestamp(),
    });
  },

  async deletePost(id: string): Promise<void> {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  }
};
