import api from "./api";

export interface LoginResponse {
  token: string;
  user: { id: string; role: string; name: string };
}

export interface RegisterResponse {
  token: string;
  user: { id: string; role: string; name: string };
}

export interface ActivatePatientResponse {
  token: string;
  message: string;
  patient: { id: string; firstName: string; lastName: string; phone: string };
}

export const authService = {
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  register: async (data: { name: string; email: string; password: string; hospitalName: string }): Promise<RegisterResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },
  activatePatient: async (data: { phone: string; pinCode: string; password: string }): Promise<ActivatePatientResponse> => {
    const response = await api.post("/auth/patient/activate", data);
    return response.data;
  },
  logout: async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore — token may already be expired
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};

export default authService;
