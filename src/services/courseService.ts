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
import { Course } from "@/types";

const courseCollection = collection(db, "courses");

export const courseService = {
  async getPublished(): Promise<Course[]> {
    const q = query(
      courseCollection,
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Course));
  },

  async getBySlug(slug: string): Promise<Course | null> {
    const q = query(courseCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docData = querySnapshot.docs[0];
    return {
      id: docData.id,
      ...docData.data()
    } as Course;
  },

  async getAll(): Promise<Course[]> {
    const q = query(courseCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Course));
  },

  async create(data: Omit<Course, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(courseCollection, {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, "courses", id);
    await deleteDoc(docRef);
  }
};
