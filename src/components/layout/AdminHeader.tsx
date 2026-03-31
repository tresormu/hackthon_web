import { Search, Bell, User, Shield } from 'lucide-react';

interface AdminHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const AdminHeader = ({ searchQuery, onSearchChange }: AdminHeaderProps) => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search users, reports, or system data..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/10 focus:bg-white transition-all outline-none"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors group">
          <Bell size={22} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-brand-500 border-2 border-white rounded-full"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-100 mx-2"></div>
        
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Admin User</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-1 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3 h-3" />
              System Admin
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-200 overflow-hidden group cursor-pointer hover:border-emerald-300 transition-colors">
            <Shield size={20} className="text-emerald-600 group-hover:text-emerald-700 transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
};
