import React, { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { api, getToken } from './lib/api';
import { setTaxiCars, type TaxiCar } from './data/indiaTaxiCars';
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
import { HotelsBrowseView } from './components/rider/HotelsBrowseView';
import { HotelDetailsView } from './components/common/HotelDetailsView';
import type { HotelListing } from './types';
import { SupportTicketsView } from './components/common/SupportTicketsView';
import { AgencyTripPost } from './types';
import { RateLastBookingModal } from './components/common/RateLastBookingModal';
import { LegalPageView, type LegalSlug } from './components/legal/LegalPageView';
import { ShieldAlert, Sparkles } from 'lucide-react';
import type { Deal } from './lib/deals';
import { parseSharedLink } from './lib/share';
import { useNewTourAlerts } from './hooks/useNewTourAlerts';
import { NewTourAlertPopup } from './components/common/NewTourAlertPopup';

function hashLegalSlug(): LegalSlug | null {
  const h = window.location.hash.replace(/^#/, '');
  return h === 'terms' || h === 'privacy' ? h : null;
}

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
    deals,
    listingsLoading,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('tours');
  const [detailsTourId, setDetailsTourId] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelListing | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const [detailsFrom, setDetailsFrom] = useState<'tours' | 'my-tours'>('tours');
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);
  const [filter, setFilter] = useState({ fromCity: '', toCity: '', bookingDate: '' });
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPostCarOpen, setIsPostCarOpen] = useState(false);
  const [isPostTourOpen, setIsPostTourOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [awaitRatePrompt, setAwaitRatePrompt] = useState(false);
  const [ratePrompt, setRatePrompt] = useState<Deal | null>(null);
  const { current: tourAlert, dismiss: dismissTourAlert } = useNewTourAlerts(isLoggedIn);
  const [legalSlug, setLegalSlug] = useState<LegalSlug | null>(() =>
    typeof window === 'undefined' ? null : hashLegalSlug()
  );

  const openLegal = (slug: LegalSlug) => {
    setLegalSlug(slug);
    window.location.hash = slug;
    setAppView('landing');
  };

  const closeLegal = () => {
    setLegalSlug(null);
    if (hashLegalSlug()) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
  };

  const openCarSetup = () => {
    const gate = canPostCar();
    setActiveTab(gate.code === 'no_vehicle' || gate.code === 'pending_vehicle' ? 'my-cars' : 'my-drivers');
  };

  const tabToHash = (tab: string) => {
    if (tab === 'packages') return 'plans';
    return tab;
  };

  const navigateTab = (tab: string, replace = false) => {
    setActiveTab(tab);
    if (tab !== 'tour-details') setDetailsTourId(null);
    if (tab !== 'cars') setSelectedCarId(null);
    if (tab !== 'hotel-details') setSelectedHotel(null);
    setAppView('rider-app');

    const hash = tabToHash(tab);
    const currentHash = (window.location.hash || '').replace(/^#/, '');
    if (currentHash !== hash) {
      if (replace) {
        window.history.replaceState(null, '', `#${hash}`);
      } else {
        window.location.hash = hash;
      }
    }
  };

  const exitToLanding = (section?: string) => {
    setLegalSlug(null);
    setDetailsTourId(null);
    setSelectedCarId(null);
    setAppView('landing');
    const hash = section || 'home';
    if ((window.location.hash || '').replace(/^#/, '') !== hash) {
      window.location.hash = hash;
    }
    if (section && section !== 'home') {
      setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
      }, 70);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleRoute = () => {
      const rawHash = (window.location.hash || '').replace(/^#/, '').trim();

      // 1. Legal pages
      if (rawHash === 'terms' || rawHash === 'privacy') {
        setLegalSlug(rawHash);
        setAppView('landing');
        return;
      }
      setLegalSlug(null);

      // 2. Shared tour / car links: #tour=... or #car=...
      const shared = parseSharedLink();
      if (shared.type === 'tour' && shared.id) {
        setDetailsTourId(shared.id);
        setDetailsFrom('tours');
        setActiveTab('tour-details');
        setAppView('rider-app');
        return;
      }
      if (shared.type === 'car' && shared.id) {
        setSelectedCarId(shared.id);
        setActiveTab('cars');
        setAppView('rider-app');
        return;
      }

      // 3. Admin portal
      if (rawHash === 'admin') {
        setAppView('admin-portal');
        return;
      }

      // 4. App tabs
      const appTabMap: Record<string, string> = {
        cars: 'cars',
        tours: 'tours',
        hotels: 'hotels',
        plans: 'packages',
        packages: 'packages',
        chat: 'chat',
        profile: 'profile',
        bookings: 'bookings',
        'my-bookings': 'bookings',
        'my-cars': 'my-cars',
        'my-drivers': 'my-drivers',
        'my-tours': 'my-tours',
        'my-car-posts': 'my-car-posts',
        'bank-details': 'bank-details',
      };

      if (appTabMap[rawHash]) {
        const tab = appTabMap[rawHash];
        setActiveTab(tab);
        if (tab !== 'tour-details') setDetailsTourId(null);
        if (tab !== 'cars') setSelectedCarId(null);
        setAppView('rider-app');
        return;
      }

      // 5. Landing page sections
      const landingSections: Record<string, string> = {
        'how-it-works': 'how-it-works',
        'browse-india': 'browse-india',
        'cars-tours': 'browse-india',
        'for-partners': 'for-partners',
        'for-users': 'for-partners',
        'partner-packages': 'partner-packages',
        'safety-trust': 'safety-trust',
        safety: 'safety-trust',
        faq: 'faq',
      };

      if (landingSections[rawHash]) {
        setAppView('landing');
        const sectionId = landingSections[rawHash];
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
        return;
      }

      // 6. Default root or home
      if (!rawHash || rawHash === 'home') {
        setAppView('landing');
        return;
      }
    };

    handleRoute();
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, [setAppView]);

  useEffect(() => {
    if (getToken()) {
      hydrateMe();
      refreshDeals();
    }
    refreshListings();
    api<TaxiCar[]>('/listings/taxi-cars')
      .then((rows) => {
        const mapped = (rows || [])
          .filter((row) => row.make && row.model && row.body)
          .map((row) => ({
            id: row.id,
            make: row.make,
            model: row.model,
            body: row.body,
            seats: Number(row.seats) || 5,
          }));
        if (mapped.length) setTaxiCars(mapped);
      })
      .catch(() => {
        /* keep built-in fallback */
      });
  }, [hydrateMe, refreshListings, refreshDeals]);

  const needsProfile =
    isLoggedIn && (!currentUser?.profileCompleted || currentUser.profileStatus === 'incomplete');

  useEffect(() => {
    if (!awaitRatePrompt || !isLoggedIn || !currentUser?.id || needsProfile) return;
    const last = deals
      .filter(
        (d) =>
          d.status === 'success' &&
          !d.myRating &&
          (d.buyerId === currentUser.id || d.sellerId === currentUser.id)
      )
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
    const key = `ridebhai_rate_prompt:${currentUser.id}`;
    if (last && localStorage.getItem(key) !== last.id) {
      localStorage.setItem(key, last.id);
      setRatePrompt(last);
    }
    setAwaitRatePrompt(false);
  }, [awaitRatePrompt, isLoggedIn, currentUser?.id, needsProfile, deals]);

  const enterApp = (tab = 'tours') => {
    navigateTab(tab);
  };

  const handleAuthSuccess = (phone?: string) => {
    if (phone) loginUser(phone);
    setAuthOpen(false);
    if (pendingTab) {
      navigateTab(pendingTab);
      setPendingTab(null);
    } else {
      navigateTab('tours');
    }
    refreshListings();
    refreshDeals().finally(() => setAwaitRatePrompt(true));
  };

  const handleNeedUnlock = (code?: 'incomplete' | 'unverified' | 'no_package') => {
    if (!isLoggedIn) {
      setAuthOpen(true);
      return;
    }
    if (code === 'no_package') navigateTab('packages');
    else navigateTab('profile');
  };

  const handleLandingSearch = (params: {
    fromCity: string;
    toCity: string;
    date: string;
    seats: number;
    tab?: 'cars' | 'tours';
  }) => {
    setFilter({ fromCity: params.fromCity, toCity: params.toCity, bookingDate: params.date || '' });
    enterApp(params.tab === 'cars' ? 'cars' : 'tours');
  };

  if (appView === 'admin-portal') {
    return <AdminApp onExitToWebsite={() => exitToLanding('home')} />;
  }

  if (legalSlug) {
    return <LegalPageView slug={legalSlug} onBack={closeLegal} onOpen={openLegal} />;
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
          onOpenDriverPortal={() => enterApp('tours')}
          onOpenRiderPortal={() => enterApp('tours')}
          onOpenAgencyPortal={() => enterApp('tours')}
          onOpenAdminPortal={() => {
            window.location.hash = 'admin';
            setAppView('admin-portal');
          }}
          onOpenLegal={openLegal}
          onOpenCars={() => enterApp('cars')}
          onOpenTours={() => enterApp('tours')}
        />
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          title="Login with OTP"
          subtitle="One account for cars, tours, bookings and posting. Plan unlocks chat, booking and posting."
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  if (currentUser?.isBlocked) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-red-200 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#1C1C1C]">Account Blocked</h2>
            <p className="text-xs text-red-600 font-bold mt-1">
              {currentUser.blockedReason || 'Your account has been suspended by the platform administrator.'}
            </p>
            <p className="text-[11px] text-[#6B6B6B] mt-2">
              If you believe this is an error or need assistance, please contact support or log in with another account.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              logoutUser();
              exitToLanding('home');
            }}
            className="w-full py-3 rounded-2xl bg-[#1C1C1C] text-white text-xs font-extrabold"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  const openTourDetails = (tour: AgencyTripPost, from: 'tours' | 'my-tours' = 'tours') => {
    setDetailsTourId(tour.id);
    setDetailsFrom(from);
    setActiveTab('tour-details');
    window.location.hash = `tour=${encodeURIComponent(tour.id)}`;
  };

  const closeTourDetails = () => {
    setDetailsTourId(null);
    navigateTab(detailsFrom);
  };

  const detailsTour = agencyTripPosts.find((t) => t.id === detailsTourId);
  const chatThreadOpen = activeTab === 'chat' && Boolean(chatThreadId);

  return (
    <div className="min-h-screen bg-[#141414] flex items-center justify-center p-0 sm:p-4 selection:bg-[#F15A24] selection:text-white">
      <div
        id="rb-app-shell"
        className="w-full max-w-[430px] h-screen sm:h-[880px] bg-[#FAF6EE] text-[#1C1C1C] flex flex-col relative sm:rounded-[40px] shadow-2xl overflow-hidden border-0 sm:border-8 sm:border-[#222222]"
      >
        <AppHeader
          showBack={
            chatThreadOpen ||
            activeTab === 'tour-details' ||
            (activeTab === 'cars' && Boolean(selectedCarId)) ||
            activeTab === 'my-cars' ||
            activeTab === 'my-car-posts' ||
            activeTab === 'my-drivers' ||
            activeTab === 'my-tours' ||
            activeTab === 'my-bookings' ||
            activeTab === 'bank-details' ||
            activeTab === 'hotel-details'
          }
          onBack={() => {
            if (chatThreadOpen) setChatThreadId(null);
            else if (activeTab === 'tour-details') closeTourDetails();
            else if (activeTab === 'hotel-details') navigateTab('hotels');
            else if (activeTab === 'cars' && selectedCarId) {
              setSelectedCarId(null);
              window.history.replaceState(null, '', '#cars');
            } else navigateTab('profile');
          }}
          onExitToLanding={() => exitToLanding('home')}
          onLogoClick={() => exitToLanding('home')}
          onOpenNotifications={() => {
            if (!isLoggedIn) {
              setAuthOpen(true);
              return;
            }
            setIsNotificationsOpen(true);
          }}
          onLoginClick={() => setAuthOpen(true)}
          onOpenHotels={() => navigateTab('hotels')}
        />

        {tourAlert && (
          <NewTourAlertPopup
            alert={tourAlert}
            onDismiss={dismissTourAlert}
            onView={() => {
              dismissTourAlert();
              navigateTab('tours');
            }}
          />
        )}

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
              initialNeedOn={filter.bookingDate}
              selectedCarId={selectedCarId}
              onSelectCar={(carId) => {
                setSelectedCarId(carId);
                if (carId) {
                  window.history.replaceState(null, '', `#car=${encodeURIComponent(carId)}`);
                } else {
                  window.history.replaceState(null, '', '#cars');
                }
              }}
              onNeedUnlock={handleNeedUnlock}
              onDealWithRideBhai={(threadId) => {
                setChatThreadId(threadId);
                navigateTab('chat');
              }}
            />
          )}

          {activeTab === 'tours' && (
            <ToursBrowseView
              initialFrom={filter.fromCity}
              initialTo={filter.toCity}
              initialNeedOn={filter.bookingDate}
              onNeedUnlock={handleNeedUnlock}
              onOpenDetails={(tour) => openTourDetails(tour, 'tours')}
              onDealWithRideBhai={(threadId) => {
                setChatThreadId(threadId);
                navigateTab('chat');
              }}
            />
          )}

          {activeTab === 'hotels' && (
            <HotelsBrowseView
              onOpenDetails={(hotel) => {
                setSelectedHotel(hotel);
                navigateTab('hotel-details');
              }}
            />
          )}

          {activeTab === 'hotel-details' && selectedHotel && (
            <HotelDetailsView hotel={selectedHotel} onNeedLogin={() => setAuthOpen(true)} />
          )}

          {activeTab === 'tour-details' && detailsTour && (
            <TourDetailsView
              tour={detailsTour}
              isOwn={Boolean(currentUser?.id && detailsTour.agencyId === currentUser.id)}
              onNeedUnlock={handleNeedUnlock}
              onDirect={async () => {
                if (!isLoggedIn) {
                  setAuthOpen(true);
                  return;
                }
                const result = await openDeal({ listingType: 'tour', listingId: detailsTour.id, channel: 'direct' });
                setDetailsTourId(null);
                setChatThreadId(result.thread.id);
                navigateTab('chat');
              }}
              onRideBhai={async () => {
                if (!isLoggedIn) {
                  setAuthOpen(true);
                  return;
                }
                await openDeal({ listingType: 'tour', listingId: detailsTour.id, channel: 'ridebhai' });
              }}
            />
          )}

          {activeTab === 'tour-details' && !detailsTour && (
            listingsLoading ? (
              <div className="p-8 text-center space-y-3 rounded-3xl bg-white border border-[#EBE5D8] animate-pulse">
                <div className="w-10 h-10 rounded-full bg-[#F15A24]/10 text-[#F15A24] flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <p className="text-xs font-bold text-[#6B6B6B]">Loading tour details...</p>
              </div>
            ) : (
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
            )
          )}

          {activeTab === 'profile' && (
            <PartnerProfileView
              onSwitchRole={(role) => {
                if (role === 'admin') setAppView('admin-portal');
              }}
              onOpenVerification={() => navigateTab('profile')}
              onOpenPackages={() => navigateTab('packages')}
              onOpenMyCars={() => navigateTab('my-cars')}
              onOpenMyCarPosts={() => navigateTab('my-car-posts')}
              onOpenMyDrivers={() => navigateTab('my-drivers')}
              onOpenMyTours={() => navigateTab('my-tours')}
              onOpenMyBookings={() => navigateTab('my-bookings')}
              onOpenBankDetails={() => navigateTab('bank-details')}
              onOpenSupportTickets={() => navigateTab('support-tickets')}
              onLogout={() => {
                logoutUser();
                exitToLanding('home');
              }}
            />
          )}

          {activeTab === 'support-tickets' && (
            <SupportTicketsView onBack={() => navigateTab('profile')} />
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
            <InquiriesView mode="user" onOpenChat={(id) => { setChatThreadId(id); navigateTab('chat'); }} />
          )}

          {activeTab === 'bank-details' && (
            <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card pb-4">
              <BankDetailsView />
            </div>
          )}

          {activeTab === 'packages' && <AgencyPackagesView onNeedAuth={() => setAuthOpen(true)} />}
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
            if (!isLoggedIn && (tab === 'chat' || tab === 'profile')) {
              setPendingTab(tab);
              setAuthOpen(true);
              return;
            }
            if (tab === 'chat') setChatThreadId(null);
            navigateTab(tab);
          }}
          onCreate={() => {
            if (!isLoggedIn) {
              setAuthOpen(true);
              return;
            }
            setCreateOpen(true);
          }}
        />

        <CreateListingSheet
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          onPostCar={() => setIsPostCarOpen(true)}
          onPostTour={() => setIsPostTourOpen(true)}
          onOpenDriverSetup={openCarSetup}
          onOpenProfile={() => navigateTab('profile')}
        />

        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          title="Login with OTP"
          subtitle="One account for cars, tours, bookings and posting. Plan unlocks chat, booking and posting."
          onSuccess={handleAuthSuccess}
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

        {ratePrompt && currentUser && (
          <RateLastBookingModal
            deal={ratePrompt}
            otherName={
              currentUser.id === ratePrompt.buyerId ? ratePrompt.sellerName : ratePrompt.buyerName
            }
            onClose={() => setRatePrompt(null)}
            onGoBookings={() => {
              setRatePrompt(null);
              setActiveTab('my-bookings');
            }}
          />
        )}
      </div>
    </div>
  );
}
