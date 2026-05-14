import React from 'react';
import { motion } from 'motion/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import {
  HeartPulse,
  ArrowRight,
  Play,
  ShieldCheck,
  BellRing,
  Activity,
  Pill,
  BrainCircuit,
  Users,
  MessageSquare,
  Sparkles,
  Zap,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Quote
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Asset Imports
import neuralHealthImg from '../assets/neural-health.png';
import clinicalComplianceImg from '../assets/clinical-compliance.png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-primary/3 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-secondary/3 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-grid" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-8 inset-x-0 z-50 flex justify-center px-6">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-full px-8 py-3.5 flex items-center justify-between w-full max-w-6xl border border-white/40"
        >
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-primary">MediGuardian</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Features', 'How It Works', 'AI Assistant', 'Testimonials', 'Contact Us'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="text-label-md text-on-surface-variant hover:text-primary transition-colors tracking-widest uppercase"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-label-md font-black text-primary hover:bg-primary/5 transition-all uppercase tracking-widest"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-2.5 rounded-full bg-primary text-white text-label-md font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-10">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-black uppercase tracking-widest text-secondary">
                <BrainCircuit className="h-3 w-3" />
                CLINICALLY CERTIFIED AI
              </span>
            </div>

            <h1 className="text-headline-xl mb-10 text-primary leading-tight font-serif italic">
              Intelligent Care<br />
              <span className="text-gradient-green">Every Heartbeat.</span>
            </h1>

            <p className="text-body-md text-on-surface-variant leading-relaxed mb-14 max-w-md">
              MediGuardian bridges the gap between clinical data and emotional connection. Our AI-driven ecosystem provides real-time health monitoring with a human touch.
            </p>

            <div className="flex flex-wrap gap-6 items-center">
              <button
                onClick={() => navigate('/signup')}
                className="group flex items-center gap-3 bg-primary text-white px-10 py-4.5 rounded-full text-label-md font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button className="group flex items-center gap-3 glass px-8 py-4.5 rounded-full text-label-md font-black hover:bg-white transition-all uppercase tracking-widest">
                <Play className="h-4 w-4 text-primary fill-current" />
                Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-square max-w-[600px] mx-auto">
              <DotLottieReact
                src="https://lottie.host/bfcd9919-39a3-40b5-977b-c1cba716329c/u1EMypmcUX.lottie"
                loop
                autoplay
                className="w-full h-full"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 -left-6 glass p-4 rounded-2xl shadow-xl border border-white/60 animate-float z-20">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <BellRing className="h-4 w-4 text-white" />
                </div>
                <div className="text-[10px] font-black text-primary uppercase">Medication Reminder<br /><span className="opacity-60">9:00 AM - Done</span></div>
              </div>
            </div>

            <div className="absolute bottom-20 -right-6 glass p-4 rounded-2xl shadow-xl border border-white/60 animate-float-delayed z-20">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div className="text-[10px] font-black text-secondary uppercase">Live Vitals<br /><span className="opacity-60">Stable - 72 BPM</span></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-headline-lg text-primary mb-4">Core Healthcare Modules</h2>
          <p className="text-body-sm text-on-surface-variant max-w-xl mx-auto opacity-80">
            A comprehensive suite of tools designed for patients, doctors, and caregivers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Neural Health Engine */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-8 glass rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-10 group overflow-hidden border border-white/40 hover:bg-white/90 transition-all duration-500"
          >
            <div className="flex-1 z-10">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:rotate-12 transition-transform">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-headline-md text-primary mb-4">Neural Health Engine</h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed mb-6">
                MediGuardian's AI analyzes subtle patterns in health data to predict potential issues before they arise.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/5 text-[10px] font-black text-primary uppercase tracking-tighter">Predictive Analytics</span>
                <span className="px-3 py-1 rounded-full bg-primary/5 text-[10px] font-black text-primary uppercase tracking-tighter">Behavioral Patterns</span>
              </div>
            </div>
            <div className="flex-1 w-full aspect-video rounded-2xl border border-outline-variant relative overflow-hidden group-hover:scale-[1.02] transition-transform">
              <img
                src={neuralHealthImg}
                alt="Neural Health AI"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4 glass rounded-[32px] p-10 group border border-white/40 hover:bg-white/90 transition-all"
          >
            <div className="h-12 w-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8 group-hover:scale-110 transition-transform">
              <Pill className="h-6 w-6" />
            </div>
            <h3 className="text-headline-md text-primary mb-4">Smart Intake</h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Reminders that adapt to your routine. If you miss a dose, we don't just alert you—we help you recover the schedule.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4 glass rounded-[32px] p-10 group border border-white/40 hover:bg-white/90 transition-all"
          >
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
              <BellRing className="h-6 w-6" />
            </div>
            <h3 className="text-headline-md text-primary mb-4">Guardian Alerts</h3>
            <p className="text-body-sm text-on-surface-variant leading-relaxed">
              Critical notifications for family and providers. Real-time updates when it matters most.
            </p>
          </motion.div>

          {/* Clinical Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-8 glass rounded-[32px] p-10 flex flex-col sm:flex-row gap-10 group border border-white/40 hover:bg-white/90 transition-all overflow-hidden"
          >
            <div className="flex-1">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-headline-md text-primary mb-4">Clinical Compliance</h3>
              <p className="text-body-sm text-on-surface-variant leading-relaxed mb-6">
                HIPAA-compliant, end-to-end encrypted medical data storage. Your privacy is a clinical requirement.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-secondary/5 text-[10px] font-black text-secondary uppercase tracking-tighter">HIPAA Ready</span>
                <span className="px-3 py-1 rounded-full bg-secondary/5 text-[10px] font-black text-secondary uppercase tracking-tighter">AES-256</span>
              </div>
            </div>
            <div className="flex-1 aspect-video sm:aspect-auto bg-surface-container-low rounded-2xl border border-outline-variant relative overflow-hidden group-hover:scale-[1.02] transition-transform">
              <img
                src={clinicalComplianceImg}
                alt="Clinical Compliance Security"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-6"
          >
            HOW IT WORKS
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-headline-xl text-[#1a2b4b] leading-tight max-w-2xl font-serif italic"
          >
            Three steps. <br />
            One healthy lifestyle.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              step: '01', 
              title: 'Onboard & Sync', 
              desc: 'Connect your prescriptions via our secure portal. Our AI automatically parses dosages and frequencies.', 
              icon: Zap 
            },
            { 
              step: '02', 
              title: 'Intelligent Monitoring', 
              desc: 'Our engine tracks your intake patterns in real-time, adapting reminders to your actual daily routine.', 
              icon: Sparkles 
            },
            { 
              step: '03', 
              title: 'Know your status', 
              desc: 'A single, clear adherence score. The exact moment your health data reaches optimal levels. No ambiguity.', 
              icon: HeartPulse 
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (i * 0.1), duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="group bg-[#1a2b4b] rounded-[24px] p-10 flex flex-col h-full min-h-[420px] justify-between hover:scale-[1.02] transition-all duration-500 shadow-xl"
            >
              <div>
                <div className="text-[10px] font-black text-white/40 mb-12 tracking-widest">{item.step}</div>
                <div className="mb-12">
                   <item.icon className="h-14 w-14 text-white/90 stroke-[1.5]" />
                </div>
              </div>
              
              <div>
                <h3 className="text-headline-md text-white mb-6 font-medium">{item.title}</h3>
                <p className="text-body-sm text-white/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Assistant Showcase */}
      <section id="ai-assistant" className="relative py-32 px-6 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto bg-[#0a1931] rounded-[48px] p-12 md:p-20 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent opacity-50" />
          <div className="absolute bottom-[-10%] left-[-5%] w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-secondary mb-8">
                <Sparkles className="h-3 w-3" />
                MEET YOUR VIRTUAL GUARDIAN
              </span>
              <h2 className="text-headline-lg text-white mb-8">Empathetic Intelligence at Your Fingertips.</h2>
              <p className="text-body-md text-white/70 leading-relaxed mb-12 max-w-md">
                Our AI doesn't just remind you; it understands you. It recognizes patterns, offers clinical advice, and keeps your medical team informed in real-time.
              </p>
              <ul className="space-y-6">
                {[
                  'Voice-activated health checkups',
                  'Natural language medication logging',
                  'Real-time prescription analysis',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-4 text-white/90 font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="glass-dark p-8 rounded-[32px] border border-white/10"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="text-white">
                  <div className="text-xs font-black uppercase tracking-widest opacity-60">MediGuardian AI</div>
                  <div className="text-sm font-bold">Online & Monitoring</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/80 max-w-[80%]">
                  "Good morning! I noticed you haven't logged your Metformin yet. Would you like me to log it for you now?"
                </div>
                <div className="p-4 rounded-2xl bg-primary/20 border border-primary/20 text-xs text-white self-end ml-auto max-w-[80%] text-right">
                  "Yes, please. I took it at 8:30 AM."
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-white/80 max-w-[80%]">
                  "Perfect! Logged. Your adherence score is now 98%. Keep it up!"
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-headline-lg text-primary mb-4">Trusted by the Healthcare Community</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Dr. Emily Chen', role: 'Chief of Geriatrics', text: 'MediGuardian has transformed how we manage medication for our senior patients. The real-time alerts are life-saving.' },
            { name: 'Robert Wilson', role: 'Daughter\'s Caregiver', text: 'I finally have peace of mind knowing that I\'ll be notified if my father misses a dose. The AI is incredibly helpful.' },
            { name: 'Martha Stewart', role: 'Active Senior', text: 'It\'s like having a friendly nurse in my pocket. The reminders are gentle and the app is very easy to use.' },
          ].map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[32px] flex flex-col justify-between border border-white/40 hover:scale-[1.02] transition-all"
            >
              <div>
                <Quote className="h-10 w-10 text-primary/10 mb-6" />
                <p className="text-body-sm text-on-surface-variant font-medium leading-relaxed mb-8 italic">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-outline-variant pt-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-black text-primary">{t.name}</div>
                  <div className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section id="contact-us" className="relative py-32 px-6 max-w-7xl mx-auto z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-[48px] p-12 md:p-20 border border-white/60 overflow-hidden relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-headline-lg text-primary mb-8">Let's Secure the Future of Care.</h2>
              <p className="text-body-md text-on-surface-variant leading-relaxed mb-12">
                Whether you're a healthcare provider, a concerned family member, or a curious user, we'd love to hear from you.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Phone, label: 'Call Us', value: '+1 (800) MEDI-GUARD' },
                  { icon: Mail, label: 'Email', value: 'hello@mediguardian.ai' },
                  { icon: MapPin, label: 'Visit', value: '789 Clinical Way, Palo Alto, CA' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-6 group">
                    <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-40">{item.label}</div>
                      <div className="text-sm font-bold text-primary">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="bg-surface-container-low rounded-[32px] p-8 border border-outline-variant shadow-sm"
            >
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="w-full rounded-full border border-outline-variant bg-white px-6 py-3 text-sm font-bold outline-none focus:border-primary transition-all" />
                  <input type="text" placeholder="Last Name" className="w-full rounded-full border border-outline-variant bg-white px-6 py-3 text-sm font-bold outline-none focus:border-primary transition-all" />
                </div>
                <input type="email" placeholder="Email Address" className="w-full rounded-full border border-outline-variant bg-white px-6 py-3 text-sm font-bold outline-none focus:border-primary transition-all" />
                <textarea placeholder="How can we help?" rows={4} className="w-full rounded-[24px] border border-outline-variant bg-white px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-all resize-none"></textarea>
                <button className="w-full rounded-full bg-primary text-white py-4 text-label-md font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest">
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative py-24 px-6 border-t border-outline-variant bg-white z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="relative h-9 w-9 bg-primary rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                  <HeartPulse className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-black text-primary">MediGuardian</span>
              </div>
              <p className="text-body-sm text-on-surface-variant max-w-sm">
                Intelligent care for every heartbeat. Bridging the gap between medical data and human connection.
              </p>
            </div>
            <div>
              <h4 className="text-label-md font-black uppercase tracking-widest text-primary mb-8">Product</h4>
              <ul className="space-y-4 text-body-sm font-medium text-on-surface-variant">
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#ai-assistant" className="hover:text-primary transition-colors">AI Assistant</a></li>
                <li><a href="#contact-us" className="hover:text-primary transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-label-md font-black uppercase tracking-widest text-primary mb-8">Support</h4>
              <ul className="space-y-4 text-body-sm font-medium text-on-surface-variant">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Safety Protocols</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-label-md text-on-surface-variant opacity-60">
              © 2024 MediGuardian. Intelligent Care for Every Heartbeat.
            </p>
            <div className="flex gap-8">
              <div className="h-4 w-4 bg-on-surface-variant/20 rounded-full cursor-pointer hover:bg-primary transition-colors" />
              <div className="h-4 w-4 bg-on-surface-variant/20 rounded-full cursor-pointer hover:bg-primary transition-colors" />
              <div className="h-4 w-4 bg-on-surface-variant/20 rounded-full cursor-pointer hover:bg-primary transition-colors" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
