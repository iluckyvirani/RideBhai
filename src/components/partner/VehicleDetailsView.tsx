import React from 'react';
import { Car, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { Vehicle } from '../../types';
import { isPreviewableImage } from '../../lib/upload';

export const VehicleDetailsView: React.FC<{
  car: Vehicle;
  onBack: () => void;
}> = ({ car, onBack }) => {
  const status = car.verificationStatus || 'pending_verification';
  const specs = [
    ['Number plate', car.plate],
    ['Make', car.make],
    ['Model', car.model],
    ['Year', car.year ? String(car.year) : '—'],
    ['Color', car.color || '—'],
    ['Seats', car.seats ? String(car.seats) : '—'],
    ['Fuel', car.fuelType || '—'],
    ['RC number', car.rcNumber || '—'],
  ];

  return (
    <div className="space-y-3">
      <button type="button" onClick={onBack} className="text-xs font-extrabold text-[#F15A24]">
        ← My cars
      </button>

      <div className="rounded-3xl bg-[#FAF6EE] border border-[#EBE5D8] p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#F15A24] flex items-center gap-1">
              <Car className="w-3.5 h-3.5" /> Vehicle details
            </p>
            <h2 className="text-base font-black text-[#1C1C1C] mt-1">
              {car.make} {car.model}
            </h2>
            <p className="font-mono text-[11px] font-extrabold text-[#6B6B6B]">{car.plate}</p>
          </div>
          {status === 'verified' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-[#EBF7EE] text-[#00A86B] border border-[#BDE8C7]">
              <CheckCircle2 className="w-3 h-3" /> Verified
            </span>
          ) : status === 'rejected' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-red-50 text-red-600 border border-red-200">
              <XCircle className="w-3 h-3" /> Rejected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3" /> Pending verification
            </span>
          )}
        </div>

        {status === 'pending_verification' && (
          <p className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl p-2.5">
            Ride Bhai is reviewing this vehicle and RC. You will see Verified here after admin approval.
          </p>
        )}
        {status === 'rejected' && (
          <p className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl p-2.5">
            {car.rejectionReason || 'This vehicle was rejected. Update documents and contact Ride Bhai.'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {specs.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white border border-[#EBE5D8] p-2.5">
            <p className="text-[10px] font-extrabold uppercase text-[#8A8478]">{label}</p>
            <p className="text-xs font-extrabold text-[#1C1C1C] mt-0.5 break-words">{value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">Documents</p>
        {car.rcDocument && isPreviewableImage(car.rcDocument) && (
          <div>
            <p className="text-[10px] font-extrabold text-[#8A8478] mb-1">RC</p>
            <img src={car.rcDocument} alt="RC" className="w-full max-h-56 object-contain rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]" />
          </div>
        )}
        {car.insuranceDocument && isPreviewableImage(car.insuranceDocument) && (
          <div>
            <p className="text-[10px] font-extrabold text-[#8A8478] mb-1">Insurance</p>
            <img
              src={car.insuranceDocument}
              alt="Insurance"
              className="w-full max-h-56 object-contain rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]"
            />
          </div>
        )}
        {!car.rcDocument && !car.insuranceDocument && (
          <p className="text-[11px] text-[#6B6B6B]">No documents attached.</p>
        )}
      </div>
    </div>
  );
};
