import React from 'react';
import { Building, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole } from '../../types';
import { PartnerCarsView } from './PartnerCarsView';
import { PartnerToursView } from './PartnerToursView';
import { MyBookingsPreview } from '../common/MyBookingsPreview';

interface PartnerProfileViewProps {
  onSwitchRole: (role: UserRole) => void;
  onOpenVerification: () => void;
  onOpenPackages: () => void;
  onOpenBookings: () => void;
}

export const PartnerProfileView: React.FC<PartnerProfileViewProps> = ({
  onSwitchRole,
  onOpenVerification,
  onOpenPackages,
  onOpenBookings,
}) => {
  const { currentDriver, currentAgency, resetDemoData, logoutPartner } = useAppStore();

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      <div className="p-5 rounded-3xl bg-white border border-[#EBE5D8] shadow-card space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center text-white font-black text-xl">
            {(currentAgency.agencyName || currentDriver.name).charAt(0)}
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-[#1C1C1C]">
              {currentAgency.agencyName || currentDriver.name}
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              {currentDriver.name} · {currentDriver.phone}
            </p>
            <p className="text-[11px] text-[#6B6B6B]">{currentAgency.city || currentDriver.city}</p>
          </div>
        </div>
        <p className="text-[11px] text-[#6B6B6B] leading-relaxed">
          One partner login for cars and tour packages. Customers Call / WhatsApp you. You can also Call / WhatsApp other partners’ cars and tours.
        </p>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card">
        <PartnerCarsView />
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card">
        <PartnerToursView />
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card">
        <MyBookingsPreview mode="partner" onShowAll={onOpenBookings} />
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-2">
        <button
          onClick={onOpenVerification}
          className="w-full p-3 rounded-2xl bg-[#FAF6EE] text-xs font-bold flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F15A24]" /> KYC verification
          </span>
          <span className="text-[10px] font-extrabold uppercase text-[#F15A24]">{currentDriver.status}</span>
        </button>
        <button
          onClick={onOpenPackages}
          className="w-full p-3 rounded-2xl bg-[#FAF6EE] text-xs font-bold flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F15A24]" /> Posting packages (in-app pay)
          </span>
          <span className="text-[10px] font-extrabold text-emerald-600">Open Plans tab</span>
        </button>
      </div>

      <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider">Switch mode</h3>
        <button
          onClick={() => onSwitchRole('rider')}
          className="w-full p-3 rounded-2xl bg-[#FAF6EE] text-xs font-bold flex items-center gap-2"
        >
          <Building className="w-4 h-4" /> Customer / rider
        </button>
        <button
          onClick={() => {
            if (confirm('Reset all demo data and reload a fresh seed?')) {
              logoutPartner();
              resetDemoData();
            }
          }}
          className="w-full p-3 rounded-2xl bg-[#FFF0EB] text-xs font-bold text-[#E8380D] flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Reset demo data
        </button>
      </div>
    </div>
  );
};
