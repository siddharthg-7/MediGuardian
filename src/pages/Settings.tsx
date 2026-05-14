import React from 'react';
import { User, Bell, Lock, Shield } from 'lucide-react';

const Settings: React.FC = () => {
  const sections = [
    {
      title: 'Account Settings',
      description: 'Update your personal information and contact details.',
      icon: User,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'Notifications',
      description: 'Configure how and when you receive health alerts.',
      icon: Bell,
      color: 'text-secondary',
      bg: 'bg-secondary/10'
    },
    {
      title: 'Privacy & Security',
      description: 'Manage your data permissions and login security.',
      icon: Lock,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50'
    }
  ];

  return (
    <div className="max-w-4xl space-y-12">
      <header>
        <h1 className="text-4xl font-black text-primary">Settings</h1>
        <p className="mt-2 text-lg text-on-surface-variant font-medium">Configure your personal preferences and account security.</p>
      </header>

      <div className="grid gap-6">
        {sections.map((section) => (
          <div key={section.title} className="rounded-[32px] bg-white p-8 shadow-sm border border-outline-variant/30 group hover:border-primary/30 transition-all cursor-pointer">
            <div className="flex items-start gap-6">
              <div className={`p-4 rounded-2xl ${section.bg} ${section.color} group-hover:scale-110 transition-transform`}>
                <section.icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-black text-primary mb-1">{section.title}</h3>
                <p className="text-on-surface-variant font-medium text-sm leading-relaxed opacity-70">
                  {section.description}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-surface-container-low opacity-0 group-hover:opacity-100 transition-opacity">
                <Shield className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
