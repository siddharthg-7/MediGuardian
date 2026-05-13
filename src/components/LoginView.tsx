import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile as updateAuthProfile } from "firebase/auth";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AlertCircle, User as UserIcon, Stethoscope, ChevronLeft, HeartPulse, Mail, Lock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const LoginView = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateAuthProfile(result.user, { displayName: name });
        
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          displayName: name,
          role: role,
          createdAt: serverTimestamp(),
        });
      } else if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent. Check your inbox.");
        setLoading(false);
        return;
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-white font-outfit">
      {/* Left Side: Branding & Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#1a237e] p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-transparent z-10" />
        
        <div className="relative z-20 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="bg-white p-2 rounded-xl shadow-lg">
            <HeartPulse className="h-8 w-8 text-[#1a237e]" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">MediGuardian</span>
        </div>

        <div className="relative z-20 max-w-lg">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white leading-tight mb-6"
          >
            Precision Care.<br />
            <span className="text-blue-300">Intelligent Recovery.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 font-medium leading-relaxed opacity-90"
          >
            Bridging the gap between diagnosis and recovery with smart adherence tracking for everyone.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative z-20 mt-12 rounded-[40px] overflow-hidden border-4 border-white/10 shadow-2xl aspect-video"
        >
          <img 
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2070&auto=format&fit=crop" 
            alt="Medical Research"
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>

      {/* Right Side: Auth Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-container-lowest relative overflow-y-auto">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a237e 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-outline-variant overflow-hidden">
            
            {/* Tabs */}
            <div className="flex bg-surface-container-low border-b border-outline-variant">
              <button 
                onClick={() => setRole("patient")}
                className={`flex-1 py-5 text-sm font-black flex items-center justify-center gap-2 transition-all ${
                  role === "patient" ? "bg-white text-primary border-b-4 border-primary" : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <UserIcon className="h-4 w-4" />
                Patient Login
              </button>
              <button 
                onClick={() => setRole("doctor")}
                className={`flex-1 py-5 text-sm font-black flex items-center justify-center gap-2 transition-all ${
                  role === "doctor" ? "bg-white text-secondary border-b-4 border-secondary" : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <Stethoscope className="h-4 w-4" />
                Physician / Govt
              </button>
            </div>

            <div className="p-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-primary mb-2">Welcome Back</h2>
                <p className="text-on-surface-variant font-medium">Please enter your details to access your dashboard.</p>
              </div>

              {error && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl bg-error-container p-4 text-xs text-on-error-container border border-error/20">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-bold">{error}</span>
                </div>
              )}
              {message && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl bg-primary-container p-4 text-xs text-on-primary-container border border-primary/20">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-bold">{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === "signup" && (
                  <div className="relative">
                    <input 
                      type="text" 
                      required 
                      className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-12 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all font-medium"
                      placeholder="Your Full Name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant opacity-50" />
                  </div>
                )}
                
                <div className="relative">
                  <input 
                    type="email" 
                    required 
                    className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-12 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all font-medium"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant opacity-50" />
                </div>

                {mode !== "forgot" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-xs font-black text-primary uppercase tracking-widest">Password</label>
                       <button type="button" onClick={() => setMode("forgot")} className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <input 
                        type="password" 
                        required 
                        minLength={6}
                        className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-12 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all font-medium"
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant opacity-50" />
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex items-center gap-2 px-1">
                    <input type="checkbox" id="remember" className="rounded border-outline-variant text-primary focus:ring-primary" />
                    <label htmlFor="remember" className="text-sm font-medium text-on-surface-variant">Remember me for 30 days</label>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full rounded-2xl py-5 text-sm font-black text-white shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${
                    role === "patient" ? "bg-[#1a237e] hover:bg-[#1a237e]/90" : "bg-secondary hover:bg-secondary/90"
                  }`}
                >
                  {loading ? "Authenticating..." : mode === "login" ? "Login to Dashboard" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>

              <div className="mt-10 pt-10 border-t border-outline-variant text-center">
                <p className="text-sm font-medium text-on-surface-variant">
                  {mode === "login" ? (
                    <>Don't have an account? <button onClick={() => setMode("signup")} className="font-black text-[#1a237e] hover:underline">Sign up for free</button></>
                  ) : (
                    <>Already have an account? <button onClick={() => setMode("login")} className="font-black text-[#1a237e] hover:underline">Log in</button></>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Links Footer */}
          <div className="mt-12 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Help Center</a>
          </div>
        </div>
      </div>
    </div>
  );
};
