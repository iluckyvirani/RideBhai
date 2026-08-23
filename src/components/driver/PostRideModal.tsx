import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  Users,
  Plus,
  Trash2,
  Car,
  Check,
  Sparkles,
  Zap,
} from 'lucide-react';
import { POPULAR_CITIES, getRouteInfo } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import { Stopover } from '../../types';

interface PostRideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRideCreated: (rideId: string) => void;
}

export const PostRideModal: React.FC<PostRideModalProps> = ({
  isOpen,
  onClose,
  onRideCreated,
}) => {
  const { postRide, currentDriver } = useAppStore();

  const [fromCity, setFromCity] = useState('Delhi NCR');
  const [toCity, setToCity] = useState('Jaipur');
  const [pickupPoint, setPickupPoint] = useState('IFFCO Chowk Metro Gate 2, Gurgaon');
  const [dropPoint, setDropPoint] = useState('Sindhi Camp Bus Stand, Jaipur');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [departureTime, setDepartureTime] = useState('08:00 AM');
  const [totalSeats, setTotalSeats] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(450);
  const [instantBooking, setInstantBooking] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [notes, setNotes] = useState('Clean car, non-smoking, comfortable AC.');
  const [stopovers, setStopovers] = useState<Stopover[]>([]);

  // Preferences
  const [ac, setAc] = useState(true);
  const [maxTwoInBack, setMaxTwoInBack] = useState(true);
  const [luggage, setLuggage] = useState<'small' | 'medium' | 'large'>('medium');

  // Auto-calculate suggested price when route changes
  useEffect(() => {
    const info = getRouteInfo(fromCity, toCity);
    setPricePerSeat(info.defaultPrice);
  }, [fromCity, toCity]);

  if (!isOpen) return null;

  const handleAddStopover = () => {
    setStopovers([
      ...stopovers,
      { city: 'En-route Hub', point: 'Highway Toll Plaza', timeOffsetMinutes: 90, pricePerSeat: Math.round(pricePerSeat * 0.6) },
    ]);
  };

  const handleRemoveStopover = (index: number) => {
    setStopovers(stopovers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const info = getRouteInfo(fromCity, toCity);

    const newRide = postRide({
      fromCity,
      toCity,
      pickupPoint,
      dropPoint,
      date,
      departureTime,
      estimatedDuration: info.duration,
      distanceKm: info.distanceKm,
      availableSeats: totalSeats,
      totalSeats,
      pricePerSeat,
      instantBooking,
      recurring,
      notes,
      stopovers: stopovers.length > 0 ? stopovers : undefined,
      preferences: {
        ac,
        smoking: false,
        pets: false,
        music: true,
        luggage,
        maxTwoInBack,
      },
    });

    onRideCreated(newRide.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-[#EBE5D8] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#FAF6EE] px-5 py-4 border-b border-[#EBE5D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#F15A24]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#1C1C1C]">Publish a Ride</h3>
              <p className="text-[11px] text-[#6B6B6B]">Offer seats on your upcoming journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6B6B6B] hover:text-[#1C1C1C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* Verification Gating Notice */}
          {currentDriver.status !== 'verified' && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Profile Verification Required</strong>
                <span>
                  {currentDriver.status === 'pending_verification'
                    ? 'Your documents & vehicle are currently under review. This ride post will be queued until verification approval.'
                    : 'Please submit your KYC documents & vehicle details in Driver Verification to activate live ride publishing.'}
                </span>
              </div>
            </div>
          )}

          {/* Route Section */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  From City
                </label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-2.5 py-2 text-xs font-bold text-[#1C1C1C]"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  To City
                </label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-2.5 py-2 text-xs font-bold text-[#1C1C1C]"
                >
                  {POPULAR_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                Specific Pickup Point
              </label>
              <input
                type="text"
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
                placeholder="e.g. Metro station gate / Toll Plaza"
                className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24]"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                Specific Drop Point
              </label>
              <input
                type="text"
                value={dropPoint}
                onChange={(e) => setDropPoint(e.target.value)}
                placeholder="e.g. Bus stand / City bypass"
                className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-3 py-2 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24]"
                required
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-2.5 py-2 text-xs font-bold text-[#1C1C1C]"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                Departure Time
              </label>
              <input
                type="text"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="08:00 AM"
                className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl px-2.5 py-2 text-xs font-bold text-[#1C1C1C]"
                required
              />
            </div>
          </div>

          {/* Pricing & Seats with Auto Estimator */}
          <div className="bg-[#FFF9F5] p-3 rounded-2xl border border-[#FFD8CB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#F15A24]">Price & Capacity</span>
              <span className="text-[10px] text-[#2E9E5B] font-bold bg-[#EBF7F0] px-2 py-0.5 rounded-full">
                Auto-estimated by distance
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  Price Per Seat (₹)
                </label>
                <div className="flex items-center bg-white rounded-xl border border-[#FFD8CB] px-3 py-1.5">
                  <span className="text-xs font-bold text-[#F15A24] mr-1">₹</span>
                  <input
                    type="number"
                    min={100}
                    max={3000}
                    value={pricePerSeat}
                    onChange={(e) => setPricePerSeat(Number(e.target.value))}
                    className="w-full text-sm font-extrabold text-[#1C1C1C] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                  Seats Offered
                </label>
                <div className="flex items-center justify-between bg-white rounded-xl border border-[#FFD8CB] px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setTotalSeats(Math.max(1, totalSeats - 1))}
                    className="w-6 h-6 rounded-md bg-[#FAF6EE] text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-extrabold text-[#1C1C1C]">{totalSeats}</span>
                  <button
                    type="button"
                    onClick={() => setTotalSeats(Math.min(6, totalSeats + 1))}
                    className="w-6 h-6 rounded-md bg-[#FAF6EE] text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Instant Booking Toggle */}
          <div className="flex items-center justify-between bg-[#FAF6EE] p-3 rounded-2xl border border-[#EBE5D8]">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#F15A24]" />
              <div>
                <p className="text-xs font-bold text-[#1C1C1C]">Instant Booking</p>
                <p className="text-[10px] text-[#6B6B6B]">Auto-confirm riders without manual review</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={instantBooking}
              onChange={(e) => setInstantBooking(e.target.checked)}
              className="w-4 h-4 accent-[#F15A24]"
            />
          </div>

          {/* Driver Notes */}
          <div>
            <label className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
              Trip Notes / Instructions
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Leaving punctually at 8 AM. Small bags only."
              className="w-full bg-[#FAF6EE] border border-[#EBE5D8] rounded-xl p-2.5 text-xs text-[#1C1C1C] focus:outline-none focus:border-[#F15A24]"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl brand-gradient text-white font-extrabold text-sm shadow-md active-press flex items-center justify-center gap-2 hover:opacity-95"
          >
            <Check className="w-4 h-4" />
            <span>Publish Ride Live</span>
          </button>
        </form>
      </div>
    </div>
  );
};
