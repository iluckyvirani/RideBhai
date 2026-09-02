import React from 'react';
import { Phone, MessageCircle, Ticket } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { ContactActions } from './ContactActions';
import { Inquiry } from '../../types';

interface InquiriesViewProps {
  mode: 'rider' | 'partner';
}

export const InquiriesView: React.FC<InquiriesViewProps> = ({ mode }) => {
  const { inquiries, currentRider, currentDriver, currentAgency, carListings, agencyTripPosts } =
    useAppStore();

  const partnerIds = [currentDriver.id, currentAgency.id];
  const incoming =
    mode === 'partner' ? inquiries.filter((i) => partnerIds.includes(i.partnerId)) : [];
  const outgoing =
    mode === 'partner'
      ? inquiries.filter(
          (i) => i.inquirerRole === 'partner' && partnerIds.includes(i.riderId) && !partnerIds.includes(i.partnerId)
        )
      : [];
  const riderItems = mode === 'rider' ? inquiries.filter((i) => i.riderId === currentRider.id) : [];

  const myListings =
    mode === 'partner'
      ? carListings.filter((c) => c.partnerId === currentDriver.id || c.partnerId === currentAgency.id)
      : [];
  const myTours =
    mode === 'partner' ? agencyTripPosts.filter((t) => t.agencyId === currentAgency.id) : [];

  const listingContact = (inq: Inquiry) => {
    if (inq.listingType === 'car') {
      const c = carListings.find((x) => x.id === inq.listingId);
      return { phone: c?.partnerPhone || '', whatsapp: c?.partnerWhatsapp };
    }
    const t = agencyTripPosts.find((x) => x.id === inq.listingId);
    return { phone: t?.agencyPhone || '', whatsapp: t?.whatsappNumber };
  };

  const renderInquiry = (inq: Inquiry, kind: 'incoming' | 'outgoing' | 'rider') => {
    const listing = listingContact(inq);
    const fromPartner = inq.inquirerRole === 'partner';
    const callbackPhone = kind === 'incoming' ? inq.inquirerPhone : listing.phone;
    const callbackWa = kind === 'incoming' ? inq.inquirerPhone : listing.whatsapp;

    return (
      <div key={inq.id} className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase text-[#F15A24]">
            {inq.listingType} · {inq.channel}
            {fromPartner ? ' · partner' : kind === 'rider' ? '' : ' · customer'}
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
        <p className="text-sm font-extrabold text-[#1C1C1C]">{inq.title}</p>
        <p className="text-[11px] text-[#6B6B6B]">
          {kind === 'outgoing'
            ? `You contacted ${inq.partnerName}`
            : kind === 'incoming'
              ? `${fromPartner ? 'Partner' : 'Customer'}: ${inq.riderName}`
              : `Partner: ${inq.partnerName}`}{' '}
          · ₹{inq.price.toLocaleString('en-IN')}
        </p>
        <p className="text-[11px] font-bold text-[#1C1C1C] flex items-center gap-1">
          {inq.channel === 'call' ? <Phone className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
          {kind === 'outgoing' ? `You used ${inq.channel}` : `Contacted via ${inq.channel}`}
        </p>
        {callbackPhone ? (
          <ContactActions phone={callbackPhone} whatsapp={callbackWa} compact />
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      <div>
        <h2 className="text-lg font-extrabold text-[#1C1C1C]">Bookings</h2>
        <p className="text-[11px] text-[#6B6B6B]">
          {mode === 'rider'
            ? 'Cars and tours you contacted. Deal happens directly — no app payment.'
            : 'Incoming Call / WhatsApp on your posts, plus other partners you contacted.'}
        </p>
      </div>

      {mode === 'partner' && (myListings.length > 0 || myTours.length > 0) && (
        <div className="space-y-2">
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B]">My posts</h3>
          {myListings.map((c) => (
            <div key={c.id} className="p-3 rounded-2xl bg-white border border-[#EBE5D8] text-xs font-bold">
              Car · {c.carName} · ₹{c.fullCarPrice.toLocaleString('en-IN')}
            </div>
          ))}
          {myTours.map((t) => (
            <div key={t.id} className="p-3 rounded-2xl bg-white border border-[#EBE5D8] text-xs font-bold">
              Tour · {t.fromCity} → {t.toCity} · ₹{t.totalCustomerPrice.toLocaleString('en-IN')}
              {t.status === 'closed' ? ' · Closed' : t.status === 'active' ? ' · Showing' : ''}
            </div>
          ))}
        </div>
      )}

      {mode === 'partner' && (
        <>
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B]">Incoming</h3>
          {incoming.length === 0 && (
            <p className="text-xs font-bold text-[#6B6B6B]">No one has contacted your posts yet.</p>
          )}
          {incoming.map((inq) => renderInquiry(inq, 'incoming'))}

          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6B6B] pt-2">
            You contacted other partners
          </h3>
          {outgoing.length === 0 && (
            <p className="text-xs font-bold text-[#6B6B6B]">
              Open Cars or Tours and Call / WhatsApp another partner’s listing.
            </p>
          )}
          {outgoing.map((inq) => renderInquiry(inq, 'outgoing'))}
        </>
      )}

      {mode === 'rider' && riderItems.length === 0 && (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
          <Ticket className="w-8 h-8 mx-auto text-[#EBE5D8] mb-2" />
          <p className="text-sm font-bold text-[#6B6B6B]">No inquiries yet.</p>
        </div>
      )}
      {mode === 'rider' && riderItems.map((inq) => renderInquiry(inq, 'rider'))}
    </div>
  );
};
