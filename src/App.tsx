/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, createContext, useContext, ReactNode, useMemo } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  HeartPulse, 
  Bell, 
  CircleCheck, 
  Menu, 
  Clock, 
  FileText, 
  AlertCircle,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Plus,
  Stethoscope,
  Users,
  CheckCircle2,
  XCircle,
  Volume2,
  Search,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { auth, db, logout, handleFirestoreError, OperationType } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  getDocs,
  limit
} from "firebase/firestore";

// --- Types ---
type UserRole = "patient" | "doctor" | "caretaker";

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: any;
}

interface Prescription {
  id: string;
  doctorId: string;
  patientId: string;
  medicineName: string;
  dosage: string;
  timings: string[];
  frequency: string;
  createdAt: any;
  updatedAt: any;
}

interface MedicineLog {
  id: string;
  userId: string;
  prescriptionId: string;
  prescriptionName: string;
  doctorId: string;
  caretakerId?: string;
  status: "taken" | "skipped" | "pending";
  timestamp: any;
  createdAt: any;
}

interface CaretakerRelationship {
  id: string;
  caretakerId: string;
  patientId: string;
  status: "active" | "pending";
  createdAt: any;
}

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  handleLogout: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      }
    }
  };

  // Login handled by LoginView route


  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateRole = async (role: UserRole) => {
    if (!user) return;
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || "User",
      role,
      createdAt: serverTimestamp(),
    };
    try {
      await setDoc(doc(db, "users", user.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading: loading || (user !== null && profile === null && !loading), handleLogout, updateRole, refreshProfile }}>
      {children}
      {loginError && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3 rounded-2xl bg-error-container px-6 py-4 text-on-error-container shadow-2xl border border-error/20">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-bold">{loginError}</span>
            <button onClick={() => setLoginError(null)} className="ml-2 hover:opacity-70 transition-opacity">
              <Plus className="h-5 w-5 rotate-45" />
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

// --- Components ---

const Navbar = () => {
  const { user, profile, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface-container-lowest shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
        >
          <HeartPulse className="h-8 w-8 text-primary shadow-sm fill-secondary/20" />
          <span className="text-xl font-bold tracking-tight text-primary">MediGuardian</span>
        </div>
        
        <nav className="hidden space-x-8 md:flex">
          {["Features", "Dashboard", "Profile"].map((item) => (
            <a
              key={item}
              onClick={() => {
                if (item === "Dashboard") navigate('/dashboard');
                else if (item === "Profile") navigate('/profile');
                else navigate('/');
              }}
              className="cursor-pointer text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ""} className="h-6 w-6 rounded-full" />
                ) : (
                  <UserIcon className="h-5 w-5 text-on-surface-variant" />
                )}
                <div className="hidden flex-col sm:flex">
                   <span className="text-xs font-bold text-primary leading-none">{user.displayName?.split(' ')[0]}</span>
                   <span className="text-[10px] text-on-surface-variant capitalize leading-none mt-0.5">{profile?.role || "Pending"}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="rounded-lg p-2 text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="hidden rounded-lg px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-surface-container-low md:block"
            >
              Login
            </button>
          )}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6 text-on-surface" />
          </button>
        </div>
      </div>
    </header>
  );
};

const RoleSelection = () => {
  const { updateRole } = useAuth();
  const roles = [
    { id: "patient", title: "Patient", desc: "Manage your medicines and health logs.", icon: <UserIcon /> },
    { id: "doctor", title: "Doctor", desc: "Create prescriptions and monitor patient care.", icon: <Stethoscope /> },
    { id: "caretaker", title: "Caretaker", desc: "Monitor loved ones and get alerts.", icon: <Users /> }
  ] as const;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5 py-12">
      <div className="w-full max-w-2xl text-center">
        <h2 className="mb-2 text-3xl font-bold text-primary">Choose Your Role</h2>
        <p className="mb-10 text-on-surface-variant">Select how you want to use MediGuardian</p>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => updateRole(role.id as UserRole)}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 transition-all hover:border-primary hover:shadow-md active:scale-95"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container-low text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                {role.icon}
              </div>
              <div>
                <h3 className="font-bold text-primary">{role.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{role.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Reminder Engine ---
const ReminderEngine = ({ prescriptions, logs }: { prescriptions: Prescription[], logs: MedicineLog[] }) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      const currentStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

      prescriptions.forEach(p => {
        p.timings.forEach(t => {
          // Parse "09:00 AM" or "09:00" to "HH:mm"
          let targetStr = t;
          if (t.includes("AM") || t.includes("PM")) {
            const [time, modifier] = t.split(" ");
            let [hours, minutes] = time.split(":");
            if (hours === "12") hours = "00";
            if (modifier === "PM") hours = (parseInt(hours, 10) + 12).toString();
            targetStr = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
          }

          if (currentStr === targetStr) {
            // Check if already taken today
            const today = new Date().toLocaleDateString();
            const alreadyTaken = logs.some(l => 
              l.prescriptionId === p.id && 
              l.status === "taken" && 
              new Date(l.timestamp?.toDate ? l.timestamp.toDate() : l.timestamp).toLocaleDateString() === today
            );

            if (!alreadyTaken) {
              const msg = new SpeechSynthesisUtterance(`Reminder: It is time to take your ${p.medicineName}. Please confirm intake in the app.`);
              window.speechSynthesis.speak(msg);
              
              if ("Notification" in window && Notification.permission === "granted") {
                new Notification("MediGuardian Reminder", {
                  body: `Time for ${p.medicineName} (${p.dosage})`,
                  icon: "/favicon.ico"
                });
              }
            }
          }
        });
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [prescriptions, logs]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return null;
};

// --- Patient Dashboard ---
const PatientDashboard = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [logs, setLogs] = useState<MedicineLog[]>([]);
  const [careRequests, setCareRequests] = useState<(CaretakerRelationship & { caretakerName?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const pQuery = query(collection(db, "prescriptions"), where("patientId", "==", user.uid));
    const lQuery = query(collection(db, "medicine_logs"), where("userId", "==", user.uid));
    const cQuery = query(collection(db, "caretaker_relationships"), where("patientId", "==", user.uid));

    const unsubP = onSnapshot(pQuery, (snap) => {
      setPrescriptions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Prescription)));
    });

    const unsubL = onSnapshot(lQuery, (snap) => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() } as MedicineLog)));
    });

    const unsubC = onSnapshot(cQuery, async (snap) => {
      const allRels = snap.docs.map(d => ({ id: d.id, ...d.data() } as CaretakerRelationship));
      const reqs = await Promise.all(allRels.map(async (data) => {
        const uDoc = await getDoc(doc(db, "users", data.caretakerId));
        return { ...data, caretakerName: uDoc.data()?.displayName || "Caretaker" };
      }));
      setCareRequests(reqs);
      setLoading(false);
    });

    return () => {
      unsubP();
      unsubL();
      unsubC();
    };
  }, [user]);

  const logIntake = async (p: Prescription, status: "taken" | "skipped") => {
    try {
      // Find active caretaker to link
      const activeCaretaker = careRequests.find(r => r.status === "active");

      await addDoc(collection(db, "medicine_logs"), {
        userId: user!.uid,
        prescriptionId: p.id,
        prescriptionName: p.medicineName,
        doctorId: p.doctorId,
        ...(activeCaretaker ? { caretakerId: activeCaretaker.caretakerId } : {}),
        status,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      if (status === "taken") {
        const msg = new SpeechSynthesisUtterance(`Medication ${p.medicineName} intake recorded. Well done.`);
        window.speechSynthesis.speak(msg);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "medicine_logs");
    }
  };

  const approveRequest = async (id: string) => {
    try {
      await updateDoc(doc(db, "caretaker_relationships", id), { status: "active" });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `caretaker_relationships/${id}`);
    }
  };

  const adherenceRate = useMemo(() => {
    if (logs.length === 0) return 0;
    const taken = logs.filter(l => l.status === "taken").length;
    return Math.round((taken / logs.length) * 100);
  }, [logs]);

  return (
    <>
      <ReminderEngine prescriptions={prescriptions} logs={logs} />
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Daily Schedule</h1>
            <p className="text-on-surface-variant italic">Stay consistent with your health journey.</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-secondary-container px-4 py-2 text-on-secondary-container">
            <TrendingUp className="h-5 w-5" />
            <span className="font-bold">{adherenceRate}% Adherence</span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {careRequests.some(r => r.status === "pending") && (
              <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 animate-pulse shadow-sm">
                <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                  <Bell className="h-4 w-4" /> Caretaker Requests
                </h3>
                {careRequests.filter(r => r.status === "pending").map(r => (
                  <div key={r.id} className="flex items-center justify-between">
                    <p className="text-sm text-on-surface-variant italic">{r.caretakerName} wants to monitor your health.</p>
                    <button 
                      onClick={() => approveRequest(r.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-on-primary hover:bg-primary-container"
                    >
                      Approve
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-[32px] border border-outline-variant bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="bg-surface-container-low px-8 py-6 border-b border-outline-variant flex items-center justify-between">
                <h2 className="text-lg font-black text-primary flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  Medications Schedule
                </h2>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant bg-white px-3 py-1.5 rounded-full border border-outline-variant">Live Tracking</div>
              </div>
              <div className="divide-y divide-outline-variant">
                {prescriptions.length === 0 ? (
                  <div className="p-20 text-center text-on-surface-variant italic font-medium">
                    No active prescriptions found. Your health is currently self-managed.
                  </div>
                ) : (
                  prescriptions.map((p) => (
                    <div key={p.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-surface-container-low/30 transition-all duration-300">
                      <div className="flex items-start gap-6">
                        <div className="p-4 rounded-[20px] bg-primary-container/40 text-primary shadow-inner">
                          <FileText className="h-7 w-7" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-primary mb-1 tracking-tight">{p.medicineName}</h3>
                          <div className="flex flex-wrap gap-2 items-center text-sm font-medium text-on-surface-variant">
                            <span className="bg-surface-container-high px-2 py-0.5 rounded-md">{p.dosage}</span>
                            <span className="opacity-40">•</span>
                            <span>{p.frequency}</span>
                            <span className="opacity-40">•</span>
                            <div className="flex gap-1">
                              {p.timings.map(t => (
                                <span key={t} className="bg-primary/5 text-primary px-2 py-0.5 rounded-md font-bold">{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => logIntake(p, "skipped")}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container-high hover:border-surface-container-high transition-all active:scale-90"
                          title="Skip Dose"
                        >
                          <XCircle className="h-6 w-6" />
                        </button>
                        <button 
                          onClick={() => logIntake(p, "taken")}
                          className="flex h-12 items-center gap-2 rounded-2xl bg-primary px-6 text-sm font-black text-on-primary hover:bg-primary-container hover:shadow-xl transition-all active:scale-95 shadow-lg shadow-primary/20"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Mark Intake
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-primary flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary" />
                Health Insight
              </h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
                  <p className="text-xs text-on-surface-variant mb-1">Weekly Streak</p>
                  <div className="flex items-end gap-1 font-bold text-primary">
                    <span className="text-3xl">5</span>
                    <span className="text-sm mb-1">Days</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-on-surface-variant italic">
                  "Taking your medicines on time accounts for 70% of recovery success. Keep going!"
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
              <h3 className="mb-4 font-bold text-primary flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Care Team
              </h3>
              <div className="space-y-3">
                {careRequests.filter(r => r.status === "active").length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic">No caretaker linked yet. Share your health Journey.</p>
                ) : (
                  careRequests.filter(r => r.status === "active").map(r => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
                      <div className="h-8 w-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">{r.caretakerName[0]}</div>
                      <span className="text-xs font-bold text-primary">{r.caretakerName}</span>
                    </div>
                  ))
                )}
              </div>
              <button className="mt-6 w-full rounded-xl border border-dashed border-outline-variant py-3 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                + Invite Caretaker
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Doctor Dashboard ---
const DoctorDashboard = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState<{ profile: UserProfile, logs: MedicineLog[], prescriptions: Prescription[] }[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Prescription Form
  const [medName, setMedName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Daily 1 time");
  const [selectedTimings, setSelectedTimings] = useState<string[]>([]);
  const [newTiming, setNewTiming] = useState("09:00");

  const [allPatients, setAllPatients] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "prescriptions"), where("doctorId", "==", user.uid));
    const unsub = onSnapshot(q, async (snap) => {
      const pIds = [...new Set(snap.docs.map(d => d.data().patientId))];
      const data = await Promise.all(pIds.map(async (pId) => {
        const uDoc = await getDoc(doc(db, "users", pId));
        const lSnap = await getDocs(query(
          collection(db, "medicine_logs"), 
          where("userId", "==", pId),
          where("doctorId", "==", user.uid)
        ));
        const pSnap = await getDocs(query(collection(db, "prescriptions"), where("patientId", "==", pId), where("doctorId", "==", user.uid)));
        return {
          profile: { uid: uDoc.id, ...uDoc.data() } as UserProfile,
          logs: lSnap.docs.map(d => ({ id: d.id, ...d.data() } as MedicineLog)),
          prescriptions: pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Prescription))
        };
      }));
      setPatientData(data);
      setLoading(false);
    });

    const fetchAllPatients = async () => {
      const qCap = query(collection(db, "users"), where("role", "==", "patient"));
      const snap = await getDocs(qCap);
      setAllPatients(snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)));
    };
    fetchAllPatients();

    return unsub;
  }, [user]);

  const findPatient = async () => {
    // Replaced by selecting directly from the list of allPatients
  };

  const addPrescription = async () => {
    if (!selectedPatient || !medName || !dosage || selectedTimings.length === 0) {
      alert("Please fill all fields and add at least one timing.");
      return;
    }
    try {
      await addDoc(collection(db, "prescriptions"), {
        doctorId: user!.uid,
        patientId: selectedPatient.uid,
        medicineName: medName,
        dosage,
        frequency,
        timings: selectedTimings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setMedName("");
      setDosage("");
      setSelectedTimings([]);
      alert("Prescription added successfully!");
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "prescriptions");
    }
  };

  const addTiming = () => {
    if (newTiming && !selectedTimings.includes(newTiming)) {
      setSelectedTimings([...selectedTimings, newTiming].sort());
    }
  };

  const removeTiming = (t: string) => {
    setSelectedTimings(selectedTimings.filter(item => item !== t));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-primary tracking-tight mb-2">Physician Console</h1>
          <p className="text-lg text-on-surface-variant font-medium">Precision monitoring & prescription management.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-outline-variant shadow-sm">
           <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">
             {allPatients.length}
           </div>
           <div className="pr-4">
             <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Active Database</p>
             <p className="text-sm font-bold text-primary">Registered Patients</p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
          <h2 className="mb-6 font-bold text-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Prescription
          </h2>
          {!selectedPatient ? (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">Select a registered patient to prescribe medication.</p>
              <div className="max-h-64 overflow-y-auto space-y-2 border border-outline-variant rounded-xl p-2 bg-surface-container-low">
                {allPatients.length === 0 ? (
                  <p className="text-sm text-on-surface-variant p-2">No patients registered yet.</p>
                ) : (
                  allPatients.map(p => (
                    <button
                      key={p.uid}
                      onClick={() => setSelectedPatient(p)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors text-left"
                    >
                      <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-on-primary">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{p.displayName}</p>
                        <p className="text-[10px] text-on-surface-variant">{p.email}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-xl bg-surface-container-low p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-on-primary">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary">{selectedPatient.displayName}</p>
                    <p className="text-[10px] text-on-surface-variant">{selectedPatient.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="text-xs text-on-surface-variant hover:underline">Change</button>
              </div>

              <div className="space-y-5">
                <div className="group">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 mb-1 block">Medicine Name</label>
                  <input 
                    type="text" 
                    className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-5 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all shadow-sm group-hover:shadow-md" 
                    placeholder="e.g. Dolo 650" 
                    value={medName} 
                    onChange={e => setMedName(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 mb-1 block">Dosage</label>
                    <input 
                      type="text" 
                      className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-5 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all shadow-sm group-hover:shadow-md" 
                      placeholder="e.g. 1 Tablet" 
                      value={dosage} 
                      onChange={e => setDosage(e.target.value)} 
                    />
                  </div>
                  <div className="group">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 mb-1 block">Frequency</label>
                    <select 
                      className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-5 py-4 text-sm outline-none focus:border-primary focus:bg-white transition-all shadow-sm cursor-pointer"
                      value={frequency}
                      onChange={e => setFrequency(e.target.value)}
                    >
                      <option>Daily 1 time</option>
                      <option>Daily 2 times</option>
                      <option>Daily 3 times</option>
                      <option>Weekly</option>
                      <option>Two times a week</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 rounded-[32px] border border-outline-variant bg-surface-container-low/30 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest">Schedule Timings</label>
                    <span className="text-[10px] font-black text-on-surface-variant opacity-40 uppercase tracking-widest">{selectedTimings.length} Added</span>
                  </div>
                  
                  <div className="min-h-[60px] flex flex-wrap gap-2.5 p-3 rounded-2xl border border-dashed border-outline-variant bg-white/50">
                    {selectedTimings.length === 0 ? (
                      <p className="text-xs text-on-surface-variant italic w-full text-center py-2 opacity-60">Add medicine intake times below.</p>
                    ) : (
                      selectedTimings.map(t => (
                        <motion.span 
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={t} 
                          className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-outline-variant transition-all hover:border-primary/50"
                        >
                          <Clock className="h-3.5 w-3.5 opacity-40" />
                          {t}
                          <button 
                            onClick={() => removeTiming(t)} 
                            className="ml-1 p-0.5 rounded-md hover:bg-error/10 hover:text-error transition-all"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </motion.span>
                      ))
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative flex-1 group/input">
                      <input 
                        type="time" 
                        className="w-full rounded-2xl border border-outline-variant bg-white px-5 py-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
                        value={newTiming}
                        onChange={e => setNewTiming(e.target.value)}
                      />
                      <Clock className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-on-surface-variant opacity-30 pointer-events-none group-focus-within/input:opacity-100 group-focus-within/input:text-primary transition-all" />
                    </div>
                    <button 
                      onClick={addTiming}
                      className="h-14 w-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                      title="Add Timing"
                    >
                      <Plus className="h-8 w-8" />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={addPrescription}
                  className="w-full rounded-2xl bg-primary py-5 text-sm font-black text-on-primary shadow-2xl hover:bg-primary-container active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                >
                  <Plus className="h-5 w-5" />
                  Finalize Prescription
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[40px] border border-outline-variant bg-white overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)]">
          <div className="bg-surface-container-low px-8 py-6 border-b border-outline-variant flex items-center justify-between">
            <h2 className="text-lg font-black text-primary flex items-center gap-3">
              <Users className="h-6 w-6" />
              Patient Adherence Registry
            </h2>
          </div>
          <div className="divide-y divide-outline-variant">
            {patientData.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-24 text-center text-on-surface-variant">
                <HeartPulse className="h-16 w-16 opacity-10 mb-6" />
                <p className="text-lg font-medium">No patient data available.</p>
                <p className="text-sm opacity-60">Add a prescription to start tracking.</p>
              </div>
            ) : (
              patientData.map((pd) => {
                const adherence = pd.logs.length > 0 ? Math.round((pd.logs.filter(l => l.status === "taken").length / pd.logs.length) * 100) : 0;
                return (
                  <div key={pd.profile.uid} className="p-8 space-y-6 hover:bg-surface-container-low/30 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 flex items-center justify-center rounded-[20px] bg-[#1a237e] text-white font-black text-xl shadow-lg shadow-blue-900/20">
                          {pd.profile.displayName[0]}
                        </div>
                        <div>
                          <p className="text-xl font-black text-primary tracking-tight">{pd.profile.displayName}</p>
                          <p className="text-sm font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">{pd.prescriptions.length} Active Prescriptions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-black ${adherence < 70 ? "text-error" : "text-secondary"} tracking-tighter`}>
                          {adherence}%
                        </div>
                        <div className="text-[10px] text-on-surface-variant uppercase font-black tracking-[0.2em] opacity-60">Precision Rate</div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {pd.prescriptions.map(p => (
                        <div key={p.id} className="group relative flex items-center gap-2 rounded-xl bg-surface-container-high px-4 py-2.5 text-xs font-black text-primary transition-all hover:bg-primary hover:text-white border border-outline-variant">
                          {p.medicineName}
                          <span className="opacity-40 font-medium">|</span>
                          <span className="opacity-70 font-medium">{p.frequency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Caretaker Dashboard ---
const CaretakerDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<{ profile: UserProfile, logs: MedicineLog[], prescriptions: Prescription[] }[]>([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "caretaker_relationships"), where("caretakerId", "==", user.uid));
    const unsub = onSnapshot(q, async (snap) => {
      const activePIds = snap.docs.filter(d => d.data().status === "active").map(d => d.data().patientId);
      const data = await Promise.all(activePIds.map(async (pId) => {
        const uDoc = await getDoc(doc(db, "users", pId));
        const lSnap = await getDocs(query(
          collection(db, "medicine_logs"), 
          where("userId", "==", pId),
          where("caretakerId", "==", user.uid)
        ));
        const pSnap = await getDocs(query(collection(db, "prescriptions"), where("patientId", "==", pId)));
        return {
          profile: { uid: uDoc.id, ...uDoc.data() } as UserProfile,
          logs: lSnap.docs.map(d => ({ id: d.id, ...d.data() } as MedicineLog)),
          prescriptions: pSnap.docs.map(d => ({ id: d.id, ...d.data() } as Prescription))
        };
      }));
      setPatients(data);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  const sendRequest = async () => {
    if (!searchEmail) return;
    const q = query(collection(db, "users"), where("email", "==", searchEmail.trim()), where("role", "==", "patient"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) {
      alert("Patient not found.");
      return;
    }
    const pId = snap.docs[0].id;
    try {
      await addDoc(collection(db, "caretaker_relationships"), {
        caretakerId: user!.uid,
        patientId: pId,
        status: "pending",
        createdAt: serverTimestamp()
      });
      alert("Care request sent! The patient must accept it to share data.");
      setSearchEmail("");
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, "caretaker_relationships");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-primary">Caretaker Portal</h1>
        <p className="text-on-surface-variant">Monitor your loved ones and receive critical adherence alerts.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
         <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest overflow-hidden shadow-sm">
              <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex items-center justify-between">
                <h2 className="font-bold text-primary flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Monitored Patients
                </h2>
              </div>
              <div className="divide-y divide-outline-variant">
                {patients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-20 text-center text-on-surface-variant">
                    <Users className="h-12 w-12 opacity-20 mb-4" />
                    <p className="max-w-xs text-sm italic">Connect with patients to see their real-time adherence and daily progress.</p>
                  </div>
                ) : (
                  patients.map((p) => {
                    const adherence = p.logs.length > 0 ? Math.round((p.logs.filter(l => l.status === "taken").length / p.logs.length) * 100) : 0;
                    return (
                      <div key={p.profile.uid} className="p-6 space-y-4 hover:bg-surface-container-low/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary text-on-secondary font-bold">
                              {p.profile.displayName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary">{p.profile.displayName}</p>
                              <p className="text-[10px] text-on-surface-variant">{p.profile.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                             <p className={`text-lg font-bold ${adherence < 70 ? "text-error" : "text-secondary"}`}>{adherence}%</p>
                             <p className="text-[10px] text-on-surface-variant uppercase font-bold">Health Score</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Recent Logs</p>
                           <div className="flex gap-2 overflow-x-auto pb-1">
                             {p.logs.slice(-5).reverse().map(l => (
                               <div key={l.id} className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${l.status === 'taken' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                 {l.status === 'taken' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                 {l.prescriptionName}
                               </div>
                             ))}
                           </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-4 font-bold text-primary flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Patient
              </h2>
              <p className="text-xs text-on-surface-variant mb-4">Enter patient email to request monitoring access.</p>
              <div className="space-y-3">
                 <input 
                   type="email" 
                   placeholder="patient@email.com"
                   className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:border-primary focus:outline-none"
                   value={searchEmail}
                   onChange={e => setSearchEmail(e.target.value)}
                 />
                 <button 
                   onClick={sendRequest}
                   className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-on-primary hover:bg-primary-container transition-all active:scale-95"
                 >
                   Send Care Request
                 </button>
              </div>
            </div>

            <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm">
              <h2 className="mb-6 font-bold text-primary flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Center
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant text-center">
                   <p className="text-xs text-on-surface-variant italic">System checks for missed doses every minute.</p>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
};

// --- Main App ---
import { LoginView } from "./components/LoginView";
import { ProfileView } from "./components/ProfileView";
import { PhoneNumberPrompt } from "./components/PhoneNumberPrompt";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col selection:bg-primary selection:text-on-primary">
          <Navbar />
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/dashboard" element={<DashboardView />} />
                <Route path="/profile" element={<ProfileView />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

const LandingView = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div
      key="landing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-5 py-16 md:flex-row md:px-10 md:py-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 md:w-1/2"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold text-on-secondary-container uppercase tracking-widest w-fit">
            <AlertCircle className="h-3 w-3" /> Adherence Redefined
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-primary md:text-5xl lg:text-7xl leading-[0.95]">
            Empowering <br /> Precise Care.
          </h1>
          <p className="text-lg leading-relaxed text-on-surface-variant md:text-xl font-medium max-w-lg">
            MediGuardian bridges the gap between diagnosis and recovery with smart reminders and proactive adherence tracking for patients, doctors, and caretakers.
          </p>
          
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <button 
              onClick={() => user ? navigate('/dashboard') : navigate('/login')}
              disabled={loading}
              className="flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-bold text-on-primary transition-all hover:bg-primary-container active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Get Started Now"}
            </button>
            <button 
              className="flex h-12 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-lowest px-8 text-sm font-bold text-primary shadow-sm transition-all hover:bg-surface-container-low active:scale-95"
            >
              Watch Video
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full md:w-1/2"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-outline-variant bg-white p-4 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=2070&auto=format&fit=crop"
              alt="Medical Care"
              className="h-full w-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-8 right-8 flex flex-col gap-3">
              <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white flex items-center gap-3">
                 <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                   <CircleCheck className="h-5 w-5" />
                 </div>
                 <span className="text-xs font-bold text-primary">Dose Confirmed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      <section id="features" className="bg-surface-container-low py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { title: "Escalation Engine", desc: "Multi-level alerts from push to email and voice if meds are missed.", icon: <Bell />, color: "bg-primary-container" },
              { title: "One-Click Logging", desc: "Patients mark intake with one tap, updating all stakeholders instantly.", icon: <CheckCircle2 />, color: "bg-secondary-container" },
              { title: "Physician Control", desc: "Doctors manage prescriptions directly, with real-time insight into adherence.", icon: <Stethoscope />, color: "bg-surface-container-high" }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl border border-outline-variant bg-surface-container-lowest transition-all hover:shadow-xl hover:-translate-y-1">
                <div className={`h-14 w-14 rounded-2xl ${f.color} flex items-center justify-center text-primary mb-6`}>{f.icon}</div>
                <h3 className="text-xl font-black text-primary mb-3">{f.title}</h3>
                <p className="text-on-surface-variant font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const DashboardView = () => {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  if (loading) return <div className="flex items-center justify-center h-[60vh]"><HeartPulse className="h-10 w-10 text-primary animate-pulse" /></div>;
  if (!user) {
    navigate('/');
    return null;
  }
  if (!profile) return <RoleSelection />;

  // Condition: After patient login, take phone number for automation
  if (profile.role === "patient" && !profile.phoneNumber) {
    return <PhoneNumberPrompt userId={user.uid} onComplete={refreshProfile} />;
  }

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="mx-auto max-w-7xl px-5 py-12 md:px-10"
    >
      {profile.role === "patient" && <PatientDashboard />}
      {profile.role === "doctor" && <DoctorDashboard />}
      {profile.role === "caretaker" && <CaretakerDashboard />}
    </motion.div>
  );
};

const Footer = () => (
  <footer className="border-t border-outline-variant bg-surface-container-lowest py-16">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-5 md:flex-row md:px-10">
      <div className="flex flex-col items-center gap-4 md:items-start text-center md:text-left">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary fill-secondary/10" />
          <span className="text-2xl font-black text-primary tracking-tighter">MediGuardian</span>
        </div>
        <p className="text-sm font-medium text-on-surface-variant max-w-xs">
          Built for precision, designed with empathy. Your partner in health preservation.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-16 gap-y-10 sm:grid-cols-3">
        <div className="space-y-4">
          <h4 className="text-xs font-black text-primary uppercase tracking-widest">Product</h4>
          <nav className="flex flex-col gap-3">
             <a href="#" className="text-sm text-on-surface-variant font-medium hover:text-primary">Features</a>
             <a href="#" className="text-sm text-on-surface-variant font-medium hover:text-primary">Roadmap</a>
          </nav>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-black text-primary uppercase tracking-widest">Company</h4>
          <nav className="flex flex-col gap-3">
             <a href="#" className="text-sm text-on-surface-variant font-medium hover:text-primary">Privacy</a>
             <a href="#" className="text-sm text-on-surface-variant font-medium hover:text-primary">Safety</a>
          </nav>
        </div>
      </div>
    </div>
    <div className="mx-auto max-w-7xl px-5 md:px-10 mt-16 pt-8 border-t border-outline-variant text-[10px] uppercase font-black text-on-surface-variant tracking-[0.2em] text-center">
       &copy; {new Date().getFullYear()} MediGuardian • System Operational
    </div>
  </footer>
);


