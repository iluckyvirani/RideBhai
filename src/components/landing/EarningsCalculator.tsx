import React, { useState } from 'react';
import { TrendingUp, Sparkles, CheckCircle2, ArrowRight, Car } from 'lucide-react';

interface EarningsCalculatorProps {
  onRegisterDriver: () => void;
}

const SAMPLE_ROUTES = [
  { from: 'Delhi NCR', to: 'Jaipur', dist: 280, fullCar: 5200 },
  { from: 'Delhi NCR', to: 'Agra', dist: 210, fullCar: 3900 },
  { from: 'Jaipur', to: 'Udaipur', dist: 400, fullCar: 6500 },
  { from: 'Mumbai', to: 'Pune', dist: 150, fullCar: 3900 },
  { from: 'Bangalore', to: 'Mysore', dist: 145, fullCar: 4200 },
  { from: 'Dehradun', to: 'Delhi NCR', dist: 260, fullCar: 6100 },
];

export const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({ onRegisterDriver }) => {
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [tripsPerWeek, setTripsPerWeek] = useState(3);

  const route = SAMPLE_ROUTES[selectedRouteIdx];
  const perTripEarnings = route.fullCar;
  const weeklyEarnings = perTripEarnings * tripsPerWeek;
  const monthlyEarnings = weeklyEarnings * 4.2;
  const annualEarnings = monthlyEarnings * 12;

  return (
    <section id="earnings-calculator" className="py-20 bg-gradient-to-b from-[#FAF6EE] to-[#FFF5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FFD8CB]">
            <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
            <span className="text-[11px] font-extrabold text-[#F15A24] uppercase tracking-wider">
              Partner earnings
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] font-display">
            What a <span className="text-gradient">full-car hire</span> can earn
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Customers book in chat or Deal with Ride Bhai. You only pay Ride Bhai for a posting package.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-card space-y-6">
            <h3 className="text-lg font-extrabold text-[#1C1C1C] flex items-center gap-2">
              <Car className="w-5 h-5 text-[#F15A24]" />
              Typical full-car routes
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {SAMPLE_ROUTES.map((r, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedRouteIdx(idx)}
                  className={`p-3 rounded-2xl text-left border ${
                    selectedRouteIdx === idx
                      ? 'border-[#F15A24] bg-[#FFF5F0]'
                      : 'border-[#EBE5D8] bg-[#FAF6EE]'
                  }`}
                >
                  <p className="text-xs font-extrabold text-[#1C1C1C] leading-tight">
                    {r.from} → {r.to}
                  </p>
                  <p className="text-[10px] text-[#6B6B6B] mt-1">
                    ₹{r.fullCar.toLocaleString('en-IN')} full car · {r.dist} km
                  </p>
                </button>
              ))}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">
                  Full-car hires per week
                </label>
                <span className="text-sm font-extrabold text-[#F15A24] bg-[#FFF0EB] px-2.5 py-0.5 rounded-lg">
                  {tripsPerWeek} / week
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={tripsPerWeek}
                onChange={(e) => setTripsPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-[#FAF6EE] rounded-lg appearance-none cursor-pointer accent-[#F15A24]"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#1C1C1C] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-[#FF7A45] uppercase">Estimate</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3 text-[#00A86B]" />
                Paid to you directly
              </span>
            </div>
            <div className="py-4 border-b border-white/10">
              <p className="text-xs text-white/70">Monthly if you close these hires</p>
              <p className="text-4xl sm:text-5xl font-extrabold font-display mt-1">
                ₹{Math.round(monthlyEarnings).toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-[#00A86B] font-bold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ₹{perTripEarnings.toLocaleString('en-IN')} per full car · {route.from} → {route.to}
              </p>
            </div>
            <p className="text-xs text-white/70 mt-4">
              Annual potential ≈ ₹{Math.round(annualEarnings).toLocaleString('en-IN')}
            </p>
            <button
              type="button"
              onClick={onRegisterDriver}
              className="w-full mt-6 py-4 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2"
            >
              Login with OTP
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
