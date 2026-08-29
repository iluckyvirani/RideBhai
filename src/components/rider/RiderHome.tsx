import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRightLeft, Sparkles, Shield, Star, Award } from 'lucide-react';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import { Logo } from '../common/Logo';

interface RiderHomeProps {
  onSearch: (params: { fromCity: string; toCity: string; date: string; seats: number }) => void;
  onSelectRide: (rideId: string) => void;
}

export const RiderHome: React.FC<RiderHomeProps> = ({ onSearch, onSelectRide }) => {
  const [fromCity, setFromCity] = useState('Delhi NCR');
  const [toCity, setToCity] = useState('Jaipur');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [seats, setSeats] = useState(1);
  const [showFromSuggest, setShowFromSuggest] = useState(false);
  const [showToSuggest, setShowToSuggest] = useState(false);

  const { getRankedRides, drivers, isDriverBoosted } = useAppStore();

  const featuredRides = getRankedRides({ fromCity: '', toCity: '' }).filter((r) => r.isFeatured).slice(0, 3);
  const boostedDriversCount = drivers.filter((d) => isDriverBoosted(d.id)).length;

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ fromCity, toCity, date, seats });
  };

  const selectQuickRoute = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
    onSearch({ fromCity: from, toCity: to, date, seats });
  };

  return (
    <div className="space-y-5 pb-32 animate-fade-in">
      {/* Hero Banner with Warm Orange Branding */}
      <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#FFF5F0] to-[#FFEBE3] border border-[#FFD8CB] overflow-hidden shadow-card">
        <div className="relative z-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 shadow-xs border border-[#FFD8CB]">
            <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
            <span className="text-[10px] font-extrabold text-[#F15A24] uppercase tracking-wider">
              {boostedDriversCount}+ Featured Drivers Live
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-[#1C1C1C] font-display leading-tight">
            Where are you <br />
            <span className="text-gradient">heading today?</span>
          </h2>
          <p className="text-xs text-[#6B6B6B]">
            Intercity rides at split fuel prices. Safe, verified & fast.
          </p>
        </div>

        {/* Decorative background logo motif */}
        <div className="absolute right-2 -bottom-4 opacity-15 pointer-events-none transform rotate-12 scale-125">
          <Logo size="xl" showTagline={false} variant="icon-only" />
        </div>
      </div>

      {/* Main Search Form Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-card border border-[#EBE5D8] relative space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="space-y-3.5">
          {/* Connected Route Container */}
          <div className="relative rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] p-3 space-y-2">
            {/* Leaving From */}
            <div className="relative">
              <label className="text-[10px] font-extrabold text-[#8A8170] uppercase tracking-wider block mb-1">
                Leaving From
              </label>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                </div>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  onFocus={() => setShowFromSuggest(true)}
                  placeholder="Enter departure city"
                  className="w-full text-xs sm:text-sm font-extrabold text-[#1C1C1C] bg-transparent outline-none placeholder-[#A39B8B]"
                  required
                />
              </div>

              {/* From Suggestions Dropdown */}
              {showFromSuggest && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowFromSuggest(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-2xl shadow-xl border border-[#EBE5D8] max-h-48 overflow-y-auto p-1.5 animate-slide-up">
                    {POPULAR_CITIES.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setFromCity(c.name);
                          setShowFromSuggest(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#1C1C1C] hover:bg-[#FAF6EE] rounded-xl flex items-center justify-between transition-colors"
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] text-[#9E9E9E] font-normal">{c.state}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Middle Divider with Floating Swap Button */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-[#EBE5D8]/80"></div>
              <button
                type="button"
                onClick={handleSwap}
                className="absolute right-3 w-8 h-8 rounded-full bg-white border border-[#EBE5D8] shadow-xs flex items-center justify-center text-[#F15A24] hover:bg-[#FFF0EB] hover:border-[#F15A24]/40 active-press transition-all"
                title="Swap Cities"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Going To */}
            <div className="relative">
              <label className="text-[10px] font-extrabold text-[#8A8170] uppercase tracking-wider block mb-1">
                Going To
              </label>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[#F15A24]" />
                </div>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  onFocus={() => setShowToSuggest(true)}
                  placeholder="Enter destination city"
                  className="w-full text-xs sm:text-sm font-extrabold text-[#1C1C1C] bg-transparent outline-none placeholder-[#A39B8B]"
                  required
                />
              </div>

              {/* To Suggestions Dropdown */}
              {showToSuggest && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowToSuggest(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-2xl shadow-xl border border-[#EBE5D8] max-h-48 overflow-y-auto p-1.5 animate-slide-up">
                    {POPULAR_CITIES.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setToCity(c.name);
                          setShowToSuggest(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#1C1C1C] hover:bg-[#FAF6EE] rounded-xl flex items-center justify-between transition-colors"
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] text-[#9E9E9E] font-normal">{c.state}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Date & Seats Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Travel Date */}
            <div className="bg-[#FAF6EE] rounded-2xl border border-[#EBE5D8] p-3 hover:border-[#F15A24]/40 transition-colors">
              <label className="text-[10px] font-extrabold text-[#8A8170] uppercase tracking-wider block mb-1.5">
                Travel Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs font-extrabold text-[#1C1C1C] bg-transparent outline-none cursor-pointer"
                  required
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="bg-[#FAF6EE] rounded-2xl border border-[#EBE5D8] p-3 hover:border-[#F15A24]/40 transition-colors">
              <label className="text-[10px] font-extrabold text-[#8A8170] uppercase tracking-wider block mb-1.5">
                Passengers
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1C1C1C]">
                  <Users className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                  <span>{seats} Seat{seats > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSeats(Math.max(1, seats - 1))}
                    className="w-6 h-6 rounded-full bg-white border border-[#EBE5D8] shadow-2xs hover:bg-[#FFF5F0] hover:text-[#F15A24] hover:border-[#F15A24]/40 flex items-center justify-center text-xs font-black text-[#1C1C1C] transition-all"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeats(Math.min(4, seats + 1))}
                    className="w-6 h-6 rounded-full bg-white border border-[#EBE5D8] shadow-2xs hover:bg-[#FFF5F0] hover:text-[#F15A24] hover:border-[#F15A24]/40 flex items-center justify-center text-xs font-black text-[#1C1C1C] transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F15A24] via-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg active-press flex items-center justify-center gap-2 transition-all tracking-wide hover:opacity-95"
          >
            <Search className="w-4 h-4" />
            <span>Search Available Rides</span>
          </button>
        </form>
      </div>

      {/* Popular Corridors Chips */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h3 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider">
            Popular Highways
          </h3>
          <span className="text-[10px] text-[#F15A24] font-bold">Fast Booking</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { from: 'Delhi NCR', to: 'Jaipur', time: '4h 30m', fare: '₹450' },
            { from: 'Mumbai', to: 'Pune', time: '3h 15m', fare: '₹320' },
            { from: 'Bangalore', to: 'Mysore', time: '2h 15m', fare: '₹280' },
            { from: 'Delhi NCR', to: 'Chandigarh', time: '4h 15m', fare: '₹420' },
            { from: 'Ahmedabad', to: 'Surat', time: '4h 30m', fare: '₹400' },
          ].map((corridor, i) => (
            <button
              key={i}
              onClick={() => selectQuickRoute(corridor.from, corridor.to)}
              className="flex-shrink-0 bg-white border border-[#EBE5D8] rounded-2xl p-3 text-left shadow-xs hover:border-[#F15A24] transition-all active-press min-w-[140px]"
            >
              <p className="text-xs font-bold text-[#1C1C1C] truncate">
                {corridor.from} → {corridor.to}
              </p>
              <div className="flex items-center justify-between mt-1.5 text-[10px] text-[#6B6B6B]">
                <span>{corridor.time}</span>
                <span className="font-extrabold text-[#F15A24]">{corridor.fare}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Boosted Rides Showcase */}
      {featuredRides.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F15A24]" />
              <h3 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider">
                Featured Boosted Rides
              </h3>
            </div>
            <span className="text-[10px] font-bold text-[#2E9E5B] bg-[#EBF7F0] px-2 py-0.5 rounded-full">
              Direct Contact
            </span>
          </div>

          <div className="space-y-3">
            {featuredRides.map((ride) => (
              <div
                key={ride.id}
                onClick={() => onSelectRide(ride.id)}
                className="bg-white rounded-3xl p-4 border-2 border-[#FF8A00] shadow-featured relative overflow-hidden active-press cursor-pointer"
              >
                {/* Top Ribbon */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#E8380D] to-[#FF8A00] text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-bl-xl flex items-center gap-1 shadow-xs">
                  <Award className="w-3 h-3 text-amber-200" />
                  <span>{ride.packageName || 'Featured Boost'}</span>
                </div>

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ride.driver.avatar}
                      alt={ride.driver.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-[#F15A24]"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-1">
                        {ride.driver.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-[#6B6B6B] mt-0.5">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                          {ride.driver.rating}
                        </span>
                        <span>•</span>
                        <span>{ride.driver.vehicle.make} {ride.driver.vehicle.model}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right pt-4">
                    <span className="text-base font-extrabold text-[#F15A24]">
                      ₹{ride.pricePerSeat}
                    </span>
                    <p className="text-[10px] text-[#6B6B6B]">per seat</p>
                  </div>
                </div>

                <div className="bg-[#FAF6EE] rounded-2xl p-2.5 border border-[#EBE5D8] flex items-center justify-between text-xs font-semibold text-[#1C1C1C]">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <span className="w-2 h-2 rounded-full bg-[#F15A24]"></span>
                    <span>{ride.fromCity}</span>
                    <span className="text-[#9E9E9E]">→</span>
                    <span>{ride.toCity}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#2E9E5B]">
                    {ride.availableSeats} seat{ride.availableSeats > 1 ? 's' : ''} left
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust & Safety Features */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs">
        <h4 className="text-xs font-extrabold text-[#1C1C1C] mb-3 uppercase tracking-wider">
          Ridebhai Safety Standards
        </h4>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-[#FAF6EE] rounded-2xl border border-[#EBE5D8]">
            <Shield className="w-5 h-5 text-[#2E9E5B] mx-auto mb-1" />
            <p className="text-[10px] font-bold text-[#1C1C1C]">Verified IDs</p>
            <p className="text-[9px] text-[#6B6B6B]">DL & Aadhaar</p>
          </div>
          <div className="p-2 bg-[#FAF6EE] rounded-2xl border border-[#EBE5D8]">
            <Sparkles className="w-5 h-5 text-[#F15A24] mx-auto mb-1" />
            <p className="text-[10px] font-bold text-[#1C1C1C]">Instant OTP</p>
            <p className="text-[9px] text-[#6B6B6B]">Secure Boarding</p>
          </div>
          <div className="p-2 bg-[#FAF6EE] rounded-2xl border border-[#EBE5D8]">
            <Star className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-[#1C1C1C]">Rated Drivers</p>
            <p className="text-[9px] text-[#6B6B6B]">Community scored</p>
          </div>
        </div>
      </div>
    </div>
  );
};
