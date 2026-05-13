import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Phone, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export const PhoneNumberPrompt = ({ userId, onComplete }: { userId: string; onComplete: () => void }) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, "users", userId), {
        phoneNumber: phone,
      });
      onComplete();
    } catch (err: any) {
      setError(err.message || "Failed to update phone number.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[32px] p-8 shadow-2xl border border-outline-variant text-center"
      >
        <div className="h-20 w-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Phone className="h-10 w-10" />
        </div>
        
        <h2 className="text-2xl font-black text-primary mb-3">One Last Thing!</h2>
        <p className="text-on-surface-variant mb-8 font-medium">
          We need your phone number to send automated voice reminders if you miss a critical dose.
        </p>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-error-container p-3 text-xs text-on-error-container border border-error/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="tel"
              required
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-6 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all pl-14"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant" />
          </div>

          <button
            type="submit"
            disabled={loading || !phone}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-black text-on-primary shadow-xl hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Saving..." : "Start My Journey"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
        
        <p className="mt-6 text-[10px] text-on-surface-variant uppercase tracking-widest font-black">
          Precision Adherence • Automation Enabled
        </p>
      </motion.div>
    </div>
  );
};
