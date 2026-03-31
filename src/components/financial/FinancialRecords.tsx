import { useEffect, useState, useCallback } from 'react';
import { Search, Download, Calendar, TrendingUp, DollarSign, Clock, XCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import financialService, { type FinancialRecord, type FinancialRecordsParams } from '../../services/financialService';
import { downloadCSV } from '../../utils/financialHelpers';

const STATUS_STYLES: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-600',
  pending: 'bg-amber-50 text-amber-600',
  failed: 'bg-rose-50 text-rose-600',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  completed: <CheckCircle size={14} />,
  pending: <Clock size={14} />,
  failed: <XCircle size={14} />,
};

export const FinancialRecordsComponent = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<FinancialRecordsParams>({
    status: undefined,
    from: '',
    to: '',
    limit: 20,
  });
  const [search, setSearch] = useState('');

  const fetchRecords = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params: FinancialRecordsParams = { ...filters, page: p };
      if (!params.from) delete params.from;
      if (!params.to) delete params.to;
      if (!params.status) delete params.status;
      const res = await financialService.getRecords(params);
      setRecords(res.data);
      setTotal(res.total);
      setTotalRevenue(res.totalRevenue);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchRecords(1); }, [fetchRecords]);

  const filtered = records.filter(r =>
    r.txRef.toLowerCase().includes(search.toLowerCase()) ||
    (r.plan?.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (r.user?.name ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const rows = filtered.map(r => [
      new Date(r.createdAt).toLocaleDateString(),
      r.txRef,
      r.plan?.name ?? '',
      r.user?.name ?? '',
      `${r.currency} ${r.amount}`,
      r.status,
    ].join(','));
    const csv = ['Date,Ref,Plan,User,Amount,Status', ...rows].join('\n');
    downloadCSV(csv, `financial-records-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const totalPages = Math.ceil(total / (filters.limit ?? 20));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Records</h2>
          <p className="text-slate-500 mt-1">Complete transaction history with filters and export.</p>
        </div>
        <button onClick={handleExport} className="btn-primary flex items-center gap-2">
          <Download size={18} /> Export CSV
        </button>
      </motion.div>

      {/* Summary strip */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {[
          { label: 'Total Revenue (completed)', value: `RWF ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Total Transactions', value: total, icon: TrendingUp, color: 'text-brand-600 bg-brand-50' },
          { label: 'Showing', value: `${filtered.length} records`, icon: Calendar, color: 'text-slate-600 bg-slate-100' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${color}`}><Icon size={22} /></div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
              <p className="text-xl font-bold text-slate-900">{value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Search ref, plan, user..." className="input pl-10"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input" value={filters.status ?? ''}
            onChange={e => setFilters(f => ({ ...f, status: (e.target.value || undefined) as any }))}>
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">From</label>
            <input type="date" className="input" value={filters.from ?? ''}
              onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">To</label>
            <input type="date" className="input" value={filters.to ?? ''}
              onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
          <span className="text-sm text-slate-500">{filtered.length} of {total} records</span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">Loading records...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 italic">No transactions found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Date', 'Reference', 'Plan', 'User', 'Amount', 'Status', 'Paid At'].map(h => (
                      <th key={h} className="pb-3 px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((record, i) => (
                    <motion.tr key={record._id}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.03 * i }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-2 text-sm text-slate-600">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2 text-xs font-mono text-slate-700">{record.txRef}</td>
                      <td className="py-4 px-2 text-sm text-slate-900">{record.plan?.name ?? '—'}</td>
                      <td className="py-4 px-2 text-sm text-slate-600">{record.user?.name ?? '—'}</td>
                      <td className="py-4 px-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {record.currency} {record.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[record.status]}`}>
                          {STATUS_ICONS[record.status]} {record.status}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-sm text-slate-500">
                        {record.paidAt ? new Date(record.paidAt).toLocaleDateString() : '—'}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => fetchRecords(page - 1)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
                  Previous
                </button>
                <button disabled={page >= totalPages} onClick={() => fetchRecords(page + 1)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
