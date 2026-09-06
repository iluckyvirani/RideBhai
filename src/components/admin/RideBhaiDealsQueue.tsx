import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { api, getToken } from '../../lib/api';
import { mapDeal, type Deal } from '../../lib/deals';

export const RideBhaiDealsQueue: React.FC = () => {
  const [filter, setFilter] = useState<'pending' | 'success' | 'cancelled' | 'all'>('pending');
  const [rows, setRows] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    if (!getToken()) {
      setError('Login as admin first: phone 9999999999, OTP 4829, then open Admin.');
      setRows([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api<any[]>(`/admin/deals?status=${filter}`);
      setRows((data || []).map(mapDeal));
    } catch (err: any) {
      setError(err?.message || 'Could not load Ride Bhai deals.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const closeDeal = async (id: string, status: 'success' | 'cancelled') => {
    try {
      await api(`/admin/deals/${id}`, {
        method: 'PATCH',
        json: { status, adminNote: note || undefined },
      });
      setNote('');
      await load();
    } catch (err: any) {
      setError(err?.message || 'Could not update deal.');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-[#1C1C1C]">Ride Bhai deals</h2>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Live from Neon. Close as success or cancelled — both parties see it in My bookings and Chat.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['pending', 'success', 'cancelled', 'all'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold ${
              filter === key ? 'bg-[#1C1C1C] text-white' : 'bg-[#FAF6EE] text-[#6B6B6B]'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional admin note for the next close"
        className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
      />

      {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-2xl">{error}</p>}
      {loading && <p className="text-xs font-bold text-[#6B6B6B]">Loading deals…</p>}
      {!loading && rows.length === 0 && <p className="text-sm font-bold text-[#6B6B6B]">No deals in this filter.</p>}

      {rows.map((deal) => (
        <div key={deal.id} className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-extrabold uppercase text-[#F15A24]">
              {deal.listingType} · {deal.status}
            </span>
            <span className="text-[10px] font-bold text-[#6B6B6B]">
              ₹{deal.price.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-sm font-extrabold text-[#1C1C1C]">{deal.title}</p>
          <p className="text-[11px] text-[#6B6B6B]">
            Buyer {deal.buyerName} ({deal.buyerPhone || '—'}) → Seller {deal.sellerName} ({deal.sellerPhone || '—'})
          </p>
          {deal.status === 'pending' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => closeDeal(deal.id, 'success')}
                className="py-2 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-extrabold flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Success
              </button>
              <button
                type="button"
                onClick={() => closeDeal(deal.id, 'cancelled')}
                className="py-2 rounded-xl bg-red-50 text-red-700 text-[11px] font-extrabold flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
