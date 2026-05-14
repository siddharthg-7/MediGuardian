import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface Prescription {
  id?: string;
  patientId: string;
  doctorId: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  timings: string[];
  instructions: string;
  startDate: Timestamp;
  endDate: Timestamp;
  createdAt: Timestamp;
}

export const addPrescription = async (prescription: Omit<Prescription, 'id' | 'createdAt'>) => {
  return await addDoc(collection(db, 'prescriptions'), {
    ...prescription,
    createdAt: Timestamp.now()
  });
};

export const getPrescriptionsByPatient = async (patientId: string) => {
  const q = query(
    collection(db, 'prescriptions'), 
    where('patientId', '==', patientId)
  );
  const snapshot = await getDocs(q);
  const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prescription));
  
  // Sort client-side to avoid Firebase Composite Index requirement
  return meds.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const getPrescriptionsByDoctor = async (doctorId: string) => {
  const q = query(
    collection(db, 'prescriptions'), 
    where('doctorId', '==', doctorId)
  );
  const snapshot = await getDocs(q);
  const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prescription));
  
  // Sort client-side to avoid Firebase Composite Index requirement
  return meds.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
};

export const deletePrescription = async (id: string) => {
  await deleteDoc(doc(db, 'prescriptions', id));
};

export const updatePrescription = async (id: string, data: Partial<Prescription>) => {
  await updateDoc(doc(db, 'prescriptions', id), data);
};

// Adherence Logs
export const logMedicineIntake = async (patientId: string, prescriptionId: string, status: 'taken' | 'missed' | 'snoozed') => {
  return await addDoc(collection(db, 'medicine_logs'), {
    patientId,
    prescriptionId,
    status,
    timestamp: Timestamp.now()
  });
};
