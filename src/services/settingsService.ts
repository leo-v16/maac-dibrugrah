import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cache } from "react";

export interface SiteSettings {
  showreelUrl: string;
  heroHeading: string;
  heroSubheading: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  aboutImageUrl: string;
  operatingHours: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  showreelUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  heroHeading: 'Master the Art of Visual Storytelling',
  heroSubheading: 'Game design and much more',
  contactPhone: '+91 86382 11893',
  contactEmail: 'info@maacdibrugarh.com',
  contactAddress: 'Dibrugarh, Assam, India',
  instagramUrl: 'https://www.instagram.com/maacdibrugarh?igsh=bDAwaWtobXQzcGRs',
  facebookUrl: 'https://www.facebook.com/share/1G5JQy51fx/',
  youtubeUrl: 'https://youtube.com/@maacdibrugarh?si=DEPzX9NSU410y1SQ',
  linkedinUrl: 'https://www.linkedin.com/company/maac-dibrugarh/',
  aboutImageUrl: '/maac-dibrugarh-banner-436KB.webp',
  operatingHours: 'Mon - Sat: 10:00 AM - 7:00 PM',
};

export const settingsService = {
  getSettings: cache(async (): Promise<SiteSettings> => {
    const docRef = doc(db, "settings", "global");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove non-serializable Firestore fields before returning
      const { updatedAt, ...cleanData } = data;
      return { ...DEFAULT_SETTINGS, ...cleanData } as SiteSettings;
    }
    return DEFAULT_SETTINGS;
  }),

  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    const docRef = doc(db, "settings", "global");
    await setDoc(docRef, {
      ...settings,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
};
