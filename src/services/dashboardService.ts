import api from "./api";

export interface DashboardSummary {
  totalPatients: number;
  highRisk: number;
  missedVisits: number;
  chwTasks: number;
}

export interface PinAlert {
  _id: string;
  motherName: string;
  motherPhone: string;
  pinCode: string;
  dismissed: boolean;
  createdAt: string;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get("/doctors/summary");
    const d = response.data.summary ?? response.data;
    return {
      totalPatients: d.myTotalPatients ?? 0,
      highRisk: d.myHighRiskPatients ?? 0,
      missedVisits: d.myMissedAppointments ?? 0,
      chwTasks: d.myChwTasks ?? 0,
    };
  },
  getAlerts: async (): Promise<PinAlert[]> => {
    const response = await api.get("/dashboard/alerts");
    return response.data.alerts ?? [];
  },
  dismissAlert: async (id: string): Promise<void> => {
    await api.patch(`/dashboard/alerts/${id}/dismiss`);
  },
};

export default dashboardService;
