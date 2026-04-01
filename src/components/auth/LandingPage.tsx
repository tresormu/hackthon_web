import { Heart, Shield, Users, Baby, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const features = [
  { icon: Heart, title: 'Maternal Health Tracking', desc: 'Monitor pregnancies from first trimester through postnatal care with real-time alerts.' },
  { icon: Baby, title: 'Child Growth Monitoring', desc: 'Track vaccinations, growth milestones, and nutrition for infants up to 2 years.' },
  { icon: Users, title: 'CHW Coordination', desc: 'Connect community health workers with patients for last-mile care delivery.' },
  { icon: Shield, title: 'Missed Visit Alerts', desc: 'Automated alerts ensure no mother or child falls through the cracks.' },
];

const howItWorks = [
  { step: '1', title: 'Register Patients', desc: 'Quickly onboard mothers and children with digital health records.' },
  { step: '2', title: 'Schedule Visits', desc: 'Set up appointments and send automated reminders to patients.' },
  { step: '3', title: 'Track Progress', desc: 'Monitor health metrics and receive alerts for high-risk cases.' },
  { step: '4', title: 'Coordinate Care', desc: 'Connect with CHWs and specialists for comprehensive care.' },
];

const testimonials = [
  { name: 'Dr. Uwimana Claire', role: 'Senior Midwife, Kigali', quote: 'MamaCare+ has transformed how we track high-risk pregnancies. We catch complications earlier than ever.' },
  { name: 'Mukamana Solange', role: 'Community Health Worker', quote: 'I can now manage 3x more patients with the coordination tools. The alerts save lives every week.' },
];

export const LandingPage = ({ onOpenAuth }: LandingPageProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-brand-600 rounded-lg">
              <Heart size={18} className="text-white" />
            </div>
            <span className="font-black text-lg text-slate-900">MamaCare<span className="text-brand-600">+</span></span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors"
            >
              Testimonials
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onOpenAuth('login')} 
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => onOpenAuth('register')} 
              className="btn-primary text-sm px-5 py-2.5 rounded-xl"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            {isMobileMenuOpen ? <X size={20} className="text-slate-600" /> : <Menu size={20} className="text-slate-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-6 py-4 space-y-3">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="block w-full text-left text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors py-2"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')} 
                className="block w-full text-left text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors py-2"
              >
                Testimonials
              </button>
              
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <button 
                  onClick={() => onOpenAuth('login')} 
                  className="block w-full text-left text-sm font-medium text-slate-600 hover:text-slate-900 py-2"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => onOpenAuth('register')} 
                  className="btn-primary text-sm px-5 py-2.5 rounded-xl w-full"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50 -z-10" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-100 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-100 rounded-full blur-3xl opacity-40 -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
            Rwanda's #1 Maternal Health Platform
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-6">
            Every Mother.
            <br />
            <span className="text-brand-600">Every Child.</span>
            <br />
            Every Visit.
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            MamaCare+ empowers health workers to deliver world-class maternal and child care — from antenatal visits to postnatal milestones.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onOpenAuth('register')} className="btn-primary flex items-center gap-2 px-8 py-4 text-base rounded-2xl shadow-lg shadow-brand-200">
              Start for Free <ArrowRight size={18} />
            </button>
            <button onClick={() => onOpenAuth('login')} className="flex items-center gap-2 px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:border-slate-300 transition-all shadow-sm">
              Sign In to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white">
            <img src="/PregnancyPhotos.jpg" alt="Maternal care consultation" className="w-full h-64 object-cover" />
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white">
            <img src="/TodayCare.jpg" alt="Health worker providing care" className="w-full h-64 object-cover" />
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-100 bg-white">
            <img src="/download (1).jpg" alt="Mother and child" className="w-full h-64 object-cover" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-3">How MamaCare+ Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Simple steps to transform your maternal care delivery.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 relative">
                  {item.step}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-brand-200 -z-10" />
                  )}
                </div>
                <h3 className="font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Everything you need in one place</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built for Rwanda's health system, designed for the frontline worker.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="p-3 bg-brand-50 rounded-2xl w-fit h-fit">
                  <Icon size={22} className="text-brand-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Trusted by health workers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-slate-700 text-sm leading-relaxed mb-3">"{t.quote}"</p>
                  <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="p-1 bg-brand-600 rounded-md">
            <Heart size={14} className="text-white" />
          </div>
          <span className="font-black text-white">MamaCare<span className="text-brand-600">+</span></span>
        </div>
        <p className="text-slate-400 text-xs">© 2026 MamaCare+. Improving maternal health across Rwanda.</p>
      </footer>
    </div>
  );
};
