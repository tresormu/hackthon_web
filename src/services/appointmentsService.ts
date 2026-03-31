import api from "./api";
import type { ChwTask } from "../contexts/MamaCareContext";

function mapFollowUp(f: any): ChwTask {
  const mother = f.mother ?? {};
  return {
    id: f._id ?? f.id,
    patientId: mother._id ?? mother.id ?? '',
    patientName: `${mother.firstName ?? ''} ${mother.lastName ?? ''}`.trim() || 'Unknown',
    task: f.reason ?? 'Follow-up required',
    status: f.status === 'closed' ? 'Completed' : 'Pending',
    due: f.triggeredAt ? new Date(f.triggeredAt).toLocaleDateString() : '',
    reason: f.reason ?? '',
    chw: f.assignedTo ?? '',
  };
}

export const appointmentsService = {
  getMissedAlerts: async (): Promise<ChwTask[]> => {
    const response = await api.get("/follow-ups");
    const raw = Array.isArray(response.data) ? response.data : response.data?.data ?? [];
    return raw.map(mapFollowUp);
  },
  updateStatus: async (id: string, status: string): Promise<void> => {
    if (status === 'completed') {
      await api.post(`/follow-ups/${id}/resolve`, {});
    } else {
      await api.patch(`/appointments/${id}/status`, { status });
    }
  },
};

export default appointmentsService;
