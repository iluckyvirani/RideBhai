import React, { useState } from 'react';
import { UserRole } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { User, Car, ShieldAlert, Sparkles, RefreshCw, ZapOff, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface RoleSwitcherBarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({ currentRole, onRoleChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isDriverBoosted,
    simulatePackageExpiry,
    simulateDriverStatusChange,
    resetDemoData,
    currentDriver,
  } = useAppStore();

  const isBoosted = isDriverBoosted(currentDriver.id);

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-[390px] transition-all">
      <div className="bg-[#1C1C1C]/90 backdrop-blur-md text-white rounded-2xl shadow-xl border border-white/10 overflow-hidden">
        {/* Compact Bar */}
        <div className="px-3 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onRoleChange('rider')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                currentRole === 'rider'
                  ? 'bg-[#F15A24] text-white shadow-sm font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Rider</span>
            </button>

            <button
              onClick={() => onRoleChange('driver')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                currentRole === 'driver'
                  ? 'bg-[#F15A24] text-white shadow-sm font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Car className="w-3 h-3" />
              <span>Driver</span>
            </button>

            <button
              onClick={() => onRoleChange('admin')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                currentRole === 'admin'
                  ? 'bg-amber-600 text-white shadow-sm font-bold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[10px] text-amber-300 font-semibold px-2 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 active-press"
          >
            <span>Demo Tools</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Expanded Demo Controls Drawer */}
        {isExpanded && (
          <div className="p-3 bg-black/40 border-t border-white/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-gray-300">
                Driver Boost Status:
              </span>
              {isBoosted ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> ACTIVE BOOST
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">
                  REGULAR (UNBOOSTED)
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => {
                  simulatePackageExpiry(currentDriver.id);
                  alert('⚡ Package expired! Your driver rides have instantly reverted to Regular ranking.');
                }}
                className="py-1.5 px-2 bg-red-900/40 hover:bg-red-900/60 border border-red-500/30 rounded-xl text-[10px] font-bold text-red-200 flex items-center justify-center gap-1"
              >
                <ZapOff className="w-3 h-3" />
                <span>Expire My Boost</span>
              </button>

              <button
                onClick={() => {
                  simulateDriverStatusChange(currentDriver.id, 'verified');
                  alert('✅ Driver account verified! You can now post rides.');
                }}
                className="py-1.5 px-2 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-xl text-[10px] font-bold text-emerald-200 flex items-center justify-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                <span>Verify My Driver</span>
              </button>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Want fresh demo state?</span>
              <button
                onClick={() => {
                  if (confirm('Reset all demo data back to default state?')) {
                    resetDemoData();
                    window.location.reload();
                  }
                }}
                className="text-[10px] font-bold text-orange-300 hover:text-orange-200 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Reset Demo Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
