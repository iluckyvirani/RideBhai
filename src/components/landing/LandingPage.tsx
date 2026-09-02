import React, { useState } from 'react';
import { LandingNav } from './LandingNav';
import { EarningsCalculator } from './EarningsCalculator';
import { SafetySection } from './SafetySection';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import {
  MapPin,
  Search,
  ArrowRightLeft,
  Sparkles,
  Car,
  ShieldCheck,
  Phone,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  MessageCircle,
  Package,
} from 'lucide-react';
import { Logo } from '../common/Logo';

export interface LandingSearchParams {
  fromCity: string;
  toCity: string;
  date: string;
  seats: number;
  tab?: 'cars' | 'tours';
}

interface LandingPageProps {
  onSearchInitiated: (params: LandingSearchParams) => void;
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
  const { agencyPackages, resetDemoData } = useAppStore();
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [showFromSuggest, setShowFromSuggest] = useState(false);
  const [showToSuggest, setShowToSuggest] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const goBrowse = (tab: 'cars' | 'tours', from = fromCity, to = toCity) => {
    onSearchInitiated({
      fromCity: from,
      toCity: to,
      date: new Date().toISOString().split('T')[0],
      seats: 1,
      tab,
    });
  };

  const faqs = [
    {
      q: 'Do I book a seat or the full car?',
      a: 'Full car only. One listing is the whole vehicle. There is no per-seat booking.',
    },
    {
      q: 'How do I pay for a car or tour?',
      a: 'Customers do not pay in the app. You see the price, then Call or WhatsApp the partner and settle directly.',
    },
    {
      q: 'Who is a Partner?',
      a: 'Driver and travel agency are one login. A partner can add cars in Profile, post full-car hires, and post tour packages with a desired car name and 2–3 specs. Partners can also Call / WhatsApp other partners’ cars and tours — for example to offer a car for someone’s tour.',
    },
    {
      q: 'Why do partners pay in the app?',
      a: 'Only partners pay — to buy a posting package. After the plan is active they can post cars and tours. That is the only in-app payment.',
    },
    {
      q: 'What does All India mean?',
      a: 'Cars and tours show across India first. Apply a from / to filter to see a city or route. A car marked “currently in Jaipur” can travel anywhere once booked.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1C1C1C] flex flex-col font-sans selection:bg-[#F15A24] selection:text-white">
      <LandingNav
        onOpenRiderApp={onOpenRiderPortal}
        onOpenDriverApp={onOpenDriverPortal}
        onOpenAgencyPortal={onOpenAgencyPortal}
        onOpenAdminPortal={onOpenAdminPortal}
      />

      <main className="flex-1">
        <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto space-y-5 mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-[#FFD8CB]">
                <Sparkles className="w-4 h-4 text-[#F15A24]" />
                <span className="text-xs font-extrabold text-[#F15A24] uppercase tracking-wider">
                  Full car hire · Tours · Direct Call & WhatsApp
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.15]">
                Hire a full car or a tour. <br />
                <span className="text-gradient">Talk to the partner directly.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
                Browse cars and tour packages across India. See the price, then Call or WhatsApp. No seat sharing. No in-app checkout for customers.
              </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[#EBE5D8]">
              <p className="text-[11px] font-extrabold text-[#6B6B6B] uppercase tracking-wider mb-3">
                Leave empty to see all India
              </p>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
                <div className="md:col-span-5 relative">
                  <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                    From / current city
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-[#F15A24] mr-2" />
                    <input
                      type="text"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      onFocus={() => setShowFromSuggest(true)}
                      placeholder="All India"
                      className="w-full text-xs font-bold bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                    />
                  </div>
                  {showFromSuggest && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl shadow-2xl border border-[#EBE5D8] max-h-48 overflow-y-auto p-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFromCity('');
                          setShowFromSuggest(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-[#F15A24]"
                      >
                        All India
                      </button>
                      {POPULAR_CITIES.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setFromCity(c.name);
                            setShowFromSuggest(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-[#FFF5F0] rounded-xl"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden md:flex md:col-span-1 items-center justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      const t = fromCity;
                      setFromCity(toCity);
                      setToCity(t);
                    }}
                    className="w-9 h-9 rounded-full bg-[#FAF6EE] text-[#F15A24] border border-[#EBE5D8] flex items-center justify-center"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="md:col-span-6 relative">
                  <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                    To city
                  </label>
                  <div className="relative flex items-center">
                    <MapPin className="w-4 h-4 text-[#F15A24] mr-2" />
                    <input
                      type="text"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      onFocus={() => setShowToSuggest(true)}
                      placeholder="Optional route"
                      className="w-full text-xs font-bold bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                    />
                  </div>
                  {showToSuggest && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-2xl shadow-2xl border border-[#EBE5D8] max-h-48 overflow-y-auto p-2">
                      {POPULAR_CITIES.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => {
                            setToCity(c.name);
                            setShowToSuggest(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold hover:bg-[#FFF5F0] rounded-xl"
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => goBrowse('cars')}
                  className="py-3.5 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Car className="w-4 h-4" /> Search cars
                </button>
                <button
                  type="button"
                  onClick={() => goBrowse('tours')}
                  className="py-3.5 bg-[#1C1C1C] text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Browse tours
                </button>
              </div>

              <div className="mt-5 pt-4 border-t border-[#F2ECE1] flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-extrabold text-[#6B6B6B] uppercase">Popular</span>
                {[
                  ['Delhi NCR', 'Jaipur'],
                  ['Mumbai', 'Pune'],
                  ['Jaipur', 'Udaipur'],
                ].map(([from, to]) => (
                  <button
                    key={from + to}
                    type="button"
                    onClick={() => goBrowse('cars', from, to)}
                    className="px-3 py-1 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] font-bold"
                  >
                    {from} → {to}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={onOpenRiderPortal}
                className="text-left p-5 bg-white rounded-3xl border border-[#EBE5D8] hover:border-[#F15A24] flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-[#F15A24]">Customers</p>
                  <h4 className="text-sm font-extrabold">Find a car or tour</h4>
                  <p className="text-[11px] text-[#6B6B6B]">Price shown · Call / WhatsApp only</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#F15A24]" />
              </button>
              <button
                type="button"
                onClick={onOpenDriverPortal}
                className="text-left p-5 bg-[#1C1C1C] text-white rounded-3xl border border-white/10 hover:border-[#F15A24] flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] font-extrabold uppercase text-[#FF7A45]">Partners</p>
                  <h4 className="text-sm font-extrabold">One login · cars + tours</h4>
                  <p className="text-[11px] text-white/70">Pay in app only for a posting plan</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#F15A24]" />
              </button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-white border-y border-[#EBE5D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display">How Ride Bhai works</h2>
              <p className="text-sm text-[#6B6B6B] mt-2">All India first. Filter when you want a city or route.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                ['1', 'Browse all India', 'Open Cars or Tours. Everything shows until you apply a from / to filter.'],
                ['2', 'See price', 'Full-car price or tour package price is on the card. Desired car name and 2–3 specs on tours.'],
                ['3', 'Call or WhatsApp', 'Customers contact the partner. Partners can also Call / WhatsApp other partners’ cars and tours. Deal is offline.'],
              ].map(([n, t, d]) => (
                <div key={n} className="bg-[#FAF6EE] rounded-3xl p-8 border border-[#EBE5D8] text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#F15A24] text-white font-extrabold text-xl flex items-center justify-center mx-auto">
                    {n}
                  </div>
                  <h3 className="text-lg font-extrabold">{t}</h3>
                  <p className="text-xs text-[#6B6B6B] leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="browse-india" className="py-20 bg-[#FAF6EE]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-white border border-[#EBE5D8] space-y-3">
              <Car className="w-8 h-8 text-[#F15A24]" />
              <h3 className="text-xl font-extrabold">Cars</h3>
              <p className="text-sm text-[#6B6B6B]">
                Full car hire. Currently in a city (can go all India) or an X → Y route. Call / WhatsApp to book.
              </p>
              <button
                type="button"
                onClick={() => goBrowse('cars')}
                className="text-xs font-extrabold text-[#F15A24] flex items-center gap-1"
              >
                Open cars <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="p-8 rounded-3xl bg-white border border-[#EBE5D8] space-y-3">
              <Sparkles className="w-8 h-8 text-[#F15A24]" />
              <h3 className="text-xl font-extrabold">Tour packages</h3>
              <p className="text-sm text-[#6B6B6B]">
                Partner tours with price, desired car, and main specs. Same: Call or WhatsApp. Partner closes the listing after they confirm.
              </p>
              <button
                type="button"
                onClick={() => goBrowse('tours')}
                className="text-xs font-extrabold text-[#F15A24] flex items-center gap-1"
              >
                Open tours <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section id="for-partners" className="py-20 bg-white border-y border-[#EBE5D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
                One partner login
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-2">
                Driver and travel agency are the same account. Add cars in Profile. Post cars and tours after you buy a plan. You can also Call / WhatsApp other partners’ cars and tours.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                ['1', 'OTP login', 'Name, phone, optional firm name.'],
                ['2', 'KYC', 'Licence, RC, Aadhaar, GST if you have a firm.'],
                ['3', 'Pay for a plan', 'Only in-app payment. Unlocks posting.'],
                ['4', 'Contact other partners', 'Browse Cars and Tours. Call / WhatsApp another partner to hire their car or offer yours for a tour.'],
                ['5', 'Post & close', 'Post car or tour. After you confirm on a call, close it so it stops showing.'],
              ].map(([n, t, d]) => (
                <div key={n} className="p-5 rounded-3xl bg-[#FAF6EE] border border-[#EBE5D8]">
                  <div className="w-8 h-8 rounded-xl bg-[#F15A24] text-white font-extrabold text-sm flex items-center justify-center mb-3">
                    {n}
                  </div>
                  <h3 className="text-sm font-extrabold">{t}</h3>
                  <p className="text-xs text-[#6B6B6B] mt-1">{d}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button
                type="button"
                onClick={onOpenDriverPortal}
                className="px-8 py-4 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-xs rounded-2xl inline-flex items-center gap-2"
              >
                Become a Partner <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <EarningsCalculator onRegisterDriver={onOpenDriverPortal} />

        <section id="partner-packages" className="py-20 bg-white border-y border-[#EBE5D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0EB] border border-[#FFD8CB] mb-3">
                <Package className="w-3.5 h-3.5 text-[#F15A24]" />
                <span className="text-[11px] font-extrabold text-[#F15A24] uppercase">Partner only · in-app pay</span>
              </div>
              <h2 className="text-3xl font-extrabold font-display">Posting plans</h2>
              <p className="text-sm text-[#6B6B6B] mt-2">
                Buy a plan in the app, then post cars and tours. Customers never pay here.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {agencyPackages.filter((p) => p.isActive).map((pkg) => (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-6 border ${
                    pkg.popular ? 'bg-[#1C1C1C] text-white border-white/20' : 'bg-[#FAF6EE] border-[#EBE5D8]'
                  }`}
                >
                  <p className="text-[10px] font-extrabold uppercase text-[#F15A24]">{pkg.badgeText}</p>
                  <h3 className="text-lg font-extrabold mt-1">{pkg.name}</h3>
                  <p className="text-2xl font-black mt-2">
                    ₹{pkg.price.toLocaleString('en-IN')}
                    <span className={`text-xs font-bold ml-1 ${pkg.popular ? 'text-white/60' : 'text-[#6B6B6B]'}`}>
                      / {pkg.durationDays} days
                    </span>
                  </p>
                  <ul className="mt-4 space-y-2">
                    {pkg.benefitsDescription.slice(0, 3).map((b) => (
                      <li key={b} className="flex gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-[#00A86B] flex-shrink-0" />
                        <span className={pkg.popular ? 'text-white/80' : 'text-[#6B6B6B]'}>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={onOpenDriverPortal}
                    className={`w-full mt-6 py-3 rounded-2xl text-xs font-extrabold ${
                      pkg.popular ? 'bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white' : 'bg-white border border-[#EBE5D8]'
                    }`}
                  >
                    Pay in partner app
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SafetySection />

        <section id="faq" className="py-20 bg-[#FAF6EE] border-t border-[#EBE5D8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <HelpCircle className="w-6 h-6 text-[#6B6B6B] mx-auto mb-2" />
              <h2 className="text-3xl font-extrabold font-display">Questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={faq.q} className="bg-white rounded-2xl border border-[#EBE5D8]">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-extrabold text-sm"
                  >
                    {faq.q}
                    <ChevronRight className={`w-4 h-4 text-[#F15A24] ${activeFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaq === idx && (
                    <p className="px-5 pb-5 text-xs text-[#6B6B6B] leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#121212] text-white pt-16 pb-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="bg-white/10 p-2 rounded-2xl inline-block">
                <Logo size="md" showTagline={false} variant="light" />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                Full-car hires and tour packages across India. Customers Call or WhatsApp. Partners post after buying a plan.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-4">Customers</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-bold">
                <li>
                  <button onClick={() => goBrowse('cars')} className="hover:text-[#F15A24]">
                    Browse cars (all India)
                  </button>
                </li>
                <li>
                  <button onClick={() => goBrowse('tours')} className="hover:text-[#F15A24]">
                    Browse tour packages
                  </button>
                </li>
                <li className="flex items-center gap-1.5 text-white/80">
                  <Phone className="w-3 h-3" /> Call · <MessageCircle className="w-3 h-3" /> WhatsApp
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-4">Partners</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-bold">
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24]">
                    Become a Partner
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24]">
                    My Cars & tour posts
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24]">
                    Buy posting plan
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-bold">
                <li className="text-white/80">1800-RIDE-BHAI</li>
                <li className="text-white/80">support@ridebhai.com</li>
                <li className="text-white/40">Emergency: 112</li>
                <li>
                  <button onClick={() => scrollToSafety()} className="hover:text-[#F15A24]">
                    Safety
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
            <p>© {new Date().getFullYear()} Ride Bhai · Full car & tours</p>
            <div className="flex items-center gap-4">
              <button type="button" onClick={onOpenAdminPortal} className="hover:text-white">
                Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all demo data and reload?')) resetDemoData();
                }}
                className="text-white/70 hover:text-white font-extrabold underline underline-offset-2"
              >
                Reset demo data
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function scrollToSafety() {
  document.getElementById('safety-trust')?.scrollIntoView({ behavior: 'smooth' });
}
