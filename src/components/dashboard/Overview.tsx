
import { useEffect, useState } from 'react';
import { useMamaCare } from '../../contexts/useMamaCare';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import dashboardService, { type DashboardSummary } from '../../services/dashboardService';
import { PinAlertsPanel } from './PinAlertsPanel';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function buildTrendData(patients: import('../../contexts/MamaCareContext').Patient[]) {
  const now = new Date();
  const counts: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    counts[`${d.getFullYear()}-${d.getMonth()}`] = 0;
  }
  patients.forEach(p => {
    if (!p.enrolledAt) return;
    const d = new Date(p.enrolledAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (key in counts) counts[key]++;
  });
  return Object.entries(counts).map(([key, patients]) => ({
    name: MONTHS[parseInt(key.split('-')[1])],
    patients,
  }));
}

const StatCard = ({ title, value, icon: Icon, trend, color, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="card group cursor-pointer"
  >
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 transition-colors group-hover:bg-opacity-20`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold">
        <TrendingUp size={12} />
        {trend}
      </div>
    </div>
    <div className="mt-4">
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  </motion.div>
);

const RecentPatient = ({ name, week, status, risk }: any) => (
  <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center font-bold text-brand-700">
        {name.split(' ').map((n: any) => n[0]).join('')}
      </div>
      <div>
        <p className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight">{name}</p>
        <p className="text-xs text-slate-500">Week {week} - {status}</p>
      </div>
    </div>
    <div className="flex items-center gap-6">
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
        risk === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
      }`}>
        {risk} Risk
      </span>
      <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
        <ChevronRight size={20} />
      </button>
    </div>
  </div>
);

interface OverviewProps {
  searchQuery: string;
}

export const Overview = ({ searchQuery }: OverviewProps) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const { state } = useMamaCare();
  const trendData = buildTrendData(state.patients);

  useEffect(() => {
    dashboardService.getSummary().then(setSummary).catch(console.error);
  }, []);

  const priorityPatients = state.patients
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const score = (p: typeof a) => (p.status === 'High Risk' ? 2 : p.status === 'Moderate' ? 1 : 0) + p.misses;
      return score(b) - score(a);
    })
    .slice(0, 5)
    .map(p => ({
      name: p.name,
      week: p.week?.toString() ?? '—',
      status: p.stage === 'Pregnant' ? `Week ${p.week}` : p.stage,
      risk: p.status === 'High Risk' ? 'High' : 'Low',
    }));

  return (
    <div className="space-y-8">
      {/* PIN Alerts */}
      <PinAlertsPanel />

      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Saturday, March 28, 2026</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <TrendingUp size={18} />
          Generate Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Patients" 
          value={summary?.totalPatients ?? '—'} 
          icon={Users} 
          trend="+12%" 
          color="bg-brand-500" 
          delay={0.1}
        />
        <StatCard 
          title="Pending Appointments" 
          value={summary?.missedVisits ?? '—'} 
          icon={Calendar} 
          trend="+5%" 
          color="bg-amber-500" 
          delay={0.2}
        />
        <StatCard 
          title="High Risk Cases" 
          value={summary?.highRisk ?? '—'} 
          icon={AlertTriangle} 
          trend="-2%" 
          color="bg-rose-500" 
          delay={0.3}
        />
        <StatCard 
          title="CHW Tasks" 
          value={summary?.chwTasks ?? '—'} 
          icon={ArrowUpRight} 
          trend="+8%" 
          color="bg-emerald-500" 
          delay={0.4}
        />
      </div>

      {/* Critical Queue */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Today's Critical Queue</h3>
            <p className="text-xs text-slate-500">Urgent follow-ups, high-risk no-shows, and postpartum checks.</p>
          </div>
          <button className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            Triage Board <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { title: 'High-Risk No-Shows', count: 6, note: 'Escalate after 2 misses', color: 'bg-rose-50 text-rose-700' },
            { title: 'Postpartum 48h Check', count: 4, note: 'Home visit priority', color: 'bg-amber-50 text-amber-700' },
            { title: 'Emergency Symptom Alerts', count: 2, note: 'Immediate response', color: 'bg-slate-900 text-white' },
          ].map((item) => (
            <div key={item.title} className="p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                  {item.title}
                </span>
                <span className="text-2xl font-black text-slate-900">{item.count}</span>
              </div>
              <p className="text-xs text-slate-500 mt-3">{item.note}</p>
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-2 rounded-lg text-xs font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">
                  Assign CHW
                </button>
                <button className="px-3 py-2 rounded-lg text-xs font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors">
                  View List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Registration Trends</h3>
              <p className="text-xs text-slate-500">Monthly patient recruitment</p>
            </div>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 outline-none text-slate-600">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="patients" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorPatients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900">Care Continuity</h3>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                <span className="text-sm font-medium text-slate-600">On-time Visits</span>
              </div>
              <span className="text-sm font-bold text-slate-900">85%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-500 h-full w-[85%] rounded-full"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                <span className="text-sm font-medium text-slate-600">Missed Visits</span>
              </div>
              <span className="text-sm font-bold text-slate-900">12%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full w-[12%] rounded-full"></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-slate-600">Follow-ups Pending</span>
              </div>
              <span className="text-sm font-bold text-slate-900">3%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[3%] rounded-full"></div>
            </div>
          </div>

          <div className="mt-12 p-4 bg-brand-50 rounded-2xl border border-brand-100">
            <p className="text-xs text-brand-700 font-bold uppercase tracking-wider mb-2">Pro Tip</p>
            <p className="text-xs text-brand-600 leading-relaxed font-medium">
              High-risk patients escalate after 2 missed visits. Standard care escalates after 4. Assign outreach early.
            </p>
          </div>
        </div>
      </div>

      {/* Patient Timeline + Communication Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Patient Timeline Snapshot</h3>
              <p className="text-xs text-slate-500">Single-view care journey for quick context.</p>
            </div>
            <button className="text-slate-400 hover:text-brand-600 transition-colors text-xs font-bold uppercase tracking-widest">
              View Patient
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
            {[
              { label: 'Registration', status: 'Done', color: 'bg-emerald-50 text-emerald-700' },
              { label: 'ANC Visits', status: 'On Track', color: 'bg-brand-50 text-brand-700' },
              { label: 'Missed', status: '2 of 4', color: 'bg-amber-50 text-amber-700' },
              { label: 'CHW Referral', status: 'Pending', color: 'bg-slate-100 text-slate-600' },
              { label: 'Delivery', status: 'Expected Apr 15', color: 'bg-slate-100 text-slate-600' },
              { label: 'Infant Care', status: 'Scheduled', color: 'bg-slate-100 text-slate-600' },
            ].map((step) => (
              <div key={step.label} className="p-3 rounded-xl border border-slate-100 bg-white">
                <p className="font-bold text-slate-900">{step.label}</p>
                <span className={`inline-flex mt-2 px-2 py-1 rounded-full font-bold uppercase tracking-wider ${step.color}`}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Communication Log</h3>
            <button className="text-slate-400 hover:text-brand-600 transition-colors text-xs font-bold uppercase tracking-widest">
              Audit
            </button>
          </div>
          <div className="space-y-4">
            {[
              { action: 'SMS Reminder', detail: 'ANC Visit in 2 days', time: 'Today 09:10' },
              { action: 'App Message', detail: 'Nutrition tips - Week 32', time: 'Yesterday 19:40' },
              { action: 'CHW Report', detail: 'Home visit completed', time: 'Mar 26, 2026' },
            ].map((log) => (
              <div key={log.action} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">{log.action}</p>
                <p className="text-sm text-slate-700 mt-1">{log.detail}</p>
                <p className="text-[10px] text-slate-400 mt-2">{log.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Priority Follow-ups</h3>
            <p className="text-xs text-slate-400 font-medium">Patients requiring immediate attention</p>
          </div>
          <button className="text-brand-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {priorityPatients.length > 0 ? (
            priorityPatients.map((patient, index) => (
              <RecentPatient key={index} {...patient} />
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 italic">
              No patients registered yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
