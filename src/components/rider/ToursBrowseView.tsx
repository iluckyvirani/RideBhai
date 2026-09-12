import React, { useMemo, useState } from 'react';
import { Sparkles, MapPin, X, IndianRupee, Car, Calendar, Share2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AgencyTripPost } from '../../types';
import { DealChoiceActions } from '../common/ContactActions';
import { PosterCard } from '../common/PosterCard';
import { ListSkeleton } from '../common/SkeletonLoader';
import { shareTourListing } from '../../lib/share';
import {
  BrowseFilters,
  browseFilterActive,
  EMPTY_BROWSE_FILTERS,
  type BrowseFilterValues,
} from '../common/BrowseFilters';
import { CAR_BODY_TYPES, desiredCarBody } from '../../data/indiaTaxiCars';

function tourCarTypeLabel(name?: string) {
  return CAR_BODY_TYPES.find((t) => t.id === desiredCarBody(name))?.label;
}

function formatTourStamp(date?: string, time?: string) {
  if (!date && !time) return '';
  const pretty = date ? date.split('-').reverse().join('/') : '';
  return [pretty, time].filter(Boolean).join(' · ');
}

interface ToursBrowseViewProps {
  initialFrom?: string;
  initialTo?: string;
  initialNeedOn?: string;
  onNeedUnlock?: (code?: 'incomplete' | 'unverified' | 'no_package') => void;
  onDealWithRideBhai?: (listingId: string) => void;
  onOpenDetails?: (tour: AgencyTripPost) => void;
}

export const ToursBrowseView: React.FC<ToursBrowseViewProps> = ({
  initialFrom = '',
  initialTo = '',
  initialNeedOn = '',
  onNeedUnlock,
  onDealWithRideBhai,
  onOpenDetails,
}) => {
  const { getFilteredTours, openDeal, currentUser, listingsLoading, listingsError } =
    useAppStore();
  const [draft, setDraft] = useState<BrowseFilterValues>({
    ...EMPTY_BROWSE_FILTERS,
    fromCity: initialFrom,
    toCity: initialTo,
    bookingDate: initialNeedOn,
  });
  const [applied, setApplied] = useState<BrowseFilterValues>({
    ...EMPTY_BROWSE_FILTERS,
    fromCity: initialFrom,
    toCity: initialTo,
    bookingDate: initialNeedOn,
  });
  const [moreOpen, setMoreOpen] = useState(false);

  const tours = useMemo(
    () =>
      getFilteredTours({
        fromCity: applied.fromCity,
        toCity: applied.toCity,
        bookingDate: applied.bookingDate,
        maxPrice: Number(applied.maxPrice || 0) || undefined,
        minPax: Number(applied.minPax || 0) || undefined,
        tripSide: applied.tripSide,
        carType: applied.carType,
      }),
    [getFilteredTours, applied]
  );

  const applyFilter = () => setApplied(draft);

  const clearFilter = () => {
    setDraft(EMPTY_BROWSE_FILTERS);
    setApplied(EMPTY_BROWSE_FILTERS);
  };

  const isFiltered = browseFilterActive(applied);
  const myId = currentUser?.id;
  const myName = currentUser?.agencyName || currentUser?.name || 'Ride Bhai user';

  const [expandedTourIds, setExpandedTourIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (tourId: string) => {
    setExpandedTourIds((prev) => ({ ...prev, [tourId]: !prev[tourId] }));
  };

  return (
    <div className="space-y-3 pb-24 animate-fade-in">
      <p className="text-[11px] text-[#6B6B6B] leading-snug">
        {isFiltered
          ? `${applied.fromCity || 'Any'} → ${applied.toCity || 'any'}${applied.carType ? ` · ${CAR_BODY_TYPES.find((t) => t.id === applied.carType)?.label || applied.carType}` : ''}${applied.bookingDate ? ` · ${applied.bookingDate.split('-').reverse().join('/')}` : ''}`
          : 'All India · filter by car type. Open More for extra options.'}
      </p>

      <BrowseFilters
        kind="tour"
        value={draft}
        moreOpen={moreOpen}
        onChange={setDraft}
        onToggleMore={() => setMoreOpen((v) => !v)}
        onApply={applyFilter}
        onClear={clearFilter}
      />

      {isFiltered && (
        <button onClick={clearFilter} className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F15A24]">
          <X className="w-3 h-3" /> Clear filter · show all India
        </button>
      )}

      {listingsError && (
        <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-2xl">{listingsError}</p>
      )}
      {listingsLoading && tours.length === 0 && <ListSkeleton count={3} />}

      {tours.length === 0 && !listingsLoading && (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
          <Sparkles className="w-8 h-8 mx-auto text-[#EBE5D8] mb-2" />
          <p className="text-sm font-bold text-[#6B6B6B]">No tour packages in this filter.</p>
        </div>
      )}

      {tours.map((tour) => (
        <article key={tour.id} className="bg-white rounded-3xl border border-[#EBE5D8] p-4 space-y-3 shadow-card">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-extrabold text-[#1C1C1C] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#F15A24] flex-shrink-0" />
                {tour.fromCity} {tour.tripSide === 'two_side' ? '⇄' : '→'} {tour.toCity}
              </h3>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5">
                {tour.agencyName} · {tour.duration} · {tour.passengers} pax
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-[#FFF0EB] text-[#F15A24] text-[10px] font-extrabold">
                  {tour.tripSide === 'two_side' ? 'Two side' : 'One side'}
                </span>
              </div>
              <div className="mt-2 space-y-0.5 text-[11px] text-[#6B6B6B]">
                {(tour.bookingDate || tour.startDate || tour.bookingTime || tour.pickupTime) && (
                  <p className="flex items-center gap-1 font-bold text-[#1C1C1C]">
                    <Calendar className="w-3 h-3 text-[#F15A24]" />
                    Booking {formatTourStamp(tour.bookingDate || tour.startDate, tour.bookingTime || tour.pickupTime)}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => shareTourListing(tour)}
              className="p-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F15A24]/10 text-[#6B6B6B] hover:text-[#F15A24] border border-[#EBE5D8] transition-colors flex items-center gap-1 text-[11px] font-bold shrink-0 active-press"
              title="Share Booking"
            >
              <Share2 className="w-3.5 h-3.5 text-[#F15A24]" />
              <span>Share</span>
            </button>
          </div>

          {tour.totalCustomerPrice > 0 ? (
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
          ) : (
            <div className="p-3 rounded-2xl bg-gradient-to-r from-[#FFF5F0] to-[#FAF6EE] border border-[#FFD8CB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#F15A24] to-[#FF7A45] flex items-center justify-center text-white text-xs shadow-xs">
                  💬
                </span>
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#F15A24]">
                    Quotation Invited
                  </p>
                  <p className="text-xs font-black text-[#1C1C1C]">
                    Send Best Quotation
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#F15A24] border border-[#FFD8CB]">
                Open for Quotes
              </span>
            </div>
          )}

          {/* Full Travel Details & Itinerary - Above Desired Car with simple inline View more */}
          {tour.tripDetails && (
            <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#8A8478]">
                Full Travel Details & Itinerary
              </p>
              <p
                className={`text-xs font-semibold text-[#1C1C1C] mt-1 whitespace-pre-line leading-relaxed ${
                  expandedTourIds[tour.id] ? '' : 'line-clamp-2'
                }`}
              >
                {tour.tripDetails}
              </p>
              {tour.tripDetails.length > 80 && (
                <button
                  type="button"
                  onClick={() => toggleExpand(tour.id)}
                  className="mt-1 text-[11px] font-extrabold text-[#F15A24] hover:underline"
                >
                  {expandedTourIds[tour.id] ? 'View less' : 'View more'}
                </button>
              )}
            </div>
          )}

          {tour.desiredCar && (
            <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
                <Car className="w-3 h-3" /> Desired car
              </p>
              <p className="text-xs font-extrabold text-[#1C1C1C] mt-0.5">
                {[tour.desiredCar.name, tourCarTypeLabel(tour.desiredCar.name || tour.requiredVehicleType)]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {tour.desiredCar.specs?.length ? (
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
              ) : null}
            </div>
          )}

          {(tour.pickupLocation || tour.dropLocation) && (
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {tour.pickupLocation ? (
                <div className="p-2.5 rounded-xl bg-white border border-[#EBE5D8]">
                  <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#6B6B6B]">Pickup</p>
                  <p className="font-bold text-[#1C1C1C] mt-0.5">{tour.pickupLocation}</p>
                </div>
              ) : null}
              {tour.dropLocation ? (
                <div className="p-2.5 rounded-xl bg-white border border-[#EBE5D8]">
                  <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#6B6B6B]">Drop</p>
                  <p className="font-bold text-[#1C1C1C] mt-0.5">{tour.dropLocation}</p>
                </div>
              ) : null}
            </div>
          )}

          <PosterCard
            compact
            selfie={tour.posterSelfie}
            agencyName={tour.agencyName}
            personName={tour.posterName}
            rating={tour.agencyRating}
            ratingCount={tour.agencyRatingCount}
          />

          {myId && tour.agencyId === myId ? (
            <p className="text-[11px] font-extrabold text-center py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              Your listing
            </p>
          ) : (
            <DealChoiceActions
              onNeedUnlock={onNeedUnlock}
              phone={tour.agencyPhone}
              whatsapp={tour.whatsappNumber}
              directLabel={tour.totalCustomerPrice > 0 ? 'Message direct' : 'Send quotation'}
              message={
                tour.totalCustomerPrice > 0
                  ? `Hi ${tour.agencyName}, I’m ${myName}. I am interested in your ${tour.fromCity} to ${tour.toCity} package (₹${tour.totalCustomerPrice}) on Ride Bhai.`
                  : `Hi ${tour.agencyName}, I’m ${myName}. I am sending my best quotation for your ${tour.fromCity} to ${tour.toCity} tour on Ride Bhai.`
              }
              onDirect={async () => {
                const result = await openDeal({ listingType: 'tour', listingId: tour.id, channel: 'direct' });
                onDealWithRideBhai?.(result.thread.id);
              }}
              onRideBhai={async () => {
                await openDeal({ listingType: 'tour', listingId: tour.id, channel: 'ridebhai' });
              }}
            />
          )}
        </article>
      ))}
    </div>
  );
};
