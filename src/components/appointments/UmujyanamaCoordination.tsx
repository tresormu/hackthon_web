import { useEffect, useState } from 'react';
import { User, MessageSquare, CheckCircle2, Clock } from 'lucide-react';
import doctorsService, { type ChwUser } from '../../services/doctorsService';
import appointmentsService from '../../services/appointmentsService';
import type { ChwTask } from '../../contexts/MamaCareContext';

export const UmujyanamaCoordination = () => {
  const [chws, setChws] = useState<ChwUser[]>([]);
  const [tasks, setTasks] = useState<ChwTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      doctorsService.getChws(),
      appointmentsService.getMissedAlerts(),
    ]).then(([chwList, followUps]) => {
      setChws(chwList);
      setTasks(followUps);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleResolve = async (taskId: string | number) => {
    try {
      await appointmentsService.updateStatus(taskId.toString(), 'completed');
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-12 text-slate-500">Loading...</div>;

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
            {tasks.length === 0 ? (
              <p className="text-slate-500 italic text-sm">No active outreach tasks.</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task, i) => (
                  <div key={task.id ?? i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors">
                    <div className="flex gap-4">
                      <div className={`p-2 rounded-xl bg-white shadow-sm h-10 w-10 flex items-center justify-center ${
                        task.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm italic">{task.task}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Patient: <span className="font-bold text-slate-700 uppercase tracking-tighter">{task.patientName}</span>
                          {task.chw && <> - CHW: <span className="font-bold text-brand-600">{task.chw}</span></>}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">Due: {task.due} - {task.reason}</p>
                      </div>
                    </div>
                    {task.status === 'Pending' && (
                      <button
                        onClick={() => handleResolve(task.id)}
                        className="text-[10px] font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-4 uppercase tracking-tight">Escalation Rules</h3>
            <div className="space-y-3 text-xs text-slate-600">
              {[
                { label: 'High risk', rule: 'Escalate after 2 misses', color: 'text-rose-600' },
                { label: 'Standard care', rule: 'Escalate after 4 misses', color: 'text-slate-600' },
                { label: 'Postpartum 48h', rule: 'Immediate follow-up', color: 'text-amber-600' },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-700">{r.label}</span>
                  <span className={`font-bold ${r.color}`}>{r.rule}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 mb-6 uppercase tracking-tight">
              Available CHWs {chws.length > 0 && <span className="text-brand-500">({chws.length})</span>}
            </h3>
            {chws.length === 0 ? (
              <p className="text-slate-500 italic text-sm">No CHWs registered.</p>
            ) : (
              <div className="space-y-4">
                {chws.map((chw) => (
                  <div key={chw._id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <User size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{chw.name}</p>
                        <p className="text-[10px] text-slate-500">{chw.email}</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-brand-600 transition-colors">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
