import React from 'react';
import {
  ShieldCheck,
  Key,
  Users2,
  PhoneCall,
  Star,
  CheckCircle,
  FileCheck2,
  HeartHandshake
} from 'lucide-react';

export const SafetySection: React.FC = () => {
  const safetyFeatures = [
    {
      icon: <FileCheck2 className="w-6 h-6 text-[#00A86B]" />,
      bg: 'bg-emerald-50 border-emerald-100',
      title: '100% ID & License Verification',
      desc: 'Every driver must submit government ID, Driving License, and Vehicle RC before picking up passengers. Admin manual review guarantees authenticity.',
      badge: 'Zero Fake Drivers',
    },
    {
      icon: <Key className="w-6 h-6 text-[#F15A24]" />,
      bg: 'bg-orange-50 border-orange-100',
      title: 'Secure 4-Digit Pickup OTP',
      desc: 'No ride can start without the rider sharing their confidential 4-digit pickup OTP with the driver. Eliminates wrong passenger pickups.',
      badge: 'OTP Protected',
    },
    {
      icon: <Users2 className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-100',
      title: 'Women-Only Rides Available',
      desc: 'Female drivers can choose to offer rides exclusively to female passengers for utmost peace of mind and comfort on long intercity journeys.',
      badge: 'Pink Safe Zones',
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-100',
      title: 'SOS & Emergency Sharing',
      desc: 'One-tap emergency contact sharing sends live trip itinerary and driver details to family members for continuous tracking.',
      badge: 'Live Tracking',
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500" />,
      bg: 'bg-amber-50 border-amber-100',
      title: '2-Way Community Rating',
      desc: 'Drivers and riders rate each other after every trip. Low-rated or uncivil users are permanently suspended from the Ride Bhai platform.',
      badge: 'Strict Quality',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
      bg: 'bg-rose-50 border-rose-100',
      title: 'Dispute & Refund Protection',
      desc: 'Dedicated dispute resolution console ensures instant refunds in case of vehicle cancellation or route mismatches.',
      badge: '24/7 Support',
    },
  ];

  return (
    <section id="safety-trust" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7EE] border border-[#BDE8C7]">
            <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
            <span className="text-[11px] font-extrabold text-[#00A86B] uppercase tracking-wider">
              Your Safety is Our #1 Priority
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] font-display">
            Built for <span className="text-gradient">Total Trust & Peace of Mind</span>
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Whether you are a solo woman traveler, a daily office commuter, or a car owner sharing your highway trip, our multi-tier verification guarantees safe travels.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyFeatures.map((item, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border ${item.bg} hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-[#1C1C1C] shadow-xs">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#1C1C1C]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-bold text-[#1C1C1C]">
                <CheckCircle className="w-3.5 h-3.5 text-[#00A86B]" />
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
