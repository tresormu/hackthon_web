import { Baby, Calendar, ShieldCheck, Heart, ChevronRight, ArrowUpRight } from 'lucide-react';


const infants = [
  { id: 1, mother: 'Mukamana Aliane', babyName: 'Little Star', age: '3 Months', status: 'On Track', nextVaccine: 'Polio (IPV) 2', date: '2026-04-12' },
  { id: 2, mother: 'Uwimana Claudine', babyName: 'Prince', age: '1 Month', status: 'Upcoming', nextVaccine: 'BCG / OPV 0', date: '2026-03-30' },
  { id: 3, mother: 'Kaliza Solange', babyName: 'Ganza', age: '6 Months', status: 'Delayed', nextVaccine: 'Vitamin A Supplement', date: '2026-03-15' },
  { id: 4, mother: 'Umuhoza Grace', babyName: 'Mali', age: '23 Months', status: 'Graduating Soon', nextVaccine: 'Final Review', date: '2026-04-05' },
];

const checkpoints = [
  { title: '48 Hours', detail: 'Postpartum home check' },
  { title: '7 Days', detail: 'Newborn feeding, jaundice' },
  { title: '6 Weeks', detail: 'Maternal recovery review' },
  { title: '10 Weeks', detail: 'Vaccination follow-up' },
  { title: '6 Months', detail: 'Growth and nutrition' },
  { title: '24 Months', detail: 'Program graduation' },
];

export const PostnatalCare = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Postnatal & Child Health</h2>
          <p className="text-slate-500">Tracking vaccinations and growth milestones for infants up to 2 years.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <ShieldCheck size={18} />
          Vaccination Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">Active Growth Tracking</h3>
            <div className="divide-y divide-slate-50">
              {infants.map((infant) => (
                <div key={infant.id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 rounded-xl transition-all px-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
                      <Baby className="text-brand-600" size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{infant.babyName}</p>
                      <p className="text-xs text-slate-500">Mother: <span className="font-medium text-slate-700">{infant.mother}</span> - {infant.age} old</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Next Step</p>
                      <p className="text-sm font-semibold text-brand-600">{infant.nextVaccine}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                      <p className="text-sm font-medium text-slate-900">{infant.date}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      infant.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' :
                      infant.status === 'Delayed' ? 'bg-rose-50 text-rose-600' :
                      infant.status === 'Graduating Soon' ? 'bg-slate-900 text-white' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {infant.status}
                    </span>
                    <ChevronRight className="text-slate-300 group-hover:text-brand-600 transition-colors" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Graduation Watchlist</h3>
            <p className="text-xs text-slate-500 mb-4">Children nearing 24 months should receive final review and discharge planning.</p>
            <div className="space-y-3">
              {infants.filter(i => i.status === 'Graduating Soon').map((infant) => (
                <div key={infant.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-900">{infant.babyName}</p>
                    <p className="text-xs text-slate-500">Mother: {infant.mother} - {infant.age} old</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Graduates</p>
                    <p className="text-sm font-semibold text-slate-900">{infant.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Postpartum Checkpoints</h3>
            <div className="grid grid-cols-2 gap-3">
              {checkpoints.map((checkpoint) => (
                <div key={checkpoint.title} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{checkpoint.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{checkpoint.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-brand-600 text-white border-none shadow-brand-200 shadow-xl">
             <div className="flex items-start justify-between mb-8">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Heart className="text-white" size={24} />
              </div>
              <ArrowUpRight className="text-white/60" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Program Impact</h3>
            <p className="text-brand-50 text-sm leading-relaxed mb-6 opacity-80">
              98% of infants in MamaCare+ have completed their primary vaccination series on time.
            </p>
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Total Infants Enrolled</p>
              <p className="text-3xl font-black">1,240 <span className="text-sm font-medium opacity-60">+12%</span></p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left flex items-center gap-3 transition-colors border border-slate-100 group">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-brand-600 transition-colors">
                  <Calendar size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700">Schedule Mass Vaccination</span>
              </button>
              <button className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left flex items-center gap-3 transition-colors border border-slate-100 group">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-brand-600 transition-colors">
                  <Baby size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700">Birth Registration Sync</span>
              </button>
              <button className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left flex items-center gap-3 transition-colors border border-slate-100 group">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-brand-600 transition-colors">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-sm font-bold text-slate-700">Graduation Review List</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
