import React, { useState } from 'react';
import {
  ShieldCheck,
  Upload,
  FileCheck,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Car,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Lock,
  FileText,
  Zap,
  Fuel,
  Sparkles,
  PhoneCall,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { FuelType, Vehicle, DriverDocuments } from '../../types';
import { CarMakeModelSelect } from '../common/CarMakeModelSelect';
import { findTaxiCar, type CarBodyType } from '../../data/indiaTaxiCars';

export const DriverVerificationView: React.FC = () => {
  const {
    currentDriver,
    submitDriverVerification,
    simulateDriverStatusChange,
  } = useAppStore();

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmittedDetails, setShowSubmittedDetails] = useState(true);

  // --- STEP 1: Driver Personal KYC & Driving License ---
  const [aadhaarNumber, setAadhaarNumber] = useState(
    currentDriver.documents?.aadhaarNumber || '5421 8904 3321'
  );
  const [aadhaarFrontDoc, setAadhaarFrontDoc] = useState(
    currentDriver.documents?.aadhaarFrontDoc || 'aadhaar_card_front.pdf'
  );
  const [aadhaarBackDoc, setAadhaarBackDoc] = useState(
    currentDriver.documents?.aadhaarBackDoc || 'aadhaar_card_back.pdf'
  );

  const [panNumber, setPanNumber] = useState(
    currentDriver.documents?.panNumber || 'ABCDE1234F'
  );
  const [panDoc, setPanDoc] = useState(
    currentDriver.documents?.panDoc || 'pan_card_copy.jpg'
  );

  const [drivingLicenseNumber, setDrivingLicenseNumber] = useState(
    currentDriver.documents?.drivingLicenseNumber || 'DL-0420180098452'
  );
  const [drivingLicenseExpiry, setDrivingLicenseExpiry] = useState(
    currentDriver.documents?.drivingLicenseExpiry || '2032-08-15'
  );
  const [drivingLicenseDoc, setDrivingLicenseDoc] = useState(
    currentDriver.documents?.drivingLicenseDoc || 'driving_license_valid.jpg'
  );

  const [step1Error, setStep1Error] = useState('');

  // --- STEP 2: Vehicles List & Vehicle Registration Form ---
  const initialVehiclesList: Vehicle[] =
    currentDriver.vehicles && currentDriver.vehicles.length > 0
      ? currentDriver.vehicles
      : [
          {
            id: 'veh-1',
            make: currentDriver.vehicle?.make || 'Volkswagen',
            model: currentDriver.vehicle?.model || 'Virtus GT Plus',
            year: currentDriver.vehicle?.year || 2023,
            color: currentDriver.vehicle?.color || 'Wild Cherry Red',
            plate: currentDriver.vehicle?.plate || 'DL 10 CZ 2024',
            seats: currentDriver.vehicle?.seats || 4,
            fuelType: currentDriver.vehicle?.fuelType || 'petrol',
            rcNumber: currentDriver.vehicle?.rcNumber || 'DL10CZ2024',
            rcDocument: currentDriver.vehicle?.rcDocument || 'vehicle_rc_front.pdf',
            insuranceProvider: currentDriver.vehicle?.insuranceProvider || 'HDFC ERGO',
            insurancePolicyNumber: currentDriver.vehicle?.insurancePolicyNumber || 'POL-992817263',
            insuranceExpiryDate: currentDriver.vehicle?.insuranceExpiryDate || '2027-04-10',
            insuranceDocument: currentDriver.vehicle?.insuranceDocument || 'insurance_policy_copy.pdf',
            pucCertificateNumber: currentDriver.vehicle?.pucCertificateNumber || 'PUC-8829104',
            pucExpiryDate: currentDriver.vehicle?.pucExpiryDate || '2026-12-30',
            pucDocument: currentDriver.vehicle?.pucDocument || 'puc_certificate.pdf',
            isPrimary: true,
          },
        ];

  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>(initialVehiclesList);

  // Form states for adding another vehicle
  const [fuelType, setFuelType] = useState<FuelType>('electric');
  const [bodyType, setBodyType] = useState<CarBodyType | ''>('suv');
  const [make, setMake] = useState('Tata');
  const [model, setModel] = useState('Nexon');
  const [year, setYear] = useState(2024);
  const [color, setColor] = useState('Signature Teal');
  const [plate, setPlate] = useState('DL 08 EV 9900');
  const [seats, setSeats] = useState(4);

  // Vehicle Documents (RC, Insurance, PUC)
  const [rcNumber, setRcNumber] = useState('DL08EV9900');
  const [rcDocument, setRcDocument] = useState('rc_smart_card.pdf');
  const [insuranceProvider, setInsuranceProvider] = useState('Tata AIG');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('POL-449102');
  const [insuranceExpiryDate, setInsuranceExpiryDate] = useState('2028-02-14');
  const [insuranceDocument, setInsuranceDocument] = useState('tata_aig_insurance.pdf');
  const [pucCertificateNumber, setPucCertificateNumber] = useState('PUC-992102');
  const [pucExpiryDate, setPucExpiryDate] = useState('2027-01-20');
  const [pucDocument, setPucDocument] = useState('puc_certificate.pdf');

  const [step2Error, setStep2Error] = useState('');
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);

  // Handle Step 1 Validation & Proceed to Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarNumber.trim() || aadhaarNumber.replace(/\s/g, '').length < 12) {
      setStep1Error('Please enter a valid 12-digit Aadhaar Card Number');
      return;
    }
    if (!panNumber.trim() || panNumber.trim().length < 10) {
      setStep1Error('Please enter a valid 10-character PAN Number');
      return;
    }
    if (!drivingLicenseNumber.trim()) {
      setStep1Error('Please enter your Driving License Number');
      return;
    }
    setStep1Error('');
    setActiveStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add another vehicle to the list
  const handleAddNewVehicle = () => {
    if (!bodyType || !make.trim() || !model.trim()) {
      setStep2Error('Select car type, make and model.');
      return;
    }
    if (!plate.trim()) {
      setStep2Error('Please enter the vehicle registration plate number');
      return;
    }
    const newVeh: Vehicle = {
      id: `veh-${Date.now()}`,
      make,
      model,
      year: Number(year) || 2024,
      color,
      plate: plate.toUpperCase(),
      seats: Number(seats) || 4,
      fuelType,
      rcNumber: rcNumber || plate.toUpperCase(),
      rcDocument,
      insuranceProvider,
      insurancePolicyNumber,
      insuranceExpiryDate,
      insuranceDocument,
      pucCertificateNumber: fuelType === 'electric' ? undefined : pucCertificateNumber,
      pucExpiryDate: fuelType === 'electric' ? undefined : pucExpiryDate,
      pucDocument: fuelType === 'electric' ? undefined : pucDocument,
      isPrimary: vehiclesList.length === 0,
    };

    setVehiclesList([...vehiclesList, newVeh]);
    setShowAddVehicleForm(false);
    setStep2Error('');

    // Reset vehicle form for next vehicle
    setBodyType('suv');
    setMake('Hyundai');
    setModel('Creta');
    setPlate('DL 03 BC 4545');
    setFuelType('petrol');
    setColor('Polar White');
    setYear(2023);
    setSeats(4);
    setRcNumber('DL03BC4545');
    setRcDocument('rc_creta.pdf');
    setInsuranceProvider('ICICI Lombard');
    setInsurancePolicyNumber('POL-551029');
    setInsuranceExpiryDate('2027-08-20');
    setInsuranceDocument('icici_insurance.pdf');
  };

  const handleRemoveVehicle = (index: number) => {
    if (vehiclesList.length <= 1) {
      alert('You must have at least 1 vehicle registered for verification.');
      return;
    }
    const updated = vehiclesList.filter((_, i) => i !== index);
    if (!updated.some((v) => v.isPrimary) && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    setVehiclesList(updated);
  };

  const handleSetPrimary = (index: number) => {
    const updated = vehiclesList.map((v, i) => ({
      ...v,
      isPrimary: i === index,
    }));
    setVehiclesList(updated);
  };

  // Submit complete verification (KYC Docs + Vehicles)
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalVehicles = [...vehiclesList];
    if (finalVehicles.length === 0 && plate.trim()) {
      finalVehicles = [
        {
          id: `veh-${Date.now()}`,
          make,
          model,
          year: Number(year) || 2023,
          color,
          plate: plate.toUpperCase(),
          seats: Number(seats) || 4,
          fuelType,
          rcNumber: rcNumber || plate.toUpperCase(),
          rcDocument,
          insuranceProvider,
          insurancePolicyNumber,
          insuranceExpiryDate,
          insuranceDocument,
          pucCertificateNumber: fuelType === 'electric' ? undefined : pucCertificateNumber,
          pucExpiryDate: fuelType === 'electric' ? undefined : pucExpiryDate,
          pucDocument: fuelType === 'electric' ? undefined : pucDocument,
          isPrimary: true,
        },
      ];
    }

    if (finalVehicles.length === 0) {
      setStep2Error('Please add at least 1 vehicle with RC & insurance details.');
      return;
    }

    const driverDocs: DriverDocuments = {
      aadhaarNumber,
      aadhaarFrontDoc,
      aadhaarBackDoc,
      panNumber: panNumber.toUpperCase(),
      panDoc,
      drivingLicenseNumber: drivingLicenseNumber.toUpperCase(),
      drivingLicenseExpiry,
      drivingLicenseDoc,
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      submitDriverVerification(driverDocs, finalVehicles);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
  };

  // =========================================================================
  // VIEW 1: LOCKED REVIEW STATUS (when status === 'pending_verification')
  // =========================================================================
  if (currentDriver.status === 'pending_verification') {
    return (
      <div className="space-y-4 pb-24 animate-fade-in max-w-2xl mx-auto">
        {/* Prominent Locked Profile Banner */}
        <div className="bg-gradient-to-br from-[#1C1C1C] via-[#2A2A2A] to-[#1C1C1C] text-white rounded-3xl p-6 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#F15A24]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                <Clock className="w-3 h-3 animate-spin" />
                <span>PROFILE UNDER VERIFICATION • LOCKED</span>
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Documents & Vehicle Under Review
              </h2>
              <p className="text-xs text-white/80 leading-relaxed pt-1">
                Your government KYC credentials (Aadhaar, PAN, DL) and registered vehicle records (RC, Insurance, PUC) have been submitted securely.
              </p>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-white/90 flex items-center gap-3">
            <PhoneCall className="w-5 h-5 text-[#F15A24] flex-shrink-0" />
            <p>
              <strong className="text-white">We will contact you:</strong> Our compliance team reviews your profile within <span className="text-[#F7C948] font-bold">2 to 4 hours</span>. We will call or SMS you once verified.
            </p>
          </div>

          {/* Ride posting gated alert */}
          <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 text-[11px] text-amber-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Posting new rides is temporarily locked until admin verification completes.</span>
          </div>
        </div>

        {/* Verification Checklist Status Tracker */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider">
              Verification Pipeline
            </h3>
            <span className="text-[10px] text-amber-600 bg-amber-50 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
              4 of 4 Submitted
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1C1C]">Aadhaar & PAN Identity</p>
                  <p className="text-[10px] text-[#6B6B6B]">Govt ID authenticating driver name & photo</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                In Review
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1C1C]">Driving License Validity</p>
                  <p className="text-[10px] text-[#6B6B6B]">DL validity & transport endorsement check</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                In Review
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1C1C]">Vehicle RC Registration</p>
                  <p className="text-[10px] text-[#6B6B6B]">Chassis & ownership records verification</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                In Review
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1C1C1C]">Insurance & PUC Compliance</p>
                  <p className="text-[10px] text-[#6B6B6B]">Active third-party/comprehensive cover</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                In Review
              </span>
            </div>
          </div>
        </div>

        {/* View Submitted Documents & Registered Vehicles Accordion */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card space-y-4">
          <button
            type="button"
            onClick={() => setShowSubmittedDetails(!showSubmittedDetails)}
            className="w-full flex items-center justify-between font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider"
          >
            <span>Inspect Submitted Records ({vehiclesList.length} Vehicle{vehiclesList.length > 1 ? 's' : ''})</span>
            {showSubmittedDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSubmittedDetails && (
            <div className="space-y-4 pt-2 border-t border-[#F2ECE1] text-xs">
              {/* Submitted KYC summary */}
              <div>
                <h4 className="font-bold text-[11px] text-[#6B6B6B] uppercase mb-2">
                  1. Personal Identification Records
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
                    <span className="text-[10px] text-[#6B6B6B] block">Aadhaar Card</span>
                    <span className="font-mono font-bold text-[#1C1C1C]">
                      {aadhaarNumber || '5421 8904 3321'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
                    <span className="text-[10px] text-[#6B6B6B] block">PAN Number</span>
                    <span className="font-mono font-bold text-[#1C1C1C]">
                      {panNumber || 'ABCDE1234F'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
                    <span className="text-[10px] text-[#6B6B6B] block">Driving License</span>
                    <span className="font-mono font-bold text-[#1C1C1C]">
                      {drivingLicenseNumber || 'DL-0420180098452'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitted Vehicles summary */}
              <div>
                <h4 className="font-bold text-[11px] text-[#6B6B6B] uppercase mb-2">
                  2. Registered Vehicles
                </h4>
                <div className="space-y-2">
                  {vehiclesList.map((veh, idx) => (
                    <div
                      key={veh.id || idx}
                      className="p-3.5 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1C1C1C] text-sm">
                            {veh.make} {veh.model}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white border border-[#EBE5D8] text-[#1C1C1C]">
                            {veh.fuelType === 'electric' ? '⚡ Electric' : veh.fuelType?.toUpperCase()}
                          </span>
                          {veh.isPrimary && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#FFF0EB] text-[#F15A24] border border-[#FFD8CB]">
                              Primary
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-extrabold text-xs text-[#F15A24] bg-white px-2.5 py-1 rounded-xl border border-[#EBE5D8]">
                          {veh.plate}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 text-[#6B6B6B]">
                        <div>
                          <span className="block opacity-75">Year & Color:</span>
                          <strong className="text-[#1C1C1C]">{veh.year} • {veh.color}</strong>
                        </div>
                        <div>
                          <span className="block opacity-75">Seats:</span>
                          <strong className="text-[#1C1C1C]">{veh.seats} Passengers</strong>
                        </div>
                        <div>
                          <span className="block opacity-75">Insurance:</span>
                          <strong className="text-[#1C1C1C]">{veh.insuranceProvider || 'Active'}</strong>
                        </div>
                        <div>
                          <span className="block opacity-75">PUC / EV:</span>
                          <strong className="text-[#1C1C1C]">
                            {veh.fuelType === 'electric' ? '⚡ Exempted' : (veh.pucCertificateNumber || 'Verified')}
                          </strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Demo Fast Simulator Sandbox */}
        <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-extrabold text-xs text-[#1C1C1C]">Demo Sandbox Controls</h4>
              <p className="text-[10px] text-[#6B6B6B]">Test admin approval or rejection instant simulation</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  simulateDriverStatusChange(currentDriver.id, 'verified');
                  alert('✅ Simulated Admin Approval: Driver is now Verified and profile is unlocked!');
                }}
                className="py-2 px-3.5 rounded-xl bg-[#2E9E5B] text-white text-xs font-extrabold shadow-xs hover:bg-[#25824b] active-press flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simulate Approval</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  simulateDriverStatusChange(
                    currentDriver.id,
                    'rejected',
                    'Driving License photo was blurry. Please re-upload clear photo.'
                  );
                  alert('❌ Simulated Admin Rejection: Driver status set to Rejected.');
                }}
                className="py-2 px-3.5 rounded-xl bg-[#D64545] text-white text-xs font-extrabold shadow-xs hover:bg-[#b83333] active-press flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Simulate Reject</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: VERIFIED STATE
  // =========================================================================
  if (currentDriver.status === 'verified') {
    return (
      <div className="space-y-4 pb-24 animate-fade-in max-w-2xl mx-auto">
        <div className="bg-[#EBF7F0] border border-[#B8E6CB] rounded-3xl p-6 shadow-card space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2E9E5B] text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#2E9E5B]">
                KYC STATUS: VERIFIED
              </span>
              <h2 className="text-lg font-extrabold text-[#1C1C1C]">
                Driver Profile Approved & Active!
              </h2>
              <p className="text-xs text-[#6B6B6B]">
                Your documents & vehicles have been verified. You can publish rides and earn 100% of the passenger seat split.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-[#B8E6CB] flex items-center justify-between text-xs">
            <span className="text-[#1C1C1C] font-bold">Need to update or add another car?</span>
            <button
              type="button"
              onClick={() => {
                simulateDriverStatusChange(currentDriver.id, 'unverified');
                setActiveStep(2);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#B8E6CB] text-[#2E9E5B] font-extrabold hover:bg-[#FAF6EE] transition-all"
            >
              + Add / Update Vehicles
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: ONBOARDING WIZARD (Step 1: Driver KYC, Step 2: Vehicle Details)
  // =========================================================================
  return (
    <div className="space-y-5 pb-28 animate-fade-in max-w-2xl mx-auto">
      {/* Stepper Header */}
      <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-[#1C1C1C]">
              Driver Partner Onboarding
            </h2>
            <p className="text-xs text-[#6B6B6B]">
              Complete mandatory KYC & Vehicle details to unlock ride posting
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#FFF0EB] text-[#F15A24] border border-[#FFD8CB]">
            Step {activeStep} of 2
          </span>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
              activeStep === 1
                ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm'
                : 'bg-[#FAF6EE] text-[#6B6B6B] border-[#EBE5D8] hover:border-[#F15A24]'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              activeStep === 1 ? 'bg-[#F15A24] text-white' : 'bg-black/10 text-[#1C1C1C]'
            }`}>
              1
            </div>
            <div>
              <p className="text-xs font-bold">Personal Documents</p>
              <p className="text-[10px] opacity-75">Aadhaar, PAN & License</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!aadhaarNumber || !panNumber || !drivingLicenseNumber) {
                setStep1Error('Please fill personal KYC documents first');
                return;
              }
              setActiveStep(2);
            }}
            className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
              activeStep === 2
                ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm'
                : 'bg-[#FAF6EE] text-[#6B6B6B] border-[#EBE5D8] hover:border-[#F15A24]'
            }`}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              activeStep === 2 ? 'bg-[#F15A24] text-white' : 'bg-black/10 text-[#1C1C1C]'
            }`}>
              2
            </div>
            <div>
              <p className="text-xs font-bold">Vehicle Registration</p>
              <p className="text-[10px] opacity-75">Fuel, RC, Insurance & PUC</p>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: PERSONAL KYC DOCUMENTS (Aadhaar, PAN, Driving License)             */}
      {/* ========================================================================= */}
      {activeStep === 1 && (
        <form onSubmit={handleProceedToStep2} className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#F2ECE1]">
              <ShieldCheck className="w-5 h-5 text-[#F15A24]" />
              <h3 className="font-extrabold text-sm text-[#1C1C1C]">
                Step 1: Driver Identification & Driving License
              </h3>
            </div>

            {/* Aadhaar Card Section */}
            <div className="space-y-2.5">
              <label className="text-xs font-extrabold text-[#1C1C1C] flex items-center justify-between">
                <span>1. Aadhaar Card (12-Digit Govt ID)</span>
                <span className="text-[10px] text-[#2E9E5B] font-bold">Mandatory</span>
              </label>
              <input
                type="text"
                maxLength={14}
                value={aadhaarNumber}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
                  setAadhaarNumber(formatted);
                }}
                placeholder="5421 8904 3321"
                className="w-full text-xs font-mono font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24] tracking-wider"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div className="flex items-center bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl p-2.5 justify-between">
                  <div className="flex items-center gap-2 text-xs truncate">
                    <FileCheck className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                    <span className="text-[#1C1C1C] font-mono text-[11px] truncate">
                      {aadhaarFrontDoc}
                    </span>
                  </div>
                  <label className="py-1 px-2.5 bg-white border border-[#EBE5D8] rounded-xl text-[10px] font-bold text-[#F15A24] cursor-pointer hover:bg-[#FFF0EB]">
                    Browse Front
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setAadhaarFrontDoc(e.target.files[0].name)}
                    />
                  </label>
                </div>

                <div className="flex items-center bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl p-2.5 justify-between">
                  <div className="flex items-center gap-2 text-xs truncate">
                    <FileCheck className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                    <span className="text-[#1C1C1C] font-mono text-[11px] truncate">
                      {aadhaarBackDoc}
                    </span>
                  </div>
                  <label className="py-1 px-2.5 bg-white border border-[#EBE5D8] rounded-xl text-[10px] font-bold text-[#F15A24] cursor-pointer hover:bg-[#FFF0EB]">
                    Browse Back
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setAadhaarBackDoc(e.target.files[0].name)}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* PAN Card Section */}
            <div className="space-y-2.5 pt-2 border-t border-[#F2ECE1]">
              <label className="text-xs font-extrabold text-[#1C1C1C] flex items-center justify-between">
                <span>2. PAN Card (Permanent Account Number)</span>
                <span className="text-[10px] text-[#2E9E5B] font-bold">Mandatory</span>
              </label>
              <input
                type="text"
                maxLength={10}
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                className="w-full text-xs font-mono font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24] tracking-wider uppercase"
                required
              />

              <div className="flex items-center bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl p-2.5 justify-between">
                <div className="flex items-center gap-2 text-xs truncate">
                  <FileCheck className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                  <span className="text-[#1C1C1C] font-mono text-[11px] truncate">{panDoc}</span>
                </div>
                <label className="py-1 px-2.5 bg-white border border-[#EBE5D8] rounded-xl text-[10px] font-bold text-[#F15A24] cursor-pointer hover:bg-[#FFF0EB]">
                  Browse PAN Copy
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setPanDoc(e.target.files[0].name)}
                  />
                </label>
              </div>
            </div>

            {/* Driving License Section */}
            <div className="space-y-2.5 pt-2 border-t border-[#F2ECE1]">
              <label className="text-xs font-extrabold text-[#1C1C1C] flex items-center justify-between">
                <span>3. Driving License (DL) Details</span>
                <span className="text-[10px] text-[#2E9E5B] font-bold">Mandatory</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#6B6B6B] block mb-1">
                    DL Number
                  </span>
                  <input
                    type="text"
                    value={drivingLicenseNumber}
                    onChange={(e) => setDrivingLicenseNumber(e.target.value.toUpperCase())}
                    placeholder="DL-0420180098452"
                    className="w-full text-xs font-mono font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24] tracking-wider uppercase"
                    required
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#6B6B6B] block mb-1">
                    DL Expiry Date
                  </span>
                  <input
                    type="date"
                    value={drivingLicenseExpiry}
                    onChange={(e) => setDrivingLicenseExpiry(e.target.value)}
                    className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3.5 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl p-2.5 justify-between">
                <div className="flex items-center gap-2 text-xs truncate">
                  <FileCheck className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                  <span className="text-[#1C1C1C] font-mono text-[11px] truncate">
                    {drivingLicenseDoc}
                  </span>
                </div>
                <label className="py-1 px-2.5 bg-white border border-[#EBE5D8] rounded-xl text-[10px] font-bold text-[#F15A24] cursor-pointer hover:bg-[#FFF0EB]">
                  Browse License Copy
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && setDrivingLicenseDoc(e.target.files[0].name)}
                  />
                </label>
              </div>
            </div>

            {step1Error && (
              <p className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
                {step1Error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl brand-gradient text-white font-extrabold text-xs shadow-md active-press flex items-center justify-center gap-2 hover:opacity-95 mt-2"
            >
              <span>Next: Add Vehicle Details (Step 2)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: VEHICLE DETAILS & A-Z DOCUMENTS (Fuel, RC, Insurance, PUC)        */}
      {/* ========================================================================= */}
      {activeStep === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4">
          {/* Registered Vehicles Summary & Multi-Vehicle List */}
          <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF0EB] flex items-center justify-center text-[#F15A24]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#1C1C1C]">
                    Registered Vehicles ({vehiclesList.length})
                  </h3>
                  <p className="text-[11px] text-[#6B6B6B]">Add one or multiple cars to your profile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVehicleForm(!showAddVehicleForm)}
                className="px-3.5 py-2 rounded-2xl bg-[#FFF0EB] text-[#F15A24] border border-[#FFD8CB] font-extrabold text-xs flex items-center justify-center gap-1.5 active-press hover:bg-[#ffe2d6] transition-all whitespace-nowrap shadow-2xs self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddVehicleForm ? 'Close Form' : '+ Add Another Vehicle'}</span>
              </button>
            </div>

            {vehiclesList.length > 0 && (
              <div className="space-y-2.5 pt-1">
                {vehiclesList.map((veh, index) => (
                  <div
                    key={veh.id || index}
                    className="p-4 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-xs text-[#1C1C1C]">
                          {veh.make} {veh.model} ({veh.year})
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-white border border-[#EBE5D8] text-[#1C1C1C]">
                          {veh.fuelType === 'electric' ? '⚡ EV' : veh.fuelType}
                        </span>
                        {veh.isPrimary ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#FFF0EB] text-[#F15A24] border border-[#FFD8CB] flex items-center gap-1">
                            <Award className="w-3 h-3" />
                            <span>Primary Car</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(index)}
                            className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-white text-[#6B6B6B] hover:text-[#F15A24] border border-[#EBE5D8] transition-colors"
                          >
                            Set as Primary
                          </button>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#6B6B6B]">
                        <span>Plate: <strong className="text-[#1C1C1C] font-mono">{veh.plate}</strong></span>
                        <span>•</span>
                        <span>{veh.seats} Seats</span>
                        <span>•</span>
                        <span>{veh.insuranceProvider || 'Insured'}</span>
                        <span>•</span>
                        <span>{veh.fuelType === 'electric' ? '⚡ Zero Emission' : (veh.pucCertificateNumber ? 'PUC OK' : 'PUC')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleRemoveVehicle(index)}
                        className="p-2 text-[#6B6B6B] hover:text-red-500 rounded-xl hover:bg-white transition-colors"
                        title="Remove Vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Details Input Form (Always visible if 0 vehicles, or toggled) */}
          {(showAddVehicleForm || vehiclesList.length === 0) && (
            <div className="bg-white rounded-3xl p-5 border border-[#EBE5D8] shadow-card space-y-4 animate-scale-up">
              <div className="flex items-center justify-between pb-2 border-b border-[#F2ECE1]">
                <h4 className="font-extrabold text-xs text-[#1C1C1C] uppercase tracking-wider flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#F15A24]" />
                  <span>{vehiclesList.length === 0 ? 'Vehicle Details (Car #1)' : 'Register New Vehicle'}</span>
                </h4>
                {vehiclesList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddVehicleForm(false)}
                    className="text-xs font-bold text-[#6B6B6B] hover:text-[#1C1C1C]"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* 1. Fuel Type Selector */}
              <div>
                <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-2">
                  1. Fuel / Propulsion Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['electric', 'petrol', 'diesel', 'cng', 'hybrid'] as FuelType[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFuelType(f)}
                      className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 active-press ${
                        fuelType === f
                          ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] shadow-sm'
                          : 'bg-[#FAF6EE] text-[#1C1C1C] border-[#EBE5D8] hover:border-[#F15A24]'
                      }`}
                    >
                      {f === 'electric' && <Zap className="w-4 h-4 text-emerald-400" />}
                      {f === 'petrol' && <Fuel className="w-4 h-4 text-amber-500" />}
                      {f === 'diesel' && <Fuel className="w-4 h-4 text-blue-500" />}
                      {f === 'cng' && <Sparkles className="w-4 h-4 text-green-500" />}
                      {f === 'hybrid' && <Zap className="w-4 h-4 text-cyan-400" />}
                      <span className="text-[11px] font-bold capitalize">{f}</span>
                    </button>
                  ))}
                </div>
              </div>

              <CarMakeModelSelect
                bodyType={bodyType}
                make={make}
                model={model}
                onBodyType={setBodyType}
                onMake={setMake}
                onModel={(next) => {
                  setModel(next);
                  const match = findTaxiCar(make, next);
                  if (match) setSeats(match.seats);
                }}
              />

              {/* 3. Number Plate, Year, Color, Seats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                    Plate Number
                  </label>
                  <input
                    type="text"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value.toUpperCase())}
                    placeholder="DL 01 AB 8844"
                    className="w-full text-xs font-mono font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24] tracking-wider uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                    Mfg Year
                  </label>
                  <input
                    type="number"
                    min={2010}
                    max={2026}
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                    Car Color
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Pearl White"
                    className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
                    Seat Capacity
                  </label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-3 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                  >
                    <option value={3}>3 Passengers</option>
                    <option value={4}>4 Passengers</option>
                    <option value={6}>6 Passengers (SUV)</option>
                  </select>
                </div>
              </div>

              {/* 4. Registration Certificate (RC) */}
              <div className="pt-2 border-t border-[#F2ECE1] space-y-2.5">
                <label className="text-xs font-extrabold text-[#1C1C1C] flex items-center justify-between">
                  <span>Vehicle Registration Certificate (RC)</span>
                  <span className="text-[10px] text-[#2E9E5B] font-bold">Mandatory</span>
                </label>
                <div className="flex items-center bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl p-2.5 justify-between">
                  <div className="flex items-center gap-2 text-xs truncate">
                    <Car className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                    <span className="text-[#1C1C1C] font-mono text-[11px] truncate">{rcDocument}</span>
                  </div>
                  <label className="py-1 px-2.5 bg-white border border-[#EBE5D8] rounded-xl text-[10px] font-bold text-[#F15A24] cursor-pointer hover:bg-[#FFF0EB]">
                    Browse RC Copy
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setRcDocument(e.target.files[0].name)}
                    />
                  </label>
                </div>
              </div>

              {/* 5. Comprehensive / Third-Party Insurance */}
              <div className="pt-2 border-t border-[#F2ECE1] space-y-2.5">
                <label className="text-xs font-extrabold text-[#1C1C1C] flex items-center justify-between">
                  <span>Vehicle Insurance Details (A to Z)</span>
                  <span className="text-[10px] text-[#2E9E5B] font-bold">Mandatory</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#6B6B6B] block mb-1">
                      Insurance Provider
                    </span>
                    <select
                      value={insuranceProvider}
                      onChange={(e) => setInsuranceProvider(e.target.value)}
                      className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-2.5 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                    >
                      <option value="HDFC ERGO">HDFC ERGO</option>
                      <option value="ICICI Lombard">ICICI Lombard</option>
                      <option value="Tata AIG">Tata AIG</option>
                      <option value="Bajaj Allianz">Bajaj Allianz</option>
                      <option value="Digit Insurance">Digit Insurance</option>
                      <option value="SBI General">SBI General</option>
                      <option value="Other Provider">Other Insurance Provider</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#6B6B6B] block mb-1">
                      Policy Number
                    </span>
                    <input
                      type="text"
                      value={insurancePolicyNumber}
                      onChange={(e) => setInsurancePolicyNumber(e.target.value.toUpperCase())}
                      placeholder="POL-992817263"
                      className="w-full text-xs font-mono font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-2.5 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                      required
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#6B6B6B] block mb-1">
                      Insurance Valid Till
                    </span>
                    <input
                      type="date"
                      value={insuranceExpiryDate}
                      onChange={(e) => setInsuranceExpiryDate(e.target.value)}
                      className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-2.5 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl p-2.5 justify-between">
                  <div className="flex items-center gap-2 text-xs truncate">
                    <FileCheck className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                    <span className="text-[#1C1C1C] font-mono text-[11px] truncate">
                      {insuranceDocument}
                    </span>
                  </div>
                  <label className="py-1 px-2.5 bg-white border border-[#EBE5D8] rounded-xl text-[10px] font-bold text-[#F15A24] cursor-pointer hover:bg-[#FFF0EB]">
                    Browse Policy Doc
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && setInsuranceDocument(e.target.files[0].name)}
                    />
                  </label>
                </div>
              </div>

              {/* 6. PUC (Pollution Certificate) - Auto exempted for EVs */}
              <div className="pt-2 border-t border-[#F2ECE1] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#1C1C1C]">
                    Pollution Under Control (PUC) Certificate
                  </label>
                  {fuelType === 'electric' ? (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
                      ⚡ Zero Emission (PUC Exempted)
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#2E9E5B] font-bold">Mandatory</span>
                  )}
                </div>

                {fuelType === 'electric' ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Electric Vehicles are 100% pollution-free and do not require a PUC certificate.</span>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#6B6B6B] block mb-1">
                          PUC Certificate Number
                        </span>
                        <input
                          type="text"
                          value={pucCertificateNumber}
                          onChange={(e) => setPucCertificateNumber(e.target.value.toUpperCase())}
                          placeholder="PUC-8829104"
                          className="w-full text-xs font-mono font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-2.5 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#6B6B6B] block mb-1">
                          PUC Expiry Date
                        </span>
                        <input
                          type="date"
                          value={pucExpiryDate}
                          onChange={(e) => setPucExpiryDate(e.target.value)}
                          className="w-full text-xs font-bold text-[#1C1C1C] bg-[#FAF6EE] px-3 py-2.5 rounded-2xl border border-[#EBE5D8] focus:outline-none focus:border-[#F15A24]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center bg-[#FAF6EE] border border-[#EBE5D8] rounded-2xl p-2.5 justify-between">
                      <div className="flex items-center gap-2 text-xs truncate">
                        <FileCheck className="w-4 h-4 text-[#F15A24] flex-shrink-0" />
                        <span className="text-[#1C1C1C] font-mono text-[11px] truncate">{pucDocument}</span>
                      </div>
                      <label className="py-1 px-2.5 bg-white border border-[#EBE5D8] rounded-xl text-[10px] font-bold text-[#F15A24] cursor-pointer hover:bg-[#FFF0EB]">
                        Browse PUC
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => e.target.files?.[0] && setPucDocument(e.target.files[0].name)}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>

              {showAddVehicleForm && (
                <button
                  type="button"
                  onClick={handleAddNewVehicle}
                  className="w-full py-3.5 rounded-2xl bg-[#1C1C1C] text-white font-extrabold text-xs shadow-sm active-press hover:bg-black flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save This Vehicle & Add to List</span>
                </button>
              )}
            </div>
          )}

          {step2Error && (
            <p className="text-xs font-bold text-red-500 bg-red-50 p-2.5 rounded-xl border border-red-100">
              {step2Error}
            </p>
          )}

          {/* Action Buttons: Clean balanced Back & Submit layout */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="py-3.5 px-5 rounded-2xl bg-white border border-[#EBE5D8] text-[#1C1C1C] font-extrabold text-xs hover:bg-[#FAF6EE] active-press flex items-center justify-center gap-2 shadow-2xs transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-6 rounded-2xl brand-gradient text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg active-press flex items-center justify-center gap-2.5 hover:opacity-95 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Submitting & Locking Profile...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 flex-shrink-0" />
                  <span>Submit All Documents & Lock for Verification</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
