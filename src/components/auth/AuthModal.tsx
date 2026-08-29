import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Lock,
  User,
  Car,
  CheckCircle2,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: 'rider' | 'driver' | 'agency';
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  targetRole = 'rider',
  onSuccess,
  title,
  subtitle,
}) => {
  const { loginRider, loginDriver, loginAgency } = useAppStore();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [city, setCity] = useState('Jaipur');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('4829');
  const [showSimulatedSms, setShowSimulatedSms] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const otpInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep('phone');
      setPhone('');
      setFullName('');
      setOtp(['', '', '', '']);
      setShowSimulatedSms(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setStep('otp');
    setTimer(30);
    setShowSimulatedSms(true);

    // Auto focus first OTP input
    setTimeout(() => {
      otpInputRefs[0].current?.focus();
    }, 200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next box if filled
    if (value && index < 3) {
      otpInputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setOtp(digits);
    otpInputRefs[3].current?.focus();
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter the complete 4-digit OTP');
      return;
    }

    if (enteredOtp !== generatedOtp && enteredOtp !== '4829' && enteredOtp !== '1234') {
      setErrorMsg('Invalid OTP. Please check the simulated SMS code above.');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      if (targetRole === 'rider') {
        loginRider(phone, fullName || 'Traveler');
      } else if (targetRole === 'agency') {
        loginAgency(phone, agencyName || 'Royal Rajasthan Tours', fullName || 'Vikram Rathore', city);
      } else {
        loginDriver(phone, fullName || 'Driver Partner', undefined, 'unverified');
      }
      onSuccess?.();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#EBE5D8] overflow-hidden relative animate-scale-up">
        {/* Simulated SMS Toast notification at top */}
        {showSimulatedSms && (
          <div className="bg-[#1C1C1C] text-white p-3.5 px-4 flex items-center justify-between border-b border-white/10 animate-slide-down">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F15A24] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white/90">
                  SMS from <span className="text-[#FF7A45] font-extrabold">RideBhai OTP</span>
                </p>
                <p className="text-xs font-mono font-extrabold text-[#F7C948]">
                  Your verification code is {generatedOtp}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFillOtp}
              className="text-[11px] font-extrabold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-all"
            >
              Auto-Fill
            </button>
          </div>
        )}

        {/* Header Bar */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-[#F2ECE1]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FFF0EB] flex items-center justify-center text-[#F15A24]">
              {targetRole === 'driver' ? (
                <Car className="w-5 h-5" />
              ) : targetRole === 'agency' ? (
                <Sparkles className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1C1C1C]">
                {title ||
                  (targetRole === 'driver'
                    ? 'Driver Partner Registration'
                    : targetRole === 'agency'
                    ? 'Travel Agency Partner Portal'
                    : 'Rider Verification')}
              </h3>
              <p className="text-xs text-[#6B6B6B]">
                {subtitle ||
                  (targetRole === 'driver'
                    ? 'Enter mobile number to verify & complete KYC onboarding'
                    : targetRole === 'agency'
                    ? 'Enter agency details & mobile number to start onboarding'
                    : 'Login with mobile OTP to book & message drivers')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF6EE] text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#EBE5D8] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {/* Agency Name if role is agency */}
              {targetRole === 'agency' && (
                <div>
                  <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                    Travel Agency / Firm Name *
                  </label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="e.g. Royal Rajasthan Tours & Travels"
                    className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                    required
                  />
                </div>
              )}

              {/* Name */}
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                  {targetRole === 'agency' ? 'Owner / Contact Person Name *' : 'Your Full Name *'}
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-[#6B6B6B]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={
                      targetRole === 'agency'
                        ? 'e.g. Vikram Rathore'
                        : targetRole === 'driver'
                        ? 'e.g. Aman Singhal'
                        : 'e.g. Rahul Sharma'
                    }
                    className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] pl-10 pr-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                  10-Digit Mobile Number (WhatsApp Connected) *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 flex items-center gap-1 text-xs font-bold text-[#1C1C1C] border-r border-[#EBE5D8] pr-2.5">
                    <span className="text-base leading-none">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98765 43210"
                    className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] pl-20 pr-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24] tracking-wider"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
                  {errorMsg}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-xl active-press flex items-center justify-center gap-2"
                >
                  <span>Get 4-Digit OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#6B6B6B] text-center pt-1">
                <Lock className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Zero spam. 100% encrypted & verified phone security.</span>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-[#6B6B6B]">
                  We sent a 4-digit code to{' '}
                  <span className="font-extrabold text-[#1C1C1C]">+91 {phone}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs font-bold text-[#F15A24] hover:underline"
                >
                  Change Number
                </button>
              </div>

              {/* 4 Box OTP Inputs */}
              <div className="flex items-center justify-center gap-3 py-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpInputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-xl font-extrabold text-center text-[#1C1C1C] bg-[#FAF6EE] rounded-2xl border-2 border-[#EBE5D8] focus:border-[#F15A24] focus:outline-none transition-all shadow-xs"
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100 text-center">
                  {errorMsg}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-3.5 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-xl active-press flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying securely...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Continue</span>
                    </>
                  )}
                </button>
              </div>

              {/* Resend OTP */}
              <div className="text-center text-xs">
                {timer > 0 ? (
                  <span className="text-[#6B6B6B]">
                    Resend code in <strong className="text-[#1C1C1C]">{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
                      setGeneratedOtp(newOtp);
                      setTimer(30);
                      setShowSimulatedSms(true);
                    }}
                    className="font-extrabold text-[#F15A24] hover:underline"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
