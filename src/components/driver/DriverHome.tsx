import React from 'react';
import {
  Car,
  PlusCircle,
  Sparkles,
  Users,
  IndianRupee,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface DriverHomeProps {
  onPostRideClick: () => void;
  onViewRequestsClick: () => void;
  onViewPackagesClick: () => void;
  onViewVerificationClick: () => void;
}

export const DriverHome: React.FC<DriverHomeProps> = ({
  onPostRideClick,
  onViewRequestsClick,
  onViewPackagesClick,
  onViewVerificationClick,
}) => {
  const {
    currentDriver,
    rides,
    bookings,
    isDriverBoosted,
    getDriverActivePackage,
  } = useAppStore();

  const isBoosted = isDriverBoosted(currentDriver.id);
  const activePkg = getDriverActivePackage(currentDriver.id);

  // Filter rides created by current driver
  const myRides = rides.filter((r) => r.driverId === currentDriver.id);

  // Filter bookings for this driver
  const driverBookings = bookings.filter((b) => b.driverId === currentDriver.id);
  const pendingRequests = driverBookings.filter((b) => b.status === 'pending');
  const completedBookings = driverBookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0) + 3840; // Seed baseline

  const daysRemaining = activePkg
    ? Math.max(0, Math.ceil((activePkg.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)))
    : 0;

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Driver Verification Status Banner */}
      {currentDriver.status !== 'verified' && (
        <div
          onClick={onViewVerificationClick}
          className={`p-3.5 rounded-3xl border flex items-center justify-between cursor-pointer active-press ${
            currentDriver.status === 'pending_verification'
              ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]'
              : 'bg-[#FDEDED] border-[#FACBCB] text-[#D64545]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold leading-tight">
                {currentDriver.status === 'pending_verification'
                  ? 'Verification in Review'
                  : 'Document Verification Failed'}
              </p>
              <p className="text-[10px] opacity-80 mt-0.5">
                {currentDriver.status === 'pending_verification'
                  ? 'Tap to review document status or simulate admin approval'
                  : 'Tap to inspect reason & re-upload documents'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4" />
        </div>
      )}

      {/* Boost Subscription Status Banner */}
      <div
        onClick={onViewPackagesClick}
        className={`rounded-3xl p-4 cursor-pointer active-press transition-all ${
          isBoosted
            ? 'brand-gradient text-white shadow-featured'
            : 'bg-white border border-[#EBE5D8] shadow-card'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${isBoosted ? 'bg-white/20' : 'bg-[#FFF0EB] text-[#F15A24]'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isBoosted ? 'text-amber-200' : 'text-[#F15A24]'}`}>
                {isBoosted ? '🔥 Active Boost Active' : 'Boost Your Rides'}
              </span>
              <h3 className={`font-display font-extrabold text-sm ${isBoosted ? 'text-white' : 'text-[#1C1C1C]'}`}>
                {isBoosted ? `${activePkg?.pkg?.name || 'Weekly Boost'} (${daysRemaining} Days Left)` : 'Get #1 Ranked in Search'}
              </h3>
            </div>
          </div>

          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${isBoosted ? 'bg-white text-[#F15A24]' : 'brand-gradient text-white'}`}>
            {isBoosted ? 'Manage' : 'Boost ₹99'}
          </span>
        </div>
      </div>

      {/* Quick Key Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-[#EBE5D8] text-center shadow-xs">
          <span className="text-lg font-extrabold text-[#F15A24]">{myRides.length}</span>
          <span className="text-[10px] text-[#6B6B6B] font-bold block mt-0.5">Active Rides</span>
        </div>

        <div
          onClick={onViewRequestsClick}
          className="bg-white p-3 rounded-2xl border border-[#EBE5D8] text-center shadow-xs cursor-pointer active-press hover:border-[#F15A24]"
        >
          <span className="text-lg font-extrabold text-[#2E9E5B]">{pendingRequests.length}</span>
          <span className="text-[10px] text-[#6B6B6B] font-bold block mt-0.5">Requests</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-[#EBE5D8] text-center shadow-xs">
          <span className="text-lg font-extrabold text-[#1C1C1C]">₹{totalEarnings}</span>
          <span className="text-[10px] text-[#6B6B6B] font-bold block mt-0.5">Earned</span>
        </div>
      </div>

      {/* Primary Action Button: Post a Ride */}
      <div>
        <button
          onClick={onPostRideClick}
          disabled={currentDriver.status !== 'verified'}
          className={`w-full py-4 rounded-3xl font-extrabold text-sm shadow-md active-press flex items-center justify-center gap-2 ${
            currentDriver.status === 'verified'
              ? 'brand-gradient text-white hover:opacity-95'
              : 'bg-[#EAE4D7] text-[#9E9E9E] cursor-not-allowed'
          }`}
        >
          <PlusCircle className="w-5 h-5" />
          <span>Post a New Ride</span>
        </button>
        {currentDriver.status !== 'verified' && (
          <p className="text-[11px] text-center text-[#D64545] mt-1 font-semibold">
            ⚠️ Gated: You must be verified by Admin before publishing rides.
          </p>
        )}
      </div>

      {/* My Published Rides List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider">
            Your Published Rides ({myRides.length})
          </h3>
          <span className="text-[10px] text-[#6B6B6B]">Live on Search</span>
        </div>

        {myRides.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#EBE5D8] text-center space-y-2">
            <Car className="w-8 h-8 text-[#6B6B6B] mx-auto opacity-50" />
            <p className="text-xs font-bold text-[#1C1C1C]">No active rides posted yet</p>
            <p className="text-[11px] text-[#6B6B6B]">Offer your empty car seats and split fuel costs!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRides.map((ride) => (
              <div
                key={ride.id}
                className={`bg-white rounded-3xl p-4 border shadow-card space-y-2.5 relative overflow-hidden ${
                  isBoosted ? 'border-[#FF8A00]' : 'border-[#EBE5D8]'
                }`}
              >
                {isBoosted && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-[#E8380D] to-[#FF8A00] text-white text-[8px] font-extrabold uppercase px-2.5 py-0.5 rounded-bl-lg flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Boosted #1</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1C1C1C]">
                    <MapPin className="w-3.5 h-3.5 text-[#F15A24]" />
                    <span>{ride.fromCity}</span>
                    <span className="text-[#F15A24]">→</span>
                    <span>{ride.toCity}</span>
                  </div>

                  <span className="text-xs font-extrabold text-[#F15A24]">
                    ₹{ride.pricePerSeat} / seat
                  </span>
                </div>

                <div className="bg-[#FAF6EE] rounded-2xl p-2.5 border border-[#EBE5D8] flex items-center justify-between text-xs text-[#6B6B6B]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#F15A24]" />
                    <span className="font-semibold text-[#1C1C1C]">{ride.date}</span>
                    <span>•</span>
                    <span className="font-semibold">{ride.departureTime}</span>
                  </div>

                  <span className="font-bold text-[#2E9E5B]">
                    {ride.availableSeats} of {ride.totalSeats} seats open
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
