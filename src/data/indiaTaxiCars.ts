export type CarBodyType = 'hatchback' | 'sedan' | 'suv' | 'muv' | 'traveler' | 'bus' | 'commercial';

export type TaxiCar = {
  id?: string;
  make: string;
  model: string;
  body: CarBodyType;
  seats: number;
};

export const CAR_BODY_TYPES: { id: CarBodyType; label: string }[] = [
  { id: 'hatchback', label: 'Hatchback' },
  { id: 'sedan', label: 'Sedan' },
  { id: 'suv', label: 'SUV' },
  { id: 'muv', label: 'MUV / Innova class' },
  { id: 'traveler', label: 'Traveller' },
  { id: 'bus', label: 'Bus' },
  { id: 'commercial', label: 'Commercial' },
];

/** Fallback if the API is offline. Admin catalog is the live source. */
export const INDIA_TAXI_CARS: TaxiCar[] = [
  { make: 'Maruti Suzuki', model: 'Alto', body: 'hatchback', seats: 4 },
  { make: 'Maruti Suzuki', model: 'Wagon R', body: 'hatchback', seats: 5 },
  { make: 'Maruti Suzuki', model: 'Celerio', body: 'hatchback', seats: 5 },
  { make: 'Maruti Suzuki', model: 'Swift', body: 'hatchback', seats: 5 },
  { make: 'Maruti Suzuki', model: 'Baleno', body: 'hatchback', seats: 5 },
  { make: 'Hyundai', model: 'Grand i10', body: 'hatchback', seats: 5 },
  { make: 'Hyundai', model: 'i20', body: 'hatchback', seats: 5 },
  { make: 'Tata', model: 'Tiago', body: 'hatchback', seats: 5 },
  { make: 'Renault', model: 'Kwid', body: 'hatchback', seats: 5 },

  { make: 'Maruti Suzuki', model: 'Dzire', body: 'sedan', seats: 5 },
  { make: 'Maruti Suzuki', model: 'Ciaz', body: 'sedan', seats: 5 },
  { make: 'Hyundai', model: 'Aura', body: 'sedan', seats: 5 },
  { make: 'Hyundai', model: 'Xcent', body: 'sedan', seats: 5 },
  { make: 'Hyundai', model: 'Verna', body: 'sedan', seats: 5 },
  { make: 'Honda', model: 'Amaze', body: 'sedan', seats: 5 },
  { make: 'Honda', model: 'City', body: 'sedan', seats: 5 },
  { make: 'Toyota', model: 'Etios', body: 'sedan', seats: 5 },
  { make: 'Volkswagen', model: 'Vento', body: 'sedan', seats: 5 },
  { make: 'Skoda', model: 'Rapid', body: 'sedan', seats: 5 },

  { make: 'Maruti Suzuki', model: 'Brezza', body: 'suv', seats: 5 },
  { make: 'Maruti Suzuki', model: 'Grand Vitara', body: 'suv', seats: 5 },
  { make: 'Hyundai', model: 'Venue', body: 'suv', seats: 5 },
  { make: 'Hyundai', model: 'Creta', body: 'suv', seats: 5 },
  { make: 'Hyundai', model: 'Alcazar', body: 'suv', seats: 6 },
  { make: 'Kia', model: 'Sonet', body: 'suv', seats: 5 },
  { make: 'Kia', model: 'Seltos', body: 'suv', seats: 5 },
  { make: 'Tata', model: 'Punch', body: 'suv', seats: 5 },
  { make: 'Tata', model: 'Nexon', body: 'suv', seats: 5 },
  { make: 'Tata', model: 'Harrier', body: 'suv', seats: 5 },
  { make: 'Tata', model: 'Safari', body: 'suv', seats: 6 },
  { make: 'Mahindra', model: 'XUV 3XO', body: 'suv', seats: 5 },
  { make: 'Mahindra', model: 'Scorpio', body: 'suv', seats: 7 },
  { make: 'Mahindra', model: 'Scorpio-N', body: 'suv', seats: 7 },
  { make: 'Mahindra', model: 'XUV700', body: 'suv', seats: 7 },
  { make: 'Mahindra', model: 'Bolero', body: 'suv', seats: 7 },
  { make: 'Toyota', model: 'Urban Cruiser', body: 'suv', seats: 5 },
  { make: 'Toyota', model: 'Fortuner', body: 'suv', seats: 7 },
  { make: 'Honda', model: 'Elevate', body: 'suv', seats: 5 },
  { make: 'MG', model: 'Hector', body: 'suv', seats: 5 },

  { make: 'Toyota', model: 'Innova', body: 'muv', seats: 7 },
  { make: 'Toyota', model: 'Innova Crysta', body: 'muv', seats: 7 },
  { make: 'Toyota', model: 'Innova Hycross', body: 'muv', seats: 7 },
  { make: 'Maruti Suzuki', model: 'Ertiga', body: 'muv', seats: 7 },
  { make: 'Maruti Suzuki', model: 'XL6', body: 'muv', seats: 6 },
  { make: 'Maruti Suzuki', model: 'Eeco', body: 'muv', seats: 5 },
  { make: 'Kia', model: 'Carens', body: 'muv', seats: 7 },
  { make: 'Renault', model: 'Triber', body: 'muv', seats: 7 },
  { make: 'Mahindra', model: 'Marazzo', body: 'muv', seats: 7 },
  { make: 'Mahindra', model: 'Xylo', body: 'muv', seats: 7 },

  { make: 'Force Motors', model: 'Tempo Traveller 12 Seater', body: 'traveler', seats: 12 },
  { make: 'Force Motors', model: 'Tempo Traveller 17 Seater', body: 'traveler', seats: 17 },
  { make: 'Force Motors', model: 'Tempo Traveller 26 Seater', body: 'traveler', seats: 26 },
  { make: 'Force Motors', model: 'Urbania', body: 'traveler', seats: 14 },
  { make: 'Tata', model: 'Winger', body: 'traveler', seats: 13 },
  { make: 'Mahindra', model: 'Tourister', body: 'traveler', seats: 15 },

  { make: 'Tata', model: 'Starbus 24 Seater', body: 'bus', seats: 24 },
  { make: 'Tata', model: 'Starbus 32 Seater', body: 'bus', seats: 32 },
  { make: 'Tata', model: 'Ultra Bus 40 Seater', body: 'bus', seats: 40 },
  { make: 'Ashok Leyland', model: 'Viking Bus', body: 'bus', seats: 36 },
  { make: 'Ashok Leyland', model: 'Oyster Bus', body: 'bus', seats: 28 },
  { make: 'Eicher', model: 'Starline Bus', body: 'bus', seats: 30 },
  { make: 'Volvo', model: '9600 Luxury Coach', body: 'bus', seats: 45 },
  { make: 'BharatBenz', model: 'Tourist Coach', body: 'bus', seats: 36 },

  { make: 'Tata', model: 'Ace (Chhota Hathi)', body: 'commercial', seats: 2 },
  { make: 'Tata', model: 'Intra V30', body: 'commercial', seats: 2 },
  { make: 'Tata', model: '407 Pickup', body: 'commercial', seats: 3 },
  { make: 'Mahindra', model: 'Bolero Maxi Truck', body: 'commercial', seats: 2 },
  { make: 'Mahindra', model: 'Bolero Pik-Up', body: 'commercial', seats: 2 },
  { make: 'Mahindra', model: 'Jeeto', body: 'commercial', seats: 2 },
  { make: 'Ashok Leyland', model: 'Dost+', body: 'commercial', seats: 2 },
  { make: 'Ashok Leyland', model: 'Bada Dost', body: 'commercial', seats: 3 },
  { make: 'Maruti Suzuki', model: 'Super Carry', body: 'commercial', seats: 2 },
  { make: 'Force Motors', model: 'Trax Kargo King', body: 'commercial', seats: 2 },
];

let liveCars: TaxiCar[] = INDIA_TAXI_CARS;
const listeners = new Set<() => void>();

export function getTaxiCars() {
  return liveCars;
}

export function setTaxiCars(cars: TaxiCar[]) {
  liveCars = cars.length ? cars : INDIA_TAXI_CARS;
  listeners.forEach((fn) => fn());
}

export function subscribeTaxiCars(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function makesForBody(body?: CarBodyType | '', cars = getTaxiCars()) {
  const rows = body ? cars.filter((c) => c.body === body) : cars;
  return [...new Set(rows.map((c) => c.make))].sort();
}

export function modelsFor(make: string, body?: CarBodyType | '', cars = getTaxiCars()) {
  return cars.filter((c) => c.make === make && (!body || c.body === body));
}

export function findTaxiCar(make: string, model: string, cars = getTaxiCars()) {
  return cars.find((c) => c.make === make && c.model === model);
}

export function carDisplayName(make: string, model: string) {
  return `${make} ${model}`.trim();
}

export function listingCarBody(make?: string, model?: string, carName?: string): CarBodyType | undefined {
  const cars = getTaxiCars();
  if (make && model) {
    const exact = findTaxiCar(make, model, cars);
    if (exact) return exact.body;
  }
  const name = `${carName || ''} ${make || ''} ${model || ''}`.trim().toLowerCase();
  if (!name) return undefined;
  const byMakeModel = cars.find(
    (c) => name.includes(c.make.toLowerCase()) && name.includes(c.model.toLowerCase())
  );
  if (byMakeModel) return byMakeModel.body;
  return cars.find((c) => name.includes(c.model.toLowerCase()))?.body;
}

export function desiredCarBody(name?: string): CarBodyType | undefined {
  const fromCatalog = listingCarBody(undefined, undefined, name);
  if (fromCatalog) return fromCatalog;
  const lower = (name || '').toLowerCase();
  if (!lower) return undefined;
  if (lower.includes('hatch')) return 'hatchback';
  if (lower.includes('sedan')) return 'sedan';
  if (lower.includes('muv') || lower.includes('innova') || lower.includes('ertiga')) return 'muv';
  if (lower.includes('suv')) return 'suv';
  if (lower.includes('traveler') || lower.includes('traveller') || lower.includes('tempo') || lower.includes('winger') || lower.includes('urbania')) return 'traveler';
  if (lower.includes('bus') || lower.includes('volvo') || lower.includes('coach') || lower.includes('starbus')) return 'bus';
  if (lower.includes('commercial') || lower.includes('pickup') || lower.includes('truck') || lower.includes('chhota hathi') || lower.includes('dost') || lower.includes('407') || lower.includes('ace')) return 'commercial';
  return undefined;
}
