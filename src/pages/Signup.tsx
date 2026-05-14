import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Stethoscope, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor' | 'caretaker'>('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(email, password, name, role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Secure AI Medication Reminders",
    "Real-time Caregiver Syncing",
    "Advanced Health Insight Reports",
    "Enterprise-grade Data Security"
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Left Panel - Branding & Social Proof */}
      <div className="hidden lg:flex flex-1 relative bg-[#0a1931] items-center justify-center p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1931] to-[#16213e] opacity-95"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        
        <div className="relative z-10 w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-16"
          >
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20">
              <HeartPulse className="h-10 w-10 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-white">MediGuardian</span>
          </motion.div>
          
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-5xl font-black text-white leading-tight mb-8">
                Start Your <br />
                <span className="text-[#68d391]">Health Journey.</span>
              </h2>
              
              <div className="space-y-6">
                {benefits.map((b, i) => (
                  <motion.div 
                    key={b}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex items-center gap-4 text-white/80 font-bold text-lg"
                  >
                    <div className="h-6 w-6 rounded-full bg-[#68d391]/20 flex items-center justify-center border border-[#68d391]/30">
                      <Check className="h-4 w-4 text-[#68d391]" />
                    </div>
                    {b}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-8 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center gap-6"
            >
              <div className="p-4 rounded-2xl bg-[#68d391]/10">
                <ShieldCheck className="h-8 w-8 text-[#68d391]" />
              </div>
              <div>
                <p className="text-white font-black text-lg">HiPAA Compliant</p>
                <p className="text-white/50 font-bold text-sm">Your health data is safe with us.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-primary/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative overflow-y-auto">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0a1931_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[520px] my-auto"
        >
          <div className="mb-10">
            <h3 className="text-4xl font-black text-primary mb-3">Create Account</h3>
            <p className="text-on-surface-variant font-bold">Join over 50,000+ users managing their health today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { id: 'patient', icon: UserIcon, label: 'Patient' },
                { id: 'doctor', icon: Stethoscope, label: 'Doctor' },
                { id: 'caretaker', icon: Users, label: 'Caretaker' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${
                    role === r.id 
                      ? 'bg-[#0a1931] border-[#0a1931] text-white shadow-xl shadow-[#0a1931]/20' 
                      : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary/50'
                  }`}
                >
                  <r.icon className={`h-6 w-6 ${role === r.id ? 'text-white' : 'text-[#0a1931]'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors opacity-40" />
                </div>
                <input 
                  type="text" 
                  required
                  className="w-full bg-white border border-outline-variant rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors opacity-40" />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full bg-white border border-outline-variant rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors opacity-40" />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full bg-white border border-outline-variant rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold"
                  placeholder="Create Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 px-1">
              <input type="checkbox" required id="terms" className="mt-1 h-5 w-5 rounded-md border-outline-variant text-primary focus:ring-primary" />
              <label htmlFor="terms" className="text-xs font-bold text-on-surface-variant leading-relaxed">
                I agree to the <a href="#" className="text-secondary underline">Terms of Service</a> and <a href="#" className="text-secondary underline">Privacy Policy</a>.
              </label>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-error-container text-on-error-container text-xs font-bold">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#0a1931] text-white py-5 rounded-2xl font-black shadow-xl shadow-[#0a1931]/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  Create Secure Account
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-bold text-on-surface-variant">
              Already have an account? {' '}
              <Link to="/login" className="text-secondary font-black hover:underline underline-offset-4">Sign in here</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
