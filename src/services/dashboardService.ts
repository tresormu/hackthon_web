import api from "./api";

export interface DashboardSummary {
  totalPatients: number;
  highRisk: number;
  missedVisits: number;
  chwTasks: number;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get("/dashboard/summary");
    const d = response.data;
    return {
      totalPatients: d.activeMothers ?? 0,
      highRisk: 0,
      missedVisits: d.missedAppointments ?? 0,
      chwTasks: d.openFollowUps ?? 0,
    };
  },
};

export default dashboardService;
