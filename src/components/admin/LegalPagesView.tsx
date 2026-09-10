import React, { useEffect, useState } from 'react';
import { FileText, Plus, Save, Trash2 } from 'lucide-react';
import { api, getToken } from '../../lib/api';

type PageSlug = 'terms' | 'privacy';
type InnerTab = PageSlug | 'support' | 'faq';

type SitePage = {
  slug: PageSlug;
  title: string;
  body: string;
};

type SiteSettings = {
  supportPhone: string;
  supportEmail: string;
  emergencyPhone: string;
};

type SiteFaq = {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
};

const TABS: { id: InnerTab; label: string }[] = [
  { id: 'terms', label: 'Terms' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'support', label: 'Support contact' },
  { id: 'faq', label: 'FAQ' },
];

const field =
  'mt-1 w-full rounded-xl border border-[#EBE5D8] bg-[#FAF6EE] px-3 py-2.5 text-sm font-bold';

export const LegalPagesView: React.FC = () => {
  const [tab, setTab] = useState<InnerTab>('terms');
  const [pages, setPages] = useState<Partial<Record<PageSlug, SitePage>>>({});
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({
    supportPhone: '',
    supportEmail: '',
    emergencyPhone: '',
  });
  const [faqs, setFaqs] = useState<SiteFaq[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  const load = async () => {
    if (!getToken()) {
      setError('Login as admin: 9999999999 / OTP 4829.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [pageRows, site] = await Promise.all([
        api<SitePage[]>('/admin/pages'),
        api<{ settings: SiteSettings; faqs: SiteFaq[] }>('/admin/site'),
      ]);
      const next: Partial<Record<PageSlug, SitePage>> = {};
      for (const row of pageRows || []) {
        if (row.slug === 'terms' || row.slug === 'privacy') next[row.slug] = row;
      }
      setPages(next);
      const current = next[tab === 'privacy' ? 'privacy' : 'terms'];
      setTitle(current?.title || '');
      setBody(current?.body || '');
      setSettings(site.settings);
      setFaqs(site.faqs || []);
    } catch (err: any) {
      setError(err?.message || 'Could not load website content.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab !== 'terms' && tab !== 'privacy') return;
    const current = pages[tab];
    if (!current) return;
    setTitle(current.title);
    setBody(current.body);
    setSaved('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const savePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab !== 'terms' && tab !== 'privacy') return;
    setSaving(true);
    setError('');
    setSaved('');
    try {
      const row = await api<SitePage>(`/admin/pages/${tab}`, {
        method: 'PATCH',
        json: { title: title.trim(), body: body.trim() },
      });
      setPages((prev) => ({ ...prev, [tab]: row }));
      setSaved('Saved.');
    } catch (err: any) {
      setError(err?.message || 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const saveSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved('');
    try {
      setSettings(await api<SiteSettings>('/admin/site', { method: 'PATCH', json: settings }));
      setSaved('Support details saved.');
    } catch (err: any) {
      setError(err?.message || 'Could not save support details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm font-bold text-[#6B6B6B]">Loading website content…</p>;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#F15A24]" /> Website content
        </h2>
        <p className="text-xs text-[#6B6B6B] mt-1">Footer Terms, Privacy, support contacts and FAQs.</p>
      </div>
      <div className="flex gap-2 bg-[#FAF6EE] p-1 rounded-2xl border border-[#EBE5D8] w-fit flex-wrap">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setTab(item.id);
              setSaved('');
              setError('');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              tab === item.id ? 'bg-[#1C1C1C] text-white' : 'text-[#6B6B6B]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-2xl">{error}</p>}
      {saved && <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-2xl">{saved}</p>}

      {(tab === 'terms' || tab === 'privacy') && (
        <form onSubmit={savePage} className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={field} />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={14} className={`${field} font-medium`} />
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-[#F15A24] text-white text-sm font-extrabold inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save page
          </button>
        </form>
      )}

      {tab === 'support' && (
        <form onSubmit={saveSupport} className="space-y-3 max-w-lg">
          <input
            value={settings.supportPhone}
            onChange={(e) => setSettings((p) => ({ ...p, supportPhone: e.target.value }))}
            className={field}
            placeholder="Support phone"
          />
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings((p) => ({ ...p, supportEmail: e.target.value }))}
            className={field}
            placeholder="Support email"
          />
          <input
            value={settings.emergencyPhone}
            onChange={(e) => setSettings((p) => ({ ...p, emergencyPhone: e.target.value }))}
            className={field}
            placeholder="Emergency number"
          />
          <button type="submit" disabled={saving} className="px-6 py-3 rounded-2xl bg-[#F15A24] text-white text-sm font-extrabold">
            Save support details
          </button>
        </form>
      )}

      {tab === 'faq' && (
        <div className="space-y-3">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              setError('');
              try {
                const row = await api<SiteFaq>('/admin/faqs', {
                  method: 'POST',
                  json: { question: newQuestion.trim(), answer: newAnswer.trim() },
                });
                setFaqs((prev) => [...prev, row]);
                setNewQuestion('');
                setNewAnswer('');
                setSaved('FAQ added.');
              } catch (err: any) {
                setError(err?.message || 'Could not add FAQ.');
              } finally {
                setSaving(false);
              }
            }}
            className="rounded-2xl border border-[#EBE5D8] bg-[#FAF6EE] p-3 space-y-2"
          >
            <p className="text-[11px] font-extrabold uppercase text-[#8A8478] inline-flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </p>
            <input value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Question" className={field} />
            <textarea value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="Answer" rows={3} className={`${field} font-medium`} />
            <button type="submit" className="px-4 py-2 rounded-xl bg-[#1C1C1C] text-white text-xs font-extrabold">
              Add
            </button>
          </form>
          {faqs.map((faq) => (
            <div key={faq.id} className="rounded-2xl border border-[#EBE5D8] p-3 space-y-2">
              <input
                value={faq.question}
                onChange={(e) =>
                  setFaqs((prev) => prev.map((item) => (item.id === faq.id ? { ...item, question: e.target.value } : item)))
                }
                className={field}
              />
              <textarea
                value={faq.answer}
                onChange={(e) =>
                  setFaqs((prev) => prev.map((item) => (item.id === faq.id ? { ...item, answer: e.target.value } : item)))
                }
                rows={3}
                className={`${field} font-medium`}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    const row = await api<SiteFaq>(`/admin/faqs/${faq.id}`, {
                      method: 'PATCH',
                      json: { question: faq.question, answer: faq.answer, isActive: faq.isActive },
                    });
                    setFaqs((prev) => prev.map((item) => (item.id === row.id ? row : item)));
                    setSaved('FAQ updated.');
                  }}
                  className="px-3 py-2 rounded-xl bg-[#F15A24] text-white text-xs font-extrabold inline-flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await api(`/admin/faqs/${faq.id}`, { method: 'DELETE' });
                    setFaqs((prev) => prev.filter((item) => item.id !== faq.id));
                  }}
                  className="px-3 py-2 rounded-xl bg-[#FFF0EB] text-[#D64545] text-xs font-extrabold inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
