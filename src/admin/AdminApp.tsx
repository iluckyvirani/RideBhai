import React, { useState } from 'react';
import { LayoutDashboard, ShieldCheck, ArrowLeft, Lock, Car, MapPin, Phone } from 'lucide-react';
import { AdminOpsHome } from '../components/admin/AdminOpsHome';
import { AgencyTourPostsManager } from '../components/admin/AgencyTourPostsManager';
import { AllCarListingsView } from '../components/admin/AllCarListingsView';
import { RideBhaiDealsQueue } from '../components/admin/RideBhaiDealsQueue';
import { UserKycQueue } from '../components/admin/UserKycQueue';

interface AdminAppProps {
  onExitToWebsite: () => void;
}

type AdminTab = 'dashboard' | 'user-kyc' | 'deals' | 'cars' | 'tours';

function isAdminSession() {
  try {
    return localStorage.getItem('ridebhai_is_admin') === '1';
  } catch {
    return false;
  }
}

export const AdminApp: React.FC<AdminAppProps> = ({ onExitToWebsite }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const admin = isAdminSession();

  const nav: { id: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-kyc', label: 'User KYC', icon: ShieldCheck },
    { id: 'deals', label: 'Ride Bhai deals', icon: Phone },
    { id: 'cars', label: 'All cars', icon: Car },
    { id: 'tours', label: 'All tours', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#1C1C1C] flex flex-col font-sans">
      <header className="bg-[#1C1C1C] text-white border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onExitToWebsite}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold"
              >
                <ArrowLeft className="w-4 h-4 text-[#FF7A45]" />
                <span className="hidden sm:inline">Exit to Website</span>
              </button>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F15A24] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-sm font-extrabold leading-tight">Ride Bhai Admin</h1>
                  <p className="text-[10px] text-white/50 hidden sm:block">Neon ops · do not use :5174</p>
                </div>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#00A86B]/20 text-[#00A86B] border border-[#00A86B]/30 text-[10px] font-extrabold">
              {admin ? 'Admin session' : 'Not admin'}
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-[#EBE5D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 flex-shrink-0 ${
                    activeTab === item.id ? 'bg-[#1C1C1C] text-white' : 'text-[#6B6B6B] hover:bg-[#FAF6EE]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5D8] shadow-card">
          {!admin && (
            <p className="mb-4 text-xs font-bold text-[#8A2B09] bg-[#FFF0EB] border border-[#FFD8CB] rounded-2xl p-3">
              Login on the website as 9999999999 / OTP 4829, then open Admin from the landing footer.
            </p>
          )}
          {activeTab === 'dashboard' && (
            <AdminOpsHome
              onOpen={(tab) =>
                setActiveTab(tab === 'user-kyc' ? 'user-kyc' : tab === 'deals' ? 'deals' : tab === 'cars' ? 'cars' : 'tours')
              }
            />
          )}
          {activeTab === 'user-kyc' && <UserKycQueue />}
          {activeTab === 'deals' && <RideBhaiDealsQueue />}
          {activeTab === 'cars' && <AllCarListingsView />}
          {activeTab === 'tours' && <AgencyTourPostsManager />}
        </div>
      </main>
    </div>
  );
};
