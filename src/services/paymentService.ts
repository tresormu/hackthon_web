import api from "./api";

export interface PaymentPlan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  maxActiveMothers: number | null;
  description: string;
  features: string[];
  isActive: boolean;
}

export interface PaymentTransaction {
  _id: string;
  txRef: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  createdAt: string;
  paidAt?: string;
  plan?: PaymentPlan;
}

export interface Subscription {
  active: boolean;
  daysLeft: number;
  expiresAt: string;
  subscription: {
    txRef: string;
    amount: number;
    currency: string;
    paidAt: string;
    plan: PaymentPlan;
  } | null;
}

export const paymentService = {
  getPlans: async (): Promise<PaymentPlan[]> => {
    const response = await api.get("/payment/plans");
    return Array.isArray(response.data) ? response.data : [];
  },
  getTransactions: async (status?: string): Promise<PaymentTransaction[]> => {
    const params = status ? { status } : {};
    const response = await api.get("/payment/transactions", { params });
    return Array.isArray(response.data) ? response.data : [];
  },
  getSubscription: async (): Promise<Subscription> => {
    const response = await api.get("/payment/subscription");
    return response.data;
  },
  createCheckout: async (data: {
    planId?: string;
    planSlug?: string;
    hospitalName?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    callbackUrl?: string;
  }): Promise<{ paymentUrl: string; txRef: string }> => {
    const response = await api.post("/payment/checkout-session", data);
    return response.data;
  },
  verifyPayment: async (txRef: string, flwId?: string): Promise<{ status: string }> => {
    const params = flwId ? { flwId } : {};
    const response = await api.get(`/payment/verify/${txRef}`, { params });
    return response.data;
  },
};

export default paymentService;
