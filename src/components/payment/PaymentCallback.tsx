import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import paymentService from '../../services/paymentService';

interface PaymentCallbackProps {
  txRef: string;
  onSuccess: () => void;
  onFailure: () => void;
}

export const PaymentCallback = ({ txRef, onSuccess, onFailure }: PaymentCallbackProps) => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [planName] = useState(() => sessionStorage.getItem('pending_planName') ?? '');

  useEffect(() => {
    const verify = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const flwStatus = params.get('status');
        const flwId = params.get('transaction_id') ?? undefined;
        // Use tx_ref from URL directly — this is the real one Flutterwave appended
        const ref = params.get('tx_ref') ?? txRef;

        if (flwStatus !== 'successful') {
          setStatus('failed');
          return;
        }

        const result = await paymentService.verifyPayment(ref, flwId);
        if (result.status === 'completed') {
          sessionStorage.removeItem('pending_txRef');
          sessionStorage.removeItem('pending_planName');
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch {
        setStatus('failed');
      }
    };
    verify();
  }, [txRef]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        {status === 'verifying' && (
          <>
            <Loader className="animate-spin text-brand-500 mx-auto mb-6" size={48} />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Payment</h2>
            <p className="text-slate-500">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-white" size={40} />
              </div>
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
            {planName && (
              <p className="text-brand-600 font-semibold mb-2">{planName} Plan activated</p>
            )}
            <p className="text-slate-500 mb-8">Your hospital account is now fully set up. Welcome to MamaCare+!</p>
            <button onClick={onSuccess}
              className="btn-primary px-8 py-3 rounded-xl font-bold text-lg w-full">
              Go to Dashboard
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="text-rose-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Failed</h2>
            <p className="text-slate-500 mb-8">We couldn't verify your payment. You can try again or skip for now.</p>
            <div className="flex gap-3">
              <button onClick={onFailure}
                className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50">
                Try Again
              </button>
              <button onClick={onSuccess}
                className="flex-1 btn-primary py-3 rounded-xl font-bold">
                Skip to Dashboard
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
