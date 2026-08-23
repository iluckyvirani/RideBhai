import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  Phone,
  MessageCircle,
  Volume2,
  CigaretteOff,
  Luggage,
  Users,
  Car,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { MockPaymentModal } from '../common/MockPaymentModal';
import { AuthModal } from '../auth/AuthModal';
import { Badge } from '../common/Badge';

interface RideDetailViewProps {
  rideId: string;
  onBookSuccess: (bookingId: string) => void;
  onOpenChat: (rideId: string) => void;
}

export const RideDetailView: React.FC<RideDetailViewProps> = ({
  rideId,
  onBookSuccess,
  onOpenChat,
}) => {
  const { rides, drivers, isDriverBoosted, bookSeats, isRiderLoggedIn } = useAppStore();
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [calledPhone, setCalledPhone] = useState<string | null>(null);


  const ride = rides.find((r) => r.id === rideId);
  if (!ride) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-[#EBE5D8] my-8">
        <p className="text-sm font-bold text-[#6B6B6B]">Ride not found or expired.</p>
      </div>
    );
  }

  const driver = drivers.find((d) => d.id === ride.driverId);
  const isBoosted = driver ? isDriverBoosted(driver.id) : false;
  const totalPrice = ride.pricePerSeat * selectedSeats;

  const handleConfirmPayment = (method: 'upi' | 'card') => {
    try {
      const booking = bookSeats(ride.id, selectedSeats, method);
      onBookSuccess(booking.id);
    } catch (err: any) {
      alert(err.message || 'Failed to book seats');
    }
  };

  return (
    <div className="space-y-4 pb-28 animate-fade-in">
      {/* Boosted Banner (if active) */}
      {isBoosted && (
        <div className="rounded-2xl p-3 brand-gradient text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-200 fill-amber-200 animate-pulse" />
            <div>
              <p className="text-xs font-extrabold">Boosted Featured Ride</p>
              <p className="text-[10px] text-white/90">Priority verified driver with direct phone support</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
            VIP Status
          </span>
        </div>
      )}

      {/* Driver Card */}
      {driver && (
        <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-card space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-[#F15A24]"
                />
                {driver.idVerified && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#2E9E5B] border-2 border-white flex items-center justify-center text-white text-[8px] font-bold">
                    ✓
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-[#1C1C1C] flex items-center gap-1.5">
                  {driver.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="flex items-center text-amber-500 font-extrabold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 mr-0.5" />
                    {driver.rating} ({driver.totalReviews} reviews)
                  </span>
                  <span className="text-[#6B6B6B]">•</span>
                  <span className="text-[#6B6B6B] font-medium">{driver.totalRides} rides completed</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge type="verified" text="Govt ID Verified" size="sm" />
                </div>
              </div>
            </div>
          </div>

          {driver.bio && (
            <p className="text-xs text-[#6B6B6B] bg-[#FAF6EE] p-3 rounded-2xl border border-[#EBE5D8] italic">
              "{driver.bio}"
            </p>
          )}

          {/* Quick Contact Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {isBoosted ? (
              <button
                onClick={() => setCalledPhone(driver.phone)}
                className="py-2.5 rounded-xl bg-[#2E9E5B] hover:bg-[#25824b] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active-press"
              >
                <Phone className="w-4 h-4" />
                <span>Call {driver.phone}</span>
              </button>
            ) : (
              <div className="py-2.5 rounded-xl bg-[#FAF6EE] text-[#6B6B6B] text-[11px] font-medium flex items-center justify-center text-center px-2">
                Phone masked (In-app only)
              </div>
            )}

            <button
              onClick={() => onOpenChat(ride.id)}
              className="py-2.5 rounded-xl bg-white border border-[#EBE5D8] text-[#1C1C1C] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#FAF6EE] active-press"
            >
              <MessageCircle className="w-4 h-4 text-[#F15A24]" />
              <span>Chat with Driver</span>
            </button>
          </div>
        </div>
      )}

      {/* Vehicle Info Card */}
      {driver?.vehicle && (
        <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-[#F15A24]" />
              <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
                Vehicle Details
              </h4>
            </div>
            <span className="text-xs font-mono font-bold text-[#1C1C1C] bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#EBE5D8]">
              {driver.vehicle.plate}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#1C1C1C] pt-1">
            <span className="font-bold">
              {driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.year})
            </span>
            <span className="text-[#6B6B6B]">{driver.vehicle.color}</span>
          </div>
        </div>
      )}

      {/* Route & Timings Itinerary */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#F15A24]" />
            <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
              Trip Itinerary
            </h4>
          </div>
          <span className="text-xs font-extrabold text-[#F15A24]">
            {new Date(ride.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="relative pl-6 space-y-4 border-l-2 border-[#F15A24]/40 ml-2">
          {/* Pickup */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#2E9E5B] border-2 border-white shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#1C1C1C]">{ride.departureTime}</span>
              <span className="text-[10px] font-bold text-[#2E9E5B] bg-[#EBF7F0] px-2 py-0.5 rounded-full">
                Pickup Point
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1C1C1C] mt-0.5">{ride.fromCity}</p>
            <p className="text-[11px] text-[#6B6B6B]">{ride.pickupPoint}</p>
          </div>

          {/* Stopovers (if any) */}
          {ride.stopovers?.map((stop, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-[#FF8A00] border-2 border-white" />
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#6B6B6B]">En-route Stop</span>
                <span className="text-[10px] text-[#F15A24] font-semibold">₹{stop.pricePerSeat}</span>
              </div>
              <p className="text-xs font-medium text-[#1C1C1C]">{stop.city} ({stop.point})</p>
            </div>
          ))}

          {/* Drop */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-[#E8380D] border-2 border-white shadow-xs" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#1C1C1C]">Est. Duration: {ride.estimatedDuration}</span>
              <span className="text-[10px] font-bold text-[#E8380D] bg-[#FDEDED] px-2 py-0.5 rounded-full">
                Drop Point
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1C1C1C] mt-0.5">{ride.toCity}</p>
            <p className="text-[11px] text-[#6B6B6B]">{ride.dropPoint}</p>
          </div>
        </div>

        {ride.notes && (
          <div className="pt-2 border-t border-[#F2ECE1] flex items-start gap-2 text-xs text-[#6B6B6B]">
            <Info className="w-4 h-4 text-[#F15A24] flex-shrink-0 mt-0.5" />
            <p className="leading-snug">Note from driver: {ride.notes}</p>
          </div>
        )}
      </div>

      {/* Ride Amenities & Policies */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs space-y-2.5">
        <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
          Ride Amenities & Rules
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 bg-[#FAF6EE] rounded-xl">
            <span className="w-2 h-2 rounded-full bg-[#2E9E5B]" />
            <span className="font-semibold text-[#1C1C1C]">{ride.preferences.ac ? 'AC Available' : 'No AC'}</span>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#FAF6EE] rounded-xl">
            <Users className="w-3.5 h-3.5 text-[#F15A24]" />
            <span className="font-semibold text-[#1C1C1C]">Max 2 in Back Seat</span>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#FAF6EE] rounded-xl">
            <Luggage className="w-3.5 h-3.5 text-[#F15A24]" />
            <span className="font-semibold text-[#1C1C1C] capitalize">{ride.preferences.luggage} Luggage</span>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#FAF6EE] rounded-xl">
            <CigaretteOff className="w-3.5 h-3.5 text-[#6B6B6B]" />
            <span className="font-semibold text-[#1C1C1C]">No Smoking</span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-[#EBE5D8] px-4 py-3.5 pb-4 shadow-2xl max-w-[430px] mx-auto flex items-center justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold text-[#F15A24]">₹{totalPrice}</span>
            <span className="text-[11px] text-[#6B6B6B]">for {selectedSeats} seat{selectedSeats > 1 ? 's' : ''}</span>
          </div>

          {/* Seats Selector */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] text-[#6B6B6B] font-bold">Seats:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  disabled={num > ride.availableSeats}
                  onClick={() => setSelectedSeats(num)}
                  className={`w-5 h-5 rounded-md text-[10px] font-extrabold transition-all ${
                    selectedSeats === num
                      ? 'bg-[#F15A24] text-white'
                      : num > ride.availableSeats
                      ? 'bg-[#F2EDE2] text-[#9E9E9E] opacity-50 cursor-not-allowed'
                      : 'bg-[#FAF6EE] text-[#1C1C1C] border border-[#EBE5D8]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (!isRiderLoggedIn) {
              setIsAuthOpen(true);
            } else {
              setIsPaymentOpen(true);
            }
          }}
          disabled={ride.availableSeats === 0}
          className={`py-3 px-6 rounded-2xl font-extrabold text-xs shadow-md active-press flex items-center gap-2 ${
            ride.availableSeats > 0
              ? 'brand-gradient text-white hover:opacity-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{ride.instantBooking ? 'Instant Book' : 'Request Seat'}</span>
        </button>
      </div>

      {/* Phone OTP Verification Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        targetRole="rider"
        title="Verify Phone to Book"
        subtitle="Quick 4-digit OTP verification ensures your seat reservation is locked"
        onSuccess={() => {
          setIsAuthOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      {/* Mock Payment Dialog */}
      <MockPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handleConfirmPayment}
        title="Book Carpool Seat"
        amount={totalPrice}
        itemDescription={`${ride.fromCity} to ${ride.toCity} (${selectedSeats} Seat)`}
      />


      {/* Simulated Call Modal for Boosted Driver */}
      {calledPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-white rounded-3xl p-5 text-center shadow-2xl border border-[#EBE5D8] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF7F0] flex items-center justify-center text-[#2E9E5B] mx-auto">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-extrabold text-base text-[#1C1C1C]">Calling {driver?.name}</h4>
            <p className="text-sm font-mono font-bold text-[#F15A24] bg-[#FFF0EB] py-1 px-3 rounded-xl inline-block">
              {calledPhone}
            </p>
            <p className="text-[11px] text-[#6B6B6B]">
              Direct phone connection is powered by Ridebhai Pro Boost.
            </p>
            <button
              onClick={() => setCalledPhone(null)}
              className="w-full py-2.5 bg-[#1C1C1C] text-white text-xs font-bold rounded-xl active-press"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
