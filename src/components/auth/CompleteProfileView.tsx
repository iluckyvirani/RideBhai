import React, { useRef, useState } from 'react';
import { Camera, FileText, Mail, User, Building, BadgePercent, CheckCircle2, Images, MapPin } from 'lucide-react';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import { uploadToCloudinary, isPreviewableImage } from '../../lib/upload';

const DEMO_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><rect fill="#FFE8DF" width="320" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#F15A24" font-size="18" font-family="sans-serif">Ride Bhai demo</text></svg>'
)}`;

function PhotoPickButtons({
  accept,
  capture,
  onPick,
}: {
  accept: string;
  capture?: 'user' | 'environment';
  onPick: (file: File) => void;
}) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-1.5 grid grid-cols-2 gap-2">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture={capture || 'environment'}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = '';
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        onClick={() => cameraRef.current?.click()}
        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1C1C1C] text-white text-[11px] font-extrabold"
      >
        <Camera className="w-3.5 h-3.5" /> Camera
      </button>
      <button
        type="button"
        onClick={() => galleryRef.current?.click()}
        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FFF0EB] text-[#F15A24] text-[11px] font-extrabold"
      >
        <Images className="w-3.5 h-3.5" /> Gallery
      </button>
    </div>
  );
}

export const CompleteProfileView: React.FC<{ embedded?: boolean }> = ({ embedded }) => {
  const { currentUser, submitUserProfile, logoutUser, setAppView } = useAppStore();
  const rejected = currentUser?.profileStatus === 'rejected';

  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [agencyName, setAgencyName] = useState(currentUser?.agencyName || '');
  const [gstNumber, setGstNumber] = useState(currentUser?.gstNumber || '');
  const [aadhaarDoc, setAadhaarDoc] = useState(currentUser?.aadhaarDoc || '');
  const [aadhaarName, setAadhaarName] = useState(currentUser?.aadhaarName || '');
  const [selfieDoc, setSelfieDoc] = useState(currentUser?.selfieDoc || '');
  const [selfieName, setSelfieName] = useState(currentUser?.selfieName || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');

  const handleFile = async (
    file: File | undefined,
    kind: 'aadhaar' | 'selfie'
  ) => {
    if (!file) return;
    setError('');
    setUploading(kind);
    try {
      const uploaded = await uploadToCloudinary(file);
      if (kind === 'aadhaar') {
        setAadhaarDoc(uploaded.url);
        setAadhaarName(uploaded.name);
      } else {
        setSelfieDoc(uploaded.url);
        setSelfieName(uploaded.name);
      }
    } catch (err: any) {
      setError(err?.message || 'Upload failed. Add Cloudinary keys in server/.env');
    } finally {
      setUploading('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('A valid email is required.');
      return;
    }
    if (!city.trim()) {
      setError('City is required.');
      return;
    }
    if (!aadhaarDoc) {
      setError('Upload your Aadhaar photo or PDF.');
      return;
    }
    if (!selfieDoc) {
      setError('Upload a clear selfie.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await submitUserProfile({
        name,
        email,
        agencyName,
        gstNumber,
        city,
        aadhaarDoc,
        aadhaarName,
        selfieDoc,
        selfieName,
      });
    } catch (err: any) {
      setError(err?.message || 'Could not save profile. Check the API is running.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={embedded ? '' : 'min-h-full flex items-center justify-center p-0 sm:p-4'}>
      <div className={embedded ? 'space-y-4' : 'w-full max-w-[430px] min-h-screen sm:min-h-0 sm:max-h-[880px] overflow-y-auto bg-[#FAF6EE] sm:rounded-[40px] sm:border-8 sm:border-[#222222] p-5 space-y-4'}>
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#F15A24]">
            Step 2 · Profile
          </p>
          <h1 className="text-xl font-extrabold text-[#1C1C1C] mt-1">
            {rejected ? 'Update your profile' : 'Complete your profile'}
          </h1>
          <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
            Required: name, email, city, Aadhaar upload, selfie. GST and travel agency name are optional.
            After this you can browse the app. Booking cars and tours needs admin verification plus a plan.
          </p>
        </div>

        {rejected && (
          <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-xs font-bold text-red-700 space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-wider">Admin note</p>
            <p>{currentUser?.rejectionReason || 'Your documents were rejected. Upload clearer photos and resubmit.'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 bg-white rounded-3xl border border-[#EBE5D8] p-4">
          <label className="block">
            <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
              <User className="w-3 h-3" /> Full name *
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              placeholder="e.g. Rahul Sharma"
              required
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email *
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              placeholder="you@email.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
              <MapPin className="w-3 h-3" /> City *
            </span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              list="ridebhai-profile-cities"
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              placeholder="e.g. Jaipur"
              required
            />
            <datalist id="ridebhai-profile-cities">
              {POPULAR_CITIES.map((c) => (
                <option key={c.name} value={c.name} />
              ))}
            </datalist>
          </label>

          <div>
            <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
              <FileText className="w-3 h-3" /> Aadhaar upload *
            </span>
            <PhotoPickButtons
              accept="image/*,.pdf"
              capture="environment"
              onPick={(file) => handleFile(file, 'aadhaar')}
            />
            <button
              type="button"
              onClick={() => {
                setAadhaarDoc(DEMO_IMAGE);
                setAadhaarName('demo-aadhaar.svg');
              }}
              className="mt-1.5 text-[11px] font-extrabold text-[#F15A24]"
            >
              Use demo Aadhaar
            </button>
            {uploading === 'aadhaar' && (
              <p className="text-[11px] font-bold text-[#F15A24] mt-1">Uploading your Aadhaar…</p>
            )}
            {aadhaarDoc && (
              <p className="text-[11px] font-bold text-[#00A86B] mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {aadhaarName || 'Aadhaar attached'}
              </p>
            )}
            {isPreviewableImage(aadhaarDoc) && (
              <img src={aadhaarDoc} alt="Aadhaar preview" className="mt-2 h-20 rounded-xl object-cover" />
            )}
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
              <Camera className="w-3 h-3" /> Selfie upload *
            </span>
            <PhotoPickButtons
              accept="image/*"
              capture="user"
              onPick={(file) => handleFile(file, 'selfie')}
            />
            <button
              type="button"
              onClick={() => {
                setSelfieDoc(DEMO_IMAGE);
                setSelfieName('demo-selfie.svg');
              }}
              className="mt-1.5 text-[11px] font-extrabold text-[#F15A24]"
            >
              Use demo selfie
            </button>
            {uploading === 'selfie' && (
              <p className="text-[11px] font-bold text-[#F15A24] mt-1">Uploading your selfie…</p>
            )}
            {selfieDoc && (
              <p className="text-[11px] font-bold text-[#00A86B] mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {selfieName || 'Selfie attached'}
              </p>
            )}
            {isPreviewableImage(selfieDoc) && (
              <img src={selfieDoc} alt="Selfie preview" className="mt-2 h-20 w-20 rounded-full object-cover" />
            )}
          </div>

          <label className="block">
            <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
              <Building className="w-3 h-3" /> Travel agency name <span className="text-[#9A9A9A]">optional</span>
            </span>
            <input
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              placeholder="e.g. Royal Rajasthan Tours"
            />
          </label>

          <label className="block">
            <span className="text-[10px] font-extrabold uppercase text-[#6B6B6B] flex items-center gap-1">
              <BadgePercent className="w-3 h-3" /> GST number <span className="text-[#9A9A9A]">optional</span>
            </span>
            <input
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              placeholder="22AAAAA0000A1Z5"
            />
          </label>

          {error && (
            <p className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-2xl brand-gradient text-white text-xs font-extrabold disabled:opacity-50"
          >
            {saving ? 'Saving…' : rejected ? 'Resubmit profile' : 'Create profile & enter app'}
          </button>
        </form>

        <p className="text-[11px] text-center text-[#6B6B6B]">
          Logged in as +91 {currentUser?.phone}
        </p>
        {!embedded && (
          <button
            type="button"
            onClick={() => {
              logoutUser();
              setAppView('landing');
            }}
            className="w-full text-[11px] font-extrabold text-[#6B6B6B]"
          >
            Use a different number
          </button>
        )}
      </div>
    </div>
  );
};
