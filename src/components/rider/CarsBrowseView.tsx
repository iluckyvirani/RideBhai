import React, { useMemo, useState } from 'react';
import { Car, MapPin, Filter, X, IndianRupee, Navigation, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { CarListing } from '../../types';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import { DealChoiceActions } from '../common/ContactActions';
import { ListSkeleton } from '../common/SkeletonLoader';

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
  if (make) rows.push(['Make', make]);
  if (model) rows.push(['Model', model]);
  if (car.year) rows.push(['Year', String(car.year)]);
  if (car.color) rows.push(['Color', car.color]);
  if (car.plate) rows.push(['Number plate', car.plate]);
  rows.push(['Seats', `${car.seats} seater`]);
  if (car.fuelType) rows.push(['Fuel', car.fuelType]);
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
  onNeedUnlock?: (code?: 'incomplete' | 'unverified' | 'no_package') => void;
  onDealWithRideBhai?: (listingId: string) => void;
}

export const CarsBrowseView: React.FC<CarsBrowseViewProps> = ({
  initialFrom = '',
  initialTo = '',
  onNeedUnlock,
  onDealWithRideBhai,
}) => {
  const { getFilteredCarListings, openDeal, currentUser, listingsLoading, listingsError } =
    useAppStore();
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [applied, setApplied] = useState({ from: initialFrom, to: initialTo });
  const [showFilter, setShowFilter] = useState(false);
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);

  const listings = useMemo(
    () => getFilteredCarListings({ fromCity: applied.from, toCity: applied.to }),
    [getFilteredCarListings, applied]
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
  const myId = currentUser?.id;
  const myName = currentUser?.agencyName || currentUser?.name || 'Ride Bhai user';

  return (
    <div className="space-y-3 pb-24 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1C1C1C]">Cars</h2>
          <p className="text-[11px] text-[#6B6B6B]">
            {isFiltered
              ? `Showing ${applied.from || 'any city'}${applied.to ? ` → ${applied.to}` : ' · all-India from this city'}`
              : 'All India · filter a city or route. Booking needs verified profile + plan.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilter((v) => !v)}
            className="p-2 rounded-2xl bg-white border border-[#EBE5D8] text-[#F15A24]"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              From / current city
              <input
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                list="rb-cities"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
                placeholder="All India"
              />
            </label>
            <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              To city
              <input
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                list="rb-cities"
                className="mt-1 w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
                placeholder="Optional"
              />
            </label>
          </div>
          <datalist id="rb-cities">
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
            <button
              onClick={clearFilter}
              className="px-3 py-2.5 rounded-2xl bg-[#FAF6EE] text-xs font-bold"
            >
              All India
            </button>
          </div>
        </div>
      )}

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
                <p className="text-[11px] text-[#6B6B6B]">{car.partnerName} · {car.seats} seater</p>
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

            <div className="space-y-0.5 text-[11px] text-[#6B6B6B]">
              {(car.postedDate || car.postedTime) && (
                <p className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Posted {formatCarStamp(car.postedDate, car.postedTime)}
                </p>
              )}
              {(car.bookingDate || car.bookingTime) && (
                <p className="flex items-center gap-1 font-bold text-[#1C1C1C]">
                  <Calendar className="w-3 h-3 text-[#F15A24]" />
                  Booking {formatCarStamp(car.bookingDate, car.bookingTime)}
                </p>
              )}
              {(car.availableTillDate || car.availableTillTime) && (
                <p className="flex items-center gap-1 font-bold text-[#00A86B]">
                  Available till {formatCarStamp(car.availableTillDate, car.availableTillTime)}
                </p>
              )}
            </div>

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
