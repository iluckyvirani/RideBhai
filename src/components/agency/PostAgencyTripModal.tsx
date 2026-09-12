import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  DollarSign,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CarMakeModelSelect } from '../common/CarMakeModelSelect';
import { carDisplayName, type CarBodyType } from '../../data/indiaTaxiCars';

interface PostAgencyTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVerification?: () => void;
  onOpenPackages?: () => void;
  onTripCreated?: () => void;
}

export const PostAgencyTripModal: React.FC<PostAgencyTripModalProps> = ({
  isOpen,
  onClose,
  onOpenVerification,
  onOpenPackages,
  onTripCreated,
}) => {
  const {
    currentAgency,
    currentUser,
    canAgencyPost,
    canPostTour,
    postAgencyTrip,
    getAgencyActiveSubscription,
  } = useAppStore();

  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [tripSide, setTripSide] = useState<'one_side' | 'two_side'>('one_side');
  const [passengers, setPassengers] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [desiredBodyType, setDesiredBodyType] = useState<CarBodyType | ''>('');
  const [desiredMake, setDesiredMake] = useState('');
  const [desiredModel, setDesiredModel] = useState('');
  const [desiredSpec1, setDesiredSpec1] = useState('');
  const [desiredSpec2, setDesiredSpec2] = useState('');
  const [desiredSpec3, setDesiredSpec3] = useState('');
  const [pricingMode, setPricingMode] = useState<'fixed' | 'quotation'>('fixed');
  const [totalCustomerPrice, setTotalCustomerPrice] = useState('');
  const [agencyCommission, setAgencyCommission] = useState('');
  const [tripDetails, setTripDetails] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const gate = canAgencyPost();
  const tourGate = canPostTour();
  const activeSubInfo = getAgencyActiveSubscription(currentUser?.id || currentAgency.id);
  const driverNetPayout = Math.max(0, Number(totalCustomerPrice || 0) - Number(agencyCommission || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!tourGate.ok) {
      setErrorMsg(tourGate.reason || 'Cannot post a tour yet.');
      return;
    }
    if (!fromCity || !toCity) {
      setErrorMsg('Please enter both pickup and destination cities.');
      return;
    }
    if (!startDate || !pickupTime) {
      setErrorMsg('Please enter actual booking date and time.');
      return;
    }
    if (!passengers) {
      setErrorMsg('Please select passengers.');
      return;
    }
    if (!desiredBodyType || !desiredMake.trim() || !desiredModel.trim()) {
      setErrorMsg('Select required car type, make and model.');
      return;
    }
    const desiredCarName = carDisplayName(desiredMake, desiredModel);

    const isQuotation = pricingMode === 'quotation' || (!totalCustomerPrice && Number(totalCustomerPrice) <= 0);
    const finalTotal = isQuotation ? 0 : Number(totalCustomerPrice);
    const finalCommission = isQuotation ? 0 : Number(agencyCommission || 0);

    if (!isQuotation) {
      if (finalTotal <= 0) {
        setErrorMsg('Please enter a valid total booking price or select "Send Best Quotation".');
        return;
      }
      if (finalCommission >= finalTotal) {
        setErrorMsg('Agency commission cannot be equal to or greater than total booking price.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await postAgencyTrip({
        fromCity,
        toCity,
        tripSide,
        bookingDate: startDate,
        bookingTime: pickupTime,
        passengers: Number(passengers),
        duration,
        startDate,
        pickupTime,
        pickupLocation,
        dropLocation,
        requiredVehicleType: desiredCarName.trim(),
        totalCustomerPrice: finalTotal,
        agencyCommission: finalCommission,
        tripDetails,
        desiredCar: {
          name: desiredCarName.trim(),
          specs: [desiredSpec1, desiredSpec2, desiredSpec3].map((s) => s.trim()).filter(Boolean),
        },
      });

      setIsSubmitting(false);
      onClose();
      if (onTripCreated) onTripCreated();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to publish trip.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-3 bg-black/75 backdrop-blur-xs animate-fade-in max-w-[430px] mx-auto">
      <div className="bg-white text-[#1C1C1C] w-full rounded-t-[32px] sm:rounded-3xl shadow-2xl border-t sm:border border-[#EBE5D8] overflow-hidden max-h-[90vh] sm:max-h-[820px] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#1C1C1C] text-white flex items-center justify-between border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#F15A24] to-[#FF7A45] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Post Tour Booking Lead</h2>
              <p className="text-[11px] text-white/70">
                Broadcast pre-booked client trips directly to verified drivers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Posting Gates */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 no-scrollbar">
          {/* Gate 1: Not Verified */}
          {!gate.canPost && gate.code === 'not_verified' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-amber-900">
                    Profile verification required
                  </h3>
                  <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                    {gate.reason}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenVerification) onOpenVerification();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active-press"
              >
                <span>Open profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Gate 2: Verified but No Package */}
          {!gate.canPost && gate.code === 'no_package' && (
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 space-y-3">
              <div className="flex items-start gap-3">
                <PackageCheck className="w-5 h-5 text-[#F15A24] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-[#8A2B09]">
                    Buy posting package first (partner pay only)
                  </h3>
                  <p className="text-[11px] text-[#A33B12] mt-1 leading-relaxed">
                    {gate.reason}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenPackages) onOpenPackages();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F15A24] to-[#FF7A45] hover:opacity-90 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active-press"
              >
                <span>Pay for posting package</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {gate.canPost && tourGate.code === 'no_agency' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-amber-900">Travel agency name required</h3>
                  <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                    {tourGate.reason}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenVerification) onOpenVerification();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active-press"
              >
                <span>Complete partner profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Form */}
          {tourGate.ok && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-bold animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Agency Banner Info */}
              <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] flex items-center justify-between text-xs font-semibold">
                <div>
                  <span className="text-[#6B6B6B]">Posting as: </span>
                  <span className="font-extrabold text-[#1C1C1C]">
                    {currentUser?.agencyName || currentAgency.agencyName || 'Verified Travel Agency'}
                  </span>
                </div>
                {activeSubInfo?.pkg && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#F15A24]">
                    {activeSubInfo.pkg.name}
                  </span>
                )}
              </div>

              {/* Trip Side Selection */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1.5">
                  Trip Route Type *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTripSide('one_side')}
                    className={`py-2.5 rounded-2xl text-xs font-extrabold border transition-all ${
                      tripSide === 'one_side'
                        ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs'
                        : 'bg-[#FAF6EE] text-[#6B6B6B] border-[#EBE5D8] hover:bg-white'
                    }`}
                  >
                    One Side (Drop)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripSide('two_side')}
                    className={`py-2.5 rounded-2xl text-xs font-extrabold border transition-all ${
                      tripSide === 'two_side'
                        ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-xs'
                        : 'bg-[#FAF6EE] text-[#6B6B6B] border-[#EBE5D8] hover:bg-white'
                    }`}
                  >
                    Two Side (Round Trip)
                  </button>
                </div>
              </div>

              {/* From / To Cities */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Pickup City *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#F15A24] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      placeholder="e.g. Delhi"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Destination City *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#00A86B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      placeholder="e.g. Agra"
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Specific Pickup & Drop Addresses */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Exact Pickup Address
                  </label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="Terminal 3 / Hotel name"
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Drop / Hotel Address
                  </label>
                  <input
                    type="text"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    placeholder="Hotel / Destination area"
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Booking Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Pickup Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Passengers & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Passengers *
                  </label>
                  <div className="relative">
                    <Users className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                    >
                      <option value="">Select Pax</option>
                      <option value="1">1 Person</option>
                      <option value="2">2 Persons</option>
                      <option value="3">3 Persons</option>
                      <option value="4">4 Persons</option>
                      <option value="5">5 Persons</option>
                      <option value="6">6 Persons</option>
                      <option value="7">7+ Persons</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Trip Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 1 Day / 2 Days 1 Night"
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  />
                </div>
              </div>

              {/* Vehicle Type & Make/Model */}
              <div className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] space-y-3">
                <span className="text-xs font-extrabold text-[#1C1C1C] block">
                  Required Car / Vehicle Details *
                </span>

                <CarMakeModelSelect
                  bodyType={desiredBodyType}
                  make={desiredMake}
                  model={desiredModel}
                  onBodyType={setDesiredBodyType}
                  onMake={setDesiredMake}
                  onModel={setDesiredModel}
                />

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <select
                    value={desiredSpec1}
                    onChange={(e) => setDesiredSpec1(e.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-[#EBE5D8] text-[11px] font-bold bg-white"
                  >
                    <option value="">Fuel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                  <select
                    value={desiredSpec2}
                    onChange={(e) => setDesiredSpec2(e.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-[#EBE5D8] text-[11px] font-bold bg-white"
                  >
                    <option value="">AC</option>
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                  </select>
                  <select
                    value={desiredSpec3}
                    onChange={(e) => setDesiredSpec3(e.target.value)}
                    className="px-2.5 py-2 rounded-xl border border-[#EBE5D8] text-[11px] font-bold bg-white"
                  >
                    <option value="">Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>
              </div>

              {/* PRICING & COMMISSION FORMULA / QUOTATION MODE */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F0] to-[#FAF6EE] border border-[#FFD8CB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#F15A24]" />
                    Pricing & Driver Payout
                  </span>
                  {pricingMode === 'fixed' && (
                    <span className="text-[10px] font-extrabold text-[#00A86B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Auto Calculated
                    </span>
                  )}
                </div>

                {/* Pricing Mode Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white border border-[#EBE5D8]">
                  <button
                    type="button"
                    onClick={() => setPricingMode('fixed')}
                    className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                      pricingMode === 'fixed'
                        ? 'bg-[#1C1C1C] text-white shadow-xs'
                        : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
                    }`}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPricingMode('quotation');
                      setTotalCustomerPrice('');
                      setAgencyCommission('');
                    }}
                    className={`py-2 rounded-lg text-xs font-extrabold transition-all ${
                      pricingMode === 'quotation'
                        ? 'bg-[#F15A24] text-white shadow-xs'
                        : 'text-[#6B6B6B] hover:text-[#F15A24]'
                    }`}
                  >
                    Send Quotation
                  </button>
                </div>

                {pricingMode === 'fixed' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-[#6B6B6B] mb-1">
                          Total Booking Price (₹) *
                        </label>
                        <input
                          type="number"
                          value={totalCustomerPrice}
                          onChange={(e) => setTotalCustomerPrice(e.target.value)}
                          placeholder="1000"
                          min={100}
                          step={50}
                          required={pricingMode === 'fixed'}
                          className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-sm font-extrabold text-[#1C1C1C] bg-white focus:border-[#F15A24] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-[#6B6B6B] mb-1">
                          My Commission Cut (₹) *
                        </label>
                        <input
                          type="number"
                          value={agencyCommission}
                          onChange={(e) => setAgencyCommission(e.target.value)}
                          placeholder="200"
                          min={0}
                          step={50}
                          required={pricingMode === 'fixed'}
                          className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-sm font-extrabold text-[#F15A24] bg-white focus:border-[#F15A24] outline-none"
                        />
                      </div>
                    </div>

                    {/* Live Payout Highlight */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#EBE5D8]">
                      <span className="text-xs font-bold text-[#6B6B6B]">
                        Net Driver Payout:
                      </span>
                      <span className="text-sm font-black text-[#00A86B]">
                        ₹{driverNetPayout.toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-3 rounded-xl bg-white border border-[#FFD8CB] text-[11px] text-[#A33B12] space-y-1">
                    <p className="font-extrabold text-[#F15A24] flex items-center gap-1.5">
                      💬 Open for Best Quotations
                    </p>
                    <p className="text-[#6B6B6B] leading-relaxed">
                      No fixed price entered. Verified drivers and taxi owners will send you their best quotations directly.
                    </p>
                  </div>
                )}
              </div>

              {/* Full Trip Itinerary Details */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                  Full Travel Details & Itinerary *
                </label>
                <textarea
                  rows={3}
                  value={tripDetails}
                  onChange={(e) => setTripDetails(e.target.value)}
                  placeholder="Detailed tour itinerary, guest arrival details, toll inclusions, driver stay..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F15A24] to-[#FF7A45] hover:opacity-95 text-white text-xs font-extrabold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active-press"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Tour Lead to Drivers'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
