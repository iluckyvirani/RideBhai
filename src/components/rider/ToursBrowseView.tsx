import React, { useMemo, useState } from 'react';
import { Sparkles, MapPin, Filter, X, IndianRupee, Car } from 'lucide-react';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import { ContactActions } from '../common/ContactActions';

interface ToursBrowseViewProps {
  initialFrom?: string;
  initialTo?: string;
  canPost?: boolean;
  onPostTour?: () => void;
}

export const ToursBrowseView: React.FC<ToursBrowseViewProps> = ({
  initialFrom = '',
  initialTo = '',
  canPost,
  onPostTour,
}) => {
  const { getFilteredTours, logInquiry, isPartnerLoggedIn, currentDriver, currentAgency } = useAppStore();
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [applied, setApplied] = useState({ from: initialFrom, to: initialTo });
  const [showFilter, setShowFilter] = useState(false);

  const tours = useMemo(
    () => getFilteredTours({ fromCity: applied.from, toCity: applied.to }),
    [getFilteredTours, applied]
  );

  const applyFilter = () => {
    setApplied({ from: fromCity, to: toCity });
    setShowFilter(false);
  };

  const clearFilter = () => {
    setFromCity('');
    setToCity('');
    setApplied({ from: '', to: '' });
  };

  const isFiltered = Boolean(applied.from || applied.to);
  const myIds = [currentDriver.id, currentAgency.id];
  const myName = currentAgency.agencyName || currentDriver.name;

  return (
    <div className="space-y-3 pb-24 animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-[#6B6B6B] leading-snug pr-2">
          {isFiltered
            ? `${applied.from || 'Any'} → ${applied.to || 'any'}`
            : 'All India · filter a route'}
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canPost && (
            <button
              onClick={onPostTour}
              className="px-3 py-2 rounded-2xl brand-gradient text-white text-[11px] font-extrabold whitespace-nowrap"
            >
              Post tour
            </button>
          )}
          <button
            onClick={() => setShowFilter((v) => !v)}
            className="p-2 rounded-2xl bg-white border border-[#EBE5D8] text-[#F15A24]"
            aria-label="Filter tours"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              From
              <input
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                list="rb-tour-cities"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
                placeholder="All India"
              />
            </label>
            <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              To
              <input
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                list="rb-tour-cities"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
                placeholder="All India"
              />
            </label>
          </div>
          <datalist id="rb-tour-cities">
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>
          <div className="flex gap-2">
            <button
              onClick={applyFilter}
              className="flex-1 py-2.5 rounded-2xl brand-gradient text-white text-xs font-extrabold"
            >
              Apply filter
            </button>
            <button onClick={clearFilter} className="px-3 py-2.5 rounded-2xl bg-[#FAF6EE] text-xs font-bold">
              All India
            </button>
          </div>
        </div>
      )}

      {isFiltered && (
        <button onClick={clearFilter} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F15A24]">
          <X className="w-3 h-3" /> Clear filter · show all India
        </button>
      )}

      {tours.length === 0 && (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
          <Sparkles className="w-8 h-8 mx-auto text-[#EBE5D8] mb-2" />
          <p className="text-sm font-bold text-[#6B6B6B]">No tour packages in this filter.</p>
        </div>
      )}

      {tours.map((tour) => (
        <article key={tour.id} className="bg-white rounded-3xl border border-[#EBE5D8] p-4 space-y-3 shadow-card">
          <div>
            {tour.tourType ? (
              <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#F15A24]">
                {tour.tourType}
              </p>
            ) : null}
            <h3 className="text-sm font-extrabold text-[#1C1C1C] flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#F15A24] flex-shrink-0" />
              {tour.fromCity} → {tour.toCity}
            </h3>
            <p className="text-[11px] text-[#6B6B6B] mt-0.5">
              {tour.agencyName} · {tour.duration} · {tour.passengers} pax
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <div className="p-2.5 rounded-2xl bg-[#FFF0EB] border border-[#FFD8CB]">
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#F15A24]">Total tour</p>
              <p className="text-sm font-extrabold text-[#1C1C1C] flex items-center mt-0.5">
                <IndianRupee className="w-3.5 h-3.5" />
                {tour.totalCustomerPrice.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#6B6B6B]">Agency cut</p>
              <p className="text-sm font-extrabold text-[#1C1C1C] flex items-center mt-0.5">
                <IndianRupee className="w-3.5 h-3.5" />
                {tour.agencyCommission.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="p-2.5 rounded-2xl bg-[#EBF7F0] border border-[#B8E6CB]">
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#2E9E5B]">Net to car</p>
              <p className="text-sm font-extrabold text-[#2E9E5B] flex items-center mt-0.5">
                <IndianRupee className="w-3.5 h-3.5" />
                {tour.driverNetPayout.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {tour.desiredCar && (
            <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
                <Car className="w-3 h-3" /> Desired car
              </p>
              <p className="text-xs font-extrabold text-[#1C1C1C] mt-0.5">{tour.desiredCar.name}</p>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {tour.desiredCar.specs.filter(Boolean).map((spec) => (
                  <span
                    key={spec}
                    className="px-2 py-0.5 rounded-full bg-white border border-[#EBE5D8] text-[10px] font-bold text-[#1C1C1C]"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tour.tripDetails && (
            <p className="text-[11px] text-[#6B6B6B] leading-relaxed line-clamp-3">{tour.tripDetails}</p>
          )}

          {isPartnerLoggedIn && myIds.includes(tour.agencyId) ? (
            <p className="text-[11px] font-extrabold text-center py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              Your listing
            </p>
          ) : (
          <ContactActions
            phone={tour.agencyPhone}
            whatsapp={tour.whatsappNumber}
            message={
              isPartnerLoggedIn
                ? `Hi ${tour.agencyName}, I’m ${myName}, a Ride Bhai partner. I can help with your ${tour.fromCity} to ${tour.toCity} package${tour.desiredCar?.name ? ` (desired car: ${tour.desiredCar.name})` : ''} listed at ₹${tour.totalCustomerPrice}.`
                : `Hi ${tour.agencyName}, I am interested in your ${tour.fromCity} to ${tour.toCity} package (₹${tour.totalCustomerPrice}) on Ride Bhai.`
            }
            onCall={() =>
              logInquiry({
                listingType: 'tour',
                listingId: tour.id,
                partnerId: tour.agencyId,
                partnerName: tour.agencyName,
                channel: 'call',
                title: `${tour.fromCity} → ${tour.toCity}`,
                price: tour.totalCustomerPrice,
                fromCity: tour.fromCity,
                toCity: tour.toCity,
              })
            }
            onWhatsApp={() =>
              logInquiry({
                listingType: 'tour',
                listingId: tour.id,
                partnerId: tour.agencyId,
                partnerName: tour.agencyName,
                channel: 'whatsapp',
                title: `${tour.fromCity} → ${tour.toCity}`,
                price: tour.totalCustomerPrice,
                fromCity: tour.fromCity,
                toCity: tour.toCity,
              })
            }
          />
          )}
        </article>
      ))}
    </div>
  );
};
