import React, { useState } from 'react';
import { Phone, MessageCircle, Lock, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

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
  locked?: boolean;
  lockReason?: string;
  onLockedClick?: () => void;
}

export const ContactActions: React.FC<ContactActionsProps> = ({
  phone,
  whatsapp,
  message,
  onCall,
  onWhatsApp,
  compact,
  locked,
  lockReason,
  onLockedClick,
}) => {
  const wa = toWhatsAppNumber(whatsapp || phone);
  const text = encodeURIComponent(message || 'Hi, I saw your listing on Ride Bhai and want to book.');

  if (locked) {
    return (
      <button
        type="button"
        onClick={onLockedClick}
        className="w-full text-left p-3 rounded-2xl bg-[#FFF0EB] border border-[#FFD8CB] space-y-1"
      >
        <p className="text-[11px] font-extrabold text-[#8A2B09] flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> Booking locked
        </p>
        <p className="text-[11px] text-[#A33B12] leading-relaxed">
          {lockReason || 'Verified profile and an active plan are required to chat.'}
        </p>
      </button>
    );
  }

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

interface BookContactActionsProps extends Omit<ContactActionsProps, 'locked' | 'lockReason'> {
  onNeedUnlock?: (code?: 'incomplete' | 'unverified' | 'no_package') => void;
}

export const BookContactActions: React.FC<BookContactActionsProps> = ({
  onNeedUnlock,
  onCall,
  onWhatsApp,
  ...rest
}) => {
  const { canBook } = useAppStore();
  const gate = canBook();
  return (
    <ContactActions
      {...rest}
      locked={!gate.allowed}
      lockReason={gate.reason}
      onCall={gate.allowed ? onCall : undefined}
      onWhatsApp={gate.allowed ? onWhatsApp : undefined}
      onLockedClick={() => onNeedUnlock?.(gate.code)}
    />
  );
};

interface DealChoiceActionsProps {
  phone: string;
  whatsapp?: string;
  message?: string;
  onDirect?: () => void | Promise<unknown>;
  onRideBhai?: () => void | Promise<unknown>;
  onNeedUnlock?: (code?: 'incomplete' | 'unverified' | 'no_package') => void;
}

export const DealChoiceActions: React.FC<DealChoiceActionsProps> = ({
  onDirect,
  onRideBhai,
  onNeedUnlock,
}) => {
  const { canBook } = useAppStore();
  const gate = canBook();
  const locked = !gate.allowed;
  const [busy, setBusy] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const run = async (fn?: () => void | Promise<unknown>, asInquiry = false) => {
    if (locked) {
      onNeedUnlock?.(gate.code);
      return;
    }
    setBusy(true);
    try {
      await fn?.();
      if (asInquiry) setInquirySent(true);
    } catch (err: any) {
      window.alert(err?.message || 'Could not start this deal.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => (locked ? onNeedUnlock?.(gate.code) : run(onDirect))}
          className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl text-white font-extrabold text-[11px] ${
            locked ? 'bg-[#F15A24]/35 cursor-not-allowed' : 'bg-[#F15A24] active-press'
          }`}
        >
          {locked ? <Lock className="w-3.5 h-3.5" /> : <MessageCircle className="w-4 h-4" />}
          Message direct
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => (locked ? onNeedUnlock?.(gate.code) : run(onRideBhai, true))}
          className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl text-white font-extrabold text-[11px] ${
            locked ? 'bg-[#1C1C1C]/35 cursor-not-allowed' : 'bg-[#1C1C1C] active-press'
          }`}
        >
          {locked ? <Lock className="w-3.5 h-3.5" /> : <span className="text-[10px] font-black tracking-wide text-[#FF7A45]">RB</span>}
          Deal with Ride Bhai
        </button>
      </div>
      {inquirySent && (
        <p className="text-[11px] font-extrabold text-[#1B6B3A] bg-[#E8F6EE] border border-[#B8E0C6] rounded-2xl p-2.5 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          Your inquiry has been sent. A Ride Bhai chat is in Chat.
        </p>
      )}
      {locked && (
        <p className="text-[11px] font-bold text-[#8A2B09] bg-[#FFF0EB] border border-[#FFD8CB] rounded-2xl p-2.5">
          {gate.reason || 'Verified profile and an active plan are required to message.'}
        </p>
      )}
    </div>
  );
};
