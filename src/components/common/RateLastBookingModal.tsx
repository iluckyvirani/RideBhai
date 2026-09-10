import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import type { Deal } from '../../lib/deals';
import { RateStars } from './RateStars';
import { useAppStore } from '../../store/useAppStore';

export function RateLastBookingModal({
  deal,
  otherName,
  onClose,
  onGoBookings,
}: {
  deal: Deal;
  otherName: string;
  onClose: () => void;
  onGoBookings: () => void;
}) {
  const { rateDeal } = useAppStore();
  const [busy, setBusy] = useState(false);
  const [picked, setPicked] = useState(deal.myRating || 0);
  const [error, setError] = useState('');

  const pick = async (stars: number) => {
    setBusy(true);
    setError('');
    try {
      await rateDeal(deal.id, stars);
      setPicked(stars);
    } catch (err: any) {
      setError(err?.message || 'Could not save rating.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60">
      <div className="w-full max-w-sm rounded-3xl bg-white border border-[#EBE5D8] p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold uppercase text-[#F15A24] flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              Rate last booking
            </p>
            <h3 className="text-sm font-extrabold text-[#1C1C1C] mt-1">{deal.title}</h3>
            <p className="text-[11px] text-[#6B6B6B] mt-0.5">
              {deal.listingType === 'tour' ? 'Tour' : 'Car'} · {otherName} · ₹{deal.price.toLocaleString('en-IN')}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl bg-[#FAF6EE]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs font-bold text-[#1C1C1C]">How was your last closed deal with {otherName}?</p>
        <div className="flex justify-center py-1">
          <RateStars value={picked} onPick={picked ? undefined : pick} disabled={busy || Boolean(picked)} />
        </div>
        {error && <p className="text-[11px] font-bold text-red-600">{error}</p>}
        <button
          type="button"
          onClick={onGoBookings}
          className="w-full py-2.5 rounded-2xl brand-gradient text-white text-xs font-extrabold"
        >
          Go to My bookings
        </button>
        <button type="button" onClick={onClose} className="w-full text-[11px] font-bold text-[#6B6B6B]">
          Later
        </button>
      </div>
    </div>
  );
}
