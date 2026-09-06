import React, { useState } from 'react';
import { Car, Plus, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Vehicle } from '../../types';
import { FilePick } from '../common/FilePick';
import { isPreviewableImage } from '../../lib/upload';
import { VehicleDetailsView } from './VehicleDetailsView';

export const PartnerCarsView: React.FC = () => {
  const { partnerCars, addPartnerCar, currentUser } = useAppStore();
  const [open, setOpen] = useState(false);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [plate, setPlate] = useState('');
  const [seats, setSeats] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [rcDocument, setRcDocument] = useState('');
  const [insuranceDocument, setInsuranceDocument] = useState('');
  const [carError, setCarError] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const detailsCar = partnerCars.find((c) => (c.id || c.plate) === detailsId);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!plate.trim() || !make.trim() || !model.trim()) {
      setCarError('Make, model and number plate are required.');
      return;
    }
    if (!rcDocument) {
      setCarError('Upload the vehicle RC document.');
      return;
    }
    const car: Vehicle = {
      id: `car-${Date.now()}`,
      make,
      model,
      year: year ? Number(year) : 0,
      color,
      plate,
      seats: seats ? Number(seats) : 0,
      fuelType: fuelType as Vehicle['fuelType'],
      rcNumber,
      rcDocument,
      insuranceDocument,
      isPrimary: partnerCars.length === 0,
    };
    try {
      setSaving(true);
      setCarError('');
      setSuccess('');
      await addPartnerCar(car);
      setOpen(false);
      setMake('');
      setModel('');
      setYear('');
      setColor('');
      setPlate('');
      setSeats('');
      setFuelType('');
      setRcNumber('');
      setRcDocument('');
      setInsuranceDocument('');
      setSuccess('Vehicle added successfully. Pending verification.');
    } catch (err: any) {
      setCarError(err?.message || 'Could not save vehicle.');
    } finally {
      setSaving(false);
    }
  };

  if (detailsCar) {
    return <VehicleDetailsView car={detailsCar} onBack={() => setDetailsId(null)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1C1C1C]">Vehicle details</h3>
        <button
          onClick={() => {
            setOpen((v) => !v);
            setSuccess('');
          }}
          className="flex items-center gap-1 text-[11px] font-extrabold text-[#F15A24]"
        >
          <Plus className="w-3.5 h-3.5" /> Add vehicle
        </button>
      </div>

      {success && (
        <p className="text-[11px] font-extrabold text-[#1B6B3A] bg-[#E8F6EE] border border-[#B8E0C6] rounded-2xl p-2.5 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </p>
      )}

      {open && (
        <form onSubmit={handleAdd} className="p-4 rounded-3xl bg-[#FAF6EE] border border-[#EBE5D8] space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={make}
              onChange={(e) => setMake(e.target.value)}
              placeholder="Make *"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model *"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
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
              placeholder="Number plate *"
              required
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              type="number"
              placeholder="Seats"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              placeholder="Fuel type"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
            <input
              value={rcNumber}
              onChange={(e) => setRcNumber(e.target.value)}
              placeholder="RC number"
              className="px-3 py-2 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold"
            />
          </div>
          <FilePick label="RC document *" value={rcDocument} onChange={(url) => setRcDocument(url)} />
          <FilePick
            label="Insurance document"
            value={insuranceDocument}
            onChange={(url) => setInsuranceDocument(url)}
          />
          {carError && (
            <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-xl">{carError}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-2xl brand-gradient text-white text-xs font-extrabold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving vehicle…
              </>
            ) : (
              'Save vehicle'
            )}
          </button>
        </form>
      )}

      {partnerCars.length === 0 && (
        <p className="text-[11px] text-[#6B6B6B]">Add one vehicle with RC to unlock Post car.</p>
      )}

      {partnerCars.map((car) => {
        const status = car.verificationStatus || 'pending_verification';
        return (
          <button
            key={car.id || car.plate}
            type="button"
            onClick={() => setDetailsId(car.id || car.plate)}
            className="w-full text-left p-3 rounded-2xl bg-white border border-[#EBE5D8] active-press"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#F15A24]" />
                {car.make} {car.model}
              </p>
              <span
                className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                  status === 'verified'
                    ? 'bg-[#EBF7EE] text-[#00A86B] border-[#BDE8C7]'
                    : status === 'rejected'
                      ? 'bg-red-50 text-red-600 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {status === 'verified' ? 'Verified' : status === 'rejected' ? 'Rejected' : 'Pending verification'}
              </span>
            </div>
            <p className="text-[11px] text-[#6B6B6B] mt-0.5">
              {car.plate} · {car.color} · {car.seats} seats
            </p>
            {(car.rcDocument || car.insuranceDocument) && (
              <div className="flex gap-2 mt-2">
                {car.rcDocument &&
                  (isPreviewableImage(car.rcDocument) ? (
                    <img src={car.rcDocument} alt="RC" className="w-16 h-16 rounded-xl object-cover border border-[#EBE5D8]" />
                  ) : (
                    <span className="text-[10px] font-extrabold text-[#00A86B]">RC attached</span>
                  ))}
                {car.insuranceDocument &&
                  (isPreviewableImage(car.insuranceDocument) ? (
                    <img
                      src={car.insuranceDocument}
                      alt="Insurance"
                      className="w-16 h-16 rounded-xl object-cover border border-[#EBE5D8]"
                    />
                  ) : (
                    <span className="text-[10px] font-extrabold text-[#00A86B]">Insurance attached</span>
                  ))}
              </div>
            )}
            <p className="text-[11px] font-extrabold text-[#F15A24] mt-2">View details</p>
          </button>
        );
      })}
    </div>
  );
};
