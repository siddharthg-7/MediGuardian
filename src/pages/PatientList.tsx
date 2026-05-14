import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Plus
} from 'lucide-react';
import { getPatients, UserProfile } from '../services/userService';

const PatientList: React.FC = () => {
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients().then(data => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-primary">Loading patient records...</div>;

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black text-primary">Patient Directory</h1>
          <p className="mt-2 text-lg text-on-surface-variant font-medium">Manage and monitor your patient database.</p>
        </div>
        
        <button className="flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 font-black text-on-primary shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
          <Plus className="h-5 w-5" />
          Onboard New Patient
        </button>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-on-surface-variant opacity-40 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search patients..."
            className="w-full bg-white border border-outline-variant rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-primary transition-all text-sm font-bold shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 rounded-2xl border border-outline-variant bg-white px-6 py-4 text-sm font-bold text-primary hover:bg-surface-container-low transition-all">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.length > 0 ? patients.map((patient, i) => (
          <motion.div
            key={patient.uid}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-[40px] border border-outline-variant bg-white p-8 hover:shadow-xl hover:shadow-primary/5 transition-all"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                {patient.displayName?.split(' ').map(n => n[0]).join('') || 'U'}
              </div>
              <button className="p-3 rounded-xl hover:bg-surface-container-low transition-all text-on-surface-variant">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-black text-primary mb-1">{patient.displayName}</h3>
              <p className="text-sm font-bold text-on-surface-variant italic mb-4">Patient</p>
              
              <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-60">
                <span>{patient.email}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
               <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-40">Adherence Score</span>
                 <span className="text-sm font-black text-secondary">
                   -- %
                 </span>
               </div>
               <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                 <div 
                   className="h-full rounded-full bg-secondary" 
                   style={{ width: '0%' }}
                 />
               </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-outline-variant">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary transition-all font-black text-xs uppercase tracking-widest">
                <Mail className="h-3 w-3" />
                Email
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-surface-container-low text-primary hover:bg-primary hover:text-on-primary transition-all font-black text-xs uppercase tracking-widest">
                <Phone className="h-3 w-3" />
                Call
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full p-20 text-center border-2 border-dashed border-outline-variant rounded-[40px]">
            <Users className="h-12 w-12 text-on-surface-variant opacity-20 mx-auto mb-4" />
            <p className="text-on-surface-variant font-bold">No real patients found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientList;
