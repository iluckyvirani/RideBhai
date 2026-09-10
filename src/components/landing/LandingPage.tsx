import React, { useEffect, useState } from 'react';
import { LandingNav } from './LandingNav';
import { EarningsCalculator } from './EarningsCalculator';
import { SafetySection } from './SafetySection';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import {
  MapPin,
  ArrowRightLeft,
  Sparkles,
  Car,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ArrowRight,
  MessageCircle,
  Package,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { api } from '../../lib/api';

type SiteSettings = {
  supportPhone: string;
  supportEmail: string;
  emergencyPhone: string;
};

type SiteFaq = {
  id?: string;
  question: string;
  answer: string;
};

const FALLBACK_SETTINGS: SiteSettings = {
  supportPhone: '1800-RIDE-BHAI',
  supportEmail: 'support@ridebhai.com',
  emergencyPhone: '112',
};

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
  onOpenLegal?: (slug: 'terms' | 'privacy') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSearchInitiated,
  onOpenDriverPortal,
  onOpenRiderPortal,
  onOpenAgencyPortal,
  onOpenAdminPortal,
  onOpenLegal,
}) => {
  const { agencyPackages } = useAppStore();
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [needOn, setNeedOn] = useState('');
  const [showFromSuggest, setShowFromSuggest] = useState(false);
  const [showToSuggest, setShowToSuggest] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [support, setSupport] = useState<SiteSettings>(FALLBACK_SETTINGS);
  const [faqs, setFaqs] = useState<SiteFaq[]>([]);

  const goBrowse = (tab: 'cars' | 'tours', from = fromCity, to = toCity) => {
    onSearchInitiated({
      fromCity: from,
      toCity: to,
      date: needOn,
      seats: 1,
      tab,
    });
  };

  useEffect(() => {
    api<{ settings: SiteSettings; faqs: SiteFaq[] }>('/site')
      .then((data) => {
        if (data?.settings) setSupport(data.settings);
        if (Array.isArray(data?.faqs)) {
          setFaqs(
            data.faqs.map((faq: any) => ({
              id: faq.id,
              question: faq.question || faq.q,
              answer: faq.answer || faq.a,
            }))
          );
        }
      })
      .catch(() => undefined);
  }, []);

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
                <span className="text-xs sm:text-sm font-extrabold text-[#F15A24] uppercase tracking-wider">
                  Full car hire · Tours · Chat & Deal with Ride Bhai
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight leading-[1.15]">
                Hire a full car or a tour. <br />
                <span className="text-gradient">Talk to the partner directly.</span>
              </h1>
              <p className="text-base sm:text-lg text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed">
                Browse hatchback, sedan, SUV and MUV cars plus tour packages across India. Cars show when they are available, from start to end. See the price, then Message direct or Deal with Ride Bhai. No seat sharing. No in-app trip checkout.
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

              <div className="mt-3">
                <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1.5">
                  Need on (optional)
                </label>
                <input
                  type="date"
                  value={needOn}
                  onChange={(e) => setNeedOn(e.target.value)}
                  className="w-full text-sm font-bold bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                />
                <p className="text-[11px] text-[#6B6B6B] mt-1.5">
                  Cars must be available on this date (inside their from → to window).
                </p>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => goBrowse('cars')}
                  className="py-4 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Car className="w-5 h-5" /> Search cars
                </button>
                <button
                  type="button"
                  onClick={() => goBrowse('tours')}
                  className="py-4 bg-[#1C1C1C] text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" /> Browse tours
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

            <div className="max-w-xl mx-auto mt-8">
              <button
                type="button"
                onClick={onOpenRiderPortal}
                className="w-full text-left p-6 sm:p-7 bg-[#1C1C1C] text-white rounded-3xl border border-white/10 hover:border-[#F15A24] flex items-center justify-between gap-4 shadow-xl"
              >
                <div>
                  <p className="text-xs font-extrabold uppercase text-[#FF7A45]">One login</p>
                  <h4 className="text-lg sm:text-xl font-extrabold mt-0.5">Login with OTP</h4>
                  <p className="text-sm text-white/75 mt-1">Complete profile to browse. Book and post after KYC + a plan.</p>
                </div>
                <span className="shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-[#F15A24] to-[#FF7A45]">
                  <ChevronRight className="w-7 h-7 text-white" />
                </span>
              </button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-white border-y border-[#EBE5D8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display">How Ride Bhai works</h2>
              <p className="text-sm text-[#6B6B6B] mt-2">
                All India first. Filter by city, route, car type, or a Need on date inside the car’s available window.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                ['1', 'Login + profile', 'OTP login, then name, email, city, Aadhaar and selfie. GST and agency name are optional.'],
                ['2', 'Browse all India', 'After the profile is created you can open Cars and Tours. Cars show available from → available to. Posted time is admin only.'],
                ['3', 'Book when unlocked', 'Chat and Deal with Ride Bhai unlock after admin verifies you and you buy a plan. Both sides close the deal, then rate.'],
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
                Full car hire — hatchback, sedan, SUV or MUV. All India or an X → Y route. Each card shows available from this date/time to this date/time. Book with Message direct or Deal with Ride Bhai.
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
                Partner tours with price, desired car type, and main specs. Same chat and Deal with Ride Bhai. Both sides tap Close deal, then rate. Posting a tour needs an agency name on your profile.
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
                One user account
              </h2>
              <p className="text-sm text-[#6B6B6B] mt-2">
                Everyone uses the same login. Complete profile to browse. Verified profile plus a plan unlocks booking, chat and posting.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                ['1', 'OTP login', 'Phone only. One account for everyone.'],
                ['2', 'Profile', 'Name, email, city, Aadhaar, selfie. GST optional. Agency name needed to post tours.'],
                ['3', 'Browse', 'Full app after profile is created. Booking stays locked until KYC + plan.'],
                ['4', 'Admin verifies + plan', 'Then chat or Deal with Ride Bhai. Post a car only with a verified driver and RC vehicle.'],
                ['5', 'Close & rate', 'Both sides tap Close deal. Rate each other. A car post is available from → to, not a posted stamp.'],
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
                className="px-10 py-4 bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white font-extrabold text-base rounded-2xl inline-flex items-center gap-2 shadow-lg"
              >
                Login with OTP <ArrowRight className="w-5 h-5" />
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
                <span className="text-[11px] font-extrabold text-[#F15A24] uppercase">Only in-app payment</span>
              </div>
              <h2 className="text-3xl font-extrabold font-display">Plans</h2>
              <p className="text-sm text-[#6B6B6B] mt-2">
                After admin verifies your KYC, buy a plan to unlock booking, chat and posting. Customers never pay for the trip here.
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
                    className={`w-full mt-6 py-4 rounded-2xl text-sm font-extrabold ${
                      pkg.popular ? 'bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white' : 'bg-white border border-[#EBE5D8]'
                    }`}
                  >
                    Login & buy plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SafetySection
          supportPhone={support.supportPhone}
          supportEmail={support.supportEmail}
          emergencyPhone={support.emergencyPhone}
        />

        <section id="faq" className="py-20 bg-[#FAF6EE] border-t border-[#EBE5D8]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <HelpCircle className="w-6 h-6 text-[#6B6B6B] mx-auto mb-2" />
              <h2 className="text-3xl font-extrabold font-display">Questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.length === 0 && (
                <p className="text-sm font-bold text-[#6B6B6B] text-center">FAQs will show here once admin adds them.</p>
              )}
              {faqs.map((faq, idx) => (
                <div key={faq.id || faq.question} className="bg-white rounded-2xl border border-[#EBE5D8]">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-extrabold text-sm"
                  >
                    {faq.question}
                    <ChevronRight className={`w-4 h-4 text-[#F15A24] ${activeFaq === idx ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaq === idx && (
                    <p className="px-5 pb-5 text-xs text-[#6B6B6B] leading-relaxed">{faq.answer}</p>
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
                Full-car hires and tour packages across India. One OTP login. Browse after your profile. Book, chat and post after verification and a plan.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-4">Browse</h4>
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
                  <MessageCircle className="w-3 h-3" /> Chat · Deal with Ride Bhai
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider mb-4">Account</h4>
              <ul className="space-y-2.5 text-xs text-white/60 font-bold">
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24]">
                    Login with OTP
                  </button>
                </li>
                <li>
                  <button onClick={onOpenDriverPortal} className="hover:text-[#F15A24]">
                    Complete profile
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
                {support.supportPhone && (
                  <li>
                    <a href={`tel:${support.supportPhone.replace(/\s/g, '')}`} className="text-white/80 hover:text-[#F15A24]">
                      {support.supportPhone}
                    </a>
                  </li>
                )}
                {support.supportEmail && (
                  <li>
                    <a href={`mailto:${support.supportEmail}`} className="text-white/80 hover:text-[#F15A24]">
                      {support.supportEmail}
                    </a>
                  </li>
                )}
                {support.emergencyPhone && (
                  <li className="text-white/40">Emergency: {support.emergencyPhone}</li>
                )}
                <li>
                  <button onClick={() => scrollToSafety()} className="hover:text-[#F15A24]">
                    Safety
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenLegal?.('terms')} className="hover:text-[#F15A24]">
                    Terms and conditions
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenLegal?.('privacy')} className="hover:text-[#F15A24]">
                    Privacy policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
            <p>© {new Date().getFullYear()} Ride Bhai · Full car & tours</p>
            <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
              <button type="button" onClick={() => onOpenLegal?.('terms')} className="hover:text-white">
                Terms
              </button>
              <button type="button" onClick={() => onOpenLegal?.('privacy')} className="hover:text-white">
                Privacy
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
