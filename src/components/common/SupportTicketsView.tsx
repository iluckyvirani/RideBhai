import React, { useCallback, useEffect, useState } from 'react';
import {
  LifeBuoy,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Send,
  Loader2,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  FileQuestion,
  HelpCircle,
} from 'lucide-react';
import { api } from '../../lib/api';
import { SupportTicket, TicketCategory, TicketPriority, TicketStatus } from '../../types';
import { FilePick } from './FilePick';

interface SupportTicketsViewProps {
  onBack: () => void;
}

const statusBadges: Record<TicketStatus, { label: string; bg: string; text: string; border: string }> = {
  open: { label: 'Open', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  resolved: { label: 'Resolved', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  closed: { label: 'Closed', bg: 'bg-zinc-100', text: 'text-zinc-600', border: 'border-zinc-300' },
};

const categoryLabels: Record<TicketCategory, string> = {
  booking: 'Booking Issue',
  payment: 'Payment & Refund',
  kyc: 'KYC & Verification',
  listing: 'Car / Tour Listing',
  account: 'Account & Login',
  general: 'General Support',
};

function formatTimestamp(isoString?: string) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export const SupportTicketsView: React.FC<SupportTicketsViewProps> = ({ onBack }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Raise Ticket Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState<TicketCategory>('general');
  const [priority, setPriority] = useState<TicketPriority>('normal');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api<SupportTicket[]>('/tickets/me');
      setTickets(data || []);
    } catch (err: any) {
      setError(err?.message || 'Could not load your support tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleRaiseTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (subject.trim().length < 3) {
      setFormError('Please enter a descriptive subject (at least 3 characters).');
      return;
    }
    if (description.trim().length < 5) {
      setFormError('Please explain your issue in detail (at least 5 characters).');
      return;
    }

    setSubmitting(true);
    setFormError('');
    try {
      const newTicket = await api<SupportTicket>('/tickets/me', {
        method: 'POST',
        json: {
          category,
          subject: subject.trim(),
          description: description.trim(),
          priority,
          attachmentUrl: attachmentUrl || undefined,
        },
      });

      setTickets((prev) => [newTicket, ...prev]);
      setFormSuccess(`Ticket #${newTicket.ticket_number} created successfully! Our team will resolve it shortly.`);
      setSubject('');
      setDescription('');
      setAttachmentUrl('');
      setCategory('general');
      setPriority('normal');
      setTimeout(() => {
        setIsModalOpen(false);
        setFormSuccess('');
      }, 1500);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to raise ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-extrabold text-[#F15A24] inline-flex items-center gap-1.5 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to profile
        </button>
        <button
          type="button"
          onClick={() => {
            setFormError('');
            setFormSuccess('');
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-2xl brand-gradient text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md active-press"
        >
          <Plus className="w-4 h-4" /> Raise Ticket
        </button>
      </div>

      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-[#1C1C1C] text-white shadow-card flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F15A24]/20 border border-[#F15A24]/30 text-[#F15A24] text-[10px] font-extrabold uppercase tracking-wider mb-1">
            <LifeBuoy className="w-3 h-3" /> Help Desk
          </div>
          <h2 className="text-base font-extrabold">Support & Help Tickets</h2>
          <p className="text-xs text-white/70 mt-0.5">
            Need assistance with bookings, KYC, or payouts? Raise a ticket and track direct admin updates.
          </p>
        </div>
        <div className="hidden sm:flex w-12 h-12 rounded-2xl bg-white/10 items-center justify-center text-[#F15A24] flex-shrink-0">
          <MessageSquare className="w-6 h-6" />
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-xs font-bold text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="p-8 text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#F15A24] mx-auto" />
          <p className="text-xs font-bold text-[#6B6B6B]">Loading your tickets...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && tickets.length === 0 && (
        <div className="p-8 text-center bg-white rounded-3xl border border-[#EBE5D8] shadow-card space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF0EB] text-[#F15A24] flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1C1C1C]">No tickets raised yet</h3>
            <p className="text-xs text-[#6B6B6B] mt-1 max-w-xs mx-auto">
              If you have any issue with bookings, listings, payments, or account, raise a ticket and our support team will help.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-5 rounded-2xl brand-gradient text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-md active-press"
          >
            <Plus className="w-4 h-4" /> Raise your first ticket
          </button>
        </div>
      )}

      {/* Tickets List */}
      {!loading && tickets.length > 0 && (
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const badge = statusBadges[ticket.status] || statusBadges.open;
            return (
              <div
                key={ticket.id}
                className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card space-y-3 transition-all"
              >
                {/* Card Top Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-[#1C1C1C] bg-[#FAF6EE] px-2 py-0.5 rounded-lg border border-[#EBE5D8]">
                      {ticket.ticket_number}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#F15A24] bg-[#FFF0EB] px-2 py-0.5 rounded-md border border-[#FFD8CB]">
                      {categoryLabels[ticket.category] || ticket.category}
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Subject & Description */}
                <div>
                  <h3 className="text-sm font-extrabold text-[#1C1C1C]">{ticket.subject}</h3>
                  <p className="text-xs text-[#6B6B6B] mt-1 whitespace-pre-wrap">{ticket.description}</p>
                </div>

                {/* Admin Note / Resolution Box */}
                {(ticket.resolution_notes || ticket.admin_notes) && (
                  <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-emerald-800 text-[11px] uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Admin Response & Resolution Note:</span>
                    </div>
                    <p className="font-semibold text-emerald-950 whitespace-pre-wrap">
                      {ticket.resolution_notes || ticket.admin_notes}
                    </p>
                  </div>
                )}

                {/* Footer timestamp */}
                <div className="pt-2 border-t border-[#FAF6EE] flex items-center justify-between text-[11px] text-[#8A8478]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#F15A24]" />
                    Raised {formatTimestamp(ticket.created_at)}
                  </span>
                  <span className="capitalize font-bold text-[#1C1C1C]">
                    Priority: {ticket.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Raise New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs p-0 sm:p-3 max-w-[430px] mx-auto">
          <div className="bg-white rounded-t-[32px] sm:rounded-3xl w-full max-h-[88vh] sm:max-h-[780px] flex flex-col shadow-2xl overflow-hidden border-t sm:border border-[#EBE5D8] animate-slide-up sm:animate-scale-up">
            {/* Modal Fixed Header */}
            <div className="px-5 py-3.5 bg-[#1C1C1C] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl brand-gradient flex items-center justify-center text-white shrink-0 shadow-sm">
                  <LifeBuoy className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-extrabold text-white leading-tight">Raise Support Ticket</h3>
                  <p className="text-[10px] text-white/70">Admin will review & reply promptly</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formSuccess ? (
              <div className="p-6 text-center space-y-3 flex-1 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-[#1C1C1C]">Ticket Submitted!</h4>
                <p className="text-xs text-[#6B6B6B] max-w-xs">{formSuccess}</p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-2 px-6 py-2.5 rounded-2xl brand-gradient text-white text-xs font-extrabold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRaiseTicket} className="flex flex-col flex-1 min-h-0">
                {/* Scrollable Form Body */}
                <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 overscroll-contain no-scrollbar">
                  {/* Category Selection */}
                  <div>
                    <label className="text-[11px] font-extrabold text-[#1C1C1C] block mb-1.5">
                      Select Issue Category *
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(Object.keys(categoryLabels) as TicketCategory[]).map((cat) => {
                        const isSelected = category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`p-2.5 rounded-xl text-left text-[11px] font-bold border transition-all ${
                              isSelected
                                ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs'
                                : 'bg-[#FAF6EE] text-[#4A4A4A] border-[#EBE5D8] hover:border-zinc-400'
                            }`}
                          >
                            {categoryLabels[cat]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Priority Selection */}
                  <div>
                    <label className="text-[11px] font-extrabold text-[#1C1C1C] block mb-1.5">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['normal', 'high', 'urgent'] as const).map((pr) => {
                        const isSelected = priority === pr;
                        return (
                          <button
                            key={pr}
                            type="button"
                            onClick={() => setPriority(pr)}
                            className={`py-2 rounded-xl text-center text-[11px] font-extrabold capitalize border transition-all ${
                              isSelected
                                ? pr === 'urgent'
                                  ? 'bg-red-600 text-white border-red-600'
                                  : pr === 'high'
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : 'bg-[#1C1C1C] text-white border-[#1C1C1C]'
                                : 'bg-[#FAF6EE] text-[#6B6B6B] border-[#EBE5D8]'
                            }`}
                          >
                            {pr}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="text-[11px] font-extrabold text-[#1C1C1C] block mb-1">
                      Subject / Title *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief summary of your issue..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] focus:outline-none focus:border-[#F15A24]"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-[11px] font-extrabold text-[#1C1C1C] block mb-1">
                      Describe Your Issue *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Provide relevant details (booking ID, car plate, payment amount, or questions)..."
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] focus:outline-none focus:border-[#F15A24] resize-none"
                      required
                    />
                  </div>

                  {/* File Attachment */}
                  <FilePick
                    label="Attach Screenshot or Document (Optional)"
                    value={attachmentUrl}
                    onChange={setAttachmentUrl}
                    capture="environment"
                  />

                  {formError && (
                    <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                      {formError}
                    </p>
                  )}
                </div>

                {/* Sticky Action Footer */}
                <div className="p-3.5 bg-[#FAF6EE] border-t border-[#EBE5D8] shrink-0 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-2xl bg-white border border-[#EBE5D8] text-xs font-extrabold text-[#6B6B6B] hover:bg-zinc-50 active-press"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 rounded-2xl brand-gradient text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-all disabled:opacity-60 active-press"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Submit Ticket
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
