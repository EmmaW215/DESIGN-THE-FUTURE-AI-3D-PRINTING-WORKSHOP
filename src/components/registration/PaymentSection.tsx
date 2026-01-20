
import React, { useState } from 'react';
import { PAYMENT_OPTIONS } from '../../constants/registration';
import { CreditCard, ShieldCheck, Zap, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export const PaymentSection: React.FC = () => {
  const [activePayment, setActivePayment] = useState<typeof PAYMENT_OPTIONS[0] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayClick = (option: typeof PAYMENT_OPTIONS[0]) => {
    setActivePayment(option);
    setIsProcessing(false);
    setIsSuccess(false);
  };

  const simulateCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => setActivePayment(null), 2500);
    }, 2000);
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

      {/* Stripe Modal Simulation */}
      {activePayment && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_0_100px_rgba(79,70,229,0.3)]">
            {/* Stripe Header */}
            <div className="bg-[#635BFF] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="font-bold tracking-tight">Stripe Checkout</span>
              </div>
              <button 
                onClick={() => setActivePayment(null)} 
                className="text-white/60 hover:text-white"
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>

            <div className="p-8">
              {!isSuccess ? (
                <>
                  <div className="mb-8">
                    <p className="text-slate-500 font-medium mb-1">Pay Design The Future</p>
                    <div className="text-4xl font-bold">{activePayment.price.split(' ')[0]}</div>
                    <div className="text-slate-400 text-sm mt-1">CAD + HST (13%)</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-slate-700">Email address</label>
                      <input type="email" defaultValue="user@example.com" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-[#635BFF]" />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-slate-700">Card information</label>
                      <div className="border border-slate-300 rounded overflow-hidden">
                        <input type="text" placeholder="1234 5678 9123 0000" className="w-full px-3 py-2 text-sm focus:outline-none" />
                        <div className="flex border-t border-slate-300">
                          <input type="text" placeholder="MM / YY" className="w-1/2 px-3 py-2 text-sm border-r border-slate-300 focus:outline-none" />
                          <input type="text" placeholder="CVC" className="w-1/2 px-3 py-2 text-sm focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 pt-2">
                      <label className="text-sm font-semibold text-slate-700">Name on card</label>
                      <input type="text" placeholder="Jane Doe" className="border border-slate-300 rounded px-3 py-2 text-sm focus:outline-[#635BFF]" />
                    </div>

                    <button
                      onClick={simulateCheckout}
                      disabled={isProcessing}
                      className="w-full mt-6 bg-[#635BFF] hover:bg-[#5b52e0] text-white py-3 rounded font-bold transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ${activePayment.price.split(' ')[0]}`
                      )}
                    </button>

                    <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest mt-4">
                      Powered by Stripe | Secure Payment
                    </p>
                  </div>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                  <p className="text-slate-500 mb-8">
                    We've sent a confirmation email to your inbox. Get ready to design the future!
                  </p>
                  <div className="text-sm font-bold text-[#635BFF]">Redirecting you back...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
