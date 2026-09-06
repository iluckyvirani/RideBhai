import React from 'react';
import { Car, Sparkles, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface CreateListingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCar: () => void;
  onPostTour: () => void;
  onOpenDriverSetup?: () => void;
  onOpenProfile?: () => void;
}

export const CreateListingSheet: React.FC<CreateListingSheetProps> = ({
  isOpen,
  onClose,
  onPostCar,
  onPostTour,
  onOpenDriverSetup,
  onOpenProfile,
}) => {
  const { canPostCar, canPostTour } = useAppStore();
  if (!isOpen) return null;

  const carGate = canPostCar();
  const tourGate = canPostTour();

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/55 px-4 pb-16"
      onClick={onClose}
    >
      <div
        className="w-full bg-white rounded-3xl p-5 space-y-3 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#1C1C1C]">Create listing</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF6EE] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-[#6B6B6B]">
          Choose what to post. Needs a verified profile and an active plan.
        </p>

        <button
          type="button"
          disabled={!carGate.ok}
          onClick={() => {
            if (!carGate.ok) return;
            onClose();
            onPostCar();
          }}
          className={`w-full p-4 rounded-2xl border flex items-center gap-3 text-left ${
            carGate.ok
              ? 'bg-[#FAF6EE] border-[#EBE5D8] active-press'
              : 'bg-[#F3F3F3] border-[#E5E5E5] opacity-70 cursor-not-allowed'
          }`}
        >
          <span className="w-10 h-10 rounded-2xl bg-[#1C1C1C] text-white flex items-center justify-center flex-shrink-0">
            <Car className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-xs font-extrabold text-[#1C1C1C]">Post car</span>
            <span className="block text-[11px] text-[#6B6B6B]">
              {carGate.ok
                ? 'Full-car hire for all India or a route'
                : carGate.code === 'pending_driver' || carGate.code === 'pending_vehicle'
                  ? 'Disabled until driver and vehicle are verified'
                  : 'Disabled until driver + vehicle are added'}
            </span>
          </span>
        </button>

        {!carGate.ok && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <p className="text-[11px] font-bold text-amber-900">{carGate.reason}</p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenDriverSetup?.();
              }}
              className="w-full py-2.5 rounded-xl brand-gradient text-white text-xs font-extrabold"
            >
              {carGate.code === 'no_vehicle' || carGate.code === 'pending_vehicle'
                ? 'Open My cars'
                : 'Open My drivers'}
            </button>
          </div>
        )}

        <button
          type="button"
          disabled={!tourGate.ok}
          onClick={() => {
            if (!tourGate.ok) return;
            onClose();
            onPostTour();
          }}
          className={`w-full p-4 rounded-2xl border flex items-center gap-3 text-left ${
            tourGate.ok
              ? 'bg-[#FAF6EE] border-[#EBE5D8] active-press'
              : 'bg-[#F3F3F3] border-[#E5E5E5] opacity-70 cursor-not-allowed'
          }`}
        >
          <span className="w-10 h-10 rounded-2xl brand-gradient text-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </span>
          <span>
            <span className="block text-xs font-extrabold text-[#1C1C1C]">Post tour</span>
            <span className="block text-[11px] text-[#6B6B6B]">
              {tourGate.ok
                ? 'Package with price and desired car'
                : tourGate.code === 'no_agency'
                  ? 'Disabled until travel agency name is added'
                  : 'Needs verified KYC and an active plan'}
            </span>
          </span>
        </button>

        {!tourGate.ok && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
            <p className="text-[11px] font-bold text-amber-900">{tourGate.reason}</p>
            {tourGate.code === 'no_agency' && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenProfile?.();
                }}
                className="w-full py-2.5 rounded-xl brand-gradient text-white text-xs font-extrabold"
              >
                Add agency name
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
