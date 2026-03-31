import { useState } from 'react';
import { X, Phone, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/authService';

interface ActivateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivated?: (token: string) => void;
}

export const ActivateAccountModal = ({ isOpen, onClose, onActivated }: ActivateAccountModalProps) => {
  const [form, setForm] = useState({ phone: '', pinCode: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activated, setActivated] = useState(false);

  const handleSubmit = async () => {
    if (!form.phone.trim() || !form.pinCode.trim() || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.pinCode.length !== 6) {
      setError('PIN must be exactly 6 digits.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await authService.activatePatient({
        phone: form.phone.trim(),
        pinCode: form.pinCode.trim(),
        password: form.password,
      });
      setActivated(true);
      onActivated?.(result.token);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err?.response?.data?.message ?? 'Activation failed. Check your phone number and PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ phone: '', pinCode: '', password: '', confirmPassword: '' });
    setError('');
    setActivated(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Activate Your Account</h3>
                  <p className="text-slate-500 text-sm mt-1">Use the PIN provided by your doctor.</p>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {!activated ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        className="input pl-10"
                        placeholder="0788 XXXXXX"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Activation PIN (6 digits)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className="input text-center tracking-[0.4em] text-xl font-bold"
                      placeholder="• • • • • •"
                      value={form.pinCode}
                      onChange={e => setForm(f => ({ ...f, pinCode: e.target.value.replace(/\D/g, '') }))}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input pl-10 pr-10"
                        placeholder="Min 8 chars, upper, lower, number, symbol"
                        value={form.password}
                        onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Confirm Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input pl-10"
                        placeholder="Repeat your password"
                        value={form.confirmPassword}
                        onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      />
                    </div>
                  </div>

                  {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmit}
                    className="w-full btn-primary py-4 rounded-2xl text-lg font-bold shadow-lg shadow-brand-500/20 disabled:opacity-60 mt-2"
                  >
                    {loading ? 'Activating...' : 'Activate Account'}
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-4 py-6"
                >
                  <div className="flex justify-center">
                    <div className="bg-emerald-100 p-4 rounded-full">
                      <CheckCircle size={40} className="text-emerald-500" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Account Activated!</h4>
                  <p className="text-slate-500 text-sm">Your account is now active. You can log in with your phone number and password.</p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full btn-primary py-4 rounded-2xl text-lg font-bold mt-2"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
