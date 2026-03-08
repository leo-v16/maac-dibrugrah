import { 
  collection, 
  getDocs, 
  doc, 
  addDoc, 
  updateDoc,
  query, 
  where, 
  limit,
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Ad } from "@/types";

const adCollection = collection(db, "ads");

export const adService = {
  async getActiveAd(): Promise<Ad | null> {
    const q = query(
      adCollection, 
      where("isActive", "==", true), 
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;
    const docData = querySnapshot.docs[0];
    const data = docData.data();
    return {
      id: docData.id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    } as Ad;
  },

  async getAllAds(): Promise<Ad[]> {
    const q = query(adCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      } as Ad;
    });
  },

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

  async deactivateAllAds(): Promise<void> {
    const q = query(adCollection, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    const promises = querySnapshot.docs.map(d => updateDoc(doc(db, "ads", d.id), { isActive: false }));
    await Promise.all(promises);
  }
};
