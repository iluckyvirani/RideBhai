export type CarBodyType = 'hatchback' | 'sedan' | 'suv' | 'muv';

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
  return undefined;
}
