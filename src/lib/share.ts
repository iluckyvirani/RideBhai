export async function shareListing(options: {
  title: string;
  text: string;
  url?: string;
}) {
  const shareUrl = options.url || (typeof window !== 'undefined' ? window.location.href : '');
  const fullText = `${options.text}\n\n👉 View on Ride Bhai: ${shareUrl}`;

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

  return shareListing({
    title: `Tour Booking: ${route}`,
    text: lines.join('\n'),
  });
}

export function shareCarListing(car: {
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

  return shareListing({
    title: `Car Available: ${car.carName} - ${car.currentCity}`,
    text: lines.join('\n'),
  });
}
