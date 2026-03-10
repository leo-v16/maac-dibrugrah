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
import { cache } from "react";

const courseCollection = collection(db, "courses");

export const courseService = {
  getPublished: cache(async (): Promise<Course[]> => {
    const q = query(
      courseCollection,
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      } as Course;
    });
  }),

  getBySlug: cache(async (slug: string): Promise<Course | null> => {
    const q = query(courseCollection, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docData = querySnapshot.docs[0];
    const data = docData.data();
    return {
      id: docData.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    } as Course;
  }),

  getAll: cache(async (): Promise<Course[]> => {
    const q = query(courseCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      } as Course;
    });
  }),

  getById: cache(async (id: string): Promise<Course | null> => {
    const docRef = doc(db, "courses", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    } as Course;
  }),

  async create(data: Omit<Course, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(courseCollection, {
      ...data,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, data: Partial<Course>): Promise<void> {
    const docRef = doc(db, "courses", id);
    await updateDoc(docRef, data);
  },

  async delete(id: string): Promise<void> {
    const docRef = doc(db, "courses", id);
    await deleteDoc(docRef);
  }
};
