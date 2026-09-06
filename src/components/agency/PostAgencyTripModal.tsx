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

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const nowTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [tripSide, setTripSide] = useState<'one_side' | 'two_side'>('one_side');
  const [postedDate, setPostedDate] = useState(today);
  const [postedTime, setPostedTime] = useState(nowTime);
  const [passengers, setPassengers] = useState('');
  const [duration, setDuration] = useState('');
  const [startDate, setStartDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [desiredCarName, setDesiredCarName] = useState('');
  const [desiredSpec1, setDesiredSpec1] = useState('');
  const [desiredSpec2, setDesiredSpec2] = useState('');
  const [desiredSpec3, setDesiredSpec3] = useState('');
  const [totalCustomerPrice, setTotalCustomerPrice] = useState('');
  const [agencyCommission, setAgencyCommission] = useState('');
  const [tourType, setTourType] = useState('');
  const [tollTaxOption, setTollTaxOption] = useState('');
  const [parkingOption, setParkingOption] = useState('');
  const [driverNightAllowance, setDriverNightAllowance] = useState('');
  const [kmLimit, setKmLimit] = useState('');
  const [luggageCapacity, setLuggageCapacity] = useState('');
  const [driverPreferences, setDriverPreferences] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [payoutMode, setPayoutMode] = useState('');
  const [tripDetails, setTripDetails] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const gate = canAgencyPost();
  const tourGate = canPostTour();
  const activeSubInfo = getAgencyActiveSubscription(currentUser?.id || currentAgency.id);
  const driverNetPayout = Math.max(0, Number(totalCustomerPrice) - Number(agencyCommission));

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
    if (!postedDate || !postedTime) {
      setErrorMsg('Please enter posting date and time.');
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
    if (!desiredCarName.trim()) {
      setErrorMsg('Please type the required car.');
      return;
    }
    if (Number(totalCustomerPrice) <= 0) {
      setErrorMsg('Please enter a valid total booking price.');
      return;
    }
    if (Number(agencyCommission) >= Number(totalCustomerPrice)) {
      setErrorMsg('Agency commission cannot be equal to or greater than total booking price.');
      return;
    }

    try {
      setIsSubmitting(true);
      const highlights = highlightsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await postAgencyTrip({
        fromCity,
        toCity,
        tripSide,
        postedDate,
        postedTime,
        bookingDate: startDate,
        bookingTime: pickupTime,
        passengers: Number(passengers),
        duration,
        startDate,
        pickupTime,
        pickupLocation,
        dropLocation,
        requiredVehicleType: desiredCarName.trim(),
        totalCustomerPrice: Number(totalCustomerPrice),
        agencyCommission: Number(agencyCommission),
        tripDetails,
        routeHighlights: highlights,
        tourType,
        tollTaxOption,
        parkingOption,
        driverNightAllowance,
        kmLimit,
        luggageCapacity,
        driverPreferences,
        paymentTerms,
        payoutMode,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white text-[#1C1C1C] w-full max-w-lg rounded-3xl shadow-2xl border border-[#EBE5D8] overflow-hidden my-auto max-h-[92vh] flex flex-col">
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
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
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
                  <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">{tourGate.reason}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenVerification) onOpenVerification();
                }}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Add agency name on profile
              </button>
            </div>
          )}

          {tourGate.ok && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Agency Quick Badge */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF6EE] border border-[#EBE5D8] text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-[#1C1C1C]">
                    {currentUser?.agencyName || currentAgency.agencyName}
                  </span>
                </div>
                <span className="text-[#6B6B6B]">
                  Plan: <strong className="text-[#F15A24]">{activeSubInfo?.pkg.name || 'Pro'}</strong>
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Route Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Pickup City *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#F15A24] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      placeholder="e.g. Agra"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Destination City *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#00A86B] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      placeholder="e.g. Jaipur"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">Trip type *</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTripSide('one_side')}
                    className={`flex-1 py-2.5 rounded-xl text-[11px] font-extrabold ${
                      tripSide === 'one_side'
                        ? 'bg-[#F15A24] text-white'
                        : 'bg-[#FAF6EE] border border-[#EBE5D8]'
                    }`}
                  >
                    One side
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripSide('two_side')}
                    className={`flex-1 py-2.5 rounded-xl text-[11px] font-extrabold ${
                      tripSide === 'two_side'
                        ? 'bg-[#F15A24] text-white'
                        : 'bg-[#FAF6EE] border border-[#EBE5D8]'
                    }`}
                  >
                    Two side
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Posting date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                    <input
                      type="date"
                      value={postedDate}
                      onChange={(e) => setPostedDate(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Posting time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                    <input
                      type="time"
                      value={postedTime}
                      onChange={(e) => setPostedTime(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Passengers & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Passengers / Members *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
                    >
                      <option value="">Select passengers</option>
                      <option value={1}>1 Member</option>
                      <option value={2}>2 Members</option>
                      <option value={3}>3 Members</option>
                      <option value={4}>4 Members (Family)</option>
                      <option value={5}>5 Members</option>
                      <option value={6}>6 Members (Group)</option>
                      <option value={7}>7+ Members</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Duration / Tour Days *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 3 Days 1 Night"
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Actual booking date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Actual booking time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-3" />
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] space-y-2.5">
                <label className="block text-[11px] font-extrabold text-[#1C1C1C]">
                  Required Vehicle *
                </label>
                <p className="text-[10px] text-[#6B6B6B]">Type the car name plus 2–3 main specifications.</p>
                <input
                  value={desiredCarName}
                  onChange={(e) => setDesiredCarName(e.target.value)}
                  placeholder="e.g. Innova Crysta"
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EBE5D8] text-xs font-bold bg-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    value={desiredSpec1}
                    onChange={(e) => setDesiredSpec1(e.target.value)}
                    placeholder="Spec 1"
                    className="px-2.5 py-2 rounded-xl border border-[#EBE5D8] text-[11px] font-bold bg-white"
                  />
                  <input
                    value={desiredSpec2}
                    onChange={(e) => setDesiredSpec2(e.target.value)}
                    placeholder="Spec 2"
                    className="px-2.5 py-2 rounded-xl border border-[#EBE5D8] text-[11px] font-bold bg-white"
                  />
                  <input
                    value={desiredSpec3}
                    onChange={(e) => setDesiredSpec3(e.target.value)}
                    placeholder="Spec 3"
                    className="px-2.5 py-2 rounded-xl border border-[#EBE5D8] text-[11px] font-bold bg-white"
                  />
                </div>
              </div>

              {/* PRICING & COMMISSION FORMULA (e.g. ₹1000 Total, ₹200 Comm, ₹800 Driver) */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FFF5F0] to-[#FAF6EE] border border-[#FFD8CB] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#1C1C1C] flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#F15A24]" />
                    Pricing & Driver Payout
                  </span>
                  <span className="text-[10px] font-extrabold text-[#00A86B] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Auto Calculated
                  </span>
                </div>

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
                      required
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
                      required
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
              </div>

              {/* Route Highlights */}
              <div>
                <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                  Sightseeing Highlights (Comma separated)
                </label>
                <input
                  type="text"
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Taj Mahal, Fatehpur Sikri, Hawa Mahal"
                  className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                />
              </div>

              {/* Tour Category & Toll Rule */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Tour Category
                  </label>
                    <select
                    value={tourType}
                    onChange={(e) => setTourType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  >
                    <option value="">Select category</option>
                    <option value="Family Sightseeing Tour">Family Sightseeing Tour</option>
                    <option value="Leisure Group Tour">Leisure Group Tour</option>
                    <option value="Pilgrimage / Religious Tour">Pilgrimage / Religious Tour</option>
                    <option value="Corporate Business Tour">Corporate Business Tour</option>
                    <option value="Honeymoon Couple Tour">Honeymoon Couple Tour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Tolls & Border Tax Rule
                  </label>
                    <select
                    value={tollTaxOption}
                    onChange={(e) => setTollTaxOption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  >
                    <option value="">Select toll rule</option>
                    <option value="Paid directly by Guest at Toll Plazas">Paid directly by Guest</option>
                    <option value="Included in Total Package Fare">Included in Fare</option>
                    <option value="Extra on actual FASTag receipts">Extra on Actuals</option>
                  </select>
                </div>
              </div>

              {/* Km Limit & Night Stay Allowance */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Km Limit / Package Kms
                  </label>
                  <input
                    type="text"
                    value={kmLimit}
                    onChange={(e) => setKmLimit(e.target.value)}
                    placeholder="e.g. 550 Km included (₹10/Km extra)"
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Driver Night Allowance / Stay
                  </label>
                  <input
                    type="text"
                    value={driverNightAllowance}
                    onChange={(e) => setDriverNightAllowance(e.target.value)}
                    placeholder="e.g. ₹300/Night included"
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  />
                </div>
              </div>

              {/* Luggage & Driver Preferences */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Luggage Capacity
                  </label>
                  <input
                    type="text"
                    value={luggageCapacity}
                    onChange={(e) => setLuggageCapacity(e.target.value)}
                    placeholder="e.g. 2 Large Bags + 2 Small"
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Driver Preferences / Rules
                  </label>
                  <input
                    type="text"
                    value={driverPreferences}
                    onChange={(e) => setDriverPreferences(e.target.value)}
                    placeholder="e.g. AC throughout, Non-smoking"
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  />
                </div>
              </div>

              {/* Payment Terms & Payout Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Payment Payout Mode
                  </label>
                    <select
                    value={payoutMode}
                    onChange={(e) => setPayoutMode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  >
                    <option value="">Select payout mode</option>
                    <option value="Direct Cash from Guest">Direct Cash from Guest</option>
                    <option value="Instant UPI by Agency">Instant UPI by Agency</option>
                    <option value="Split 50-50 (Advance + Drop)">Split 50-50</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#6B6B6B] mb-1">
                    Payment Terms
                  </label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="e.g. ₹200 advance, balance to driver"
                    className="w-full px-3 py-2 rounded-xl border border-[#EBE5D8] text-xs font-medium text-[#1C1C1C] bg-[#FAF6EE]/50 focus:bg-white focus:border-[#F15A24] outline-none"
                  />
                </div>
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
