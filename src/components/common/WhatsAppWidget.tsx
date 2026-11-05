import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export const WhatsAppWidget: React.FC = () => {
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);
  const number = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
  const message = settings.whatsappMessage || 'Hi Ride Bhai! I need help with booking a car or tour.';

  if (!number) return null;

  const openChat = () => {
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] pointer-events-none">
      <div className="max-w-[430px] mx-auto px-4 pb-24 flex flex-col items-end gap-2.5">
        {open && (
          <button
            type="button"
            onClick={openChat}
            className="pointer-events-auto max-w-[230px] text-left bg-white rounded-2xl rounded-br-sm shadow-2xl border border-[#EBE5D8] p-3 pr-2.5 flex items-start gap-2.5 animate-scale-in active-press"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#25D366]">Ride Bhai Support</p>
              <p className="text-[12px] text-[#1C1C1C] font-semibold mt-0.5 leading-snug">{message}</p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#25D366]">
                <Send className="w-3 h-3" /> Chat on WhatsApp
              </span>
            </div>
            <span
              role="button"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
              }}
              className="w-5 h-5 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#9E9E9E] shrink-0"
            >
              <X className="w-3 h-3" />
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Chat on WhatsApp"
          className="pointer-events-auto relative w-16 h-16 shrink-0 active-press"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ring-pulse" />
          <img
            src="/whatsapp-support-badge.png"
            alt="Chat on WhatsApp — 24x7 customer support"
            className="relative w-full h-full object-contain drop-shadow-xl"
          />
          {open && (
            <span className="absolute inset-0 flex items-center justify-center bg-[#1C1C1C]/55 rounded-full">
              <X className="w-6 h-6 text-white" strokeWidth={2.5} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
