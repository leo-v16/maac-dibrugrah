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
import { Ad } from "@/types";
import { cache } from "react";

const adCollection = collection(db, "ads");

export const adService = {
  getActiveAds: cache(async (): Promise<Ad[]> => {
    const q = query(
      adCollection, 
      where("isActive", "==", true), 
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        targetPages: data.targetPages || ['*'],
        delaySeconds: data.delaySeconds ?? 3,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      } as Ad;
    });
  }),

  getAdById: cache(async (id: string): Promise<Ad | null> => {
    const docRef = doc(db, "ads", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      targetPages: data.targetPages || ['*'],
      delaySeconds: data.delaySeconds ?? 3,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    } as Ad;
  }),

  getAllAds: cache(async (): Promise<Ad[]> => {
    const querySnapshot = await getDocs(adCollection);
    const ads = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        targetPages: data.targetPages || ['*'],
        delaySeconds: data.delaySeconds ?? 3,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      } as Ad;
    });
    return ads.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }),

  async createAd(ad: Omit<Ad, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(adCollection, {
      ...ad,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updateAd(id: string, ad: Partial<Ad>): Promise<void> {
    const docRef = doc(db, "ads", id);
    await updateDoc(docRef, ad);
  },

  async deleteAd(id: string): Promise<void> {
    const docRef = doc(db, "ads", id);
    await deleteDoc(docRef);
  },

  async deactivateAllAds(): Promise<void> {
    const q = query(adCollection, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    const promises = querySnapshot.docs.map(d => updateDoc(doc(db, "ads", d.id), { isActive: false }));
    await Promise.all(promises);
  }
};
