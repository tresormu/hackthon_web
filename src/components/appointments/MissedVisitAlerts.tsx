
import { AlertCircle, Phone, MapPin, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const alerts = [
  { id: 1, name: 'Mukamana Aliane', misses: 2, lastMissed: '2026-03-24', location: 'Kimironko', phone: '0788123456', risk: 'High', missType: 'ANC', channel: 'SMS' },
  { id: 2, name: 'Nyirasafari Marie', misses: 4, lastMissed: '2026-03-27', location: 'Nyamirambo', phone: '0788456789', risk: 'Critical', missType: 'PNC', channel: 'Call' },
  { id: 3, name: 'Kaliza Solange', misses: 2, lastMissed: '2026-03-22', location: 'Kicukiro', phone: '0788345678', risk: 'Medium', missType: 'ANC', channel: 'SMS' },
  { id: 4, name: 'Umutesi Denise', misses: 1, lastMissed: '2026-03-18', location: 'Gisozi', phone: '0788567890', risk: 'Low', missType: 'Vaccine', channel: 'App' },
];

const getThreshold = (risk: string) => (risk === 'High' || risk === 'Critical' ? 2 : 4);

export const MissedVisitAlerts = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Missed Visit Alerts</h2>
          <p className="text-slate-500">Immediate action required for patients with multiple missed appointments.</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={14} />
            {alerts.filter(a => a.misses >= getThreshold(a.risk)).length} Escalations Pending
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {['All', 'Urgent', 'High Risk', 'Postpartum', 'Vaccine'].map((filter) => (
          <button
            key={filter}
            className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map((alert, index) => {
          const threshold = getThreshold(alert.risk);
          const progress = Math.min((alert.misses / threshold) * 100, 100);
          return (
            <motion.div 
              key={alert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`card border-l-4 ${
                alert.misses >= threshold ? 'border-l-rose-500 bg-rose-50/30' : 
                alert.misses === threshold - 1 ? 'border-l-amber-500' : 'border-l-slate-300'
              }`}
            >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-bold text-slate-700">
                {alert.name.split(' ').map(n => n[0]).join('')}
              </div>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                alert.risk === 'Critical' ? 'bg-rose-500 text-white' : 
                alert.risk === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {alert.risk}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">{alert.name}</h3>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm mb-4">
              <AlertCircle size={16} />
              {alert.misses} Missed ({alert.missType})
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Escalates at {threshold} misses</span>
                <span>{alert.misses} / {threshold}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <MapPin size={14} className="text-slate-400" />
                {alert.location}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Phone size={14} className="text-slate-400" />
                {alert.phone}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <MessageSquare size={14} className="text-slate-400" />
                Preferred: {alert.channel}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <AlertCircle size={14} className="text-slate-400" />
                Last missed: {alert.lastMissed}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <Phone size={14} />
                Call
              </button>
              <button className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                <MessageSquare size={14} />
                Send SMS
              </button>
              <button className="bg-slate-50 border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                Assign CHW
              </button>
              <button className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                alert.misses >= threshold 
                  ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200' 
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-200'
              }`}>
                {alert.misses >= threshold ? 'Escalate Now' : 'Schedule Visit'}
              </button>
            </div>
          </motion.div>
        )})}
      </div>
    </div>
  );
};
