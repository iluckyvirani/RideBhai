import React, { useState } from 'react';
import { CheckCircle2, Landmark } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { BankDetails } from '../../types';

const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const BankDetailsView: React.FC = () => {
  const { currentUser, saveBankDetails } = useAppStore();
  const existing = currentUser?.bankDetails;
  const [holder, setHolder] = useState(existing?.accountHolderName || currentUser?.name || '');
  const [account, setAccount] = useState(existing?.accountNumber || '');
  const [confirm, setConfirm] = useState(existing?.accountNumber || '');
  const [ifsc, setIfsc] = useState(existing?.ifsc || '');
  const [bankName, setBankName] = useState(existing?.bankName || '');
  const [branchName, setBranchName] = useState(existing?.branchName || '');
  const [accountType, setAccountType] = useState<BankDetails['accountType']>(
    existing?.accountType || 'savings'
  );
  const [upiId, setUpiId] = useState(existing?.upiId || '');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const holderName = holder.trim();
    const acc = account.replace(/\s/g, '');
    const accConfirm = confirm.replace(/\s/g, '');
    const code = ifsc.trim().toUpperCase();
    const bank = bankName.trim();

    if (!holderName || !acc || !code || !bank) {
      setError('Account holder name, account number, IFSC and bank name are required.');
      setSaved(false);
      return;
    }
    if (!/^\d{9,18}$/.test(acc)) {
      setError('Enter a valid account number (9–18 digits).');
      setSaved(false);
      return;
    }
    if (acc !== accConfirm) {
      setError('Account number and confirm account number do not match.');
      setSaved(false);
      return;
    }
    if (!IFSC_RE.test(code)) {
      setError('Enter a valid IFSC (e.g. HDFC0001234).');
      setSaved(false);
      return;
    }
    const upi = upiId.trim();
    if (upi && !upi.includes('@')) {
      setError('Enter a valid UPI ID (e.g. name@okhdfcbank) or leave it blank.');
      setSaved(false);
      return;
    }

    try {
      await saveBankDetails({
        accountHolderName: holderName,
        accountNumber: acc,
        ifsc: code,
        bankName: bank,
        branchName: branchName.trim() || undefined,
        accountType,
        upiId: upi || undefined,
        completed: true,
      });
      setError('');
      setSaved(true);
    } catch (err: any) {
      setSaved(false);
      setError(err?.message || 'Could not save bank details.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-2">
          <Landmark className="w-4 h-4 text-[#F15A24]" /> Bank details
        </h3>
        <p className="text-[11px] text-[#6B6B6B]">
          Saved for payouts and Ride Bhai settlements. Demo only — nothing is sent to a real bank.
        </p>
      </div>

      {existing?.completed && (
        <p className="text-[11px] font-bold text-[#00A86B] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Bank details saved
        </p>
      )}

      <form onSubmit={handleSave} className="space-y-2.5">
        <input
          value={holder}
          onChange={(e) => setHolder(e.target.value)}
          placeholder="Account holder name *"
          className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
        />
        <input
          inputMode="numeric"
          value={account}
          onChange={(e) => setAccount(e.target.value.replace(/\D/g, '').slice(0, 18))}
          placeholder="Account number *"
          className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
        />
        <input
          inputMode="numeric"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.replace(/\D/g, '').slice(0, 18))}
          placeholder="Confirm account number *"
          className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
        />
        <input
          value={ifsc}
          onChange={(e) => setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11))}
          placeholder="IFSC *"
          className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold tracking-wider"
        />
        <input
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          placeholder="Bank name *"
          className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
        />
        <input
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="Branch name (optional)"
          className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAccountType('savings')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-extrabold ${
              accountType === 'savings' ? 'bg-[#F15A24] text-white' : 'bg-[#FAF6EE] border border-[#EBE5D8]'
            }`}
          >
            Savings
          </button>
          <button
            type="button"
            onClick={() => setAccountType('current')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-extrabold ${
              accountType === 'current' ? 'bg-[#F15A24] text-white' : 'bg-[#FAF6EE] border border-[#EBE5D8]'
            }`}
          >
            Current
          </button>
        </div>
        <input
          value={upiId}
          onChange={(e) => setUpiId(e.target.value.trim())}
          placeholder="UPI ID (optional)"
          className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
        />
        {error && <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-xl">{error}</p>}
        {saved && !error && (
          <p className="text-[11px] font-bold text-[#00A86B] bg-emerald-50 p-2 rounded-xl">
            Bank details updated.
          </p>
        )}
        <button type="submit" className="w-full py-3 rounded-2xl brand-gradient text-white text-xs font-extrabold">
          Save bank details
        </button>
      </form>
    </div>
  );
};
