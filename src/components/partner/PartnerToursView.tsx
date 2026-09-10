import React from 'react';
import { MapPin, Car, EyeOff, RotateCcw, Trash2, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AgencyTripPost } from '../../types';

interface PartnerToursViewProps {
  onOpenDetails?: (tour: AgencyTripPost) => void;
}

export const PartnerToursView: React.FC<PartnerToursViewProps> = ({ onOpenDetails }) => {
  const { agencyTripPosts, currentUser, updateAgencyTripStatus, deleteAgencyTrip } = useAppStore();
  const myTours = agencyTripPosts.filter((t) => t.agencyId === currentUser?.id);

  const closeTour = async (id: string, title: string) => {
    const ok = window.confirm(
      `Confirm booking for "${title}" and stop showing this tour to customers?`
    );
    if (!ok) return;
    try {
      await updateAgencyTripStatus(id, 'closed');
    } catch (err: any) {
      window.alert(err?.message || 'Could not close this tour.');
    }
  };

  const removeTour = async (id: string, title: string) => {
    const ok = window.confirm(`Delete tour "${title}"? Related chats will also be removed.`);
    if (!ok) return;
    try {
      await deleteAgencyTrip(id);
    } catch (err: any) {
      window.alert(err?.message || 'Could not delete this tour.');
    }
  };

  const reopenTour = async (id: string) => {
    try {
      await updateAgencyTripStatus(id, 'active');
    } catch (err: any) {
      window.alert(err?.message || 'Could not show this tour again.');
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C]">
          My tour packages
        </h3>
        <p className="text-[10px] text-[#6B6B6B] mt-0.5">
          After you confirm a booking in chat or Deal with Ride Bhai, close the tour so it no longer shows.
        </p>
      </div>

      {myTours.length === 0 && (
        <p className="text-[11px] text-[#6B6B6B]">No tour packages yet. Post one from the Tours tab.</p>
      )}

      {myTours.map((tour) => {
        const isLive = tour.status === 'active';
        return (
          <div key={tour.id} className="p-3 rounded-2xl bg-white border border-[#EBE5D8] space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#F15A24]" />
                  {tour.fromCity} {tour.tripSide === 'two_side' ? '⇄' : '→'} {tour.toCity}
                </p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                  {tour.tripSide === 'two_side' ? 'Two side' : 'One side'} · {tour.duration} · {tour.passengers} pax
                </p>
                <p className="text-[10px] font-bold text-[#1C1C1C]">
                  Booking {(tour.bookingDate || tour.startDate || '').split('-').reverse().join('/')}
                  {tour.bookingTime || tour.pickupTime ? ` · ${tour.bookingTime || tour.pickupTime}` : ''}
                </p>
                <p className="text-[11px] font-bold text-[#1C1C1C] mt-1">
                  Total ₹{tour.totalCustomerPrice.toLocaleString('en-IN')} · Agency ₹
                  {tour.agencyCommission.toLocaleString('en-IN')} · Car ₹
                  {tour.driverNetPayout.toLocaleString('en-IN')}
                </p>
              </div>
              <span
                className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isLive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-[#FAF6EE] text-[#6B6B6B] border border-[#EBE5D8]'
                }`}
              >
                {isLive ? 'Showing' : 'Closed'}
              </span>
            </div>

            {tour.desiredCar?.name && (
              <p className="text-[11px] font-bold text-[#1C1C1C] flex items-center gap-1">
                <Car className="w-3 h-3 text-[#F15A24]" />
                {tour.desiredCar.name}
                {tour.desiredCar.specs?.length ? ` · ${tour.desiredCar.specs.filter(Boolean).join(', ')}` : ''}
              </p>
            )}

            <button
              type="button"
              onClick={() => onOpenDetails?.(tour)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-[11px] font-extrabold text-[#F15A24]"
            >
              View details
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="flex gap-2">
            {isLive ? (
              <button
                onClick={() => closeTour(tour.id, `${tour.fromCity} → ${tour.toCity}`)}
                className="flex-1 py-2 rounded-xl bg-[#FFF0EB] text-[#E8380D] text-[11px] font-extrabold flex items-center justify-center gap-1.5"
              >
                <EyeOff className="w-3.5 h-3.5" />
                Confirm booking & close
              </button>
            ) : (
              <button
                onClick={() => reopenTour(tour.id)}
                className="flex-1 py-2 rounded-xl bg-[#FAF6EE] text-[#1C1C1C] text-[11px] font-extrabold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Show again
              </button>
            )}
              <button
                type="button"
                onClick={() => removeTour(tour.id, `${tour.fromCity} → ${tour.toCity}`)}
                className="inline-flex items-center justify-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-extrabold text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
