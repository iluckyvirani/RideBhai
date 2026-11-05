import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export type SiteSettings = {
  supportPhone: string;
  supportEmail: string;
  emergencyPhone: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  supportHours?: string;
};

const FALLBACK: SiteSettings = {
  supportPhone: '+91 70550 54387',
  supportEmail: 'support@ridebhai.com',
  emergencyPhone: '112',
  whatsappNumber: '+91 70550 54387',
  whatsappMessage: 'Hi Ride Bhai! I need help with booking a car or tour.',
  supportHours: '24/7 Helpline · All India',
};

let cache: SiteSettings | null = null;
let inflight: Promise<SiteSettings> | null = null;
const listeners = new Set<(settings: SiteSettings) => void>();

async function fetchSettings(): Promise<SiteSettings> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = api<{ settings: SiteSettings }>('/site')
    .then((data) => {
      cache = { ...FALLBACK, ...(data?.settings || {}) };
      listeners.forEach((fn) => fn(cache!));
      return cache;
    })
    .catch(() => FALLBACK)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Site-wide support settings (admin-editable), cached across the app session. */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cache || FALLBACK);

  useEffect(() => {
    listeners.add(setSettings);
    fetchSettings().then(setSettings);
    return () => {
      listeners.delete(setSettings);
    };
  }, []);

  return settings;
}
