import { useState } from "react";
import { useAuth } from "../App";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { UserIcon, Save, Phone, AlertCircle } from "lucide-react";

export const ProfileView = () => {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!user || !profile) return null;

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
        await updateDoc(doc(db, "users", user.uid), { displayName });
      }
      
      // Phone number verification usually requires reCAPTCHA and SMS sending.
      // Since it is marked optional, we simply allow saving it to the profile document here for now.
      if (phone !== profile.phoneNumber) {
         await updateDoc(doc(db, "users", user.uid), { phoneNumber: phone });
      }

      setMessage("Profile updated successfully.");
    } catch (e: any) {
      setError(e.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-primary">Your Profile</h1>
        <p className="text-on-surface-variant">Manage your account details and preferences.</p>
      </header>

      <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-inner">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="h-full w-full rounded-full object-cover" />
            ) : (
              <UserIcon className="h-10 w-10" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">{user.displayName}</h2>
            <p className="text-sm text-on-surface-variant capitalize font-medium">{profile.role}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-error-container p-3 text-sm text-on-error-container">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-xl bg-primary-container p-3 text-sm text-on-primary-container">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-primary">Full Name</label>
            <input 
              type="text" 
              className="mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none focus:border-primary"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-primary">Email Address</label>
            <input 
              type="email" 
              disabled
              className="mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-lowest opacity-50 px-4 py-3 text-sm outline-none cursor-not-allowed"
              value={user.email || ""}
            />
            <p className="text-[10px] text-on-surface-variant mt-1">Email cannot be changed directly.</p>
          </div>

          <div>
            <label className="text-xs font-bold text-primary flex items-center gap-2">
              <Phone className="h-3 w-3" /> Phone Number (Optional)
            </label>
            <input 
              type="tel" 
              placeholder="+1 234 567 8900"
              className="mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none focus:border-primary"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <p className="text-[10px] text-on-surface-variant mt-1">Add your phone number to receive SMS alerts.</p>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-bold text-on-primary shadow-md hover:bg-primary-container active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
