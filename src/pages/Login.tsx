import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  UserRound,
  Stethoscope,
  Activity,
} from 'lucide-react';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isForgotMode) {
        await resetPassword(email);
        setSuccess('Password reset link sent to your email.');
        // After a delay, switch back to login
        setTimeout(() => setIsForgotMode(false), 3000);
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7FAFC] font-sans overflow-hidden">
      {/* Immersive Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative bg-[#0a1931] items-center justify-center p-12 xl:p-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1931] via-[#0B5CAB]/30 to-[#16213e] opacity-95"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#4FD1FF]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-[#0A8F5A]/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        
        <div className="relative z-10 w-full max-w-lg">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
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
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
                Intelligent Care. <br />
                <span className="text-gradient-green italic">Defined by AI.</span>
              </h1>
              <p className="text-base xl:text-lg font-medium text-white/50 leading-relaxed max-w-sm">
                Access your personalized medical ecosystem. Secure, real-time health management for the modern era.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Adherence', value: '95%', icon: Zap, color: 'text-primary' },
                { label: 'Security', value: 'AES-256', icon: ShieldCheck, color: 'text-secondary' },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="glass-dark p-6 rounded-[24px] border border-white/5"
                >
                  <div className={`h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${card.color}`}>
                    <card.icon className="h-4 w-4" />
                  </div>
                  <div className="text-2xl font-black text-white mb-0.5">{card.value}</div>
                  <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">{card.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 xl:p-12 relative bg-white lg:bg-[#F7FAFC]">
        <div className="absolute inset-0 bg-grid opacity-[0.2] pointer-events-none hidden lg:block"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[440px] z-10"
        >
          <div className="bg-white lg:rounded-[36px] lg:shadow-premium lg:border lg:border-white/50 p-8 xl:p-12 relative">
            <div className="mb-10 text-center lg:text-left">
               <h2 className="text-3xl font-black text-[#0a1931] mb-2 tracking-tight">
                 {isForgotMode ? 'Reset Password' : 'Sign In'}
               </h2>
               <p className="text-sm font-medium text-on-surface-variant opacity-60">
                 {isForgotMode ? 'Enter your email to receive a reset link.' : 'Enter your credentials to access the portal.'}
               </p>
            </div>

            {!isForgotMode && (
              <div className="flex p-1 bg-surface-container-low rounded-2xl mb-8 border border-outline-variant/20">
                <button 
                  onClick={() => setActiveTab('patient')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[10px] font-black transition-all relative ${
                    activeTab === 'patient' ? 'text-white' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {activeTab === 'patient' && (
                    <motion.div layoutId="tab-active" className="absolute inset-0 bg-primary rounded-[14px] shadow-lg shadow-primary/20" />
                  )}
                  <UserRound className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10 tracking-[0.1em] uppercase">Patient</span>
                </button>
                <button 
                  onClick={() => setActiveTab('doctor')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[10px] font-black transition-all relative ${
                    activeTab === 'doctor' ? 'text-white' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {activeTab === 'doctor' && (
                    <motion.div layoutId="tab-active" className="absolute inset-0 bg-[#0a1931] rounded-[14px] shadow-lg shadow-black/20" />
                  )}
                  <Stethoscope className="h-3.5 w-3.5 relative z-10" />
                  <span className="relative z-10 tracking-[0.1em] uppercase">Doctor</span>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant opacity-30" />
                  <input 
                    type="email" required placeholder="name@example.com"
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-[#0a1931]"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {!isForgotMode && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-4">
                    <label className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setIsForgotMode(true)}
                      className="text-[10px] font-black text-secondary hover:underline tracking-widest uppercase"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant opacity-30" />
                    <input 
                      type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-[#0a1931]"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-5 flex items-center text-on-surface-variant opacity-30 hover:opacity-100 transition-opacity"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-xl bg-error/5 flex items-start gap-3">
                  <AlertCircle className="h-4 w-4 text-error shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-error leading-relaxed">{error}</p>
                </motion.div>
              )}

              {success && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-xl bg-secondary/5 flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-secondary leading-relaxed">{success}</p>
                </motion.div>
              )}

              <div className="flex gap-3">
                {isForgotMode && (
                  <button 
                    type="button" 
                    onClick={() => setIsForgotMode(false)}
                    className="flex-1 bg-surface-container-low text-primary py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-surface-container-high transition-all"
                  >
                    Back
                  </button>
                )}
                <button 
                  type="submit" disabled={loading}
                  className={`flex-[2] py-5 rounded-2xl font-black text-white shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] ${
                    activeTab === 'patient' ? 'bg-primary shadow-primary/20' : 'bg-[#0a1931] shadow-black/20'
                  }`}
                >
                  {loading ? <Activity className="h-4 w-4 animate-spin" /> : (
                    <>
                      {isForgotMode ? 'Send Reset Link' : 'Sign In to Dashboard'}
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {!isForgotMode && (
              <div className="mt-10 text-center">
                <p className="text-xs font-medium text-on-surface-variant opacity-60">
                  New to MediGuardian? {' '}
                  <Link to="/signup" className="text-secondary font-black hover:underline underline-offset-4">Create account</Link>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
