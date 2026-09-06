import React, { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Search } from 'lucide-react';
import { api, getToken } from '../../lib/api';
import { mapServerUser, type ServerUser } from '../../lib/session';
import { AppUser } from '../../types';
import { isPreviewableImage } from '../../lib/upload';

export const UserKycQueue: React.FC = () => {
  const [filter, setFilter] = useState<'pending' | 'all' | 'verified' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<AppUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectOpen, setRejectOpen] = useState(false);

  const load = useCallback(async () => {
    if (!getToken()) {
      setError('Login as admin first: phone 9999999999, OTP 4829, then open Admin.');
      setUsers([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const rows = await api<ServerUser[]>('/admin/kyc?status=all');
      setUsers(
        rows
          .filter((row) => {
            const phone = String(row.phone || '').replace(/\D/g, '').slice(-10);
            const email = String(row.email || '').toLowerCase();
            return phone !== '9999999999' && email !== 'admin@ridebhai.in';
          })
          .map((row) => mapServerUser(row))
      );
    } catch (err: any) {
      setError(err?.message || 'Could not load KYC. Login as admin (9999999999).');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = users.filter((user) => {
    if (filter === 'pending' && user.profileStatus !== 'pending_verification') return false;
    if (filter === 'verified' && user.profileStatus !== 'verified') return false;
    if (filter === 'rejected' && user.profileStatus !== 'rejected') return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.phone.includes(q) ||
      (user.agencyName || '').toLowerCase().includes(q)
    );
  });

  const pendingCount = users.filter((u) => u.profileStatus === 'pending_verification').length;

  const decide = async (userId: string, decision: 'verified' | 'rejected', reason?: string) => {
    await api(`/admin/kyc/${userId}`, {
      method: 'POST',
      json: { decision, rejectionReason: reason },
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#1C1C1C]">User KYC</h2>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#F15A24] text-white text-xs font-extrabold">
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-xs text-[#6B6B6B] mt-1">
            Live from Neon. Review Aadhaar and selfie, then verify or reject.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 p-3 rounded-2xl">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#6B6B6B]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, email"
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
          />
        </div>
        <div className="flex gap-1">
          {(['pending', 'verified', 'rejected', 'all'] as const).map((id) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-3 py-2 rounded-xl text-[11px] font-extrabold ${
                filter === id ? 'bg-[#1C1C1C] text-white' : 'bg-[#FAF6EE] text-[#6B6B6B]'
              }`}
            >
              {id}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-xs font-bold text-[#6B6B6B]">Loading…</p>}

      {!loading && filtered.length === 0 && !error && (
        <p className="text-sm font-bold text-[#6B6B6B] p-6 rounded-3xl bg-[#FAF6EE] border border-[#EBE5D8]">
          No users in this filter. A new user completes profile, then they appear here as pending.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((user) => (
          <article key={user.id} className="p-4 rounded-3xl border border-[#EBE5D8] bg-[#FAF6EE] space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-extrabold">{user.name || 'Unnamed'}</h3>
                <p className="text-[11px] text-[#6B6B6B]">
                  +91 {user.phone} · {user.email}
                </p>
                {user.agencyName && <p className="text-[11px] font-bold">{user.agencyName}</p>}
                {user.gstNumber && <p className="text-[11px] text-[#6B6B6B]">GST {user.gstNumber}</p>}
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white border border-[#EBE5D8]">
                {user.profileStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-2xl p-2 border border-[#EBE5D8]">
                <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B] mb-1">Aadhaar</p>
                {isPreviewableImage(user.aadhaarDoc) ? (
                  <img src={user.aadhaarDoc} alt="Aadhaar" className="h-24 w-full object-cover rounded-xl" />
                ) : user.aadhaarDoc ? (
                  <a href={user.aadhaarDoc} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-[#F15A24]">
                    Open document
                  </a>
                ) : (
                  <p className="text-[11px] font-bold">Not uploaded</p>
                )}
              </div>
              <div className="bg-white rounded-2xl p-2 border border-[#EBE5D8]">
                <p className="text-[10px] font-extrabold uppercase text-[#6B6B6B] mb-1">Selfie</p>
                {isPreviewableImage(user.selfieDoc) ? (
                  <img src={user.selfieDoc} alt="Selfie" className="h-24 w-full object-cover rounded-xl" />
                ) : (
                  <p className="text-[11px] font-bold">{user.selfieName || 'Uploaded'}</p>
                )}
              </div>
            </div>

            {user.profileStatus === 'pending_verification' && (
              <div className="flex gap-2">
                <button
                  onClick={() => decide(user.id, 'verified')}
                  className="flex-1 py-2.5 rounded-xl bg-[#00A86B] text-white text-xs font-extrabold flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verify
                </button>
                <button
                  onClick={() => {
                    setSelected(user);
                    setRejectOpen(true);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-xs font-extrabold flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            )}
          </article>
        ))}
      </div>

      {rejectOpen && selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-md space-y-3">
            <h3 className="text-sm font-extrabold">Reject {selected.name}?</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              rows={3}
              placeholder="Reason shown to the user"
            />
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await decide(selected.id, 'rejected', rejectionReason);
                  setRejectOpen(false);
                  setSelected(null);
                  setRejectionReason('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-extrabold"
              >
                Reject
              </button>
              <button
                onClick={() => setRejectOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#FAF6EE] text-xs font-extrabold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
