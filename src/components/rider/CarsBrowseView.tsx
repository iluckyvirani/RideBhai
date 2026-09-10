import React, { useMemo, useState } from 'react';
import { Car, MapPin, X, IndianRupee, Navigation, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { CarListing } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { DealChoiceActions } from '../common/ContactActions';
import { PosterCard } from '../common/PosterCard';
import { ListSkeleton } from '../common/SkeletonLoader';
import {
  BrowseFilters,
  browseFilterActive,
  EMPTY_BROWSE_FILTERS,
  type BrowseFilterValues,
} from '../common/BrowseFilters';
import { CAR_BODY_TYPES, listingCarBody } from '../../data/indiaTaxiCars';

function carTypeLabel(car: CarListing) {
  return CAR_BODY_TYPES.find((t) => t.id === listingCarBody(car.make, car.model, car.carName))?.label;
}

function formatCarStamp(date?: string, time?: string) {
  if (!date && !time) return '';
  const pretty = date ? date.split('-').reverse().join('/') : '';
  return [pretty, time].filter(Boolean).join(' · ');
}

function DetailTable({ title, rows }: { title: string; rows: [string, string][] }) {
  if (rows.length === 0) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8A8478]">{title}</p>
      <div className="overflow-hidden rounded-2xl border border-[#EBE5D8]">
        <table className="w-full text-left text-[11px]">
          <tbody className="divide-y divide-[#F2ECE1]">
            {rows.map(([label, value]) => (
              <tr key={label}>
                <th className="py-2 px-3 font-extrabold uppercase text-[10px] text-[#8A8478] w-[38%] bg-[#FAF6EE]/70">
                  {label}
                </th>
                <td className="py-2 px-3 font-bold text-[#1C1C1C]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function publicCarRows(car: CarListing): [string, string][] {
  const nameParts = (car.carName || '').split(/\s+/);
  const make = car.make || nameParts[0] || '';
  const model = car.model || nameParts.slice(1).join(' ') || '';
  const rows: [string, string][] = [];
  const body = listingCarBody(make, model, car.carName);
  const typeLabel = CAR_BODY_TYPES.find((t) => t.id === body)?.label;
  if (make) rows.push(['Make', make]);
  if (model) rows.push(['Model', model]);
  if (typeLabel) rows.push(['Type', typeLabel]);
  if (car.year) rows.push(['Year', String(car.year)]);
  if (car.color) rows.push(['Color', car.color]);
  if (car.plate) rows.push(['Number plate', car.plate]);
  rows.push(['Seats', `${car.seats} seater`]);
  if (car.fuelType) rows.push(['Fuel', car.fuelType]);
  const from = formatCarStamp(car.bookingDate, car.bookingTime);
  const to = formatCarStamp(car.availableTillDate, car.availableTillTime);
  if (from) rows.push(['Available from', from]);
  if (to) rows.push(['Available to', to]);
  return rows;
}

function publicDriverRows(car: CarListing): [string, string][] {
  const rows: [string, string][] = [];
  if (car.driverName) rows.push(['Name', car.driverName]);
  if (car.driverExperienceYears !== undefined) {
    rows.push(['Experience', `${car.driverExperienceYears} year${car.driverExperienceYears === 1 ? '' : 's'}`]);
  }
  if (car.driverExperienceNote) rows.push(['About', car.driverExperienceNote]);
  return rows;
}

interface CarsBrowseViewProps {
  initialFrom?: string;
  initialTo?: string;
  initialNeedOn?: string;
  onNeedUnlock?: (code?: 'incomplete' | 'unverified' | 'no_package') => void;
  onDealWithRideBhai?: (listingId: string) => void;
}

export const CarsBrowseView: React.FC<CarsBrowseViewProps> = ({
  initialFrom = '',
  initialTo = '',
  initialNeedOn = '',
  onNeedUnlock,
  onDealWithRideBhai,
}) => {
  const { getFilteredCarListings, openDeal, currentUser, listingsLoading, listingsError } =
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
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);

  const listings = useMemo(
    () =>
      getFilteredCarListings({
        fromCity: applied.fromCity,
        toCity: applied.toCity,
        bookingDate: applied.bookingDate,
        availableTill: applied.availableTill,
        maxPrice: Number(applied.maxPrice || 0) || undefined,
        minSeats: Number(applied.minSeats || 0) || undefined,
        fuelType: applied.fuelType,
        availability: applied.availability,
        carType: applied.carType,
      }),
    [getFilteredCarListings, applied]
  );

  const applyFilter = () => setApplied(draft);

  const clearFilter = () => {
    setDraft(EMPTY_BROWSE_FILTERS);
    setApplied(EMPTY_BROWSE_FILTERS);
  };

  const isFiltered = browseFilterActive(applied);
  const myId = currentUser?.id;
  const myName = currentUser?.agencyName || currentUser?.name || 'Ride Bhai user';

  return (
    <div className="space-y-3 pb-24 animate-fade-in">
      <div>
        <h2 className="text-lg font-extrabold text-[#1C1C1C]">Cars</h2>
        <p className="text-[11px] text-[#6B6B6B]">
          {isFiltered
            ? `Showing ${applied.fromCity || 'any city'}${applied.toCity ? ` → ${applied.toCity}` : ''}${applied.carType ? ` · ${CAR_BODY_TYPES.find((t) => t.id === applied.carType)?.label || applied.carType}` : ''}${applied.bookingDate ? ` · ${applied.bookingDate.split('-').reverse().join('/')}` : ''}`
            : 'All India · filter by type (hatchback, sedan, SUV, MUV). Open More for fuel, seats and price.'}
        </p>
      </div>

      <BrowseFilters
        kind="car"
        value={draft}
        moreOpen={moreOpen}
        onChange={setDraft}
        onToggleMore={() => setMoreOpen((v) => !v)}
        onApply={applyFilter}
        onClear={clearFilter}
      />

      {isFiltered && (
        <button
          onClick={clearFilter}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#F15A24]"
        >
          <X className="w-3 h-3" /> Clear filter · show all India
        </button>
      )}

      {listingsError && (
        <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-2xl">{listingsError}</p>
      )}
      {listingsLoading && listings.length === 0 && <ListSkeleton count={3} />}

      {listings.length === 0 && !listingsLoading && (
        <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
          <Car className="w-8 h-8 mx-auto text-[#EBE5D8] mb-2" />
          <p className="text-sm font-bold text-[#6B6B6B]">No cars in this filter.</p>
          <button onClick={clearFilter} className="mt-2 text-xs font-extrabold text-[#F15A24]">
            Show all India
          </button>
        </div>
      )}

      {listings.map((car) => (
        <article key={car.id} className="bg-white rounded-3xl border border-[#EBE5D8] overflow-hidden shadow-card">
          {car.carImage && (
            <img src={car.carImage} alt={car.carName} className="w-full h-36 object-cover" />
          )}
          <div className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold text-[#1C1C1C]">{car.carName}</h3>
                <p className="text-[11px] text-[#6B6B6B]">
                  {[carTypeLabel(car), `${car.seats} seater`, car.partnerName].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-[#F15A24] flex items-center justify-end">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {car.fullCarPrice.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-bold text-[#6B6B6B]">Full car</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1C1C1C]">
              {car.availability === 'citywide' ? (
                <>
                  <Navigation className="w-3.5 h-3.5 text-[#F15A24]" />
                  Currently in {car.currentCity} · All India
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-[#F15A24]" />
                  {car.currentCity} → {car.toCity}
                </>
              )}
            </div>

            {(car.bookingDate || car.bookingTime || car.availableTillDate || car.availableTillTime) && (
              <p className="flex items-center gap-1 text-[11px] font-bold text-[#1C1C1C]">
                <Calendar className="w-3 h-3 text-[#F15A24]" />
                Available {formatCarStamp(car.bookingDate, car.bookingTime) || '—'}
                {' → '}
                {formatCarStamp(car.availableTillDate, car.availableTillTime) || '—'}
              </p>
            )}

            {car.driverName && (
              <p className="text-[11px] font-bold text-[#1C1C1C]">Driver {car.driverName}</p>
            )}
            {car.notes && <p className="text-[11px] text-[#6B6B6B] leading-relaxed">{car.notes}</p>}

            <button
              type="button"
              onClick={() => setOpenDetailsId((id) => (id === car.id ? null : car.id))}
              className="w-full py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-[11px] font-extrabold text-[#F15A24] inline-flex items-center justify-center gap-1"
            >
              {openDetailsId === car.id ? (
                <>
                  Hide details <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  View car & driver details <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
            {openDetailsId === car.id && (
              <div className="space-y-3">
                <DetailTable title="Car details" rows={publicCarRows(car)} />
                <DetailTable title="Driver details" rows={publicDriverRows(car)} />
              </div>
            )}

            <PosterCard
              compact
              selfie={car.partnerSelfie}
              agencyName={car.partnerName}
              personName={car.partnerPersonName}
              rating={car.partnerRating}
              ratingCount={car.partnerRatingCount}
            />

            {myId && car.partnerId === myId ? (
              <p className="text-[11px] font-extrabold text-center py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
                Your listing
              </p>
            ) : (
            <DealChoiceActions
              onNeedUnlock={onNeedUnlock}
              phone={car.partnerPhone}
              whatsapp={car.partnerWhatsapp}
              message={`Hi ${car.partnerName}, I’m ${myName}. I want to book your ${car.carName} (₹${car.fullCarPrice}) listed on Ride Bhai.`}
              onDirect={async () => {
                const result = await openDeal({ listingType: 'car', listingId: car.id, channel: 'direct' });
                onDealWithRideBhai?.(result.thread.id);
              }}
              onRideBhai={async () => {
                await openDeal({ listingType: 'car', listingId: car.id, channel: 'ridebhai' });
              }}
            />
            )}
          </div>
        </article>
      ))}
    </div>
  );
};
