import React, { useEffect, useMemo, useState } from 'react';
import { Building2, MapPin, Search, Star, IndianRupee, ArrowUpDown, Lock, Share2 } from 'lucide-react';
import { api } from '../../lib/api';
import { mapHotelListing } from '../../lib/listings';
import type { HotelListing } from '../../types';
import { ListSkeleton } from '../common/SkeletonLoader';
import { useAppStore } from '../../store/useAppStore';
import { shareHotelListing } from '../../lib/share';

type SortKey = 'rating' | 'price_low' | 'price_high';

const SORT_LABEL: Record<SortKey, string> = {
  rating: 'Top rated',
  price_low: 'Price: Low to high',
  price_high: 'Price: High to low',
};

function ratingTier(rating: number): { label: string; className: string } {
  if (rating >= 4.5) return { label: 'Excellent', className: 'text-[#1A56DB]' };
  if (rating >= 4) return { label: 'Very Good', className: 'text-[#1A56DB]' };
  if (rating >= 3) return { label: 'Good', className: 'text-[#0F8A5F]' };
  if (rating >= 2) return { label: 'Fair', className: 'text-amber-600' };
  return { label: 'Rated', className: 'text-[#6B6B6B]' };
}

const selectPill =
  'appearance-none shrink-0 rounded-full border bg-white border-[#EBE5D8] text-[#1C1C1C] text-[11px] font-extrabold pl-3 pr-7 py-2 bg-no-repeat bg-[right_0.6rem_center]';

const selectArrow = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6' fill='none'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6B6B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
};

interface HotelsBrowseViewProps {
  onOpenDetails: (hotel: HotelListing) => void;
  onNeedLogin?: () => void;
}

export const HotelsBrowseView: React.FC<HotelsBrowseViewProps> = ({ onOpenDetails, onNeedLogin }) => {
  const { isLoggedIn } = useAppStore();
  const [hotels, setHotels] = useState<HotelListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [sort, setSort] = useState<SortKey>('rating');

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

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E9E9E]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search hotel name…"
          className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-[#EBE5D8] text-xs font-bold placeholder:text-[#9E9E9E]"
        />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="relative shrink-0">
          <ArrowUpDown className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] pointer-events-none" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className={`${selectPill} pl-7`}
            style={selectArrow}
          >
            {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABEL[key]}
              </option>
            ))}
          </select>
        </div>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className={selectPill}
          style={selectArrow}
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={state}
          onChange={(e) => setState(e.target.value)}
          className={selectPill}
          style={selectArrow}
        >
          <option value="">All states</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {(city || state) && (
          <button
            type="button"
            onClick={() => {
              setCity('');
              setState('');
            }}
            className="shrink-0 text-[11px] font-extrabold text-[#F15A24] px-1"
          >
            Clear
          </button>
        )}
      </div>

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

      <div className="space-y-3.5">
        {visible.map((hotel) => {
          const tier = ratingTier(hotel.rating);
          const topPlace = hotel.nearbyPlaces[0];
          const locationLine = topPlace
            ? [hotel.address, `${topPlace.distance} to ${topPlace.name}`].filter(Boolean).join(' | ')
            : [hotel.address, `${hotel.city}, ${hotel.state}`].filter(Boolean).join(' | ');

          return (
            <article
              key={hotel.id}
              className="relative bg-white rounded-3xl border border-[#EBE5D8] shadow-card overflow-hidden"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  shareHotelListing(hotel);
                }}
                className="absolute top-2.5 left-2.5 z-10 p-2 rounded-xl bg-white/90 hover:bg-[#25D366] hover:text-white text-[#1C1C1C] shadow-xs transition-all active-press"
                title="Share hotel"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onOpenDetails(hotel)}
                className="w-full text-left active-press"
              >
                <div className="relative w-full h-44 bg-[#FAF6EE]">
                  {hotel.images[0] ? (
                    <img src={hotel.images[0]} alt={hotel.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-[#D8D0C2]" />
                    </div>
                  )}
                  {hotel.priceHigh > hotel.priceLow && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded-full bg-white/95 text-[#1C1C1C] text-[10px] font-extrabold shadow-xs">
                      Multiple room options
                    </span>
                  )}
                </div>

                <div className="p-3.5 space-y-2">
                  {hotel.ratingCount > 0 && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-[#0B2545] text-white text-[11px] font-extrabold">
                        {hotel.rating.toFixed(1)}
                      </span>
                      <span className={`text-[11px] font-extrabold ${tier.className}`}>{tier.label}</span>
                      <span className="text-[11px] text-[#9E9E9E] font-bold">({hotel.ratingCount} Ratings)</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-extrabold text-[#1C1C1C] leading-snug">{hotel.title}</h3>
                        {hotel.starCategory ? (
                          <span className="inline-flex items-center shrink-0">
                            {Array.from({ length: Math.min(hotel.starCategory, 7) }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#1C1C1C] text-[#1C1C1C]" />
                            ))}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-[11px] text-[#6B6B6B] font-bold flex items-start gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#F15A24] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{locationLine}</span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold text-[#1C1C1C] flex items-center justify-end">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {hotel.priceLow.toLocaleString('en-IN')}
                      </p>
                      {hotel.priceHigh > hotel.priceLow && (
                        <p className="text-[9px] text-[#9E9E9E] font-bold">
                          up to ₹{hotel.priceHigh.toLocaleString('en-IN')}
                        </p>
                      )}
                      <p className="text-[9px] text-[#9E9E9E] font-bold">Per Night</p>
                    </div>
                  </div>
                </div>
              </button>

              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={onNeedLogin}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#EBF7F0] border-t border-[#D8ECD9] active-press"
                >
                  <span className="text-[11px] font-extrabold text-[#1B6B3A] flex items-center gap-1.5">
                    <Lock className="w-3 h-3" /> Login to call this hotel
                  </span>
                  <span className="text-[11px] font-extrabold text-[#1B6B3A] underline">Login</span>
                </button>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
