import React, { useState } from 'react';
import { IndianRupee, TrendingUp, Sparkles, CheckCircle2, Zap, ArrowRight, Car } from 'lucide-react';

interface EarningsCalculatorProps {
  onRegisterDriver: () => void;
}

const SAMPLE_ROUTES = [
  { from: 'Delhi NCR', to: 'Jaipur', dist: 280, basePrice: 480 },
  { from: 'Delhi NCR', to: 'Agra', dist: 210, basePrice: 380 },
  { from: 'Delhi NCR', to: 'Chandigarh', dist: 250, basePrice: 450 },
  { from: 'Delhi NCR', to: 'Dehradun', dist: 260, basePrice: 500 },
  { from: 'Mumbai', to: 'Pune', dist: 150, basePrice: 320 },
  { from: 'Bengaluru', to: 'Mysuru', dist: 145, basePrice: 300 },
];

export const EarningsCalculator: React.FC<EarningsCalculatorProps> = ({ onRegisterDriver }) => {
  const [selectedRouteIdx, setSelectedRouteIdx] = useState(0);
  const [seats, setSeats] = useState(3);
  const [tripsPerWeek, setTripsPerWeek] = useState(3);
  const [withBoost, setWithBoost] = useState(true);

  const route = SAMPLE_ROUTES[selectedRouteIdx];
  const perTripEarnings = route.basePrice * seats;
  const weeklyEarnings = perTripEarnings * tripsPerWeek;
  const monthlyEarnings = weeklyEarnings * 4.2;
  const annualEarnings = monthlyEarnings * 12;

  return (
    <section id="earnings-calculator" className="py-20 bg-gradient-to-b from-[#FAF6EE] to-[#FFF5F0] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FFD8CB]">
            <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
            <span className="text-[11px] font-extrabold text-[#F15A24] uppercase tracking-wider">
              Driver Monetization & Earnings
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] font-display">
            How Much Can You <span className="text-gradient">Earn with Ride Bhai?</span>
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Turn your daily commute and weekend highway drives into recurring income. Cover 100% of fuel and toll costs with verified passengers.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-card space-y-6">
            <h3 className="text-lg font-extrabold text-[#1C1C1C] flex items-center gap-2">
              <Car className="w-5 h-5 text-[#F15A24]" />
              <span>Customize Your Travel Route & Capacity</span>
            </h3>

            {/* Route Selection */}
            <div>
              <label className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider block mb-2">
                Select Typical Travel Route
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {SAMPLE_ROUTES.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedRouteIdx(idx)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      selectedRouteIdx === idx
                        ? 'border-[#F15A24] bg-[#FFF5F0] shadow-xs'
                        : 'border-[#EBE5D8] bg-[#FAF6EE] hover:border-[#6B6B6B]'
                    }`}
                  >
                    <p className="text-xs font-extrabold text-[#1C1C1C] leading-tight">
                      {r.from} → {r.to}
                    </p>
                    <p className="text-[10px] text-[#6B6B6B] mt-1">
                      ₹{r.basePrice}/seat • {r.dist} km
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Seats Offered Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">
                  Empty Seats to Share
                </label>
                <span className="text-sm font-extrabold text-[#F15A24] bg-[#FFF0EB] px-2.5 py-0.5 rounded-lg border border-[#FFD8CB]">
                  {seats} Seats
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full h-2 bg-[#FAF6EE] rounded-lg appearance-none cursor-pointer accent-[#F15A24]"
              />
              <div className="flex justify-between text-[10px] text-[#6B6B6B] font-bold mt-1">
                <span>1 Seat</span>
                <span>2 Seats</span>
                <span>3 Seats</span>
                <span>4 Seats (Max)</span>
              </div>
            </div>

            {/* Trips per Week */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">
                  Rides Posted Per Week
                </label>
                <span className="text-sm font-extrabold text-[#F15A24] bg-[#FFF0EB] px-2.5 py-0.5 rounded-lg border border-[#FFD8CB]">
                  {tripsPerWeek} Trips / week
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
              <div className="flex justify-between text-[10px] text-[#6B6B6B] font-bold mt-1">
                <span>1 Trip</span>
                <span>3 Trips</span>
                <span>5 Trips</span>
                <span>7 Trips (Daily)</span>
              </div>
            </div>

            {/* Boost Toggle */}
            <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#FDE68A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#F7C948] text-[#1C1C1C] flex items-center justify-center font-bold text-xs">
                  ★
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#1C1C1C]">
                    With Driver Boost Package
                  </p>
                  <p className="text-[10px] text-[#6B6B6B]">
                    Pins your ride to top of search + displays direct mobile call button (3x booking rate).
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWithBoost(!withBoost)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  withBoost ? 'bg-[#00A86B]' : 'bg-[#D1D5DB]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    withBoost ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Earnings Projection Card */}
          <div className="lg:col-span-5 bg-[#1C1C1C] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#F15A24]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-[#FF7A45] tracking-wider uppercase">
                  Estimated Earnings
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-white/90">
                  <TrendingUp className="w-3 h-3 text-[#00A86B]" />
                  0% Heavy Commission
                </span>
              </div>

              {/* Huge Monthly Figure */}
              <div className="py-2 border-b border-white/10">
                <p className="text-xs text-white/70">Estimated Monthly Income</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-[#FF7A45]">₹</span>
                  <span className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
                    {Math.round(monthlyEarnings).toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-white/60 font-bold">/month</span>
                </div>
                <p className="text-[11px] text-[#00A86B] font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Covers 100% of fuel & toll expenses + profit
                </p>
              </div>

              {/* Metric Breakdown */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-white/60">Per Single Trip</p>
                  <p className="text-base font-extrabold text-white mt-0.5">
                    ₹{perTripEarnings.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                  <p className="text-[10px] text-white/60">Annual Potential</p>
                  <p className="text-base font-extrabold text-[#F7C948] mt-0.5">
                    ₹{Math.round(annualEarnings).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Benefits list */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <div className="w-4 h-4 rounded-full bg-[#00A86B]/20 text-[#00A86B] flex items-center justify-center text-[10px]">✓</div>
                  <span>Instant UPI payouts directly to your account</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <div className="w-4 h-4 rounded-full bg-[#00A86B]/20 text-[#00A86B] flex items-center justify-center text-[10px]">✓</div>
                  <span>Verified Aadhaar passengers with pickup OTP</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <div className="w-4 h-4 rounded-full bg-[#00A86B]/20 text-[#00A86B] flex items-center justify-center text-[10px]">✓</div>
                  <span>You choose who rides: Accept or decline requests</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={onRegisterDriver}
                className="w-full py-4 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 active-press"
              >
                <span>Register as Driver & Post a Ride</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
