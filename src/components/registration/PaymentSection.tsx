
import React from 'react';
import { PAYMENT_OPTIONS } from '../../constants/registration';
import { ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const PaymentSection: React.FC = () => {
  const handlePayClick = (option: typeof PAYMENT_OPTIONS[0]) => {
    if (option.paymentLink) {
      // Direct redirect to Stripe Payment Link
      window.open(option.paymentLink, '_blank');
    } else {
      console.error('Payment link not configured for:', option.title);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {PAYMENT_OPTIONS.map((option, idx) => (
        <div 
          key={idx}
          className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
        >
          <div className="mb-6">
            <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${
              option.level.includes('1') ? 'bg-emerald-500/10 text-emerald-500' :
              option.level.includes('2') ? 'bg-sky-500/10 text-sky-500' :
              'bg-rose-500/10 text-rose-500'
            }`}>
              {option.level.includes('Workshop') ? <Zap className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <h3 className="text-xl font-bold mb-1">{option.title}</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{option.sessions}</span>
          </div>

          <div className="mt-auto">
            <div className="mb-6">
              <span className="text-3xl font-black text-white">{option.price.split(' ')[0]}</span>
              <span className="text-slate-400 text-sm ml-2">CAD + HST</span>
            </div>

            <button
              onClick={() => handlePayClick(option)}
              className="w-full py-4 rounded-2xl bg-slate-800 group-hover:bg-indigo-600 text-white font-bold transition-all flex items-center justify-center gap-2 overflow-hidden relative"
            >
              <span className="relative z-10">Select Package</span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
