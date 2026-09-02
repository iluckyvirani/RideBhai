import React, { useState } from 'react';
import { X, Car } from 'lucide-react';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';

interface PostCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPosted?: () => void;
  onOpenPackages?: () => void;
}

export const PostCarModal: React.FC<PostCarModalProps> = ({ isOpen, onClose, onPosted, onOpenPackages }) => {
  const { partnerCars, postCarListing, currentAgency, canAgencyPost } = useAppStore();
  const gate = canAgencyPost(currentAgency.id);
  const [carId, setCarId] = useState(partnerCars[0]?.id || partnerCars[0]?.plate || '');
  const [price, setPrice] = useState(5000);
  const [availability, setAvailability] = useState<'citywide' | 'route'>('citywide');
  const [currentCity, setCurrentCity] = useState(partnerCars[0]?.currentCity || 'Jaipur');
  const [toCity, setToCity] = useState('Delhi NCR');
  const [notes, setNotes] = useState('Full car hire. Direct call or WhatsApp to book.');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gate.canPost) {
      setError(gate.reason || 'Buy a posting package first.');
      return;
    }
    if (!carId) {
      setError('Add a car in Profile → My Cars first.');
      return;
    }
    try {
      postCarListing({
        carId,
        fullCarPrice: Number(price),
        availability,
        currentCity,
        toCity: availability === 'route' ? toCity : undefined,
        notes,
      });
      onPosted?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Could not post car.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 bg-[#1C1C1C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#F15A24]" />
            <h2 className="text-sm font-extrabold">Post full car</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto">
          <p className="text-[11px] text-[#6B6B6B]">
            Customers book by Call or WhatsApp. You pay in the app only for a posting package.
          </p>
          {!gate.canPost && (
            <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 space-y-2">
              <p className="text-[11px] font-bold text-[#8A2B09]">{gate.reason}</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPackages?.();
                }}
                className="w-full py-2.5 rounded-xl brand-gradient text-white text-xs font-extrabold"
              >
                Pay for posting package
              </button>
            </div>
          )}
          {gate.canPost && (
          <>
          {partnerCars.length === 0 ? (
            <p className="text-xs font-bold text-amber-700 bg-amber-50 p-3 rounded-2xl">
              Add a car under Profile → My Cars before posting.
            </p>
          ) : (
            <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              Car from My Cars
              <select
                value={carId}
                onChange={(e) => setCarId(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              >
                {partnerCars.map((c) => (
                  <option key={c.id || c.plate} value={c.id || c.plate}>
                    {c.make} {c.model} · {c.plate}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
            Full car price (₹)
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAvailability('citywide')}
              className={`flex-1 py-2 rounded-xl text-[11px] font-extrabold ${
                availability === 'citywide' ? 'bg-[#F15A24] text-white' : 'bg-[#FAF6EE]'
              }`}
            >
              Currently in city
            </button>
            <button
              type="button"
              onClick={() => setAvailability('route')}
              className={`flex-1 py-2 rounded-xl text-[11px] font-extrabold ${
                availability === 'route' ? 'bg-[#F15A24] text-white' : 'bg-[#FAF6EE]'
              }`}
            >
              X → Y route
            </button>
          </div>

          <input
            value={currentCity}
            onChange={(e) => setCurrentCity(e.target.value)}
            list="rb-post-car-cities"
            placeholder={availability === 'citywide' ? 'Current city' : 'From city'}
            className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
          />
          {availability === 'route' && (
            <input
              value={toCity}
              onChange={(e) => setToCity(e.target.value)}
              list="rb-post-car-cities"
              placeholder="To city"
              className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
            />
          )}
          <datalist id="rb-post-car-cities">
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
          />

          {error && <p className="text-[11px] font-bold text-red-600">{error}</p>}

          <button type="submit" className="w-full py-3 rounded-2xl brand-gradient text-white text-xs font-extrabold">
            Publish car listing
          </button>
          </>
          )}
        </form>
      </div>
    </div>
  );
};
