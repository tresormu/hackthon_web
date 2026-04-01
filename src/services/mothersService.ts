import api from "./api";
import type { Patient } from "../contexts/MamaCareContext";

function mapMother(m: any): Patient {
  return {
    id: m._id ?? m.id,
    name: `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim(),
    age: m.dateOfBirth ? Math.floor((Date.now() - new Date(m.dateOfBirth).getTime()) / 31557600000) : 0,
    phone: m.phone ?? '',
    stage: m.pregnancyWeeks ? 'Pregnant' : m.status === 'archived' ? 'Archived' : 'Postpartum',
    week: m.pregnancyWeeks,
    status: m.riskFlags?.length > 1 ? 'High Risk' : m.riskFlags?.length === 1 ? 'Moderate' : 'Stable',
    lastVisit: m.updatedAt ? new Date(m.updatedAt).toLocaleDateString() : '',
    misses: m.missedAppointmentsCount ?? 0,
    missType: '',
    lastMissed: '',
    preferred: m.preferredLanguage ?? 'SMS',
    enrolledAt: m.createdAt ?? '',
    chwAssigned: m.assignedCHW,
  };
}

export const mothersService = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get("/doctors/my-mothers");
    const raw = response.data?.data ?? response.data;
    return Array.isArray(raw) ? raw.map(mapMother) : [];
  },
  getById: async (id: string): Promise<Patient> => {
    const response = await api.get(`/mothers/${id}`);
    return mapMother(response.data);
  },
  create: async (data: any): Promise<Patient & { pinCode?: string }> => {
    const rawDob = data.birthDate ?? data.dateOfBirth;
    const payload = {
      firstName: data.firstName ?? data.name?.split(' ')[0] ?? '',
      lastName: data.lastName ?? data.name?.split(' ').slice(1).join(' ') ?? '',
      phone: data.phone,
      pregnancyWeeks: data.week ? Number(data.week) : undefined,
      riskFlags: data.riskFlags ?? [],
      preferredLanguage: data.preferred ?? data.preferredLanguage,
      dateOfBirth: rawDob ? new Date(rawDob).toISOString() : undefined,
      hasChildUnderTwo: data.hasChildUnderTwo ?? false,
      existingChildren: data.existingChildren ?? [],
    };
    const response = await api.post("/mothers", payload);
    return { ...mapMother(response.data), pinCode: response.data.pinCode };
  },
  update: async (id: string, data: Partial<any>): Promise<Patient> => {
    const response = await api.patch(`/mothers/${id}`, data);
    return mapMother(response.data);
  },
  assignChw: async (id: string, data: { chw: string; reason: string }): Promise<void> => {
    await api.patch(`/mothers/${id}`, { assignedCHW: data.chw });
  },
};

export default mothersService;
