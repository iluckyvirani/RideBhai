import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { SplashScreen } from './components/common/SplashScreen';
import { OnboardingView } from './components/common/OnboardingView';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { NotificationsModal } from './components/layout/NotificationsModal';
import { BookingSuccessModal } from './components/rider/BookingSuccessModal';
import { PostRideModal } from './components/driver/PostRideModal';
import { AuthModal } from './components/auth/AuthModal';

// Landing Page & Decoupled Admin
import { LandingPage } from './components/landing/LandingPage';
import { AdminApp } from './admin/AdminApp';

// Rider Views
import { RiderHome } from './components/rider/RiderHome';
import { SearchResults } from './components/rider/SearchResults';
import { RideDetailView } from './components/rider/RideDetailView';
import { MyBookingsView } from './components/rider/MyBookingsView';
import { RiderChatView } from './components/rider/RiderChatView';
import { RiderProfileView } from './components/rider/RiderProfileView';

// Driver Views
import { DriverHome } from './components/driver/DriverHome';
import { ManageBookingsView } from './components/driver/ManageBookingsView';
import { DriverPackagesView } from './components/driver/DriverPackagesView';
import { DriverVerificationView } from './components/driver/DriverVerificationView';
import { DriverProfileView } from './components/driver/DriverProfileView';
import { AgencyToursFeed } from './components/driver/AgencyToursFeed';

// Travel Agency Views
import { AgencyDashboard } from './components/agency/AgencyDashboard';
import { AgencyVerificationView } from './components/agency/AgencyVerificationView';
import { AgencyPackagesView } from './components/agency/AgencyPackagesView';
import { PostAgencyTripModal } from './components/agency/PostAgencyTripModal';

export function App() {
  const {
    appView,
    setAppView,
    role,
    setRole,
    bookings,
    currentDriver,
    currentAgency,
    isDriverLoggedIn,
    isRiderLoggedIn,
    isAgencyLoggedIn,
    agencyTripPosts,
  } = useAppStore();

  const [showSplash, setShowSplash] = useState(false);
  const [activeTab, setActiveTab] = useState('search');
  const [activeScreen, setActiveScreen] = useState<'main' | 'search-results' | 'ride-detail'>('main');

  // Auth Modal trigger
  const [authModalConfig, setAuthModalConfig] = useState<{
    isOpen: boolean;
    role: 'rider' | 'driver' | 'agency';
    title?: string;
    subtitle?: string;
    onSuccess?: () => void;
  }>({
    isOpen: false,
    role: 'rider',
  });

  // Search filter state
  const [searchParams, setSearchParams] = useState({
    fromCity: 'Delhi NCR',
    toCity: 'Jaipur',
    date: new Date().toISOString().split('T')[0],
    seats: 1,
  });

  // Selected details
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string | null>(null);

  // Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPostRideOpen, setIsPostRideOpen] = useState(false);
  const [isPostAgencyTripOpen, setIsPostAgencyTripOpen] = useState(false);
  const [isBookingSuccessOpen, setIsBookingSuccessOpen] = useState(false);

  // Navigation handlers from Landing Website
  const handleLandingSearch = (params: { fromCity: string; toCity: string; date: string; seats: number }) => {
    setSearchParams(params);
    setRole('rider');
    setActiveTab('search');
    setActiveScreen('search-results');
    setAppView('rider-app');
  };

  const handleLandingOpenRiderPortal = () => {
    setRole('rider');
    setActiveTab('search');
    setActiveScreen('main');
    setAppView('rider-app');
  };

  const handleLandingOpenDriverPortal = () => {
    if (!isDriverLoggedIn) {
      setAuthModalConfig({
        isOpen: true,
        role: 'driver',
        title: 'Driver Partner Registration',
        subtitle: 'Enter mobile number & name to start onboarding',
        onSuccess: () => {
          setRole('driver');
          setActiveTab('verification');
          setActiveScreen('main');
          setAppView('driver-app');
        },
      });
    } else {
      setRole('driver');
      if (currentDriver.status === 'unverified' || currentDriver.status === 'pending_verification') {
        setActiveTab('verification');
      } else {
        setActiveTab('my-rides');
      }
      setActiveScreen('main');
      setAppView('driver-app');
    }
  };

  const handleLandingOpenAgencyPortal = () => {
    if (!isAgencyLoggedIn) {
      setAuthModalConfig({
        isOpen: true,
        role: 'agency',
        title: 'Travel Agency Partner Portal',
        subtitle: 'Register your travel firm to broadcast pre-booked tours to drivers',
        onSuccess: () => {
          setRole('agency');
          setActiveTab('agency-home');
          setActiveScreen('main');
          setAppView('agency-app');
        },
      });
    } else {
      setRole('agency');
      setActiveTab('agency-home');
      setActiveScreen('main');
      setAppView('agency-app');
    }
  };

  const handleRoleChange = (newRole: any) => {
    setRole(newRole);
    if (newRole === 'rider') {
      setActiveTab('search');
      setAppView('rider-app');
    } else if (newRole === 'driver') {
      if (currentDriver.status === 'unverified' || currentDriver.status === 'pending_verification') {
        setActiveTab('verification');
      } else {
        setActiveTab('my-rides');
      }
      setAppView('driver-app');
    } else if (newRole === 'agency') {
      setActiveTab('agency-home');
      setAppView('agency-app');
    } else if (newRole === 'admin') {
      setAppView('admin-portal');
    }
    setActiveScreen('main');
  };

  // Rider Flow Triggers
  const handleSelectRide = (rideId: string) => {
    setSelectedRideId(rideId);
    setActiveScreen('ride-detail');
  };

  const handleBookSuccess = (bookingId: string) => {
    setConfirmedBookingId(bookingId);
    setIsBookingSuccessOpen(true);
  };

  const handleOpenChat = (rideId: string) => {
    setSelectedRideId(rideId);
    setActiveTab('chat');
    setActiveScreen('main');
  };

  // Pending badge counters
  const pendingRequestsCount = bookings.filter(
    (b) => b.driverId === currentDriver.id && b.status === 'pending'
  ).length;

  const openAgencyLeadsCount = agencyTripPosts.filter((p) => p.status === 'active').length;

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // 1. LANDING WEBSITE VIEW
  if (appView === 'landing') {
    return (
      <>
        <LandingPage
          onSearchInitiated={handleLandingSearch}
          onOpenDriverPortal={handleLandingOpenDriverPortal}
          onOpenRiderPortal={handleLandingOpenRiderPortal}
          onOpenAgencyPortal={handleLandingOpenAgencyPortal}
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

  // 2. DECOUPLED ADMIN PORTAL VIEW
  if (appView === 'admin-portal') {
    return <AdminApp onExitToWebsite={() => setAppView('landing')} />;
  }

  // Header Title Resolver for in-app mobile experience
  const getHeaderTitle = () => {
    if (activeScreen === 'search-results') return 'Available Rides';
    if (activeScreen === 'ride-detail') return 'Ride Details';
    if (role === 'rider') {
      if (activeTab === 'bookings') return 'My Bookings';
      if (activeTab === 'chat') return 'Driver Messages';
      if (activeTab === 'profile') return 'Rider Profile';
      return '';
    }
    if (role === 'driver') {
      if (activeTab === 'my-rides') return 'Driver Dashboard';
      if (activeTab === 'agency-tours') return 'Agency Tour Leads';
      if (activeTab === 'requests') return 'Passenger Requests';
      if (activeTab === 'packages') return 'Boost & Earnings';
      if (activeTab === 'verification') return 'Driver KYC';
      if (activeTab === 'profile') return 'Driver Profile';
      return 'Driver Center';
    }
    if (role === 'agency') {
      if (activeTab === 'agency-home') return 'Agency Dashboard';
      if (activeTab === 'agency-kyc') return 'Agency KYC Verification';
      if (activeTab === 'agency-packages') return 'Posting Packages Store';
      if (activeTab === 'agency-profile') return 'Agency Profile';
      return 'Travel Agency Portal';
    }
    return '';
  };

  // 3. IN-APP MOBILE VIEW (Rider App, Driver App, or Travel Agency App)
  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-0 sm:p-4 selection:bg-[#F15A24] selection:text-white">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-[430px] h-screen sm:h-[880px] bg-[#FAF6EE] text-[#1C1C1C] flex flex-col relative sm:rounded-[40px] shadow-2xl overflow-hidden border-0 sm:border-8 sm:border-[#222222]">
        
        {/* Top App Header with "Back to Website" integration */}
        <div>
          <AppHeader
            title={getHeaderTitle()}
            showBack={activeScreen !== 'main'}
            onBack={() => {
              if (activeScreen === 'ride-detail') setActiveScreen('search-results');
              else setActiveScreen('main');
            }}
            onExitToLanding={() => setAppView('landing')}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        </div>

        {/* Main Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 pt-3 pb-20">
          {/* Rider Mode Screens */}
          {role === 'rider' && (
            <>
              {activeScreen === 'main' && (
                <>
                  {activeTab === 'search' && (
                    <RiderHome
                      onSearch={(params) => {
                        setSearchParams(params);
                        setActiveScreen('search-results');
                      }}
                      onSelectRide={handleSelectRide}
                    />
                  )}
                  {activeTab === 'bookings' && (
                    <MyBookingsView onOpenChat={handleOpenChat} />
                  )}
                  {activeTab === 'chat' && (
                    <RiderChatView selectedRideId={selectedRideId || undefined} />
                  )}
                  {activeTab === 'profile' && (
                    <RiderProfileView onSwitchRole={handleRoleChange} />
                  )}
                </>
              )}

              {activeScreen === 'search-results' && (
                <SearchResults
                  searchParams={searchParams}
                  onSelectRide={handleSelectRide}
                  onOpenChat={handleOpenChat}
                />
              )}

              {activeScreen === 'ride-detail' && selectedRideId && (
                <RideDetailView
                  rideId={selectedRideId}
                  onBookSuccess={handleBookSuccess}
                  onOpenChat={handleOpenChat}
                />
              )}
            </>
          )}

          {/* Driver Mode Screens */}
          {role === 'driver' && (
            <>
              {activeTab === 'my-rides' && (
                <DriverHome
                  onPostRideClick={() => {
                    if (!isDriverLoggedIn) {
                      setAuthModalConfig({
                        isOpen: true,
                        role: 'driver',
                        title: 'Driver Login Required',
                        subtitle: 'Verify mobile to publish your ride schedule',
                        onSuccess: () => setIsPostRideOpen(true),
                      });
                    } else {
                      setIsPostRideOpen(true);
                    }
                  }}
                  onViewRequestsClick={() => setActiveTab('requests')}
                  onViewPackagesClick={() => setActiveTab('packages')}
                  onViewVerificationClick={() => setActiveTab('verification')}
                  onViewAgencyToursClick={() => setActiveTab('agency-tours')}
                />
              )}
              {activeTab === 'agency-tours' && <AgencyToursFeed />}
              {activeTab === 'post-ride' && (
                <DriverHome
                  onPostRideClick={() => setIsPostRideOpen(true)}
                  onViewRequestsClick={() => setActiveTab('requests')}
                  onViewPackagesClick={() => setActiveTab('packages')}
                  onViewVerificationClick={() => setActiveTab('verification')}
                  onViewAgencyToursClick={() => setActiveTab('agency-tours')}
                />
              )}
              {activeTab === 'requests' && <ManageBookingsView />}
              {activeTab === 'packages' && <DriverPackagesView />}
              {activeTab === 'verification' && <DriverVerificationView />}
              {activeTab === 'profile' && (
                <DriverProfileView
                  onSwitchRole={handleRoleChange}
                  onOpenVerification={() => setActiveTab('verification')}
                />
              )}
            </>
          )}

          {/* Travel Agency Mode Screens */}
          {role === 'agency' && (
            <>
              {(activeTab === 'agency-home' || activeTab === 'post-lead') && (
                <AgencyDashboard
                  onOpenVerification={() => setActiveTab('agency-kyc')}
                  onOpenPackages={() => setActiveTab('agency-packages')}
                  onSwitchRole={handleRoleChange}
                />
              )}
              {activeTab === 'agency-kyc' && <AgencyVerificationView />}
              {activeTab === 'agency-packages' && <AgencyPackagesView />}
              {activeTab === 'agency-profile' && (
                <div className="space-y-4 pb-12">
                  <div className="p-5 rounded-3xl bg-white border border-[#EBE5D8] shadow-card space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F15A24] to-[#FF7A45] flex items-center justify-center text-white font-black text-xl shadow-md">
                        {currentAgency.agencyName.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-sm font-extrabold text-[#1C1C1C]">
                          {currentAgency.agencyName}
                        </h2>
                        <p className="text-xs text-[#6B6B6B]">
                          Owner: {currentAgency.ownerName}
                        </p>
                        <p className="text-[11px] text-[#6B6B6B]">
                          Phone: {currentAgency.phone} • {currentAgency.city}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#FAF6EE] space-y-2">
                      <button
                        onClick={() => setActiveTab('agency-kyc')}
                        className="w-full p-3 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2ECE1] text-[#1C1C1C] text-xs font-bold flex items-center justify-between transition-colors"
                      >
                        <span>Agency KYC Documents</span>
                        <span className="text-[10px] text-[#F15A24] font-extrabold uppercase">
                          {currentAgency.status}
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab('agency-packages')}
                        className="w-full p-3 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2ECE1] text-[#1C1C1C] text-xs font-bold flex items-center justify-between transition-colors"
                      >
                        <span>Subscription Plans</span>
                        <span className="text-[10px] text-emerald-600 font-extrabold">
                          Manage
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Role Switcher */}
                  <div className="p-5 rounded-3xl bg-white border border-[#EBE5D8] shadow-card space-y-3">
                    <h3 className="text-xs font-extrabold text-[#1C1C1C] uppercase tracking-wider">
                      Switch Role Mode
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleRoleChange('rider')}
                        className="p-3 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2ECE1] text-xs font-bold text-[#1C1C1C] text-center active-press"
                      >
                        Rider Mode
                      </button>
                      <button
                        onClick={() => handleRoleChange('driver')}
                        className="p-3 rounded-2xl bg-[#FAF6EE] hover:bg-[#F2ECE1] text-xs font-bold text-[#1C1C1C] text-center active-press"
                      >
                        Driver Mode
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Bottom Navigation */}
        {activeScreen !== 'ride-detail' && (
          <BottomNav
            role={role}
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (tab === 'post-ride') {
                if (!isDriverLoggedIn) {
                  setAuthModalConfig({
                    isOpen: true,
                    role: 'driver',
                    title: 'Driver Login Required',
                    subtitle: 'Verify mobile to publish your ride schedule',
                    onSuccess: () => setIsPostRideOpen(true),
                  });
                } else {
                  setIsPostRideOpen(true);
                }
              } else if (tab === 'post-lead') {
                setIsPostAgencyTripOpen(true);
              } else {
                setActiveTab(tab);
                setActiveScreen('main');
              }
            }}
            pendingRequestsCount={pendingRequestsCount}
            openAgencyLeadsCount={openAgencyLeadsCount}
          />
        )}

        {/* Global Notifications Modal */}
        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        {/* Post a Ride Modal for Driver */}
        <PostRideModal
          isOpen={isPostRideOpen}
          onClose={() => setIsPostRideOpen(false)}
          onRideCreated={() => {
            setActiveTab('my-rides');
            setActiveScreen('main');
          }}
        />

        {/* Post Agency Tour Trip Modal for Travel Agency */}
        <PostAgencyTripModal
          isOpen={isPostAgencyTripOpen}
          onClose={() => setIsPostAgencyTripOpen(false)}
          onOpenVerification={() => {
            setIsPostAgencyTripOpen(false);
            setActiveTab('agency-kyc');
          }}
          onOpenPackages={() => {
            setIsPostAgencyTripOpen(false);
            setActiveTab('agency-packages');
          }}
          onTripCreated={() => {
            setActiveTab('agency-home');
            setActiveScreen('main');
          }}
        />

        {/* Booking Confirmed Modal for Rider */}
        <BookingSuccessModal
          isOpen={isBookingSuccessOpen}
          onClose={() => setIsBookingSuccessOpen(false)}
          onViewBookings={() => {
            setActiveTab('bookings');
            setActiveScreen('main');
          }}
          bookingId={confirmedBookingId || 'BK-1001'}
        />

        {/* Global Auth Modal */}
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
