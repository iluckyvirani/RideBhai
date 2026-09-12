import React, { useState } from 'react';
import { CheckCircle2, Loader2, Plus, UserRound } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { FilePick } from '../common/FilePick';
import { isPreviewableImage } from '../../lib/upload';

export const PartnerDriversView: React.FC = () => {
  const { currentUser, saveDriverProfile } = useAppStore();
  const drivers = currentUser?.driverProfiles?.length
    ? currentUser.driverProfiles
    : currentUser?.driverProfile?.completed
      ? [currentUser.driverProfile]
      : [];
  const [open, setOpen] = useState(drivers.length === 0);
  const [driverError, setDriverError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [dName, setDName] = useState('');
  const [dEmail, setDEmail] = useState('');
  const [dPhone, setDPhone] = useState('');
  const [dAadhaar, setDAadhaar] = useState('');
  const [dSelfie, setDSelfie] = useState('');
  const [dDlNumber, setDDlNumber] = useState('');
  const [dDlDoc, setDDlDoc] = useState('');
  const [dExp, setDExp] = useState('');
  const [dNote, setDNote] = useState('');

  const resetForm = () => {
    setDName('');
    setDEmail('');
    setDPhone('');
    setDAadhaar('');
    setDSelfie('');
    setDDlNumber('');
    setDDlDoc('');
    setDExp('');
    setDNote('');
    setDriverError('');
  };

  const saveDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!dName.trim() || !dPhone.trim()) {
      setDriverError('Driver name and number are required.');
      return;
    }
    if (dEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dEmail.trim())) {
      setDriverError('Enter a valid email or leave it blank.');
      return;
    }
    if (!dDlNumber.replace(/\s+/g, '').trim() || dDlNumber.replace(/\s+/g, '').length < 8) {
      setDriverError('Enter a valid driving licence number.');
      return;
    }
    if (!dDlDoc) {
      setDriverError('Upload the driving licence.');
      return;
    }
    if (!dAadhaar || !dSelfie) {
      setDriverError('Upload driver Aadhaar and selfie.');
      return;
    }
    if (dExp === '' || Number.isNaN(Number(dExp))) {
      setDriverError('Enter driving experience in years.');
      return;
    }
    setDriverError('');
    try {
      setSaving(true);
      setSuccess('');
      await saveDriverProfile({
        name: dName.trim(),
        email: dEmail.trim(),
        phone: dPhone.trim(),
        aadhaarDoc: dAadhaar,
        selfieDoc: dSelfie,
        dlNumber: dDlNumber.replace(/\s+/g, '').toUpperCase(),
        dlDoc: dDlDoc,
        experienceYears: Number(dExp),
        experienceNote: dNote.trim() || undefined,
        completed: true,
      });
      resetForm();
      setOpen(false);
      setSuccess('Driver added successfully. Pending verification.');
    } catch (err: any) {
      setDriverError(err?.message || 'Could not save driver profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C]">My drivers</h3>
          <p className="text-[10px] text-[#6B6B6B] mt-0.5">Add as many drivers as you need.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen((v) => !v);
            setSuccess('');
          }}
          className="flex items-center gap-1 text-[11px] font-extrabold text-[#F15A24]"
        >
          <Plus className="w-3.5 h-3.5" /> Add driver
        </button>
      </div>

      {success && (
        <p className="text-[11px] font-extrabold text-[#1B6B3A] bg-[#E8F6EE] border border-[#B8E0C6] rounded-2xl p-2.5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </p>
      )}

      {open && (
        <form onSubmit={saveDriver} className="space-y-2 p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
          <input
            value={dName}
            onChange={(e) => setDName(e.target.value)}
            placeholder="Driver name *"
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
          />
          <input
            type="email"
            value={dEmail}
            onChange={(e) => setDEmail(e.target.value)}
            placeholder="Driver email"
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
          />
          <input
            value={dPhone}
            onChange={(e) => setDPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="Driver number *"
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
          />
          <input
            type="number"
            min={0}
            value={dExp}
            onChange={(e) => setDExp(e.target.value)}
            placeholder="Experience (years) *"
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
          />
          <input
            value={dNote}
            onChange={(e) => setDNote(e.target.value)}
            placeholder="Experience note (optional)"
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
          />
          <input
            value={dDlNumber}
            onChange={(e) => setDDlNumber(e.target.value.toUpperCase())}
            placeholder="DL number *"
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold tracking-wide"
          />
          <FilePick label="Driving licence *" value={dDlDoc} capture="environment" onChange={(url) => setDDlDoc(url)} />
          <FilePick label="Driver Aadhaar *" value={dAadhaar} capture="environment" onChange={(url) => setDAadhaar(url)} />
          <FilePick label="Driver selfie *" value={dSelfie} capture="user" onChange={(url) => setDSelfie(url)} />
          {driverError && (
            <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-xl">{driverError}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-2xl brand-gradient text-white text-xs font-extrabold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving driver…
              </>
            ) : (
              'Save driver'
            )}
          </button>
        </form>
      )}

      {drivers.length === 0 && !open && (
        <p className="text-[11px] text-[#6B6B6B]">Add one driver to unlock Post car.</p>
      )}

      {drivers.map((driver, index) => (
        <article
          key={driver.id || `${driver.phone}-${index}`}
          className="p-3 rounded-2xl bg-white border border-[#EBE5D8] space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-1.5">
              <UserRound className="w-3.5 h-3.5 text-[#F15A24]" />
              {driver.name}
            </p>
            <span
              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                (driver.verificationStatus || 'pending_verification') === 'verified'
                  ? 'bg-[#EBF7EE] text-[#00A86B] border-[#BDE8C7]'
                  : driver.verificationStatus === 'blocked'
                    ? 'bg-red-100 text-red-700 border-red-300'
                    : driver.verificationStatus === 'rejected'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {(driver.verificationStatus || 'pending_verification') === 'verified'
                ? 'Verified'
                : driver.verificationStatus === 'blocked'
                  ? 'Blocked'
                  : driver.verificationStatus === 'rejected'
                    ? 'Rejected'
                    : 'Pending verification'}
            </span>
          </div>

          {driver.verificationStatus === 'blocked' && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold">
              <p className="font-extrabold text-red-800">🚫 Your driver is now blocked by admin</p>
              <p className="mt-0.5 text-red-600">{driver.rejectionReason || 'Violated community guidelines'}</p>
              <p className="mt-0.5 text-[10px] text-red-500">Car postings with this driver are hidden from the platform.</p>
            </div>
          )}

          {driver.verificationStatus === 'rejected' && driver.rejectionReason && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
              <p className="font-extrabold text-amber-900">KYC Rejection Note</p>
              <p className="mt-0.5 text-amber-700">{driver.rejectionReason}</p>
            </div>
          )}
          <p className="text-[11px] text-[#6B6B6B]">
            +91 {driver.phone}
            {driver.email ? ` · ${driver.email}` : ''}
          </p>
          <p className="text-[11px] font-bold text-[#1C1C1C]">
            {driver.experienceYears} year{driver.experienceYears === 1 ? '' : 's'} experience
          </p>
          {driver.dlNumber && (
            <p className="text-[11px] font-bold text-[#1C1C1C]">DL {driver.dlNumber}</p>
          )}
          {(driver.aadhaarDoc || driver.selfieDoc || driver.dlDoc) && (
            <div className="flex gap-2">
              {driver.dlDoc &&
                (isPreviewableImage(driver.dlDoc) ? (
                  <img src={driver.dlDoc} alt="DL" className="w-16 h-16 rounded-xl object-cover border border-[#EBE5D8]" />
                ) : (
                  <span className="text-[10px] font-extrabold text-[#00A86B]">DL attached</span>
                ))}
              {driver.aadhaarDoc &&
                (isPreviewableImage(driver.aadhaarDoc) ? (
                  <img src={driver.aadhaarDoc} alt="Aadhaar" className="w-16 h-16 rounded-xl object-cover border border-[#EBE5D8]" />
                ) : (
                  <span className="text-[10px] font-extrabold text-[#00A86B]">Aadhaar attached</span>
                ))}
              {driver.selfieDoc &&
                (isPreviewableImage(driver.selfieDoc) ? (
                  <img src={driver.selfieDoc} alt="Selfie" className="w-16 h-16 rounded-xl object-cover border border-[#EBE5D8]" />
                ) : (
                  <span className="text-[10px] font-extrabold text-[#00A86B]">Selfie attached</span>
                ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
};
