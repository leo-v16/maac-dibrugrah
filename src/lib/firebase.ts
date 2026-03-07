import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA_6evgnK9WoZ6iUsebd1IknXWfise898E",
  authDomain: "exam-hub-main.firebaseapp.com",
  projectId: "exam-hub-main",
  storageBucket: "exam-hub-main.firebasestorage.app",
  messagingSenderId: "903480011108",
  appId: "1:903480011108:web:8432eaadb351cf0daa3271",
  measurementId: "G-1F94R4WFKT"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Analytics only works in the browser
const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export { app, db, auth, storage, analytics };
