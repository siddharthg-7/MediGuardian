import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import PhoneInput from 'react-phone-number-input';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Calendar, 
  Users, 
  Activity, 
  ChevronRight,
  ArrowLeft,
  Stethoscope,
  Shield,
  FileCheck,
  Hospital,
  Zap,
} from 'lucide-react';

const Signup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Other',
    phone: '',
    email: '',
    emergencyContact: '',
    bloodGroup: '',
    existingConditions: '',
    password: '',
    specialization: '',
    hospitalAffiliation: '',
    licenseId: '',
    experience: '',
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData(prev => ({ ...prev, phone: value || '' }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, activeTab === 'patient' ? 4 : 2));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < (activeTab === 'patient' ? 4 : 2)) {
      nextStep();
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const { email, password, name, ...extraData } = formData;
      await signup(email, password, name, activeTab, extraData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7FAFC] font-sans overflow-hidden">
      {/* Immersive Left Panel */}
      <div className="hidden lg:flex lg:w-[40%] xl:w-[45%] relative bg-[#0a1931] items-center justify-center p-12 xl:p-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1931] via-[#0B5CAB]/20 to-[#16213e] opacity-95"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        
        <div className="relative z-10 w-full max-w-sm">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-16 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/20">
              <HeartPulse className="h-7 w-7 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">MediGuardian</span>
          </motion.div>
          
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-4xl font-black text-white leading-tight mb-6 italic">
                Start Your <br />
                <span className="text-gradient-green">Health Journey.</span>
              </h2>
              <p className="text-base font-medium text-white/40 leading-relaxed">
                Join a secure clinical ecosystem designed for precision care and absolute reliability.
              </p>
            </motion.div>

            <div className="space-y-4">
              {[
                { title: 'AI Monitoring', icon: Zap, color: 'bg-primary/20' },
                { title: 'Secure Vault', icon: Shield, color: 'bg-secondary/20' },
              ].map((widget, i) => (
                <motion.div
                  key={widget.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="glass-dark p-4 rounded-2xl border border-white/5 flex items-center gap-4"
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${widget.color}`}>
                    <widget.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs font-black text-white uppercase tracking-widest">{widget.title}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-grid opacity-[0.02] pointer-events-none"></div>
      </div>

      {/* Right Panel - Focused Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 xl:p-12 relative bg-white lg:bg-[#F7FAFC] overflow-y-auto">
        <div className="absolute inset-0 bg-grid opacity-[0.2] pointer-events-none hidden lg:block"></div>
        
        <div className="w-full max-w-[580px] flex justify-between items-center mb-12 z-20">
           <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white transition-all text-[9px] font-black text-primary border border-outline-variant/30 uppercase tracking-widest"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </motion.button>
          
          <div className="flex items-center gap-4">
             <div className="text-[9px] font-black text-on-surface-variant opacity-30 uppercase tracking-widest">Step {step} of {activeTab === 'patient' ? 4 : 2}</div>
             <div className="flex gap-1">
               {Array.from({ length: activeTab === 'patient' ? 4 : 2 }).map((_, i) => (
                 <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i + 1 <= step ? 'w-4 bg-primary' : 'w-1.5 bg-outline-variant/20'}`} />
               ))}
             </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[580px] z-10"
        >
          <div className="flex p-1 bg-white rounded-2xl mb-8 shadow-sm border border-outline-variant/20">
            <button 
              onClick={() => { setActiveTab('patient'); setStep(1); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[14px] text-[10px] font-black transition-all relative ${
                activeTab === 'patient' ? 'text-white' : 'text-on-surface-variant'
              }`}
            >
              {activeTab === 'patient' && (
                <motion.div layoutId="s-tab" className="absolute inset-0 bg-secondary rounded-[14px] shadow-lg shadow-secondary/20" />
              )}
              <UserIcon className="h-3.5 w-3.5 relative z-10" />
              <span className="relative z-10 tracking-widest uppercase">Patient</span>
            </button>
            <button 
              onClick={() => { setActiveTab('doctor'); setStep(1); }}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[14px] text-[10px] font-black transition-all relative ${
                activeTab === 'doctor' ? 'text-white' : 'text-on-surface-variant'
              }`}
            >
              {activeTab === 'doctor' && (
                <motion.div layoutId="s-tab" className="absolute inset-0 bg-[#0a1931] rounded-[14px] shadow-lg shadow-black/20" />
              )}
              <Stethoscope className="h-3.5 w-3.5 relative z-10" />
              <span className="relative z-10 tracking-widest uppercase">Doctor</span>
            </button>
          </div>

          <div className="bg-white lg:rounded-[36px] lg:shadow-premium lg:border lg:border-white/50 p-8 xl:p-12">
            <div className="mb-10">
               <h3 className="text-2xl font-black text-[#0a1931] mb-2 tracking-tight">Create Account</h3>
               <p className="text-xs font-medium text-on-surface-variant opacity-60">
                 {activeTab === 'patient' ? 'Secure clinical onboarding for patients.' : 'Professional access for medical practitioners.'}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${step}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {activeTab === 'patient' ? (
                    <>
                      {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Full Name</label>
                            <input type="text" name="name" required placeholder="John Doe" className="s-input" value={formData.name} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Email</label>
                            <input type="email" name="email" required placeholder="john@example.com" className="s-input" value={formData.email} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Phone Number</label>
                            <PhoneInput
                              international
                              defaultCountry="US"
                              value={formData.phone}
                              onChange={handlePhoneChange}
                              className="s-phone-input"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Password</label>
                            <input type="password" name="password" required placeholder="••••••••" className="s-input" value={formData.password} onChange={handleInputChange} />
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Age</label>
                            <input type="number" name="age" required placeholder="25" className="s-input" value={formData.age} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Gender</label>
                            <select name="gender" className="s-input px-6" value={formData.gender} onChange={handleInputChange}>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="md:col-span-2 space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Clinical Notes</label>
                            <textarea name="existingConditions" rows={3} placeholder="History, allergies..." className="s-input px-6 py-4 rounded-3xl resize-none" value={formData.existingConditions} onChange={handleInputChange}></textarea>
                          </div>
                        </div>
                      )}
                      {step === 3 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Emergency Contact</label>
                            <input type="tel" name="emergencyContact" required placeholder="+1 555-911" className="s-input" value={formData.emergencyContact} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Blood Group</label>
                            <input type="text" name="bloodGroup" required placeholder="O+" className="s-input" value={formData.bloodGroup} onChange={handleInputChange} />
                          </div>
                        </div>
                      )}
                      {step === 4 && (
                        <div className="space-y-6">
                          <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-4">
                             <Shield className="h-5 w-5 text-secondary" />
                             <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">End-to-end clinical encryption enabled</span>
                          </div>
                          <div className="flex items-start gap-3 px-4">
                             <input type="checkbox" required className="mt-1 h-4 w-4 rounded-md border-outline-variant text-primary" />
                             <label className="text-xs font-medium text-on-surface-variant opacity-60 leading-relaxed">I agree to the secure processing of my medical data according to the Privacy Policy.</label>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Specialization</label>
                            <input type="text" name="specialization" required placeholder="Cardiology" className="s-input" value={formData.specialization} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Hospital</label>
                            <input type="text" name="hospitalAffiliation" required placeholder="Mayo Clinic" className="s-input" value={formData.hospitalAffiliation} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Experience (Years)</label>
                            <input type="number" name="experience" required placeholder="10" className="s-input" value={formData.experience} onChange={handleInputChange} />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">License ID</label>
                            <input type="text" name="licenseId" required placeholder="MD-001" className="s-input" value={formData.licenseId} onChange={handleInputChange} />
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <div className="space-y-6">
                           <div className="p-8 rounded-3xl border-2 border-dashed border-outline-variant/30 bg-surface-container-low flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 transition-colors">
                              <FileCheck className="h-6 w-6 text-primary mb-3" />
                              <div className="text-[10px] font-black text-primary uppercase tracking-widest">Verify Professional License</div>
                           </div>
                           <div className="flex items-start gap-3 px-4">
                             <input type="checkbox" required className="mt-1 h-4 w-4 rounded-md border-outline-variant text-[#0a1931]" />
                             <label className="text-xs font-medium text-on-surface-variant opacity-60">I verify that my credentials are accurate and currently active in my region.</label>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              {error && <div className="p-4 rounded-xl bg-error/5 text-[11px] font-bold text-error">{error}</div>}

              <div className="flex gap-3">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="flex-1 bg-surface-container-low text-primary py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest">Back</button>
                )}
                <button 
                  type="submit" disabled={loading}
                  className={`flex-[2] py-4.5 rounded-2xl font-black text-white shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] ${
                    activeTab === 'patient' ? 'bg-secondary shadow-secondary/20' : 'bg-[#0a1931] shadow-black/20'
                  }`}
                >
                  {loading ? <Activity className="h-4 w-4 animate-spin" /> : (
                    <>
                      {step === (activeTab === 'patient' ? 4 : 2) ? 'Finish Signup' : 'Next Step'}
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-10 text-center pb-12">
            <p className="text-xs font-medium text-on-surface-variant opacity-60">
              Already have an account? {' '}
              <Link to="/login" className="text-secondary font-black hover:underline underline-offset-4 tracking-tight">Sign in</Link>
            </p>
          </div>
        </motion.div>
      </div>

      <style>{`
        .s-input {
          width: 100%;
          background: #FCF9F8;
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 9999px;
          padding: 1rem 1.5rem;
          outline: none;
          transition: all 0.2s;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0a1931;
        }
        .s-input:focus {
          background: white;
          border-color: #0B5CAB;
          box-shadow: 0 0 0 4px rgba(11, 92, 171, 0.05);
        }
        .s-phone-input {
          display: flex;
          align-items: center;
          width: 100%;
          background: #FCF9F8;
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          transition: all 0.2s;
        }
        .s-phone-input:focus-within {
          background: white;
          border-color: #0B5CAB;
          box-shadow: 0 0 0 4px rgba(11, 92, 171, 0.05);
        }
        .s-phone-input input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0a1931;
          padding-left: 0.5rem;
        }
        .PhoneInputCountry {
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Signup;
