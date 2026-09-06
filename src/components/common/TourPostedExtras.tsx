import React from 'react';
import { AgencyTripPost } from '../../types';

const EXTRA_FIELDS: { label: string; value: (tour: AgencyTripPost) => string }[] = [
  {
    label: 'Sightseeing Highlights',
    value: (tour) => (tour.routeHighlights || []).filter(Boolean).join(', '),
  },
  { label: 'Tour Category', value: (tour) => tour.tourType || '' },
  { label: 'Tolls & Border Tax Rule', value: (tour) => tour.tollTaxOption || '' },
  { label: 'Km Limit / Package Kms', value: (tour) => tour.kmLimit || '' },
  { label: 'Driver Night Allowance / Stay', value: (tour) => tour.driverNightAllowance || '' },
  { label: 'Luggage Capacity', value: (tour) => tour.luggageCapacity || '' },
  { label: 'Driver Preferences / Rules', value: (tour) => tour.driverPreferences || '' },
  { label: 'Payment Payout Mode', value: (tour) => tour.payoutMode || '' },
  { label: 'Payment Terms', value: (tour) => tour.paymentTerms || '' },
  { label: 'Full Travel Details & Itinerary', value: (tour) => tour.tripDetails || '' },
];

export function tourHasPostedExtras(tour: AgencyTripPost) {
  return EXTRA_FIELDS.some((field) => field.value(tour).trim());
}

export const TourPostedExtras: React.FC<{
  tour: AgencyTripPost;
  showEmpty?: boolean;
}> = ({ tour, showEmpty = false }) => {
  const rows = EXTRA_FIELDS.filter((field) => showEmpty || field.value(tour).trim());
  if (rows.length === 0) return null;

  return (
    <div className="space-y-2">
      {rows.map((field) => {
        const value = field.value(tour).trim();
        return (
          <div key={field.label} className="p-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8]">
            <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#6B6B6B]">
              {field.label}
            </p>
            <p className="text-xs font-bold text-[#1C1C1C] mt-0.5 whitespace-pre-line">
              {value || '—'}
            </p>
          </div>
        );
      })}
    </div>
  );
};
