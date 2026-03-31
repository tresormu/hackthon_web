import { useState, useEffect } from 'react';
import { Save, Bell, Shield, Smartphone, Mail, Calendar, CreditCard, Stethoscope, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

export const DoctorSettings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'billing'>('profile');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    phone: '',
    hospitalName: '',
    specialization: '',
    licenseNumber: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email ?? '',
        phone: user.phone ?? '',
        hospitalName: user.hospitalName ?? '',
        specialization: user.specialization ?? '',
        licenseNumber: user.licenseNumber ?? '',
        bio: user.bio ?? '',
      });
    }
  }, [user]);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaveMessage('');
    try {
      await updateProfile(form);
      setSaveMessage('Profile saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.hospitalName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '??';

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
              <p className="text-slate-500">Manage your profile and preferences</p>
            </div>
            {activeTab === 'profile' && (
              <button onClick={handleSave} disabled={saving}
                className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
          {saveMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-700 text-sm font-medium">{saveMessage}</p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <p className="text-rose-700 text-sm font-medium">{error}</p>
            </div>
          )}
        </motion.div>

        <div className="flex gap-2 mb-6">
          {(['profile', 'notifications', 'privacy', 'billing'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${activeTab === tab ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Profile Information</h3>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-brand-700 font-bold text-2xl">{initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user?.hospitalName}</p>
                  <p className="text-xs text-slate-500 capitalize mt-0.5">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hospital / Clinic Name</label>
                  <input type="text" className="input" value={form.hospitalName} onChange={set('hospitalName')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input type="email" className="input" value={form.email} onChange={set('email')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input type="tel" className="input" placeholder="+250 788 000 000" value={form.phone} onChange={set('phone')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hospital / Clinic Name</label>
                  <input type="text" className="input" value={form.hospitalName} onChange={set('hospitalName')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
                  <select className="input" value={form.specialization} onChange={set('specialization')}>
                    <option value="">Select specialization</option>
                    <option>OB/GYN</option>
                    <option>General Practitioner</option>
                    <option>Pediatrician</option>
                    <option>Midwife</option>
                    <option>Nurse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">License Number</label>
                  <input type="text" className="input" placeholder="MD-2024-001" value={form.licenseNumber} onChange={set('licenseNumber')} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  <textarea rows={3} className="input resize-none" placeholder="Brief professional bio..." value={form.bio} onChange={set('bio')} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { icon: Mail, label: 'Email Notifications', sub: 'Receive updates via email', defaultOn: true },
                  { icon: Smartphone, label: 'SMS Notifications', sub: 'Receive text messages', defaultOn: false },
                  { icon: Bell, label: 'Appointment Reminders', sub: 'Get notified about upcoming appointments', defaultOn: true },
                  { icon: Calendar, label: 'Patient Updates', sub: 'New patient registrations', defaultOn: true },
                ].map(({ icon: Icon, label, sub, defaultOn }) => (
                  <div key={label} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-900">{label}</p>
                        <p className="text-sm text-slate-600">{sub}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={defaultOn} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Privacy & Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-600">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 text-sm">Enable 2FA</button>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-slate-600" />
                    <h4 className="font-medium text-slate-900">Change Password</h4>
                  </div>
                  <div className="space-y-3">
                    <input type="password" placeholder="Current password" className="input" />
                    <input type="password" placeholder="New password" className="input" />
                    <input type="password" placeholder="Confirm new password" className="input" />
                    <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700">Update Password</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900">Billing Information</h3>
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  <h4 className="font-medium text-slate-900">Current Plan</h4>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{user?.hospitalName || 'Your Hospital'}</p>
                    <p className="text-sm text-slate-600">Manage your subscription in the Payment section</p>
                  </div>
                  <Stethoscope className="text-brand-400 w-8 h-8" />
                </div>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <h4 className="font-medium text-slate-900">Billing Email</h4>
                </div>
                <input type="email" className="input" defaultValue={user?.email ?? ''} />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
