import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile as updateAuthProfile } from "firebase/auth";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { AlertCircle, User as UserIcon, Stethoscope, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const LoginView = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);
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
        if (!role) {
          setError("Please select a role first.");
          setLoading(false);
          return;
        }
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateAuthProfile(result.user, { displayName: name });
        
        // Create user profile in Firestore
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

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-primary text-center">I am a...</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={() => setRole("patient")}
          className={`flex flex-col items-center gap-4 rounded-3xl border-2 p-8 transition-all hover:scale-105 ${
            role === "patient" ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-on-primary">
            <UserIcon className="h-8 w-8" />
          </div>
          <span className="text-lg font-bold text-primary">Patient</span>
        </button>
        <button
          onClick={() => setRole("doctor")}
          className={`flex flex-col items-center gap-4 rounded-3xl border-2 p-8 transition-all hover:scale-105 ${
            role === "doctor" ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50"
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-on-secondary">
            <Stethoscope className="h-8 w-8" />
          </div>
          <span className="text-lg font-bold text-primary">Doctor</span>
        </button>
      </div>
      {role && (
        <button
          onClick={() => {}} // Form is already showing role, but we could trigger step 2 here
          className="hidden"
        />
      )}
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-surface-container-lowest px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-[40px] bg-white p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-outline-variant"
      >
        <button 
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </button>

        <AnimatePresence mode="wait">
          {mode === "signup" && !role ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderRoleSelection()}
              <div className="mt-8 text-center text-sm text-on-surface-variant">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="font-bold text-primary hover:underline">
                  Sign in
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-3xl font-black text-primary mb-2">
                {mode === "login" ? "Welcome Back" : mode === "signup" ? "Get Started" : "Reset Password"}
              </h2>
              <p className="text-on-surface-variant mb-8 font-medium">
                {mode === "login" 
                  ? "Sign in to manage your precision care." 
                  : mode === "signup" 
                    ? `Signing up as a ${role}.` 
                    : "Enter your email to reset your password."}
              </p>

              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-error-container p-4 text-sm text-on-error-container border border-error/20">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-bold">{error}</span>
                </div>
              )}
              {message && (
                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-primary-container p-4 text-sm text-on-primary-container border border-primary/20">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="font-bold">{message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                  <div>
                    <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      className="mt-2 w-full rounded-2xl border border-outline-variant bg-surface-container-low px-5 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                      placeholder="Dr. John Doe / Patient Jane"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    className="mt-2 w-full rounded-2xl border border-outline-variant bg-surface-container-low px-5 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                {mode !== "forgot" && (
                  <div>
                    <label className="text-xs font-black text-primary uppercase tracking-widest ml-1">Password</label>
                    <input 
                      type="password" 
                      required 
                      minLength={6}
                      className="mt-2 w-full rounded-2xl border border-outline-variant bg-surface-container-low px-5 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full rounded-2xl bg-primary py-5 text-sm font-black text-on-primary shadow-xl hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50"
                >
                  {loading ? "Authenticating..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-3 text-sm text-on-surface-variant font-medium">
                {mode === "login" ? (
                  <>
                    <button onClick={() => setMode("forgot")} className="hover:text-primary transition-colors">Forgot Password?</button>
                    <p>New to MediGuardian? <button onClick={() => setMode("signup")} className="font-black text-primary hover:underline">Create Account</button></p>
                  </>
                ) : mode === "signup" ? (
                  <>
                    <button onClick={() => setRole(null)} className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                      <ChevronLeft className="h-3 w-3" /> Change Role
                    </button>
                    <p>Already have an account? <button onClick={() => setMode("login")} className="font-black text-primary hover:underline">Sign in</button></p>
                  </>
                ) : (
                  <button onClick={() => setMode("login")} className="font-black text-primary hover:underline">Back to Sign in</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
