import { AlertCircle, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import appointmentsService from '../../services/appointmentsService';
import { useMamaCare } from '../../contexts/useMamaCare';

export const MissedVisitAlerts = () => {
  const { state, completeTask } = useMamaCare();
  const alerts = state.chwTasks;
  const loading = state.loading;

  const handleComplete = async (id: string | number) => {
    await completeTask(id);
  };

  if (loading) return <div className="flex items-center justify-center py-12 text-slate-500">Loading alerts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Missed Visit Alerts</h2>
          <p className="text-slate-500">Immediate action required for patients with multiple missed appointments.</p>
        </div>
        <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle size={14} />
          {alerts.filter(a => a.status === 'Pending').length} Escalations Pending
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="card text-center py-12 text-slate-500 italic">No open follow-up alerts.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`card border-l-4 ${alert.status === 'Pending' ? 'border-l-rose-500 bg-rose-50/30' : 'border-l-emerald-400'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-slate-700">
                  {alert.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  alert.status === 'Pending' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {alert.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{alert.patientName}</h3>
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-4">
                <AlertCircle size={16} />
                {alert.task}
              </div>

              <div className="space-y-2 mb-6 text-xs text-slate-500 font-medium">
                <p>Due: {alert.due}</p>
                <p>Reason: {alert.reason}</p>
                {alert.chw && <p>Assigned CHW: {alert.chw}</p>}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <Phone size={14} /> Call
                </button>
                <button className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                  <MessageSquare size={14} /> Send SMS
                </button>
                {alert.status === 'Pending' && (
                  <button
                    onClick={() => handleComplete(alert.id)}
                    className="col-span-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
