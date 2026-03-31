import api from "./api";

export interface SystemSummary {
  totalActiveMothers: number;
  totalChildren: number;
  staff: { doctors: number; chws: number; total: number };
  missedAppointments: number;
}

export interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: 'doctor' | 'chw';
  createdAt: string;
}

export const adminService = {
  getSummary: async (): Promise<SystemSummary> => {
    const response = await api.get("/admin/summary");
    return response.data.summary;
  },
  getUsers: async (): Promise<StaffUser[]> => {
    const response = await api.get("/admin/users");
    return Array.isArray(response.data) ? response.data : [];
  },
  updateUser: async (id: string, data: Partial<Pick<StaffUser, 'name' | 'email' | 'role'>>): Promise<StaffUser> => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data.user;
  },
  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};

export default adminService;
