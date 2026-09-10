import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { POPULAR_CITIES } from '../../data/cities';
import { CAR_BODY_TYPES } from '../../data/indiaTaxiCars';

export type BrowseFilterValues = {
  fromCity: string;
  toCity: string;
  bookingDate: string;
  carType: string;
  availableTill: string;
  maxPrice: string;
  minSeats: string;
  fuelType: string;
  availability: '' | 'citywide' | 'route';
  tripSide: '' | 'one_side' | 'two_side';
  minPax: string;
};

export const EMPTY_BROWSE_FILTERS: BrowseFilterValues = {
  fromCity: '',
  toCity: '',
  bookingDate: '',
  carType: '',
  availableTill: '',
  maxPrice: '',
  minSeats: '',
  fuelType: '',
  availability: '',
  tripSide: '',
  minPax: '',
};

const field =
  'mt-1 w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C]';

function Label({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <label className="text-[10px] font-extrabold uppercase text-[#6B6B6B]">
      {text}
      {children}
    </label>
  );
}

export function BrowseFilters({
  kind,
  value,
  moreOpen,
  onChange,
  onToggleMore,
  onApply,
  onClear,
}: {
  kind: 'car' | 'tour';
  value: BrowseFilterValues;
  moreOpen: boolean;
  onChange: (next: BrowseFilterValues) => void;
  onToggleMore: () => void;
  onApply: () => void;
  onClear: () => void;
}) {
  const set = (patch: Partial<BrowseFilterValues>) => onChange({ ...value, ...patch });
  const listId = kind === 'car' ? 'rb-car-cities' : 'rb-tour-cities';

  return (
    <div className="p-4 rounded-3xl bg-white border border-[#EBE5D8] space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Label text="From">
          <input
            value={value.fromCity}
            onChange={(e) => set({ fromCity: e.target.value })}
            list={listId}
            className={field}
            placeholder="All India"
          />
        </Label>
        <Label text="To">
          <input
            value={value.toCity}
            onChange={(e) => set({ toCity: e.target.value })}
            list={listId}
            className={field}
            placeholder="All India"
          />
        </Label>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Label text={kind === 'car' ? 'Need on' : 'Booking date'}>
          <input
            type="date"
            value={value.bookingDate}
            onChange={(e) => set({ bookingDate: e.target.value })}
            className={field}
          />
        </Label>
        <Label text="Car type">
          <select value={value.carType} onChange={(e) => set({ carType: e.target.value })} className={field}>
            <option value="">Any type</option>
            {CAR_BODY_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Label>
      </div>
      <datalist id={listId}>
        {POPULAR_CITIES.map((c) => (
          <option key={c.name} value={c.name} />
        ))}
      </datalist>

      {moreOpen && (
        <div className="space-y-3 pt-1 border-t border-[#F2ECE1]">
          <p className="text-[10px] font-extrabold uppercase text-[#8A8478]">More filters</p>
          <div className="grid grid-cols-2 gap-2">
            {kind === 'car' ? (
              <Label text="Available to">
                <input
                  type="date"
                  value={value.availableTill}
                  onChange={(e) => set({ availableTill: e.target.value })}
                  className={field}
                />
              </Label>
            ) : (
              <Label text="Min passengers">
                <input
                  type="number"
                  min={1}
                  value={value.minPax}
                  onChange={(e) => set({ minPax: e.target.value })}
                  className={field}
                  placeholder="Any"
                />
              </Label>
            )}
            <Label text="Max price ₹">
              <input
                type="number"
                min={0}
                value={value.maxPrice}
                onChange={(e) => set({ maxPrice: e.target.value })}
                className={field}
                placeholder="Any"
              />
            </Label>
            {kind === 'car' ? (
              <Label text="Min seats">
                <select
                  value={value.minSeats}
                  onChange={(e) => set({ minSeats: e.target.value })}
                  className={field}
                >
                  <option value="">Any</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                  <option value="6">6+</option>
                  <option value="7">7+</option>
                </select>
              </Label>
            ) : (
              <Label text="Trip side">
                <select
                  value={value.tripSide}
                  onChange={(e) => set({ tripSide: e.target.value as BrowseFilterValues['tripSide'] })}
                  className={field}
                >
                  <option value="">Any</option>
                  <option value="one_side">One side</option>
                  <option value="two_side">Two side</option>
                </select>
              </Label>
            )}
          </div>
          {kind === 'car' && (
            <div className="grid grid-cols-2 gap-2">
              <Label text="Fuel">
                <select
                  value={value.fuelType}
                  onChange={(e) => set({ fuelType: e.target.value })}
                  className={field}
                >
                  <option value="">Any</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </Label>
              <Label text="Route">
                <select
                  value={value.availability}
                  onChange={(e) => set({ availability: e.target.value as BrowseFilterValues['availability'] })}
                  className={field}
                >
                  <option value="">Any</option>
                  <option value="citywide">All India</option>
                  <option value="route">X → Y</option>
                </select>
              </Label>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onApply}
          className="flex-1 py-2.5 rounded-2xl brand-gradient text-white text-xs font-extrabold"
        >
          Apply filter
        </button>
        <button
          type="button"
          onClick={onToggleMore}
          className="px-3 py-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] text-xs font-extrabold text-[#1C1C1C] inline-flex items-center gap-1"
        >
          More {moreOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        <button type="button" onClick={onClear} className="px-3 py-2.5 rounded-2xl bg-[#FAF6EE] text-xs font-bold">
          Clear
        </button>
      </div>
    </div>
  );
}

export function browseFilterActive(v: BrowseFilterValues) {
  return Boolean(
    v.fromCity ||
      v.toCity ||
      v.bookingDate ||
      v.carType ||
      v.availableTill ||
      v.maxPrice ||
      v.minSeats ||
      v.fuelType ||
      v.availability ||
      v.tripSide ||
      v.minPax
  );
}
