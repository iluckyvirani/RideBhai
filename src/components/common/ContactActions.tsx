import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export function toWhatsAppNumber(phone: string) {
  const digits = (phone || '').replace(/[^0-9]/g, '');
  if (digits.length >= 12 && digits.startsWith('91')) return digits;
  return `91${digits.slice(-10)}`;
}

interface ContactActionsProps {
  phone: string;
  whatsapp?: string;
  message?: string;
  onCall?: () => void;
  onWhatsApp?: () => void;
  compact?: boolean;
}

export const ContactActions: React.FC<ContactActionsProps> = ({
  phone,
  whatsapp,
  message,
  onCall,
  onWhatsApp,
  compact,
}) => {
  const wa = toWhatsAppNumber(whatsapp || phone);
  const text = encodeURIComponent(message || 'Hi, I saw your listing on Ride Bhai and want to book.');

  return (
    <div className={`flex ${compact ? 'gap-2' : 'gap-2.5'}`}>
      <a
        href={`tel:${phone}`}
        onClick={onCall}
        className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-[#1C1C1C] text-white font-extrabold active-press ${
          compact ? 'py-2 text-[11px]' : 'py-3 text-xs'
        }`}
      >
        <Phone className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        Call
      </a>
      <a
        href={`https://wa.me/${wa}?text=${text}`}
        target="_blank"
        rel="noreferrer"
        onClick={onWhatsApp}
        className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl bg-[#25D366] text-white font-extrabold active-press ${
          compact ? 'py-2 text-[11px]' : 'py-3 text-xs'
        }`}
      >
        <MessageCircle className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        WhatsApp
      </a>
    </div>
  );
};
