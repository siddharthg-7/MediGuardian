import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  TrendingDown, 
  ArrowUpRight,
  FileText,
  Activity
} from 'lucide-react';
import { getPatients, UserProfile } from '../services/userService';

const DoctorDashboard: React.FC = () => {
  const [patients, setPatients] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPatients().then(data => {
      setPatients(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center font-bold text-primary">Accessing practice records...</div>;

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black tracking-tight text-primary">Provider Overview</h1>
          <p className="mt-2 text-lg text-on-surface-variant font-medium">Monitoring {patients.length} patients across your practice.</p>
        </motion.div>
        
        <div className="relative group w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-on-surface-variant opacity-40 group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search patients..."
            className="w-full bg-white border border-outline-variant rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-primary transition-all text-sm font-bold shadow-sm"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: 'Total Patients', value: patients.length.toString(), icon: Users, color: 'text-primary' },
          { label: 'Avg Adherence', value: '78%', icon: Activity, color: 'text-secondary' },
          { label: 'Action Required', value: '2', icon: AlertCircle, color: 'text-error' },
          { label: 'New Reports', value: '5', icon: FileText, color: 'text-tertiary' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-[32px] border border-outline-variant bg-white p-8 shadow-sm"
          >
            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">{stat.label}</p>
            <div className={`text-3xl font-black text-primary`}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-primary">Recent Patient Activity</h2>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-outline-variant bg-white shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-widest text-on-surface-variant">Patient</th>
                  <th className="px-8 py-5 text-left text-xs font-black uppercase tracking-widest text-on-surface-variant">Email</th>
                  <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-widest text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {patients.map((p) => (
                  <tr key={p.uid} className="group hover:bg-surface-container-low transition-colors">
                    <td className="px-8 py-6 font-bold text-primary">{p.displayName}</td>
                    <td className="px-8 py-6 text-sm font-medium text-on-surface-variant">{p.email}</td>
                    <td className="px-8 py-6 text-right">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-secondary/10 text-secondary">
                        Stable
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-8">
           <div className="rounded-[40px] bg-[#0a1931] p-10 text-white shadow-2xl">
            <h3 className="text-2xl font-black mb-6">AI Insights</h3>
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md">
                <div className="flex items-start gap-4">
                  <TrendingDown className="h-5 w-5 text-error" />
                  <div>
                    <p className="text-sm font-black mb-1">Adherence Alert</p>
                    <p className="text-xs text-white/60 font-bold">1 patient has missed multiple doses today.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
