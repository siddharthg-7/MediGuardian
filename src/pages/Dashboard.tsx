import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  if (profile?.role === 'doctor') {
    return <DoctorDashboard />;
  }

  // Default to patient dashboard if role is patient or caretaker
  return <PatientDashboard />;
};

export default Dashboard;
