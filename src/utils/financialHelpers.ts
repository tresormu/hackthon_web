import type { FinancialRecord, FinancialStats, Invoice } from '../types/financial';
import { formatPrice } from './paymentHelpers';

export const calculateMonthlySpend = (records: FinancialRecord[]): number => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  return records
    .filter(record => {
      const recordDate = new Date(record.date);
      return record.type === 'payment' && 
             recordDate.getMonth() === currentMonth && 
             recordDate.getFullYear() === currentYear &&
             record.status === 'completed';
    })
    .reduce((sum, record) => sum + record.amount, 0);
};

export const calculateProjectedAnnualCost = (monthlyCost: number, billingCycle: 'monthly' | 'yearly'): number => {
  return billingCycle === 'monthly' ? monthlyCost * 12 : monthlyCost;
};

export const calculateSavingsFromYearly = (monthlyCost: number): number => {
  const yearlyCost = monthlyCost * 12;
  const discountedYearlyCost = monthlyCost * 10; // 2 months free
  return yearlyCost - discountedYearlyCost;
};

export const calculatePlanUtilization = (currentUsage: number, limit: number): number => {
  if (limit === Infinity) return 100;
  return Math.min((currentUsage / limit) * 100, 100);
};

export const getFinancialStats = (
  records: FinancialRecord[], 
  currentPlan: { price: number; billingCycle: 'monthly' | 'yearly'; maxPatients: number },
  usageData: { patients: number; appointments: number; storageUsed: number }
): FinancialStats => {
  const totalSpent = records
    .filter(r => r.type === 'payment' && r.status === 'completed')
    .reduce((sum, r) => sum + r.amount, 0);
    
  const currentMonthSpend = calculateMonthlySpend(records);
  const projectedAnnualCost = calculateProjectedAnnualCost(currentPlan.price, currentPlan.billingCycle);
  const savingsFromYearly = calculateSavingsFromYearly(currentPlan.price);
  
  return {
    totalSpent,
    currentMonthSpend,
    projectedAnnualCost,
    savingsFromYearly,
    totalPatients: usageData.patients,
    totalAppointments: usageData.appointments,
    storageUsed: usageData.storageUsed,
    storageLimit: currentPlan.maxPatients * 10, // Estimate: 10MB per patient
    averageCostPerPatient: usageData.patients > 0 ? totalSpent / usageData.patients : 0,
    monthlyGrowth: Math.random() * 20 - 10, // Mock growth data
    planUtilization: calculatePlanUtilization(usageData.patients, currentPlan.maxPatients)
  };
};

export const formatFinancialDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const exportToCSV = (records: FinancialRecord[]): string => {
  const headers = ['Date', 'Type', 'Description', 'Amount', 'Status', 'Method'];
  const csvContent = [
    headers.join(','),
    ...records.map(record => [
      formatFinancialDate(record.date),
      record.type,
      record.description,
      record.amount,
      record.status,
      record.method || ''
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const downloadCSV = (data: string, filename: string): void => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const getInvoiceStatusColor = (status: Invoice['status']): string => {
  switch (status) {
    case 'paid': return 'text-emerald-600 bg-emerald-50';
    case 'pending': return 'text-amber-600 bg-amber-50';
    case 'overdue': return 'text-rose-600 bg-rose-50';
    default: return 'text-slate-600 bg-slate-50';
  }
};

export const getPaymentTypeIcon = (type: FinancialRecord['type']): string => {
  switch (type) {
    case 'payment': return '💳';
    case 'refund': return '↩️';
    case 'credit': return '💰';
    case 'charge': return '💸';
    default: return '💵';
  }
};
