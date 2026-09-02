import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  User,
  Phone,
  Mail,
  MapPin,
  Star,
  Car,
  ShieldAlert,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';

interface RiderProfileViewProps {
  onSwitchRole: (role: UserRole) => void;
}

export const RiderProfileView: React.FC<RiderProfileViewProps> = ({ onSwitchRole }) => {
  const { currentRider, updateRiderProfile, resetDemoData } = useAppStore();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);

  const handleSimulateIdUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      updateRiderProfile({ idVerified: true });
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card text-center relative overflow-hidden">
        <div className="relative inline-block mx-auto mb-3">
          <img
            src={currentRider.avatar}
            alt={currentRider.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[#F15A24]/20 mx-auto"
          />
          {currentRider.idVerified && (
            <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#2E9E5B] border-2 border-white flex items-center justify-center text-white text-xs font-bold">
              ✓
            </span>
          )}
        </div>

        <h3 className="font-display font-extrabold text-lg text-[#1C1C1C]">
          {currentRider.name}
        </h3>
        <p className="text-xs text-[#6B6B6B]">{currentRider.city} • Member since {currentRider.memberSince}</p>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#F2ECE1]">
          <div className="bg-[#FAF6EE] p-2 rounded-2xl">
            <span className="flex items-center justify-center text-amber-500 font-extrabold text-sm">
              <Star className="w-4 h-4 fill-amber-500 mr-1" />
              {currentRider.rating}
            </span>
            <span className="text-[10px] text-[#6B6B6B] font-bold">Rider Rating</span>
          </div>

          <div className="bg-[#FAF6EE] p-2 rounded-2xl">
            <span className="font-extrabold text-sm text-[#F15A24]">
              {currentRider.totalRides}
            </span>
            <span className="text-[10px] text-[#6B6B6B] font-bold block">Trips Taken</span>
          </div>
        </div>
      </div>

      {/* Govt ID Verification Sandbox */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2E9E5B]" />
            <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
              Identity Verification
            </h4>
          </div>
          {currentRider.idVerified ? (
            <span className="text-[10px] font-bold text-[#2E9E5B] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#B8E6CB]">
              Verified
            </span>
          ) : (
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
              Pending
            </span>
          )}
        </div>

        {currentRider.idVerified ? (
          <div className="p-3 bg-[#EBF7F0] rounded-2xl border border-[#B8E6CB] text-xs text-[#2E9E5B] font-medium flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>Govt Aadhaar / Passport verified. You get faster booking confirmations!</span>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-[#6B6B6B]">
              Upload any Aadhaar/Govt ID card image to get a verified green tick.
            </p>
            <button
              onClick={handleSimulateIdUpload}
              disabled={isUploading}
              className="w-full py-2.5 rounded-xl brand-gradient text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active-press disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Verifying document...' : 'Upload Govt ID (Simulate)'}</span>
            </button>
            {showUploadSuccess && (
              <p className="text-[11px] text-[#2E9E5B] text-center font-bold animate-fade-in">
                ✅ ID verified successfully!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Account Info Details */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs space-y-3 text-xs">
        <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
          Contact & Safety Info
        </h4>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-1 border-b border-[#F4EFE6]">
            <span className="text-[#6B6B6B] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" /> Mobile
            </span>
            <span className="font-semibold text-[#1C1C1C]">{currentRider.phone}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#F4EFE6]">
            <span className="text-[#6B6B6B] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Email
            </span>
            <span className="font-semibold text-[#1C1C1C]">{currentRider.email}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-[#6B6B6B] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Home City
            </span>
            <span className="font-semibold text-[#1C1C1C]">{currentRider.city}</span>
          </div>
        </div>
      </div>

      {/* Role Switcher Sandbox Cards */}
      <div className="bg-white rounded-3xl p-4 border border-[#EBE5D8] shadow-xs space-y-3">
        <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
          Switch Account Mode
        </h4>

        <button
          onClick={() => onSwitchRole('partner')}
          className="w-full p-3.5 bg-[#FAF6EE] border border-[#EBE5D8] hover:border-[#F15A24] rounded-2xl text-left active-press transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFF0EB] flex items-center justify-center text-[#F15A24]">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C1C1C]">Switch to Partner</p>
              <p className="text-[10px] text-[#6B6B6B]">Post cars and tour packages from one login</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#F15A24]">Switch →</span>
        </button>

        <div className="pt-2 border-t border-[#F2ECE1]">
          <button
            onClick={() => {
              if (confirm('Reset all demo state to fresh pristine mock data?')) {
                resetDemoData();
                window.location.reload();
              }
            }}
            className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50 text-[#D64545] font-bold text-xs flex items-center justify-center gap-1.5 active-press"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
