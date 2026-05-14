import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Pill, 
  Bell, 
  Settings, 
  LogOut, 
  Menu,
  HeartPulse,
  Users
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const MainLayout: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const patientNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Medications', icon: Pill, path: '/medications' },
    { name: 'Reminders', icon: Bell, path: '/reminders' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const doctorNav = [
    { name: 'Practice', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Patients', icon: Users, path: '/patients' },
    { name: 'Analytics', icon: HeartPulse, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const navItems = profile?.role === 'doctor' ? doctorNav : patientNav;


  return (
    <div className="flex h-screen bg-background text-on-background">
      {/* Sidebar */}
      <aside className="hidden w-72 flex-col border-r border-outline-variant bg-surface-container-low md:flex">
        <div className="flex h-20 items-center gap-3 px-8">
          <HeartPulse className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">MediGuardian</span>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                location.pathname === item.path
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="border-t border-outline-variant p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-10 w-10 rounded-full bg-primary-container flex items-center justify-center text-primary font-bold">
              {profile?.displayName?.[0] || 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold truncate">{profile?.displayName}</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">{profile?.role}</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-bold text-error hover:bg-error-container hover:text-on-error-container transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="flex h-20 items-center justify-between px-8 md:hidden">
           <div className="flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary">MediGuardian</span>
          </div>
          <button className="rounded-lg p-2 hover:bg-surface-container-high">
            <Menu className="h-6 w-6" />
          </button>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
