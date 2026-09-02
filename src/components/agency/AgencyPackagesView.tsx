import React, { useState } from 'react';
import {
  PackageCheck,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MockPaymentModal } from '../common/MockPaymentModal';

export const AgencyPackagesView: React.FC = () => {
  const {
    agencyPackages,
    currentAgency,
    getAgencyActiveSubscription,
    purchaseAgencyPackage,
  } = useAppStore();

  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [successNotif, setSuccessNotif] = useState('');

  const activeSub = getAgencyActiveSubscription(currentAgency.id);
  const payPkg = agencyPackages.find((p) => p.id === purchasingId);

  const handlePurchase = (packageId: string) => {
    setPurchasingId(packageId);
    setPayOpen(true);
  };

  const handlePaySuccess = () => {
    if (!purchasingId) return;
    try {
      purchaseAgencyPackage(currentAgency.id, purchasingId);
      setSuccessNotif('Package paid and activated. You can now post cars and tour packages.');
      setTimeout(() => setSuccessNotif(''), 5000);
    } catch (err: any) {
      alert(err?.message || 'Purchase failed');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Active Subscription Banner */}
      {activeSub ? (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] text-white shadow-card relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00A86B]/20 text-[#00A86B] border border-[#00A86B]/30 text-[10px] font-extrabold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse"></span>
                <span>Active Subscription</span>
              </div>
              <h2 className="text-base font-extrabold text-white">
                {activeSub.pkg.name}
              </h2>
              <p className="text-xs text-white/70 mt-1">
                Valid until {new Date(activeSub.sub.expiresAt).toLocaleDateString()}
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-[#F15A24] flex items-center justify-center text-white shadow-lg">
              <PackageCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/70">Posts Allowed:</span>
            <span className="font-extrabold text-[#FF7A45]">
              {activeSub.sub.postsRemaining > 5000 ? 'Unlimited Postings' : `${activeSub.sub.postsRemaining} Remaining`}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#F15A24] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-[#8A2B09]">
              No Active Posting Package
            </h3>
            <p className="text-[11px] text-[#A33B12] mt-0.5 leading-relaxed">
              Posting cars and tours unlocks after you pay for a plan here. This is the only in-app payment — customers contact you by Call or WhatsApp.
            </p>
          </div>
        </div>
      )}

      {successNotif && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{successNotif}</span>
        </div>
      )}

      {/* Package Store Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-[#6B6B6B] uppercase tracking-wider px-1">
          Partner posting plans (pay in app)
        </h3>

        {agencyPackages.map((pkg) => {
          const isCurrentActive = activeSub?.sub.packageId === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`p-5 rounded-3xl bg-white border transition-all relative overflow-hidden shadow-card ${
                pkg.popular
                  ? 'border-[#F15A24] ring-2 ring-[#F15A24]/20'
                  : 'border-[#EBE5D8]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#F15A24] to-[#FF7A45] text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-[#F15A24] uppercase tracking-wider">
                    {pkg.badgeText}
                  </span>
                  <h4 className="text-sm font-extrabold text-[#1C1C1C] mt-0.5">
                    {pkg.name}
                  </h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black text-[#1C1C1C]">
                      ₹{pkg.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#6B6B6B]">
                      / {pkg.durationDays} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="mt-4 pt-3 border-t border-[#FAF6EE] space-y-2">
                {pkg.benefitsDescription.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Purchase Button */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={purchasingId === pkg.id || isCurrentActive}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 active-press ${
                    isCurrentActive
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : pkg.popular
                      ? 'bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white shadow-md hover:shadow-lg'
                      : 'bg-[#1C1C1C] hover:bg-[#333333] text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {isCurrentActive
                      ? '✓ Current Active Plan'
                      : `Pay ₹${pkg.price.toLocaleString()} in app`}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <MockPaymentModal
        isOpen={payOpen}
        onClose={() => {
          setPayOpen(false);
          setPurchasingId(null);
        }}
        onSuccess={handlePaySuccess}
        title="Partner package payment"
        amount={payPkg?.price || 0}
        itemDescription={payPkg ? `${payPkg.name} · unlock posting cars & tours` : 'Posting package'}
      />
    </div>
  );
};
