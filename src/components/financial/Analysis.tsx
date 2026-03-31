import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RePieChart, Pie, Cell, Legend,
} from 'recharts';
import financialService, { type FinancialReport } from '../../services/financialService';

const PLAN_COLORS = ['#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export const AnalysisComponent = () => {
  const [report, setReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    financialService.getReport()
      .then(setReport)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20 text-slate-500">Loading report...</div>;

  if (!report) return (
    <div className="flex items-center justify-center py-20 text-slate-500 italic">
      No financial data available yet.
    </div>
  );

  const { summary, monthlyRevenue, revenueByPlan } = report;
  const growthPositive = summary.monthOverMonthGrowth >= 0;

  const summaryCards = [
    {
      label: 'Total Revenue',
      value: `RWF ${summary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      sub: 'All completed transactions',
    },
    {
      label: 'This Month',
      value: `RWF ${summary.currentMonthRevenue.toLocaleString()}`,
      icon: BarChart3,
      color: 'bg-brand-500',
      sub: `${growthPositive ? '+' : ''}${summary.monthOverMonthGrowth}% vs last month`,
      trend: growthPositive,
    },
    {
      label: 'Avg. Transaction',
      value: `RWF ${summary.avgTransactionValue.toLocaleString()}`,
      icon: Activity,
      color: 'bg-amber-500',
      sub: `${summary.totalTransactions} total transactions`,
    },
    {
      label: 'Pending / Failed',
      value: `${summary.pendingTransactions} / ${summary.failedTransactions}`,
      icon: AlertCircle,
      color: 'bg-rose-500',
      sub: 'Requires attention',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Report</h2>
          <p className="text-slate-500 mt-1">Revenue analytics, plan breakdown, and growth trends.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
          growthPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}>
          {growthPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
          {growthPositive ? '+' : ''}{summary.monthOverMonthGrowth}% MoM
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map(({ label, value, icon: Icon, color, sub, trend }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }} className="card group"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
                <Icon className={`${color.replace('bg-', 'text-')}`} size={22} />
              </div>
              {trend !== undefined && (
                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                  trend ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {trend ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {summary.monthOverMonthGrowth}%
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-slate-500 text-sm font-medium">{label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Monthly Revenue Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Monthly Revenue</h3>
            <p className="text-xs text-slate-500">Last 12 months of completed transactions</p>
          </div>
        </div>
        {monthlyRevenue.every(m => m.revenue === 0) ? (
          <div className="h-[300px] flex items-center justify-center text-slate-400 italic">
            No revenue data yet — transactions will appear here once completed.
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(v: number) => [`RWF ${v.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3}
                  fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Plan Breakdown + Transaction Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan — Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Revenue by Plan</h3>
            <p className="text-xs text-slate-500">Breakdown of completed revenue per subscription plan</p>
          </div>
          {revenueByPlan.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-slate-400 italic">No plan data yet.</div>
          ) : (
            <>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={revenueByPlan} dataKey="revenue" nameKey="planName"
                      cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4}>
                      {revenueByPlan.map((_, i) => (
                        <Cell key={i} fill={PLAN_COLORS[i % PLAN_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => `RWF ${v.toLocaleString()}`} />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {revenueByPlan.map((p, i) => (
                  <div key={p._id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PLAN_COLORS[i % PLAN_COLORS.length] }} />
                      <span className="text-slate-700 font-medium">{p.planName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">RWF {p.revenue.toLocaleString()}</span>
                      <span className="text-slate-400 text-xs ml-2">({p.count} tx)</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Monthly Transaction Volume — Bar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Transaction Volume</h3>
            <p className="text-xs text-slate-500">Number of transactions per month</p>
          </div>
          {monthlyRevenue.every(m => m.transactions === 0) ? (
            <div className="h-[260px] flex items-center justify-center text-slate-400 italic">No transaction data yet.</div>
          ) : (
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(v: number) => [v, 'Transactions']}
                  />
                  <Bar dataKey="transactions" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      {/* Pending / Failed attention card */}
      {(summary.pendingTransactions > 0 || summary.failedTransactions > 0) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="card border border-amber-100 bg-amber-50/40"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-2xl">
              <Clock className="text-amber-600" size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Transactions Requiring Attention</h3>
              <p className="text-sm text-slate-600 mt-1">
                <span className="font-bold text-amber-700">{summary.pendingTransactions} pending</span> and{' '}
                <span className="font-bold text-rose-700">{summary.failedTransactions} failed</span> transactions.
                Review them in Financial Records to take action.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
