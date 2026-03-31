export interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
  billing: 'monthly' | 'yearly';
  icon: React.ReactNode;
  description: string;
  maxPatients: number;
  tier: 'starter' | 'professional' | 'enterprise';
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  brand?: string;
  last4: string;
  expMonth?: number;
  expYear?: number;
}

export interface BillingHistory {
  id: string;
  date: Date;
  amount: number;
  status: 'succeeded' | 'failed' | 'pending';
  description: string;
  invoiceUrl?: string;
}

export interface PaymentState {
  selectedPlan: PaymentPlan | null;
  subscription: UserSubscription | null;
  paymentMethods: PaymentMethod[];
  billingHistory: BillingHistory[];
  isLoading: boolean;
  error: string | null;
}
