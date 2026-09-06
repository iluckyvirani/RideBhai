import React, { useCallback, useEffect, useState } from 'react';
import { MapPin, Search, Building } from 'lucide-react';
import { api, getToken } from '../../lib/api';
import { mapTourListing } from '../../lib/listings';
import { AgencyTripPost } from '../../types';
import { useAppStore } from '../../store/useAppStore';

export const AgencyTourPostsManager: React.FC = () => {
  const { refreshListings } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [posts, setPosts] = useState<AgencyTripPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!getToken()) {
      setError('Login as admin first: phone 9999999999, OTP 4829, then open Admin.');
      setPosts([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api<any[]>('/admin/listings/tours');
      setPosts((data || []).map(mapTourListing));
    } catch (err: any) {
      setError(err?.message || 'Could not load tours. Login as admin.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: 'active' | 'closed' | 'cancelled') => {
    try {
      await api(`/admin/listings/tours/${id}`, { method: 'PATCH', json: { status } });
      await Promise.all([load(), refreshListings()]);
    } catch (err: any) {
      setError(err?.message || 'Could not update tour.');
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === 'active' && post.status !== 'active') return false;
    if (statusFilter === 'closed' && post.status === 'active') return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        post.fromCity.toLowerCase().includes(q) ||
        post.toCity.toLowerCase().includes(q) ||
        post.agencyName.toLowerCase().includes(q) ||
        (post.tripDetails || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#1C1C1C]">All tours ({posts.length})</h2>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Live from Neon. Close a tour to hide it from the public Tours tab.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#FAF6EE] p-1 rounded-2xl border border-[#EBE5D8]">
          {(['all', 'active', 'closed'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                statusFilter === key ? 'bg-[#1C1C1C] text-white' : 'text-[#6B6B6B]'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-[#6B6B6B] absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search city or agency…"
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#EBE5D8] text-xs font-medium bg-white"
        />
      </div>

      {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-2xl">{error}</p>}
      {loading && <p className="text-xs font-bold text-[#6B6B6B]">Loading tours…</p>}

      <div className="space-y-4">
        {!loading && filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-[#FAF6EE] rounded-3xl border border-[#EBE5D8]">
            <Building className="w-10 h-10 text-[#C4BCAB] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#1C1C1C]">No tour packages found</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="p-5 rounded-3xl bg-white border border-[#EBE5D8] shadow-card space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-extrabold text-[#1C1C1C]">{post.agencyName}</h3>
                  <p className="text-[10px] text-[#6B6B6B]">Phone: {post.agencyPhone}</p>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    post.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {post.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-black text-[#1C1C1C]">
                <MapPin className="w-4 h-4 text-[#F15A24]" />
                <span>{post.fromCity}</span>
                <span className="text-[#F15A24]">{post.tripSide === 'two_side' ? '⇄' : '→'}</span>
                <span>{post.toCity}</span>
              </div>
              <p className="text-xs text-[#6B6B6B]">
                {post.tripSide === 'two_side' ? 'Two side' : 'One side'} · {post.passengers} pax · ₹
                {post.totalCustomerPrice.toLocaleString('en-IN')}
              </p>
              {post.status === 'active' ? (
                <button
                  type="button"
                  onClick={() => setStatus(post.id, 'closed')}
                  className="w-full py-2 rounded-xl bg-[#1C1C1C] text-white text-[11px] font-extrabold"
                >
                  Close & hide
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStatus(post.id, 'active')}
                  className="w-full py-2 rounded-xl bg-[#FAF6EE] text-[#1C1C1C] text-[11px] font-extrabold"
                >
                  Show again
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
