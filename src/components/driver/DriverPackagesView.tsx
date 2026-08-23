import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Zap,
  Clock,
  Award,
  ZapOff,
  ShieldCheck,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MockPaymentModal } from '../common/MockPaymentModal';

export const DriverPackagesView: React.FC = () => {
  const {
    packages,
    currentDriver,
    isDriverBoosted,
    getDriverActivePackage,
    purchasePackage,
    simulatePackageExpiry,
  } = useAppStore();

  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const isBoosted = isDriverBoosted(currentDriver.id);
  const activePackageInfo = getDriverActivePackage(currentDriver.id);

  const activePkg = packages.find((p) => p.id === selectedPkgId) || packages[0];

  const daysRemaining = activePackageInfo
    ? Math.max(0, Math.ceil((activePackageInfo.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  const handleStartPurchase = (pkgId: string) => {
    setSelectedPkgId(pkgId);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedPkgId) {
      purchasePackage(selectedPkgId);
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Current Active Status Card */}
      <div className={`rounded-3xl p-5 border shadow-card text-white relative overflow-hidden ${
        isBoosted ? 'brand-gradient border-[#FF8A00]' : 'bg-[#1C1C1C] border-black'
      }`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-200 bg-white/15 px-2.5 py-1 rounded-full inline-block">
              {isBoosted ? 'PRO ACTIVE' : 'UNBOOSTED DRIVER'}
            </span>
            <h3 className="font-display font-extrabold text-xl">
              {isBoosted ? activePackageInfo?.pkg?.name || 'Boost Active' : 'Regular Driver Plan'}
            </h3>
            <p className="text-xs text-white/80">
              {isBoosted
                ? `Active for ${daysRemaining} more days. All your rides are pinned on top!`
                : 'Upgrade to Featured Boost to rank #1 and unlock direct rider phone calls.'}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-amber-300">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Live Expiry Simulator CTA */}
        {isBoosted && (
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-[11px] text-white/90">Test live rank demotion?</span>
            <button
              onClick={() => {
                simulatePackageExpiry(currentDriver.id);
                alert('⚡ Boost package expired! Your rides will now show in the regular section without phone numbers.');
              }}
              className="py-1.5 px-3 bg-black/40 hover:bg-black/60 rounded-xl text-xs font-extrabold text-amber-200 border border-white/20 flex items-center gap-1 active-press"
            >
              <ZapOff className="w-3.5 h-3.5" />
              <span>Simulate Expiry</span>
            </button>
          </div>
        )}
      </div>

      {/* Package Plans List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider">
            Available Boost Subscriptions
          </h3>
          <span className="text-[10px] text-[#F15A24] font-bold">100% Mock Checkout</span>
        </div>

        <div className="space-y-3">
          {packages.filter((p) => p.isActive).map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-5 border shadow-card transition-all relative ${
                pkg.popular ? 'border-2 border-[#F15A24]' : 'border-[#EBE5D8]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-[#F15A24] text-white text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl shadow-xs">
                  Most Popular
                </div>
              )}

              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-display font-extrabold text-base text-[#1C1C1C]">
                    {pkg.name}
                  </h4>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    Valid for {pkg.durationDays} Days
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-extrabold text-[#F15A24]">
                    ₹{pkg.price}
                  </span>
                  <p className="text-[10px] text-[#6B6B6B]">one-time</p>
                </div>
              </div>

              {/* Benefits list */}
              <div className="space-y-2 py-3 border-t border-[#F2ECE1]">
                {pkg.benefitsDescription.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-[#1C1C1C]">
                    <div className="w-4 h-4 rounded-full bg-[#EBF7F0] flex items-center justify-center text-[#2E9E5B] flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handleStartPurchase(pkg.id)}
                className="w-full mt-2 py-3 rounded-2xl brand-gradient text-white font-extrabold text-xs shadow-md active-press flex items-center justify-center gap-1.5 hover:opacity-95"
              >
                <Zap className="w-4 h-4" />
                <span>Activate {pkg.name} (₹{pkg.price})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Boost Value Explanation */}
      <div className="bg-[#FAF6EE] rounded-3xl p-4 border border-[#EBE5D8] space-y-2">
        <h4 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-[#F15A24]" />
          Why Driver Boost Works?
        </h4>
        <p className="text-xs text-[#6B6B6B] leading-relaxed">
          Riders searching for your route immediately see your rides on the top banner with an orange gradient border and a direct "Call" button, leading to 3.5x faster seat fill rates.
        </p>
      </div>

      {/* Mock Payment Dialog */}
      <MockPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        title="Purchase Driver Boost"
        amount={activePkg.price}
        itemDescription={`${activePkg.name} (${activePkg.durationDays} Days)`}
      />
    </div>
  );
};
