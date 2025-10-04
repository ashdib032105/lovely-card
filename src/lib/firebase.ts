import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate configuration
function validateConfig() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    console.error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}\n` +
      'Please check your .env.local file and ensure all Firebase configuration variables are set.'
    );
    return false;
  }
  return true;
}

// Initialize Firebase (lazy initialization)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Skip initialization on server side
    return null;
  }

  if (!validateConfig()) {
    return null;
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }

  return app;
}

// Get Firestore instance
export function getDb(): Firestore {
  if (!db) {
    const firebaseApp = initializeFirebase();
    if (!firebaseApp) {
      throw new Error('Firebase not initialized. Check your environment variables.');
    }
    db = getFirestore(firebaseApp);
  }
  return db;
}

// Get Storage instance
export function getStorageInstance(): FirebaseStorage {
  if (!storage) {
    const firebaseApp = initializeFirebase();
    if (!firebaseApp) {
      throw new Error('Firebase not initialized. Check your environment variables.');
    }
    storage = getStorage(firebaseApp);
  }
  return storage;
}

// Export for backward compatibility
export { db, storage };

// Initialize on client side only
if (typeof window !== 'undefined') {
  initializeFirebase();
}

export default app;
