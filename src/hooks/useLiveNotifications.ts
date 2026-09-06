import { useEffect, useState } from 'react';
import {
  markAllNotificationsRead,
  markNotificationRead,
  refreshNotifications,
  subscribeNotifications,
  type LiveNotification,
} from '../lib/notifications';
import { getToken } from '../lib/api';

export function useLiveNotifications() {
  const [items, setItems] = useState<LiveNotification[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const unsub = subscribeNotifications((cache) => {
      setItems(cache.items);
      setUnread(cache.unread);
    });
    if (getToken()) refreshNotifications();
    const tick = window.setInterval(() => {
      if (getToken()) refreshNotifications();
    }, 30000);
    return () => {
      unsub();
      window.clearInterval(tick);
    };
  }, []);

  return {
    items,
    unread,
    refresh: refreshNotifications,
    markAllRead: markAllNotificationsRead,
    markRead: markNotificationRead,
  };
}
