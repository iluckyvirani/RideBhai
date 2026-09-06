import React, { useEffect, useState } from 'react';
import { Ticket } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Deal } from '../../lib/deals';
import { ChatListSkeleton } from './SkeletonLoader';

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
  const { deals, currentUser, refreshDeals } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshDeals().finally(() => setLoading(false));
  }, [refreshDeals]);

  const mine = deals.filter((d) => d.channel === 'ridebhai' && currentUser?.id && (d.buyerId === currentUser.id || d.sellerId === currentUser.id));
  const incoming = mine.filter((d) => d.sellerId === currentUser?.id);
  const outgoing = mine.filter((d) => d.buyerId === currentUser?.id);

  const renderDeal = (deal: Deal, kind: 'incoming' | 'outgoing') => (
    <div key={deal.id} className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-extrabold uppercase text-[#F15A24]">
          {deal.listingType} · Ride Bhai
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
            Ride Bhai deals only — pending, success or cancelled. Direct chats stay in Chat.
          </p>
        </div>
      )}

      {loading && mine.length === 0 && <ChatListSkeleton count={3} />}
      {!loading && mine.length === 0 && (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
          <Ticket className="w-8 h-8 mx-auto text-[#EBE5D8] mb-2" />
          <p className="text-sm font-bold text-[#6B6B6B]">No Ride Bhai bookings yet.</p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            Tap Deal with Ride Bhai on a car or tour.
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
    </div>
  );
};
