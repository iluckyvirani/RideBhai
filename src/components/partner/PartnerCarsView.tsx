import React, { useState } from 'react';
import { Car, Plus, MapPin, Navigation } from 'lucide-react';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';
import { Vehicle } from '../../types';

export const PartnerCarsView: React.FC = () => {
  const { partnerCars, addPartnerCar } = useAppStore();
  const [open, setOpen] = useState(false);
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Innova Crysta');
  const [year, setYear] = useState(2023);
  const [color, setColor] = useState('Pearl White');
  const [plate, setPlate] = useState('');
  const [seats, setSeats] = useState(7);
  const [currentCity, setCurrentCity] = useState('Jaipur');
  const [availability, setAvailability] = useState<'citywide' | 'route'>('citywide');
  const [toCity, setToCity] = useState('Delhi NCR');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plate.trim()) return;
    const car: Vehicle = {
      id: `car-${Date.now()}`,
      make,
      model,
      year: Number(year),
      color,
      plate,
      seats: Number(seats),
      currentCity,
      availability,
      toCity: availability === 'route' ? toCity : undefined,
      isPrimary: partnerCars.length === 0,
    };
    addPartnerCar(car);
    setOpen(false);
    setPlate('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C]">My cars</h3>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 text-[11px] font-extrabold text-[#F15A24]"
        >
          <Plus className="w-3.5 h-3.5" /> Add car
        </button>
      </div>

      {open && (
        <form onSubmit={handleAdd} className="p-4 rounded-3xl bg-[#FAF6EE] border border-[#EBE5D8] space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Make"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model / car name"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              type="number"
              placeholder="Year"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Color"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              placeholder="Number plate"
              required
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              type="number"
              placeholder="Seats"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAvailability('citywide')}
              className={`flex-1 py-2 rounded-xl text-[11px] font-extrabold ${
                availability === 'citywide' ? 'bg-[#F15A24] text-white' : 'bg-white border border-[#EBE5D8]'
              }`}
            >
              Currently in city
            </button>
            <button
              type="button"
              onClick={() => setAvailability('route')}
              className={`flex-1 py-2 rounded-xl text-[11px] font-extrabold ${
                availability === 'route' ? 'bg-[#F15A24] text-white' : 'bg-white border border-[#EBE5D8]'
              }`}
            >
              X city to Y city
            </button>
          </div>
          <input
            value={currentCity}
            onChange={(e) => setCurrentCity(e.target.value)}
            list="rb-car-cities"
            placeholder={availability === 'citywide' ? 'Current city' : 'From city'}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
          />
          {availability === 'route' && (
            <input
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              list="rb-car-cities"
              placeholder="To city"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
          )}
          <datalist id="rb-car-cities">
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>
          <button type="submit" className="w-full py-2.5 rounded-2xl brand-gradient text-white text-xs font-extrabold">
            Save car
          </button>
        </form>
      )}

      {partnerCars.length === 0 && (
        <p className="text-[11px] text-[#6B6B6B]">Add your first car to post it for full-car hire.</p>
      )}

      {partnerCars.map((car) => (
        <div key={car.id || car.plate} className="p-3 rounded-2xl bg-white border border-[#EBE5D8]">
          <p className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-[#F15A24]" />
            {car.make} {car.model}
          </p>
          <p className="text-[11px] text-[#6B6B6B] mt-0.5">
            {car.plate} · {car.color} · {car.seats} seats
          </p>
          <p className="text-[11px] font-bold text-[#1C1C1C] mt-1 flex items-center gap-1">
            {car.availability === 'route' ? (
              <>
                <MapPin className="w-3 h-3 text-[#F15A24]" />
                {car.currentCity} → {car.toCity}
              </>
            ) : (
              <>
                <Navigation className="w-3 h-3 text-[#F15A24]" />
                Currently in {car.currentCity} · all India
              </>
            )}
          </p>
        </div>
      ))}
    </div>
  );
};
