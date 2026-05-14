import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Explicitly load .env from the server root
dotenv.config({ path: join(__dirname, '../.env') });

console.log('🚀 Initializing Firebase Admin...');
console.log('Project ID from env:', process.env.FIREBASE_PROJECT_ID);

const getServiceAccount = () => {
  try {
    const saString = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (saString) {
      // If the string starts and ends with single quotes (from how I wrote it to file), strip them
      const cleanString = saString.startsWith("'") && saString.endsWith("'") 
        ? saString.slice(1, -1) 
        : saString;
      return JSON.parse(cleanString);
    }
  } catch (err) {
    console.error('❌ Error parsing FIREBASE_SERVICE_ACCOUNT:', err.message);
  }
  return null;
};

const serviceAccount = getServiceAccount();

if (!admin.apps.length) {
  try {
    if (serviceAccount) {
      console.log('✅ Using Service Account from environment');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else if (process.env.FIREBASE_PROJECT_ID) {
      console.log('⚠️ No service account found, falling back to Project ID:', process.env.FIREBASE_PROJECT_ID);
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    } else {
      console.error('❌ No Firebase configuration found in .env!');
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.stack);
  }
}

export const firebaseAdmin = admin;
export const db = admin.apps.length ? admin.firestore() : null;
export const auth = admin.apps.length ? admin.auth() : null;
export const messaging = admin.apps.length ? admin.messaging() : null;

if (admin.apps.length) {
  console.log('✨ Firebase Admin initialized successfully');
}
