import { useState, useMemo } from 'react';
import { TrendingUp, Users, Calendar, DollarSign, Activity, HardDrive, Target, BarChart3, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';
import type { FinancialStats } from '../../types/financial';
import { getFinancialStats } from '../../utils/financialHelpers';

export const AnalysisComponent = () => {
  const [timeRange, setTimeRange] = useState<'30' | '90' | '365'>('90');
  const [selectedMetric, setSelectedMetric] = useState<'cost' | 'usage' | 'efficiency'>('cost');

  // Mock data
  const mockRecords = [
    { month: 'Jan', cost: 99, patients: 45, appointments: 120 },
    { month: 'Feb', cost: 99, patients: 52, appointments: 145 },
    { month: 'Mar', cost: 99, patients: 61, appointments: 132 },
    { month: 'Apr', cost: 99, patients: 58, appointments: 167 },
    { month: 'May', cost: 99, patients: 72, appointments: 180 },
    { month: 'Jun', cost: 99, patients: 85, appointments: 195 },
  ];

  const currentPlan = {
    price: 99,
    billingCycle: 'monthly' as const,
    maxPatients: 200
  };

  const usageData = {
    patients: 85,
    appointments: 195,
    storageUsed: 850
  };

  const stats: FinancialStats = useMemo(() => 
    getFinancialStats([], currentPlan, usageData), 
    [currentPlan, usageData]
  );

  const costData = useMemo(() => {
    const multiplier = timeRange === '30' ? 1 : timeRange === '90' ? 3 : 12;
    return mockRecords.slice(-multiplier).map(record => ({
      month: record.month,
      cost: record.cost,
      patients: record.patients,
      appointments: record.appointments
    }));
  }, [timeRange]);

  const utilizationData = [
    { name: 'Used', value: stats.planUtilization, color: '#ec4899' },
    { name: 'Available', value: 100 - stats.planUtilization, color: '#e2e8f0' }
  ];

  const costBreakdownData = [
    { name: 'Subscription', value: 85, color: '#ec4899' },
    { name: 'Storage', value: 10, color: '#f59e0b' },
    { name: 'Support', value: 5, color: '#10b981' }
  ];

  const MetricCard = ({ title, value, icon: Icon, trend, color, unit = '' }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
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
        <p className="text-3xl font-bold text-slate-900 mt-1">
          {value}{unit}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Analysis</h2>
          <p className="text-slate-500 mt-1">Usage analytics and cost insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="input text-sm"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Patients" 
          value={stats.totalPatients} 
          icon={Users} 
          trend="+12%" 
          color="bg-brand-500" 
        />
        <MetricCard 
          title="Monthly Cost" 
          value={`$${stats.currentMonthSpend}`} 
          icon={DollarSign} 
          trend="0%" 
          color="bg-amber-500" 
        />
        <MetricCard 
          title="Plan Utilization" 
          value={`${stats.planUtilization.toFixed(1)}%`} 
          icon={Target} 
          trend="+5%" 
          color="bg-emerald-500" 
        />
        <MetricCard 
          title="Storage Used" 
          value={`${stats.storageUsed}MB`} 
          icon={HardDrive} 
          trend="+15%" 
          color="bg-slate-500" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost Trend Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cost Trend</h3>
              <p className="text-xs text-slate-500">Monthly subscription costs</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric('cost')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedMetric === 'cost' ? 'bg-brand-100 text-brand-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setSelectedMetric('usage')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedMetric === 'usage' ? 'bg-brand-100 text-brand-600' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Activity size={16} />
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costData}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Utilization Pie Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Plan Utilization</h3>
              <p className="text-xs text-slate-500">Patient capacity usage</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={utilizationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {utilizationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {utilizationData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-slate-700">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{entry.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Cost Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Cost Breakdown</h3>
            <p className="text-xs text-slate-500">Where your money goes</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {costBreakdownData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${item.color}20` }}>
                <DollarSign size={32} style={{ color: item.color }} />
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{item.name}</h4>
              <p className="text-2xl font-bold text-slate-900">${item.value}</p>
              <p className="text-sm text-slate-600">per month</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Efficiency Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Efficiency Metrics</h3>
            <p className="text-xs text-slate-500">Performance indicators</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-brand-600" size={20} />
              <h4 className="font-semibold text-slate-900">Cost Per Patient</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900">${stats.averageCostPerPatient.toFixed(2)}</p>
            <p className="text-sm text-slate-600 mt-2">Average monthly cost per patient</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-emerald-600" size={20} />
              <h4 className="font-semibold text-slate-900">Monthly Growth</h4>
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.monthlyGrowth.toFixed(1)}%</p>
            <p className="text-sm text-slate-600 mt-2">Patient growth rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
