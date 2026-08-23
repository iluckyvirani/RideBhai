import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Phone,
  MessageCircle,
  Zap,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Filter,
  RefreshCw,
  SlidersHorizontal,
  Car,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { EnrichedRide } from '../../types';
import { Badge } from '../common/Badge';
import { ListSkeleton } from '../common/SkeletonLoader';

interface SearchResultsProps {
  searchParams: {
    fromCity: string;
    toCity: string;
    date: string;
    seats: number;
  };
  onSelectRide: (rideId: string) => void;
  onOpenChat: (rideId: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  searchParams,
  onSelectRide,
  onOpenChat,
}) => {
  const { getRankedRides } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);
  const [instantOnly, setInstantOnly] = useState(false);
  const [acOnly, setAcOnly] = useState(false);
  const [calledDriverPhone, setCalledDriverPhone] = useState<string | null>(null);

  // Simulated 400ms pull-to-refresh loading feel
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchParams, instantOnly, acOnly]);

  const rides = getRankedRides({
    fromCity: searchParams.fromCity,
    toCity: searchParams.toCity,
    date: searchParams.date,
    minSeats: searchParams.seats,
    instantOnly,
    acOnly,
  });

  const featuredRides = rides.filter((r) => r.isFeatured);
  const regularRides = rides.filter((r) => !r.isFeatured);

  const handleCallClick = (e: React.MouseEvent, phone?: string) => {
    e.stopPropagation();
    if (phone) {
      setCalledDriverPhone(phone);
    }
  };

  const handleChatClick = (e: React.MouseEvent, rideId: string) => {
    e.stopPropagation();
    onOpenChat(rideId);
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Route & Date Summary Header */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-sm font-extrabold text-[#1C1C1C]">
              <span>{searchParams.fromCity || 'All Origin'}</span>
              <span className="text-[#F15A24]">→</span>
              <span>{searchParams.toCity || 'All Destinations'}</span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-0.5">
              {searchParams.date ? new Date(searchParams.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }) : 'All Dates'} • {searchParams.seats} Seat{searchParams.seats > 1 ? 's' : ''}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-[#F15A24] bg-[#FFF0EB] px-2.5 py-1 rounded-full border border-[#FFD8CB]">
              {rides.length} Rides Found
            </span>
          </div>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F2ECE1] overflow-x-auto pb-0.5">
          <button
            onClick={() => setInstantOnly(!instantOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 active-press ${
              instantOnly
                ? 'bg-[#F15A24] text-white shadow-xs'
                : 'bg-[#FAF6EE] text-[#6B6B6B] border border-[#EBE5D8]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Instant Booking</span>
          </button>

          <button
            onClick={() => setAcOnly(!acOnly)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 active-press ${
              acOnly
                ? 'bg-[#F15A24] text-white shadow-xs'
                : 'bg-[#FAF6EE] text-[#6B6B6B] border border-[#EBE5D8]'
            }`}
          >
            <span>AC Only</span>
          </button>

          <button
            onClick={() => setIsLoading(true)}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#6B6B6B] bg-[#FAF6EE] border border-[#EBE5D8] flex items-center gap-1 flex-shrink-0 active-press"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <ListSkeleton count={4} />
      ) : rides.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#EBE5D8] text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#F15A24] mx-auto">
            <Car className="w-7 h-7" />
          </div>
          <h3 className="font-extrabold text-base text-[#1C1C1C]">No Rides on This Exact Route</h3>
          <p className="text-xs text-[#6B6B6B] max-w-xs mx-auto">
            Try choosing a nearby date or search between popular hubs like Delhi, Jaipur, Mumbai, or Pune.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* 1. FEATURED BOOSTED SECTION (Pinned at top with gradient border & Call Button) */}
          {featuredRides.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F15A24]" />
                  <h3 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider">
                    Featured Boosted Rides ({featuredRides.length})
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Top Ranked #1
                </span>
              </div>

              {featuredRides.map((ride) => (
                <div
                  key={ride.id}
                  onClick={() => onSelectRide(ride.id)}
                  className="bg-white rounded-3xl p-4 border-2 border-[#FF8A00] shadow-featured relative overflow-hidden active-press cursor-pointer hover:shadow-lg transition-all"
                >
                  {/* Top Gradient Ribbon */}
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-[#E8380D] to-[#FF8A00] text-white text-[9px] font-extrabold uppercase px-3 py-0.5 rounded-bl-xl flex items-center gap-1 shadow-xs">
                    <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
                    <span>{ride.packageName || 'Featured Boost'}</span>
                  </div>

                  {/* Driver Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={ride.driver.avatar}
                          alt={ride.driver.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-[#F15A24]"
                        />
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2E9E5B] border-2 border-white flex items-center justify-center text-white text-[8px]">
                          ✓
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-extrabold text-[#1C1C1C]">{ride.driver.name}</h4>
                          <Badge type="verified" text="ID" size="sm" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#6B6B6B] mt-0.5">
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                            {ride.driver.rating} ({ride.driver.totalReviews})
                          </span>
                          <span>•</span>
                          <span>{ride.driver.vehicle.make} {ride.driver.vehicle.model}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right pt-3">
                      <span className="text-lg font-extrabold text-[#F15A24]">
                        ₹{ride.pricePerSeat}
                      </span>
                      <p className="text-[9px] text-[#6B6B6B]">per seat</p>
                    </div>
                  </div>

                  {/* Route & Time Box */}
                  <div className="bg-[#FAF6EE] rounded-2xl p-3 border border-[#EBE5D8] space-y-2 mb-3">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1C1C1C]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F15A24]" />
                        <span>{ride.departureTime}</span>
                        <span className="text-[10px] font-normal text-[#6B6B6B]">({ride.estimatedDuration})</span>
                      </div>
                      <span className="text-[11px] font-extrabold text-[#2E9E5B]">
                        {ride.availableSeats} seat{ride.availableSeats > 1 ? 's' : ''} left
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-[#1C1C1C] pl-1 border-l-2 border-[#F15A24]/40 ml-1">
                      <p className="font-semibold truncate">{ride.pickupPoint}</p>
                      <p className="text-[#6B6B6B] text-[11px] truncate">{ride.dropPoint}</p>
                    </div>
                  </div>

                  {/* Featured CTAs (Includes Direct CALL CTA because it's Boosted!) */}
                  <div className="flex items-center gap-2">
                    {ride.driver.phone && (
                      <button
                        onClick={(e) => handleCallClick(e, ride.driver.phone)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#2E9E5B] hover:bg-[#25824b] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active-press"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Driver</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => handleChatClick(e, ride.id)}
                      className="py-2 px-3 rounded-xl bg-white border border-[#EBE5D8] text-[#1C1C1C] font-semibold text-xs flex items-center justify-center gap-1 hover:bg-[#FAF6EE] active-press"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#F15A24]" />
                      <span>Chat</span>
                    </button>

                    <button
                      onClick={() => onSelectRide(ride.id)}
                      className="py-2 px-3.5 rounded-xl brand-gradient text-white font-bold text-xs shadow-sm active-press flex items-center justify-center gap-1"
                    >
                      <span>Book</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 2. REGULAR RIDES SECTION (Unboosted - Driver Phone is Strictly Masked/Omitted) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-extrabold text-[#6B6B6B] uppercase tracking-wider">
                All Available Rides ({regularRides.length})
              </h3>
              <span className="text-[10px] text-[#6B6B6B]">Standard Listings</span>
            </div>

            {regularRides.map((ride) => (
              <div
                key={ride.id}
                onClick={() => onSelectRide(ride.id)}
                className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs active-press cursor-pointer hover:border-[#F15A24]/50 transition-all"
              >
                {/* Driver Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={ride.driver.avatar}
                      alt={ride.driver.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#EBE5D8]"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1C1C1C]">{ride.driver.name}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-[#6B6B6B] mt-0.5">
                        <span className="flex items-center text-amber-500 font-semibold">
                          <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                          {ride.driver.rating || 'New'}
                        </span>
                        <span>•</span>
                        <span>{ride.driver.vehicle.make} {ride.driver.vehicle.model}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#1C1C1C]">
                      ₹{ride.pricePerSeat}
                    </span>
                    <p className="text-[9px] text-[#6B6B6B]">per seat</p>
                  </div>
                </div>

                {/* Route & Time Box */}
                <div className="bg-[#FAF6EE] rounded-2xl p-2.5 border border-[#EBE5D8] space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1C1C1C]">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#6B6B6B]" />
                      <span>{ride.departureTime}</span>
                      <span className="text-[10px] font-normal text-[#6B6B6B]">({ride.estimatedDuration})</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#2E9E5B]">
                      {ride.availableSeats} seat{ride.availableSeats > 1 ? 's' : ''} left
                    </span>
                  </div>

                  <p className="text-xs text-[#1C1C1C] font-semibold truncate pl-1 border-l border-[#6B6B6B]/40">
                    {ride.pickupPoint} → {ride.dropPoint}
                  </p>
                </div>

                {/* Regular CTAs (NO Direct Call button because phone is stripped by selector) */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[10px] text-[#6B6B6B]">
                    <ShieldCheck className="w-3 h-3 text-[#2E9E5B]" />
                    <span>In-app chat only</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleChatClick(e, ride.id)}
                      className="py-1.5 px-3 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-semibold text-[#1C1C1C] flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3 text-[#6B6B6B]" />
                      <span>Chat</span>
                    </button>
                    <button
                      onClick={() => onSelectRide(ride.id)}
                      className="py-1.5 px-3.5 rounded-xl bg-[#1C1C1C] text-white text-xs font-bold active-press"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulated Call Modal for Featured Driver */}
      {calledDriverPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 text-center shadow-2xl border border-[#EBE5D8] animate-scale-in space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF7F0] flex items-center justify-center text-[#2E9E5B] mx-auto">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-extrabold text-base text-[#1C1C1C]">Calling Featured Driver</h4>
            <p className="text-sm font-mono font-bold text-[#F15A24] bg-[#FFF0EB] py-1 px-3 rounded-xl inline-block">
              {calledDriverPhone}
            </p>
            <p className="text-[11px] text-[#6B6B6B]">
              Direct driver calling is exclusively available on Boosted rides.
            </p>
            <button
              onClick={() => setCalledDriverPhone(null)}
              className="w-full py-2.5 bg-[#1C1C1C] text-white text-xs font-bold rounded-xl active-press"
            >
              End Simulated Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
