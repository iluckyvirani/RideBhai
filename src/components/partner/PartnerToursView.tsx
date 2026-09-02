import React from 'react';
import { MapPin, Car, EyeOff, RotateCcw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const PartnerToursView: React.FC = () => {
  const { agencyTripPosts, currentAgency, updateAgencyTripStatus } = useAppStore();
  const myTours = agencyTripPosts.filter((t) => t.agencyId === currentAgency.id);

  const closeTour = (id: string, title: string) => {
    const ok = window.confirm(
      `Confirm booking for "${title}" and stop showing this tour to customers?`
    );
    if (!ok) return;
    updateAgencyTripStatus(id, 'closed');
  };

  const reopenTour = (id: string) => {
    updateAgencyTripStatus(id, 'active');
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C]">
          My tour packages
        </h3>
        <p className="text-[10px] text-[#6B6B6B] mt-0.5">
          After you confirm a booking by call or WhatsApp, close the tour so it no longer shows.
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
                  {tour.fromCity} → {tour.toCity}
                </p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                  {tour.duration} · {tour.passengers} pax · ₹
                  {tour.totalCustomerPrice.toLocaleString('en-IN')}
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

            {isLive ? (
              <button
                onClick={() => closeTour(tour.id, `${tour.fromCity} → ${tour.toCity}`)}
                className="w-full py-2 rounded-xl bg-[#FFF0EB] text-[#E8380D] text-[11px] font-extrabold flex items-center justify-center gap-1.5"
              >
                <EyeOff className="w-3.5 h-3.5" />
                Confirm booking & close
              </button>
            ) : (
              <button
                onClick={() => reopenTour(tour.id)}
                className="w-full py-2 rounded-xl bg-[#FAF6EE] text-[#1C1C1C] text-[11px] font-extrabold flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Show again
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
