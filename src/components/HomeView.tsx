import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  servicesData, 
  portfolioProjects, 
  testimonialsData 
} from '../data.ts';
import { 
  Globe, 
  Cpu, 
  Bot, 
  Blocks, 
  GitMerge, 
  ShoppingBag, 
  Sparkles, 
  CodeXml, 
  Check, 
  Send, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ArrowUpRight, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle,
  HelpCircle,
  Clock,
  Briefcase
} from 'lucide-react';

// Dynamic Icon Registry
const IconRegistry: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Cpu,
  Bot,
  Blocks,
  GitMerge,
  ShoppingBag,
  Sparkles,
  CodeXml
};

export default function HomeView() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

  // Form states with validation
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Log initial home screen visitor track
    fetch('/api/analytics/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'page_view_home', value: 'Visitor Main Page Load' })
    }).catch(() => {});
  }, []);

  // Real-time fields validation
  const validateField = (name: string, value: string) => {
    let err = '';
    if (name === 'name' && !value.trim()) {
      err = 'Name is required.';
    } else if (name === 'email') {
      if (!value.trim()) {
        err = 'Email is required.';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        err = 'Provide a valid email address.';
      }
    } else if (name === 'service' && !value) {
      err = 'Please select a service vertical.';
    } else if (name === 'message' && value.trim().length < 10) {
      err = 'Message context must display at least 10 characters.';
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const logCtaClick = (ctaName: string) => {
    fetch('/api/analytics/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType: 'cta_click', value: ctaName })
    }).catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Complete validation pass
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Provide a valid email address.';
    }
    if (!form.service) newErrors.service = 'Please select a service vertical.';
    if (form.message.trim().length < 10) newErrors.message = 'Message context must display at least 10 characters.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to form error section
      const formEl = document.getElementById('contact-form-container');
      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success) {
        setSubmitSuccess("Your inquiry was successfully registered in our Cloud SQL Postgres core! All alerts dispatched.");
        setForm({ name: '', email: '', phone: '', service: '', message: '' });
        setErrors({});
        // Reload dashboard stats if registered in session on parent page
        window.dispatchEvent(new CustomEvent('inquiry-submitted'));
      } else {
        throw new Error(data.error || "Form processing failed");
      }
    } catch (err: any) {
      console.error(err);
      setSubmitting(false);
      setErrors({ global: err.message || "Failed to sync to database backend. Please connect with our director of code on WhatsApp directly." });
    }
  };

  return (
    <div className="bg-white text-slate-900 font-sans antialiased text-sm sm:text-base leading-relaxed overflow-x-hidden">
      
      {/* Sticky Premium Header bar */}
      <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 h-16 flex items-center shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full flex justify-between items-center">
          
          {/* Logo Name */}
          <a href="#hero-section" className="flex items-center gap-2.5 group" onClick={() => logCtaClick('Nav Logo')}>
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-slate-900 to-indigo-950 text-white flex items-center justify-center font-bold font-mono text-sm shadow-md border border-indigo-500/20">
              P
            </div>
            <span className="font-bold text-lg font-sans tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              Provider Place
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-mono font-semibold text-slate-600">
            <a href="#about-section" className="hover:text-slate-950 transition-colors">About Us</a>
            <a href="#services-section" className="hover:text-slate-950 transition-colors">Services</a>
            <a href="#stats-section" className="hover:text-slate-950 transition-colors">Why Choose Us</a>
            <a href="#portfolio-section" className="hover:text-slate-950 transition-colors">Portfolio</a>
            <a href="#testimonials-section" className="hover:text-slate-950 transition-colors">Reviews</a>
            <a href="#executive-dashboard-section" className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1">
              Console <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500 animate-pulse" />
            </a>
          </nav>

          {/* Contact Direct CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#contact-section" 
              onClick={() => logCtaClick('Nav Direct Contact')}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-[12px] font-mono font-semibold shadow-xs transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              Get Bespoke Quote
            </a>
          </div>

          {/* Mobile hamburger menu */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            id="mobile-drawer-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 inset-x-0 bg-white border-b border-slate-200 z-30 overflow-hidden shadow-xl md:hidden font-mono text-slate-700 font-semibold text-xs sm:text-sm"
          >
            <div className="p-6 flex flex-col gap-4">
              <a href="#about-section" onClick={() => { setMobileMenuOpen(false); logCtaClick('Mob Link About'); }} className="hover:text-indigo-600 py-1 border-b border-slate-50">About Us</a>
              <a href="#services-section" onClick={() => { setMobileMenuOpen(false); logCtaClick('Mob Link Services'); }} className="hover:text-indigo-600 py-1 border-b border-slate-50">Services</a>
              <a href="#stats-section" onClick={() => { setMobileMenuOpen(false); logCtaClick('Mob Link Stats'); }} className="hover:text-indigo-600 py-1 border-b border-slate-50">Why Choose Us</a>
              <a href="#portfolio-section" onClick={() => { setMobileMenuOpen(false); logCtaClick('Mob Link Port'); }} className="hover:text-indigo-600 py-1 border-b border-slate-50">Portfolio</a>
              <a href="#testimonials-section" onClick={() => { setMobileMenuOpen(false); logCtaClick('Mob Link Reviews'); }} className="hover:text-indigo-600 py-1 border-b border-slate-50">Reviews</a>
              <a href="#executive-dashboard-section" onClick={() => { setMobileMenuOpen(false); logCtaClick('Mob Link Console'); }} className="text-indigo-600 hover:text-indigo-800 py-1 border-b border-indigo-50">Operations Console</a>
              <a 
                href="#contact-section" 
                onClick={() => { setMobileMenuOpen(false); logCtaClick('Mob Link Quote'); }}
                className="mt-2 text-center py-3 bg-slate-900 text-white rounded-xl text-xs"
              >
                Inquire Proposal Form
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 bg-slate-50 overflow-hidden" id="hero-section">
        {/* Soft elegant glowing geometric backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-225 h-300px bg-indigo-200/20 rounded-full blur-[140px] select-none pointer-events-none" />
        <div className="absolute top-[-10%] left-[-10%] w-400px h-400px bg-blue-100/40 rounded-full blur-[100px] select-none pointer-events-none" />
        
        {/* Decorative Grid accent lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size:3rem_3rem mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 select-none pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center">
          
          {/* Animated Welcome Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 border border-slate-300 text-slate-800 text-[11px] font-mono font-bold tracking-wider mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" /> THE ELITE IT SERVICES AGENCY
          </motion.div>

          {/* Core Master Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-sans font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-none mb-6"
          >
            Transforming Ideas Into <span className="text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-indigo-900 to-indigo-700">Powerful Digital Solutions</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="max-w-2xl mx-auto text-slate-600 text-base sm:text-lg md:text-xl font-sans mb-10 text-pretty"
          >
            Provider Place architects premium web applications, bespoke business automation systems, custom software platforms, and next-generation AI solutions designed to scale instantly.
          </motion.p>

          {/* CTA Buttons Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto"
          >
            <a 
              href="#contact-section" 
              onClick={() => { logCtaClick('Hero Get Started'); }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-mono font-semibold text-xs sm:text-sm shadow-lg transition-all transform active:scale-95 cursor-pointer"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#about-section" 
              onClick={() => { logCtaClick('Hero About Us'); }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-mono font-semibold text-xs sm:text-sm border border-slate-200 transition-all cursor-pointer"
            >
              About Us
            </a>
          </motion.div>

          {/* Subtle Trust Indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex justify-center items-center gap-8 text-[11px] font-mono text-slate-400 select-none"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> SECURE DATA</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-500 animate-pulse" /> 100% LATENCY OPTIMIZED</span>
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-indigo-500" /> ENTERPRISE-GRADE</span>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 relative overflow-hidden bg-white" id="about-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual Decorative layout column */}
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-tr from-indigo-50 to-blue-50/50 rounded-3xl blur-2xl opacity-70" />
              <div className="relative bg-white/60 border border-slate-200 shadow-xl rounded-2xl p-8 max-w-md mx-auto flex flex-col gap-6 backdrop-blur-md">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">PP</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Provider Place Core</h4>
                    <span className="text-[10px] font-mono text-slate-400">OPERATIONAL GUIDELINES</span>
                  </div>
                </div>
                <blockquote className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">
                  "We believe software development should build immediate authority. Every web application, database layer, or AI chatbot we deploy is hand-crafted with luxury precise interfaces and pixel-perfect responsiveness."
                </blockquote>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4">
                  <span>DEPLOYED ON CLOUD RUN</span>
                  <span>SMTP TRIGGERS ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Explanatory text column */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-mono font-semibold tracking-wider">
                COOPERATION FRAMEWORK
              </div>
              <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-slate-900">
                A Multi-Million Dollar Infrastructure Ready for Your Digital Project
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Our agency exists because standard template builders fall short. At Provider Place, we combine server-side performance scaling with world-class user interfaces. We are specialized software engineers, UX designers, and system integrators.
              </p>

              {/* Core Expertises list grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { title: 'Web Development', desc: 'React, Next.js, and styled responsive landing screens.' },
                  { title: 'Full Stack Applications', desc: 'Secure Express, REST layers, and lightning Postgres databases.' },
                  { title: 'AI Solutions', desc: 'Context-grounded support chatbots powered by Gemini SDK.' },
                  { title: 'SaaS Development', desc: 'Subscription frameworks, multi-tenant locks, checkouts.' },
                  { title: 'Business Automation', desc: 'Webhook lines, CRM connectors, alert automated emails.' },
                  { title: 'UI/UX Design', desc: 'Luxury typography pairings, fluid spatial flow.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 font-semibold" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-950 text-xs sm:text-sm">{item.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50 relative" id="services-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full border border-slate-300">
              SERVICES SCOPE
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-slate-900 tracking-tight mt-4">
              Premium Agency Services
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm mt-3">
              Explore our core technological areas. Hover and click client cards to reveal exact pipeline highlights and special service details.
            </p>
          </div>

          {/* Interactive Responsive Grid of 8 Service Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.map((item) => {
              const DynamicIcon = IconRegistry[item.iconName] || Globe;
              const isSelected = activeServiceId === item.id;

              return (
                <div 
                  key={item.id}
                  onClick={() => {
                    setActiveServiceId(isSelected ? null : item.id);
                    logCtaClick(`Service click: ${item.title}`);
                  }}
                  className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group overflow-hidden relative ${
                    isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50/20' : ''
                  }`}
                  id={`service-card-${item.id}`}
                >
                  <div>
                    {/* Header icon */}
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mb-4 group-hover:bg-indigo-600 transition-colors">
                      <DynamicIcon className="w-5 h-5" />
                    </div>
                    
                    <h3 className="font-bold text-slate-950 text-sm tracking-tight mb-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4">
                      {item.shortDescription}
                    </p>
                  </div>

                  <div>
                    {/* Detailed Specifications toggle */}
                    <div className="flex justify-between items-center text-[10.5px] font-mono text-indigo-600 font-bold border-t border-slate-100 pt-3 mt-2">
                      <span>{isSelected ? 'COLLAPSE SPECS' : 'VIEW DETAILS'}</span>
                      <span className="text-xs transition-transform group-hover:translate-x-1 font-mono">&rarr;</span>
                    </div>

                    {/* Expandable Panel */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 mt-2 border-t border-slate-100 space-y-2"
                        >
                          <p className="text-[11.5px] text-slate-600 font-sans italic leading-relaxed mb-1">{item.description}</p>
                          {item.details.map((det, dIdx) => (
                            <div key={dIdx} className="flex gap-1.5 items-center text-[11px] font-mono text-slate-700">
                              <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                              <span className="truncate">{det}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 relative overflow-hidden bg-white" id="stats-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <span className="inline-block text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                COMMITTED TO BENCHMARKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-slate-900 leading-none">
                Elite Credentials & Absolute Performance
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Every developer resource, inquiry process, and lines of server logic we deploy is held to rigorous operational metrics. We don't just deliver projects; we align our pipeline directly with measurable metrics.
              </p>

              {/* Counters lists */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '3.5 Hrs / Day', label: 'Average Time Saved' },
                  { value: '100% Secure', label: 'Postgres Protocols' },
                  { value: '100% Reliable', label: 'Email Dispatches' },
                  { value: '99+ Score', label: 'Lighthouse Page Speeds' }
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 bg-slate-50/50 rounded-xl">
                    <h4 className="text-lg font-black font-mono text-indigo-600">{stat.value}</h4>
                    <p className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-wide">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Aesthetic Grid representation panel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { title: 'Fast Delivery', desc: 'Accelerated MVP workflows matching sprint parameters.', icon: Clock, color: 'text-amber-500 bg-amber-50' },
                { title: 'Premium Quality', desc: 'Perfect responsive displays optimized for custom conversion rates.', icon: Sparkles, color: 'text-indigo-500 bg-indigo-50' },
                { title: 'AI-Powered Solutions', desc: 'Direct logic linkages to adaptive server-side LLMs.', icon: Bot, color: 'text-purple-500 bg-purple-50' },
                { title: 'Secure Systems', desc: 'Authenticated admin doors and fully pooled connection variables.', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50' }
              ].map((card, idx) => (
                <div key={idx} className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-all">
                  <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="font-bold text-slate-950 text-xs sm:text-sm">{card.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">{card.desc}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Portfolio Showcase Project Gallery */}
      <section className="py-24 bg-slate-50 relative" id="portfolio-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full border border-slate-300">
              DELIVERED BLUEPRINTS
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-slate-900 tracking-tight mt-4">
              Premium Project Gallery
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm mt-3">
              Observe digital frameworks we compiled to elevate clients standard conversions.
            </p>
          </div>

          {/* Core Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioProjects.map((proj) => (
              <div 
                key={proj.id} 
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`portfolio-card-${proj.id}`}
              >
                <div>
                  {/* Aspect Ratio limited premium images wrapper */}
                  <div className="h-44 sm:h-52 w-full overflow-hidden relative">
                    <img 
                      src={proj.image} 
                      alt={proj.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-md text-[10px] font-mono uppercase font-semibold">
                      {proj.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-950 mb-2">{proj.title}</h3>
                    <p className="text-slate-600 text-xs sm:text-sm mb-4">{proj.description}</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed italic bg-slate-50 border border-slate-100 p-3 rounded-lg mb-4 font-sans text-pretty">
                      {proj.extendedDescription}
                    </p>

                    {/* Tech Tags Row */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {proj.techStack.map((tag, tIdx) => (
                        <span key={tIdx} className="text-[9.5px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer bar */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/70 flex justify-between items-center">
                  <button 
                    onClick={() => { logCtaClick(`Live Demo: ${proj.title}`); alert("Live Demo link activated - Simulated Environment successfully routed! For live customer portals, connect with our sales team."); }}
                    className="text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    Live Demo <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => { logCtaClick(`Source Code: ${proj.title}`); alert("Source code is protected by corporate software copyright parameters. Repository access credentials can be requested upon contract signatures."); }}
                    className="text-xs font-mono text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    Source Code
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white relative" id="testimonials-section">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="text-center mb-16">
            <span className="inline-block text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              TRUST VALIDATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-extrabold text-slate-900 tracking-tight mt-4">
              Premium Client Reviews
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-xs sm:text-sm mt-3">
              Direct reviews compiled from operations databases. Trusted by fast-scaling tech companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-6 shadow-xs flex flex-col justify-between"
                id={`testimonial-card-${item.id}`}
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-0.5 mb-3.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <span key={i} className="text-amber-500 fill-amber-500 text-xs">&#9733;</span>
                    ))}
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 italic">
                    "{item.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-200/50 pt-4">
                  <img 
                    src={item.avatarUrl} 
                    alt={item.name} 
                    className="w-10 h-10 rounded-full border border-slate-200 object-cover" 
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-950 text-xs sm:text-sm leading-tight">{item.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{item.role} &bull; {item.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Contact Form Inquiry System */}
      <section className="py-24 bg-slate-50 relative" id="contact-section">
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" id="contact-form-container">
            
            {/* Context Left Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block text-[11px] font-mono font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full border border-slate-300">
                ACTIVE COMMUNICATIONS
              </span>
              <h2 className="text-3xl sm:text-4xl font-sans font-extrabold tracking-tight text-slate-900 leading-none">
                Start Your Digital Transformation Today
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm">
                Get a comprehensive tailored quote matching your exact specifications. Submit this verified questionnaire, email us directly, or trigger a direct live chat via WhatsApp right now.
              </p>

              <div className="space-y-4 pt-2">
                
                {/* Direct WhatsApp Call out */}
                <a 
                  href="https://wa.me/923126675235" 
                  target="_blank" 
                  rel="noreferrer"
                  onClick={() => logCtaClick('Contact WhatsApp')}
                  className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold block">DIRECT WHATSAPP CHAT</span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-800 transition-colors">+92 312 6675235</h4>
                  </div>
                </a>

                {/* Direct Email Call out */}
                <a 
                  href="mailto:starpanther0@gmail.com"
                  onClick={() => logCtaClick('Contact Email')}
                  className="flex items-center gap-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-indigo-700 font-bold block .font-mono">DIRECT RFP SUBMISSION</span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-indigo-800 transition-colors">starpanther0@gmail.com</h4>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block .font-mono">HEAD DESIGN HEADQUARTER</span>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Provider Place Engineering, PK</h4>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive Form Right Column */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-slate-950 mb-2 font-sans">Corporate Inquiry Form</h3>
              <p className="text-slate-400 text-xs mb-6 font-sans">
                PostgreSQL secure database synchronization &middot; Simulated client email alert dispatch
              </p>

              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs sm:text-sm mb-6 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block mb-1">Inquiry Stored Successfully!</strong>
                    {submitSuccess} Let's log in above to verify the entry details in real-time.
                  </div>
                </div>
              )}

              {errors.global && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl text-xs mb-6">
                  {errors.global}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-1">CLIENT NAME *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Muhammad Mawiya"
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-all font-sans ${
                        errors.name ? 'border-red-400' : 'border-slate-200'
                      }`}
                      required
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-1">CLIENT BUSINESS EMAIL *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="e.g. mmawiya@company.com"
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-all font-sans ${
                        errors.email ? 'border-red-400' : 'border-slate-200'
                      }`}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-1">CLIENT CONTACT PHONE</label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +92 312 6675235"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-1">REQUESTED SERVICE VERTICAL *</label>
                    <select
                      name="service"
                      value={form.service}
                      onChange={handleInputChange}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-all font-sans ${
                        errors.service ? 'border-red-400' : 'border-slate-200'
                      }`}
                      required
                    >
                      <option value="">Select core project vertical</option>
                      <option value="Website Development">Website Development</option>
                      <option value="Full Stack Web Applications">Full Stack Web Applications</option>
                      <option value="AI Chatbots & Integrations">AI Chatbots & Integrations</option>
                      <option value="SaaS Products">SaaS Products</option>
                      <option value="Business Automation">Business Automation</option>
                      <option value="E-Commerce Solutions">E-Commerce Solutions</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                    </select>
                    {errors.service && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.service}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider mb-1">PROJECT TECHNICAL CONTEXT BRIEF *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe target features, timeline constraints, integration requirements, and overall business goals..."
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:bg-white focus:border-indigo-500 transition-all font-sans ${
                      errors.message ? 'border-red-400' : 'border-slate-200'
                    }`}
                    required
                  />
                  {errors.message && <p className="text-red-500 text-[10px] font-mono mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 border border-slate-800 hover:bg-indigo-600 hover:border-indigo-500 text-white font-mono font-semibold text-xs rounded-xl shadow-md transition-all transform active:scale-95 disabled:opacity-50 select-none cursor-pointer"
                  id="submit-inquiry-btn"
                >
                  {submitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin" /> Verifying schemas & data...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Submit Secure Inquiry Proposal
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="bg-slate-900 text-white py-16 font-sans relative">
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-slate-700 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Left Corporate block */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold font-mono text-sm leading-none border border-indigo-400/30">
                  P
                </div>
                <span className="font-bold text-lg tracking-tight">Provider Place</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Empowering businesses with multi-million dollar luxury technological structures. From simple optimized responsive interfaces to high-end custom SaaS software systems.
              </p>
              <div className="flex items-center gap-3 text-slate-400 text-xs pt-1 select-none">
                <span className="hover:text-white transition-colors cursor-pointer">&#10004; Verified SMTP</span>
                <span className="text-slate-700">|</span>
                <span className="hover:text-white transition-colors cursor-pointer">&#10004; Cloud SQL</span>
              </div>
            </div>

            {/* Services scope column */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">ENGINEERING CAPABILITIES</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#services-section" className="hover:text-white transition-colors">Website Development</a></li>
                <li><a href="#services-section" className="hover:text-white transition-colors">Full Stack Applications</a></li>
                <li><a href="#services-section" className="hover:text-white transition-colors">AI Chatbots & LLMs</a></li>
                <li><a href="#services-section" className="hover:text-white transition-colors">SaaS Platforms</a></li>
                <li><a href="#services-section" className="hover:text-white transition-colors">Workflows Automation</a></li>
              </ul>
            </div>

            {/* Contacts info column */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">COMMUNICATIONS</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-1.5 hover:text-white cursor-pointer"><PhoneCall className="w-3.5 h-3.5" /> +92 312 6675235</li>
                <li className="flex items-center gap-1.5 hover:text-white cursor-pointer"><Mail className="w-3.5 h-3.5" /> starpanther0@gmail.com</li>
                <li className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Provider Place HQ, PK</li>
              </ul>
            </div>

            {/* Quick anchors column */}
            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">QUICK CONTROLS</h4>
              <ul className="space-y-2 text-xs text-slate-400 font-mono">
                <li><a href="#about-section" className="hover:text-white transition-colors">About Corporate</a></li>
                <li><a href="#portfolio-section" className="hover:text-white transition-colors">Deliveries Showcase</a></li>
                <li><a href="#executive-dashboard-section" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">Operations Console</a></li>
                <li><a href="https://wa.me/923126675235" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5">WhatsApp Admin <ArrowUpRight className="w-2.5 h-2.5" /></a></li>
              </ul>
            </div>

          </div>

          {/* Copyrights and bottom links */}
          <div className="border-t border-slate-800 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
            <span className="font-sans font-bold text-slate-300">
              Made with ❤️ by Muhammad Mawiya
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              &copy; {new Date().getFullYear()} Provider Place IT LLC. All rights reserved. Deployed via GCP Cloud Run.
            </span>
          </div>

        </div>
      </footer>

    </div>
  );
}
