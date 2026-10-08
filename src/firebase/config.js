import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARJWkZwfgT-7aE8vZqCYed4utut2pcKcM",
  authDomain: "spicera-c0258.firebaseapp.com",
  projectId: "spicera-c0258",
  storageBucket: "spicera-c0258.firebasestorage.app",
  messagingSenderId: "862806686",
  appId: "1:862806686:web:e6b1ae2be974632749d18f",
  measurementId: "G-PSWBYQD06F"
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
