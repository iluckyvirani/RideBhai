import { useEffect, useRef, useState } from 'react';
import { api } from '../lib/api';

export type TourAlert = {
  id: string;
  fromCity: string;
  toCity: string;
  postedBy?: string;
  createdAt: string;
};

const POLL_MS = 15000;
const SEEN_KEY = 'rb_seen_tour_ids';

function loadSeen(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SEEN_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {
    // ignore storage failures (private mode, quota, etc.)
  }
  return new Set();
}

function saveSeen(ids: Set<string>) {
  try {
    sessionStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(ids).slice(-500)));
  } catch {
    // ignore storage failures
  }
}

/** Polls public tour listings and surfaces ones posted after this hook first loaded. */
export function useNewTourAlerts(enabled: boolean) {
  const [queue, setQueue] = useState<TourAlert[]>([]);
  const seenRef = useRef<Set<string>>(loadSeen());
  const primedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;

    const poll = async () => {
      try {
        const rows = await api<any[]>('/listings/tours');
        if (stopped) return;
        const seen = seenRef.current;
        const fresh: TourAlert[] = [];
        for (const row of rows || []) {
          if (seen.has(row.id)) continue;
          seen.add(row.id);
          if (primedRef.current) {
            fresh.push({
              id: row.id,
              fromCity: row.from_city,
              toCity: row.to_city,
              postedBy: row.poster_agency || row.poster_name,
              createdAt: row.created_at,
            });
          }
        }
        saveSeen(seen);
        if (!primedRef.current) {
          primedRef.current = true;
        } else if (fresh.length) {
          setQueue((q) => [...q, ...fresh]);
        }
      } catch {
        // ignore network hiccups, next poll will retry
      }
    };

    poll();
    const id = window.setInterval(poll, POLL_MS);
    return () => {
      stopped = true;
      window.clearInterval(id);
    };
  }, [enabled]);

  const dismiss = () => setQueue((q) => q.slice(1));

  return { current: queue[0] || null, dismiss };
}
