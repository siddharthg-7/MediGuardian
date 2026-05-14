import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  HeartPulse, 
  ArrowRight, 
  ShieldCheck, 
  BrainCircuit, 
  Clock, 
  Users,
  CheckCircle
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "AI-Powered Reminders",
      desc: "Intelligent scheduling that learns your routine and ensures you never miss a dose.",
      icon: BrainCircuit,
      color: "text-primary"
    },
    {
      title: "Secure Health Vault",
      desc: "Your medical data is encrypted and stored securely using enterprise-grade Firebase services.",
      icon: ShieldCheck,
      color: "text-secondary"
    },
    {
      title: "Caregiver Sync",
      desc: "Keep your loved ones informed with real-time adherence tracking and emergency alerts.",
      icon: Users,
      color: "text-tertiary"
    }
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest font-sans selection:bg-primary/10 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 z-[100] w-full border-b border-white/10 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="p-2 bg-primary rounded-xl">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-primary uppercase">MediGuardian</span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-8 md:flex">
              {['Features', 'About', 'Pricing'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-black text-on-primary shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] active:scale-95 transition-all"
            >
              Login to Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-black text-primary uppercase tracking-widest"
            >
              <CheckCircle className="h-4 w-4" />
              Trusted by 50,000+ Seniors Worldwide
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-black leading-tight tracking-tighter text-primary"
            >
              Intelligent Care for <br />
              <span className="text-secondary italic">Every Heartbeat.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-on-surface-variant font-medium max-w-2xl leading-relaxed"
            >
              MediGuardian uses advanced AI to simplify medication adherence, keeping you on track and your loved ones informed.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-4"
            >
              <button 
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto rounded-3xl bg-primary px-10 py-5 text-lg font-black text-on-primary shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="w-full sm:w-auto rounded-3xl border-2 border-outline-variant px-10 py-5 text-lg font-black text-primary hover:bg-surface-container-low transition-all">
                View Demo
              </button>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="flex-1 relative"
          >
            <div className="relative z-10 rounded-[48px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.1)] border-8 border-white">
              <img 
                src="https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&q=80" 
                alt="Healthcare dashboard" 
                className="w-full h-auto"
              />
            </div>
            
            {/* Abstract blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-primary/10 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-secondary/10 rounded-full blur-[50px] -z-10 animate-pulse"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 bg-surface-container-low">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black text-primary mb-6">Designed for Reliability</h2>
            <p className="text-lg text-on-surface-variant font-medium">Built by healthcare experts and AI engineers to solve the medication adherence gap.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-[40px] bg-white p-10 shadow-sm border border-outline-variant hover:shadow-xl hover:translate-y-[-8px] transition-all group"
              >
                <div className={`mb-8 p-6 rounded-3xl ${f.color} bg-current/10 inline-block group-hover:scale-110 transition-transform`}>
                  <f.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-primary mb-4">{f.title}</h3>
                <p className="text-on-surface-variant font-semibold leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-outline-variant bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-xl">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-primary uppercase">MediGuardian</span>
          </div>
          
          <div className="flex gap-8 text-sm font-bold text-on-surface-variant">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Contact Support</a>
          </div>
          
          <p className="text-xs font-bold text-on-surface-variant opacity-50 italic">
            © 2026 MediGuardian AI Health-Tech. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
