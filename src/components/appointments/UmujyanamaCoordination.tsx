
import { User, MessageSquare, MapPin, CheckCircle2, Clock } from 'lucide-react';

const chws = [
  { id: 1, name: 'Habimana Issa', location: 'Kimironko', activeCases: 3, status: 'Active' },
  { id: 2, name: 'Mukagatare Hope', location: 'Remera', activeCases: 5, status: 'Active' },
  { id: 3, name: 'Tuyisenge Eric', location: 'Kacyiru', activeCases: 2, status: 'On Break' },
];

export const UmujyanamaCoordination = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Umujyanama Coordination</h2>
        <p className="text-slate-500">Collaborate with community health specialists for home visits and follow-ups.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">Active Outreach Tasks</h3>
            <div className="space-y-4">
              {[
                { patient: 'Nyirasafari Marie', chw: 'Mukagatare Hope', task: 'Home Visit: Missed ANC 4', status: 'Pending', due: 'Today', reason: 'High risk - 4 misses' },
                { patient: 'Mukamana Aliane', chw: 'Habimana Issa', task: 'Phone Call: Nutrition Follow-up', status: 'Completed', due: 'Mar 26', reason: 'Diet support' },
                { patient: 'Umutesi Denise', chw: 'Habimana Issa', task: 'Vaccine Catch-up: 6 Months', status: 'Pending', due: 'Tomorrow', reason: 'Infant care' },
              ].map((task, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors">
                  <div className="flex gap-4">
                    <div className={`p-2 rounded-xl bg-white shadow-sm h-10 w-10 flex items-center justify-center ${
                      task.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'
                    }`}>
                      {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm italic">{task.task}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Patient: <span className="font-bold text-slate-700 uppercase tracking-tighter">{task.patient}</span> - Assigned to: <span className="font-bold text-brand-600">{task.chw}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">Due: {task.due} - {task.reason}</p>
                    </div>
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-brand-600 transition-colors">
                    View Report
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Escalation Rules</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700">High risk</span>
                <span className="text-rose-600 font-bold">Escalate after 2 misses</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700">Standard care</span>
                <span className="text-slate-600 font-bold">Escalate after 4 misses</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700">Postpartum 48h</span>
                <span className="text-amber-600 font-bold">Immediate follow-up</span>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">Available CHWs</h3>
            <div className="space-y-4">
              {chws.map((chw) => (
                <div key={chw.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <User size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{chw.name}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {chw.location}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                    <MessageSquare size={18} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors uppercase tracking-widest">
              Assign New Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
