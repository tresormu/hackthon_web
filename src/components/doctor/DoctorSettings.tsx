import { useState } from 'react';
import { Save, User, Bell, Shield, Smartphone, Mail, Calendar, CreditCard, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

export const DoctorSettings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'billing'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h1>
              <p className="text-slate-500">Manage your profile and preferences</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          {saveMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <p className="text-emerald-700 text-sm font-medium">{saveMessage}</p>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['profile', 'notifications', 'privacy', 'billing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-brand-600 text-white' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'profile' && 'Profile'}
              {tab === 'notifications' && 'Notifications'}
              {tab === 'privacy' && 'Privacy'}
              {tab === 'billing' && 'Billing'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6"
        >
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Profile Information</h3>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                  <Stethoscope className="w-10 h-10 text-brand-600" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 text-sm">
                    Change Photo
                  </button>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF. Max size 2MB</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue="Jean"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Smith"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue="dr.smith@mamancare.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+250 788 123 456"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
                    <option>OB/GYN</option>
                    <option>General Practitioner</option>
                    <option>Pediatrician</option>
                    <option>Midwife</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">License Number</label>
                  <input
                    type="text"
                    defaultValue="MD-2024-001"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                  <textarea
                    rows={3}
                    defaultValue="Experienced OB/GYN specialist with over 10 years of practice in maternal healthcare."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Email Notifications</p>
                      <p className="text-sm text-slate-600">Receive updates via email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">SMS Notifications</p>
                      <p className="text-sm text-slate-600">Receive text messages</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Appointment Reminders</p>
                      <p className="text-sm text-slate-600">Get notified about upcoming appointments</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Patient Updates</p>
                      <p className="text-sm text-slate-600">New patient registrations</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Privacy & Security</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-600">Add an extra layer of security</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 text-sm">
                    Enable 2FA
                  </button>
                </div>
                
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-5 h-5 text-slate-600" />
                    <h4 className="font-medium text-slate-900">Password</h4>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                    <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Settings */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Billing Information</h3>
              
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  <h4 className="font-medium text-slate-900">Current Plan</h4>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Professional Plan</p>
                      <p className="text-sm text-slate-600">$99/month • Up to 200 patients</p>
                    </div>
                    <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 text-sm">
                      Change Plan
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <h4 className="font-medium text-slate-900">Billing Email</h4>
                </div>
                <input
                  type="email"
                  defaultValue="billing@mamancare.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              <div className="p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-slate-600" />
                  <h4 className="font-medium text-slate-900">Billing Cycle</h4>
                </div>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
                  <option>Monthly (1st of each month)</option>
                  <option>Quarterly (1st of each quarter)</option>
                  <option>Yearly (January 1st)</option>
                </select>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
