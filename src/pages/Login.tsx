import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  User,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

const Login: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patient' | 'provider'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Left Panel - Hero Branding */}
      <div className="hidden lg:flex flex-[1.2] relative bg-[#0a1931] items-center justify-center p-20 overflow-hidden">
        {/* Background Image / Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1931] to-[#16213e] opacity-95"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        
        <div className="relative z-10 w-full max-w-xl">
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
          
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-6xl font-black leading-[1.1] text-white tracking-tighter mb-6">
                Empowering <br />
                <span className="text-secondary italic">Better Health.</span>
              </h1>
              <h2 className="text-4xl font-black text-[#68d391] opacity-90 mb-8">Transparent Care.</h2>
              <p className="text-xl font-medium text-white/70 leading-relaxed max-w-lg">
                Join thousands of users participating in the digital transformation of healthcare. 
                Manage prescriptions, track vitals, and access AI-powered medical insights instantly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80" 
                alt="City landscape representing connectivity" 
                className="w-full aspect-video object-cover"
              />
            </motion.div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-32 -left-32 h-96 w-96 bg-primary/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] bg-secondary/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0a1931_1px,transparent_1px)] [background-size:20px_20px]"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[520px] bg-white rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-outline-variant overflow-hidden"
        >
          {/* Tabs */}
          <div className="flex border-b border-outline-variant">
            <button 
              onClick={() => setActiveTab('patient')}
              className={`flex-1 flex items-center justify-center gap-3 py-6 font-bold text-sm transition-all relative ${
                activeTab === 'patient' ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <User className="h-4 w-4" />
              Patient Login
              {activeTab === 'patient' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
              )}
            </button>
            <button 
              onClick={() => setActiveTab('provider')}
              className={`flex-1 flex items-center justify-center gap-3 py-6 font-bold text-sm transition-all relative ${
                activeTab === 'provider' ? 'text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <Stethoscope className="h-4 w-4" />
              Admin / Provider
              {activeTab === 'provider' && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
              )}
            </button>
          </div>

          <div className="p-10 lg:p-14">
            <div className="mb-10">
              <h3 className="text-3xl font-black text-primary mb-2">Welcome Back</h3>
              <p className="text-on-surface-variant font-bold">Please enter your details to access your dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors opacity-40" />
                  </div>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-white border border-outline-variant rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-primary"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 mb-1">
                  <span className="text-xs font-black uppercase tracking-widest text-primary opacity-40">Password</span>
                  <button type="button" className="text-xs font-black text-secondary hover:underline">Forgot password?</button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-on-surface-variant group-focus-within:text-primary transition-colors opacity-40" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    className="w-full bg-white border border-outline-variant rounded-2xl py-4 pl-14 pr-14 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold text-primary"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-5 flex items-center text-on-surface-variant hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <input type="checkbox" id="remember" className="h-5 w-5 rounded-md border-outline-variant text-primary focus:ring-primary" />
                <label htmlFor="remember" className="text-sm font-bold text-on-surface-variant">Remember me for 30 days</label>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-xl bg-error-container text-on-error-container text-xs font-bold"
                >
                  {error}
                </motion.div>
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
                    Login to Dashboard
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-sm font-bold text-on-surface-variant">
                Don't have an account? {' '}
                <Link to="/signup" className="text-secondary font-black hover:underline underline-offset-4">Sign up for free</Link>
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-on-surface-variant opacity-40">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
