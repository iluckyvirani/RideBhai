import { useState, useEffect, useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  UserRole,
  Driver,
  DriverStatus,
  DriverDocuments,
  Vehicle,
  Rider,
  Ride,
  EnrichedRide,
  Package,
  DriverPackage,
  Booking,
  ChatMessage,
  NotificationItem,
  DisputeItem,
  AppViewMode,
  TravelAgency,
  AgencyStatus,
  AgencyDocuments,
  AgencyPackage,
  AgencyActiveSubscription,
  AgencyTripPost,
  AgencyTripStatus,
  CarListing,
  Inquiry,
  AppUser,
  UserProfileStatus,
  DriverProfile,
  BankDetails,
} from '../types';
import { INITIAL_DRIVERS } from '../data/mockDrivers';
import { INITIAL_RIDES } from '../data/mockRides';
import { INITIAL_PACKAGES } from '../data/mockPackages';
import { INITIAL_DRIVER_PACKAGES } from '../data/mockDriverPackages';
import { CURRENT_RIDER } from '../data/mockRiders';
import { INITIAL_BOOKINGS } from '../data/mockBookings';
import { INITIAL_CHATS } from '../data/mockChats';
import { INITIAL_DISPUTES } from '../data/mockDisputes';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';
import {
  INITIAL_AGENCIES,
  INITIAL_AGENCY_PACKAGES,
  INITIAL_AGENCY_SUBSCRIPTIONS,
} from '../data/mockAgencies';
import { INITIAL_INQUIRIES } from '../data/mockCarListings';
import { api, getToken, setToken } from '../lib/api';
import { refreshNotifications } from '../lib/notifications';
import { mapDeal, mapThread, type ChatThread, type Deal } from '../lib/deals';
import { mapCarListing, mapTourListing, mergeById } from '../lib/listings';
import { mapServerUser, type ServerUser } from '../lib/session';
import { desiredCarBody, listingCarBody } from '../data/indiaTaxiCars';

const DEMO_VERSION = 'neon-listings-v1';
const VERSION_KEY = 'ridebhai_demo_version';

function wipeRideBhaiStorage() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('ridebhai_'))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

try {
  if (localStorage.getItem(VERSION_KEY) !== DEMO_VERSION) {
    wipeRideBhaiStorage();
    localStorage.setItem(VERSION_KEY, DEMO_VERSION);
  }
} catch {
  /* ignore */
}

const STORAGE_KEYS = {
  ROLE: 'ridebhai_role',
  ONBOARDED: 'ridebhai_onboarded',
  DRIVERS: 'ridebhai_drivers_v1',
  RIDES: 'ridebhai_rides_v1',
  PACKAGES: 'ridebhai_packages_v1',
  DRIVER_PACKAGES: 'ridebhai_driver_packages_v1',
  CURRENT_RIDER: 'ridebhai_current_rider_v1',
  CURRENT_DRIVER: 'ridebhai_current_driver_v1',
  BOOKINGS: 'ridebhai_bookings_v1',
  CHATS: 'ridebhai_chats_v1',
  DISPUTES: 'ridebhai_disputes_v1',
  NOTIFICATIONS: 'ridebhai_notifications_v1',
  APP_VIEW: 'ridebhai_app_view_v1',
  RIDER_AUTH: 'ridebhai_rider_auth_v1',
  DRIVER_AUTH: 'ridebhai_driver_auth_v1',
  AGENCY_AUTH: 'ridebhai_agency_auth_v1',
  AGENCIES: 'ridebhai_agencies_v1',
  AGENCY_PACKAGES: 'ridebhai_agency_packages_v1',
  AGENCY_SUBSCRIPTIONS: 'ridebhai_agency_subscriptions_v1',
  AGENCY_TRIPS: 'ridebhai_agency_trips_v1',
  PARTNER_AUTH: 'ridebhai_partner_auth_v2',
  CAR_LISTINGS: 'ridebhai_car_listings_v2',
  INQUIRIES: 'ridebhai_inquiries_v2',
  USERS: 'ridebhai_users_v1',
  CURRENT_USER_ID: 'ridebhai_current_user_id_v1',
  USER_AUTH: 'ridebhai_user_auth_v1',
};

// Safe JSON parser from LocalStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Failed to parse localStorage key: ${key}`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save to localStorage: ${key}`, e);
  }
}

// Global in-memory bus for listener synchronization across re-renders
let storeListeners: Array<() => void> = [];
const notifyListeners = () => storeListeners.forEach((l) => l());

type SharedAuth = {
  isLoggedIn: boolean;
  currentUserId: string | null;
  users: AppUser[];
};

let sharedAuth: SharedAuth = {
  isLoggedIn: loadFromStorage(STORAGE_KEYS.USER_AUTH, false),
  currentUserId: loadFromStorage(STORAGE_KEYS.CURRENT_USER_ID, null),
  users: loadFromStorage(STORAGE_KEYS.USERS, []),
};

const authListeners = new Set<() => void>();

function subscribeAuth(listener: () => void) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function getSharedAuth() {
  return sharedAuth;
}

function writeSharedAuth(partial: Partial<SharedAuth>) {
  sharedAuth = { ...sharedAuth, ...partial };
  if (partial.isLoggedIn !== undefined) saveToStorage(STORAGE_KEYS.USER_AUTH, sharedAuth.isLoggedIn);
  if (partial.currentUserId !== undefined) saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, sharedAuth.currentUserId);
  if (partial.users !== undefined) saveToStorage(STORAGE_KEYS.USERS, sharedAuth.users);
  authListeners.forEach((listener) => listener());
  notifyListeners();
}

type SharedListings = {
  cars: CarListing[];
  tours: AgencyTripPost[];
  loading: boolean;
  error: string;
};

let sharedListings: SharedListings = { cars: [], tours: [], loading: false, error: '' };
const listingListeners = new Set<() => void>();

function subscribeListings(listener: () => void) {
  listingListeners.add(listener);
  return () => listingListeners.delete(listener);
}

function getSharedListings() {
  return sharedListings;
}

function writeSharedListings(partial: Partial<SharedListings>) {
  sharedListings = { ...sharedListings, ...partial };
  listingListeners.forEach((listener) => listener());
}

type SharedDeals = {
  deals: Deal[];
  threads: ChatThread[];
};

let sharedDeals: SharedDeals = { deals: [], threads: [] };
const dealListeners = new Set<() => void>();

function subscribeDeals(listener: () => void) {
  dealListeners.add(listener);
  return () => dealListeners.delete(listener);
}

function getSharedDeals() {
  return sharedDeals;
}

function writeSharedDeals(partial: Partial<SharedDeals>) {
  sharedDeals = { ...sharedDeals, ...partial };
  dealListeners.forEach((listener) => listener());
}

export function useAppStore() {
  // 1. Core State Hooks initialized from LocalStorage
  const [appView, setAppViewState] = useState<AppViewMode>(() => loadFromStorage(STORAGE_KEYS.APP_VIEW, 'landing'));
  const [isRiderLoggedIn, setIsRiderLoggedInState] = useState<boolean>(() => loadFromStorage(STORAGE_KEYS.RIDER_AUTH, false));
  const [isDriverLoggedIn, setIsDriverLoggedInState] = useState<boolean>(() => loadFromStorage(STORAGE_KEYS.DRIVER_AUTH, false));
  const [isAgencyLoggedIn, setIsAgencyLoggedInState] = useState<boolean>(() => loadFromStorage(STORAGE_KEYS.AGENCY_AUTH, false));
  const [isPartnerLoggedIn, setIsPartnerLoggedInState] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.PARTNER_AUTH, false)
  );
  const { cars: carListings, tours: agencyTripPosts, loading: listingsLoading, error: listingsError } =
    useSyncExternalStore(subscribeListings, getSharedListings, getSharedListings);
  const { deals, threads: chatThreads } = useSyncExternalStore(subscribeDeals, getSharedDeals, getSharedDeals);
  const [inquiries, setInquiriesState] = useState<Inquiry[]>(() =>
    loadFromStorage(STORAGE_KEYS.INQUIRIES, INITIAL_INQUIRIES)
  );
  const [role, setRoleState] = useState<UserRole>(() => loadFromStorage(STORAGE_KEYS.ROLE, 'rider'));
  const [hasOnboarded, setHasOnboardedState] = useState<boolean>(() => loadFromStorage(STORAGE_KEYS.ONBOARDED, true));
  const [drivers, setDriversState] = useState<Driver[]>(() => loadFromStorage(STORAGE_KEYS.DRIVERS, INITIAL_DRIVERS));
  const [rides, setRidesState] = useState<Ride[]>(() => loadFromStorage(STORAGE_KEYS.RIDES, INITIAL_RIDES));
  const [packages, setPackagesState] = useState<Package[]>(() => loadFromStorage(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES));
  const [driverPackages, setDriverPackagesState] = useState<DriverPackage[]>(() => loadFromStorage(STORAGE_KEYS.DRIVER_PACKAGES, INITIAL_DRIVER_PACKAGES));
  const [currentRider, setCurrentRiderState] = useState<Rider>(() => loadFromStorage(STORAGE_KEYS.CURRENT_RIDER, CURRENT_RIDER));
  const [bookings, setBookingsState] = useState<Booking[]>(() => loadFromStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS));
  const [chats, setChatsState] = useState<ChatMessage[]>(() => loadFromStorage(STORAGE_KEYS.CHATS, INITIAL_CHATS));
  const [disputes, setDisputesState] = useState<DisputeItem[]>(() => loadFromStorage(STORAGE_KEYS.DISPUTES, INITIAL_DISPUTES));
  const [notifications, setNotificationsState] = useState<NotificationItem[]>(() => loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS));

  // Agency specific state
  const [agencies, setAgenciesState] = useState<TravelAgency[]>(() => loadFromStorage(STORAGE_KEYS.AGENCIES, INITIAL_AGENCIES));
  const [agencyPackages, setAgencyPackagesState] = useState<AgencyPackage[]>(() => loadFromStorage(STORAGE_KEYS.AGENCY_PACKAGES, INITIAL_AGENCY_PACKAGES));
  const [agencySubscriptions, setAgencySubscriptionsState] = useState<AgencyActiveSubscription[]>(() => loadFromStorage(STORAGE_KEYS.AGENCY_SUBSCRIPTIONS, INITIAL_AGENCY_SUBSCRIPTIONS));
  const { isLoggedIn, currentUserId, users } = useSyncExternalStore(subscribeAuth, getSharedAuth, getSharedAuth);

  const currentUser = useMemo(() => {
    if (!currentUserId) return null;
    return users.find((u) => u.id === currentUserId) || null;
  }, [users, currentUserId]);

  // Current active driver profile (defaults to Aman Singhal drv-current)
  const currentDriver = useMemo(() => {
    return drivers.find((d) => d.id === 'drv-current') || drivers[0];
  }, [drivers]);

  // Current active agency profile
  const currentAgency = useMemo(() => {
    return agencies.find((a) => a.id === 'agency-current') || agencies[0];
  }, [agencies]);

  const accountId = currentUser?.id || currentAgency?.id || 'agency-current';

  // View Navigation
  const setAppView = useCallback((view: AppViewMode) => {
    setAppViewState(view);
    saveToStorage(STORAGE_KEYS.APP_VIEW, view);
    notifyListeners();
  }, []);

  // Auth actions
  const loginRider = useCallback((phone: string, name?: string) => {
    setIsRiderLoggedInState(true);
    saveToStorage(STORAGE_KEYS.RIDER_AUTH, true);
    if (name || phone) {
      setCurrentRiderState((prev) => {
        const updated = {
          ...prev,
          name: name || prev.name,
          phone: phone || prev.phone,
        };
        saveToStorage(STORAGE_KEYS.CURRENT_RIDER, updated);
        return updated;
      });
    }
    notifyListeners();
  }, []);

  const logoutRider = useCallback(() => {
    setIsRiderLoggedInState(false);
    saveToStorage(STORAGE_KEYS.RIDER_AUTH, false);
    notifyListeners();
  }, []);

  const loginDriver = useCallback((phone: string, name?: string, vehicleInfo?: any, initialStatus?: DriverStatus) => {
    setIsDriverLoggedInState(true);
    saveToStorage(STORAGE_KEYS.DRIVER_AUTH, true);
    setDriversState((prev) => {
      const updated = prev.map((d) => {
        if (d.id === 'drv-current') {
          return {
            ...d,
            name: name || d.name,
            phone: phone || d.phone,
            status: initialStatus !== undefined ? initialStatus : d.status,
            vehicle: vehicleInfo || d.vehicle,
          };
        }
        return d;
      });
      saveToStorage(STORAGE_KEYS.DRIVERS, updated);
      return updated;
    });
    notifyListeners();
  }, []);

  const logoutDriver = useCallback(() => {
    setIsDriverLoggedInState(false);
    saveToStorage(STORAGE_KEYS.DRIVER_AUTH, false);
    notifyListeners();
  }, []);

  // Agency Auth Actions
  const loginAgency = useCallback((phone: string, agencyName?: string, ownerName?: string, city?: string) => {
    setIsAgencyLoggedInState(true);
    saveToStorage(STORAGE_KEYS.AGENCY_AUTH, true);
    setAgenciesState((prev) => {
      const exists = prev.find((a) => a.id === 'agency-current');
      if (exists) {
        const updated = prev.map((a) => {
          if (a.id === 'agency-current') {
            return {
              ...a,
              agencyName: agencyName || a.agencyName,
              ownerName: ownerName || a.ownerName,
              phone: phone || a.phone,
              city: city || a.city,
            };
          }
          return a;
        });
        saveToStorage(STORAGE_KEYS.AGENCIES, updated);
        return updated;
      }
      return prev;
    });
    notifyListeners();
  }, []);

  const logoutAgency = useCallback(() => {
    setIsAgencyLoggedInState(false);
    saveToStorage(STORAGE_KEYS.AGENCY_AUTH, false);
    notifyListeners();
  }, []);

  const loginPartner = useCallback((phone: string, name?: string, firmName?: string, city?: string) => {
    setIsPartnerLoggedInState(true);
    setIsDriverLoggedInState(true);
    setIsAgencyLoggedInState(true);
    saveToStorage(STORAGE_KEYS.PARTNER_AUTH, true);
    saveToStorage(STORAGE_KEYS.DRIVER_AUTH, true);
    saveToStorage(STORAGE_KEYS.AGENCY_AUTH, true);

    setDriversState((prev) => {
      const updated = prev.map((d) => {
        if (d.id === 'drv-current') {
          return {
            ...d,
            name: name || d.name,
            phone: phone || d.phone,
            city: city || d.city,
          };
        }
        return d;
      });
      saveToStorage(STORAGE_KEYS.DRIVERS, updated);
      return updated;
    });

    setAgenciesState((prev) => {
      const updated = prev.map((a) => {
        if (a.id === 'agency-current') {
          return {
            ...a,
            agencyName: firmName || name || a.agencyName,
            ownerName: name || a.ownerName,
            phone: phone || a.phone,
            whatsappPhone: phone ? phone.replace(/[^0-9]/g, '').replace(/^/, '91').slice(-12) : a.whatsappPhone,
            city: city || a.city,
          };
        }
        return a;
      });
      saveToStorage(STORAGE_KEYS.AGENCIES, updated);
      return updated;
    });
    notifyListeners();
  }, []);

  const logoutPartner = useCallback(() => {
    setIsPartnerLoggedInState(false);
    setIsDriverLoggedInState(false);
    setIsAgencyLoggedInState(false);
    saveToStorage(STORAGE_KEYS.PARTNER_AUTH, false);
    saveToStorage(STORAGE_KEYS.DRIVER_AUTH, false);
    saveToStorage(STORAGE_KEYS.AGENCY_AUTH, false);
    notifyListeners();
  }, []);

  const updateUsers = useCallback((updater: (prev: AppUser[]) => AppUser[]) => {
    writeSharedAuth({ users: updater(sharedAuth.users) });
  }, []);

  const applyServerUser = useCallback((user: AppUser) => {
    writeSharedAuth({
      isLoggedIn: true,
      currentUserId: user.id,
      users: [user, ...sharedAuth.users.filter((u) => u.id !== user.id)],
    });
  }, []);

  const hydrateMe = useCallback(async () => {
    if (!getToken()) return null;
    try {
      const me = await api<{
        user: ServerUser;
        isAdmin?: boolean;
        driverProfile?: unknown;
        driverProfiles?: unknown[];
        bankDetails?: unknown;
        vehicles?: unknown[];
        subscription?: {
          id: string;
          plan_id: string;
          expires_at: string;
          posts_remaining: number;
          plan_name: string;
        } | null;
      }>('/auth/me');
      applyServerUser(
        mapServerUser(me.user, {
          vehicles: me.vehicles,
          driverProfile: me.driverProfile,
          driverProfiles: me.driverProfiles,
          bankDetails: me.bankDetails,
        })
      );
      try {
        localStorage.setItem('ridebhai_is_admin', me.isAdmin ? '1' : '0');
        localStorage.setItem('ridebhai_has_plan', me.subscription ? '1' : '0');
      } catch {
        /* ignore */
      }
      refreshNotifications();
      return me;
    } catch {
      return null;
    }
  }, [applyServerUser]);

  const loginUser = useCallback((phone: string, serverUser?: AppUser) => {
    const digits = phone.replace(/\D/g, '').slice(-10);
    if (serverUser) {
      applyServerUser({ ...serverUser, phone: digits || serverUser.phone });
    } else {
      const id = `user-${digits}`;
      const exists = sharedAuth.users.find(
        (u) => u.id === id || u.phone.replace(/\D/g, '').slice(-10) === digits
      );
      const resolvedId = exists?.id || id;
      const nextUsers = exists
        ? sharedAuth.users.map((u) => (u.id === exists.id ? { ...u, phone: digits } : u))
        : [
            {
              id,
              phone: digits,
              name: '',
              email: '',
              profileStatus: 'incomplete' as const,
              profileCompleted: false,
              createdAt: new Date().toISOString(),
            },
            ...sharedAuth.users,
          ];

      writeSharedAuth({
        isLoggedIn: true,
        currentUserId: resolvedId,
        users: nextUsers,
      });
    }

    setIsRiderLoggedInState(true);
    saveToStorage(STORAGE_KEYS.RIDER_AUTH, true);

    setCurrentRiderState((prev) => {
      const updated = { ...prev, phone: digits || prev.phone };
      saveToStorage(STORAGE_KEYS.CURRENT_RIDER, updated);
      return updated;
    });
  }, [applyServerUser]);

  const logoutUser = useCallback(() => {
    setToken(null);
    try {
      localStorage.removeItem('ridebhai_is_admin');
      localStorage.removeItem('ridebhai_has_plan');
    } catch {
      /* ignore */
    }
    writeSharedAuth({
      isLoggedIn: false,
      currentUserId: null,
    });
    writeSharedDeals({ deals: [], threads: [] });
    setIsRiderLoggedInState(false);
    setIsPartnerLoggedInState(false);
    setIsDriverLoggedInState(false);
    setIsAgencyLoggedInState(false);
    saveToStorage(STORAGE_KEYS.RIDER_AUTH, false);
    saveToStorage(STORAGE_KEYS.PARTNER_AUTH, false);
    saveToStorage(STORAGE_KEYS.DRIVER_AUTH, false);
    saveToStorage(STORAGE_KEYS.AGENCY_AUTH, false);
  }, []);

  const submitUserProfile = useCallback(
    async (data: {
      name: string;
      email: string;
      agencyName?: string;
      gstNumber?: string;
      aadhaarDoc: string;
      aadhaarName?: string;
      selfieDoc: string;
      selfieName?: string;
      city?: string;
    }) => {
      if (!currentUserId) return;
      if (getToken()) {
        await api('/me/profile', {
          method: 'PUT',
          json: {
            name: data.name.trim(),
            email: data.email.trim(),
            agencyName: data.agencyName,
            gstNumber: data.gstNumber,
            aadhaarDoc: data.aadhaarDoc,
            aadhaarName: data.aadhaarName,
            selfieDoc: data.selfieDoc,
            selfieName: data.selfieName,
            city: data.city?.trim(),
          },
        });
        await hydrateMe();
        return;
      }
      updateUsers((prev) =>
        prev.map((u) =>
          u.id === currentUserId
            ? {
                ...u,
                name: data.name.trim(),
                email: data.email.trim(),
                agencyName: data.agencyName?.trim() || undefined,
                gstNumber: data.gstNumber?.trim() || undefined,
                aadhaarDoc: data.aadhaarDoc,
                aadhaarName: data.aadhaarName,
                selfieDoc: data.selfieDoc,
                selfieName: data.selfieName,
                city: data.city?.trim() || u.city,
                profileCompleted: true,
                profileStatus: 'pending_verification' as UserProfileStatus,
                rejectionReason: undefined,
              }
            : u
        )
      );

      setCurrentRiderState((prev) => {
        const updated = {
          ...prev,
          name: data.name.trim() || prev.name,
          phone: currentUser?.phone || prev.phone,
        };
        saveToStorage(STORAGE_KEYS.CURRENT_RIDER, updated);
        return updated;
      });

      setDriversState((prev) => {
        const updated = prev.map((d) =>
          d.id === 'drv-current'
            ? {
                ...d,
                name: data.name.trim() || d.name,
                phone: currentUser?.phone || d.phone,
                city: data.city || d.city,
              }
            : d
        );
        saveToStorage(STORAGE_KEYS.DRIVERS, updated);
        return updated;
      });

      setAgenciesState((prev) => {
        const updated = prev.map((a) =>
          a.id === 'agency-current'
            ? {
                ...a,
                agencyName: data.agencyName?.trim() || data.name.trim() || a.agencyName,
                ownerName: data.name.trim() || a.ownerName,
                phone: currentUser?.phone || a.phone,
                city: data.city || a.city,
                documents: {
                  ...a.documents,
                  gstNumber: data.gstNumber?.trim() || a.documents?.gstNumber,
                },
              }
            : a
        );
        saveToStorage(STORAGE_KEYS.AGENCIES, updated);
        return updated;
      });

      setNotificationsState((prev) => {
        const next = [
          {
            id: `notif-${Date.now()}`,
            userId: currentUserId,
            userRole: 'rider' as const,
            title: 'Profile submitted',
            message:
              'You can browse cars and tours now. Chat and Deal with Ride Bhai unlock after admin verifies your Aadhaar and selfie, and you buy a plan.',
            type: 'system' as const,
            read: false,
            time: 'Just now',
          },
          ...prev,
        ];
        saveToStorage(STORAGE_KEYS.NOTIFICATIONS, next);
        return next;
      });
    },
    [currentUserId, currentUser, updateUsers, hydrateMe]
  );

  const adminVerifyUser = useCallback(
    async (userId: string, status: 'verified' | 'rejected', reason?: string) => {
      if (getToken()) {
        await api(`/admin/kyc/${userId}`, {
          method: 'POST',
          json: {
            decision: status,
            rejectionReason: reason,
          },
        });
      }
      updateUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                profileStatus: status,
                rejectionReason: status === 'rejected' ? reason || 'Documents could not be verified.' : undefined,
              }
            : u
        )
      );
      setNotificationsState((prev) => {
        const next = [
          {
            id: `notif-${Date.now()}`,
            userId,
            userRole: 'rider' as const,
            title: status === 'verified' ? 'Profile verified' : 'Profile rejected',
            message:
              status === 'verified'
                ? 'Your KYC is verified. Buy a plan to unlock booking, chat, and posting.'
                : `Profile was rejected: ${reason || 'Please re-upload clear Aadhaar and selfie photos.'}`,
            type: 'system' as const,
            read: false,
            time: 'Just now',
          },
          ...prev,
        ];
        saveToStorage(STORAGE_KEYS.NOTIFICATIONS, next);
        return next;
      });
    },
    [updateUsers]
  );

  // Persist whenever state changes
  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole);
    saveToStorage(STORAGE_KEYS.ROLE, newRole);
    notifyListeners();
  }, []);

  const setHasOnboarded = useCallback((val: boolean) => {
    setHasOnboardedState(val);
    saveToStorage(STORAGE_KEYS.ONBOARDED, val);
    notifyListeners();
  }, []);

  const updateDrivers = useCallback((updater: (prev: Driver[]) => Driver[]) => {
    setDriversState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.DRIVERS, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateRides = useCallback((updater: (prev: Ride[]) => Ride[]) => {
    setRidesState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.RIDES, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updatePackages = useCallback((updater: (prev: Package[]) => Package[]) => {
    setPackagesState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.PACKAGES, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateDriverPackages = useCallback((updater: (prev: DriverPackage[]) => DriverPackage[]) => {
    setDriverPackagesState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.DRIVER_PACKAGES, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateBookings = useCallback((updater: (prev: Booking[]) => Booking[]) => {
    setBookingsState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.BOOKINGS, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateChats = useCallback((updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setChatsState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.CHATS, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateDisputes = useCallback((updater: (prev: DisputeItem[]) => DisputeItem[]) => {
    setDisputesState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.DISPUTES, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateNotifications = useCallback((updater: (prev: NotificationItem[]) => NotificationItem[]) => {
    setNotificationsState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateAgencies = useCallback((updater: (prev: TravelAgency[]) => TravelAgency[]) => {
    setAgenciesState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.AGENCIES, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateAgencyPackages = useCallback((updater: (prev: AgencyPackage[]) => AgencyPackage[]) => {
    setAgencyPackagesState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.AGENCY_PACKAGES, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateAgencySubscriptions = useCallback((updater: (prev: AgencyActiveSubscription[]) => AgencyActiveSubscription[]) => {
    setAgencySubscriptionsState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.AGENCY_SUBSCRIPTIONS, next);
      return next;
    });
    notifyListeners();
  }, []);

  const updateAgencyTripPosts = useCallback((updater: (prev: AgencyTripPost[]) => AgencyTripPost[]) => {
    writeSharedListings({ tours: updater(sharedListings.tours) });
  }, []);

  const updateCarListings = useCallback((updater: (prev: CarListing[]) => CarListing[]) => {
    writeSharedListings({ cars: updater(sharedListings.cars) });
  }, []);

  const refreshListings = useCallback(async () => {
    writeSharedListings({ loading: true, error: '' });
    try {
      const [cars, tours] = await Promise.all([
        api<any[]>('/listings/cars'),
        api<any[]>('/listings/tours'),
      ]);
      let mappedCars = (cars || []).map(mapCarListing);
      let mappedTours = (tours || []).map(mapTourListing);
      if (getToken()) {
        try {
          const [mineCars, mineTours] = await Promise.all([
            api<any[]>('/listings/mine/cars'),
            api<any[]>('/listings/mine/tours'),
          ]);
          mappedCars = mergeById(mappedCars, (mineCars || []).map(mapCarListing));
          mappedTours = mergeById(mappedTours, (mineTours || []).map(mapTourListing));
        } catch {
          /* public feed still works if mine fails */
        }
      }
      writeSharedListings({ cars: mappedCars, tours: mappedTours, loading: false, error: '' });
    } catch (err: any) {
      writeSharedListings({
        loading: false,
        error: err?.message || 'Could not load listings. Is the API running?',
      });
    }
  }, []);

  const refreshDeals = useCallback(async () => {
    if (!getToken()) {
      writeSharedDeals({ deals: [], threads: [] });
      return;
    }
    try {
      const [dealRows, threadRows] = await Promise.all([
        api<any[]>('/deals'),
        api<any[]>('/chats/threads'),
      ]);
      writeSharedDeals({
        deals: (dealRows || []).map(mapDeal),
        threads: (threadRows || []).map(mapThread),
      });
    } catch {
      /* chat/bookings stay empty if API fails */
    }
  }, []);

  const openDeal = useCallback(
    async (payload: { listingType: 'car' | 'tour'; listingId: string; channel: 'direct' | 'ridebhai' }) => {
      const result = await api<{ deal: any; thread: any }>('/deals', {
        method: 'POST',
        json: payload,
      });
      await refreshDeals();
      return {
        deal: mapDeal(result.deal),
        thread: mapThread(result.thread),
      };
    },
    [refreshDeals]
  );

  const sendThreadMessage = useCallback(async (threadId: string, body: string) => {
    await api(`/chats/threads/${threadId}/messages`, {
      method: 'POST',
      json: { body },
    });
    await refreshDeals();
  }, [refreshDeals]);

  const confirmDeal = useCallback(
    async (dealId: string) => {
      await api(`/deals/${dealId}/confirm`, { method: 'PATCH' });
      await refreshDeals();
    },
    [refreshDeals]
  );

  const rateDeal = useCallback(
    async (dealId: string, stars: number) => {
      await api(`/deals/${dealId}/rate`, { method: 'POST', json: { stars } });
      await refreshDeals();
    },
    [refreshDeals]
  );

  const updateInquiries = useCallback((updater: (prev: Inquiry[]) => Inquiry[]) => {
    setInquiriesState((prev) => {
      const next = updater(prev);
      saveToStorage(STORAGE_KEYS.INQUIRIES, next);
      return next;
    });
    notifyListeners();
  }, []);

  // --- CORE BOOST LOGIC: Computed Live On Every Read ---
  const isDriverBoosted = useCallback((driverId: string): boolean => {
    const now = Date.now();
    return driverPackages.some((dp) => dp.driverId === driverId && dp.expiresAt > now);
  }, [driverPackages]);

  const getDriverActivePackage = useCallback((driverId: string): { pkg: Package | undefined; expiresAt: number } | null => {
    const now = Date.now();
    const activeDP = driverPackages.find((dp) => dp.driverId === driverId && dp.expiresAt > now);
    if (!activeDP) return null;
    const pkg = packages.find((p) => p.id === activeDP.packageId);
    return { pkg, expiresAt: activeDP.expiresAt };
  }, [driverPackages, packages]);

  // --- AGENCY SUBSCRIPTION & VERIFICATION SELECTORS ---
  const getAgencyActiveSubscription = useCallback((agencyId: string): { sub: AgencyActiveSubscription; pkg: AgencyPackage } | null => {
    const now = Date.now();
    const activeSub = agencySubscriptions.find((s) => s.agencyId === agencyId && s.expiresAt > now && s.postsRemaining > 0);
    if (!activeSub) return null;
    const pkg = agencyPackages.find((p) => p.id === activeSub.packageId) || agencyPackages[0];
    return { sub: activeSub, pkg };
  }, [agencySubscriptions, agencyPackages]);

  const isAgencyVerified = useCallback((agencyId: string): boolean => {
    const target = agencies.find((a) => a.id === agencyId);
    return target ? target.status === 'verified' : false;
  }, [agencies]);

  const canBook = useCallback((): {
    allowed: boolean;
    reason?: string;
    code?: 'incomplete' | 'unverified' | 'no_package';
  } => {
    if (!currentUser) {
      return { allowed: false, code: 'incomplete', reason: 'Login with OTP and complete your profile first.' };
    }
    if (!currentUser.profileCompleted || currentUser.profileStatus === 'incomplete') {
      return { allowed: false, code: 'incomplete', reason: 'Complete your profile (name, email, Aadhaar and selfie) to continue.' };
    }
    if (currentUser.profileStatus === 'pending_verification') {
      return {
        allowed: false,
        code: 'unverified',
        reason: 'Admin is reviewing your Aadhaar and selfie. You can browse now. Booking unlocks after verification and a plan.',
      };
    }
    if (currentUser.profileStatus === 'rejected') {
      return {
        allowed: false,
        code: 'unverified',
        reason: currentUser.rejectionReason || 'Your profile was rejected. Update Aadhaar and selfie, then resubmit.',
      };
    }
    const hasPlan =
      Boolean(getAgencyActiveSubscription(currentUser.id)) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('ridebhai_has_plan') === '1');
    if (!hasPlan) {
      return {
        allowed: false,
        code: 'no_package',
        reason: 'KYC is done. Next: buy a plan. A plan unlocks booking, chat, and posting cars or tours.',
      };
    }
    return { allowed: true };
  }, [currentUser, getAgencyActiveSubscription]);

  // Posting uses the same rule as booking: verified profile + active plan
  const canAgencyPost = useCallback(
    (_agencyId?: string): { canPost: boolean; reason?: string; code?: 'not_verified' | 'no_package' } => {
      const gate = canBook();
      if (gate.allowed) return { canPost: true };
      return {
        canPost: false,
        code: gate.code === 'no_package' ? 'no_package' : 'not_verified',
        reason: gate.reason,
      };
    },
    [canBook]
  );

  const partnerCars = useMemo(() => {
    const list = currentUser?.vehicles || [];
    return list.map((v, i) => ({
      ...v,
      id: v.id || v.plate || `car-${i}`,
      currentCity: v.currentCity || currentUser?.city || '',
      availability: v.availability || 'citywide',
    }));
  }, [currentUser]);

  const isVehicleReady = (v: { make?: string; model?: string; plate?: string; rcDocument?: string }) =>
    Boolean(v.make?.trim() && v.model?.trim() && v.plate?.trim() && v.rcDocument);

  const canPostCar = useCallback((): {
    ok: boolean;
    reason?: string;
    code?: 'no_driver' | 'pending_driver' | 'no_vehicle' | 'pending_vehicle';
  } => {
    const drivers = currentUser?.driverProfiles?.length
      ? currentUser.driverProfiles
      : currentUser?.driverProfile
        ? [currentUser.driverProfile]
        : [];
    const completeDriver = drivers.some(
      (dp) =>
        dp.completed &&
        dp.name?.trim() &&
        dp.email?.trim() &&
        dp.phone?.trim() &&
        dp.aadhaarDoc &&
        dp.selfieDoc &&
        dp.experienceYears !== undefined &&
        dp.experienceYears !== null
    );
    const verifiedDriver = drivers.some(
      (dp) =>
        dp.completed &&
        dp.verificationStatus === 'verified' &&
        dp.name?.trim() &&
        dp.email?.trim() &&
        dp.phone?.trim() &&
        dp.aadhaarDoc &&
        dp.selfieDoc
    );
    const hasVehicle = partnerCars.some((v) => isVehicleReady(v));
    const verifiedVehicle = partnerCars.some((v) => isVehicleReady(v) && v.verificationStatus === 'verified');
    if (!completeDriver) {
      return {
        ok: false,
        code: 'no_driver',
        reason:
          'Add one driver profile first: name, email, number, Aadhaar, selfie and experience. Open Profile → My drivers.',
      };
    }
    if (!hasVehicle) {
      return {
        ok: false,
        code: 'no_vehicle',
        reason:
          'Add one vehicle with full details and RC document. Open Profile → My cars.',
      };
    }
    if (!verifiedDriver && !verifiedVehicle) {
      return {
        ok: false,
        code: 'pending_driver',
        reason: 'Driver and vehicle are pending verification. Post car unlocks after admin verifies both.',
      };
    }
    if (!verifiedDriver) {
      return {
        ok: false,
        code: 'pending_driver',
        reason: 'Driver profile is pending verification. Post car unlocks after admin verifies a driver.',
      };
    }
    if (!verifiedVehicle) {
      return {
        ok: false,
        code: 'pending_vehicle',
        reason: 'Vehicle is pending verification. Post car unlocks after admin verifies a car.',
      };
    }
    return { ok: true };
  }, [currentUser, partnerCars]);

  const canPostTour = useCallback((): {
    ok: boolean;
    reason?: string;
    code?: 'incomplete' | 'unverified' | 'no_package' | 'no_agency';
  } => {
    const gate = canBook();
    if (!gate.allowed) {
      return { ok: false, reason: gate.reason, code: gate.code };
    }
    if (!currentUser?.agencyName?.trim()) {
      return {
        ok: false,
        code: 'no_agency',
        reason: 'Add a travel agency name in your profile before posting a tour.',
      };
    }
    return { ok: true };
  }, [canBook, currentUser]);

  const saveDriverProfile = useCallback(
    async (data: DriverProfile) => {
      if (!currentUserId) return;
      if (getToken()) {
        await api('/me/driver', {
          method: 'PUT',
          json: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            aadhaarDoc: data.aadhaarDoc,
            selfieDoc: data.selfieDoc,
            dlNumber: data.dlNumber,
            dlDoc: data.dlDoc,
            experienceYears: data.experienceYears,
            experienceNote: data.experienceNote,
          },
        });
        await hydrateMe();
        return;
      }
      writeSharedAuth({
        users: sharedAuth.users.map((u) =>
          u.id === currentUserId
            ? {
                ...u,
                driverProfile: { ...data, completed: true },
                driverProfiles: [...(u.driverProfiles || []), { ...data, completed: true }],
              }
            : u
        ),
      });
    },
    [currentUserId, hydrateMe]
  );

  const saveBankDetails = useCallback(
    async (data: BankDetails) => {
      if (!currentUserId) return;
      if (getToken()) {
        await api('/me/bank', {
          method: 'PUT',
          json: {
            accountHolderName: data.accountHolderName,
            accountNumber: data.accountNumber,
            ifsc: data.ifsc,
            bankName: data.bankName,
            branchName: data.branchName,
            accountType: data.accountType,
            upiId: data.upiId,
          },
        });
        await hydrateMe();
        return;
      }
      writeSharedAuth({
        users: sharedAuth.users.map((u) =>
          u.id === currentUserId ? { ...u, bankDetails: { ...data, completed: true } } : u
        ),
      });
    },
    [currentUserId, hydrateMe]
  );

  const isCarListingLive = (c: { status: string; availableTillDate?: string; availableTillTime?: string }) => {
    if (c.status !== 'available') return false;
    if (!c.availableTillDate) return true;
    const till = new Date(`${c.availableTillDate}T${c.availableTillTime || '23:59'}`);
    if (Number.isNaN(till.getTime())) return true;
    return till.getTime() >= Date.now();
  };

  const getFilteredCarListings = useCallback(
    (filter?: {
      fromCity?: string;
      toCity?: string;
      bookingDate?: string;
      availableTill?: string;
      maxPrice?: number;
      minSeats?: number;
      fuelType?: string;
      availability?: string;
      carType?: string;
    }) => {
      const from = (filter?.fromCity || '').trim().toLowerCase();
      const to = (filter?.toCity || '').trim().toLowerCase();
      const bookingDate = (filter?.bookingDate || '').trim();
      const availableTill = (filter?.availableTill || '').trim();
      const maxPrice = Number(filter?.maxPrice || 0);
      const minSeats = Number(filter?.minSeats || 0);
      const fuel = (filter?.fuelType || '').trim().toLowerCase();
      const availability = (filter?.availability || '').trim();
      const carType = (filter?.carType || '').trim().toLowerCase();

      return carListings.filter(isCarListingLive).filter((c) => {
        if (from && !c.currentCity.toLowerCase().includes(from)) return false;
        if (to) {
          if (c.availability === 'citywide') return false;
          if (!c.toCity?.toLowerCase().includes(to)) return false;
        }
        if (availability && c.availability !== availability) return false;
        if (bookingDate) {
          const start = c.bookingDate || '';
          const till = c.availableTillDate || c.bookingDate || '';
          if (start && till) {
            if (bookingDate < start || bookingDate > till) return false;
          } else if (start && start !== bookingDate) return false;
          else if (!start) return false;
        }
        if (availableTill && (c.availableTillDate || '') < availableTill) return false;
        if (maxPrice && c.fullCarPrice > maxPrice) return false;
        if (minSeats && c.seats < minSeats) return false;
        if (fuel && (c.fuelType || '').toLowerCase() !== fuel) return false;
        if (carType) {
          const body = listingCarBody(c.make, c.model, c.carName);
          if (body !== carType) return false;
        }
        return true;
      });
    },
    [carListings]
  );

  const getFilteredTours = useCallback(
    (filter?: {
      fromCity?: string;
      toCity?: string;
      bookingDate?: string;
      maxPrice?: number;
      minPax?: number;
      tripSide?: string;
      carType?: string;
    }) => {
      const from = (filter?.fromCity || '').trim().toLowerCase();
      const to = (filter?.toCity || '').trim().toLowerCase();
      const bookingDate = (filter?.bookingDate || '').trim();
      const maxPrice = Number(filter?.maxPrice || 0);
      const minPax = Number(filter?.minPax || 0);
      const tripSide = (filter?.tripSide || '').trim();
      const carType = (filter?.carType || '').trim().toLowerCase();

      return agencyTripPosts.filter((t) => t.status === 'active').filter((t) => {
        if (from && !t.fromCity.toLowerCase().includes(from)) return false;
        if (to && !t.toCity.toLowerCase().includes(to)) return false;
        if (bookingDate && (t.bookingDate || t.startDate) !== bookingDate) return false;
        if (maxPrice && t.totalCustomerPrice > maxPrice) return false;
        if (minPax && t.passengers < minPax) return false;
        if (tripSide && (t.tripSide || 'one_side') !== tripSide) return false;
        if (carType) {
          const body = desiredCarBody(t.desiredCar?.name || t.requiredVehicleType);
          if (body !== carType) return false;
        }
        return true;
      });
    },
    [agencyTripPosts]
  );

  // --- SEARCH & RANKING SELECTOR ---
  const getRankedRides = useCallback(
    (filterParams?: {
      fromCity?: string;
      toCity?: string;
      date?: string;
      minSeats?: number;
      instantOnly?: boolean;
      acOnly?: boolean;
      maxPrice?: number;
    }): EnrichedRide[] => {
      const {
        fromCity = '',
        toCity = '',
        date = '',
        minSeats = 1,
        instantOnly = false,
        acOnly = false,
        maxPrice,
      } = filterParams || {};

      // 1. Initial filter
      const matched = rides.filter((ride) => {
        if (fromCity && !ride.fromCity.toLowerCase().includes(fromCity.toLowerCase())) return false;
        if (toCity && !ride.toCity.toLowerCase().includes(toCity.toLowerCase())) return false;
        if (date && ride.date !== date) return false;
        if (ride.availableSeats < minSeats) return false;
        if (instantOnly && !ride.instantBooking) return false;
        if (acOnly && !ride.preferences.ac) return false;
        if (maxPrice && ride.pricePerSeat > maxPrice) return false;
        return true;
      });

      // 2. Separate into Featured & Regular groups based on LIVE driver package check
      const featuredGroup: EnrichedRide[] = [];
      const regularGroup: EnrichedRide[] = [];

      for (const ride of matched) {
        const driver = drivers.find((d) => d.id === ride.driverId);
        if (!driver) continue;

        const boosted = isDriverBoosted(driver.id);
        const activePkgInfo = getDriverActivePackage(driver.id);

        if (boosted) {
          featuredGroup.push({
            ...ride,
            isFeatured: true,
            packageName: activePkgInfo?.pkg?.name || 'Weekly Boost',
            driver: {
              id: driver.id,
              name: driver.name,
              avatar: driver.avatar,
              rating: driver.rating,
              totalReviews: driver.totalReviews,
              totalRides: driver.totalRides,
              vehicle: driver.vehicle,
              idVerified: driver.idVerified,
              phone: driver.phone,
            },
          });
        } else {
          regularGroup.push({
            ...ride,
            isFeatured: false,
            driver: {
              id: driver.id,
              name: driver.name,
              avatar: driver.avatar,
              rating: driver.rating,
              totalReviews: driver.totalReviews,
              totalRides: driver.totalRides,
              vehicle: driver.vehicle,
              idVerified: driver.idVerified,
            },
          });
        }
      }

      featuredGroup.sort((a, b) => (b.driver.rating || 0) - (a.driver.rating || 0));
      regularGroup.sort((a, b) => a.pricePerSeat - b.pricePerSeat);

      return [...featuredGroup, ...regularGroup];
    },
    [rides, drivers, isDriverBoosted, getDriverActivePackage]
  );

  // --- ACTIONS ---

  // 1. Post a new Ride (Driver)
  const postRide = useCallback(
    (newRideData: Omit<Ride, 'id' | 'createdAt' | 'driverId'>) => {
      const newRide: Ride = {
        ...newRideData,
        id: `ride-${Date.now()}`,
        driverId: currentDriver.id,
        createdAt: new Date().toISOString().split('T')[0],
      };
      updateRides((prev) => [newRide, ...prev]);

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: currentDriver.id,
        userRole: 'driver',
        title: 'Ride Published! 🚀',
        message: `Your ride from ${newRide.fromCity} to ${newRide.toCity} on ${newRide.date} is now live for bookings.`,
        type: 'booking',
        time: 'Just now',
        read: false,
      };
      updateNotifications((prev) => [newNotif, ...prev]);
      return newRide;
    },
    [currentDriver, updateRides, updateNotifications]
  );

  // 2. Book Seats (Rider)
  const bookSeats = useCallback(
    (rideId: string, seatsCount: number, paymentMethod: 'upi' | 'card' | 'wallet' = 'upi') => {
      const ride = rides.find((r) => r.id === rideId);
      if (!ride || ride.availableSeats < seatsCount) {
        throw new Error('Seats not available');
      }

      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const newBooking: Booking = {
        id: `bk-${Date.now()}`,
        rideId,
        riderId: currentRider.id,
        driverId: ride.driverId,
        seatsBooked: seatsCount,
        totalPrice: ride.pricePerSeat * seatsCount,
        status: ride.instantBooking ? 'confirmed' : 'pending',
        pickupOtp: generatedOtp,
        paymentMethod,
        bookedAt: new Date().toISOString(),
      };

      updateRides((prev) =>
        prev.map((r) => (r.id === rideId ? { ...r, availableSeats: r.availableSeats - seatsCount } : r))
      );

      updateBookings((prev) => [newBooking, ...prev]);

      const riderNotif: NotificationItem = {
        id: `notif-rdr-${Date.now()}`,
        userId: currentRider.id,
        userRole: 'rider',
        title: ride.instantBooking ? 'Booking Confirmed! 🚗' : 'Booking Requested ⏳',
        message: `Your trip from ${ride.fromCity} to ${ride.toCity} is ${ride.instantBooking ? 'confirmed. OTP: ' + generatedOtp : 'awaiting driver confirmation.'}`,
        type: 'booking',
        time: 'Just now',
        read: false,
      };
      const driverNotif: NotificationItem = {
        id: `notif-drv-${Date.now()}`,
        userId: ride.driverId,
        userRole: 'driver',
        title: 'New Seat Booking! 🙋‍♂️',
        message: `${currentRider.name} booked ${seatsCount} seat(s) for your ${ride.fromCity} → ${ride.toCity} ride.`,
        type: 'booking',
        time: 'Just now',
        read: false,
      };
      updateNotifications((prev) => [riderNotif, driverNotif, ...prev]);

      return newBooking;
    },
    [rides, currentRider, updateRides, updateBookings, updateNotifications]
  );

  // 3. Purchase Driver Boost Package
  const purchasePackage = useCallback(
    (packageId: string) => {
      const pkg = packages.find((p) => p.id === packageId);
      if (!pkg) throw new Error('Package not found');

      const now = Date.now();
      const expiresAt = now + pkg.durationDays * 24 * 60 * 60 * 1000;

      const newDriverPackage: DriverPackage = {
        id: `dp-${Date.now()}`,
        driverId: currentDriver.id,
        packageId,
        purchasedAt: now,
        expiresAt,
      };

      updateDriverPackages((prev) => {
        const filtered = prev.filter((dp) => dp.driverId !== currentDriver.id);
        return [newDriverPackage, ...filtered];
      });

      const notif: NotificationItem = {
        id: `notif-pkg-${Date.now()}`,
        userId: currentDriver.id,
        userRole: 'driver',
        title: 'Boost Activated! 🌟',
        message: `Your "${pkg.name}" is active until ${new Date(expiresAt).toLocaleDateString()}. All your rides are now Featured!`,
        type: 'boost',
        time: 'Just now',
        read: false,
      };
      updateNotifications((prev) => [notif, ...prev]);

      return newDriverPackage;
    },
    [packages, currentDriver, updateDriverPackages, updateNotifications]
  );

  // 4. Simulate Package Expiry
  const simulatePackageExpiry = useCallback(
    (driverId: string = currentDriver.id) => {
      const pastTime = Date.now() - 1000 * 60;
      updateDriverPackages((prev) =>
        prev.map((dp) => (dp.driverId === driverId ? { ...dp, expiresAt: pastTime } : dp))
      );
    },
    [currentDriver, updateDriverPackages]
  );

  // 5. Driver Verification / Simulation
  const simulateDriverStatusChange = useCallback(
    (driverId: string, status: DriverStatus, reason?: string) => {
      updateDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId
            ? {
                ...d,
                status,
                idVerified: status === 'verified',
                rejectionReason: status === 'rejected' ? (reason || 'Document verification failed. Please upload a clear copy.') : undefined,
              }
            : d
        )
      );
    },
    [updateDrivers]
  );

  const submitDriverVerification = useCallback(
    (documents: DriverDocuments, vehiclesList: Vehicle[]) => {
      const primaryVehicle = vehiclesList.find((v) => v.isPrimary) || vehiclesList[0];
      updateDrivers((prev) =>
        prev.map((d) => {
          if (d.id === 'drv-current' || d.id === currentDriver.id) {
            return {
              ...d,
              status: 'pending_verification' as DriverStatus,
              idVerified: false,
              rejectionReason: undefined,
              documents: {
                ...d.documents,
                ...documents,
                submittedAt: new Date().toISOString(),
              },
              vehicle: primaryVehicle || d.vehicle,
              vehicles: vehiclesList.length > 0 ? vehiclesList : (d.vehicles || [primaryVehicle || d.vehicle]),
            };
          }
          return d;
        })
      );

      updateNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: currentDriver.id,
          userRole: 'driver',
          title: 'Verification In Progress 🔒',
          message: 'Your KYC documents & vehicle registration have been submitted. Our compliance team is verifying your profile.',
          type: 'verification',
          read: false,
          time: 'Just now',
        },
        ...prev,
      ]);
    },
    [currentDriver.id, updateDrivers, updateNotifications]
  );

  const addDriverVehicle = useCallback(
    (newVehicle: Vehicle) => {
      updateDrivers((prev) =>
        prev.map((d) => {
          if (d.id === 'drv-current' || d.id === currentDriver.id) {
            const currentList = d.vehicles || [d.vehicle];
            const updatedList = [...currentList, newVehicle];
            return {
              ...d,
              vehicles: updatedList,
            };
          }
          return d;
        })
      );
    },
    [currentDriver.id, updateDrivers]
  );

  const removeDriverVehicle = useCallback(
    (vehicleId: string) => {
      updateDrivers((prev) =>
        prev.map((d) => {
          if (d.id === 'drv-current' || d.id === currentDriver.id) {
            const currentList = d.vehicles || [d.vehicle];
            const updatedList = currentList.filter((v) => v.id !== vehicleId && v.plate !== vehicleId);
            return {
              ...d,
              vehicles: updatedList,
              vehicle: updatedList[0] || d.vehicle,
            };
          }
          return d;
        })
      );
    },
    [currentDriver.id, updateDrivers]
  );

  // 6. Travel Agency Actions
  const submitAgencyVerification = useCallback(
    (agencyId: string, docs: AgencyDocuments) => {
      updateAgencies((prev) =>
        prev.map((a) => {
          if (a.id === agencyId || a.id === 'agency-current') {
            return {
              ...a,
              status: 'pending_verification' as AgencyStatus,
              idVerified: false,
              rejectionReason: undefined,
              documents: {
                ...a.documents,
                ...docs,
                submittedAt: new Date().toISOString(),
              },
            };
          }
          return a;
        })
      );

      updateNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: agencyId,
          userRole: 'agency',
          title: 'KYC Submitted 📄',
          message: 'Your Agency registration & GST documents have been submitted to Ride Bhai admin for verification.',
          type: 'agency',
          read: false,
          time: 'Just now',
        },
        ...prev,
      ]);
    },
    [updateAgencies, updateNotifications]
  );

  const adminVerifyAgency = useCallback(
    (agencyId: string, status: AgencyStatus, reason?: string) => {
      updateAgencies((prev) =>
        prev.map((a) =>
          a.id === agencyId
            ? {
                ...a,
                status,
                idVerified: status === 'verified',
                rejectionReason: status === 'rejected' ? (reason || 'Verification documents were unclear or invalid.') : undefined,
              }
            : a
        )
      );

      updateNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: agencyId,
          userRole: 'agency',
          title: status === 'verified' ? 'Agency Verified! 🎉' : 'Verification Update ⚠️',
          message: status === 'verified'
            ? 'Your agency is verified! You can now subscribe to a package and publish tour bookings to drivers.'
            : `Your verification was rejected: ${reason || 'Please re-upload proper documents.'}`,
          type: 'agency',
          read: false,
          time: 'Just now',
        },
        ...prev,
      ]);
    },
    [updateAgencies, updateNotifications]
  );

  const purchaseAgencyPackage = useCallback(
    (agencyId: string, packageId: string) => {
      const pkg = agencyPackages.find((p) => p.id === packageId);
      if (!pkg) throw new Error('Agency Package not found');

      const now = Date.now();
      const expiresAt = now + pkg.durationDays * 24 * 60 * 60 * 1000;

      const newSub: AgencyActiveSubscription = {
        id: `sub-${Date.now()}`,
        agencyId,
        packageId,
        purchasedAt: now,
        expiresAt,
        postsRemaining: pkg.postLimit,
      };

      updateAgencySubscriptions((prev) => {
        const filtered = prev.filter((s) => s.agencyId !== agencyId);
        return [newSub, ...filtered];
      });

      updateAgencies((prev) =>
        prev.map((a) => (a.id === agencyId ? { ...a, activePackageId: packageId } : a))
      );

      updateNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: agencyId,
          userRole: 'agency',
          title: 'Agency Package Activated! 🎫',
          message: `Your "${pkg.name}" is now active until ${new Date(expiresAt).toLocaleDateString()}. You can now publish tour bookings directly!`,
          type: 'agency',
          read: false,
          time: 'Just now',
        },
        ...prev,
      ]);

      return newSub;
    },
    [agencyPackages, updateAgencySubscriptions, updateAgencies, updateNotifications]
  );

  // 7. Post Agency Tour Trip (Strictly checks verification & active package)
  const postAgencyTrip = useCallback(
    async (tripData: {
      fromCity: string;
      toCity: string;
      tripSide?: 'one_side' | 'two_side';
      postedDate?: string;
      postedTime?: string;
      bookingDate?: string;
      bookingTime?: string;
      passengers: number;
      duration: string;
      startDate: string;
      endDate?: string;
      pickupTime?: string;
      pickupLocation: string;
      dropLocation: string;
      requiredVehicleType: string;
      totalCustomerPrice: number;
      agencyCommission: number;
      tripDetails: string;
      routeHighlights?: string[];
      tourType?: string;
      tollTaxOption?: string;
      parkingOption?: string;
      driverNightAllowance?: string;
      kmLimit?: string;
      luggageCapacity?: string;
      driverPreferences?: string;
      paymentTerms?: string;
      payoutMode?: string;
      desiredCar?: { name: string; specs: string[] };
    }) => {
      const tourGate = canPostTour();
      if (!tourGate.ok) {
        throw new Error(tourGate.reason || 'Cannot post trip.');
      }
      if (!getToken()) {
        throw new Error('Login required to post a tour.');
      }

      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const bookingDate = tripData.bookingDate || tripData.startDate;
      const bookingTime = tripData.bookingTime || tripData.pickupTime || defaultTime;

      await api('/listings/tours', {
        method: 'POST',
        json: {
          fromCity: tripData.fromCity,
          toCity: tripData.toCity,
          tripSide: tripData.tripSide || 'one_side',
          bookingDate,
          bookingTime,
          passengers: Number(tripData.passengers),
          duration: tripData.duration,
          pickupLocation: tripData.pickupLocation,
          dropLocation: tripData.dropLocation,
          requiredVehicleType: tripData.requiredVehicleType,
          desiredCarName: tripData.desiredCar?.name,
          desiredCarSpecs: tripData.desiredCar?.specs || [],
          totalCustomerPrice: Number(tripData.totalCustomerPrice),
          agencyCommission: Number(tripData.agencyCommission || 0),
          tripDetails: tripData.tripDetails,
          tourType: tripData.tourType,
          routeHighlights: tripData.routeHighlights || [],
          tollTaxOption: tripData.tollTaxOption,
          parkingOption: tripData.parkingOption,
          driverNightAllowance: tripData.driverNightAllowance,
          kmLimit: tripData.kmLimit,
          luggageCapacity: tripData.luggageCapacity,
          driverPreferences: tripData.driverPreferences,
          paymentTerms: tripData.paymentTerms,
          payoutMode: tripData.payoutMode,
        },
      });
      await Promise.all([refreshListings(), hydrateMe()]);
    },
    [canPostTour, refreshListings, hydrateMe]
  );

  const claimAgencyTrip = useCallback(
    (tripId: string, driverId?: string, driverName?: string, driverPhone?: string) => {
      const dId = driverId || currentDriver.id;
      const dName = driverName || currentDriver.name;
      const dPhone = driverPhone || currentDriver.phone;

      updateAgencyTripPosts((prev) =>
        prev.map((t) => {
          if (t.id !== tripId) return t;
          return {
            ...t,
            status: 'claimed' as AgencyTripStatus,
            claimedByDriverId: dId,
            claimedByDriverName: dName,
            claimedByDriverPhone: dPhone,
            claimedAt: new Date().toISOString(),
          };
        })
      );
    },
    [currentDriver, updateAgencyTripPosts]
  );

  const deleteAgencyTrip = useCallback(
    async (tripId: string) => {
      if (getToken()) {
        await api(`/listings/tours/${tripId}`, { method: 'DELETE' });
        await refreshListings();
        await refreshDeals();
        return;
      }
      updateAgencyTripPosts((prev) => prev.filter((t) => t.id !== tripId));
    },
    [updateAgencyTripPosts, refreshListings, refreshDeals]
  );

  const updateAgencyTripStatus = useCallback(
    async (tripId: string, status: AgencyTripStatus) => {
      const serverStatus = status === 'active' ? 'active' : status === 'cancelled' ? 'cancelled' : 'closed';
      if (getToken()) {
        await api(`/listings/tours/${tripId}`, { method: 'PATCH', json: { status: serverStatus } });
        await refreshListings();
        return;
      }
      updateAgencyTripPosts((prev) => prev.map((t) => (t.id === tripId ? { ...t, status } : t)));
    },
    [updateAgencyTripPosts, refreshListings]
  );

  const updateCarListingStatus = useCallback(
    async (listingId: string, status: 'available' | 'inactive') => {
      if (getToken()) {
        await api(`/listings/cars/${listingId}`, { method: 'PATCH', json: { status } });
        await refreshListings();
        return;
      }
      updateCarListings((prev) => prev.map((c) => (c.id === listingId ? { ...c, status } : c)));
    },
    [updateCarListings, refreshListings]
  );

  const saveAgencyPackage = useCallback(
    (pkg: AgencyPackage) => {
      updateAgencyPackages((prev) => {
        const exists = prev.some((p) => p.id === pkg.id);
        if (exists) {
          return prev.map((p) => (p.id === pkg.id ? pkg : p));
        }
        return [...prev, pkg];
      });
    },
    [updateAgencyPackages]
  );

  const deleteAgencyPackage = useCallback(
    (pkgId: string) => {
      updateAgencyPackages((prev) => prev.filter((p) => p.id !== pkgId));
    },
    [updateAgencyPackages]
  );

  const updateCurrentAgency = useCallback(
    (updates: Partial<TravelAgency>) => {
      updateAgencies((prev) =>
        prev.map((a) => (a.id === 'agency-current' || a.id === currentAgency.id ? { ...a, ...updates } : a))
      );
    },
    [currentAgency.id, updateAgencies]
  );

  const addPartnerCar = useCallback(
    async (car: Vehicle) => {
      const withId: Vehicle = {
        ...car,
        id: car.id || `car-${Date.now()}`,
      };
      if (!currentUserId) return withId;
      if (getToken()) {
        await api('/me/vehicles', {
          method: 'POST',
          json: {
            make: car.make,
            model: car.model,
            year: car.year,
            color: car.color,
            plate: car.plate,
            seats: car.seats,
            fuelType: car.fuelType,
            rcNumber: car.rcNumber,
            rcDocument: car.rcDocument,
            insuranceDocument: car.insuranceDocument,
            currentCity: car.currentCity,
            availability: car.availability || 'citywide',
            toCity: car.toCity,
          },
        });
        await hydrateMe();
        return withId;
      }
      writeSharedAuth({
        users: sharedAuth.users.map((u) =>
          u.id === currentUserId ? { ...u, vehicles: [...(u.vehicles || []), withId] } : u
        ),
      });
      return withId;
    },
    [currentUserId, hydrateMe]
  );

  const updatePartnerCar = useCallback(
    (carId: string, updates: Partial<Vehicle>) => {
      updateDrivers((prev) =>
        prev.map((d) => {
          if (d.id !== 'drv-current' && d.id !== currentDriver.id) return d;
          const currentList = d.vehicles?.length ? d.vehicles : d.vehicle ? [d.vehicle] : [];
          const vehicles = currentList.map((v) =>
            (v.id || v.plate) === carId ? { ...v, ...updates } : v
          );
          return { ...d, vehicles, vehicle: vehicles[0] || d.vehicle };
        })
      );
    },
    [currentDriver.id, updateDrivers]
  );

  const postCarListing = useCallback(
    async (data: {
      carId: string;
      driverId: string;
      fullCarPrice: number;
      availability: 'citywide' | 'route';
      currentCity: string;
      toCity?: string;
      bookingDate?: string;
      bookingTime?: string;
      availableTillDate?: string;
      availableTillTime?: string;
      notes?: string;
    }) => {
      const gateCheck = canAgencyPost();
      if (!gateCheck.canPost) {
        throw new Error(gateCheck.reason || 'Buy a posting package first.');
      }
      const driverGate = canPostCar();
      if (!driverGate.ok) {
        throw new Error(driverGate.reason || 'Add driver profile and vehicle details first.');
      }
      if (!getToken()) {
        throw new Error('Login required to post a car.');
      }
      if (!/^[0-9a-f-]{36}$/i.test(data.carId)) {
        throw new Error('Choose a verified car from My cars.');
      }
      if (!/^[0-9a-f-]{36}$/i.test(data.driverId)) {
        throw new Error('Choose a verified driver from My drivers.');
      }

      await api('/listings/cars', {
        method: 'POST',
        json: {
          vehicleId: data.carId,
          driverId: data.driverId,
          fullCarPrice: Number(data.fullCarPrice),
          availability: data.availability,
          currentCity: data.currentCity,
          toCity: data.toCity,
          bookingDate: data.bookingDate,
          bookingTime: data.bookingTime,
          availableTillDate: data.availableTillDate,
          availableTillTime: data.availableTillTime,
          notes: data.notes,
        },
      });
      await Promise.all([refreshListings(), hydrateMe()]);
    },
    [canAgencyPost, canPostCar, refreshListings, hydrateMe]
  );

  const logInquiry = useCallback(
    (payload: Omit<Inquiry, 'id' | 'createdAt' | 'riderId' | 'riderName'> & { riderId?: string; riderName?: string }) => {
      const label = currentUser?.agencyName || currentUser?.name || currentAgency.agencyName || currentRider.name;
      const phone = currentUser?.phone || currentAgency.phone || currentRider.phone;
      const inquiry: Inquiry = {
        ...payload,
        id: `inq-${Date.now()}`,
        riderId: payload.riderId || currentUser?.id || currentRider.id,
        riderName: payload.riderName || label,
        inquirerRole: payload.inquirerRole || 'customer',
        inquirerPhone: payload.inquirerPhone || phone,
        createdAt: new Date().toISOString(),
      };
      updateInquiries((prev) => [inquiry, ...prev]);
      return inquiry;
    },
    [currentUser, currentAgency, currentRider, updateInquiries]
  );

  // 8. Driver Accept / Reject Booking Request
  const handleBookingRequest = useCallback(
    (bookingId: string, action: 'accept' | 'reject') => {
      updateBookings((prev) =>
        prev.map((b) => {
          if (b.id !== bookingId) return b;
          return {
            ...b,
            status: action === 'accept' ? 'confirmed' : 'rejected',
          };
        })
      );
    },
    [updateBookings]
  );

  // 9. Trip Lifecycle Simulation
  const simulateTripStart = useCallback(
    (bookingId: string) => {
      updateBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: 'started', startedAt: new Date().toISOString() }
            : b
        )
      );
    },
    [updateBookings]
  );

  const simulateTripComplete = useCallback(
    (bookingId: string) => {
      updateBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? { ...b, status: 'completed', completedAt: new Date().toISOString() }
            : b
        )
      );
    },
    [updateBookings]
  );

  // 10. Submit Rating / Review
  const submitReview = useCallback(
    (bookingId: string, rating: number, comment: string) => {
      const targetBooking = bookings.find((b) => b.id === bookingId);
      if (!targetBooking) return;

      const review = {
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      updateBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, review } : b))
      );

      updateDrivers((prev) =>
        prev.map((d) => {
          if (d.id !== targetBooking.driverId) return d;
          const newTotalReviews = (d.totalReviews || 0) + 1;
          const newRating = Number((((d.rating * d.totalReviews) + rating) / newTotalReviews).toFixed(1));
          return {
            ...d,
            rating: newRating,
            totalReviews: newTotalReviews,
          };
        })
      );
    },
    [bookings, updateBookings, updateDrivers]
  );

  // 11. In-app Chat messaging
  const sendChatMessage = useCallback(
    (text: string, bookingId?: string, rideId?: string) => {
      const senderRole = role === 'driver' ? 'driver' : role === 'agency' ? 'agency' : 'rider';
      const senderId = currentUser?.id || (role === 'driver' ? currentDriver.id : role === 'agency' ? currentAgency.id : currentRider.id);
      const senderName =
        currentUser?.agencyName ||
        currentUser?.name ||
        (role === 'driver' ? currentDriver.name : role === 'agency' ? currentAgency.agencyName : currentRider.name);

      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        bookingId,
        rideId,
        senderId,
        senderRole,
        senderName,
        text,
        timestamp: 'Just now',
      };
      updateChats((prev) => [...prev, newMsg]);
      return newMsg;
    },
    [role, currentUser, currentDriver, currentAgency, currentRider, updateChats]
  );

  // 12. Update Rider Profile
  const updateRiderProfile = useCallback(
    (updates: Partial<Rider>) => {
      setCurrentRiderState((prev) => {
        const next = { ...prev, ...updates };
        saveToStorage(STORAGE_KEYS.CURRENT_RIDER, next);
        return next;
      });
    },
    []
  );

  // 13. Admin CRUD on Packages
  const savePackage = useCallback(
    (pkg: Package) => {
      updatePackages((prev) => {
        const exists = prev.some((p) => p.id === pkg.id);
        if (exists) {
          return prev.map((p) => (p.id === pkg.id ? pkg : p));
        }
        return [...prev, pkg];
      });
    },
    [updatePackages]
  );

  const deletePackage = useCallback(
    (pkgId: string) => {
      updatePackages((prev) => prev.filter((p) => p.id !== pkgId));
    },
    [updatePackages]
  );

  // 14. Resolve Dispute
  const resolveDispute = useCallback(
    (disputeId: string) => {
      updateDisputes((prev) =>
        prev.map((d) => (d.id === disputeId ? { ...d, status: 'resolved' } : d))
      );
    },
    [updateDisputes]
  );

  // 15. Reset Entire Demo Data
  const resetDemoData = useCallback(() => {
    wipeRideBhaiStorage();
    try {
      localStorage.setItem(VERSION_KEY, DEMO_VERSION);
    } catch {
      /* ignore */
    }
    setRoleState('rider');
    setHasOnboardedState(true);
    setAppViewState('landing');
    setIsRiderLoggedInState(false);
    setIsDriverLoggedInState(false);
    setIsAgencyLoggedInState(false);
    setIsPartnerLoggedInState(false);
    writeSharedAuth({ isLoggedIn: false, currentUserId: null, users: [] });
    setDriversState(INITIAL_DRIVERS);
    setRidesState(INITIAL_RIDES);
    setPackagesState(INITIAL_PACKAGES);
    setDriverPackagesState(INITIAL_DRIVER_PACKAGES);
    setCurrentRiderState(CURRENT_RIDER);
    setBookingsState(INITIAL_BOOKINGS);
    setChatsState(INITIAL_CHATS);
    setDisputesState(INITIAL_DISPUTES);
    setNotificationsState(INITIAL_NOTIFICATIONS);
    setAgenciesState(INITIAL_AGENCIES);
    setAgencyPackagesState(INITIAL_AGENCY_PACKAGES);
    setAgencySubscriptionsState(INITIAL_AGENCY_SUBSCRIPTIONS);
    writeSharedListings({ cars: [], tours: [], loading: false, error: '' });
    writeSharedDeals({ deals: [], threads: [] });
    setInquiriesState(INITIAL_INQUIRIES);
    notifyListeners();
    window.location.reload();
  }, []);

  // 16. Admin Grant Boost to specific driver
  const grantDriverBoost = useCallback(
    (driverId: string, packageId: string = 'pkg-weekly-boost') => {
      const pkg = packages.find((p) => p.id === packageId) || packages[0];
      const now = Date.now();
      const expiresAt = now + (pkg?.durationDays || 7) * 24 * 60 * 60 * 1000;

      updateDriverPackages((prev) => {
        const filtered = prev.filter((dp) => dp.driverId !== driverId);
        return [
          {
            id: `dp-${Date.now()}`,
            driverId,
            packageId: pkg?.id || 'pkg-weekly-boost',
            purchasedAt: now,
            expiresAt,
          },
          ...filtered,
        ];
      });
    },
    [packages, updateDriverPackages]
  );

  return {
    // App View & Auth State
    appView,
    setAppView,
    isRiderLoggedIn,
    isDriverLoggedIn,
    isAgencyLoggedIn,
    isPartnerLoggedIn,
    loginRider,
    logoutRider,
    loginDriver,
    logoutDriver,
    loginAgency,
    logoutAgency,
    loginPartner,
    logoutPartner,
    isLoggedIn,
    currentUser,
    users,
    accountId,
    loginUser,
    logoutUser,
    hydrateMe,
    refreshListings,
    refreshDeals,
    openDeal,
    sendThreadMessage,
    confirmDeal,
    rateDeal,
    deals,
    chatThreads,
    listingsLoading,
    listingsError,
    applyServerUser,
    submitUserProfile,
    adminVerifyUser,
    canBook,
    canPostCar,
    canPostTour,
    saveDriverProfile,
    saveBankDetails,

    // Role & Entity State
    role,
    setRole,
    hasOnboarded,
    setHasOnboarded,
    drivers,
    rides,
    packages,
    driverPackages,
    currentRider,
    currentDriver,
    bookings,
    chats,
    disputes,
    notifications,

    // Agency State
    agencies,
    agencyPackages,
    agencySubscriptions,
    agencyTripPosts,
    currentAgency,
    carListings,
    inquiries,
    partnerCars,

    // Live Derived / Selectors
    isDriverBoosted,
    getDriverActivePackage,
    getRankedRides,
    getAgencyActiveSubscription,
    isAgencyVerified,
    canAgencyPost,
    getFilteredCarListings,
    getFilteredTours,

    // Actions
    postRide,
    bookSeats,
    purchasePackage,
    grantDriverBoost,
    simulatePackageExpiry,
    simulateDriverStatusChange,
    submitDriverVerification,
    addDriverVehicle,
    removeDriverVehicle,
    handleBookingRequest,
    simulateTripStart,
    simulateTripComplete,
    submitReview,
    sendChatMessage,
    updateRiderProfile,
    savePackage,
    deletePackage,
    resolveDispute,
    resetDemoData,
    updateNotifications,
    updateDriverPackages,

    // Agency Actions
    submitAgencyVerification,
    adminVerifyAgency,
    purchaseAgencyPackage,
    postAgencyTrip,
    claimAgencyTrip,
    updateAgencyTripStatus,
    deleteAgencyTrip,
    updateCarListingStatus,
    saveAgencyPackage,
    deleteAgencyPackage,
    updateCurrentAgency,
    updateAgencies,
    updateAgencyTripPosts,
    addPartnerCar,
    updatePartnerCar,
    postCarListing,
    logInquiry,
    updateCarListings,
  };
}
