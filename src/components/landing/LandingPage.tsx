import React, { useState } from 'react';
import { LandingNav } from './LandingNav';
import { EarningsCalculator } from './EarningsCalculator';
import { SafetySection } from './SafetySection';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRightLeft,
  Sparkles,
  Car,
  ShieldCheck,
  Zap,
  Phone,
  CheckCircle2,
  TrendingUp,
  Star,
  Award,
  Lock,
  ChevronRight,
  HelpCircle,
  Clock,
  ArrowRight,
  Building
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface LandingPageProps {
  onSearchInitiated: (params: { fromCity: string; toCity: string; date: string; seats: number }) => void;
  onOpenDriverPortal: () => void;
  onOpenRiderPortal: () => void;
  onOpenAgencyPortal?: () => void;
  onOpenAdminPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSearchInitiated,
  onOpenDriverPortal,
  onOpenRiderPortal,
  onOpenAgencyPortal,
  onOpenAdminPortal,
}) => {
  const { packages, rides, drivers } = useAppStore();

  const [fromCity, setFromCity] = useState('Delhi NCR');
  const [toCity, setToCity] = useState('Jaipur');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [seats, setSeats] = useState(1);
  const [showFromSuggest, setShowFromSuggest] = useState(false);
  const [showToSuggest, setShowToSuggest] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchInitiated({ fromCity, toCity, date, seats });
  };

  const handleQuickRouteClick = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
    onSearchInitiated({ fromCity: from, toCity: to, date, seats });
  };

  const faqs = [
    {
      q: 'How does Ride Bhai verify drivers and riders?',
      a: 'All drivers must upload their official Driving License, Vehicle Registration Certificate (RC), and Aadhaar. Every ride also requires a secure 4-digit Pickup OTP before journey start, ensuring zero unauthorized riders.',
    },
    {
      q: 'How do drivers earn money and receive payouts?',
      a: 'Drivers share fuel and toll costs by offering their empty car seats. Passengers pay securely via UPI or Card in-app, and 100% of seat earnings are credited directly to the driver with zero high commission cuts.',
    },
    {
      q: 'What is the Driver Boost Package?',
      a: 'Boost Packages pin the driver’s rides to the top of search results and display their direct phone contact button to riders. Drivers with Boost report up to 3x faster booking confirmations.',
    },
    {
      q: 'What happens if a driver or rider cancels?',
      a: 'If a driver cancels, riders receive an instant 100% refund. Our 24/7 dispute management team resolves any route mismatch or delay immediately.',
    },
    {
      q: 'Are there options for solo female travelers?',
      a: 'Yes! Female drivers can tag their trips as "Women Only", ensuring only female co-passengers can request and book seats.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1C1C1C] flex flex-col font-sans selection:bg-[#F15A24] selection:text-white">
      {/* Sticky Navigation Bar */}
      <LandingNav
        onOpenRiderApp={onOpenRiderPortal}
        onOpenDriverApp={onOpenDriverPortal}
        onOpenAgencyPortal={onOpenAgencyPortal}
        onOpenAdminPortal={onOpenAdminPortal}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#FAF6EE] via-[#FFF5F0] to-[#FAF6EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-5 mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-[#FFD8CB] animate-bounce-subtle">
                <Sparkles className="w-4 h-4 text-[#F15A24]" />
                <span className="text-xs font-extrabold text-[#F15A24] uppercase tracking-wider">
                  India’s Most Trusted Highway Carpooling Platform
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1C1C1C] font-display tracking-tight leading-[1.15]">
                Intercity Rides at <br />
                <span className="text-gradient">Split Fuel Costs.</span> Safe & Verified.
              </h1>

              <p className="text-base sm:text-lg text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
                Connect with verified car owners traveling your highway route. Enjoy comfortable, AC car rides at up to <strong>60% less</strong> than private cabs or buses.
              </p>
            </div>

            {/* Main Interactive Search Widget */}
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[#EBE5D8] relative z-20">
              <form onSubmit={handleSearchSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                  {/* From Input */}
                  <div className="md:col-span-4 relative">
                    <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                      Leaving From
                    </label>
                    <div className="relative flex items-center">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] flex items-center justify-center text-[#F15A24] mr-2">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                        onFocus={() => setShowFromSuggest(true)}
                        placeholder="Departure City"
                        className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                        required
                      />
                    </div>

                    {showFromSuggest && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl shadow-2xl border border-[#EBE5D8] max-h-48 overflow-y-auto p-2 animate-slide-up">
                        {POPULAR_CITIES.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setFromCity(c.name);
                              setShowFromSuggest(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-bold text-[#1C1C1C] hover:bg-[#FFF5F0] hover:text-[#F15A24] rounded-xl flex items-center justify-between"
                          >
                            <span>{c.name}</span>
                            <span className="text-[10px] text-[#6B6B6B]">{c.state}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swap Button */}
                  <div className="hidden md:flex md:col-span-1 items-center justify-center pb-2">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="w-9 h-9 rounded-full bg-[#FAF6EE] hover:bg-[#FFF0EB] text-[#F15A24] border border-[#EBE5D8] flex items-center justify-center transition-all active-press"
                      title="Swap Cities"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* To Input */}
                  <div className="md:col-span-3 relative">
                    <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                      Going To
                    </label>
                    <div className="relative flex items-center">
                      <div className="w-8 h-8 rounded-xl bg-[#FAF6EE] flex items-center justify-center text-[#F15A24] mr-2">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                        onFocus={() => setShowToSuggest(true)}
                        placeholder="Destination City"
                        className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                        required
                      />
                    </div>

                    {showToSuggest && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl shadow-2xl border border-[#EBE5D8] max-h-48 overflow-y-auto p-2 animate-slide-up">
                        {POPULAR_CITIES.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => {
                              setToCity(c.name);
                              setShowToSuggest(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-bold text-[#1C1C1C] hover:bg-[#FFF5F0] hover:text-[#F15A24] rounded-xl flex items-center justify-between"
                          >
                            <span>{c.name}</span>
                            <span className="text-[10px] text-[#6B6B6B]">{c.state}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Date & Seats */}
                  <div className="md:col-span-2">
                    <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                      Travel Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                      required
                    />
                  </div>

                  {/* Search Button */}
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs rounded-2xl shadow-lg hover:shadow-xl active-press flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Search Rides</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Quick Popular Routes Pills */}
              <div className="mt-5 pt-4 border-t border-[#F2ECE1] flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-extrabold text-[#6B6B6B] uppercase tracking-wider">
                  Popular Routes:
                </span>
                <button
                  type="button"
                  onClick={() => handleQuickRouteClick('Delhi NCR', 'Jaipur')}
                  className="px-3 py-1 rounded-xl bg-[#FAF6EE] hover:bg-[#FFF0EB] text-[#1C1C1C] hover:text-[#F15A24] border border-[#EBE5D8] font-bold transition-all text-xs"
                >
                  Delhi → Jaipur (₹450)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRouteClick('Delhi NCR', 'Chandigarh')}
                  className="px-3 py-1 rounded-xl bg-[#FAF6EE] hover:bg-[#FFF0EB] text-[#1C1C1C] hover:text-[#F15A24] border border-[#EBE5D8] font-bold transition-all text-xs"
                >
                  Delhi → Chandigarh (₹450)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickRouteClick('Delhi NCR', 'Agra')}
                  className="px-3 py-1 rounded-xl bg-[#FAF6EE] hover:bg-[#FFF0EB] text-[#1C1C1C] hover:text-[#F15A24] border border-[#EBE5D8] font-bold transition-all text-xs"
                >
                  Delhi → Agra (₹350)
                </button>
              </div>
            </div>

            {/* Small Hero Banners Grid */}
            <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Driver Banner with Visual Image */}
              <div
                onClick={onOpenDriverPortal}
                className="group relative overflow-hidden p-4 sm:p-5 bg-gradient-to-r from-[#1C1C1C] via-[#2A2A2A] to-[#1C1C1C] text-white rounded-3xl shadow-xl border border-white/10 flex items-center justify-between gap-3 hover:border-[#F15A24] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Photo thumbnail */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/20 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=200&q=80"
                      alt="Drive on Highway"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-lg bg-[#F15A24] flex items-center justify-center text-white">
                      <Car className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#F15A24]/20 text-[#FF7A45] border border-[#F15A24]/30 text-[9px] font-extrabold uppercase">
                        For Car Owners
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold truncate text-white">
                      Driving Intercity? Share Seats!
                    </h4>
                    <p className="text-[11px] text-white/75 truncate">
                      Earn up to <strong className="text-[#FF7A45]">₹50,000/mo</strong> • Offset 100% fuel
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDriverPortal();
                  }}
                  className="px-3.5 py-2 bg-white text-[#1C1C1C] hover:bg-[#FFF5F0] font-extrabold text-[11px] rounded-xl shadow-xs transition-all flex items-center gap-1 flex-shrink-0 active-press whitespace-nowrap"
                >
                  <span>Driver Center</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#F15A24]" />
                </button>
              </div>

              {/* Travel Agency Banner with Visual Image */}
              <div
                onClick={onOpenAgencyPortal || onOpenDriverPortal}
                className="group relative overflow-hidden p-4 sm:p-5 bg-gradient-to-r from-white via-[#FFF9F5] to-white text-[#1C1C1C] rounded-3xl shadow-lg border border-[#EBE5D8] flex items-center justify-between gap-3 hover:border-[#F15A24] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Photo thumbnail */}
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-[#FFD8CB] shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=200&q=80"
                      alt="Travel Agency Tours"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-lg bg-[#00A86B] flex items-center justify-center text-white">
                      <Building className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-extrabold uppercase">
                        For Travel Agencies
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold truncate text-[#1C1C1C]">
                      Agency Tour Partner Portal
                    </h4>
                    <p className="text-[11px] text-[#6B6B6B] truncate">
                      Broadcast client tours to <strong>5,000+ drivers</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenAgencyPortal) onOpenAgencyPortal();
                    else onOpenDriverPortal();
                  }}
                  className="px-3.5 py-2 bg-[#FAF6EE] hover:bg-[#FFF0EB] text-[#1C1C1C] hover:text-[#F15A24] border border-[#EBE5D8] hover:border-[#F15A24] font-extrabold text-[11px] rounded-xl transition-all flex items-center gap-1 flex-shrink-0 active-press whitespace-nowrap"
                >
                  <span>Post Tours</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#F15A24]" />
                </button>
              </div>
            </div>

            {/* Visual Hero Showcase Banner with Real Highway Travel Image */}
            <div className="max-w-4xl mx-auto mt-8 relative rounded-3xl overflow-hidden shadow-2xl border border-[#EBE5D8] group">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1400&q=85"
                  alt="Ride Bhai Highway Carpooling"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                {/* Floating Highlights Badges */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#1C1C1C] text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                    <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                    <span>100% KYC Verified Drivers</span>
                  </div>
                  <div className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-[#1C1C1C]/80 backdrop-blur-md text-white text-xs font-extrabold items-center gap-1.5 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
                    <span>50,000+ Completed Trips</span>
                  </div>
                </div>

                {/* Floating Bottom Card Overlays */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                  <div className="space-y-1.5 text-white max-w-lg">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F15A24] text-white text-[10px] font-extrabold uppercase">
                      Live Route Example
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black leading-tight drop-shadow-md">
                      Delhi NCR ↔ Jaipur Highway
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-2">
                      Travel in comfortable AC SUVs & Sedans. Meet verified co-travelers and share fuel costs seamlessly.
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/30 shadow-xl text-[#1C1C1C] flex items-center gap-3 self-stretch sm:self-auto flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0EB] text-[#F15A24] flex items-center justify-center font-black text-sm">
                      ₹
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#6B6B6B] block uppercase">Average Fare</span>
                      <strong className="text-base font-black text-[#F15A24]">₹450 / seat</strong>
                      <span className="text-[10px] text-[#00A86B] font-bold block">Save ~60% vs Cabs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 bg-white border-y border-[#EBE5D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FFD8CB]">
                <Zap className="w-3.5 h-3.5 text-[#F15A24]" />
                <span className="text-[11px] font-extrabold text-[#F15A24] uppercase tracking-wider">
                  Simple 3-Step Process
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] font-display">
                How Ride Bhai Works
              </h2>
              <p className="text-sm text-[#6B6B6B]">
                Seamless, transparent, and verified ride sharing for both passengers and car owners.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-[#FAF6EE] rounded-3xl p-8 border border-[#EBE5D8] relative text-center space-y-4 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#F15A24] text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                  1
                </div>
                <h3 className="text-lg font-extrabold text-[#1C1C1C]">
                  Search or Post Route
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Riders search by departure city and date. Drivers publish their highway journey and set available seats with stopovers.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-[#FAF6EE] rounded-3xl p-8 border border-[#EBE5D8] relative text-center space-y-4 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#1C1C1C] text-[#F7C948] font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                  2
                </div>
                <h3 className="text-lg font-extrabold text-[#1C1C1C]">
                  Book with OTP Verification
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Riders book seats instantly or request approval. A unique 4-digit Pickup OTP is generated to guarantee secure boarding.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-[#FAF6EE] rounded-3xl p-8 border border-[#EBE5D8] relative text-center space-y-4 hover:shadow-md transition-all">
                <div className="w-14 h-14 rounded-2xl bg-[#00A86B] text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                  3
                </div>
                <h3 className="text-lg font-extrabold text-[#1C1C1C]">
                  Travel Safe & Save 60%
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Meet at designated pickup points, verify the OTP, and travel comfortably. Driver receives 100% instant payout upon completion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* HOW DRIVER CAN REGISTER SECTION */}
        <section id="driver-registration" className="py-20 bg-[#FAF6EE] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FFD8CB]">
                  <Car className="w-3.5 h-3.5 text-[#F15A24]" />
                  <span className="text-[11px] font-extrabold text-[#F15A24] uppercase tracking-wider">
                    Become a Driver Partner
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] font-display leading-tight">
                  How Drivers Can Register & <br />
                  <span className="text-gradient">Start Posting Rides</span>
                </h2>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  Joining as a Ride Bhai verified car owner takes under 2 minutes. Start monetizing empty seats on your routine routes today.
                </p>

                {/* Step Checklist */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-[#EBE5D8] shadow-xs">
                    <div className="w-7 h-7 rounded-full bg-[#FFF0EB] text-[#F15A24] font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1C1C1C]">
                        Quick Mobile Number + OTP Verification
                      </h4>
                      <p className="text-[11px] text-[#6B6B6B]">
                        Signup with your active mobile number and enter vehicle model details.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-[#EBE5D8] shadow-xs">
                    <div className="w-7 h-7 rounded-full bg-[#FFF0EB] text-[#F15A24] font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1C1C1C]">
                        Upload KYC Documents
                      </h4>
                      <p className="text-[11px] text-[#6B6B6B]">
                        Submit Driving License, Vehicle RC, and Aadhaar for 1-click admin verification badge.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 bg-white p-4 rounded-2xl border border-[#EBE5D8] shadow-xs">
                    <div className="w-7 h-7 rounded-full bg-[#FFF0EB] text-[#F15A24] font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1C1C1C]">
                        Publish Intercity Route & Collect Bookings
                      </h4>
                      <p className="text-[11px] text-[#6B6B6B]">
                        Set your price, departure time, and optional boost package for top search placement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenDriverPortal}
                    className="px-8 py-4 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 active-press"
                  >
                    <span>Register as Driver Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Visual Card Side */}
              <div className="lg:col-span-6 bg-[#1C1C1C] text-white rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#00A86B]/20 text-[#00A86B] flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold">Verified Driver Badge</h4>
                      <p className="text-xs text-white/60">100% Trust Certified</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#00A86B] text-white text-[10px] font-extrabold rounded-full">
                    KYC Active
                  </span>
                </div>

                <div className="space-y-3 text-xs text-white/80">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span>Driving License</span>
                    <span className="text-[#00A86B] font-bold">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span>Vehicle RC (Registration)</span>
                    <span className="text-[#00A86B] font-bold">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <span>Aadhaar Identity</span>
                    <span className="text-[#00A86B] font-bold">✓ Verified</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9E6]/10 border border-[#FDE68A]/20">
                  <p className="text-xs font-bold text-[#F7C948]">
                    ★ Boost Package Perks:
                  </p>
                  <p className="text-[11px] text-white/70 mt-1">
                    Boosted drivers appear first on every search query, with a direct <strong>Call Driver</strong> button shown to riders.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOR TRAVEL AGENCIES PARTNER SECTION */}
        <section id="travel-agencies" className="py-20 bg-white relative overflow-hidden border-t border-[#EBE5D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FFD8CB]">
                <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
                <span className="text-[11px] font-extrabold text-[#F15A24] uppercase tracking-wider">
                  For Travel Agencies & Tour Operators
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] font-display">
                Already Have Client Tour Bookings? <br />
                <span className="text-gradient">Broadcast Directly to 5,000+ Drivers</span>
              </h2>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                Connect your pre-booked tourist packages (e.g. <em>Agra to Jaipur 4 Pax 3D/1N</em>) with verified vehicle drivers. Keep your commission and let drivers claim trips via instant WhatsApp.
              </p>
            </div>

            {/* 3 Step Agency Workflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#FAF6EE] rounded-3xl p-6 border border-[#EBE5D8] space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F15A24] text-white font-extrabold flex items-center justify-center">
                  1
                </div>
                <h3 className="text-sm font-extrabold text-[#1C1C1C]">
                  Register & Upload Business KYC
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Submit GST, Trade License, and Company PAN. Our compliance team verifies your agency to guarantee safety and prevent spam.
                </p>
              </div>

              <div className="bg-[#FAF6EE] rounded-3xl p-6 border border-[#EBE5D8] space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F15A24] text-white font-extrabold flex items-center justify-center">
                  2
                </div>
                <h3 className="text-sm font-extrabold text-[#1C1C1C]">
                  Activate Posting Subscription
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Choose a flexible agency posting package to broadcast unlimited tour leads with zero commission deduction on trip payouts.
                </p>
              </div>

              <div className="bg-[#FAF6EE] rounded-3xl p-6 border border-[#EBE5D8] space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-[#00A86B] text-white font-extrabold flex items-center justify-center">
                  3
                </div>
                <h3 className="text-sm font-extrabold text-[#1C1C1C]">
                  Post Tours & Receive Driver Calls
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Enter route, pax count, days/nights, total client price, and your agency commission cut. Verified drivers directly message you on WhatsApp.
                </p>
              </div>
            </div>

            {/* Example Live Card Banner */}
            <div className="p-6 rounded-3xl bg-[#1C1C1C] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[10px] font-bold">
                  <span>★ Example Live Tour Posting</span>
                </div>
                <h4 className="text-base font-extrabold">
                  Agra → Jaipur (4 Members • 3 Days 1 Night • AC Sedan)
                </h4>
                <p className="text-xs text-white/70">
                  Total Client Price: <strong>₹1,000</strong> • Agency Commission: <strong className="text-[#FF7A45]">₹200</strong> • Driver Net Payout: <strong className="text-emerald-400">₹800</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenAgencyPortal}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F15A24] to-[#FF7A45] hover:opacity-90 text-white font-extrabold text-xs shadow-md active-press whitespace-nowrap"
              >
                Register as Travel Agency Partner
              </button>
            </div>
          </div>
        </section>

        {/* EARNINGS CALCULATOR */}
        <EarningsCalculator onRegisterDriver={onOpenDriverPortal} />

        {/* DRIVER BOOST PACKAGES SECTION */}
        <section id="driver-benefits" className="py-20 bg-white border-y border-[#EBE5D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FFD8CB]">
                <Sparkles className="w-3.5 h-3.5 text-[#F15A24]" />
                <span className="text-[11px] font-extrabold text-[#F15A24] uppercase tracking-wider">
                  Driver Monetization Perks
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] font-display">
                Boost Packages for <span className="text-gradient">3x More Bookings</span>
              </h2>
              <p className="text-sm text-[#6B6B6B]">
                Stand out to thousands of daily commuters with top search placement and direct phone contact visibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-6 border flex flex-col justify-between transition-all ${
                    pkg.popular
                      ? 'bg-[#1C1C1C] text-white border-white/20 shadow-2xl relative'
                      : 'bg-[#FAF6EE] text-[#1C1C1C] border-[#EBE5D8] hover:shadow-lg'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 right-6 bg-[#F15A24] text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        pkg.popular ? 'bg-[#FF7A45]/20 text-[#FF7A45]' : 'bg-[#FFF0EB] text-[#F15A24]'
                      }`}>
                        {pkg.badgeText}
                      </span>
                      <h3 className="text-lg font-extrabold mt-2.5">{pkg.name}</h3>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold">₹{pkg.price}</span>
                      <span className={`text-xs ${pkg.popular ? 'text-white/60' : 'text-[#6B6B6B]'}`}>
                        / {pkg.durationDays} Days
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2">
                      {pkg.benefitsDescription.map((b, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-[#00A86B] flex-shrink-0" />
                          <span className={pkg.popular ? 'text-white/80' : 'text-[#6B6B6B]'}>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={onOpenDriverPortal}
                      className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all active-press ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white shadow-lg'
                          : 'bg-white text-[#1C1C1C] border border-[#EBE5D8] hover:border-[#F15A24]'
                      }`}
                    >
                      Get Started as Driver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SAFETY & TRUST SECTION */}
        <SafetySection />

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 bg-[#FAF6EE] border-t border-[#EBE5D8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 mb-14">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EBE5D8]">
                <HelpCircle className="w-3.5 h-3.5 text-[#6B6B6B]" />
                <span className="text-[11px] font-extrabold text-[#6B6B6B] uppercase tracking-wider">
                  Frequently Asked Questions
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-[#1C1C1C] font-display">
                Got Questions? We Have Answers.
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#EBE5D8] overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-extrabold text-xs sm:text-sm text-[#1C1C1C]"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-[#F15A24] transition-transform ${
                        activeFaq === idx ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {activeFaq === idx && (
                    <div className="px-5 pb-5 text-xs text-[#6B6B6B] leading-relaxed border-t border-[#FAF6EE] pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#121212] text-white pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-4 md:col-span-1">
              <div className="bg-white/10 p-2 rounded-2xl inline-block">
                <Logo size="md" showTagline={false} variant="light" />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                India’s leading intercity highway carpool network. Connecting verified drivers and passengers for split fuel costs.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
                For Riders
              </h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-bold">
                <li>
                  <button onClick={onOpenRiderPortal} className="hover:text-[#F15A24] transition-colors">
                    Search Intercity Rides
                  </button>
                </li>
                <li>
                  <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#F15A24] transition-colors">
                    Pickup OTP Verification
                  </button>
                </li>
                <li>
                  <button onClick={onOpenRiderPortal} className="hover:text-[#F15A24] transition-colors">
                    Women Only Rides
                  </button>
                </li>
              </ul>
            </div>

            {/* For Drivers */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
                For Drivers
              </h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-bold">
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24] transition-colors">
                    Register as Driver
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24] transition-colors">
                    Post a Ride Schedule
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24] transition-colors">
                    Driver Boost Packages
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24] transition-colors">
                    KYC Verification Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Support & Safety */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white mb-4">
                Support & Safety
              </h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-bold">
                <li>
                  <span className="text-white/80">24/7 Helpline: 1800-RIDE-BHAI</span>
                </li>
                <li>
                  <span className="text-white/80">support@ridebhai.com</span>
                </li>
                <li>
                  <span className="text-white/40">Emergency SOS Response: 112</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
            <p>© {new Date().getFullYear()} Ride Bhai Technologies Inc. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">100% Aadhaar & Driving License Verified Carpool Network</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
