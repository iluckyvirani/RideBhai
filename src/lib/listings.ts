import { AgencyTripPost, CarListing, HotelListing } from '../types';
import { formatCarId, formatTourId } from './displayId';

function dateOnly(value: unknown): string | undefined {
  if (!value) return undefined;
  return String(value).slice(0, 10);
}

function whatsappFromPhone(phone?: string | null): string {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.startsWith('91') ? digits : `91${digits}`;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).map((s) => s.trim()).filter(Boolean);
    } catch {
      return value.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export function mapCarListing(row: any): CarListing {
  return {
    id: row.id,
    displayId: row.display_id || formatCarId(row.id),
    partnerId: row.partner_id,
    partnerName: row.agency_name || row.partner_name || 'Partner',
    partnerPersonName: row.partner_name || undefined,
    partnerPhone: row.partner_phone || '',
    partnerWhatsapp: whatsappFromPhone(row.partner_phone),
    partnerCity: row.current_city || '',
    partnerSelfie: row.partner_selfie || undefined,
    partnerRating: Number(row.partner_rating || 0) || 0,
    partnerRatingCount: Number(row.partner_rating_count || 0) || 0,
    carId: row.vehicle_id || '',
    carName: row.car_name,
    make: row.vehicle_make || undefined,
    model: row.vehicle_model || undefined,
    year: row.vehicle_year || undefined,
    color: row.vehicle_color || undefined,
    plate: row.vehicle_plate || row.plate || undefined,
    seats: Number(row.vehicle_seats || row.seats || 5),
    fuelType: row.vehicle_fuel_type || row.fuel_type || undefined,
    fullCarPrice: Number(row.full_car_price || 0),
    availability: row.availability === 'route' ? 'route' : 'citywide',
    currentCity: row.current_city,
    toCity: row.to_city || undefined,
    postedDate: dateOnly(row.posted_date),
    postedTime: row.posted_time || undefined,
    bookingDate: dateOnly(row.booking_date),
    bookingTime: row.booking_time || undefined,
    availableTillDate: dateOnly(row.available_till_date),
    availableTillTime: row.available_till_time || undefined,
    notes: row.notes || undefined,
    driverId: row.driver_id || undefined,
    driverName: row.driver_name || undefined,
    driverExperienceYears:
      row.driver_experience_years === 0 || row.driver_experience_years
        ? Number(row.driver_experience_years)
        : undefined,
    driverExperienceNote: row.driver_experience_note || undefined,
    status: row.status === 'inactive' ? 'inactive' : 'available',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mapTourListing(row: any): AgencyTripPost {
  const specs = asStringArray(row.desired_car_specs);
  const bookingDate = dateOnly(row.booking_date) || '';
  const bookingTime = row.booking_time || '';
  return {
    id: row.id,
    displayId: row.display_id || formatTourId(row.id),
    agencyId: row.partner_id,
    agencyName: row.agency_name || row.poster_agency || 'Agency',
    agencyPhone: row.partner_phone || '',
    whatsappNumber: whatsappFromPhone(row.partner_phone),
    agencyCity: row.from_city || '',
    posterName: row.poster_name || undefined,
    posterSelfie: row.poster_selfie || undefined,
    agencyRating: Number(row.agency_rating || 0) || 0,
    agencyRatingCount: Number(row.agency_rating_count || 0) || 0,
    fromCity: row.from_city,
    toCity: row.to_city,
    tripSide: row.trip_side === 'two_side' ? 'two_side' : 'one_side',
    postedDate: dateOnly(row.posted_date),
    postedTime: row.posted_time || undefined,
    bookingDate,
    bookingTime,
    passengers: Number(row.passengers || 1),
    duration: row.duration || '',
    startDate: bookingDate,
    pickupTime: bookingTime,
    pickupLocation: row.pickup_location || '',
    dropLocation: row.drop_location || '',
    requiredVehicleType: row.required_vehicle_type || '',
    desiredCar: row.desired_car_name ? { name: row.desired_car_name, specs } : undefined,
    totalCustomerPrice: Number(row.total_customer_price || 0),
    agencyCommission: Number(row.agency_commission || 0),
    driverNetPayout: Number(row.driver_net_payout || 0),
    tripDetails: row.trip_details || '',
    status: row.status === 'cancelled' ? 'cancelled' : row.status === 'closed' ? 'closed' : 'active',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function asPlaceArray(value: unknown): { name: string; distance: string }[] {
  let rows: unknown = value;
  if (typeof rows === 'string' && rows.trim()) {
    try {
      rows = JSON.parse(rows);
    } catch {
      rows = [];
    }
  }
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row: any) => ({ name: String(row?.name || '').trim(), distance: String(row?.distance || '').trim() }))
    .filter((row) => row.name && row.distance);
}

export function mapHotelListing(row: any): HotelListing {
  return {
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    phone: row.phone || '',
    whatsappNumber: whatsappFromPhone(row.phone),
    address: row.address || undefined,
    city: row.city,
    state: row.state,
    priceLow: Number(row.price_low || 0),
    priceHigh: Number(row.price_high || 0),
    rating: Number(row.rating || 0) || 0,
    ratingCount: Number(row.rating_count || 0) || 0,
    starCategory: row.star_category ? Number(row.star_category) : undefined,
    nearbyPlaces: asPlaceArray(row.nearby_places),
    images: asStringArray(row.image_urls),
    videoUrl: row.video_url || undefined,
    status: row.status === 'inactive' ? 'inactive' : 'active',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function mergeById<T extends { id: string; createdAt?: string }>(publicRows: T[], mine: T[]): T[] {
  const map = new Map<string, T>();
  for (const row of publicRows) map.set(row.id, row);
  for (const row of mine) map.set(row.id, row);
  return Array.from(map.values()).sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
}
