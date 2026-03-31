import { useState } from 'react';
import { CreditCard, Smartphone, QrCode, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PaymentPlan } from '../../types/payment';

interface CheckoutFormProps {
  plan: PaymentPlan;
  billingCycle: 'monthly' | 'yearly';
  onPaymentSuccess: () => void;
  onBack: () => void;
}

export const CheckoutForm = ({ plan, billingCycle, onPaymentSuccess, onBack }: CheckoutFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'venmo' | 'apple' | 'google'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
    email: '',
    phone: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard size={20} />,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">P</div>,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'venmo',
      name: 'Venmo',
      icon: <div className="w-5 h-5 bg-[#3D95CE] rounded flex items-center justify-center text-white text-xs font-bold">V</div>,
      description: 'Pay with Venmo'
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: <div className="w-5 h-5 bg-black rounded flex items-center justify-center text-white text-xs"></div>,
      description: 'Pay with Apple Pay'
    },
    {
      id: 'google',
      name: 'Google Pay',
      icon: <div className="w-5 h-5 bg-[#4285F4] rounded flex items-center justify-center text-white text-xs font-bold">G</div>,
      description: 'Pay with Google Pay'
    }
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate success
    onPaymentSuccess();
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="input"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="input"
                  value={formData.expiry}
                  onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  className="input"
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name on Card</label>
              <input
                type="text"
                placeholder="John Doe"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>
        );
      
      case 'paypal':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">P</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay with PayPal</h3>
            <p className="text-slate-600 mb-6">You'll be redirected to PayPal to complete your payment</p>
            <button
              onClick={handlePayment}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue with PayPal
            </button>
          </div>
        );
      
      case 'venmo':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#3D95CE] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">V</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay with Venmo</h3>
            <p className="text-slate-600 mb-6">Scan the QR code or open Venmo to pay</p>
            <div className="w-32 h-32 bg-slate-100 rounded-lg mx-auto mb-6 flex items-center justify-center">
              <QrCode size={64} className="text-slate-400" />
            </div>
            <button
              onClick={handlePayment}
              className="bg-[#3D95CE] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2E7BA8] transition-colors"
            >
              Complete Payment
            </button>
          </div>
        );
      
      case 'apple':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl"></span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay with Apple Pay</h3>
            <p className="text-slate-600 mb-6">Use Touch ID or Face ID to pay</p>
            <button
              onClick={handlePayment}
              className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              Pay with Apple Pay
            </button>
          </div>
        );
      
      case 'google':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#4285F4] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">G</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Pay with Google Pay</h3>
            <p className="text-slate-600 mb-6">Use your saved Google payment methods</p>
            <button
              onClick={handlePayment}
              className="bg-[#4285F4] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#3367D6] transition-colors"
            >
              Pay with Google Pay
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Order Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-slate-900">{plan.name} Plan</h4>
            <p className="text-sm text-slate-600">{billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} billing</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">${plan.price}</p>
            <p className="text-sm text-slate-600">/{billingCycle === 'monthly' ? 'month' : 'year'}</p>
          </div>
        </div>
        {billingCycle === 'yearly' && (
          <div className="bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium">
            You're saving 20% with yearly billing!
          </div>
        )}
      </motion.div>

      {/* Payment Methods */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-6"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Method</h3>
        <div className="space-y-3 mb-6">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                selectedMethod === method.id
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                {method.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-slate-900">{method.name}</p>
                <p className="text-sm text-slate-600">{method.description}</p>
              </div>
              {selectedMethod === method.id && (
                <Check className="w-5 h-5 text-brand-600" />
              )}
            </button>
          ))}
        </div>

        {/* Payment Form */}
        {renderPaymentForm()}
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4"
      >
        <button
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        {selectedMethod === 'card' ? (
          <button
            onClick={handlePayment}
            disabled={isProcessing || !formData.cardNumber || !formData.expiry || !formData.cvv || !formData.name}
            className="flex-1 bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : `Pay $${plan.price}`}
          </button>
        ) : null}
      </motion.div>
    </div>
  );
};
