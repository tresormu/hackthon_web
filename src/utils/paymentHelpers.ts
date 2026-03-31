import type { PaymentPlan, UserSubscription } from '../types/payment';

export const PLANS: PaymentPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    billing: 'monthly',
    icon: null, // Will be set in component
    description: 'Perfect for small practices',
    features: [
      'Up to 50 patients',
      'Basic appointment scheduling',
      'Patient records management',
      'Email support',
      'Mobile app access'
    ],
    maxPatients: 50,
    tier: 'starter'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    billing: 'monthly',
    popular: true,
    icon: null,
    description: 'Ideal for growing practices',
    features: [
      'Up to 200 patients',
      'Advanced scheduling',
      'Automated reminders',
      'CHW coordination',
      'Priority support',
      'Analytics dashboard',
      'Custom forms'
    ],
    maxPatients: 200,
    tier: 'professional'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    billing: 'monthly',
    icon: null,
    description: 'For large healthcare organizations',
    features: [
      'Unlimited patients',
      'Advanced analytics',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'HIPAA compliance tools',
      'Training sessions',
      'White-label options'
    ],
    maxPatients: Infinity,
    tier: 'enterprise'
  }
];

export const getPlanById = (planId: string): PaymentPlan | undefined => {
  return PLANS.find(plan => plan.id === planId);
};

export const getAdjustedPrice = (plan: PaymentPlan, billingCycle: 'monthly' | 'yearly'): number => {
  if (billingCycle === 'yearly') {
    return Math.floor(plan.price * 10); // 2 months free
  }
  return plan.price;
};

export const canAccessFeature = (userPlan: PaymentPlan | null, feature: string): boolean => {
  if (!userPlan) return false;
  
  const featureMap = {
    starter: ['basic_scheduling', 'patient_records', 'email_support', 'mobile_app'],
    professional: ['basic_scheduling', 'patient_records', 'email_support', 'mobile_app', 'advanced_scheduling', 'automated_reminders', 'chw_coordination', 'priority_support', 'analytics', 'custom_forms'],
    enterprise: ['basic_scheduling', 'patient_records', 'email_support', 'mobile_app', 'advanced_scheduling', 'automated_reminders', 'chw_coordination', 'priority_support', 'analytics', 'custom_forms', 'api_access', 'dedicated_support', 'hipaa_tools', 'training', 'white_label']
  };
  
  return featureMap[userPlan.tier]?.includes(feature) || false;
};

export const getPatientLimit = (userPlan: PaymentPlan | null): number => {
  return userPlan?.maxPatients || 0;
};

export const isSubscriptionActive = (subscription: UserSubscription | null): boolean => {
  if (!subscription) return false;
  return subscription.status === 'active' || subscription.status === 'trialing';
};

export const formatPrice = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const getTrialDays = (subscription: UserSubscription | null): number => {
  if (!subscription?.trialEnd) return 0;
  const now = new Date();
  const trialEnd = new Date(subscription.trialEnd);
  const diffTime = Math.abs(trialEnd.getTime() - now.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Mock functions for demo purposes
export const createSubscription = async (planId: string, paymentMethodId: string): Promise<UserSubscription> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    planId,
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    cancelAtPeriodEnd: false,
  };
};

export const cancelSubscription = async (): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
};

export const updateSubscription = async (newPlanId: string): Promise<UserSubscription> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    planId: newPlanId,
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    cancelAtPeriodEnd: false,
  };
};
