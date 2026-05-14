import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDCJ8QYmBQFoRuzsGuWAn0QWf5YfUEn4CM",
  authDomain: "ai-assisted-medication.firebaseapp.com",
  projectId: "ai-assisted-medication",
  storageBucket: "ai-assisted-medication.firebasestorage.app",
  messagingSenderId: "621601355295",
  appId: "1:621601355295:web:71b3d0e3a936ace130872a",
  measurementId: "G-KPZ0115DJP"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

export default app;
