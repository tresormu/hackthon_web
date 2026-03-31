import { useState, useMemo } from 'react';
import { Search, Download, Filter, Eye, Calendar, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FinancialRecord, Invoice } from '../../types/financial';
import { formatFinancialDate, getPaymentTypeIcon, exportToCSV, downloadCSV, getInvoiceStatusColor } from '../../utils/financialHelpers';

export const FinancialRecordsComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'payment' | 'refund' | 'credit' | 'charge'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [dateRange, setDateRange] = useState<'30' | '90' | '365' | 'all'>('30');

  // Mock data
  const mockRecords: FinancialRecord[] = [
    {
      id: '1',
      date: new Date('2024-03-15'),
      type: 'payment',
      amount: 99,
      description: 'Professional Plan - Monthly',
      status: 'completed',
      method: 'Credit Card ending in 4242',
      invoiceUrl: '/invoices/INV-2024-001.pdf'
    },
    {
      id: '2',
      date: new Date('2024-02-15'),
      type: 'payment',
      amount: 99,
      description: 'Professional Plan - Monthly',
      status: 'completed',
      method: 'Credit Card ending in 4242',
      invoiceUrl: '/invoices/INV-2024-002.pdf'
    },
    {
      id: '3',
      date: new Date('2024-01-15'),
      type: 'payment',
      amount: 99,
      description: 'Professional Plan - Monthly',
      status: 'completed',
      method: 'Credit Card ending in 4242',
      invoiceUrl: '/invoices/INV-2024-003.pdf'
    },
    {
      id: '4',
      date: new Date('2024-01-10'),
      type: 'credit',
      amount: -20,
      description: 'New Year Promotion Credit',
      status: 'completed',
      method: 'Account Credit'
    }
  ];

  const mockInvoices: Invoice[] = [
    {
      id: 'INV-2024-001',
      date: new Date('2024-03-15'),
      amount: 99,
      status: 'paid',
      dueDate: new Date('2024-03-15'),
      planName: 'Professional',
      billingCycle: 'monthly',
      downloadUrl: '/invoices/INV-2024-001.pdf'
    },
    {
      id: 'INV-2024-002',
      date: new Date('2024-02-15'),
      amount: 99,
      status: 'paid',
      dueDate: new Date('2024-02-15'),
      planName: 'Professional',
      billingCycle: 'monthly',
      downloadUrl: '/invoices/INV-2024-002.pdf'
    }
  ];

  const filteredRecords = useMemo(() => {
    return mockRecords.filter(record => {
      const matchesSearch = record.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || record.type === filterType;
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      
      const recordDate = new Date(record.date);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
      const matchesDateRange = dateRange === 'all' || daysDiff <= parseInt(dateRange);
      
      return matchesSearch && matchesType && matchesStatus && matchesDateRange;
    });
  }, [searchQuery, filterType, filterStatus, dateRange]);

  const handleExport = () => {
    const csvData = exportToCSV(filteredRecords);
    downloadCSV(csvData, `financial-records-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Records</h2>
          <p className="text-slate-500 mt-1">Transaction history and billing information</p>
        </div>
        <button
          onClick={handleExport}
          className="btn-primary flex items-center gap-2"
        >
          <Download size={18} />
          Export CSV
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="input pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Type</label>
            <select
              className="input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
            >
              <option value="all">All Types</option>
              <option value="payment">Payments</option>
              <option value="refund">Refunds</option>
              <option value="credit">Credits</option>
              <option value="charge">Charges</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
            <select
              className="input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date Range</label>
            <select
              className="input"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
            >
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="365">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
          <span className="text-sm text-slate-500">{filteredRecords.length} transactions</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
                <th className="text-center py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record, index) => (
                <motion.tr
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      <span className="text-sm text-slate-900">{formatFinancialDate(record.date)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getPaymentTypeIcon(record.type)}</span>
                      <span className="text-sm font-medium text-slate-900 capitalize">{record.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-slate-900">{record.description}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className={`text-sm font-bold ${
                      record.amount < 0 ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {record.amount < 0 ? '+' : ''}${Math.abs(record.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      record.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                      record.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-slate-600">{record.method}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    {record.invoiceUrl && (
                      <button className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1 mx-auto">
                        <Eye size={14} />
                        View
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Invoices Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Recent Invoices</h3>
          <span className="text-sm text-slate-500">{mockInvoices.length} invoices</span>
        </div>
        
        <div className="space-y-4">
          {mockInvoices.map((invoice, index) => (
            <motion.div
              key={invoice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getInvoiceStatusColor(invoice.status)}`}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{invoice.id}</p>
                  <p className="text-sm text-slate-600">{formatFinancialDate(invoice.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-slate-900">${invoice.amount}</p>
                  <p className="text-xs text-slate-500">{invoice.billingCycle}</p>
                </div>
                {invoice.downloadUrl && (
                  <button className="text-brand-600 hover:text-brand-700 p-2 rounded-lg hover:bg-brand-50 transition-colors">
                    <Download size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
