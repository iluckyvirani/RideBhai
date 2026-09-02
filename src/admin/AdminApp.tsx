import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShieldCheck,
  PackageCheck,
  AlertTriangle,
  ArrowLeft,
  Lock,
  RefreshCw,
  Car,
  Building,
  MapPin,
  Phone
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { useAppStore } from '../store/useAppStore';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { DriverVerificationQueue } from '../components/admin/DriverVerificationQueue';
import { PackageManager } from '../components/admin/PackageManager';
import { DriverBoostStatusList } from '../components/admin/DriverBoostStatusList';
import { DisputeResolutionView } from '../components/admin/DisputeResolutionView';
import { AgencyVerificationQueue } from '../components/admin/AgencyVerificationQueue';
import { AllAgenciesView } from '../components/admin/AllAgenciesView';
import { AgencyTourPostsManager } from '../components/admin/AgencyTourPostsManager';
import { AgencyPackageManager } from '../components/admin/AgencyPackageManager';
import { AllCarListingsView } from '../components/admin/AllCarListingsView';
import { AllInquiriesView } from '../components/admin/AllInquiriesView';

interface AdminAppProps {
  onExitToWebsite: () => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onExitToWebsite }) => {
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'verifications'
    | 'agency-kyc'
    | 'all-agencies'
    | 'agency-tours'
    | 'agency-packages'
    | 'packages'
    | 'boosts'
    | 'disputes'
    | 'all-cars'
    | 'all-inquiries'
  >('dashboard');

  const {
    drivers,
    disputes,
    agencies,
    agencyTripPosts,
    carListings,
    inquiries,
    resetDemoData,
  } = useAppStore();

  const pendingDriverKycCount = drivers.filter((d) => d.status === 'pending_verification').length;
  const pendingAgencyKycCount = agencies.filter((a) => a.status === 'pending_verification').length;
  const openDisputesCount = disputes.filter((d) => d.status === 'open').length;

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C1C1C] flex flex-col font-sans selection:bg-[#F15A24] selection:text-white">
      {/* Top Admin Topbar */}
      <header className="bg-[#1C1C1C] text-white border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand & Admin Badge */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onExitToWebsite}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-all active-press"
                title="Back to Landing Page"
              >
                <ArrowLeft className="w-4 h-4 text-[#FF7A45]" />
                <span className="hidden sm:inline">Exit to Website</span>
              </button>

              <div className="h-6 w-px bg-white/20" />

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F15A24] flex items-center justify-center text-white font-extrabold text-xs">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm font-extrabold text-white leading-tight">
                    Ride Bhai Operations Admin
                  </h1>
                  <p className="text-[10px] text-white/50 hidden sm:block">
                    Partners, full-car listings & tour packages
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Quick actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset entire demo state to initial seed data?')) {
                    resetDemoData();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Demo Data</span>
              </button>

              <div className="px-3 py-1 rounded-full bg-[#00A86B]/20 text-[#00A86B] border border-[#00A86B]/30 text-[10px] font-extrabold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-ping" />
                <span>Live Admin Session</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Bar */}
      <div className="bg-white border-b border-[#EBE5D8] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('all-inquiries')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'all-inquiries'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>Inquiries ({inquiries.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('all-cars')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'all-cars'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Car listings ({carListings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('agency-kyc')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 relative ${
                activeTab === 'agency-kyc'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#F15A24]" />
              <span>Firm KYC</span>
              {pendingAgencyKycCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F15A24] text-white text-[10px] font-extrabold flex items-center justify-center ml-1">
                  {pendingAgencyKycCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('all-agencies')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'all-agencies'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Partner firms</span>
            </button>

            <button
              onClick={() => setActiveTab('agency-tours')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'agency-tours'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Tours ({agencyTripPosts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('verifications')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 relative ${
                activeTab === 'verifications'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Partner KYC</span>
              {pendingDriverKycCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#F15A24] text-white text-[10px] font-extrabold flex items-center justify-center ml-1">
                  {pendingDriverKycCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('agency-packages')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'agency-packages'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <PackageCheck className="w-4 h-4 text-emerald-600" />
              <span>Posting plans</span>
            </button>

            <button
              onClick={() => setActiveTab('disputes')}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all flex items-center gap-2 flex-shrink-0 ${
                activeTab === 'disputes'
                  ? 'bg-[#1C1C1C] text-white shadow-xs'
                  : 'text-[#6B6B6B] hover:text-[#1C1C1C] hover:bg-[#FAF6EE]'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Disputes</span>
              {openDisputesCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center ml-1">
                  {openDisputesCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-card">
          {activeTab === 'dashboard' && <AdminDashboard onSwitchRole={() => {}} />}
          {activeTab === 'all-inquiries' && <AllInquiriesView />}
          {activeTab === 'all-cars' && <AllCarListingsView />}
          {activeTab === 'verifications' && <DriverVerificationQueue />}
          {activeTab === 'agency-kyc' && <AgencyVerificationQueue />}
          {activeTab === 'all-agencies' && <AllAgenciesView />}
          {activeTab === 'agency-tours' && <AgencyTourPostsManager />}
          {activeTab === 'agency-packages' && <AgencyPackageManager />}
          {activeTab === 'packages' && <PackageManager />}
          {activeTab === 'boosts' && <DriverBoostStatusList />}
          {activeTab === 'disputes' && <DisputeResolutionView />}
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-[#EBE5D8] py-4 text-center text-xs text-[#6B6B6B]">
        <span>Ride Bhai Admin · Partners, full-car listings & tour packages</span>
      </footer>
    </div>
  );
};
