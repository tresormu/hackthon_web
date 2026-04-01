import { useEffect, useRef, useState } from 'react';
import { Key, Phone, X, Copy, Check, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dashboardService, { type PinAlert } from '../../services/dashboardService';

const API_URL = import.meta.env.VITE_APP_API_URL;
const SSE_URL = `${API_URL}/dashboard/sse`;

export const PinAlertsPanel = () => {
  const [alerts, setAlerts] = useState<PinAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);

  // Load existing undismissed alerts on mount
  useEffect(() => {
    dashboardService.getAlerts()
      .then(setAlerts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Open SSE connection — push new alerts in real time
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (!API_URL) {
      console.error('VITE_APP_API_URL is not set; SSE connection skipped.');
      return;
    }

    // EventSource doesn't support custom headers — pass token as query param
    const url = `${SSE_URL}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);
    esRef.current = es;

    es.addEventListener('pin_alert', (e: MessageEvent) => {
      try {
        const alert: PinAlert = JSON.parse(e.data);
        // Map backend payload to PinAlert shape
        setAlerts(prev => {
          // Avoid duplicates if alert was already loaded via REST
          if (prev.some(a => a._id === alert._id)) return prev;
          return [{ ...alert, dismissed: false }, ...prev];
        });
      } catch {
        // ignore malformed events
      }
    });

    es.onerror = () => {
      // SSE will auto-reconnect; no action needed
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);

  const handleDismiss = async (id: string) => {
    try {
      await dashboardService.dismissAlert(id);
      setAlerts(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (pin: string, id: string) => {
    navigator.clipboard.writeText(pin);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading || alerts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card border border-amber-200 bg-amber-50/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-100 rounded-xl">
          <Bell className="text-amber-600" size={18} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900">Patient Activation PINs</h3>
          <p className="text-xs text-slate-500">Share these PINs with patients to activate their mobile accounts.</p>
        </div>
        <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {alerts.length} pending
        </span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10, height: 0 }}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{alert.motherName}</p>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                  <Phone size={11} />
                  <span>{alert.motherPhone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl">
                <Key size={14} className="text-brand-400" />
                <span className="text-white font-black tracking-[0.2em] text-sm">{alert.pinCode}</span>
              </div>

              <button
                onClick={() => handleCopy(alert.pinCode, alert._id)}
                className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                title="Copy PIN"
              >
                {copied === alert._id
                  ? <Check size={16} className="text-emerald-500" />
                  : <Copy size={16} />
                }
              </button>

              <button
                onClick={() => handleDismiss(alert._id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Dismiss alert"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Dismiss after sharing the PIN with the patient. New alerts appear instantly.
      </p>
    </motion.div>
  );
};
