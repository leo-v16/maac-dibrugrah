import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { GalleryItem } from "@/types";

const galleryCollection = collection(db, "student_gallery");

export const galleryService = {
  async getAllItems(): Promise<GalleryItem[]> {
    const q = query(galleryCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      } as GalleryItem;
    });
  },

  async createItem(item: Omit<GalleryItem, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(galleryCollection, {
      ...item,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async deleteItem(id: string): Promise<void> {
    const docRef = doc(db, "student_gallery", id);
    await deleteDoc(docRef);
  }
};
