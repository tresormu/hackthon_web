
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  Stethoscope,
  Baby,
  MessageSquare
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const SidebarItem = ({ icon, label, active, onClick, badge }: SidebarItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-brand-50 text-brand-600 shadow-sm" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <span className={cn(
      "transition-transform group-hover:scale-110",
      active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
    )}>
      {icon}
    </span>
    <span className="font-medium flex-1 text-left">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

interface SidebarProps {
  onNavigate: (page: 'overview' | 'patients' | 'alerts' | 'chw' | 'postnatal') => void;
  currentPage: 'overview' | 'patients' | 'alerts' | 'chw' | 'postnatal';
}

export const Sidebar = ({ onNavigate, currentPage }: SidebarProps) => {
  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-brand-600 p-2 rounded-xl">
          <Stethoscope className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-900 tracking-tight">MamaCare<span className="text-brand-600">+</span></h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none mt-0.5">Doctor's Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</div>
        <SidebarItem 
          icon={<LayoutDashboard size={20} />} 
          label="Overview" 
          active={currentPage === 'overview'} 
          onClick={() => onNavigate('overview')}
        />
        <SidebarItem 
          icon={<Users size={20} />} 
          label="Patients" 
          active={currentPage === 'patients'} 
          onClick={() => onNavigate('patients')}
        />
        <SidebarItem 
          icon={<Calendar size={20} />} 
          label="Alerts" 
          badge={12} 
          active={currentPage === 'alerts'}
          onClick={() => onNavigate('alerts')}
        />
        <SidebarItem 
          icon={<MessageSquare size={20} />} 
          label="CHW Coordination" 
          active={currentPage === 'chw'}
          onClick={() => onNavigate('chw')}
        />
        
        <div className="pt-8">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Health Programs</div>
          <SidebarItem 
            icon={<Baby size={20} />} 
            label="Postnatal Care" 
            active={currentPage === 'postnatal'}
            onClick={() => onNavigate('postnatal')}
          />
        </div>
      </nav>

      <div className="mt-auto space-y-1">
        <SidebarItem icon={<Settings size={20} />} label="Settings" />
        <SidebarItem icon={<LogOut size={20} />} label="Sign Out" />
        
        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
              <span className="text-brand-700 font-bold text-sm">JS</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Dr. Jean Smith</p>
              <p className="text-xs text-slate-500">OB/GYN Specialist</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
