import React, { useState } from 'react';
import { Building2, MapPin, Star, IndianRupee, PlayCircle, Navigation, Share2, MapPinned } from 'lucide-react';
import type { HotelListing } from '../../types';
import { ContactActions } from './ContactActions';
import { ratingLabel } from '../common/RateStars';
import { useAppStore } from '../../store/useAppStore';
import { shareHotelListing } from '../../lib/share';

interface HotelDetailsViewProps {
  hotel: HotelListing;
  onNeedLogin?: () => void;
}

export const HotelDetailsView: React.FC<HotelDetailsViewProps> = ({ hotel, onNeedLogin }) => {
  const { isLoggedIn } = useAppStore();
  const [activeImage, setActiveImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const images = hotel.images.length ? hotel.images : [];

  return (
    <div className="space-y-3 pb-2 animate-fade-in">
      <div className="rounded-3xl overflow-hidden bg-[#1C1C1C]">
        <div className="relative w-full h-52 bg-[#2A2A2A]">
          {showVideo && hotel.videoUrl ? (
            <video src={hotel.videoUrl} controls autoPlay className="w-full h-full object-cover bg-black" />
          ) : images[activeImage] ? (
            <img src={images[activeImage]} alt={hotel.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-white/30" />
            </div>
          )}

          {hotel.videoUrl && !showVideo && (
            <button
              type="button"
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/25 active-press"
              aria-label="Play hotel video"
            >
              <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <PlayCircle className="w-7 h-7 text-[#1C1C1C]" />
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => shareHotelListing(hotel)}
            className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/15 hover:bg-[#25D366] text-white transition-all flex items-center justify-center active-press"
            title="Share hotel"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {(images.length > 1 || (hotel.videoUrl && images.length > 0)) && (
          <div className="flex gap-1.5 p-2 overflow-x-auto no-scrollbar bg-black/30">
            {images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => {
                  setShowVideo(false);
                  setActiveImage(i);
                }}
                className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 ${
                  !showVideo && activeImage === i ? 'border-[#F15A24]' : 'border-transparent opacity-70'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
            {hotel.videoUrl && (
              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className={`shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 bg-[#1C1C1C] flex items-center justify-center ${
                  showVideo ? 'border-[#F15A24]' : 'border-transparent opacity-70'
                }`}
              >
                <PlayCircle className="w-5 h-5 text-white" />
              </button>
            )}
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-base font-extrabold text-[#1C1C1C] leading-snug">{hotel.title}</h2>
          {hotel.starCategory ? (
            <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#1C1C1C] text-white text-[10px] font-extrabold whitespace-nowrap">
              {hotel.starCategory}★ Hotel
            </span>
          ) : null}
        </div>
        <p className="text-[11px] text-[#6B6B6B] font-bold flex items-center gap-1 mt-1">
          <MapPin className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
          {[hotel.address, hotel.city, hotel.state].filter(Boolean).join(', ')}
        </p>
        <div className="flex items-center flex-wrap gap-2 mt-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF9F0] border border-[#FCE7C2] text-[11px] font-extrabold text-[#8A6A1C]">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {ratingLabel(hotel.rating, hotel.ratingCount)}
            {hotel.ratingCount > 0 ? ' reviews' : ''}
          </span>
          {hotel.mapUrl && (
            <a
              href={hotel.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF7F0] border border-[#B8E6CB] text-[11px] font-extrabold text-[#1B6B3A] active-press"
            >
              <MapPinned className="w-3.5 h-3.5" />
              View on Map
            </a>
          )}
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-[#FFF0EB] border border-[#FFD8CB] flex items-center justify-between">
        <div>
          <p className="text-[9px] font-extrabold uppercase tracking-wide text-[#F15A24]">Price per night</p>
          <p className="text-base font-extrabold text-[#1C1C1C] flex items-center mt-0.5">
            <IndianRupee className="w-4 h-4" />
            {hotel.priceLow.toLocaleString('en-IN')}
            {hotel.priceHigh > hotel.priceLow ? ` – ${hotel.priceHigh.toLocaleString('en-IN')}` : ''}
          </p>
        </div>
      </div>

      {hotel.description && (
        <div className="p-3 rounded-2xl bg-white border border-[#EBE5D8]">
          <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B] mb-1">About this hotel</p>
          <p className="text-xs text-[#1C1C1C] leading-relaxed whitespace-pre-line">{hotel.description}</p>
        </div>
      )}

      {hotel.nearbyPlaces.length > 0 && (
        <div className="p-3 rounded-2xl bg-white border border-[#EBE5D8]">
          <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B] mb-2">Nearby places</p>
          <div className="space-y-2">
            {hotel.nearbyPlaces.map((place, i) => (
              <div key={place.name + i} className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5 min-w-0">
                  <Navigation className="w-3.5 h-3.5 text-[#F15A24] shrink-0" />
                  <span className="truncate">{place.name}</span>
                </span>
                <span className="text-[11px] font-extrabold text-[#6B6B6B] shrink-0">{place.distance}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sticky bottom-0 -mx-4 px-4 pt-3 pb-1 bg-[#FAF6EE]">
        <ContactActions
          phone={hotel.phone}
          whatsapp={hotel.whatsappNumber}
          message={`Hi! I'd like to know more about ${hotel.title} on Ride Bhai.`}
          locked={!isLoggedIn}
          lockTitle="Login required"
          lockReason="Login to call or WhatsApp this hotel."
          onLockedClick={onNeedLogin}
        />
      </div>
    </div>
  );
};
