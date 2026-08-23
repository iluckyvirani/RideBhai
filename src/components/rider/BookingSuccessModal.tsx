import React from 'react';
import { CheckCircle2, Ticket, ArrowRight, ShieldCheck } from 'lucide-react';

interface BookingSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewBookings: () => void;
  bookingId: string;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  isOpen,
  onClose,
  onViewBookings,
  bookingId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-[#EBE5D8] animate-scale-in space-y-4">
        {/* Animated Checkmark Icon */}
        <div className="w-20 h-20 rounded-full bg-[#EBF7F0] flex items-center justify-center text-[#2E9E5B] mx-auto ring-8 ring-[#EBF7F0]/50">
          <CheckCircle2 className="w-12 h-12 animate-bounce" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold text-[#2E9E5B] uppercase tracking-wider bg-[#EBF7F0] px-3 py-1 rounded-full">
            Seat Confirmed
          </span>
          <h3 className="font-display font-extrabold text-xl text-[#1C1C1C] mt-2">
            You're All Set! 🎉
          </h3>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Your booking details & boarding OTP are now active in My Bookings.
          </p>
        </div>

        <div className="bg-[#FAF6EE] rounded-2xl p-3 border border-[#EBE5D8] flex items-center justify-between text-xs font-semibold text-[#1C1C1C]">
          <span className="text-[#6B6B6B]">Booking Ref:</span>
          <span className="font-mono font-bold text-[#F15A24]">{bookingId}</span>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onViewBookings();
            }}
            className="w-full py-3.5 rounded-2xl brand-gradient text-white font-extrabold text-xs shadow-md active-press flex items-center justify-center gap-2 hover:opacity-95"
          >
            <Ticket className="w-4 h-4" />
            <span>View My Booking & Boarding OTP</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white text-[#6B6B6B] font-bold text-xs hover:bg-[#FAF6EE]"
          >
            Continue Searching
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#2E9E5B] font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ridebhai 100% On-Time Guarantee</span>
        </div>
      </div>
    </div>
  );
};
