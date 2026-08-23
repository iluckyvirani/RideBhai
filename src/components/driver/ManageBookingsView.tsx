import React, { useState } from 'react';
import {
  Users,
  Check,
  X,
  Phone,
  MessageSquare,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PlayCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { OTHER_RIDERS, CURRENT_RIDER } from '../../data/mockRiders';

export const ManageBookingsView: React.FC = () => {
  const {
    bookings,
    rides,
    currentDriver,
    handleBookingRequest,
    simulateTripStart,
    simulateTripComplete,
  } = useAppStore();

  const [otpInputs, setOtpInputs] = useState<Record<string, string>>({});
  const [otpErrors, setOtpErrors] = useState<Record<string, string>>({});
  const [verifiedTrips, setVerifiedTrips] = useState<Record<string, boolean>>({});

  const allRiders = [CURRENT_RIDER, ...OTHER_RIDERS];
  const driverBookings = bookings.filter((b) => b.driverId === currentDriver.id);

  const pendingRequests = driverBookings.filter((b) => b.status === 'pending');
  const activeBookings = driverBookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'started'
  );
  const completedBookings = driverBookings.filter((b) => b.status === 'completed');

  const handleVerifyOtp = (bookingId: string, expectedOtp: string) => {
    const entered = otpInputs[bookingId]?.trim();
    if (!entered) {
      setOtpErrors({ ...otpErrors, [bookingId]: 'Please enter passenger OTP' });
      return;
    }

    if (entered === expectedOtp || entered === '1234') {
      setVerifiedTrips({ ...verifiedTrips, [bookingId]: true });
      setOtpErrors({ ...otpErrors, [bookingId]: '' });
      simulateTripStart(bookingId);
    } else {
      setOtpErrors({ ...otpErrors, [bookingId]: `Incorrect code (Try ${expectedOtp} or 1234)` });
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Pending Join Requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-extrabold text-[#F15A24] uppercase tracking-wider">
              Pending Join Requests ({pendingRequests.length})
            </h3>
            <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
              Action Required
            </span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => {
              const rider = allRiders.find((r) => r.id === req.riderId) || CURRENT_RIDER;
              const ride = rides.find((r) => r.id === req.rideId);

              return (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl p-4 border border-[#FF8A00] shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rider.avatar}
                        alt={rider.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#EBE5D8]"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-[#1C1C1C]">{rider.name}</h4>
                        <p className="text-[10px] text-[#6B6B6B]">
                          ★ {rider.rating} • {rider.totalRides} trips
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#F15A24]">
                        ₹{req.totalPrice}
                      </span>
                      <p className="text-[9px] text-[#6B6B6B]">{req.seatsBooked} Seat(s)</p>
                    </div>
                  </div>

                  {ride && (
                    <p className="text-xs text-[#6B6B6B] bg-[#FAF6EE] p-2.5 rounded-xl border border-[#EBE5D8] truncate">
                      Route: <span className="font-bold text-[#1C1C1C]">{ride.fromCity} → {ride.toCity}</span> ({ride.departureTime})
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleBookingRequest(req.id, 'reject')}
                      className="py-2 rounded-xl bg-[#FAF6EE] text-[#D64545] font-bold text-xs flex items-center justify-center gap-1 active-press"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>

                    <button
                      onClick={() => handleBookingRequest(req.id, 'accept')}
                      className="py-2 rounded-xl bg-[#2E9E5B] text-white font-bold text-xs flex items-center justify-center gap-1 active-press shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Rider</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Confirmed Passengers & Boarding OTP Verification */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider">
            Confirmed Passengers ({activeBookings.length})
          </h3>
          <span className="text-[10px] text-[#2E9E5B] font-bold">Trip Ready</span>
        </div>

        {activeBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 border border-[#EBE5D8] text-center space-y-2">
            <Users className="w-8 h-8 text-[#6B6B6B] mx-auto opacity-40" />
            <p className="text-xs font-bold text-[#1C1C1C]">No active passengers yet</p>
            <p className="text-[10px] text-[#6B6B6B]">When riders book your seats, they will appear here.</p>
          </div>
        ) : (
          activeBookings.map((b) => {
            const rider = allRiders.find((r) => r.id === b.riderId) || CURRENT_RIDER;
            const ride = rides.find((r) => r.id === b.rideId);

            return (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-card space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rider.avatar}
                      alt={rider.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#EBE5D8]"
                    />
                    <div>
                      <h4 className="text-xs font-extrabold text-[#1C1C1C]">{rider.name}</h4>
                      <p className="text-[10px] text-[#6B6B6B]">{rider.phone}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#2E9E5B] bg-[#EBF7F0] px-2 py-0.5 rounded-full">
                      {b.status === 'started' ? 'Trip in Progress' : 'Confirmed'}
                    </span>
                    <p className="text-[10px] font-extrabold text-[#1C1C1C] mt-1">₹{b.totalPrice}</p>
                  </div>
                </div>

                {/* OTP Verification Box for Driver */}
                {b.status === 'confirmed' && (
                  <div className="bg-[#FAF6EE] rounded-2xl p-3 border border-[#EBE5D8] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-[#F15A24]" />
                        Verify Passenger Boarding OTP
                      </span>
                      <span className="text-[9px] text-[#6B6B6B] font-mono">(Hint: {b.pickupOtp})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={otpInputs[b.id] || ''}
                        onChange={(e) => setOtpInputs({ ...otpInputs, [b.id]: e.target.value })}
                        placeholder="Enter 4-digit OTP"
                        className="flex-1 bg-white border border-[#EBE5D8] rounded-xl px-3 py-2 text-xs font-mono font-bold tracking-widest text-center focus:outline-none focus:border-[#F15A24]"
                      />
                      <button
                        onClick={() => handleVerifyOtp(b.id, b.pickupOtp)}
                        className="py-2 px-4 rounded-xl brand-gradient text-white font-bold text-xs shadow-xs active-press flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </button>
                    </div>

                    {otpErrors[b.id] && (
                      <p className="text-[10px] text-[#D64545] font-semibold">{otpErrors[b.id]}</p>
                    )}
                  </div>
                )}

                {/* Complete Trip Action */}
                {b.status === 'started' && (
                  <div className="pt-1">
                    <button
                      onClick={() => simulateTripComplete(b.id)}
                      className="w-full py-2.5 rounded-xl brand-gradient text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active-press"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Ride (Collect ₹{b.totalPrice})</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Completed History Summary */}
      {completedBookings.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <h3 className="text-xs font-extrabold text-[#6B6B6B] uppercase tracking-wider px-1">
            Completed Trips ({completedBookings.length})
          </h3>
          {completedBookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl p-3 border border-[#EBE5D8] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E9E5B]" />
                <span className="font-bold text-[#1C1C1C]">Booking #{b.id.slice(-5)}</span>
              </div>
              <span className="font-extrabold text-[#2E9E5B]">+₹{b.totalPrice}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
