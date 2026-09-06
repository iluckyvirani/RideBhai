import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  LogOut,
  Mail,
  MapPin,
  Building,
  BadgePercent,
  Car,
  Radio,
  UserRound,
  ChevronRight,
  PhoneCall,
  Landmark,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import { CompleteProfileView } from '../auth/CompleteProfileView';

interface PartnerProfileViewProps {
  onSwitchRole: (role: UserRole) => void;
  onOpenVerification: () => void;
  onOpenPackages: () => void;
  onLogout?: () => void;
  onOpenMyCars?: () => void;
  onOpenMyCarPosts?: () => void;
  onOpenMyDrivers?: () => void;
  onOpenMyTours?: () => void;
  onOpenMyBookings?: () => void;
  onOpenBankDetails?: () => void;
}

export const PartnerProfileView: React.FC<PartnerProfileViewProps> = ({
  onOpenPackages,
  onLogout,
  onOpenMyCars,
  onOpenMyCarPosts,
  onOpenMyDrivers,
  onOpenMyTours,
  onOpenMyBookings,
  onOpenBankDetails,
}) => {
  const {
    currentUser,
    partnerCars,
    carListings,
    agencyTripPosts,
    deals,
    logoutUser,
    canBook,
  } = useAppStore();
  const [editProfile, setEditProfile] = useState(false);
  const gate = canBook();
  const status = currentUser?.profileStatus || 'incomplete';
  const myTours = agencyTripPosts.filter((t) => t.agencyId === currentUser?.id);
  const myCarPosts = carListings.filter((c) => c.partnerId === currentUser?.id);
  const myBookings = deals.filter(
    (d) =>
      d.channel === 'ridebhai' &&
      currentUser?.id &&
      (d.buyerId === currentUser.id || d.sellerId === currentUser.id)
  );

  if (editProfile || status === 'rejected') {
    return (
      <div className="space-y-3 pb-24">
        {status === 'rejected' ? null : (
          <button
            type="button"
            onClick={() => setEditProfile(false)}
            className="text-xs font-extrabold text-[#F15A24]"
          >
            ← Back to profile
          </button>
        )}
        <CompleteProfileView embedded />
      </div>
    );
  }

  const statusLabel =
    status === 'verified' ? 'Verified' : status === 'pending_verification' ? 'Pending admin KYC' : 'Incomplete';

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      <div className="p-5 rounded-3xl bg-white border border-[#EBE5D8] shadow-card space-y-3">
        <div className="flex items-center gap-3">
          {currentUser?.selfieDoc?.startsWith('data:image') ? (
            <img
              src={currentUser.selfieDoc}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white font-black text-xl">
              {(currentUser?.name || 'U').charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-sm font-extrabold text-[#1C1C1C]">{currentUser?.name || 'Your profile'}</h2>
            <p className="text-xs text-[#6B6B6B]">+91 {currentUser?.phone}</p>
            <p className="text-[11px] font-extrabold text-[#F15A24] mt-0.5">{statusLabel}</p>
          </div>
        </div>
        <div className="space-y-1 text-[11px] text-[#6B6B6B]">
          <p className="flex items-center gap-1.5">
            <Mail className="w-3 h-3" /> {currentUser?.email}
          </p>
          {currentUser?.city && (
            <p className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> {currentUser.city}
            </p>
          )}
          {currentUser?.agencyName && (
            <p className="flex items-center gap-1.5">
              <Building className="w-3 h-3" /> {currentUser.agencyName}
            </p>
          )}
          {currentUser?.gstNumber && (
            <p className="flex items-center gap-1.5">
              <BadgePercent className="w-3 h-3" /> GST {currentUser.gstNumber}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setEditProfile(true)}
          className="w-full py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-extrabold text-[#1C1C1C]"
        >
          Edit profile
        </button>
        {!gate.allowed && (
          <div className="text-[11px] font-bold text-[#8A2B09] bg-[#FFF0EB] border border-[#FFD8CB] rounded-2xl p-3 space-y-2">
            <p>{gate.reason}</p>
            {gate.code === 'no_package' && (
              <button
                type="button"
                onClick={onOpenPackages}
                className="w-full py-2 rounded-xl bg-[#F15A24] text-white text-[11px] font-extrabold"
              >
                Open Plans
              </button>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpenMyCars}
        className="w-full p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card flex items-center justify-between text-left active-press"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
            <Car className="w-4 h-4 text-[#F15A24]" /> My cars
          </p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            {partnerCars.length === 0
              ? 'No cars yet. Open to add and list your cars.'
              : `${partnerCars.length} car${partnerCars.length === 1 ? '' : 's'} saved`}
          </p>
        </div>
        <span className="text-[11px] font-extrabold text-[#F15A24] flex items-center gap-0.5">
          Open <ChevronRight className="w-4 h-4" />
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenMyCarPosts}
        className="w-full p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card flex items-center justify-between text-left active-press"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#F15A24]" /> My post car history
          </p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            {myCarPosts.length === 0
              ? 'No car posts yet. Open to see listings you posted.'
              : `${myCarPosts.length} post${myCarPosts.length === 1 ? '' : 's'} · hide or show anytime`}
          </p>
        </div>
        <span className="text-[11px] font-extrabold text-[#F15A24] flex items-center gap-0.5">
          Open <ChevronRight className="w-4 h-4" />
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenMyDrivers}
        className="w-full p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card flex items-center justify-between text-left active-press"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
            <UserRound className="w-4 h-4 text-[#F15A24]" /> My drivers
          </p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            {(() => {
              const n = currentUser?.driverProfiles?.length || (currentUser?.driverProfile?.completed ? 1 : 0);
              return n === 0
                ? 'No drivers yet. Open to add drivers.'
                : `${n} driver${n === 1 ? '' : 's'} saved`;
            })()}
          </p>
        </div>
        <span className="text-[11px] font-extrabold text-[#F15A24] flex items-center gap-0.5">
          Open <ChevronRight className="w-4 h-4" />
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenMyTours}
        className="w-full p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card flex items-center justify-between text-left active-press"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F15A24]" /> My tour packages
          </p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            {myTours.length === 0
              ? 'No tours yet. Open to manage your posted packages.'
              : `${myTours.length} tour${myTours.length === 1 ? '' : 's'} posted`}
          </p>
        </div>
        <span className="text-[11px] font-extrabold text-[#F15A24] flex items-center gap-0.5">
          Open <ChevronRight className="w-4 h-4" />
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenBankDetails}
        className="w-full p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card flex items-center justify-between text-left active-press"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
            <Landmark className="w-4 h-4 text-[#F15A24]" /> Bank details
          </p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            {currentUser?.bankDetails?.completed
              ? `${currentUser.bankDetails.bankName} · •••• ${currentUser.bankDetails.accountNumber.slice(-4)}`
              : 'Add account, IFSC and optional UPI for payouts.'}
          </p>
        </div>
        <span className="text-[11px] font-extrabold text-[#F15A24] flex items-center gap-0.5">
          {currentUser?.bankDetails?.completed ? 'Edit' : 'Add'} <ChevronRight className="w-4 h-4" />
        </span>
      </button>

      <button
        type="button"
        onClick={onOpenMyBookings}
        className="w-full p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card flex items-center justify-between text-left active-press"
      >
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-[#F15A24]" /> My bookings
          </p>
          <p className="text-[11px] text-[#6B6B6B] mt-1">
            {myBookings.length === 0
              ? 'No bookings yet. Open to view chat and Ride Bhai deals.'
              : `${myBookings.length} booking${myBookings.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <span className="text-[11px] font-extrabold text-[#F15A24] flex items-center gap-0.5">
          Open <ChevronRight className="w-4 h-4" />
        </span>
      </button>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-2">
        <div className="w-full p-3 rounded-2xl bg-[#FAF6EE] text-xs font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F15A24]" /> Profile KYC
          </span>
          <span className="text-[10px] font-extrabold uppercase text-[#F15A24]">{statusLabel}</span>
        </div>
        <button
          onClick={onOpenPackages}
          className="w-full p-3 rounded-2xl bg-[#FAF6EE] text-xs font-bold flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F15A24]" /> Posting plans
          </span>
          <span className="text-[10px] font-extrabold text-emerald-600">Open Plans tab</span>
        </button>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-2">
        <button
          onClick={() => {
            logoutUser();
            onLogout?.();
          }}
          className="w-full p-3 rounded-2xl bg-[#FAF6EE] text-xs font-bold flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </div>
    </div>
  );
};
