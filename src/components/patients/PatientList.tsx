
import { Search, Filter, Plus, ChevronRight, MoreHorizontal } from 'lucide-react';

const patients = [
  { id: 1, name: 'Mukamana Aliane', age: 24, week: 32, phone: '0788123456', status: 'High Risk', stage: 'Pregnant', lastVisit: '2026-03-20', misses: 2, missType: 'ANC', lastMissed: '2026-03-24', preferred: 'SMS' },
  { id: 2, name: 'Uwimana Claudine', age: 28, week: 14, phone: '0788234567', status: 'Stable', stage: 'Pregnant', lastVisit: '2026-03-25', misses: 0, missType: 'ANC', lastMissed: '-', preferred: 'App' },
  { id: 3, name: 'Kaliza Solange', age: 22, week: 28, phone: '0788345678', status: 'Moderate', stage: 'Pregnant', lastVisit: '2026-03-22', misses: 3, missType: 'ANC', lastMissed: '2026-03-22', preferred: 'SMS' },
  { id: 4, name: 'Nyirasafari Marie', age: 31, week: 38, phone: '0788456789', status: 'High Risk', stage: 'Postpartum', lastVisit: '2026-03-27', misses: 1, missType: 'PNC', lastMissed: '2026-03-27', preferred: 'Call' },
  { id: 5, name: 'Umutesi Denise', age: 26, week: 11, phone: '0788567890', status: 'Stable', stage: 'Infant Care', lastVisit: '2026-03-18', misses: 1, missType: 'Vaccine', lastMissed: '2026-03-18', preferred: 'SMS' },
  { id: 6, name: 'Umuhoza Grace', age: 29, week: 19, phone: '0788678901', status: 'Stable', stage: 'Archived', lastVisit: '2025-04-12', misses: 0, missType: 'None', lastMissed: '-', preferred: 'SMS' },
];

interface PatientListProps {
  onOpenRegister: () => void;
  searchQuery: string;
}

export const PatientList = ({ onOpenRegister, searchQuery }: PatientListProps) => {
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toString().includes(searchQuery) ||
    patient.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Patient Directory</h2>
          <p className="text-slate-500">Manage and track all registered mothers.</p>
        </div>
        <button 
          onClick={onOpenRegister}
          className="btn-primary flex items-center gap-2 self-start md:self-auto"
        >
          <Plus size={18} />
          Register New Patient
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name, ID, or phone..." 
              className="input pl-10 bg-slate-50 border-none focus:bg-white"
              value={searchQuery}
              readOnly
            />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} />
              Filters
            </button>
            <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-600 outline-none hover:bg-slate-50 transition-colors">
              <option>All Status</option>
              <option>Stable</option>
              <option>Moderate</option>
              <option>High Risk</option>
            </select>
            <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-600 outline-none hover:bg-slate-50 transition-colors">
              <option>All Stages</option>
              <option>Pregnant</option>
              <option>Postpartum</option>
              <option>Infant Care</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 italic">
                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em] pl-4">Patient</th>
                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Program Stage</th>
                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Health Status</th>
                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Care Status</th>
                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Missed Visits</th>
                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]">Last Visit</th>
                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-5 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center font-bold text-brand-700 text-xs">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">{patient.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">Age: {patient.age} - MD-{patient.id}092</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-slate-700">{patient.stage === 'Pregnant' ? `Week ${patient.week}` : patient.stage}</p>
                        <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-brand-500 h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${(patient.stage === 'Pregnant' ? patient.week : 40) / 40 * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 text-sm font-medium text-slate-600">
                      <div className="space-y-1">
                        <p>{patient.phone}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Pref: {patient.preferred}</p>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        patient.status === 'High Risk' ? 'bg-rose-50 text-rose-600' : 
                        patient.status === 'Moderate' ? 'bg-amber-50 text-amber-600' : 
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        patient.stage === 'Archived' ? 'bg-slate-100 text-slate-500' :
                        patient.stage === 'Infant Care' ? 'bg-brand-50 text-brand-600' :
                        patient.stage === 'Postpartum' ? 'bg-amber-50 text-amber-700' :
                        'bg-emerald-50 text-emerald-600'
                      }`}>
                        {patient.stage}
                      </span>
                    </td>
                    <td className="py-5">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-700">{patient.misses} / {patient.status === 'High Risk' ? 2 : 4}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Last: {patient.lastMissed} - {patient.missType}</p>
                      </div>
                    </td>
                    <td className="py-5 text-sm text-slate-500 font-medium font-mono">
                      {patient.lastVisit}
                    </td>
                    <td className="py-5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
                          Send SMS
                        </button>
                        <button className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors">
                          Assign CHW
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all shadow-sm">
                          <MoreHorizontal size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-brand-600 hover:bg-white rounded-lg transition-all shadow-sm">
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 italic">
                    No patients found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredPatients.length} of {patients.length} patients
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
