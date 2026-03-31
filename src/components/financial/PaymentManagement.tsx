import { useState } from 'react';
import { CreditCard, Plus, Trash2, Check, AlertCircle, Calendar, DollarSign, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PaymentMethod, BillingHistory } from '../../types/payment';

interface PaymentManagementProps {
  onManageSubscription?: () => void;
}

export const PaymentManagementComponent = ({ onManageSubscription }: PaymentManagementProps) => {
  const [activeTab, setActiveTab] = useState<'payment-methods' | 'billing' | 'plans'>('payment-methods');
  const [isAddingMethod, setIsAddingMethod] = useState(false);

  // Mock payment methods data - matching the PaymentMethod interface
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pm_1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025
    },
    {
      id: 'pm_2', 
      type: 'card',
      brand: 'Mastercard',
      last4: '8888',
      expMonth: 8,
      expYear: 2024
    }
  ];

  // Mock billing history
  const billingHistory: BillingHistory[] = [
    {
      id: 'inv_1',
      date: new Date('2024-03-15'),
      amount: 99,
      status: 'succeeded',
      description: 'Professional Plan - Monthly',
      invoiceUrl: '/invoices/inv_1.pdf'
    },
    {
      id: 'inv_2',
      date: new Date('2024-02-15'),
      amount: 99,
      status: 'succeeded',
      description: 'Professional Plan - Monthly',
      invoiceUrl: '/invoices/inv_2.pdf'
    },
    {
      id: 'inv_3',
      date: new Date('2024-01-15'),
      amount: 99,
      status: 'succeeded',
      description: 'Professional Plan - Monthly',
      invoiceUrl: '/invoices/inv_3.pdf'
    }
  ];

  // Mock current plan
  const currentPlan = {
    name: 'Professional',
    price: 99,
    billingCycle: 'monthly' as const,
    maxPatients: 200,
    features: [
      'Up to 200 patients',
      'Advanced analytics',
      'Priority support',
      'Custom integrations'
    ]
  };

  const getPaymentIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa': return '💳';
      case 'mastercard': return '💳';
      default: return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-emerald-100 text-emerald-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

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
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment Management</h1>
              <p className="text-slate-500">Manage payment methods, billing, and subscription</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 bg-emerald-100 rounded-lg text-emerald-700 font-medium">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold">Active Plan</span>
              <span className="text-emerald-600">{currentPlan.name}</span>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['payment-methods', 'billing', 'plans'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-brand-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'payment-methods' && 'Payment Methods'}
              {tab === 'billing' && 'Billing History'}
              {tab === 'plans' && 'Subscription Plans'}
            </button>
          ))}
        </div>

        {/* Payment Methods Tab */}
        {activeTab === 'payment-methods' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Payment Methods</h3>
                <button
                  onClick={() => setIsAddingMethod(true)}
                  className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                        {getPaymentIcon(method.brand)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">
                          {method.brand} •••• {method.last4}
                        </p>
                        <p className="text-sm text-slate-600">
                          Expires {method.expMonth}/{method.expYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="text-slate-600 hover:text-slate-700 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {isAddingMethod && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200"
                >
                  <div className="text-center">
                    <CreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h4 className="font-semibold text-slate-900 mb-2">Add Payment Method</h4>
                    <p className="text-sm text-slate-600 mb-4">
                      Secure payment form would appear here
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setIsAddingMethod(false)}
                        className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300"
                      >
                        Cancel
                      </button>
                      <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700">
                        Add Method
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        {/* Billing History Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Billing History</h3>
                <span className="text-sm text-slate-500">{billingHistory.length} transactions</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {billingHistory.map((invoice, index) => (
                      <motion.tr
                        key={invoice.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {invoice.date.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {invoice.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                          ${invoice.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {invoice.invoiceUrl && (
                            <button className="text-brand-600 hover:text-brand-700 font-medium">
                              View Invoice
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}

        {/* Subscription Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
            >
              <div className="text-center mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Current Subscription</h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-lg">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-700">{currentPlan.name} Plan</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 border-2 border-emerald-500 rounded-xl bg-emerald-50">
                  <div className="text-center mb-6">
                    <h4 className="text-xl font-bold text-slate-900 mb-2">{currentPlan.name}</h4>
                    <p className="text-3xl font-bold text-slate-900">${currentPlan.price}</p>
                    <p className="text-sm text-slate-600">per {currentPlan.billingCycle}</p>
                  </div>
                  <ul className="space-y-3">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-slate-600 mb-4">
                  Need to change your plan? Contact support or upgrade/downgrade anytime.
                </p>
                <button 
                  onClick={onManageSubscription}
                  className="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700"
                >
                  Manage Subscription
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};
