import React, { useEffect } from 'react';
import { X, MapPin, Zap } from 'lucide-react';
import { playTunTun } from '../../lib/sound';
import type { TourAlert } from '../../hooks/useNewTourAlerts';

interface NewTourAlertPopupProps {
  alert: TourAlert;
  onDismiss: () => void;
  onView: () => void;
}

const AUTO_DISMISS_MS = 6000;

export const NewTourAlertPopup: React.FC<NewTourAlertPopupProps> = ({ alert, onDismiss, onView }) => {
  useEffect(() => {
    playTunTun();
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert.id]);

  return (
    <div className="absolute top-3 left-3 right-3 z-[70] animate-slide-down-bounce">
      <div className="relative bg-white rounded-3xl shadow-2xl border-2 border-[#F15A24] overflow-hidden">
        <div className="relative p-3.5 flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FFF0EB] flex items-center justify-center flex-shrink-0 animate-ring-pulse">
            <Zap className="w-5 h-5 text-[#F15A24]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#F15A24]">
              New tour just posted
            </p>
            <h4 className="text-sm font-black text-[#1C1C1C] flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0" />
              <span className="truncate">
                {alert.fromCity} → {alert.toCity}
              </span>
            </h4>
            {alert.postedBy && (
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 truncate">by {alert.postedBy}</p>
            )}
            <button
              type="button"
              onClick={onView}
              className="mt-2 px-3 py-1.5 rounded-full brand-gradient text-white text-[11px] font-extrabold active-press"
            >
              View tour
            </button>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="w-7 h-7 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#6B6B6B] shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="h-1 bg-[#F15A24]/15">
          <div
            className="h-full bg-[#F15A24] animate-shrink-bar"
            style={{ animationDuration: `${AUTO_DISMISS_MS}ms` }}
          />
        </div>
      </div>
    </div>
  );
};
