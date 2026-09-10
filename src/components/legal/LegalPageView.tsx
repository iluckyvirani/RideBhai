import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../lib/api';
import { Logo } from '../common/Logo';

export type LegalSlug = 'terms' | 'privacy';

type SitePage = {
  slug: LegalSlug;
  title: string;
  body: string;
  updatedAt?: string | null;
};

function when(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export const LegalPageView: React.FC<{
  slug: LegalSlug;
  onBack: () => void;
  onOpen?: (slug: LegalSlug) => void;
}> = ({ slug, onBack, onOpen }) => {
  const [page, setPage] = useState<SitePage | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    api<SitePage>(`/pages/${slug}`)
      .then((row) => {
        if (!cancelled) setPage(row);
      })
      .catch((err: any) => {
        if (!cancelled) {
          setPage(null);
          setError(err?.message || 'Could not load this page.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const other: LegalSlug = slug === 'terms' ? 'privacy' : 'terms';
  const otherLabel = other === 'terms' ? 'Terms and conditions' : 'Privacy policy';

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1C1C1C] flex flex-col">
      <header className="sticky top-0 z-30 bg-[#FAF6EE]/90 backdrop-blur-md border-b border-[#EBE5D8]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-[#EBE5D8] text-xs font-extrabold"
          >
            <ArrowLeft className="w-4 h-4 text-[#F15A24]" />
            Back
          </button>
          <Logo size="sm" showTagline={false} />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border border-[#EBE5D8] p-5 sm:p-8 shadow-card">
          {loading && <p className="text-sm font-bold text-[#6B6B6B]">Loading…</p>}
          {error && <p className="text-sm font-bold text-red-600">{error}</p>}
          {!loading && page && (
            <>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#F15A24]">Ride Bhai</p>
              <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">{page.title}</h1>
              {page.updatedAt && (
                <p className="text-[11px] text-[#6B6B6B] mt-2">Updated {when(page.updatedAt)}</p>
              )}
              <div className="mt-6 text-sm leading-relaxed text-[#1C1C1C] whitespace-pre-wrap">{page.body}</div>
            </>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-xs font-extrabold">
          <button type="button" onClick={onBack} className="text-[#6B6B6B] hover:text-[#1C1C1C]">
            Back to home
          </button>
          <button type="button" onClick={() => onOpen?.(other)} className="text-[#F15A24]">
            {otherLabel}
          </button>
        </div>
      </main>
    </div>
  );
};
