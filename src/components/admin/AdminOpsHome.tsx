import React, { useEffect, useState } from 'react';
import { ShieldCheck, Phone, Car, MapPin } from 'lucide-react';
import { api, getToken } from '../../lib/api';

type Stats = {
  pendingKyc: number;
  pendingDeals: number;
  liveCars: number;
  liveTours: number;
};

export const AdminOpsHome: React.FC<{
  onOpen: (tab: 'user-kyc' | 'deals' | 'cars' | 'tours') => void;
}> = ({ onOpen }) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      setError('Login as admin first: phone 9999999999, OTP 4829.');
      return;
    }
    api<Stats>('/admin/stats')
      .then(setStats)
      .catch((err: any) => setError(err?.message || 'Could not load admin stats.'));
  }, []);

  const cards = [
    { key: 'user-kyc' as const, label: 'Pending KYC', value: stats?.pendingKyc, icon: ShieldCheck },
    { key: 'deals' as const, label: 'Pending deals', value: stats?.pendingDeals, icon: Phone },
    { key: 'cars' as const, label: 'Live cars', value: stats?.liveCars, icon: Car },
    { key: 'tours' as const, label: 'Live tours', value: stats?.liveTours, icon: MapPin },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-[#1C1C1C]">Operations</h2>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Use this website Admin (not localhost:5174). Verify KYC, close Ride Bhai deals, and hide listings — all on Neon.
        </p>
      </div>
      {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-2xl">{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onOpen(card.key)}
              className="p-4 rounded-3xl bg-[#FAF6EE] border border-[#EBE5D8] text-left space-y-2"
            >
              <Icon className="w-4 h-4 text-[#F15A24]" />
              <p className="text-2xl font-black text-[#1C1C1C]">{card.value ?? '—'}</p>
              <p className="text-[11px] font-extrabold text-[#6B6B6B]">{card.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
