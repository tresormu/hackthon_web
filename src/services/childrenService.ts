import api from "./api";

export interface Child {
  _id: string;
  name?: string;
  dateOfBirth: string;
  sex?: 'female' | 'male';
  mother: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    missedAppointmentsCount: number;
    riskFlags: string[];
  };
  nextAppointment?: {
    notes: string;
    scheduledFor: string;
  };
}

export const childrenService = {
  getAll: async (): Promise<Child[]> => {
    const response = await api.get("/children");
    return Array.isArray(response.data) ? response.data : [];
  },
  registerChild: async (data: { motherId: string; name?: string; dateOfBirth: string; sex?: string }): Promise<Child> => {
    const response = await api.post("/children/register", data);
    return response.data.child;
  },
  getByMother: async (motherId: string): Promise<Child[]> => {
    const response = await api.get(`/children/mother/${motherId}`);
    return Array.isArray(response.data) ? response.data : [];
  },
};

export default childrenService;
