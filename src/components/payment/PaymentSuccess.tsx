import { CheckCircle, Calendar, Users, Shield, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PaymentPlan } from '../../types/payment';

interface PaymentSuccessProps {
  plan: PaymentPlan;
  billingCycle: 'monthly' | 'yearly';
  onContinue: () => void;
}

export const PaymentSuccess = ({ plan, billingCycle, onContinue }: PaymentSuccessProps) => {
  const features = [
    {
      icon: <Users size={20} />,
      title: `${plan.maxPatients === Infinity ? 'Unlimited' : plan.maxPatients} Patients`,
      description: 'Manage your patient database efficiently'
    },
    {
      icon: <Calendar size={20} />,
      title: 'Smart Scheduling',
      description: 'Automated appointments and reminders'
    },
    {
      icon: <Shield size={20} />,
      title: 'HIPAA Compliant',
      description: 'Secure and compliant data storage'
    },
    {
      icon: <Headphones size={20} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
        <p className="text-lg text-slate-600 mb-2">
          Welcome to MamaCare+ <span className="font-semibold">{plan.name}</span> Plan
        </p>
        <p className="text-slate-600">
          Your {billingCycle} subscription is now active
        </p>
      </motion.div>

      {/* Plan Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Your Plan Details</h3>
          <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {plan.name}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <p className="text-slate-600">Billing Cycle</p>
            <p className="font-semibold text-slate-900 capitalize">{billingCycle}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-slate-600">Monthly Cost</p>
            <p className="font-semibold text-slate-900">${plan.price}</p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-slate-600">Patient Limit</p>
            <p className="font-semibold text-slate-900">
              {plan.maxPatients === Infinity ? 'Unlimited' : plan.maxPatients}
            </p>
          </div>
          <div className="bg-white rounded-lg p-3">
            <p className="text-slate-600">Next Billing</p>
            <p className="font-semibold text-slate-900">
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Features Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">What's Included</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {feature.icon}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">{feature.title}</p>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-slate-50 rounded-2xl p-6 mb-8"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Next Steps</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
            <span className="text-slate-700">Account setup completed</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle size={16} className="text-white" />
            </div>
            <span className="text-slate-700">Payment processed successfully</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <span className="text-slate-700">Set up your dashboard and start adding patients</span>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={onContinue}
          className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition-all transform hover:scale-105"
        >
          Go to Dashboard
        </button>
        <p className="text-sm text-slate-600 mt-4">
          You can manage your subscription anytime from Settings → Billing
        </p>
      </motion.div>
    </div>
  );
};
