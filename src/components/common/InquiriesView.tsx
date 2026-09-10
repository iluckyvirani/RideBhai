import React, { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Deal } from '../../lib/deals';
import { ChatListSkeleton } from './SkeletonLoader';
import { RateStars } from './RateStars';

interface InquiriesViewProps {
  mode: 'rider' | 'partner' | 'user';
  embedded?: boolean;
  onOpenChat?: (threadId: string) => void;
}

function statusClass(status: Deal['status']) {
  if (status === 'success') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (status === 'cancelled') return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-amber-50 text-amber-800 border-amber-200';
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({ mode, embedded, onOpenChat }) => {
  const { deals, currentUser, refreshDeals, rateDeal } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [ratingId, setRatingId] = useState('');

  useEffect(() => {
    refreshDeals().finally(() => setLoading(false));
  }, [refreshDeals]);

  const mine = deals.filter(
    (d) => currentUser?.id && (d.buyerId === currentUser.id || d.sellerId === currentUser.id)
  );
  const active = mine.filter((d) => d.status === 'open' || d.status === 'pending');
  const history = mine.filter((d) => d.status === 'success' || d.status === 'cancelled');
  const incoming = active.filter((d) => d.sellerId === currentUser?.id);
  const outgoing = active.filter((d) => d.buyerId === currentUser?.id);

  const giveRating = async (dealId: string, stars: number) => {
    setRatingId(dealId);
    try {
      await rateDeal(dealId, stars);
    } finally {
      setRatingId('');
    }
  };

  const renderDeal = (deal: Deal, kind: 'incoming' | 'outgoing') => (
    <div key={deal.id} className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase text-[#F15A24]">
          {deal.listingType} · {deal.channel === 'ridebhai' ? 'Ride Bhai' : 'Direct'}
        </span>
        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${statusClass(deal.status)}`}>
          {deal.status}
        </span>
      </div>
      <p className="text-sm font-extrabold text-[#1C1C1C]">{deal.title}</p>
      <p className="text-[11px] text-[#6B6B6B]">
        {kind === 'outgoing' ? `You requested ${deal.sellerName}` : `${deal.buyerName} requested you`}
        {' · '}₹{deal.price.toLocaleString('en-IN')}
      </p>
      <p className="text-[10px] font-bold text-[#6B6B6B]">
        {new Date(deal.createdAt).toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </p>
      {deal.status === 'success' && (
        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="text-[10px] font-bold text-[#6B6B6B]">
            {deal.myRating ? 'Your rating' : `Rate ${kind === 'outgoing' ? deal.sellerName : deal.buyerName}`}
          </span>
          <RateStars
            value={deal.myRating}
            onPick={deal.myRating ? undefined : (stars) => giveRating(deal.id, stars)}
            disabled={ratingId === deal.id || Boolean(deal.myRating)}
            size="sm"
          />
        </div>
      )}
      {deal.threadId && onOpenChat && (
        <button
          type="button"
          onClick={() => onOpenChat(deal.threadId!)}
          className="w-full py-2 rounded-xl bg-[#FAF6EE] text-[11px] font-extrabold text-[#F15A24]"
        >
          Open chat
        </button>
      )}
    </div>
  );

  return (
    <div className={`space-y-4 animate-fade-in ${embedded ? '' : 'pb-24'}`}>
      {!embedded && (
        <div>
          <h2 className="text-lg font-extrabold text-[#1C1C1C]">My bookings</h2>
          <p className="text-[11px] text-[#6B6B6B]">
            Open deals and closed history. After both sides close in chat, rate the other person here.
          </p>
        </div>
      )}

      {loading && mine.length === 0 && <ChatListSkeleton count={3} />}
      {!loading && mine.length === 0 && (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
          <Ticket className="w-8 h-8 mx-auto text-[#EBE5D8] mb-2" />
          <p className="text-sm font-bold text-[#6B6B6B]">No deals yet.</p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            Message direct or Deal with Ride Bhai, then close the deal in chat.
          </p>
        </div>
      )}

      {(mode === 'partner' || mode === 'user' || mode === 'rider') && incoming.length > 0 && (
        <>
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B]">Incoming</h3>
          {incoming.map((deal) => renderDeal(deal, 'incoming'))}
        </>
      )}

      {(mode === 'partner' || mode === 'user' || mode === 'rider') && outgoing.length > 0 && (
        <>
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B] pt-2">You requested</h3>
          {outgoing.map((deal) => renderDeal(deal, 'outgoing'))}
        </>
      )}

      {history.length > 0 && (
        <>
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B] pt-2">
            Deal history
          </h3>
          {history.map((deal) =>
            renderDeal(deal, deal.sellerId === currentUser?.id ? 'incoming' : 'outgoing')
          )}
        </>
      )}
    </div>
  );
};
