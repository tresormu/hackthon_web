import { useState } from 'react';
import { Users, Settings, Shield, TrendingUp, Database, Activity, DollarSign, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  activeTab: 'overview' | 'users' | 'billing' | 'analytics';
}

export const AdminDashboard = ({ activeTab }: AdminDashboardProps) => {

  const systemMetrics = {
    totalUsers: 1248,
    activeUsers: 892,
    totalRevenue: '$48,750',
    systemHealth: 'Optimal',
    storageUsed: '2.3TB',
    lastBackup: '2 hours ago'
  };

  const recentActivity = [
    { id: '1', user: 'Dr. Smith', action: 'Patient registration', time: '10:30 AM' },
    { id: '2', user: 'Nurse Johnson', action: 'Data export', time: '9:45 AM' },
    { id: '3', user: 'Admin Davis', action: 'System update', time: '8:15 AM' }
  ];

  const userGrowthData = [
    { month: 'Jan', users: 45, revenue: 12500 },
    { month: 'Feb', users: 52, revenue: 14200 },
    { month: 'Mar', users: 61, revenue: 15800 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
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

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['overview', 'users', 'billing', 'analytics'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-brand-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'overview' && 'System Overview'}
              {tab === 'users' && 'User Management'}
              {tab === 'billing' && 'Billing & Payments'}
              {tab === 'analytics' && 'Analytics & Reports'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="text-brand-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{systemMetrics.totalUsers}</p>
                    <p className="text-sm text-slate-500">Total Users</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600">+5%</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="text-brand-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{systemMetrics.totalRevenue}</p>
                    <p className="text-sm text-slate-500">Total Revenue</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-600">+12%</span>
                  </div>
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="text-slate-600" size={24} />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{systemMetrics.storageUsed}</p>
                    <p className="text-sm text-slate-500">Storage Used</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-600">{systemMetrics.lastBackup}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Recent System Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-100 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-brand-50 text-white flex items-center justify-center">
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                        <p className="text-xs text-slate-500">{activity.user}</p>
                        <p className="text-xs text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm text-slate-600">{activity.id}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">User Growth Trend</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="revenue" fill="#ec4899" />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* User Management */}
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">User Management</h3>
              <p className="text-slate-500">Manage user accounts and permissions</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="card">
                  <h4 className="text-md font-semibold text-slate-900 mb-2">Quick Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Add New User</span>
                    </button>
                    <button className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span>Manage Roles</span>
                    </button>
                    <button className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 flex items-center justify-center gap-2">
                      <Database className="w-4 h-4" />
                      <span>Export Data</span>
                    </button>
                  </div>
                </div>
                <div className="card">
                  <h4 className="text-md font-semibold text-slate-900 mb-2">User Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-brand-600">{systemMetrics.activeUsers}</p>
                      <p className="text-sm text-slate-600">Active Users</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-600">{systemMetrics.totalRevenue}</p>
                      <p className="text-sm text-slate-600">Total Revenue</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Billing Overview */}
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Billing Overview</h3>
              <p className="text-slate-500">Subscription management and revenue tracking</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <DollarSign className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.totalRevenue}</p>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                </div>
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{systemMetrics.totalUsers}</p>
                  <p className="text-sm text-slate-600">Total Users</p>
                </div>
                <div className="text-center p-6 bg-slate-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-600">+12%</p>
                  <p className="text-sm text-slate-600">Growth Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Dashboard */}
            <div className="card">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Analytics Dashboard</h3>
              <p className="text-slate-500">Comprehensive insights and reports</p>
              <div className="h-[400px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="users" fill="#3b82f6" />
                    <Bar dataKey="revenue" fill="#ec4899" />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
