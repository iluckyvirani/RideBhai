import React, { useSyncExternalStore } from 'react';
import {
  CAR_BODY_TYPES,
  getTaxiCars,
  makesForBody,
  modelsFor,
  subscribeTaxiCars,
  type CarBodyType,
} from '../../data/indiaTaxiCars';

const selectClass =
  'w-full px-3 py-2.5 rounded-xl bg-white border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C]';

export function CarMakeModelSelect({
  bodyType,
  make,
  model,
  onBodyType,
  onMake,
  onModel,
  allowAnyBody = false,
}: {
  bodyType: CarBodyType | '';
  make: string;
  model: string;
  onBodyType: (body: CarBodyType | '') => void;
  onMake: (make: string) => void;
  onModel: (model: string) => void;
  allowAnyBody?: boolean;
}) {
  const cars = useSyncExternalStore(subscribeTaxiCars, getTaxiCars, getTaxiCars);
  const makes = makesForBody(bodyType, cars);
  const models = make ? modelsFor(make, bodyType, cars) : [];

  return (
    <div className="grid grid-cols-1 gap-2">
      <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">
        Car type *
        <select
          value={bodyType}
          onChange={(e) => {
            onBodyType(e.target.value as CarBodyType | '');
            onMake('');
            onModel('');
          }}
          required
          className={`mt-1 ${selectClass}`}
        >
          <option value="">{allowAnyBody ? 'Any type' : 'Select type'}</option>
          {CAR_BODY_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">
          Make *
          <select
            value={make}
            onChange={(e) => {
              onMake(e.target.value);
              onModel('');
            }}
            required={!allowAnyBody}
            disabled={!bodyType && !allowAnyBody}
            className={`mt-1 ${selectClass} disabled:opacity-50`}
          >
            <option value="">{bodyType || allowAnyBody ? 'Select make' : 'Pick type first'}</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>
        <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">
          Model *
          <select
            value={model}
            onChange={(e) => onModel(e.target.value)}
            required={!allowAnyBody}
            disabled={!make}
            className={`mt-1 ${selectClass} disabled:opacity-50`}
          >
            <option value="">{make ? 'Select model' : 'Pick make first'}</option>
            {models.map((c) => (
              <option key={`${c.make}-${c.model}`} value={c.model}>
                {c.model}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
