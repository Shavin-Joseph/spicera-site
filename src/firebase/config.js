import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Web app Firebase configuration supporting both environment variables and fallback
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyARJWkZwfgT-7aE8vZqCYed4utut2pcKcM",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "spicera-c0258.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "spicera-c0258",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "spicera-c0258.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "862806686",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:862806686:web:e6b1ae2be974632749d18f",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-PSWBYQD06F"
};

// Initialize Firebase safely (avoid multi-instance re-init)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics only in supported environments (browser)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Ignore if analytics is blocked or unsupported
    });
}

export default app;
