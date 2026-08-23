import React, { useState } from 'react';
import {
  IndianRupee,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  Car,
  Award,
  FileText,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const DriverEarningsView: React.FC = () => {
  const { bookings, currentDriver, rides } = useAppStore();
  const [downloading, setDownloading] = useState(false);

  const completed = bookings.filter(
    (b) => b.driverId === currentDriver.id && b.status === 'completed'
  );

  const totalCalculated = completed.reduce((sum, b) => sum + b.totalPrice, 0) + 3840;

  const handleDownloadReceipt = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('📄 Simulated Driver Tax & Payout Statement downloaded to your device!');
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Earnings Overview Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card text-center relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B]">
            Total Accumulated Payout
          </span>
          <h2 className="text-3xl font-extrabold text-[#F15A24] font-display">
            ₹{totalCalculated}
          </h2>
          <p className="text-xs text-[#2E9E5B] font-semibold flex items-center justify-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            +18% higher with Boost Subscriptions
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#F2ECE1]">
          <div className="bg-[#FAF6EE] p-2.5 rounded-2xl">
            <span className="text-sm font-extrabold text-[#1C1C1C]">{completed.length + 8}</span>
            <span className="text-[10px] text-[#6B6B6B] font-bold block">Trips Completed</span>
          </div>

          <div className="bg-[#FAF6EE] p-2.5 rounded-2xl">
            <span className="text-sm font-extrabold text-[#2E9E5B]">₹0.00</span>
            <span className="text-[10px] text-[#6B6B6B] font-bold block">Pending Settlement</span>
          </div>
        </div>
      </div>

      {/* Download Statement */}
      <button
        onClick={handleDownloadReceipt}
        disabled={downloading}
        className="w-full py-3 rounded-2xl bg-white border border-[#EBE5D8] text-[#1C1C1C] font-extrabold text-xs shadow-xs active-press flex items-center justify-center gap-2 hover:bg-[#FAF6EE]"
      >
        <FileText className="w-4 h-4 text-[#F15A24]" />
        <span>{downloading ? 'Generating Statement...' : 'Download Payout Receipt (Simulate)'}</span>
        <Download className="w-3.5 h-3.5 text-[#6B6B6B]" />
      </button>

      {/* Trip Payout Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider px-1">
          Recent Trip Payouts
        </h3>

        <div className="space-y-2">
          {[
            { route: 'Delhi NCR → Jaipur', date: '22 Aug', amount: 960, seats: 2 },
            { route: 'Delhi NCR → Agra', date: '18 Aug', amount: 780, seats: 2 },
            { route: 'Jaipur → Delhi NCR', date: '14 Aug', amount: 1350, seats: 3 },
            { route: 'Delhi NCR → Chandigarh', date: '10 Aug', amount: 750, seats: 2 },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-3.5 border border-[#EBE5D8] flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] flex items-center justify-center text-[#2E9E5B]">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#1C1C1C]">{item.route}</h4>
                  <p className="text-[10px] text-[#6B6B6B]">{item.date} • {item.seats} Seats</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-[#2E9E5B]">+₹{item.amount}</span>
                <span className="text-[9px] text-[#9E9E9E] block font-semibold">Direct UPI</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
