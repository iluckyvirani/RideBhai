import React from 'react';
import { Phone, MessageCircle, Ticket } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Inquiry } from '../../types';

interface MyBookingsPreviewProps {
  mode: 'rider' | 'partner';
  onShowAll: () => void;
}

export const MyBookingsPreview: React.FC<MyBookingsPreviewProps> = ({ mode, onShowAll }) => {
  const { inquiries, currentRider, currentDriver, currentAgency } = useAppStore();
  const partnerIds = [currentDriver.id, currentAgency.id];

  const items: { inq: Inquiry; kind: 'incoming' | 'outgoing' | 'rider' }[] =
    mode === 'partner'
      ? [
          ...inquiries
            .filter((i) => partnerIds.includes(i.partnerId))
            .map((inq) => ({ inq, kind: 'incoming' as const })),
          ...inquiries
            .filter(
              (i) =>
                i.inquirerRole === 'partner' &&
                partnerIds.includes(i.riderId) &&
                !partnerIds.includes(i.partnerId)
            )
            .map((inq) => ({ inq, kind: 'outgoing' as const })),
        ].sort((a, b) => new Date(b.inq.createdAt).getTime() - new Date(a.inq.createdAt).getTime())
      : inquiries
          .filter((i) => i.riderId === currentRider.id)
          .map((inq) => ({ inq, kind: 'rider' as const }));

  const preview = items.slice(0, 2);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C]">
            My bookings
          </h3>
          <p className="text-[10px] text-[#6B6B6B] mt-0.5">
            Call / WhatsApp history. Tap Show all for the full list.
          </p>
        </div>
        <button
          type="button"
          onClick={onShowAll}
          className="text-[11px] font-extrabold text-[#F15A24] flex-shrink-0"
        >
          Show all
        </button>
      </div>

      {preview.length === 0 && (
        <p className="text-[11px] text-[#6B6B6B]">
          No contacts yet. Call or WhatsApp a car or tour — it will appear here.
        </p>
      )}

      {preview.map(({ inq, kind }) => (
        <button
          key={inq.id}
          type="button"
          onClick={onShowAll}
          className="w-full text-left p-3 rounded-2xl bg-white border border-[#EBE5D8] space-y-1"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase text-[#F15A24]">
              {inq.listingType} · {inq.channel}
              {inq.inquirerRole === 'partner' ? ' · partner' : ''}
            </span>
            <span className="text-[10px] font-bold text-[#6B6B6B]">
              {new Date(inq.createdAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <p className="text-xs font-extrabold text-[#1C1C1C]">{inq.title}</p>
          <p className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
            {inq.channel === 'call' ? <Phone className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
            {kind === 'outgoing'
              ? `You contacted ${inq.partnerName}`
              : kind === 'incoming'
                ? `${inq.inquirerRole === 'partner' ? 'Partner' : 'Customer'}: ${inq.riderName}`
                : inq.partnerName}{' '}
            · ₹{inq.price.toLocaleString('en-IN')}
          </p>
        </button>
      ))}

      {items.length > 2 && (
        <button
          type="button"
          onClick={onShowAll}
          className="w-full py-2 rounded-xl bg-[#FAF6EE] text-[11px] font-extrabold text-[#F15A24] flex items-center justify-center gap-1"
        >
          <Ticket className="w-3.5 h-3.5" />
          Show all {items.length} bookings
        </button>
      )}
    </div>
  );
};
