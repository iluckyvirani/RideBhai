import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { NotificationsModal } from './components/layout/NotificationsModal';
import { AuthModal } from './components/auth/AuthModal';
import { LandingPage } from './components/landing/LandingPage';
import { AdminApp } from './admin/AdminApp';
import { RiderProfileView } from './components/rider/RiderProfileView';
import { CarsBrowseView } from './components/rider/CarsBrowseView';
import { ToursBrowseView } from './components/rider/ToursBrowseView';
import { InquiriesView } from './components/common/InquiriesView';
import { PartnerProfileView } from './components/partner/PartnerProfileView';
import { PostCarModal } from './components/partner/PostCarModal';
import { PostAgencyTripModal } from './components/agency/PostAgencyTripModal';
import { DriverVerificationView } from './components/driver/DriverVerificationView';
import { AgencyVerificationView } from './components/agency/AgencyVerificationView';
import { AgencyPackagesView } from './components/agency/AgencyPackagesView';

export function App() {
  const {
    appView,
    setAppView,
    role,
    setRole,
    isPartnerLoggedIn,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('cars');
  const [filter, setFilter] = useState({ fromCity: '', toCity: '' });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPostCarOpen, setIsPostCarOpen] = useState(false);
  const [isPostTourOpen, setIsPostTourOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    role: 'rider' | 'partner';
    title?: string;
    subtitle?: string;
    onSuccess?: () => void;
  }>({ isOpen: false, role: 'rider' });

  const openPartner = () => {
    if (!isPartnerLoggedIn) {
      setAuthModalConfig({
        isOpen: true,
        role: 'partner',
        title: 'Partner login',
        subtitle: 'One login to post cars and tour packages',
        onSuccess: () => {
          setRole('partner');
          setActiveTab('cars');
          setAppView('partner-app');
        },
      });
      return;
    }
    setRole('partner');
    setActiveTab('cars');
    setAppView('partner-app');
  };

  const openRider = () => {
    setRole('rider');
    setActiveTab('cars');
    setAppView('rider-app');
  };

  const handleLandingSearch = (params: {
    fromCity: string;
    toCity: string;
    date: string;
    seats: number;
    tab?: 'cars' | 'tours';
  }) => {
    setFilter({ fromCity: params.fromCity, toCity: params.toCity });
    setRole('rider');
    setActiveTab(params.tab === 'tours' ? 'tours' : 'cars');
    setAppView('rider-app');
  };

  const handleRoleChange = (newRole: any) => {
    if (newRole === 'admin') {
      setAppView('admin-portal');
      return;
    }
    if (newRole === 'partner' || newRole === 'driver' || newRole === 'agency') {
      if (!isPartnerLoggedIn) {
        setAuthModalConfig({
          isOpen: true,
          role: 'partner',
          onSuccess: () => {
            setRole('partner');
            setActiveTab('profile');
            setAppView('partner-app');
          },
        });
        return;
      }
      setRole('partner');
      setActiveTab('profile');
      setAppView('partner-app');
      return;
    }
    setRole('rider');
    setActiveTab('cars');
    setAppView('rider-app');
  };

  const isPartnerShell = appView === 'partner-app' || role === 'partner' || role === 'driver' || role === 'agency';

  if (appView === 'landing') {
    return (
      <>
        <LandingPage
          onSearchInitiated={handleLandingSearch}
          onOpenDriverPortal={openPartner}
          onOpenRiderPortal={openRider}
          onOpenAgencyPortal={openPartner}
          onOpenAdminPortal={() => setAppView('admin-portal')}
        />
        <AuthModal
          isOpen={authModalConfig.isOpen}
          onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
          targetRole={authModalConfig.role}
          title={authModalConfig.title}
          subtitle={authModalConfig.subtitle}
          onSuccess={authModalConfig.onSuccess}
        />
      </>
    );
  }

  if (appView === 'admin-portal') {
    return <AdminApp onExitToWebsite={() => setAppView('landing')} />;
  }

  const getHeaderTitle = () => {
    if (activeTab === 'bookings') return 'Bookings';
    if (activeTab === 'cars') return 'Cars · All India';
    if (activeTab === 'tours') return 'Tour packages';
    if (activeTab === 'profile') return isPartnerShell ? 'Partner profile' : 'Profile';
    if (activeTab === 'verification') return 'KYC verification';
    if (activeTab === 'packages') return 'Packages & plans';
    return 'Ride Bhai';
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-0 sm:p-4 selection:bg-[#F15A24] selection:text-white">
      <div className="w-full max-w-[430px] h-screen sm:h-[880px] bg-[#FAF6EE] text-[#1C1C1C] flex flex-col relative sm:rounded-[40px] shadow-2xl overflow-hidden border-0 sm:border-8 sm:border-[#222222]">
        <AppHeader
          title={getHeaderTitle()}
          onExitToLanding={() => setAppView('landing')}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
          {activeTab === 'bookings' && (
            <InquiriesView mode={isPartnerShell ? 'partner' : 'rider'} />
          )}

          {activeTab === 'cars' && (
            <CarsBrowseView
              initialFrom={filter.fromCity}
              initialTo={filter.toCity}
              canPost={isPartnerShell}
              onPostCar={() => {
                if (!isPartnerLoggedIn) {
                  setAuthModalConfig({
                    isOpen: true,
                    role: 'partner',
                    onSuccess: () => setIsPostCarOpen(true),
                  });
                } else {
                  setIsPostCarOpen(true);
                }
              }}
            />
          )}

          {activeTab === 'tours' && (
            <ToursBrowseView
              initialFrom={filter.fromCity}
              initialTo={filter.toCity}
              canPost={isPartnerShell}
              onPostTour={() => {
                if (!isPartnerLoggedIn) {
                  setAuthModalConfig({
                    isOpen: true,
                    role: 'partner',
                    onSuccess: () => setIsPostTourOpen(true),
                  });
                } else {
                  setIsPostTourOpen(true);
                }
              }}
            />
          )}

          {activeTab === 'profile' &&
            (isPartnerShell ? (
              <PartnerProfileView
                onSwitchRole={handleRoleChange}
                onOpenVerification={() => setActiveTab('verification')}
                onOpenPackages={() => setActiveTab('packages')}
              />
            ) : (
              <RiderProfileView onSwitchRole={handleRoleChange} />
            ))}

          {activeTab === 'verification' && isPartnerShell && (
            <div className="space-y-6">
              <DriverVerificationView />
              <AgencyVerificationView />
            </div>
          )}

          {activeTab === 'packages' && isPartnerShell && <AgencyPackagesView />}
        </main>

        {activeTab !== 'verification' && activeTab !== 'packages' ? (
          <BottomNav
            role={isPartnerShell ? 'partner' : 'rider'}
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
          />
        ) : (
          <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto p-3">
            <button
              onClick={() => setActiveTab('profile')}
              className="w-full py-3 rounded-2xl bg-white border border-[#EBE5D8] text-xs font-extrabold"
            >
              Back to profile
            </button>
          </div>
        )}

        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        <PostCarModal
          isOpen={isPostCarOpen}
          onClose={() => setIsPostCarOpen(false)}
          onPosted={() => setActiveTab('cars')}
          onOpenPackages={() => {
            setIsPostCarOpen(false);
            setActiveTab('packages');
          }}
        />

        <PostAgencyTripModal
          isOpen={isPostTourOpen}
          onClose={() => setIsPostTourOpen(false)}
          onOpenVerification={() => {
            setIsPostTourOpen(false);
            setActiveTab('verification');
          }}
          onOpenPackages={() => {
            setIsPostTourOpen(false);
            setActiveTab('packages');
          }}
          onTripCreated={() => setActiveTab('tours')}
        />

        <AuthModal
          isOpen={authModalConfig.isOpen}
          onClose={() => setAuthModalConfig((prev) => ({ ...prev, isOpen: false }))}
          targetRole={authModalConfig.role}
          title={authModalConfig.title}
          subtitle={authModalConfig.subtitle}
          onSuccess={authModalConfig.onSuccess}
        />
      </div>
    </div>
  );
}
