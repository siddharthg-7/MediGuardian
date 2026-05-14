import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../services/firebase';

export const wipePatientData = async () => {
  console.log('🧹 Starting database cleanup...');

  // 1. Delete all prescriptions
  const prescriptionsSnap = await getDocs(collection(db, 'prescriptions'));
  const pDeletes = prescriptionsSnap.docs.map(d => deleteDoc(doc(db, 'prescriptions', d.id)));
  
  // 2. Delete all medicine logs
  const logsSnap = await getDocs(collection(db, 'medicine_logs'));
  const lDeletes = logsSnap.docs.map(d => deleteDoc(doc(db, 'medicine_logs', d.id)));

  // 3. Delete users with role 'patient'
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('role', '==', 'patient'));
  const usersSnap = await getDocs(q);
  const uDeletes = usersSnap.docs.map(d => deleteDoc(doc(db, 'users', d.id)));

  await Promise.all([...pDeletes, ...lDeletes, ...uDeletes]);
  
  console.log('✅ All patient-related data has been removed from Firestore.');
};
