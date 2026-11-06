import React, { useEffect, useMemo, useState } from 'react';
import { Building2, MapPin, Search, Star, IndianRupee, SlidersHorizontal } from 'lucide-react';
import { api } from '../../lib/api';
import { mapHotelListing } from '../../lib/listings';
import type { HotelListing } from '../../types';
import { ratingLabel } from '../common/RateStars';
import { ListSkeleton } from '../common/SkeletonLoader';

type SortKey = 'rating' | 'price_low' | 'price_high';

interface HotelsBrowseViewProps {
  onOpenDetails: (hotel: HotelListing) => void;
}

export const HotelsBrowseView: React.FC<HotelsBrowseViewProps> = ({ onOpenDetails }) => {
  const [hotels, setHotels] = useState<HotelListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [sort, setSort] = useState<SortKey>('rating');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api<any[]>('/listings/hotels')
      .then((rows) => {
        if (cancelled) return;
        setHotels((rows || []).map(mapHotelListing));
      })
      .catch((err: any) => {
        if (!cancelled) setError(err?.message || 'Could not load hotels.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cities = useMemo(
    () => [...new Set(hotels.map((h) => h.city).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [hotels]
  );
  const states = useMemo(
    () => [...new Set(hotels.map((h) => h.state).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [hotels]
  );

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = hotels.filter((h) => {
      if (city && h.city !== city) return false;
      if (state && h.state !== state) return false;
      if (q && !h.title.toLowerCase().includes(q)) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      if (sort === 'price_low') return a.priceLow - b.priceLow;
      if (sort === 'price_high') return b.priceLow - a.priceLow;
      return b.rating - a.rating;
    });
    return rows;
  }, [hotels, search, city, state, sort]);

  const activeFilterCount = (city ? 1 : 0) + (state ? 1 : 0);

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hotel name…"
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-[#EBE5D8] text-xs font-bold placeholder:text-[#9E9E9E]"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className={`relative shrink-0 w-10 h-10 rounded-2xl border flex items-center justify-center active-press ${
            filtersOpen || activeFilterCount ? 'bg-[#1C1C1C] border-[#1C1C1C] text-white' : 'bg-white border-[#EBE5D8] text-[#1C1C1C]'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F15A24] text-white text-[9px] font-extrabold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {filtersOpen && (
        <div className="p-3 rounded-2xl bg-white border border-[#EBE5D8] space-y-2.5 animate-scale-in">
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-[10px] font-extrabold uppercase text-[#8A8478]">
              City
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#EBE5D8] bg-[#FAF6EE] px-2.5 py-2 text-xs font-bold text-[#1C1C1C]"
              >
                <option value="">All cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-extrabold uppercase text-[#8A8478]">
              State
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#EBE5D8] bg-[#FAF6EE] px-2.5 py-2 text-xs font-bold text-[#1C1C1C]"
              >
                <option value="">All states</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-[#8A8478] mb-1.5">Sort by</p>
            <div className="flex flex-wrap gap-1.5">
              {([
                ['rating', 'Top rated'],
                ['price_low', 'Price: Low to high'],
                ['price_high', 'Price: High to low'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSort(key)}
                  className={`px-2.5 py-1.5 rounded-full text-[11px] font-extrabold border ${
                    sort === key ? 'bg-[#F15A24] border-[#F15A24] text-white' : 'bg-[#FAF6EE] border-[#EBE5D8] text-[#6B6B6B]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          {(city || state) && (
            <button
              type="button"
              onClick={() => {
                setCity('');
                setState('');
              }}
              className="text-[11px] font-extrabold text-[#F15A24]"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-2xl">{error}</p>}

      {loading && <ListSkeleton count={3} />}

      {!loading && visible.length === 0 && (
        <div className="py-14 text-center space-y-2">
          <Building2 className="w-10 h-10 text-[#D8D0C2] mx-auto" />
          <p className="text-xs font-bold text-[#6B6B6B]">
            {hotels.length === 0 ? 'No hotels listed yet.' : 'No hotel matches this filter.'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {visible.map((hotel) => (
          <button
            key={hotel.id}
            type="button"
            onClick={() => onOpenDetails(hotel)}
            className="w-full text-left bg-white rounded-3xl border border-[#EBE5D8] shadow-card overflow-hidden active-press"
          >
            <div className="relative w-full h-36 bg-[#FAF6EE]">
              {hotel.images[0] ? (
                <img src={hotel.images[0]} alt={hotel.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-[#D8D0C2]" />
                </div>
              )}
              <span className="absolute top-2 left-2 px-2 py-1 rounded-xl bg-black/55 backdrop-blur-sm text-white text-[10px] font-extrabold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {ratingLabel(hotel.rating, hotel.ratingCount)}
              </span>
            </div>
            <div className="p-3.5 space-y-1.5">
              <h3 className="text-sm font-extrabold text-[#1C1C1C] leading-snug">{hotel.title}</h3>
              <p className="text-[11px] text-[#6B6B6B] font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#F15A24] shrink-0" />
                {hotel.city}, {hotel.state}
              </p>
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs font-extrabold text-[#1C1C1C] flex items-center">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {hotel.priceLow.toLocaleString('en-IN')}
                  {hotel.priceHigh > hotel.priceLow ? ` – ${hotel.priceHigh.toLocaleString('en-IN')}` : ''}
                  <span className="ml-1 text-[10px] font-bold text-[#9E9E9E]">/night</span>
                </p>
                <span className="text-[10px] font-extrabold text-[#F15A24]">View details →</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
