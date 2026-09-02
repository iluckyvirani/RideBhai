import React, { useMemo, useState } from 'react';
import { Car, MapPin, Filter, X, IndianRupee, Navigation } from 'lucide-react';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import { ContactActions } from '../common/ContactActions';

interface CarsBrowseViewProps {
  initialFrom?: string;
  initialTo?: string;
  canPost?: boolean;
  onPostCar?: () => void;
}

export const CarsBrowseView: React.FC<CarsBrowseViewProps> = ({
  initialFrom = '',
  initialTo = '',
  canPost,
  onPostCar,
}) => {
  const { getFilteredCarListings, logInquiry, isPartnerLoggedIn, currentDriver, currentAgency } = useAppStore();
  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [applied, setApplied] = useState({ from: initialFrom, to: initialTo });
  const [showFilter, setShowFilter] = useState(false);

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
  const myIds = [currentDriver.id, currentAgency.id];
  const myName = currentAgency.agencyName || currentDriver.name;

  return (
    <div className="space-y-3 pb-24 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-[#1C1C1C]">Cars</h2>
          <p className="text-[11px] text-[#6B6B6B]">
            {canPost ? 'Call / WhatsApp other partners’ cars. Your posts show as Your listing. ' : ''}
            {isFiltered
              ? `Showing ${applied.from || 'any city'}${applied.to ? ` → ${applied.to}` : ' · all-India from this city'}`
              : canPost
                ? 'All India until you filter.'
                : 'Showing all India · apply a filter for a city or route'}
          </p>
        </div>
        <div className="flex gap-2">
          {canPost && (
            <button
              onClick={onPostCar}
              className="px-3 py-2 rounded-2xl brand-gradient text-white text-[11px] font-extrabold"
            >
              Post car
            </button>
          )}
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

      {listings.length === 0 && (
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
                  Currently in {car.currentCity} · all India
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-[#F15A24]" />
                  {car.currentCity} → {car.toCity}
                </>
              )}
            </div>

            {car.notes && <p className="text-[11px] text-[#6B6B6B] leading-relaxed">{car.notes}</p>}

            {isPartnerLoggedIn && myIds.includes(car.partnerId) ? (
              <p className="text-[11px] font-extrabold text-center py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
                Your listing
              </p>
            ) : (
            <ContactActions
              phone={car.partnerPhone}
              whatsapp={car.partnerWhatsapp}
              message={
                isPartnerLoggedIn
                  ? `Hi ${car.partnerName}, I’m ${myName}, a Ride Bhai partner. I saw your ${car.carName} (₹${car.fullCarPrice}) and want to connect for a hire or tour.`
                  : `Hi ${car.partnerName}, I want to book your ${car.carName} (₹${car.fullCarPrice}) listed on Ride Bhai.`
              }
              onCall={() =>
                logInquiry({
                  listingType: 'car',
                  listingId: car.id,
                  partnerId: car.partnerId,
                  partnerName: car.partnerName,
                  channel: 'call',
                  title: `${car.carName} · ${car.currentCity}${car.toCity ? ` → ${car.toCity}` : ''}`,
                  price: car.fullCarPrice,
                  fromCity: car.currentCity,
                  toCity: car.toCity,
                })
              }
              onWhatsApp={() =>
                logInquiry({
                  listingType: 'car',
                  listingId: car.id,
                  partnerId: car.partnerId,
                  partnerName: car.partnerName,
                  channel: 'whatsapp',
                  title: `${car.carName} · ${car.currentCity}${car.toCity ? ` → ${car.toCity}` : ''}`,
                  price: car.fullCarPrice,
                  fromCity: car.currentCity,
                  toCity: car.toCity,
                })
              }
            />
            )}
          </div>
        </article>
      ))}
    </div>
  );
};
