export interface FinancialRecord {
  id: string;
  date: Date;
  type: 'payment' | 'refund' | 'credit' | 'charge';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  invoiceUrl?: string;
  method?: string;
}

export interface FinancialStats {
  totalSpent: number;
  currentMonthSpend: number;
  projectedAnnualCost: number;
  savingsFromYearly: number;
  totalPatients: number;
  totalAppointments: number;
  storageUsed: number;
  storageLimit: number;
  averageCostPerPatient: number;
  monthlyGrowth: number;
  planUtilization: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  brand?: string;
  last4?: string;
  expMonth?: number;
  expYear?: number;
}

export interface Invoice {
  id: string;
  date: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: Date;
  planName: string;
  billingCycle: 'monthly' | 'yearly';
  downloadUrl?: string;
}

export interface PlanChange {
  id: string;
  oldPlan: string;
  newPlan: string;
  changeDate: Date;
  effectiveDate: Date;
  status: 'pending' | 'completed' | 'cancelled';
}
