import React, { useEffect, useState } from 'react';
import { PackageCheck, Check, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MockPaymentModal } from '../common/MockPaymentModal';
import { api } from '../../lib/api';
import { PlanCardSkeleton } from '../common/SkeletonLoader';

type ServerPlan = {
  id: string;
  name: string;
  price: number;
  duration_days: number;
  post_limit: number;
  badge_text: string | null;
  benefits: string[] | string;
  popular: boolean;
};

type ServerSub = {
  id: string;
  plan_id: string;
  expires_at: string;
  posts_remaining: number;
  plan_name: string;
};

function benefitsList(raw: ServerPlan['benefits']): string[] {
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const AgencyPackagesView: React.FC = () => {
  const { currentUser, hydrateMe } = useAppStore();
  const verified = currentUser?.profileStatus === 'verified';

  const [plans, setPlans] = useState<ServerPlan[]>([]);
  const [subscription, setSubscription] = useState<ServerSub | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [payOpen, setPayOpen] = useState(false);
  const [successNotif, setSuccessNotif] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await api<ServerPlan[]>('/plans');
      setPlans(list);
      const me = await hydrateMe();
      setSubscription((me?.subscription as ServerSub) || null);
    } catch (err: any) {
      setError(err?.message || 'Could not load plans. Is the API running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const payPkg = plans.find((p) => p.id === purchasingId);
  const daysLeft = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  const handlePurchase = (packageId: string) => {
    if (!verified) {
      setError('Admin must verify your KYC before you can buy a plan.');
      return;
    }
    setPurchasingId(packageId);
    setPayOpen(true);
  };

  const handlePaySuccess = async (method: 'upi' | 'card') => {
    if (!purchasingId) return;
    try {
      await api('/plans/subscribe', {
        method: 'POST',
        json: {
          planId: purchasingId,
          paymentMethod: method === 'card' ? 'card' : 'self_transfer',
        },
      });
      const me = await hydrateMe();
      setSubscription((me?.subscription as ServerSub) || null);
      setSuccessNotif('Plan paid and activated. Chat, booking and posting are unlocked.');
      setTimeout(() => setSuccessNotif(''), 5000);
    } catch (err: any) {
      setError(err?.message || 'Purchase failed');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      <div>
        <h2 className="text-lg font-extrabold text-[#1C1C1C]">Posting plans</h2>
        <p className="text-[11px] text-[#6B6B6B]">
          After admin verifies your profile, buy a plan to book, chat, and post. This is the only in-app payment.
        </p>
      </div>

      {!verified && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
          KYC is not verified yet. Buy unlocks after admin approves your Aadhaar and selfie.
        </div>
      )}

      {error && (
        <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-2xl">{error}</p>
      )}

      {subscription ? (
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1C1C1C] to-[#2D2D2D] text-white shadow-card relative overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00A86B]/20 text-[#00A86B] border border-[#00A86B]/30 text-[10px] font-extrabold mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse"></span>
                <span>Your current active plan</span>
              </div>
              <h2 className="text-base font-extrabold text-white">{subscription.plan_name}</h2>
              <p className="text-xs text-white/70 mt-1">
                Valid until {new Date(subscription.expires_at).toLocaleDateString('en-IN')}
              </p>
              <p className="text-[11px] font-extrabold text-[#FF7A45] mt-1">{daysLeft} days left</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#F15A24] flex items-center justify-center text-white shadow-lg">
              <PackageCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white/70">Posts allowed</span>
            <span className="font-extrabold text-[#FF7A45]">
              {subscription.posts_remaining > 5000
                ? 'Unlimited postings'
                : `${subscription.posts_remaining} remaining`}
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#F15A24] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-[#8A2B09]">No active plan</h3>
            <p className="text-[11px] text-[#A33B12] mt-0.5 leading-relaxed">
              Chat, booking and posting stay locked until you pay for a plan here.
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

      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-[#6B6B6B] uppercase tracking-wider px-1">
          Partner posting plans
        </h3>
        {loading && <PlanCardSkeleton count={3} />}

        {plans.map((pkg) => {
          const isCurrentActive = subscription?.plan_id === pkg.id;
          const benefits = benefitsList(pkg.benefits);
          return (
            <div
              key={pkg.id}
              className={`p-5 rounded-3xl bg-white border transition-all relative overflow-hidden shadow-card ${
                pkg.popular ? 'border-[#F15A24] ring-2 ring-[#F15A24]/20' : 'border-[#EBE5D8]'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#F15A24] to-[#FF7A45] text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div>
                <span className="text-[10px] font-extrabold text-[#F15A24] uppercase tracking-wider">
                  {pkg.badge_text}
                </span>
                <h4 className="text-sm font-extrabold text-[#1C1C1C] mt-0.5">{pkg.name}</h4>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-black text-[#1C1C1C]">₹{pkg.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs text-[#6B6B6B]">/ {pkg.duration_days} days</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#FAF6EE] space-y-2">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-2">
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={purchasingId === pkg.id || isCurrentActive || !verified}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                    isCurrentActive
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : !verified
                        ? 'bg-[#E5E5E5] text-[#6B6B6B] cursor-not-allowed'
                        : pkg.popular
                          ? 'bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white shadow-md'
                          : 'bg-[#1C1C1C] text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {isCurrentActive
                      ? 'Current active plan'
                      : !verified
                        ? 'Verify KYC first'
                        : `Pay ₹${pkg.price.toLocaleString('en-IN')} in app`}
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
        itemDescription={payPkg ? `${payPkg.name} · unlock chat, booking and posting` : 'Posting package'}
      />
    </div>
  );
};
