import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc 
} from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: 'patient' | 'doctor' | 'caretaker';
  createdAt: any;
}

export const getPatients = async () => {
  const q = query(collection(db, 'users'), where('role', '==', 'patient'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
};

export const getUserProfile = async (uid: string) => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};
