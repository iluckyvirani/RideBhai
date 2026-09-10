import React from 'react';
import { Star, UserRound } from 'lucide-react';
import { isPreviewableImage } from '../../lib/upload';
import { ratingLabel } from './RateStars';

export function PosterCard({
  selfie,
  agencyName,
  personName,
  rating,
  ratingCount,
  compact = false,
}: {
  selfie?: string;
  agencyName?: string;
  personName?: string;
  rating?: number;
  ratingCount?: number;
  compact?: boolean;
}) {
  const name = agencyName || personName || 'Ride Bhai user';
  const label = ratingLabel(rating, ratingCount);
  const stars = Number(rating || 0);
  const count = Number(ratingCount || 0);

  return (
    <div
      className={`flex items-center gap-3 ${
        compact ? '' : 'p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]'
      }`}
    >
      {isPreviewableImage(selfie) ? (
        <img
          src={selfie}
          alt={name}
          className={`rounded-full object-cover border border-[#EBE5D8] shrink-0 ${
            compact ? 'w-8 h-8' : 'w-12 h-12'
          }`}
        />
      ) : (
        <div
          className={`rounded-full bg-white border border-[#EBE5D8] flex items-center justify-center text-[#F15A24] shrink-0 ${
            compact ? 'w-8 h-8' : 'w-12 h-12'
          }`}
        >
          <UserRound className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {agencyName && <p className="text-xs font-extrabold text-[#1C1C1C] truncate">{agencyName}</p>}
        {personName && personName !== agencyName && (
          <p className={`truncate ${agencyName ? 'text-[11px] text-[#6B6B6B]' : 'text-xs font-extrabold text-[#1C1C1C]'}`}>
            {personName}
          </p>
        )}
        {!agencyName && !personName && <p className="text-xs font-extrabold text-[#1C1C1C]">{name}</p>}
        <p className="text-[10px] font-extrabold text-amber-600 flex items-center gap-0.5 mt-0.5">
          <Star className={`fill-amber-400 text-amber-400 ${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
          {count ? `${stars.toFixed(1)}` : 'New'}
          {count ? <span className="text-[#8A8478] font-bold">({count})</span> : null}
          <span className="sr-only">{label}</span>
        </p>
      </div>
    </div>
  );
}
