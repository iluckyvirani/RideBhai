import React, { useState } from 'react';
import {
  Car,
  Star,
  ShieldCheck,
  Phone,
  Mail,
  User,
  Edit2,
  Check,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';

interface DriverProfileViewProps {
  onSwitchRole: (role: UserRole) => void;
  onOpenVerification: () => void;
}

export const DriverProfileView: React.FC<DriverProfileViewProps> = ({
  onSwitchRole,
  onOpenVerification,
}) => {
  const { currentDriver, isDriverBoosted, resetDemoData } = useAppStore();
  const isBoosted = isDriverBoosted(currentDriver.id);

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card text-center relative overflow-hidden">
        <div className="relative inline-block mx-auto mb-3">
          <img
            src={currentDriver.avatar}
            alt={currentDriver.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#F15A24]/20 mx-auto"
          />
          {currentDriver.idVerified && (
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#2E9E5B] border-2 border-white flex items-center justify-center text-white text-xs font-bold">
              ✓
            </span>
          )}
        </div>

        <h3 className="font-display font-extrabold text-lg text-[#1C1C1C]">
          {currentDriver.name}
        </h3>
        <p className="text-xs text-[#6B6B6B]">
          {currentDriver.city} • Driver since {currentDriver.memberSince}
        </p>

        {isBoosted && (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-white brand-gradient px-3 py-0.5 rounded-full shadow-xs">
            <Award className="w-3 h-3 text-amber-200" />
            <span>Featured Boost Active</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#F2ECE1]">
          <div className="bg-[#FAF6EE] p-2 rounded-2xl">
            <span className="flex items-center justify-center text-amber-500 font-extrabold text-sm">
              <Star className="w-4 h-4 fill-amber-500 mr-1" />
              {currentDriver.rating}
            </span>
            <span className="text-[10px] text-[#6B6B6B] font-bold">
              Rating ({currentDriver.totalReviews} reviews)
            </span>
          </div>

          <div className="bg-[#FAF6EE] p-2 rounded-2xl">
            <span className="font-extrabold text-sm text-[#F15A24]">
              {currentDriver.totalRides}
            </span>
            <span className="text-[10px] text-[#6B6B6B] font-bold block">Rides Completed</span>
          </div>
        </div>
      </div>

      {/* Vehicle Specs Card */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#F15A24]" />
            <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
              Registered Vehicle
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-[#F15A24] bg-[#FFF0EB] px-2 py-0.5 rounded-lg border border-[#FFD8CB]">
            {currentDriver.vehicle?.plate || 'DL 01 AB 8844'}
          </span>
        </div>

        <div className="p-3 bg-[#FAF6EE] rounded-2xl border border-[#EBE5D8] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Car Model:</span>
            <span className="font-bold text-[#1C1C1C]">
              {currentDriver.vehicle?.make || 'Maruti Suzuki'} {currentDriver.vehicle?.model || 'Dzire ZXi'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Year & Color:</span>
            <span className="font-semibold text-[#1C1C1C]">
              {currentDriver.vehicle?.year || 2023} • {currentDriver.vehicle?.color || 'White'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B6B6B]">Passenger Capacity:</span>
            <span className="font-semibold text-[#1C1C1C]">
              {currentDriver.vehicle?.seats || 4} Seats
            </span>
          </div>
        </div>
      </div>

      {/* Verification Status Shortcut */}
      <div
        onClick={onOpenVerification}
        className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs flex items-center justify-between cursor-pointer active-press hover:border-[#F15A24]"
      >
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#2E9E5B]" />
          <div>
            <h4 className="text-xs font-bold text-[#1C1C1C]">KYC & Document Verification</h4>
            <p className="text-[10px] text-[#6B6B6B]">Driving License, RC & Aadhaar records</p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#2E9E5B] bg-[#EBF7F0] px-2.5 py-1 rounded-full">
          {currentDriver.status.toUpperCase()}
        </span>
      </div>

      {/* Role Switcher */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs space-y-2.5">
        <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
          Switch Account Mode
        </h4>
        <button
          onClick={() => onSwitchRole('rider')}
          className="w-full p-3.5 bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl text-left active-press hover:border-[#F15A24] flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#F15A24]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C1C1C]">Switch to Rider View</p>
              <p className="text-[10px] text-[#6B6B6B]">Search and book carpool seats as traveler</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#F15A24]">Switch →</span>
        </button>
      </div>
    </div>
  );
};
