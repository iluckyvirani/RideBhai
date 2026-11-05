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

let cache: SiteSettings | null = null;
let inflight: Promise<SiteSettings | null> | null = null;
const listeners = new Set<(settings: SiteSettings | null) => void>();

async function fetchSettings(): Promise<SiteSettings | null> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = api<{ settings: SiteSettings }>('/site')
    .then((data) => {
      cache = data?.settings || null;
      listeners.forEach((fn) => fn(cache));
      return cache;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/**
 * Site-wide support settings, fully admin-controlled (edited in the admin panel's
 * Website → Support contact tab) and cached across the app session.
 * Returns null until the real values have loaded — callers should not show any
 * contact detail (phone, WhatsApp, etc.) until this resolves, rather than fall
 * back to a hardcoded number that can drift out of sync with what admin set.
 */
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cache);

  useEffect(() => {
    listeners.add(setSettings);
    fetchSettings().then(setSettings);
    return () => {
      listeners.delete(setSettings);
    };
  }, []);

  return settings;
}
