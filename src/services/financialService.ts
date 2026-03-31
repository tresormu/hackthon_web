import api from "./api";

export interface FinancialRecord {
  _id: string;
  txRef: string;
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  createdAt: string;
  paidAt?: string;
  plan?: { name: string; slug: string; price: number; currency: string };
  user?: { name: string; email: string };
}

export interface FinancialRecordsResponse {
  data: FinancialRecord[];
  total: number;
  page: number;
  limit: number;
  totalRevenue: number;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  revenue: number;
  transactions: number;
}

export interface RevenueByPlan {
  _id: string;
  planName: string;
  revenue: number;
  count: number;
}

export interface FinancialReportSummary {
  totalRevenue: number;
  totalTransactions: number;
  avgTransactionValue: number;
  pendingTransactions: number;
  failedTransactions: number;
  monthOverMonthGrowth: number;
  currentMonthRevenue: number;
}

export interface FinancialReport {
  summary: FinancialReportSummary;
  monthlyRevenue: MonthlyRevenue[];
  revenueByPlan: RevenueByPlan[];
}

export interface FinancialRecordsParams {
  status?: 'pending' | 'completed' | 'failed';
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const financialService = {
  getRecords: async (params: FinancialRecordsParams = {}): Promise<FinancialRecordsResponse> => {
    const response = await api.get('/financial/records', { params });
    return response.data;
  },
  getReport: async (): Promise<FinancialReport> => {
    const response = await api.get('/financial/report');
    return response.data;
  },
};

export default financialService;
