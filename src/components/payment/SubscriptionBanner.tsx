import { useEffect, useState } from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import paymentService, { type Subscription } from '../../services/paymentService';

interface SubscriptionBannerProps {
  onRenew: () => void;
}

export const SubscriptionBanner = ({ onRenew }: SubscriptionBannerProps) => {
  const [sub, setSub] = useState<Subscription | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    paymentService.getSubscription().then(setSub).catch(() => {});
  }, []);

  if (dismissed || !sub) return null;

  const isExpired = !sub.active;
  const isExpiringSoon = sub.active && sub.daysLeft <= 7;

  if (!isExpired && !isExpiringSoon) return null;

  return (
    <div className={`flex items-center gap-3 px-6 py-3 text-sm font-medium ${
      isExpired ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
    }`}>
      <AlertTriangle size={16} className="flex-shrink-0" />
      <span className="flex-1">
        {isExpired
          ? 'Your subscription has expired. Renew now to continue accessing all features.'
          : `Your subscription expires in ${sub.daysLeft} day${sub.daysLeft === 1 ? '' : 's'}. Renew to avoid interruption.`
        }
      </span>
      <button
        onClick={onRenew}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
          isExpired ? 'bg-white text-rose-600 hover:bg-rose-50' : 'bg-white text-amber-600 hover:bg-amber-50'
        }`}
      >
        <RefreshCw size={12} /> Renew Now
      </button>
      <button onClick={() => setDismissed(true)} className="p-1 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};
