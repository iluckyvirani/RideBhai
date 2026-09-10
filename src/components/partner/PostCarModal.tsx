import React, { useEffect, useMemo, useState } from 'react';
import { X, Car } from 'lucide-react';
import { POPULAR_CITIES } from '../../data/cities';
import { useAppStore } from '../../store/useAppStore';

interface PostCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPosted?: () => void;
  onOpenPackages?: () => void;
  onOpenDriverSetup?: () => void;
}

export const PostCarModal: React.FC<PostCarModalProps> = ({
  isOpen,
  onClose,
  onPosted,
  onOpenPackages,
  onOpenDriverSetup,
}) => {
  const { partnerCars, currentUser, postCarListing, canAgencyPost, canPostCar } = useAppStore();
  const gate = canAgencyPost();
  const driverGate = canPostCar();

  const verifiedCars = useMemo(
    () => partnerCars.filter((c) => c.verificationStatus === 'verified'),
    [partnerCars]
  );
  const verifiedDrivers = useMemo(() => {
    const list = currentUser?.driverProfiles?.length
      ? currentUser.driverProfiles
      : currentUser?.driverProfile
        ? [currentUser.driverProfile]
        : [];
    return list.filter((d) => d.completed && d.verificationStatus === 'verified' && d.id);
  }, [currentUser]);

  const [carId, setCarId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState<'citywide' | 'route'>('citywide');
  const [currentCity, setCurrentCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [availableTillDate, setAvailableTillDate] = useState('');
  const [availableTillTime, setAvailableTillTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCarId('');
    setDriverId('');
    setPrice('');
    setAvailability('citywide');
    setCurrentCity('');
    setToCity('');
    setBookingDate('');
    setBookingTime('');
    setAvailableTillDate('');
    setAvailableTillTime('');
    setNotes('');
    setError('');
    setSubmitting(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverGate.ok) {
      setError(driverGate.reason || 'Add driver profile and vehicle first.');
      return;
    }
    if (!gate.canPost) {
      setError(gate.reason || 'Buy a posting package first.');
      return;
    }
    if (!carId) {
      setError('Choose a verified car.');
      return;
    }
    if (!driverId) {
      setError('Choose a verified driver.');
      return;
    }
    const amount = Number(price);
    if (!price || Number.isNaN(amount) || amount <= 0) {
      setError('Enter a full car price.');
      return;
    }
    if (!currentCity.trim()) {
      setError(availability === 'route' ? 'Enter the from city.' : 'Enter the current city.');
      return;
    }
    if (availability === 'route' && !toCity.trim()) {
      setError('Enter the to city for the X → Y route.');
      return;
    }
    if (!bookingDate || !bookingTime) {
      setError('Enter available from date and time.');
      return;
    }
    if (!availableTillDate || !availableTillTime) {
      setError('Enter available to date and time.');
      return;
    }
    const bookingAt = new Date(`${bookingDate}T${bookingTime}`);
    const tillAt = new Date(`${availableTillDate}T${availableTillTime}`);
    if (tillAt.getTime() < bookingAt.getTime()) {
      setError('Available to must be after available from.');
      return;
    }
    try {
      setSubmitting(true);
      await postCarListing({
        carId,
        driverId,
        fullCarPrice: amount,
        availability,
        currentCity: currentCity.trim(),
        toCity: availability === 'route' ? toCity.trim() : undefined,
        bookingDate,
        bookingTime,
        availableTillDate,
        availableTillTime,
        notes: notes.trim() || undefined,
      });
      onPosted?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Could not post car.');
    } finally {
      setSubmitting(false);
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
            Set when the car is available, from start date/time to end date/time.
          </p>
          {!driverGate.ok && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <p className="text-[11px] font-bold text-amber-900">{driverGate.reason}</p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenDriverSetup?.();
                }}
                className="w-full py-2.5 rounded-xl brand-gradient text-white text-xs font-extrabold"
              >
                {driverGate.code === 'no_vehicle' || driverGate.code === 'pending_vehicle'
                  ? 'Open My cars'
                  : 'Open My drivers'}
              </button>
            </div>
          )}
          {driverGate.ok && !gate.canPost && (
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
          {driverGate.ok && gate.canPost && (
          <>
          {verifiedCars.length === 0 ? (
            <p className="text-xs font-bold text-amber-700 bg-amber-50 p-3 rounded-2xl">
              No verified cars yet. Admin must verify a car in My cars before you can post.
            </p>
          ) : (
            <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              Car from My Cars
              <select
                value={carId}
                onChange={(e) => setCarId(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              >
                <option value="">Select verified car</option>
                {verifiedCars.map((c) => (
                  <option key={c.id || c.plate} value={c.id || ''}>
                    {c.make} {c.model} · {c.plate}
                  </option>
                ))}
              </select>
            </label>
          )}

          {verifiedDrivers.length === 0 ? (
            <p className="text-xs font-bold text-amber-700 bg-amber-50 p-3 rounded-2xl">
              No verified drivers yet. Admin must verify a driver in My drivers before you can post.
            </p>
          ) : (
            <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              Driver
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              >
                <option value="">Select verified driver</option>
                {verifiedDrivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · +91 {d.phone}
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
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
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
              All India
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

          <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
            {availability === 'route' ? 'From city *' : 'Current city *'}
            <input
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
              list="rb-post-car-cities"
              placeholder={availability === 'route' ? 'From city' : 'Where is the car now?'}
              className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
            />
          </label>
          {availability === 'route' && (
            <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              To city *
              <input
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                list="rb-post-car-cities"
                placeholder="To city"
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              />
            </label>
          )}
          <datalist id="rb-post-car-cities">
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>

          <div className="grid grid-cols-2 gap-2">
            <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              Available from date *
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              />
            </label>
            <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              Available from time *
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              />
            </label>
            <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              Available to date *
              <input
                type="date"
                value={availableTillDate}
                onChange={(e) => setAvailableTillDate(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              />
            </label>
            <label className="block text-[10px] font-extrabold uppercase text-[#6B6B6B]">
              Available to time *
              <input
                type="time"
                value={availableTillTime}
                onChange={(e) => setAvailableTillTime(e.target.value)}
                className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
              />
            </label>
          </div>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Notes (optional)"
            className="mt-0 w-full px-3 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold"
          />

          {error && <p className="text-[11px] font-bold text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting || verifiedCars.length === 0 || verifiedDrivers.length === 0}
            className="w-full py-3 rounded-2xl brand-gradient text-white text-xs font-extrabold disabled:opacity-60"
          >
            {submitting ? 'Publishing…' : 'Publish car listing'}
          </button>
          </>
          )}
        </form>
      </div>
    </div>
  );
};
