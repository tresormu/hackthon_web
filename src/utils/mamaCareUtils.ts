export const calculateWeeksPregnant = (lmp: string): number => {
  const lmpDate = new Date(lmp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return Math.min(diffWeeks, 40);
};

export const calculateEdd = (lmp: string): string => {
  const lmpDate = new Date(lmp);
  lmpDate.setDate(lmpDate.getDate() + 280);
  return lmpDate.toISOString().split('T')[0];
};

export const getThresholdByRisk = (risk: string): number => {
  return (risk === 'High Risk' || risk === 'Critical') ? 2 : 4;
};

export const shouldArchive = (enrolledAt: string): boolean => {
  const now = new Date();
  const enrollDate = new Date(enrolledAt);
  const ageMonths = (now.getTime() - enrollDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return ageMonths > 24;
};

export const getVaccinationSchedule = () => {
  return [
    { name: 'BCG/OPV0/PNV0', weeks: 0 },
    { name: 'OPV1/PNV1', weeks: 6 },
    { name: 'OPV2/PNV2/Rotavirus1/DTP1', weeks: 10 },
    { name: 'OPV3/PNV3/Rotavirus2/DTP2', weeks: 14 },
    { name: 'OPV4/IPV/DTP3/Measles1', weeks: 38 }, // ~9 months
  ];
};

export const simulateSMS = (message: string) => {
  console.log('📱 SMS:', message);
  alert(`SMS sent:\n${message}`);
};
