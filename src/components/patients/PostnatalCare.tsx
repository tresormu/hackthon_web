import { useEffect, useState } from 'react';
import { Baby, Calendar, ShieldCheck, Heart, ChevronRight, ArrowUpRight } from 'lucide-react';
import childrenService, { type Child } from '../../services/childrenService';

const checkpoints = [
  { title: '48 Hours', detail: 'Postpartum home check' },
  { title: '7 Days', detail: 'Newborn feeding, jaundice' },
  { title: '6 Weeks', detail: 'Maternal recovery review' },
  { title: '10 Weeks', detail: 'Vaccination follow-up' },
  { title: '6 Months', detail: 'Growth and nutrition' },
  { title: '24 Months', detail: 'Program graduation' },
];

function getAgeLabel(dob: string): string {
  const ms = Date.now() - new Date(dob).getTime();
  const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30.4375));
  return months < 1 ? 'Newborn' : `${months} Month${months !== 1 ? 's' : ''}`;
}

function getStatus(dob: string, nextAppt?: Child['nextAppointment']): string {
  const ms = Date.now() - new Date(dob).getTime();
  const months = Math.floor(ms / (1000 * 60 * 60 * 24 * 30.4375));
  if (months >= 22) return 'Graduating Soon';
  if (!nextAppt) return 'On Track';
  const due = new Date(nextAppt.scheduledFor);
  if (due < new Date()) return 'Delayed';
  return 'On Track';
}

export const PostnatalCare = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    childrenService.getAll()
      .then(setChildren)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-12 text-slate-500">Loading infants...</div>;

  const graduating = children.filter(c => getStatus(c.dateOfBirth, c.nextAppointment) === 'Graduating Soon');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Postnatal & Child Health</h2>
          <p className="text-slate-500">Tracking vaccinations and growth milestones for infants up to 2 years.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <ShieldCheck size={18} /> Vaccination Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">Active Growth Tracking</h3>
            {children.length === 0 ? (
              <p className="text-slate-500 italic text-sm py-8 text-center">No infants registered yet.</p>
            ) : (
              <div className="divide-y divide-slate-50">
                {children.map((child) => {
                  const status = getStatus(child.dateOfBirth, child.nextAppointment);
                  const motherName = `${child.mother.firstName} ${child.mother.lastName}`;
                  return (
                    <div key={child._id} className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-50 rounded-xl transition-all px-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center">
                          <Baby className="text-brand-600" size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{child.name || 'Baby'}</p>
                          <p className="text-xs text-slate-500">Mother: <span className="font-medium text-slate-700">{motherName}</span> - {getAgeLabel(child.dateOfBirth)} old</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Next Vaccine</p>
                          <p className="text-sm font-semibold text-brand-600">
                            {child.nextAppointment?.notes?.replace('Vaccination: ', '') ?? 'Up to date'}
                          </p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                          <p className="text-sm font-medium text-slate-900">
                            {child.nextAppointment ? new Date(child.nextAppointment.scheduledFor).toLocaleDateString() : '—'}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          status === 'On Track' ? 'bg-emerald-50 text-emerald-600' :
                          status === 'Delayed' ? 'bg-rose-50 text-rose-600' :
                          status === 'Graduating Soon' ? 'bg-slate-900 text-white' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {status}
                        </span>
                        <ChevronRight className="text-slate-300 group-hover:text-brand-600 transition-colors" size={20} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {graduating.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Graduation Watchlist</h3>
              <p className="text-xs text-slate-500 mb-4">Children nearing 24 months should receive final review and discharge planning.</p>
              <div className="space-y-3">
                {graduating.map((child) => (
                  <div key={child._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900">{child.name || 'Baby'}</p>
                      <p className="text-xs text-slate-500">Mother: {child.mother.firstName} {child.mother.lastName} - {getAgeLabel(child.dateOfBirth)} old</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Graduates</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {child.nextAppointment ? new Date(child.nextAppointment.scheduledFor).toLocaleDateString() : 'Soon'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <p className="text-3xl font-black">{children.length} <span className="text-sm font-medium opacity-60">active</span></p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { icon: Calendar, label: 'Schedule Mass Vaccination' },
                { icon: Baby, label: 'Birth Registration Sync' },
                { icon: ShieldCheck, label: 'Graduation Review List' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="w-full py-3 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl text-left flex items-center gap-3 transition-colors border border-slate-100 group">
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-brand-600 transition-colors">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
