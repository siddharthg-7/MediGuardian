import React, { useState } from 'react';
import { Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { wipePatientData } from '../services/cleanupService';

const Settings: React.FC = () => {
  const [isWiping, setIsWiping] = useState(false);
  const [done, setDone] = useState(false);

  const handleWipe = async () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete ALL patients, prescriptions, and logs. This action cannot be undone. Proceed?')) {
      setIsWiping(true);
      try {
        await wipePatientData();
        setDone(true);
      } catch (err) {
        console.error(err);
        alert('Cleanup failed. Check console for details.');
      } finally {
        setIsWiping(false);
      }
    }
  };

  return (
    <div className="max-w-4xl space-y-10">
      <header>
        <h1 className="text-4xl font-black text-primary">System Settings</h1>
        <p className="mt-2 text-lg text-on-surface-variant font-medium">Manage platform data and security protocols.</p>
      </header>

      <div className="rounded-[40px] border-2 border-error/20 bg-white p-10 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-3xl bg-error/10 text-error">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black text-primary mb-2">Danger Zone</h3>
            <p className="text-on-surface-variant font-medium mb-8 leading-relaxed">
              Use these tools to clear the environment for a fresh start. These actions are irreversible and will wipe your Firestore collections.
            </p>

            {done ? (
              <div className="flex items-center gap-3 p-6 rounded-2xl bg-secondary/10 text-secondary font-black">
                <CheckCircle2 className="h-6 w-6" />
                Database Cleaned Successfully
              </div>
            ) : (
              <button
                onClick={handleWipe}
                disabled={isWiping}
                className="flex items-center gap-3 rounded-2xl bg-error px-8 py-4 font-black text-white shadow-xl shadow-error/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Trash2 className="h-5 w-5" />
                {isWiping ? 'Cleaning Database...' : 'Wipe All Patient Data'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
