export interface SharedLinkTarget {
  type: 'tour' | 'car' | null;
  id: string | null;
}

/**
 * Extracts tour or car target from the current URL hash or query params.
 * Supports: #tour=123, #tour-123, ?tour=123, #car=123, #car-123, ?car=123
 */
export function parseSharedLink(): SharedLinkTarget {
  if (typeof window === 'undefined') return { type: null, id: null };

  // 1. Check query parameters: ?tour=... or ?car=...
  try {
    const params = new URLSearchParams(window.location.search);
    const tourParam = params.get('tour');
    if (tourParam) return { type: 'tour', id: tourParam.trim() };
    const carParam = params.get('car');
    if (carParam) return { type: 'car', id: carParam.trim() };
  } catch {
    /* ignore search params parse error */
  }

  // 2. Check hash: #tour=... or #tour-... or #car=... or #car-...
  const rawHash = (window.location.hash || '').replace(/^#/, '').trim();
  if (!rawHash) return { type: null, id: null };

  if (rawHash.startsWith('tour=')) {
    return { type: 'tour', id: decodeURIComponent(rawHash.slice(5)).trim() };
  }
  if (rawHash.startsWith('tour-')) {
    return { type: 'tour', id: decodeURIComponent(rawHash.slice(5)).trim() };
  }
  if (rawHash.startsWith('car=')) {
    return { type: 'car', id: decodeURIComponent(rawHash.slice(4)).trim() };
  }
  if (rawHash.startsWith('car-')) {
    return { type: 'car', id: decodeURIComponent(rawHash.slice(4)).trim() };
  }

  return { type: null, id: null };
}

export function getTourShareUrl(tourId: string): string {
  if (typeof window === 'undefined') return '';
  const base = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  return `${base}#tour=${encodeURIComponent(tourId)}`;
}

export function getCarShareUrl(carId: string): string {
  if (typeof window === 'undefined') return '';
  const base = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  return `${base}#car=${encodeURIComponent(carId)}`;
}

export async function shareListing(options: {
  title: string;
  text: string;
  url?: string;
}) {
  const shareUrl = options.url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullText = `${options.text}\n\n👉 View details on Ride Bhai:\n${shareUrl}`;

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title: options.title,
        text: fullText,
        url: shareUrl,
      });
      return true;
    } catch (err: any) {
      if (err?.name === 'AbortError') return false;
    }
  }

  // Fallback to WhatsApp
  if (typeof window !== 'undefined') {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(waUrl, '_blank');
  }
  return true;
}

export function shareTourListing(tour: {
  id?: string;
  fromCity: string;
  toCity: string;
  tripSide?: string;
  totalCustomerPrice?: number;
  passengers?: number;
  duration?: string;
  bookingDate?: string;
  startDate?: string;
  desiredCar?: { name?: string };
  requiredVehicleType?: string;
  agencyName?: string;
}) {
  const route = `${tour.fromCity} ${tour.tripSide === 'two_side' ? '⇄' : '→'} ${tour.toCity}`;
  const price = tour.totalCustomerPrice && tour.totalCustomerPrice > 0 
    ? `₹${tour.totalCustomerPrice.toLocaleString('en-IN')}` 
    : 'Best Quotation Invited 💬';
  const vehicle = tour.desiredCar?.name || tour.requiredVehicleType || 'Taxi / Car';
  const date = (tour.bookingDate || tour.startDate || '').split('-').reverse().join('/');

  const lines = [
    `🚗 *Tour Booking on Ride Bhai*`,
    `📍 *Route:* ${route}`,
    `💰 *Price / Fare:* ${price}`,
    `🚘 *Vehicle:* ${vehicle}`,
    tour.passengers ? `👥 *Passengers:* ${tour.passengers} Pax` : '',
    tour.duration ? `⏱️ *Duration:* ${tour.duration}` : '',
    date ? `📅 *Booking Date:* ${date}` : '',
    tour.agencyName ? `🏢 *Agency:* ${tour.agencyName}` : '',
  ].filter(Boolean);

  const url = tour.id ? getTourShareUrl(tour.id) : undefined;

  return shareListing({
    title: `Tour Booking: ${route}`,
    text: lines.join('\n'),
    url,
  });
}

export function shareCarListing(car: {
  id?: string;
  carName: string;
  currentCity: string;
  toCity?: string;
  availability: 'citywide' | 'route' | string;
  fullCarPrice: number;
  seats: number;
  bookingDate?: string;
  partnerName?: string;
}) {
  const location = car.availability === 'route' && car.toCity
    ? `${car.currentCity} → ${car.toCity}`
    : `${car.currentCity} (Citywide & Outstation)`;
  const date = car.bookingDate ? car.bookingDate.split('-').reverse().join('/') : '';

  const lines = [
    `🚕 *Available Car on Ride Bhai*`,
    `🚘 *Car:* ${car.carName} (${car.seats} Seater)`,
    `📍 *Location / Route:* ${location}`,
    `💰 *Full Car Price:* ₹${car.fullCarPrice.toLocaleString('en-IN')}`,
    date ? `📅 *Booking Date:* ${date}` : '',
    car.partnerName ? `👤 *Partner:* ${car.partnerName}` : '',
  ].filter(Boolean);

  const url = car.id ? getCarShareUrl(car.id) : undefined;

  return shareListing({
    title: `Car Available: ${car.carName} - ${car.currentCity}`,
    text: lines.join('\n'),
    url,
  });
}
