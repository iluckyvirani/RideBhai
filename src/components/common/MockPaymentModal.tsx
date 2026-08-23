import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, Loader2, QrCode, ArrowRight, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MockPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: 'upi' | 'card') => void;
  title: string;
  amount: number;
  itemDescription: string;
}

export const MockPaymentModal: React.FC<MockPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title,
  amount,
  itemDescription,
}) => {
  const [tab, setTab] = useState<'upi' | 'card'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('rohan@oksbi');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardName, setCardName] = useState('Rohan Mehra');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F15A24', '#FF8A00', '#2E9E5B', '#FFB800'],
      });

      setTimeout(() => {
        setIsSuccess(false);
        onSuccess(tab);
        onClose();
      }, 1400);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-[#EBE5D8] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#FAF6EE] px-5 py-4 border-b border-[#EBE5D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#F15A24]/10 flex items-center justify-center text-[#F15A24]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1C1C1C] leading-none">{title}</h3>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5">256-bit Secure Mock Checkout</p>
            </div>
          </div>
          {!isProcessing && !isSuccess && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-[#6B6B6B] active-press"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="py-10 text-center flex flex-col items-center justify-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-[#EBF7F0] flex items-center justify-center text-[#2E9E5B] mb-3">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-lg font-extrabold text-[#1C1C1C]">Payment Successful!</h4>
              <p className="text-xs text-[#6B6B6B] mt-1">₹{amount} paid successfully</p>
              <span className="mt-3 text-[11px] text-[#2E9E5B] font-semibold bg-[#EBF7F0] px-3 py-1 rounded-full">
                Transaction ID: RB{Math.floor(10000000 + Math.random() * 90000000)}
              </span>
            </div>
          ) : isProcessing ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#F15A24] animate-spin mb-4" />
              <h4 className="font-bold text-base text-[#1C1C1C]">Processing Simulated Payment...</h4>
              <p className="text-xs text-[#6B6B6B] mt-1">Communicating with bank mock gateway</p>
            </div>
          ) : (
            <>
              {/* Amount Box */}
              <div className="bg-[#FAF6EE] rounded-2xl p-4 border border-[#EBE5D8] flex items-center justify-between mb-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B6B6B]">Amount to Pay</span>
                  <p className="text-xs text-[#1C1C1C] font-medium line-clamp-1">{itemDescription}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#F15A24]">₹{amount}</span>
                  <p className="text-[10px] text-[#2E9E5B] font-semibold">Zero convenience fee</p>
                </div>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 gap-2 bg-[#F2EDE2] p-1 rounded-xl mb-4 text-xs font-bold">
                <button
                  onClick={() => setTab('upi')}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'upi' ? 'bg-white text-[#F15A24] shadow-sm' : 'text-[#6B6B6B]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  UPI / QR Code
                </button>
                <button
                  onClick={() => setTab('card')}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'card' ? 'bg-white text-[#F15A24] shadow-sm' : 'text-[#6B6B6B]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Debit / Credit Card
                </button>
              </div>

              {/* UPI Tab */}
              {tab === 'upi' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#1C1C1C]">Select UPI App:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'gpay', name: 'Google Pay', icon: '🔵 Google Pay' },
                      { id: 'phonepe', name: 'PhonePe', icon: '🟣 PhonePe' },
                      { id: 'paytm', name: 'Paytm', icon: '🔷 Paytm' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedUpiApp(app.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          selectedUpiApp === app.id
                            ? 'border-[#F15A24] bg-[#FFF0EB] text-[#F15A24] font-bold ring-1 ring-[#F15A24]'
                            : 'border-[#EBE5D8] bg-white text-[#1C1C1C]'
                        }`}
                      >
                        {app.name}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#6B6B6B] block mb-1">Enter Virtual Payment Address (VPA)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@bank"
                        className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24]"
                      />
                      <span className="absolute right-3 top-2.5 text-[10px] text-[#2E9E5B] font-bold bg-[#EBF7F0] px-1.5 py-0.5 rounded">
                        VERIFIED
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-[#EBF7F0] rounded-xl border border-[#B8E6CB] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#2E9E5B] flex-shrink-0" />
                    <span className="text-[11px] text-[#2E9E5B] font-medium leading-tight">
                      Instant Mock Simulation: Click Pay below to instantly complete.
                    </span>
                  </div>
                </div>
              )}

              {/* Card Tab */}
              {tab === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#6B6B6B] block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24] font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-[#6B6B6B] block mb-1">Valid Thru (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24] font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#6B6B6B] block mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24] font-mono text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#6B6B6B] block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24]"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* CTA Button */}
        {!isSuccess && !isProcessing && (
          <div className="p-4 bg-white border-t border-[#EBE5D8]">
            <button
              onClick={handlePay}
              className="w-full py-3.5 rounded-xl brand-gradient text-white font-bold text-sm shadow-md active-press flex items-center justify-center gap-2 hover:opacity-95"
            >
              <span>Pay ₹{amount}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-[#6B6B6B] mt-2 flex items-center justify-center gap-1">
              <Lock className="w-3 h-3 text-[#2E9E5B]" />
              Demo Mock Gateway — No real money will be charged
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
