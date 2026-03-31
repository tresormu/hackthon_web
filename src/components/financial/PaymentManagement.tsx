import { useEffect, useState } from 'react';
import { Check, Shield, ExternalLink, AlertTriangle, CheckCircle, Clock, RefreshCw, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import paymentService, { type PaymentPlan, type PaymentTransaction, type Subscription } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

export const PaymentManagementComponent = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'billing' | 'plans'>('overview');
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      paymentService.getSubscription(),
      paymentService.getTransactions(),
      paymentService.getPlans(),
    ]).then(([sub, txs, pls]) => {
      setSubscription(sub);
      setTransactions(txs);
      setPlans(pls);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (plan: PaymentPlan) => {
    setCheckoutLoading(plan._id);
    setError('');
    try {
      const { paymentUrl, txRef } = await paymentService.createCheckout({
        planId: plan._id,
        hospitalName: user?.hospitalName ?? user?.name,
        contactEmail: user?.email,
        callbackUrl: window.location.origin,
      });
      sessionStorage.setItem('pending_txRef', txRef);
      sessionStorage.setItem('pending_planName', plan.name);
      window.location.href = paymentUrl;
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to create checkout. Please try again.');
      setCheckoutLoading(null);
    }
  };

  const isExpiringSoon = subscription?.active && (subscription.daysLeft ?? 0) <= 7;
  const isExpired = subscription && !subscription.active;

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader className="animate-spin text-brand-500" size={32} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Payment & Subscription</h2>
          <p className="text-slate-500 mt-1">Manage your plan, billing history, and renewals.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-medium text-slate-600">Secured by Flutterwave</span>
        </div>
      </motion.div>

      {/* Expiry banner */}
      {(isExpiringSoon || isExpired) && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`flex items-start gap-4 p-5 rounded-2xl border ${
            isExpired
              ? 'bg-rose-50 border-rose-200'
              : 'bg-amber-50 border-amber-200'
          }`}
        >
          <AlertTriangle className={`flex-shrink-0 mt-0.5 ${isExpired ? 'text-rose-500' : 'text-amber-500'}`} size={22} />
          <div className="flex-1">
            <p className={`font-bold text-sm ${isExpired ? 'text-rose-800' : 'text-amber-800'}`}>
              {isExpired
                ? 'Your subscription has expired'
                : `Your subscription expires in ${subscription?.daysLeft} day${subscription?.daysLeft === 1 ? '' : 's'}`}
            </p>
            <p className={`text-xs mt-1 ${isExpired ? 'text-rose-600' : 'text-amber-600'}`}>
              {isExpired
                ? 'Renew now to continue accessing all features and managing your patients.'
                : 'Renew early to avoid any interruption to your service.'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              isExpired
                ? 'bg-rose-600 text-white hover:bg-rose-700'
                : 'bg-amber-500 text-white hover:bg-amber-600'
            }`}
          >
            <RefreshCw size={14} /> Renew Now
          </button>
        </motion.div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {(['overview', 'billing', 'plans'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
              activeTab === tab ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'overview' ? 'Current Plan' : tab === 'billing' ? 'Billing History' : 'Change Plan'}
          </button>
        ))}
      </div>

      {/* Current Plan Overview */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {!subscription?.active ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-slate-400" size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Subscription</h3>
              <p className="text-slate-500 text-sm mb-6">Choose a plan to unlock all features and start managing your patients.</p>
              <button onClick={() => setActiveTab('plans')}
                className="btn-primary px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2">
                <ExternalLink size={16} /> View Plans
              </button>
            </div>
          ) : (
            <div className="card">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="text-emerald-500" size={20} />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Subscription</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{subscription.subscription?.plan?.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{subscription.subscription?.plan?.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-slate-900">
                    {subscription.subscription?.currency} {subscription.subscription?.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">per month</p>
                </div>
              </div>

              {/* Expiry progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                  <span className="flex items-center gap-1"><Clock size={12} /> Subscription Period</span>
                  <span className={subscription.daysLeft <= 7 ? 'text-rose-600' : 'text-slate-600'}>
                    {subscription.daysLeft} days remaining
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      subscription.daysLeft <= 7 ? 'bg-rose-500' :
                      subscription.daysLeft <= 14 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((subscription.daysLeft / 30) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Paid: {new Date(subscription.subscription!.paidAt).toLocaleDateString()}</span>
                  <span>Expires: {new Date(subscription.expiresAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Plan features */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {subscription.subscription?.plan?.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={14} className="text-emerald-500 flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setActiveTab('plans')}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <RefreshCw size={16} /> Renew / Change Plan
                </button>
                <button onClick={() => setActiveTab('billing')}
                  className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors">
                  View Billing History
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Billing History */}
      {activeTab === 'billing' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Billing History</h3>
            <span className="text-sm text-slate-500">{transactions.length} transactions</span>
          </div>
          {transactions.length === 0 ? (
            <p className="text-slate-500 italic py-8 text-center">No transactions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-100">
                  <tr>
                    {['Date', 'Plan', 'Amount', 'Status', 'Expires', 'Ref'].map(h => (
                      <th key={h} className="pb-3 px-2 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {transactions.map((tx, i) => {
                    const expiresAt = tx.paidAt ? new Date(new Date(tx.paidAt).getTime() + 30 * 24 * 60 * 60 * 1000) : null;
                    return (
                      <motion.tr key={tx._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: 0.04 * i }} className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-2 text-sm text-slate-600">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-2 text-sm font-medium text-slate-900">{tx.plan?.name ?? '—'}</td>
                        <td className="py-4 px-2 text-sm font-bold text-slate-900">{tx.currency} {tx.amount.toLocaleString()}</td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                            tx.status === 'failed' ? 'bg-rose-50 text-rose-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>{tx.status}</span>
                        </td>
                        <td className="py-4 px-2 text-sm text-slate-500">
                          {expiresAt ? expiresAt.toLocaleDateString() : '—'}
                        </td>
                        <td className="py-4 px-2 text-xs font-mono text-slate-400">{tx.txRef}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* Plans */}
      {activeTab === 'plans' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => {
              const isCurrent = subscription?.subscription?.plan?._id === plan._id && subscription.active;
              return (
                <motion.div key={plan._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className={`card flex flex-col relative ${
                    plan.slug === 'district-hospital' ? 'ring-2 ring-brand-400' : ''
                  }`}
                >
                  {plan.slug === 'district-hospital' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-brand-600 text-white px-3 py-0.5 rounded-full text-xs font-bold">Most Popular</span>
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-emerald-500 text-white px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle size={10} /> Current
                      </span>
                    </div>
                  )}
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h4>
                    <p className="text-sm text-slate-500">{plan.description}</p>
                  </div>
                  <div className="mb-5">
                    <span className="text-3xl font-black text-slate-900">{plan.currency} {plan.price.toLocaleString()}</span>
                    <span className="text-sm text-slate-400">/month</span>
                    <p className="text-xs text-slate-400 mt-1">
                      {plan.maxActiveMothers ? `Up to ${plan.maxActiveMothers} mothers` : 'Unlimited mothers'}
                    </p>
                  </div>
                  <ul className="space-y-2 flex-1 mb-6">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check size={14} className="text-emerald-500 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={checkoutLoading === plan._id}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 ${
                      isCurrent
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    {checkoutLoading === plan._id
                      ? <><Loader size={14} className="animate-spin" /> Redirecting...</>
                      : isCurrent
                        ? <><RefreshCw size={14} /> Renew Plan</>
                        : <><ExternalLink size={14} /> Subscribe</>
                    }
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
