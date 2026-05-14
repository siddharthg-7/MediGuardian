import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : null;

if (!admin.apps.length) {
  try {
    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Fallback for development if service account is not provided
      // Usually you would use GOOGLE_APPLICATION_CREDENTIALS env var
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Firebase Admin initialization error:', error.stack);
  }
}

export const firebaseAdmin = admin;
export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();
