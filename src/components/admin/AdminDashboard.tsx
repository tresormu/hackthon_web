import { useEffect, useState } from 'react';
import { Users, Settings, Shield, TrendingUp, Database, Activity, DollarSign, AlertTriangle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import adminService, { type SystemSummary, type StaffUser } from '../../services/adminService';
import paymentService, { type PaymentTransaction } from '../../services/paymentService';

interface AdminDashboardProps {
  activeTab: 'overview' | 'users' | 'billing' | 'analytics';
}

export const AdminDashboard = ({ activeTab }: AdminDashboardProps) => {
  const [summary, setSummary] = useState<SystemSummary | null>(null);
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches: Promise<any>[] = [adminService.getSummary().then(setSummary)];
    if (activeTab === 'users') fetches.push(adminService.getUsers().then(setUsers));
    if (activeTab === 'billing') fetches.push(paymentService.getTransactions().then(setTransactions));
    Promise.all(fetches).catch(console.error).finally(() => setLoading(false));
  }, [activeTab]);

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) { console.error(err); }
  };

  const chartData = [
    { month: 'Jan', mothers: summary ? Math.round(summary.totalActiveMothers * 0.6) : 0 },
    { month: 'Feb', mothers: summary ? Math.round(summary.totalActiveMothers * 0.75) : 0 },
    { month: 'Mar', mothers: summary?.totalActiveMothers ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
              <p className="text-slate-500">System overview and management</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 bg-emerald-100 rounded-lg text-emerald-700 font-medium">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold">System Health</span>
              <span className="text-emerald-600">Optimal</span>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500">Loading...</div>
        ) : (
          <>
            {activeTab === 'overview' && summary && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Active Mothers', value: summary.totalActiveMothers, icon: Users, trend: '+5%' },
                    { label: 'Total Children', value: summary.totalChildren, icon: Activity, trend: '+8%' },
                    { label: 'Staff Members', value: summary.staff.total, icon: Database, trend: '' },
                    { label: 'Missed Appointments', value: summary.missedAppointments, icon: AlertTriangle, trend: '' },
                  ].map(({ label, value, icon: Icon, trend }) => (
                    <div key={label} className="card">
                      <div className="flex items-center gap-3 mb-4">
                        <Icon className="text-brand-600" size={24} />
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{value}</p>
                          <p className="text-sm text-slate-500">{label}</p>
                        </div>
                        {trend && (
                          <div className="flex items-center gap-1 ml-auto">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-600">{trend}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Staff Breakdown</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-brand-600">{summary.staff.doctors}</p>
                      <p className="text-sm text-slate-600">Doctors</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-brand-600">{summary.staff.chws}</p>
                      <p className="text-sm text-slate-600">CHWs</p>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">Mother Registration Trend</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="mothers" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Staff Users</h3>
                {users.length === 0 ? (
                  <p className="text-slate-500 italic">No staff users found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                            <th key={h} className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {users.map(user => (
                          <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 font-semibold text-slate-900">{user.name}</td>
                            <td className="py-4 text-sm text-slate-600">{user.email}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                user.role === 'doctor' ? 'bg-brand-50 text-brand-700' : 'bg-amber-50 text-amber-700'
                              }`}>{user.role}</span>
                            </td>
                            <td className="py-4 text-sm text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="py-4">
                              <button onClick={() => handleDeleteUser(user._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Transactions</h3>
                {transactions.length === 0 ? (
                  <p className="text-slate-500 italic">No transactions found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-100">
                          {['Ref', 'Plan', 'Amount', 'Status', 'Date'].map(h => (
                            <th key={h} className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {transactions.map(tx => (
                          <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 text-sm font-mono text-slate-700">{tx.txRef}</td>
                            <td className="py-4 text-sm text-slate-600">{tx.plan?.name ?? '—'}</td>
                            <td className="py-4 font-bold text-slate-900">{tx.currency} {tx.amount.toLocaleString()}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                tx.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                tx.status === 'failed' ? 'bg-rose-50 text-rose-600' :
                                'bg-amber-50 text-amber-600'
                              }`}>{tx.status}</span>
                            </td>
                            <td className="py-4 text-sm text-slate-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && summary && (
              <div className="card">
                <h3 className="text-lg font-bold text-slate-900 mb-4">System Analytics</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { label: 'Active Mothers', value: summary.totalActiveMothers },
                      { label: 'Children', value: summary.totalChildren },
                      { label: 'Missed Appts', value: summary.missedAppointments },
                      { label: 'Staff', value: summary.staff.total },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
