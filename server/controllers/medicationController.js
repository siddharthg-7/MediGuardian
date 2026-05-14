import { db } from '../firebase/admin.js';

// Get all medications for a user
export const getMedications = async (req, res, next) => {
  try {
    const { userId } = req.query; // In a real app, this would come from the auth middleware
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const snapshot = await db.collection('medications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const medications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(medications);
  } catch (error) {
    next(error);
  }
};

// Add a new medication
export const addMedication = async (req, res, next) => {
  try {
    const { userId, name, dosage, frequency, timings, startDate, endDate, instructions } = req.body;
    
    const newMed = {
      userId,
      name,
      dosage,
      frequency,
      timings,
      startDate: startDate || new Date().toISOString(),
      endDate,
      instructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await db.collection('medications').add(newMed);
    res.status(201).json({ id: docRef.id, ...newMed });
  } catch (error) {
    next(error);
  }
};

// Update medication
export const updateMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    
    await db.collection('medications').doc(id).update(updates);
    res.status(200).json({ id, ...updates });
  } catch (error) {
    next(error);
  }
};

// Delete medication
export const deleteMedication = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.collection('medications').doc(id).delete();
    res.status(200).json({ message: 'Medication deleted successfully' });
  } catch (error) {
    next(error);
  }
};
