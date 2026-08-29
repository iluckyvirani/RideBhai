import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Upload,
  FileCheck,
  Building,
  CreditCard,
  FileText,
  UserCheck,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AgencyDocuments } from '../../types';

export const AgencyVerificationView: React.FC = () => {
  const { currentAgency, submitAgencyVerification } = useAppStore();

  const [gstNumber, setGstNumber] = useState(currentAgency.documents?.gstNumber || '');
  const [panNumber, setPanNumber] = useState(currentAgency.documents?.panNumber || '');
  const [tradeLicenseNumber, setTradeLicenseNumber] = useState(
    currentAgency.documents?.tradeLicenseNumber || ''
  );
  const [ownerAadhaarNumber, setOwnerAadhaarNumber] = useState(
    currentAgency.documents?.ownerAadhaarNumber || ''
  );

  const [gstFileUploaded, setGstFileUploaded] = useState(Boolean(currentAgency.documents?.gstDoc));
  const [panFileUploaded, setPanFileUploaded] = useState(Boolean(currentAgency.documents?.panDoc));
  const [tradeLicenseUploaded, setTradeLicenseUploaded] = useState(
    Boolean(currentAgency.documents?.tradeLicenseDoc)
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const docPayload: AgencyDocuments = {
      gstNumber,
      gstDoc: gstFileUploaded
        ? currentAgency.documents?.gstDoc ||
          'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=500&auto=format&fit=crop&q=60'
        : undefined,
      panNumber,
      panDoc: panFileUploaded
        ? currentAgency.documents?.panDoc ||
          'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=500&auto=format&fit=crop&q=60'
        : undefined,
      tradeLicenseNumber,
      tradeLicenseDoc: tradeLicenseUploaded
        ? currentAgency.documents?.tradeLicenseDoc ||
          'https://images.unsplash.com/photo-1618042164219-62c820f10723?w=500&auto=format&fit=crop&q=60'
        : undefined,
      ownerAadhaarNumber,
      submittedAt: new Date().toISOString(),
    };

    submitAgencyVerification(currentAgency.id, docPayload);
    setIsSubmitting(false);
    setSuccessMsg('KYC documents submitted successfully! Admin review in progress.');
  };

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Top Header Card */}
      <div className="p-4 rounded-3xl bg-[#1C1C1C] text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF7A45]">
              Compliance & Trust
            </span>
            <h1 className="text-base font-extrabold text-white mt-0.5">
              Agency KYC Verification
            </h1>
            <p className="text-xs text-white/70 mt-1">
              Verify your business documents to unlock tour postings
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF7A45]">
            <Building className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Status Alert Banner */}
      {currentAgency.status === 'verified' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-emerald-900">
              Agency KYC Verified & Approved 🎉
            </h3>
            <p className="text-[11px] text-emerald-700 mt-0.5 leading-relaxed">
              Your travel agency is officially certified on Ride Bhai. You have full clearance to publish intercity tours & booking leads to verified drivers.
            </p>
          </div>
        </div>
      )}

      {currentAgency.status === 'pending_verification' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-spin" />
          <div>
            <h3 className="text-xs font-bold text-amber-900">
              Documents Under Admin Review ⏳
            </h3>
            <p className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
              Your GST, Trade License, and PAN certificates have been submitted. Our compliance team will approve your profile within 1-2 hours.
            </p>
          </div>
        </div>
      )}

      {currentAgency.status === 'rejected' && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-rose-900">
              Verification Rejected
            </h3>
            <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
              Reason: {currentAgency.rejectionReason || 'Please re-upload a clear copy of your business GST and Trade License.'}
            </p>
          </div>
        </div>
      )}

      {currentAgency.status === 'unverified' && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-[#F15A24] flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-[#8A2B09]">
              Documents Not Submitted Yet
            </h3>
            <p className="text-[11px] text-[#A33B12] mt-0.5 leading-relaxed">
              Please enter your business registration and upload certificates below to activate your agency posting account.
            </p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="p-5 rounded-3xl bg-white border border-[#EBE5D8] shadow-card space-y-4">
        <h2 className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[#F15A24]" />
          <span>Business Registration & Tax ID</span>
        </h2>

        {/* GSTIN Input & Doc */}
        <div>
          <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
            GSTIN (Goods and Services Tax Number) *
          </label>
          <div className="relative">
            <CreditCard className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
            <input
              type="text"
              value={gstNumber}
              onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
              placeholder="e.g. 08AAAAA0000A1Z5"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all uppercase"
            />
          </div>
          <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6EE] border border-dashed border-[#DCD5C5]">
            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#F15A24]" />
              GST Certificate (PDF / JPG)
            </span>
            <button
              type="button"
              onClick={() => setGstFileUploaded(!gstFileUploaded)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                gstFileUploaded
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#1C1C1C] text-white'
              }`}
            >
              {gstFileUploaded ? '✓ Uploaded' : 'Upload File'}
            </button>
          </div>
        </div>

        {/* Business PAN */}
        <div>
          <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
            Company / Firm PAN Number *
          </label>
          <div className="relative">
            <FileText className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
            <input
              type="text"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              placeholder="e.g. AAACR1234F"
              required
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all uppercase"
            />
          </div>
          <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6EE] border border-dashed border-[#DCD5C5]">
            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#F15A24]" />
              PAN Card Copy
            </span>
            <button
              type="button"
              onClick={() => setPanFileUploaded(!panFileUploaded)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                panFileUploaded
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#1C1C1C] text-white'
              }`}
            >
              {panFileUploaded ? '✓ Uploaded' : 'Upload File'}
            </button>
          </div>
        </div>

        {/* Trade License / Shop & Establishment Act */}
        <div>
          <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
            Trade License / Municipal Shop Act Registration
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
            <input
              type="text"
              value={tradeLicenseNumber}
              onChange={(e) => setTradeLicenseNumber(e.target.value)}
              placeholder="e.g. TL-JPR-2024-8891"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
            />
          </div>
          <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6EE] border border-dashed border-[#DCD5C5]">
            <span className="text-[11px] text-[#6B6B6B] flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#F15A24]" />
              Trade License Certificate
            </span>
            <button
              type="button"
              onClick={() => setTradeLicenseUploaded(!tradeLicenseUploaded)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                tradeLicenseUploaded
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#1C1C1C] text-white'
              }`}
            >
              {tradeLicenseUploaded ? '✓ Uploaded' : 'Upload File'}
            </button>
          </div>
        </div>

        {/* Owner / Authorized Signatory Aadhaar */}
        <div>
          <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
            Owner / Director Aadhaar Number
          </label>
          <div className="relative">
            <UserCheck className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
            <input
              type="text"
              value={ownerAadhaarNumber}
              onChange={(e) => setOwnerAadhaarNumber(e.target.value)}
              placeholder="e.g. XXXX-XXXX-4589"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F15A24] to-[#FF7A45] hover:opacity-95 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active-press"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>
              {currentAgency.status === 'verified'
                ? 'Update Documents'
                : 'Submit for Admin Verification'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
