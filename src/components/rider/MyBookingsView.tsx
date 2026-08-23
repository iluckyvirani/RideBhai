import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  KeyRound,
  PlayCircle,
  CheckCircle,
  Star,
  MessageCircle,
  Car,
  AlertTriangle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { RatingModal } from './RatingModal';

interface MyBookingsViewProps {
  onOpenChat: (rideId: string) => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({ onOpenChat }) => {
  const {
    bookings,
    rides,
    drivers,
    currentRider,
    simulateTripStart,
    simulateTripComplete,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);

  // Rider's bookings
  const myBookings = bookings.filter((b) => b.riderId === currentRider.id);

  const upcomingBookings = myBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'started' || b.status === 'pending'
  );
  const pastBookings = myBookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected'
  );

  const displayList = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Top Tabs */}
      <div className="grid grid-cols-2 gap-2 bg-[#F2EDE2] p-1 rounded-2xl text-xs font-extrabold">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upcoming'
              ? 'bg-white text-[#F15A24] shadow-xs'
              : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
          }`}
        >
          <span>Active & Upcoming</span>
          <span className="w-4 h-4 rounded-full bg-[#FFF0EB] text-[#F15A24] text-[9px] flex items-center justify-center font-bold">
            {upcomingBookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('past')}
          className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'past'
              ? 'bg-white text-[#F15A24] shadow-xs'
              : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
          }`}
        >
          <span>Past Rides</span>
          <span className="w-4 h-4 rounded-full bg-[#EAE4D7] text-[#6B6B6B] text-[9px] flex items-center justify-center font-bold">
            {pastBookings.length}
          </span>
        </button>
      </div>

      {/* Bookings List */}
      {displayList.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#EBE5D8] text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#9E9E9E] mx-auto">
            <Car className="w-7 h-7" />
          </div>
          <h4 className="font-extrabold text-sm text-[#1C1C1C]">No {activeTab} Bookings</h4>
          <p className="text-xs text-[#6B6B6B] max-w-xs mx-auto">
            {activeTab === 'upcoming'
              ? "You don't have any upcoming trips. Search and book a ride now!"
              : 'Completed trip receipts and driver reviews will show here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayList.map((booking) => {
            const ride = rides.find((r) => r.id === booking.rideId);
            const driver = drivers.find((d) => d.id === booking.driverId);

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-card space-y-3 relative overflow-hidden"
              >
                {/* Status Ribbon */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#9E9E9E]">Ref: #{booking.id.slice(-6)}</span>
                  {booking.status === 'confirmed' && (
                    <span className="text-[10px] font-extrabold text-[#2E9E5B] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#B8E6CB]">
                      ● Confirmed
                    </span>
                  )}
                  {booking.status === 'started' && (
                    <span className="text-[10px] font-extrabold text-[#F15A24] bg-[#FFF0EB] px-2.5 py-0.5 rounded-full border border-[#FFD8CB] animate-pulse">
                      ● Trip in Progress
                    </span>
                  )}
                  {booking.status === 'completed' && (
                    <span className="text-[10px] font-extrabold text-[#2E9E5B] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full">
                      ✓ Completed
                    </span>
                  )}
                </div>

                {/* Driver & Car Summary */}
                {driver && (
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#EBE5D8]"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-[#1C1C1C]">{driver.name}</h4>
                        <p className="text-[10px] text-[#6B6B6B]">
                          {driver.vehicle.make} {driver.vehicle.model} • <span className="font-mono">{driver.vehicle.plate}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenChat(booking.rideId)}
                      className="w-8 h-8 rounded-full bg-[#FFF0EB] flex items-center justify-center text-[#F15A24] active-press hover:bg-[#F15A24] hover:text-white transition-all"
                      title="Chat with driver"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Route Itinerary */}
                {ride && (
                  <div className="bg-[#FAF6EE] rounded-2xl p-3 border border-[#EBE5D8] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1C1C1C]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#F15A24]" />
                        <span>{ride.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6B6B6B]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ride.departureTime}</span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1 pl-1 border-l-2 border-[#F15A24]/40 ml-1">
                      <p className="font-bold text-[#1C1C1C] truncate">{ride.fromCity} ({ride.pickupPoint})</p>
                      <p className="text-[#6B6B6B] truncate">{ride.toCity} ({ride.dropPoint})</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs border-t border-[#EAE4D7]">
                      <span className="text-[#6B6B6B]">{booking.seatsBooked} Seat{booking.seatsBooked > 1 ? 's' : ''}</span>
                      <span className="font-extrabold text-[#F15A24]">Total: ₹{booking.totalPrice}</span>
                    </div>
                  </div>
                )}

                {/* Boarding OTP Box (For Active Rides) */}
                {(booking.status === 'confirmed' || booking.status === 'started') && (
                  <div className="bg-gradient-to-r from-[#FFF5F0] to-[#FFEBE3] rounded-2xl p-3 border border-[#FFD8CB] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#F15A24] text-white flex items-center justify-center shadow-xs">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#6B6B6B] tracking-wider block">
                          Boarding OTP
                        </span>
                        <span className="font-mono text-base font-extrabold text-[#1C1C1C] tracking-widest">
                          {booking.pickupOtp}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#F15A24] font-semibold bg-white px-2 py-1 rounded-lg border border-[#FFD8CB]">
                      Share with Driver
                    </span>
                  </div>
                )}

                {/* Lifecycle Simulation Actions (Trip Start / Complete) */}
                {booking.status === 'confirmed' && (
                  <div className="pt-1">
                    <button
                      onClick={() => simulateTripStart(booking.id)}
                      className="w-full py-2.5 rounded-xl bg-[#2E9E5B] hover:bg-[#25824b] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active-press"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>Simulate Ride Start (Driver arrives)</span>
                    </button>
                  </div>
                )}

                {booking.status === 'started' && (
                  <div className="pt-1">
                    <button
                      onClick={() => simulateTripComplete(booking.id)}
                      className="w-full py-2.5 rounded-xl brand-gradient text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active-press"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Simulate Ride Complete (Destination reached)</span>
                    </button>
                  </div>
                )}

                {/* Rating CTA for Completed Rides */}
                {booking.status === 'completed' && (
                  <div className="pt-1">
                    {booking.review ? (
                      <div className="bg-[#FAF6EE] p-3 rounded-2xl border border-[#EBE5D8] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#6B6B6B]">Your Rating</span>
                          <span className="flex items-center text-amber-500 text-xs font-bold">
                            <Star className="w-3 h-3 fill-amber-500 mr-0.5" />
                            {booking.review.rating} / 5
                          </span>
                        </div>
                        <p className="text-xs text-[#1C1C1C] italic">"{booking.review.comment}"</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRatingBookingId(booking.id)}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active-press"
                      >
                        <Star className="w-4 h-4 fill-white" />
                        <span>Rate & Review Driver</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rating Review Modal */}
      {ratingBookingId && (
        <RatingModal
          bookingId={ratingBookingId}
          onClose={() => setRatingBookingId(null)}
        />
      )}
    </div>
  );
};
