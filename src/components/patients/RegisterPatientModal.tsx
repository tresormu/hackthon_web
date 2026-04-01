import { useState } from 'react';
import { X, User, Phone, Calendar, AlertCircle, Baby, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMamaCare } from '../../contexts/useMamaCare';

interface RegisterPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterPatientModal = ({ isOpen, onClose }: RegisterPatientModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');
  const [pinCopied, setPinCopied] = useState(false);
  const { addPatient } = useMamaCare();

  interface ExistingChild { name: string; dateOfBirth: string; sex: 'female' | 'male' | ''; }

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', dateOfBirth: '',
    pregnancyWeeks: '', riskFlags: [] as string[],
    preferredLanguage: 'Kinyarwanda',
    hasChildUnderTwo: false,
    existingChildren: [] as ExistingChild[],
  });

  const addChild = () =>
    setForm(f => ({ ...f, existingChildren: [...f.existingChildren, { name: '', dateOfBirth: '', sex: '' }] }));

  const removeChild = (i: number) =>
    setForm(f => ({ ...f, existingChildren: f.existingChildren.filter((_, idx) => idx !== i) }));

  const updateChild = (i: number, field: keyof ExistingChild, value: string) =>
    setForm(f => ({
      ...f,
      existingChildren: f.existingChildren.map((c, idx) => idx === i ? { ...c, [field]: value } : c),
    }));

  const riskOptions = ['Anemia', 'Hypertension', 'Diabetes', 'Previous C-Section', 'Age > 35'];

  const toggleRisk = (risk: string) =>
    setForm(f => ({
      ...f,
      riskFlags: f.riskFlags.includes(risk) ? f.riskFlags.filter(r => r !== risk) : [...f.riskFlags, risk],
    }));

  const handleComplete = async () => {
    if (!form.firstName.trim() || !form.phone.trim()) {
      setError('First name and phone number are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const validChildren = form.existingChildren.filter(c => c.dateOfBirth);
      const result = await addPatient({
        name: `${form.firstName} ${form.lastName}`.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        age: form.dateOfBirth ? Math.floor((Date.now() - new Date(form.dateOfBirth).getTime()) / 31557600000) : 0,
        stage: 'Pregnant',
        week: form.pregnancyWeeks ? Number(form.pregnancyWeeks) : undefined,
        status: form.riskFlags.length > 1 ? 'High Risk' : form.riskFlags.length === 1 ? 'Moderate' : 'Stable',
        lastVisit: new Date().toLocaleDateString(),
        missType: '',
        preferred: form.preferredLanguage,
        preferredLanguage: form.preferredLanguage,
        riskFlags: form.riskFlags,
        birthDate: form.dateOfBirth,
        dateOfBirth: form.dateOfBirth,
        hasChildUnderTwo: form.hasChildUnderTwo,
        existingChildren: validChildren.map(c => ({
          name: c.name || undefined,
          dateOfBirth: new Date(c.dateOfBirth).toISOString(),
          sex: c.sex || undefined,
        })),
      } as any);
      if (result?.pinCode) setGeneratedPin(result.pinCode);
      setStep(4);
    } catch (err: any) {
      const data = err?.response?.data;
      const message: string = String(data?.error ?? data?.message ?? err?.message ?? 'Failed to register patient. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setGeneratedPin('');
    setPinCopied(false);
    setForm({ firstName: '', lastName: '', phone: '', dateOfBirth: '', pregnancyWeeks: '', riskFlags: [], preferredLanguage: 'Kinyarwanda', hasChildUnderTwo: false, existingChildren: [] });
    setError('');
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
            className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">New Patient Registration</h3>
                  <p className="text-slate-500 text-sm mt-1">Confirm pregnancy and enroll mother in tracking.</p>
                </div>
                <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4].map((s) => (
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
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">First Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" className="input pl-10" placeholder="e.g. Aliane" value={form.firstName} onChange={e => setForm(f => ({...f, firstName: e.target.value}))} required />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Last Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="text" className="input pl-10" placeholder="e.g. Mukamana" value={form.lastName} onChange={e => setForm(f => ({...f, lastName: e.target.value}))} required />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Phone Number</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="tel" className="input pl-10" placeholder="0788 XXXXXX" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} required />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Date of Birth</label>
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="date" className="input pl-10" value={form.dateOfBirth} onChange={e => setForm(f => ({...f, dateOfBirth: e.target.value}))} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4">Existing Children</div>
                    <div
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        form.hasChildUnderTwo ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-slate-50'
                      }`}
                      onClick={() => setForm(f => ({ ...f, hasChildUnderTwo: !f.hasChildUnderTwo, existingChildren: !f.hasChildUnderTwo ? f.existingChildren : [] }))}
                    >
                      <div className="flex items-center gap-3">
                        <Baby size={20} className={form.hasChildUnderTwo ? 'text-brand-500' : 'text-slate-400'} />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Has a child under 2 years?</p>
                          <p className="text-xs text-slate-500">Child will be added to tracking records</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        form.hasChildUnderTwo ? 'border-brand-500 bg-brand-500' : 'border-slate-300'
                      }`}>
                        {form.hasChildUnderTwo && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>

                    {form.hasChildUnderTwo && (
                      <div className="space-y-3">
                        {form.existingChildren.map((child, i) => (
                          <div key={i} className="p-4 bg-slate-50 rounded-2xl space-y-3 border border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Child {i + 1}</span>
                              <button type="button" onClick={() => removeChild(i)} className="p-1 hover:bg-rose-50 rounded-lg transition-colors">
                                <Trash2 size={14} className="text-rose-400" />
                              </button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Name (optional)</label>
                                <input
                                  type="text"
                                  className="input"
                                  placeholder="e.g. Amani"
                                  value={child.name}
                                  onChange={e => updateChild(i, 'name', e.target.value)}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Sex</label>
                                <select className="input bg-white" value={child.sex} onChange={e => updateChild(i, 'sex', e.target.value)}>
                                  <option value="">Unknown</option>
                                  <option value="female">Female</option>
                                  <option value="male">Male</option>
                                </select>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Date of Birth *</label>
                              <div className="relative">
                                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                  type="date"
                                  className="input pl-10"
                                  value={child.dateOfBirth}
                                  max={new Date().toISOString().split('T')[0]}
                                  onChange={e => updateChild(i, 'dateOfBirth', e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addChild}
                          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-brand-300 rounded-2xl text-brand-600 text-sm font-bold hover:bg-brand-50 transition-colors"
                        >
                          <Plus size={16} /> Add Child
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-4">Pregnancy Details</div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Pregnancy Weeks</label>
                      <input type="number" min="0" max="42" className="input" placeholder="e.g. 24" value={form.pregnancyWeeks} onChange={e => setForm(f => ({...f, pregnancyWeeks: e.target.value}))} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Risk Factors (Select all that apply)</label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {riskOptions.map((risk) => (
                          <label key={risk} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="checkbox" className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500" checked={form.riskFlags.includes(risk)} onChange={() => toggleRisk(risk)} />
                            <span className="text-sm text-slate-700">{risk}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-tight ml-1">Preferred Language</label>
                      <select className="input bg-white" value={form.preferredLanguage} onChange={e => setForm(f => ({...f, preferredLanguage: e.target.value}))}>
                        <option>Kinyarwanda</option>
                        <option>English</option>
                        <option>French</option>
                      </select>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
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
                        <h4 className="font-bold text-emerald-900">Patient Registered!</h4>
                        <p className="text-emerald-700 text-sm mt-1 leading-relaxed">
                          Share the PIN below with the patient to activate their account.
                        </p>
                      </div>
                    </div>

                    {generatedPin && (
                      <div className="bg-slate-900 rounded-2xl p-5 text-center space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Activation PIN</p>
                        <p className="text-4xl font-black tracking-[0.3em] text-white">{generatedPin}</p>
                        <button
                          type="button"
                          onClick={() => { navigator.clipboard.writeText(generatedPin); setPinCopied(true); setTimeout(() => setPinCopied(false), 2000); }}
                          className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
                        >
                          {pinCopied ? '✓ Copied!' : 'Copy PIN'}
                        </button>
                      </div>
                    )}

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enrollment Summary</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                          <span className="text-slate-500">Name</span>
                          <span className="font-bold text-slate-900">{form.firstName} {form.lastName}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                          <span className="text-slate-500">Phone</span>
                          <span className="font-bold text-slate-900">{form.phone}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                          <span className="text-slate-500">Pregnancy Week</span>
                          <span className="font-bold text-slate-900">{form.pregnancyWeeks || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1 border-b border-slate-50">
                          <span className="text-slate-500">Risk Flags</span>
                          <span className="font-bold text-slate-900">{form.riskFlags.join(', ') || 'None'}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                          <span className="text-slate-500">Children Under 2</span>
                          <span className="font-bold text-slate-900">
                            {form.hasChildUnderTwo ? `${form.existingChildren.filter(c => c.dateOfBirth).length} child(ren) added` : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && <p className="text-sm text-rose-600 font-medium">{error}</p>}

                <div className="flex gap-4 pt-6">
                  {step > 1 && step < 4 && (
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
                    disabled={loading}
                    onClick={() => {
                      if (step < 3) setStep(step + 1);
                      else if (step === 3) handleComplete();
                      else handleClose();
                    }}
                    className="flex-[2] btn-primary py-4 rounded-2xl text-lg font-bold shadow-lg shadow-brand-500/20 disabled:opacity-60"
                  >
                    {loading ? 'Saving...' : step === 4 ? 'Done' : step === 3 ? 'Register Patient' : 'Continue'}
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
