import { useEffect, useState } from 'react';
import { Check, Stethoscope, Shield, Users, Zap, Headphones, ExternalLink, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import paymentService, { type PaymentPlan } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

interface RegistrationPaymentFlowProps {
  onSkip: () => void; // allow entering dashboard without paying (optional)
}

export const RegistrationPaymentFlow = ({ onSkip }: RegistrationPaymentFlowProps) => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    paymentService.getPlans()
      .then(setPlans)
      .catch(() => setError('Failed to load plans. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPlan = async (plan: PaymentPlan) => {
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

  const PLAN_ICONS: Record<string, React.ReactNode> = {
    'health-center': <Users size={22} />,
    'district-hospital': <Stethoscope size={22} />,
    'referral-hospital': <Shield size={22} />,
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-brand-50 to-white overflow-y-auto">
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-brand-600 p-2 rounded-xl">
                <Stethoscope className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">MamaCare<span className="text-brand-600">+</span></h1>
            </div>
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              <Check size={14} /> Account created for {user?.hospitalName ?? user?.name}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose Your Plan</h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Select a subscription plan to activate your dashboard. You'll be redirected to our secure payment provider.
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Plans */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="animate-spin text-brand-500" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {plans.map((plan, i) => (
                <motion.div key={plan._id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={`relative rounded-2xl p-6 shadow-md border transition-all hover:shadow-xl hover:scale-[1.02] ${
                    plan.slug === 'district-hospital'
                      ? 'bg-brand-600 text-white border-brand-500 ring-4 ring-brand-200'
                      : 'bg-white text-slate-900 border-slate-100'
                  }`}
                >
                  {plan.slug === 'district-hospital' && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold">Most Popular</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl ${plan.slug === 'district-hospital' ? 'bg-white/20' : 'bg-brand-50'}`}>
                      {PLAN_ICONS[plan.slug] ?? <Stethoscope size={22} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <p className={`text-xs ${plan.slug === 'district-hospital' ? 'text-white/70' : 'text-slate-500'}`}>
                        {plan.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <span className="text-3xl font-black">
                      {plan.currency} {plan.price.toLocaleString()}
                    </span>
                    <span className={`text-sm ml-1 ${plan.slug === 'district-hospital' ? 'text-white/70' : 'text-slate-500'}`}>/month</span>
                    <p className={`text-xs mt-1 ${plan.slug === 'district-hospital' ? 'text-white/70' : 'text-slate-500'}`}>
                      {plan.maxActiveMothers ? `Up to ${plan.maxActiveMothers} mothers` : 'Unlimited mothers'}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm">
                        <Check size={14} className={`mt-0.5 flex-shrink-0 ${plan.slug === 'district-hospital' ? 'text-white' : 'text-brand-500'}`} />
                        <span className={plan.slug === 'district-hospital' ? 'text-white/90' : 'text-slate-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={checkoutLoading === plan._id}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${
                      plan.slug === 'district-hospital'
                        ? 'bg-white text-brand-600 hover:bg-slate-50'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    {checkoutLoading === plan._id
                      ? <><Loader size={16} className="animate-spin" /> Redirecting...</>
                      : <><ExternalLink size={16} /> Subscribe & Pay</>
                    }
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Trust + Skip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1"><Shield size={13} /> Secured by Flutterwave</div>
              <div className="flex items-center gap-1"><Headphones size={13} /> 24/7 support</div>
              <div className="flex items-center gap-1"><Zap size={13} /> Cancel anytime</div>
            </div>
            <button onClick={onSkip} className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors">
              Skip for now — explore dashboard first
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
