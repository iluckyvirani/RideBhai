import React, { useCallback, useEffect, useState } from 'react';
import { Car, Search, MapPin, Navigation, IndianRupee, Phone } from 'lucide-react';
import { api, getToken } from '../../lib/api';
import { mapCarListing } from '../../lib/listings';
import { CarListing } from '../../types';
import { useAppStore } from '../../store/useAppStore';

export const AllCarListingsView: React.FC = () => {
  const { refreshListings } = useAppStore();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!getToken()) {
      setError('Login as admin first: phone 9999999999, OTP 4829, then open Admin.');
      setRows([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api<any[]>('/admin/listings/cars');
      setRows((data || []).map(mapCarListing));
    } catch (err: any) {
      setError(err?.message || 'Could not load cars. Login as admin.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: 'available' | 'inactive') => {
    try {
      await api(`/admin/listings/cars/${id}`, { method: 'PATCH', json: { status } });
      await Promise.all([load(), refreshListings()]);
    } catch (err: any) {
      setError(err?.message || 'Could not update listing.');
    }
  };

  const filtered = rows.filter((c) => {
    const s = q.toLowerCase();
    return (
      !s ||
      c.carName.toLowerCase().includes(s) ||
      c.partnerName.toLowerCase().includes(s) ||
      c.currentCity.toLowerCase().includes(s) ||
      (c.toCity || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-[#1C1C1C] flex items-center gap-2">
          <Car className="w-6 h-6 text-[#F15A24]" />
          All cars
        </h2>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Live from Neon. Hide a listing to take it off the public Cars tab.
        </p>
      </div>
      <div className="relative">
        <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search car, partner, city…"
          className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
        />
      </div>
      {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-2xl">{error}</p>}
      {loading && <p className="text-xs font-bold text-[#6B6B6B]">Loading cars…</p>}
      {!loading && filtered.length === 0 && <p className="text-sm font-bold text-[#6B6B6B]">No car listings.</p>}
      <div className="space-y-3">
        {filtered.map((c) => (
          <div key={c.id} className="p-4 rounded-2xl border border-[#EBE5D8] bg-[#FAF6EE] space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold">{c.carName}</p>
                <p className="text-[11px] text-[#6B6B6B]">
                  {c.partnerName} · {c.plate || '—'} · {c.seats} seater
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-[#F15A24] flex items-center justify-end gap-0.5">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {c.fullCarPrice.toLocaleString('en-IN')}
                </p>
                <p className="text-[10px] font-bold text-[#6B6B6B]">{c.status}</p>
              </div>
            </div>
            <p className="text-[11px] font-bold flex items-center gap-1">
              {c.availability === 'citywide' ? (
                <>
                  <Navigation className="w-3.5 h-3.5 text-[#F15A24]" /> Currently in {c.currentCity} · All India
                </>
              ) : (
                <>
                  <MapPin className="w-3.5 h-3.5 text-[#F15A24]" /> {c.currentCity} → {c.toCity}
                </>
              )}
            </p>
            <p className="text-[11px] text-[#6B6B6B] flex items-center gap-1">
              <Phone className="w-3 h-3" /> {c.partnerPhone}
            </p>
            {c.status === 'available' ? (
              <button
                type="button"
                onClick={() => setStatus(c.id, 'inactive')}
                className="text-[11px] font-extrabold text-[#E8380D]"
              >
                Hide listing
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStatus(c.id, 'available')}
                className="text-[11px] font-extrabold text-[#00A86B]"
              >
                Show again
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
