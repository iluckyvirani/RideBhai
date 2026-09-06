import React from 'react';
import { MapPin, Calendar, Clock, Car, IndianRupee } from 'lucide-react';
import { AgencyTripPost } from '../../types';
import { DealChoiceActions } from './ContactActions';
import { TourPostedExtras } from './TourPostedExtras';

function formatStamp(date?: string, time?: string) {
  if (!date && !time) return '';
  const pretty = date ? date.split('-').reverse().join('/') : '';
  return [pretty, time].filter(Boolean).join(' · ');
}

interface TourDetailsViewProps {
  tour: AgencyTripPost;
  isOwn?: boolean;
  onNeedUnlock?: (code?: 'incomplete' | 'unverified' | 'no_package') => void;
  onDirect?: () => void | Promise<unknown>;
  onRideBhai?: () => void | Promise<unknown>;
}

export const TourDetailsView: React.FC<TourDetailsViewProps> = ({
  tour,
  isOwn,
  onNeedUnlock,
  onDirect,
  onRideBhai,
}) => {
  const carName = tour.desiredCar?.name || tour.requiredVehicleType;

  return (
    <div className="space-y-3 pb-2 animate-fade-in">
      <div className="p-4 rounded-3xl bg-[#1C1C1C] text-white">
        {tour.tourType ? (
          <p className="text-[10px] font-extrabold uppercase tracking-wide text-[#FF7A45]">
            {tour.tourType}
          </p>
        ) : null}
        <h2 className="text-base font-extrabold flex items-center gap-1.5 mt-0.5">
          <MapPin className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
          {tour.fromCity} {tour.tripSide === 'two_side' ? '⇄' : '→'} {tour.toCity}
        </h2>
        <p className="text-[11px] text-white/70 mt-1">
          {tour.agencyName}
          {tour.duration ? ` · ${tour.duration}` : ''}
          {tour.passengers ? ` · ${tour.passengers} pax` : ''}
          {` · ${tour.tripSide === 'two_side' ? 'Two side' : 'One side'}`}
        </p>
      </div>

      <div className="space-y-1 text-[11px] text-[#6B6B6B] px-1">
        {(tour.postedDate || tour.postedTime) && (
          <p className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Posted {formatStamp(tour.postedDate, tour.postedTime)}
          </p>
        )}
        {(tour.bookingDate || tour.startDate || tour.bookingTime || tour.pickupTime) && (
          <p className="flex items-center gap-1 font-bold text-[#1C1C1C]">
            <Calendar className="w-3 h-3 text-[#F15A24]" />
            Booking {formatStamp(tour.bookingDate || tour.startDate, tour.bookingTime || tour.pickupTime)}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        <div className="p-2.5 rounded-2xl bg-[#FFF0EB] border border-[#FFD8CB]">
          <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#F15A24]">Total tour</p>
          <p className="text-sm font-extrabold text-[#1C1C1C] flex items-center mt-0.5">
            <IndianRupee className="w-3.5 h-3.5" />
            {tour.totalCustomerPrice.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-2.5 rounded-2xl bg-white border border-[#EBE5D8]">
          <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#6B6B6B]">Agency cut</p>
          <p className="text-sm font-extrabold text-[#1C1C1C] flex items-center mt-0.5">
            <IndianRupee className="w-3.5 h-3.5" />
            {tour.agencyCommission.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#EBF7F0] border border-[#B8E6CB]">
          <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#2E9E5B]">Net to car</p>
          <p className="text-sm font-extrabold text-[#2E9E5B] flex items-center mt-0.5">
            <IndianRupee className="w-3.5 h-3.5" />
            {tour.driverNetPayout.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {carName && (
        <div className="p-3 rounded-2xl bg-white border border-[#EBE5D8]">
          <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
            <Car className="w-3 h-3" /> Required vehicle
          </p>
          <p className="text-xs font-extrabold text-[#1C1C1C] mt-0.5">{carName}</p>
          {tour.desiredCar?.specs?.length ? (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {tour.desiredCar.specs.filter(Boolean).map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-0.5 rounded-full bg-[#FAF6EE] border border-[#EBE5D8] text-[10px] font-bold"
                >
                  {spec}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {(tour.pickupLocation || tour.dropLocation) && (
        <div className="grid grid-cols-2 gap-2">
          {tour.pickupLocation ? (
            <div className="p-2.5 rounded-xl bg-white border border-[#EBE5D8]">
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#6B6B6B]">Pickup</p>
              <p className="text-xs font-bold text-[#1C1C1C] mt-0.5">{tour.pickupLocation}</p>
            </div>
          ) : null}
          {tour.dropLocation ? (
            <div className="p-2.5 rounded-xl bg-white border border-[#EBE5D8]">
              <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#6B6B6B]">Drop</p>
              <p className="text-xs font-bold text-[#1C1C1C] mt-0.5">{tour.dropLocation}</p>
            </div>
          ) : null}
        </div>
      )}

      <TourPostedExtras tour={tour} />

      <div className="sticky bottom-0 -mx-4 px-4 pt-3 pb-1 bg-[#FAF6EE]">
        {isOwn ? (
          <p className="text-[11px] font-extrabold text-center py-2.5 rounded-2xl bg-white border border-[#EBE5D8]">
            Your listing
          </p>
        ) : (
          <DealChoiceActions
            onNeedUnlock={onNeedUnlock}
            phone={tour.agencyPhone}
            whatsapp={tour.whatsappNumber}
            onDirect={onDirect}
            onRideBhai={onRideBhai}
          />
        )}
      </div>
    </div>
  );
};
