import { Heart, Shield, Users, TrendingUp, Baby, CheckCircle, ArrowRight, Star } from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

const stats = [
  { value: '12,400+', label: 'Mothers Enrolled' },
  { value: '98%', label: 'Vaccination Rate' },
  { value: '340', label: 'Health Workers' },
  { value: '30', label: 'Health Centers' },
];

const features = [
  { icon: Heart, title: 'Maternal Health Tracking', desc: 'Monitor pregnancies from first trimester through postnatal care with real-time alerts.' },
  { icon: Baby, title: 'Child Growth Monitoring', desc: 'Track vaccinations, growth milestones, and nutrition for infants up to 2 years.' },
  { icon: Users, title: 'CHW Coordination', desc: 'Connect community health workers with patients for last-mile care delivery.' },
  { icon: Shield, title: 'Missed Visit Alerts', desc: 'Automated alerts ensure no mother or child falls through the cracks.' },
];

const testimonials = [
  { name: 'Dr. Uwimana Claire', role: 'Senior Midwife, Kigali', quote: 'MamaCare+ has transformed how we track high-risk pregnancies. We catch complications earlier than ever.' },
  { name: 'Mukamana Solange', role: 'Community Health Worker', quote: 'I can now manage 3x more patients with the coordination tools. The alerts save lives every week.' },
];

export const LandingPage = ({ onOpenAuth }: LandingPageProps) => {
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
          <div className="flex items-center gap-3">
            <button onClick={() => onOpenAuth('login')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">
              Sign In
            </button>
            <button onClick={() => onOpenAuth('register')} className="btn-primary text-sm px-5 py-2.5 rounded-xl">
              Get Started
            </button>
          </div>
        </div>
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

      {/* Stats */}
      <section className="py-16 px-6 bg-slate-900">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-black text-white mb-1">{s.value}</p>
              <p className="text-slate-400 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Everything you need in one place</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Built for Rwanda's health system, designed for the frontline worker.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card group hover:border-brand-200 hover:shadow-brand-100">
                <div className="p-3 bg-brand-50 rounded-2xl w-fit mb-4 group-hover:bg-brand-100 transition-colors">
                  <Icon size={22} className="text-brand-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Trusted by health workers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-16 text-white shadow-2xl shadow-brand-200">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
              <TrendingUp size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black mb-4">Ready to transform maternal care?</h2>
          <p className="text-brand-100 opacity-80 mb-8 max-w-md mx-auto">Join hundreds of health workers already using MamaCare+ to save lives every day.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => onOpenAuth('register')} className="flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-4 rounded-2xl hover:bg-brand-50 transition-colors shadow-lg">
              Create Free Account <ArrowRight size={18} />
            </button>
            <button onClick={() => onOpenAuth('login')} className="flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors">
              Sign In
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-brand-100 opacity-60 text-xs">
            {['Free to start', 'No credit card', 'HIPAA compliant'].map((item) => (
              <span key={item} className="flex items-center gap-1.5"><CheckCircle size={12} /> {item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-100 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="p-1 bg-brand-600 rounded-md">
            <Heart size={14} className="text-white" />
          </div>
          <span className="font-black text-slate-900">MamaCare<span className="text-brand-600">+</span></span>
        </div>
        <p className="text-slate-400 text-xs">© 2026 MamaCare+. Improving maternal health across Rwanda.</p>
      </footer>
    </div>
  );
};
