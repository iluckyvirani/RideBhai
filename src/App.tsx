import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { getToken } from './lib/api';
import { AppHeader } from './components/layout/AppHeader';
import { BottomNav } from './components/layout/BottomNav';
import { NotificationsModal } from './components/layout/NotificationsModal';
import { AuthModal } from './components/auth/AuthModal';
import { CompleteProfileView } from './components/auth/CompleteProfileView';
import { LandingPage } from './components/landing/LandingPage';
import { AdminApp } from './admin/AdminApp';
import { CarsBrowseView } from './components/rider/CarsBrowseView';
import { ToursBrowseView } from './components/rider/ToursBrowseView';
import { InquiriesView } from './components/common/InquiriesView';
import { PartnerProfileView } from './components/partner/PartnerProfileView';
import { PartnerCarsView } from './components/partner/PartnerCarsView';
import { PartnerDriversView } from './components/partner/PartnerDriversView';
import { MyCarPostsView } from './components/partner/MyCarPostsView';
import { BankDetailsView } from './components/partner/BankDetailsView';
import { PartnerToursView } from './components/partner/PartnerToursView';
import { PostCarModal } from './components/partner/PostCarModal';
import { PostAgencyTripModal } from './components/agency/PostAgencyTripModal';
import { AgencyPackagesView } from './components/agency/AgencyPackagesView';
import { CreateListingSheet } from './components/common/CreateListingSheet';
import { ChatInboxView } from './components/common/ChatInboxView';
import { TourDetailsView } from './components/common/TourDetailsView';
import { AgencyTripPost } from './types';

export function App() {
  const {
    appView,
    setAppView,
    isLoggedIn,
    currentUser,
    logoutUser,
    loginUser,
    hydrateMe,
    refreshListings,
    refreshDeals,
    agencyTripPosts,
    openDeal,
    chatThreads,
    canPostCar,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('tours');
  const [detailsTourId, setDetailsTourId] = useState<string | null>(null);
  const [detailsFrom, setDetailsFrom] = useState<'tours' | 'my-tours'>('tours');
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState({ fromCity: '', toCity: '' });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPostCarOpen, setIsPostCarOpen] = useState(false);
  const [isPostTourOpen, setIsPostTourOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const openCarSetup = () => {
    const gate = canPostCar();
    setActiveTab(gate.code === 'no_vehicle' || gate.code === 'pending_vehicle' ? 'my-cars' : 'my-drivers');
  };

  useEffect(() => {
    if (getToken()) {
      hydrateMe();
      refreshDeals();
    }
    refreshListings();
  }, [hydrateMe, refreshListings, refreshDeals]);

  const needsProfile =
    isLoggedIn && (!currentUser?.profileCompleted || currentUser.profileStatus === 'incomplete');

  const enterApp = (tab = 'tours') => {
    if (!isLoggedIn) {
      setPendingTab(tab);
      setAuthOpen(true);
      return;
    }
    setActiveTab(tab);
    setAppView('rider-app');
  };

  const handleAuthSuccess = (phone?: string) => {
    if (phone) loginUser(phone);
    setActiveTab(pendingTab || 'tours');
    setPendingTab(null);
    setAppView('rider-app');
    refreshListings();
    refreshDeals();
  };

  const handleNeedUnlock = (code?: 'incomplete' | 'unverified' | 'no_package') => {
    if (code === 'no_package') setActiveTab('packages');
    else setActiveTab('profile');
  };

  const handleLandingSearch = (params: {
    fromCity: string;
    toCity: string;
    date: string;
    seats: number;
    tab?: 'cars' | 'tours';
  }) => {
    setFilter({ fromCity: params.fromCity, toCity: params.toCity });
    enterApp(params.tab === 'tours' ? 'tours' : 'cars');
  };

  if (appView === 'admin-portal') {
    return <AdminApp onExitToWebsite={() => setAppView('landing')} />;
  }

  if (needsProfile) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center p-0 sm:p-4">
        <CompleteProfileView />
      </div>
    );
  }

  if (appView === 'landing') {
    return (
      <>
        <LandingPage
          onSearchInitiated={handleLandingSearch}
          onOpenDriverPortal={() => enterApp('cars')}
          onOpenRiderPortal={() => enterApp('cars')}
          onOpenAgencyPortal={() => enterApp('cars')}
          onOpenAdminPortal={() => setAppView('admin-portal')}
        />
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          title="Login with OTP"
          subtitle="One account for cars, tours, bookings and posting."
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        <LandingPage
          onSearchInitiated={handleLandingSearch}
          onOpenDriverPortal={() => enterApp('cars')}
          onOpenRiderPortal={() => enterApp('cars')}
          onOpenAgencyPortal={() => enterApp('cars')}
          onOpenAdminPortal={() => setAppView('admin-portal')}
        />
        <AuthModal
          isOpen
          onClose={() => setAppView('landing')}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  const openTourDetails = (tour: AgencyTripPost, from: 'tours' | 'my-tours') => {
    setDetailsTourId(tour.id);
    setDetailsFrom(from);
    setActiveTab('tour-details');
  };

  const closeTourDetails = () => {
    setDetailsTourId(null);
    setActiveTab(detailsFrom);
  };

  const detailsTour = agencyTripPosts.find((t) => t.id === detailsTourId);
  const chatThreadOpen = activeTab === 'chat' && Boolean(chatThreadId);

  const getHeaderTitle = () => {
    if (activeTab === 'tour-details') return 'Tour details';
    if (activeTab === 'chat' && chatThreadId) return 'Chat';
    if (activeTab === 'bookings') return 'Bookings';
    if (activeTab === 'cars') return 'Cars · All India';
    if (activeTab === 'tours') return 'Tours';
    if (activeTab === 'profile') return 'Profile';
    if (activeTab === 'my-cars') return 'My cars';
    if (activeTab === 'my-car-posts') return 'My post car history';
    if (activeTab === 'my-drivers') return 'My drivers';
    if (activeTab === 'my-tours') return 'My tour packages';
    if (activeTab === 'my-bookings') return 'My bookings';
    if (activeTab === 'bank-details') return 'Bank details';
    if (activeTab === 'packages') return 'Posting plans';
    if (activeTab === 'chat') return 'Chat';
    return 'Ride Bhai';
  };

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-0 sm:p-4 selection:bg-[#F15A24] selection:text-white">
      <div
        id="rb-app-shell"
        className="w-full max-w-[430px] h-screen sm:h-[880px] bg-[#FAF6EE] text-[#1C1C1C] flex flex-col relative sm:rounded-[40px] shadow-2xl overflow-hidden border-0 sm:border-8 sm:border-[#222222]"
      >
        <AppHeader
          title={getHeaderTitle()}
          showBack={
            chatThreadOpen ||
            activeTab === 'tour-details' ||
            activeTab === 'my-cars' ||
            activeTab === 'my-car-posts' ||
            activeTab === 'my-drivers' ||
            activeTab === 'my-tours' ||
            activeTab === 'my-bookings' ||
            activeTab === 'bank-details'
          }
          onBack={() => {
            if (chatThreadOpen) setChatThreadId(null);
            else if (activeTab === 'tour-details') closeTourDetails();
            else setActiveTab('profile');
          }}
          onExitToLanding={() => setAppView('landing')}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        <main
          className={
            chatThreadOpen
              ? 'flex-1 min-h-0 overflow-hidden flex flex-col pb-[72px]'
              : 'flex-1 overflow-y-auto px-4 pt-3 pb-20'
          }
        >
          {activeTab === 'bookings' && (
            <InquiriesView mode="user" onOpenChat={(id) => { setChatThreadId(id); setActiveTab('chat'); }} />
          )}

          {activeTab === 'chat' && (
            <ChatInboxView
              key={chatThreadId || 'inbox'}
              onNeedUnlock={handleNeedUnlock}
              initialThreadId={chatThreadId}
              onCloseThread={() => setChatThreadId(null)}
              onOpenThread={(id) => setChatThreadId(id)}
            />
          )}

          {activeTab === 'cars' && (
            <CarsBrowseView
              initialFrom={filter.fromCity}
              initialTo={filter.toCity}
              onNeedUnlock={handleNeedUnlock}
              onDealWithRideBhai={(threadId) => {
                setChatThreadId(threadId);
                setActiveTab('chat');
              }}
            />
          )}

          {activeTab === 'tours' && (
            <ToursBrowseView
              initialFrom={filter.fromCity}
              initialTo={filter.toCity}
              onNeedUnlock={handleNeedUnlock}
              onOpenDetails={(tour) => openTourDetails(tour, 'tours')}
              onDealWithRideBhai={(threadId) => {
                setChatThreadId(threadId);
                setActiveTab('chat');
              }}
            />
          )}

          {activeTab === 'tour-details' && detailsTour && (
            <TourDetailsView
              tour={detailsTour}
              isOwn={Boolean(currentUser?.id && detailsTour.agencyId === currentUser.id)}
              onNeedUnlock={handleNeedUnlock}
              onDirect={async () => {
                const result = await openDeal({ listingType: 'tour', listingId: detailsTour.id, channel: 'direct' });
                setDetailsTourId(null);
                setChatThreadId(result.thread.id);
                setActiveTab('chat');
              }}
              onRideBhai={async () => {
                await openDeal({ listingType: 'tour', listingId: detailsTour.id, channel: 'ridebhai' });
              }}
            />
          )}

          {activeTab === 'tour-details' && !detailsTour && (
            <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8]">
              <p className="text-sm font-bold text-[#6B6B6B]">This tour is no longer available.</p>
              <button
                type="button"
                onClick={closeTourDetails}
                className="mt-3 text-xs font-extrabold text-[#F15A24]"
              >
                Back to tours
              </button>
            </div>
          )}

          {activeTab === 'profile' && (
            <PartnerProfileView
              onSwitchRole={(role) => {
                if (role === 'admin') setAppView('admin-portal');
              }}
              onOpenVerification={() => setActiveTab('profile')}
              onOpenPackages={() => setActiveTab('packages')}
              onOpenMyCars={() => setActiveTab('my-cars')}
              onOpenMyCarPosts={() => setActiveTab('my-car-posts')}
              onOpenMyDrivers={() => setActiveTab('my-drivers')}
              onOpenMyTours={() => setActiveTab('my-tours')}
              onOpenMyBookings={() => setActiveTab('my-bookings')}
              onOpenBankDetails={() => setActiveTab('bank-details')}
              onLogout={() => {
                logoutUser();
                setAppView('landing');
              }}
            />
          )}

          {activeTab === 'my-cars' && (
            <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card pb-4">
              <PartnerCarsView />
            </div>
          )}

          {activeTab === 'my-car-posts' && <MyCarPostsView />}

          {activeTab === 'my-drivers' && (
            <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card pb-4">
              <PartnerDriversView />
            </div>
          )}

          {activeTab === 'my-tours' && (
            <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card pb-4">
              <PartnerToursView onOpenDetails={(tour) => openTourDetails(tour, 'my-tours')} />
            </div>
          )}

          {activeTab === 'my-bookings' && (
            <InquiriesView mode="user" onOpenChat={(id) => { setChatThreadId(id); setActiveTab('chat'); }} />
          )}

          {activeTab === 'bank-details' && (
            <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card pb-4">
              <BankDetailsView />
            </div>
          )}

          {activeTab === 'packages' && <AgencyPackagesView />}
        </main>

        <BottomNav
          chatUnread={chatThreads.reduce((sum, t) => sum + Number(t.unreadCount || 0), 0)}
          activeTab={
            activeTab === 'tour-details'
              ? detailsFrom === 'my-tours'
                ? 'profile'
                : 'tours'
              : activeTab === 'my-cars' ||
                  activeTab === 'my-car-posts' ||
                  activeTab === 'my-drivers' ||
                  activeTab === 'my-tours' ||
                  activeTab === 'my-bookings' ||
                  activeTab === 'bank-details'
                ? 'profile'
                : activeTab
          }
          onTabChange={(tab) => {
            setDetailsTourId(null);
            if (tab === 'chat') setChatThreadId(null);
            setActiveTab(tab);
          }}
          onCreate={() => setCreateOpen(true)}
        />

        <CreateListingSheet
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          onPostCar={() => setIsPostCarOpen(true)}
          onPostTour={() => setIsPostTourOpen(true)}
          onOpenDriverSetup={openCarSetup}
          onOpenProfile={() => setActiveTab('profile')}
        />

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
          onOpenDriverSetup={() => {
            setIsPostCarOpen(false);
            openCarSetup();
          }}
        />

        <PostAgencyTripModal
          isOpen={isPostTourOpen}
          onClose={() => setIsPostTourOpen(false)}
          onOpenVerification={() => {
            setIsPostTourOpen(false);
            setActiveTab('profile');
          }}
          onOpenPackages={() => {
            setIsPostTourOpen(false);
            setActiveTab('packages');
          }}
          onTripCreated={() => setActiveTab('tours')}
        />
      </div>
    </div>
  );
}
