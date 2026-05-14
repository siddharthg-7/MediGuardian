import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SeedPage from './pages/SeedPage';
import LandingPage from './pages/LandingPage';
import Layout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import MedicationManagement from './pages/MedicationManagement';
import PatientList from './pages/PatientList';
import Settings from './pages/Settings';

const App: React.FC = () => {

  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/seed" element={<SeedPage />} />
      
      {/* Shared Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Route>

      {/* Patient & Caretaker Specific Routes */}
      <Route element={<ProtectedRoute allowedRoles={['patient', 'caretaker']} />}>
        <Route element={<Layout />}>
          <Route path="/medications" element={<MedicationManagement />} />
          <Route path="/reminders" element={<div>Reminders Page</div>} />
        </Route>
      </Route>

      {/* Doctor Specific Routes */}
      <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
        <Route element={<Layout />}>
          <Route path="/patients" element={<PatientList />} />
          <Route path="/analytics" element={<div>Doctor Analytics Page</div>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
