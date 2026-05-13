import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { auth, db, handleFirestoreError, OperationType } from "../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { X, AlertCircle } from "lucide-react";

export const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        // The role will be set later in RoleSelection component as per current app logic.
      } else if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (mode === "forgot") {
        await sendPasswordResetEmail(auth, email);
        setMessage("Password reset email sent. Check your inbox.");
        setLoading(false);
        return;
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-3xl bg-surface-container-lowest p-8 shadow-2xl border border-outline-variant relative">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 hover:bg-surface-container-low transition-colors text-on-surface-variant">
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-black text-primary mb-2">
          {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
        </h2>
        <p className="text-sm text-on-surface-variant mb-6">
          {mode === "login" ? "Sign in to manage your health." : mode === "signup" ? "Join MediGuardian today." : "Enter your email to receive a reset link."}
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-container p-3 text-sm text-on-error-container">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-primary-container p-3 text-sm text-on-primary-container">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs font-bold text-primary">Full Name</label>
              <input 
                type="text" 
                required 
                className="mt-1 w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <label className="text-xs font-bold text-primary">Email Address</label>
            <input 
              type="email" 
              required 
              className="mt-1 w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none focus:border-primary"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {mode !== "forgot" && (
            <div>
              <label className="text-xs font-bold text-primary">Password</label>
              <input 
                type="password" 
                required 
                minLength={6}
                className="mt-1 w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-on-primary shadow-md hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-2 text-sm text-on-surface-variant">
          {mode === "login" ? (
            <>
              <button onClick={() => setMode("forgot")} className="font-bold hover:text-primary">Forgot Password?</button>
              <p>Don't have an account? <button onClick={() => setMode("signup")} className="font-bold text-primary">Sign up</button></p>
            </>
          ) : mode === "signup" ? (
            <p>Already have an account? <button onClick={() => setMode("login")} className="font-bold text-primary">Sign in</button></p>
          ) : (
            <button onClick={() => setMode("login")} className="font-bold text-primary">Back to Sign in</button>
          )}
        </div>
      </div>
    </div>
  );
};
