import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp, 
  where
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PopupAd } from "@/types";

const popupCollection = collection(db, "popups");

export const popupService = {
  async getAllPopups(): Promise<PopupAd[]> {
    const q = query(popupCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PopupAd));
  },

  async getActivePopups(): Promise<PopupAd[]> {
    const q = query(popupCollection, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PopupAd));
  },

  async createPopup(popup: Omit<PopupAd, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(popupCollection, {
      ...popup,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async updatePopup(id: string, data: Partial<PopupAd>): Promise<void> {
    const docRef = doc(db, "popups", id);
    await updateDoc(docRef, data);
  },

  async deletePopup(id: string): Promise<void> {
    const docRef = doc(db, "popups", id);
    await deleteDoc(docRef);
  }
};
