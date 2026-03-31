import api from "./api";

export interface ChwUser {
  _id: string;
  name: string;
  email: string;
  role: 'chw';
  createdAt: string;
}

export interface DoctorSummary {
  myTotalPatients: number;
  myHighRiskPatients: number;
  myMissedAppointments: number;
}

export const doctorsService = {
  getChws: async (): Promise<ChwUser[]> => {
    const response = await api.get("/doctors/chws");
    return Array.isArray(response.data) ? response.data : [];
  },
  getSummary: async (): Promise<DoctorSummary> => {
    const response = await api.get("/doctors/summary");
    return response.data.summary;
  },
};

export default doctorsService;
