import React from 'react';
import {
  ShieldCheck,
  MessageCircle,
  FileCheck2,
  Star,
  HeartHandshake,
  CheckCircle,
  Car,
} from 'lucide-react';

export const SafetySection: React.FC = () => {
  const safetyFeatures = [
    {
      icon: <FileCheck2 className="w-6 h-6 text-[#00A86B]" />,
      bg: 'bg-emerald-50 border-emerald-100',
      title: 'Partner KYC before posting',
      desc: 'Partners upload licence, RC, Aadhaar, and business papers. Admin verifies before cars or tours go live.',
      badge: 'Verified partners',
    },
    {
      icon: <Car className="w-6 h-6 text-[#F15A24]" />,
      bg: 'bg-orange-50 border-orange-100',
      title: 'Full car only',
      desc: 'You hire the whole car — no shared seat booking. See the car name, price, and city or route before you message.',
      badge: 'Private hire',
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#F15A24]" />,
      bg: 'bg-orange-50 border-orange-100',
      title: 'Message direct',
      desc: 'Chat with the partner in Ride Bhai. Confirm the trip in-app, then hide the post when it is booked.',
      badge: 'In-app chat',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-[#1C1C1C]" />,
      bg: 'bg-[#FAF6EE] border-[#EBE5D8]',
      title: 'Deal with Ride Bhai',
      desc: 'Send an inquiry and Ride Bhai mediates in a separate chat. Same flow for cars and tours.',
      badge: 'Ride Bhai',
    },
    {
      icon: <Star className="w-6 h-6 text-amber-500" />,
      bg: 'bg-amber-50 border-amber-100',
      title: 'Rated partners',
      desc: 'Listings show partner rating and city. Low-trust accounts stay off the all-India feed.',
      badge: 'Community trust',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-rose-500" />,
      bg: 'bg-rose-50 border-rose-100',
      title: '24/7 support',
      desc: 'Need help with a listing or a partner? Ride Bhai support is on call. Emergency: 112.',
      badge: 'Always on',
    },
  ];

  return (
    <section id="safety-trust" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF7EE] border border-[#BDE8C7]">
            <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
            <span className="text-[11px] font-extrabold text-[#00A86B] uppercase tracking-wider">
              Trust first
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1C1C1C] font-display">
            Direct contact. <span className="text-gradient">Verified partners.</span>
          </h2>
          <p className="text-sm text-[#6B6B6B]">
            Customers never pay for the trip in the app. You see the price, then Message direct or Deal with Ride Bhai. Partners pay only to unlock posting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safetyFeatures.map((item) => (
            <div key={item.title} className={`p-6 rounded-3xl border ${item.bg} hover:shadow-lg transition-all flex flex-col justify-between`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center">{item.icon}</div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white text-[#1C1C1C]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-[#1C1C1C]">{item.title}</h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-black/5 flex items-center gap-1.5 text-[11px] font-bold text-[#1C1C1C]">
                <CheckCircle className="w-3.5 h-3.5 text-[#00A86B]" />
                Ride Bhai standard
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
