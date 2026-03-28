import { useState } from 'react';
import { X, User, Phone, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterPatientModal = ({ isOpen, onClose }: RegisterPatientModalProps) => {
  const [step, setStep] = useState(1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">New Patient Registration</h3>
                  <p className="text-slate-500 text-sm mt-1">Confirm pregnancy and enroll mother in tracking.</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex gap-2 mb-8">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                      s <= step ? 'bg-brand-500' : 'bg-slate-100'
                    }`}
                  />
                ))}
              </div>

              <form className="space-y-6">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4">Personal Information</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Full Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" className="input pl-10" placeholder="e.g. Mukamana Aliane" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="tel" className="input pl-10" placeholder="0788 XXXXXX" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Date of Birth</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="date" className="input pl-10" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Residence</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" className="input pl-10" placeholder="e.g. Gasabo, Kigali" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4">Pregnancy Details</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Last Period Date</label>
                        <input type="date" className="input" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Estimated Due Date</label>
                        <input type="date" className="input bg-slate-50" readOnly />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Risk Factors (Select all that apply)</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['Anemia', 'Hypertension', 'Diabetes', 'Previous C-Section', 'Age > 35'].map((risk) => (
                          <label key={risk} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
                            <span className="text-sm text-slate-700">{risk}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4">Communication Preferences</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Preferred Channel</label>
                          <select className="input bg-white">
                            <option>SMS</option>
                            <option>App</option>
                            <option>Voice Call</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Language</label>
                          <select className="input bg-white">
                            <option>Kinyarwanda</option>
                            <option>English</option>
                            <option>French</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Quiet Hours Start</label>
                          <input type="time" className="input" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Quiet Hours End</label>
                          <input type="time" className="input" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {[
                          'Consent to SMS reminders',
                          'Consent to app messages',
                          'Consent to CHW home visits',
                          'Consent to voice calls',
                        ].map((consent) => (
                          <label key={consent} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" />
                            <span className="text-sm text-slate-700">{consent}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6 py-4"
                  >
                    <div className="bg-emerald-50 p-6 rounded-2xl flex items-start gap-4">
                      <div className="bg-emerald-500 p-2 rounded-xl">
                        <AlertCircle className="text-white" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-900">Success! Enrollment Ready</h4>
                        <p className="text-emerald-700 text-sm mt-1 leading-relaxed">
                          Patient will automatically receive her first welcoming message and a QR code to download the companion app.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrollment Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                          <span className="text-slate-500">Program</span>
                          <span className="font-bold text-slate-900">Maternal Health (ANC)</span>
                        </div>
                        <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                          <span className="text-slate-500">First Appointment</span>
                          <span className="font-bold text-slate-900">April 05, 2026</span>
                        </div>
                        <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                          <span className="text-slate-500">Care Status</span>
                          <span className="font-bold text-slate-900">Pregnant - Active</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                          <span className="text-slate-500">Profile Lifecycle</span>
                          <span className="font-bold text-slate-900">Archive after 24 months</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4 pt-6">
                  {step > 1 && (
                    <button 
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 px-6 py-3 border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => step < 3 ? setStep(step + 1) : onClose()}
                    className="flex-[2] btn-primary py-4 rounded-2xl text-lg font-bold shadow-lg shadow-brand-500/20"
                  >
                    {step === 3 ? 'Complete Registration' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
