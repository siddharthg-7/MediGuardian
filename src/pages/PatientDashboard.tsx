import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPrescriptionsByPatient, logMedicineIntake, Prescription } from '../services/medicationService';

const PatientDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getPrescriptionsByPatient(user.uid).then(data => {
        setPrescriptions(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleTakeNow = async (prescriptionId: string) => {
    if (user) {
      await logMedicineIntake(user.uid, prescriptionId, 'taken');
      alert('Dose logged successfully!');
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-primary">Loading your health portal...</div>;

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight text-primary">
            Good morning, {profile?.displayName?.split(' ')[0]}
          </h1>
          <p className="mt-2 text-lg text-on-surface-variant font-medium">
            Your vitals are stable today. You have {prescriptions.length} medications scheduled.
          </p>
        </motion.div>
        
        <button className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-bold text-on-primary shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Plus className="h-5 w-5" />
          Add Log
        </button>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: 'Daily Adherence', value: '85%', color: 'text-primary' },
          { label: 'Active Prescriptions', value: prescriptions.length.toString(), color: 'text-secondary' },
          { label: 'Health Streak', value: '12 Days', color: 'text-tertiary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[32px] border border-outline-variant bg-white p-8 shadow-sm"
          >
            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">{stat.label}</p>
            <div className={`text-4xl font-black ${stat.color}`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Upcoming Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-primary flex items-center gap-3">
              <Clock className="h-6 w-6" />
              Your Schedule
            </h2>
          </div>

          <div className="space-y-4">
            {prescriptions.length > 0 ? prescriptions.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-[24px] border border-outline-variant bg-white p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black">
                    {med.timings[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-primary">{med.medicineName}</h3>
                    <p className="text-sm font-bold text-on-surface-variant">{med.dosage} • {med.frequency}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleTakeNow(med.id!)}
                    className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-on-primary shadow-lg shadow-primary/10 transition-all hover:scale-105"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Take Now
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="p-10 text-center border-2 border-dashed border-outline-variant rounded-[32px] text-on-surface-variant font-bold">
                No active prescriptions found. Contact your doctor to add one.
              </div>
            )}
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-6">
           <div className="rounded-[32px] bg-primary p-8 text-on-primary shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2 relative z-10">
              <MessageSquare className="h-5 w-5" />
              MediGuardian AI
            </h3>
            <p className="text-sm leading-relaxed opacity-90 mb-6 font-bold relative z-10">
              "I've noticed you've been consistent with your morning meds. Your doctor has been notified of your 100% adherence streak!"
            </p>
            <button className="w-full rounded-xl bg-white/20 px-4 py-3 text-sm font-black backdrop-blur-md hover:bg-white/30 transition-all relative z-10">
              Ask AI Assistant
            </button>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
