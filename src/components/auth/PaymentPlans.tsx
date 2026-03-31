import { useState } from 'react';
import { Check, ChevronRight, Stethoscope, Users, Shield, Headphones, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { PLANS, getAdjustedPrice } from '../../utils/paymentHelpers';
import type { PaymentPlan } from '../../types/payment';

const getIconForPlan = (planId: string) => {
  switch (planId) {
    case 'starter': return <Users size={24} />;
    case 'professional': return <Stethoscope size={24} />;
    case 'enterprise': return <Shield size={24} />;
    default: return <Users size={24} />;
  }
};

interface PaymentPlansProps {
  onSelectPlan: (plan: PaymentPlan) => void;
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
}

export const PaymentPlans = ({ onSelectPlan, billingCycle, onBillingCycleChange }: PaymentPlansProps) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const plansWithIcons = PLANS.map(plan => ({
    ...plan,
    icon: getIconForPlan(plan.id)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center p-2">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-brand-600 p-2 rounded-xl">
              <Stethoscope className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">MamaCare<span className="text-brand-600">+</span></h1>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Choose Your Plan</h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Select the perfect plan for your practice. All plans include our core maternal health features.
          </p>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="bg-white rounded-full p-1 shadow-sm border border-slate-200">
            <button
              onClick={() => onBillingCycleChange('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly' 
                  ? 'bg-brand-600 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => onBillingCycleChange('yearly')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all relative ${
                billingCycle === 'yearly' 
                  ? 'bg-brand-600 text-white' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plansWithIcons.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className={`relative rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl ${
                plan.popular 
                  ? 'bg-brand-600 text-white shadow-lg ring-4 ring-brand-200' 
                  : 'bg-white text-slate-900 shadow-md border border-slate-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-4">
                <div className={`p-2 rounded-lg ${plan.popular ? 'bg-white/20' : 'bg-brand-50'}`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className={`text-xs ${plan.popular ? 'text-white/80' : 'text-slate-600'}`}>
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">${getAdjustedPrice(plan, billingCycle)}</span>
                  <span className={`text-xs ${plan.popular ? 'text-white/80' : 'text-slate-600'}`}>
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className={`text-xs mt-1 ${plan.popular ? 'text-white/80' : 'text-slate-600'}`}>
                    Billed annually (save ${plan.price * 2})
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      plan.popular ? 'text-white' : 'text-brand-600'
                    }`} />
                    <span className={`text-xs ${plan.popular ? 'text-white/90' : 'text-slate-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  setSelectedPlanId(plan.id);
                  onSelectPlan(plan);
                }}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  plan.popular
                    ? 'bg-white text-brand-600 hover:bg-slate-50'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                } ${selectedPlanId === plan.id ? 'ring-2 ring-offset-2 ring-brand-500' : ''}`}
              >
                {selectedPlanId === plan.id ? 'Selected' : 'Choose Plan'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Shield size={14} />
              <span>30-day money back</span>
            </div>
            <div className="flex items-center gap-1">
              <Headphones size={14} />
              <span>24/7 support</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={14} />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
