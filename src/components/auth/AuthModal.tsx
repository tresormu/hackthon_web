import { useState } from 'react';
import { X, Heart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  mode: 'login' | 'register';
  onClose: () => void;
  onAuth: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
}

export const AuthModal = ({ mode, onClose, onAuth, onSwitchMode }: AuthModalProps) => {
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        // Register using hospitalName as the account name
        await register(hospitalName, email, password, hospitalName);
      }
      onAuth();
    } catch (err: any) {
      setError(err.response?.data?.error ?? err.response?.data?.message ?? 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Heart size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg">MamaCare+</span>
          </div>
          <h2 className="text-2xl font-black mt-4">
            {mode === 'login' ? 'Welcome back' : 'Register your hospital'}
          </h2>
          <p className="text-brand-100 text-sm mt-1 opacity-80">
            {mode === 'login' ? 'Sign in to your dashboard' : 'Create your hospital account to get started'}
          </p>
        </div>

        <div className="p-8">
          <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
            <button onClick={() => onSwitchMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'login' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
              Sign In
            </button>
            <button onClick={() => onSwitchMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'register' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Hospital / Clinic Name</label>
                <input className="input" type="text" placeholder="e.g. Kigali Health Center" required
                  value={hospitalName} onChange={e => setHospitalName(e.target.value)} />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Email</label>
              <input className="input" type="email" placeholder="you@health.rw" required
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="relative">
                <input className="input pr-10" type={showPassword ? 'text' : 'password'} placeholder="••••••••" required
                  value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 mt-2 text-base font-bold rounded-xl disabled:opacity-60">
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account & Choose Plan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
