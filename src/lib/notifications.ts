import { api, getToken } from './api';

export type LiveNotification = {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'boost' | 'verification' | 'system' | 'agency';
  read: boolean;
  created_at: string;
};

type Cache = {
  items: LiveNotification[];
  unread: number;
};

const listeners = new Set<(cache: Cache) => void>();
let cache: Cache = { items: [], unread: 0 };
let inflight: Promise<Cache> | null = null;

function emit() {
  listeners.forEach((fn) => fn(cache));
}

export function relativeTime(iso?: string) {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return 'Just now';
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function subscribeNotifications(fn: (cache: Cache) => void) {
  listeners.add(fn);
  fn(cache);
  return () => {
    listeners.delete(fn);
  };
}

export async function refreshNotifications(): Promise<Cache> {
  if (!getToken()) {
    cache = { items: [], unread: 0 };
    emit();
    return cache;
  }
  if (inflight) return inflight;
  inflight = api<{ items: LiveNotification[]; unread: number }>('/notifications')
    .then((data) => {
      cache = { items: data.items || [], unread: data.unread || 0 };
      emit();
      return cache;
    })
    .catch(() => cache)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export async function markAllNotificationsRead() {
  if (!getToken()) return;
  await api('/notifications/read-all', { method: 'POST' });
  cache = {
    items: cache.items.map((row) => ({ ...row, read: true })),
    unread: 0,
  };
  emit();
}

export async function markNotificationRead(id: string) {
  if (!getToken()) return;
  await api(`/notifications/${id}/read`, { method: 'POST' });
  cache = {
    items: cache.items.map((row) => (row.id === id ? { ...row, read: true } : row)),
    unread: cache.items.filter((row) => row.id !== id && !row.read).length,
  };
  emit();
}
