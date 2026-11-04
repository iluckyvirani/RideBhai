import React, { useEffect, useState } from 'react';
import {
  PackageCheck,
  Check,
  Zap,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  Clock,
  Calendar,
  Tag,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../../store/useAppStore';
import { api, getToken } from '../../lib/api';
import { PlanCardSkeleton } from '../common/SkeletonLoader';
import { openRazorpayCheckout } from '../../lib/razorpay';

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
  auto_pay?: boolean;
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

interface AgencyPackagesViewProps {
  onNeedAuth?: () => void;
}

export const AgencyPackagesView: React.FC<AgencyPackagesViewProps> = ({ onNeedAuth }) => {
  const { currentUser, isLoggedIn, hydrateMe } = useAppStore();
  const verified = currentUser?.profileStatus === 'verified';

  const [plans, setPlans] = useState<ServerPlan[]>([]);
  const [subscription, setSubscription] = useState<ServerSub | null>(null);
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [successNotif, setSuccessNotif] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [autoPayCheckout, setAutoPayCheckout] = useState(true);
  const [togglingAutoPay, setTogglingAutoPay] = useState(false);

  const handleToggleAutoPay = async () => {
    if (!subscription) return;
    setTogglingAutoPay(true);
    try {
      const nextState = !subscription.auto_pay;
      await api('/plans/auto-pay', {
        method: 'PATCH',
        json: { enabled: nextState },
      });
      setSubscription({ ...subscription, auto_pay: nextState });
      const me = await hydrateMe();
      if (me?.subscription) {
        setSubscription(me.subscription as ServerSub);
      }
      setSuccessNotif(
        nextState
          ? 'Auto-Pay enabled! Your plan will renew automatically.'
          : 'Auto-Pay disabled. You can manually renew anytime.'
      );
      setTimeout(() => setSuccessNotif(''), 4000);
    } catch (err: any) {
      setError(err?.message || 'Could not update auto-pay setting.');
    } finally {
      setTogglingAutoPay(false);
    }
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await api<ServerPlan[]>('/plans');
      setPlans(list);
      if (getToken()) {
        const me = await hydrateMe();
        setSubscription((me?.subscription as ServerSub) || null);
      }
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

  const daysLeft = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  /**
   * Primary checkout flow: Official Razorpay Gateway
   */
  const handleRazorpayPurchase = async (packageId: string) => {
    if (!isLoggedIn) {
      onNeedAuth?.();
      return;
    }

    if (!verified) {
      setError('Admin must verify your KYC before you can buy a plan.');
      return;
    }

    setPurchasingId(packageId);
    setIsProcessingRazorpay(true);
    setError('');

    try {
      if (autoPayCheckout) {
        // Attempt recurring Razorpay Subscription (UPI AutoPay Mandate)
        try {
          const subData = await api<{
            subscriptionId: string;
            amount: number;
            keyId: string;
            plan: any;
          }>('/plans/create-subscription', {
            method: 'POST',
            json: { planId: packageId },
          });

          const keyId = subData.keyId || (import.meta.env.VITE_RAZORPAY_KEY_ID as string);
          await openRazorpayCheckout({
            key: keyId,
            name: 'Ride Bhai',
            description: `${subData.plan?.name || 'Partner'} Plan Auto-Pay Mandate`,
            subscription_id: subData.subscriptionId,
            theme: { color: '#F15A24' },
            prefill: {
              name: currentUser?.name || '',
              contact: currentUser?.phone || '',
            },
            handler: async (response) => {
              try {
                await api('/plans/verify-subscription', {
                  method: 'POST',
                  json: {
                    planId: packageId,
                    razorpay_subscription_id: response.razorpay_subscription_id || subData.subscriptionId,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  },
                });

                const me = await hydrateMe();
                setSubscription((me?.subscription as ServerSub) || null);
                setSuccessNotif('Auto-Pay active! Recurring mandate setup successfully 🚀');
                confetti({
                  particleCount: 90,
                  spread: 75,
                  origin: { y: 0.6 },
                  colors: ['#F15A24', '#FF8A00', '#2E9E5B', '#FFB800'],
                });
                setTimeout(() => setSuccessNotif(''), 6000);
              } catch (verifyErr: any) {
                setError(verifyErr?.message || 'Subscription mandate verification failed');
              } finally {
                setPurchasingId(null);
                setIsProcessingRazorpay(false);
              }
            },
            modal: {
              ondismiss: () => {
                setPurchasingId(null);
                setIsProcessingRazorpay(false);
              },
            },
          });
          return;
        } catch (subErr: any) {
          console.warn('Subscription mandate skipped or falling back to standard order:', subErr);
          // If merchant has not activated subscriptions on dashboard, fallback to standard checkout
        }
      }

      // 1. Create order on the server
      const orderData = await api<{
        orderId: string;
        amount: number;
        currency: string;
        keyId: string;
        plan: any;
      }>('/plans/create-order', {
        method: 'POST',
        json: { planId: packageId },
      });

      const keyId =
        orderData.keyId ||
        (import.meta.env.VITE_RAZORPAY_KEY_ID as string);

      if (!keyId) {
        throw new Error('Razorpay Key ID is not configured on the server. Please add your live Razorpay credentials in server/.env');
      }

      // 2. Open Razorpay Checkout modal
      await openRazorpayCheckout({
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Ride Bhai',
        description: `${orderData.plan?.name || 'Partner'} Plan`,
        order_id: orderData.orderId,
        theme: { color: '#F15A24' },
        prefill: {
          name: currentUser?.name || '',
          contact: currentUser?.phone || '',
        },
        handler: async (response) => {
          try {
            // 3. Verify signature on server and activate plan
            await api('/plans/verify-payment', {
              method: 'POST',
              json: {
                planId: packageId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                autoPay: autoPayCheckout,
              },
            });

            const me = await hydrateMe();
            setSubscription((me?.subscription as ServerSub) || null);
            setSuccessNotif(
              'Payment successful! Your plan is now active 🚀'
            );

            confetti({
              particleCount: 90,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#F15A24', '#FF8A00', '#2E9E5B', '#FFB800'],
            });

            setTimeout(() => setSuccessNotif(''), 6000);
          } catch (verifyErr: any) {
            setError(verifyErr?.message || 'Payment verification failed');
          } finally {
            setPurchasingId(null);
            setIsProcessingRazorpay(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPurchasingId(null);
            setIsProcessingRazorpay(false);
          },
        },
      });
    } catch (err: any) {
      console.error('Payment order initiation failed:', err);
      setError(
        err?.message
          ? `${err.message}`
          : 'Could not connect to payment gateway. Please try again.'
      );
      setIsProcessingRazorpay(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-extrabold text-[#1C1C1C]">Plans</h2>
          <p className="text-[11px] text-[#6B6B6B]">
            Buy a plan to unlock book, chat, and post.
          </p>
        </div>
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
        <div className="p-5 rounded-3xl bg-white border border-[#EBE5D8] shadow-card relative overflow-hidden space-y-4">
          {/* Top row: Status pill and Icon */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF7EE] text-[#00A86B] border border-[#BDE8C7] text-[11px] font-extrabold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse"></span>
              <span>Active Plan</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF0EB] border border-[#FFD8CB] flex items-center justify-center text-[#F15A24] shadow-2xs">
              <Sparkles className="w-5 h-5 text-[#F15A24]" />
            </div>
          </div>

          {/* Plan Name & Expiry badge */}
          <div>
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#1C1C1C] tracking-tight font-display">
                {subscription.plan_name}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#F15A24] bg-[#FFF0EB] px-3 py-1 rounded-full border border-[#FFD8CB]">
                <Clock className="w-3 h-3" />
                {daysLeft} days left
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-1 font-medium">
              Full access to book cars, direct chat, and publish tour listings.
            </p>
          </div>

          {/* Metric Sub-Cards */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-[#8A8478] tracking-wider">
                <Calendar className="w-3 h-3 text-[#6B6B6B]" />
                <span>Valid Until</span>
              </div>
              <p className="text-xs font-black text-[#1C1C1C]">
                {new Date(subscription.expires_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
              <p className="text-[10px] font-bold text-[#00A86B]">Active plan</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-[#8A8478] tracking-wider">
                <Tag className="w-3 h-3 text-[#F15A24]" />
                <span>Posts Balance</span>
              </div>
              <p className="text-xs font-black text-[#F15A24]">
                {subscription.posts_remaining > 5000
                  ? 'Unlimited'
                  : `${subscription.posts_remaining} remaining`}
              </p>
              <p className="text-[10px] font-bold text-[#6B6B6B]">Ready to post</p>
            </div>
          </div>

          {/* Auto-Pay / Auto-Renew Toggle */}
          <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#1C1C1C]">
                <RefreshCw className={`w-3.5 h-3.5 text-[#F15A24] ${togglingAutoPay ? 'animate-spin' : ''}`} />
                <span>Auto-Pay Subscription</span>
                {subscription.auto_pay ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EBF7EE] text-[#00A86B] border border-[#BDE8C7] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse"></span>
                    Enabled
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#8A8478] border border-[#EBE5D8]">
                    Disabled
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6B6B6B] leading-tight">
                {subscription.auto_pay
                  ? 'Automatic renewal is ON so your car & tour listings stay active.'
                  : 'Turn on Auto-Pay to seamlessly renew before plan expires.'}
              </p>
            </div>
            <button
              type="button"
              disabled={togglingAutoPay}
              onClick={handleToggleAutoPay}
              title={subscription.auto_pay ? 'Click to turn off Auto-Pay' : 'Click to turn on Auto-Pay'}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                subscription.auto_pay ? 'bg-[#00A86B]' : 'bg-[#D1C9BC]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  subscription.auto_pay ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Bottom status line */}
          <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#00A86B] font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00A86B]" />
              Posting & Deals Unlocked
            </span>
            <span className="text-[#8A8478] font-bold">
              {subscription.posts_remaining > 0 ? 'Ready to post' : 'Posts exhausted'}
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
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-[#6B6B6B] uppercase tracking-wider">
            Partner posting plans
          </h3>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-[#1C1C1C] select-none bg-[#FAF6EE] px-2.5 py-1 rounded-xl border border-[#EBE5D8]">
            <input
              type="checkbox"
              checked={autoPayCheckout}
              onChange={(e) => setAutoPayCheckout(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-[#F15A24] cursor-pointer"
            />
            <span className="text-[11px]">Enable Auto-Pay</span>
          </label>
        </div>
        {loading && <PlanCardSkeleton count={3} />}

        {plans.map((pkg) => {
          const isCurrentActive = subscription?.plan_id === pkg.id;
          const isThisPurchasing = purchasingId === pkg.id && isProcessingRazorpay;
          const benefits = benefitsList(pkg.benefits);

          return (
            <div
              key={pkg.id}
              className={`p-5 rounded-3xl bg-white border transition-all relative overflow-hidden shadow-card ${pkg.popular ? 'border-[#F15A24] ring-2 ring-[#F15A24]/20' : 'border-[#EBE5D8]'
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

              {/* Action Buttons */}
              <div className="mt-4 pt-2 space-y-2">
                <button
                  onClick={() => handleRazorpayPurchase(pkg.id)}
                  disabled={Boolean(purchasingId) || isCurrentActive || (isLoggedIn && !verified)}
                  className={`w-full py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${isCurrentActive
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : !isLoggedIn
                        ? 'brand-gradient text-white shadow-md active-press'
                        : !verified
                          ? 'bg-[#E5E5E5] text-[#6B6B6B] cursor-not-allowed'
                          : isThisPurchasing
                            ? 'bg-[#F15A24]/80 text-white cursor-wait'
                            : pkg.popular
                              ? 'bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white shadow-md active-press'
                              : 'bg-[#1C1C1C] text-white active-press'
                    }`}
                >
                  {isThisPurchasing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening checkout...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>
                        {isCurrentActive
                          ? 'Current active plan'
                          : !isLoggedIn
                            ? `Login to subscribe (₹${pkg.price.toLocaleString('en-IN')})`
                            : !verified
                              ? 'Verify KYC first'
                              : `Subscribe • ₹${pkg.price.toLocaleString('en-IN')}`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
