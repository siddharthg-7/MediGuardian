import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Pill, 
  Trash2, 
  Clock, 
  X,
  Check,
  User as UserIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { addPrescription, getPrescriptionsByPatient, getPrescriptionsByDoctor, Prescription, deletePrescription } from '../services/medicationService';
import { getPatients, UserProfile } from '../services/userService';
import { Timestamp } from 'firebase/firestore';

const MedicationManagement: React.FC = () => {
  const { user, profile } = useAuth();
  const [medications, setMedications] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [timings, setTimings] = useState<string[]>(['09:00']);

  useEffect(() => {
    if (!user || !profile) return;

    const fetchData = async () => {
      if (profile.role === 'doctor') {
        const [meds, pts] = await Promise.all([
          getPrescriptionsByDoctor(user.uid),
          getPatients()
        ]);
        setMedications(meds);
        setPatients(pts);
      } else {
        const meds = await getPrescriptionsByPatient(user.uid);
        setMedications(meds);
      }
      setLoading(false);
    };

    fetchData();
  }, [user, profile]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const patientId = profile.role === 'doctor' ? selectedPatientId : user.uid;
    if (!patientId) {
      alert('Please select a patient');
      return;
    }

    const newPrescription: Omit<Prescription, 'id' | 'createdAt'> = {
      patientId,
      doctorId: profile.role === 'doctor' ? user.uid : 'self',
      medicineName: name,
      dosage,
      frequency,
      timings,
      instructions: '',
      startDate: Timestamp.now(),
      endDate: Timestamp.now(), // Default for Phase 1
    };

    await addPrescription(newPrescription);
    setIsAdding(false);
    // Refresh list
    const meds = profile.role === 'doctor' 
      ? await getPrescriptionsByDoctor(user.uid) 
      : await getPrescriptionsByPatient(user.uid);
    setMedications(meds);
    // Reset form
    setName(''); setDosage(''); setTimings(['09:00']); setSelectedPatientId('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      await deletePrescription(id);
      setMedications(medications.filter(m => m.id !== id));
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-primary">Loading prescriptions...</div>;

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-primary">Prescriptions</h1>
          <p className="mt-2 text-lg text-on-surface-variant font-medium">
            {profile?.role === 'doctor' ? 'Manage prescriptions for your patients.' : 'Your active medication schedule.'}
          </p>
        </div>
        {profile?.role === 'doctor' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 font-black text-on-primary shadow-xl shadow-primary/20 transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            New Prescription
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {medications.map((med) => (
          <motion.div
            key={med.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group rounded-[32px] border border-outline-variant bg-white p-8 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-outline-variant">
                <Pill className="h-8 w-8" />
              </div>
              {profile?.role === 'doctor' && (
                <button onClick={() => handleDelete(med.id!)} className="p-2 rounded-lg hover:bg-error-container text-error opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <h3 className="text-2xl font-black text-primary mb-1">{med.medicineName}</h3>
            <p className="text-sm font-bold text-on-surface-variant mb-4">{med.dosage} • {med.frequency}</p>
            
            <div className="flex flex-wrap gap-2">
              {med.timings.map(t => (
                <span key={t} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low text-xs font-bold text-primary">
                  <Clock className="h-3 w-3 opacity-40" />
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/20 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative w-full max-w-2xl rounded-[40px] bg-white p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black text-primary">New Prescription</h2>
                <button onClick={() => setIsAdding(false)} className="p-3 rounded-2xl hover:bg-surface-container-low"><X className="h-6 w-6" /></button>
              </div>

              <form onSubmit={handleAdd} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-primary ml-1">Select Patient</label>
                  <select 
                    required
                    className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 outline-none focus:border-primary font-bold"
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(p => <option key={p.uid} value={p.uid}>{p.displayName}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-1">Medicine Name</label>
                    <input required className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 outline-none font-bold" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-primary ml-1">Dosage</label>
                    <input required className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-6 py-4 outline-none font-bold" value={dosage} onChange={e => setDosage(e.target.value)} />
                  </div>
                </div>

                <button type="submit" className="w-full bg-primary text-on-primary py-5 rounded-3xl font-black shadow-2xl transition-all flex items-center justify-center gap-3">
                  <Check className="h-6 w-6" />
                  Issue Prescription
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicationManagement;
