import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut,
  Shield,
  Database,
  DollarSign,
  BarChart3,
  Activity,
  Server
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
        ? "bg-emerald-50 text-emerald-600 shadow-sm" 
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}
  >
    <span className={cn(
      "transition-transform group-hover:scale-110",
      active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
    )}>
      {icon}
    </span>
    <span className="font-medium flex-1 text-left">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

interface AdminSidebarProps {
  onNavigate: (page: 'overview' | 'users' | 'billing' | 'analytics' | 'settings') => void;
  currentPage: 'overview' | 'users' | 'billing' | 'analytics' | 'settings';
}

export const AdminSidebar = ({ onNavigate, currentPage }: AdminSidebarProps) => {
  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-emerald-600 p-2 rounded-xl">
          <Shield className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-slate-900 tracking-tight">MamaCare<span className="text-emerald-600">+</span></h1>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest leading-none mt-0.5">Admin Portal</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <div className="pt-8">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">System Management</div>
          <SidebarItem 
            icon={<LayoutDashboard size={20} />} 
            label="System Overview" 
            active={currentPage === 'overview'} 
            onClick={() => onNavigate('overview')}
          />
          <SidebarItem 
            icon={<Users size={20} />} 
            label="User Management" 
            active={currentPage === 'users'} 
            onClick={() => onNavigate('users')}
          />
          <SidebarItem 
            icon={<Database size={20} />} 
            label="Database" 
            badge={3} 
            active={false}
            onClick={() => {}}
          />
          <SidebarItem 
            icon={<Server size={20} />} 
            label="System Health" 
            active={false}
            onClick={() => {}}
          />
          
          <div className="pt-8">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Business</div>
            <SidebarItem 
              icon={<DollarSign size={20} />} 
              label="Billing & Payments" 
              active={currentPage === 'billing'} 
              onClick={() => onNavigate('billing')}
            />
            <SidebarItem 
              icon={<BarChart3 size={20} />} 
              label="Analytics & Reports" 
              active={currentPage === 'analytics'} 
              onClick={() => onNavigate('analytics')}
            />
          </div>
          
          <div className="pt-8">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">System</div>
            <SidebarItem 
              icon={<Activity size={20} />} 
              label="Activity Logs" 
              badge={47} 
              active={false}
              onClick={() => {}}
            />
            <SidebarItem 
              icon={<Settings size={20} />} 
              label="Settings" 
              active={currentPage === 'settings'}
              onClick={() => onNavigate('settings')}
            />
          </div>
        </div>
      </nav>

      <div className="mt-auto space-y-1">
        <SidebarItem icon={<LogOut size={20} />} label="Sign Out" />
        
        <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <Shield className="text-emerald-700 w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">System Administrator</p>
              <p className="text-xs text-slate-500">Full Access</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">System Health: Optimal</p>
            </div>
          </div>
          <div className="text-xs text-slate-600 text-center">
            <p>Version 2.4.1</p>
            <p className="text-emerald-600 font-medium">All systems operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
