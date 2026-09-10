import React from 'react';
import { Ticket } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface MyBookingsPreviewProps {
  mode: 'rider' | 'partner' | 'user';
  onShowAll: () => void;
}

export const MyBookingsPreview: React.FC<MyBookingsPreviewProps> = ({ onShowAll }) => {
  const { deals, currentUser } = useAppStore();
  const mine = deals.filter(
    (d) => currentUser?.id && (d.buyerId === currentUser.id || d.sellerId === currentUser.id)
  );
  const preview = mine.slice(0, 2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C]">My bookings</h3>
          <p className="text-[10px] text-[#6B6B6B] mt-0.5">
            Open deals and closed history.
          </p>
        </div>
        <button type="button" onClick={onShowAll} className="text-[11px] font-extrabold text-[#F15A24] flex-shrink-0">
          Show all
        </button>
      </div>

      {preview.length === 0 && (
        <p className="text-[11px] text-[#6B6B6B]">No deals yet. Close a chat deal to see it here.</p>
      )}

      {preview.map((deal) => (
        <button
          key={deal.id}
          type="button"
          onClick={onShowAll}
          className="w-full text-left p-3 rounded-2xl bg-white border border-[#EBE5D8] space-y-1"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase text-[#F15A24]">{deal.listingType} · Ride Bhai</span>
            <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">{deal.status}</span>
          </div>
          <p className="text-xs font-extrabold text-[#1C1C1C]">{deal.title}</p>
          <p className="text-[11px] text-[#6B6B6B]">₹{deal.price.toLocaleString('en-IN')}</p>
        </button>
      ))}

      {mine.length > 2 && (
        <button
          type="button"
          onClick={onShowAll}
          className="w-full py-2 rounded-xl bg-[#FAF6EE] text-[11px] font-extrabold text-[#F15A24] flex items-center justify-center gap-1"
        >
          <Ticket className="w-3.5 h-3.5" />
          Show all {mine.length} bookings
        </button>
      )}
    </div>
  );
};
