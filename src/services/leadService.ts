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
import { StudentLead } from "@/types";

const leadCollection = collection(db, "leads");

export const leadService = {
  async getAllLeads(): Promise<StudentLead[]> {
    const q = query(leadCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentLead));
  },

  async createLead(lead: Omit<StudentLead, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(leadCollection, {
      ...lead,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async deleteLead(id: string): Promise<void> {
    const docRef = doc(db, "leads", id);
    await deleteDoc(docRef);
  }
};
