import { AppUser, BankDetails, DriverProfile, Vehicle } from '../types';

export type ServerUser = {
  id: string;
  phone: string;
  name: string;
  email: string;
  agency_name?: string | null;
  gst_number?: string | null;
  aadhaar_doc?: string | null;
  aadhaar_name?: string | null;
  selfie_doc?: string | null;
  selfie_name?: string | null;
  city?: string | null;
  profile_status: AppUser['profileStatus'];
  profile_completed: boolean;
  rejection_reason?: string | null;
  is_blocked?: boolean;
  blocked_reason?: string | null;
  created_at?: string;
};

export function mapVehicle(row: any): Vehicle {
  return {
    id: row.id,
    make: row.make,
    model: row.model,
    year: row.year || 0,
    color: row.color || '',
    plate: row.plate,
    seats: row.seats || 5,
    fuelType: row.fuel_type,
    rcNumber: row.rc_number,
    rcDocument: row.rc_document,
    insuranceDocument: row.insurance_document,
    currentCity: row.current_city,
    availability: row.availability || 'citywide',
    toCity: row.to_city,
    isPrimary: row.is_primary,
    verificationStatus:
      row.verification_status === 'verified'
        ? 'verified'
        : row.verification_status === 'rejected'
          ? 'rejected'
          : 'pending_verification',
    rejectionReason: row.rejection_reason || undefined,
  };
}

export function mapDriver(row: any): DriverProfile | undefined {
  if (!row) return undefined;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    aadhaarDoc: row.aadhaar_doc,
    selfieDoc: row.selfie_doc,
    dlNumber: row.dl_number || undefined,
    dlDoc: row.dl_doc || undefined,
    experienceYears: row.experience_years ?? 0,
    experienceNote: row.experience_note,
    completed: Boolean(row.completed),
    verificationStatus:
      row.verification_status === 'verified'
        ? 'verified'
        : row.verification_status === 'rejected'
          ? 'rejected'
          : 'pending_verification',
    rejectionReason: row.rejection_reason || undefined,
  };
}

export function mapBank(row: any): BankDetails | undefined {
  if (!row) return undefined;
  return {
    accountHolderName: row.account_holder_name,
    accountNumber: row.account_number,
    ifsc: row.ifsc,
    bankName: row.bank_name,
    branchName: row.branch_name,
    accountType: row.account_type === 'current' ? 'current' : 'savings',
    upiId: row.upi_id,
    completed: Boolean(row.completed),
  };
}

export function mapServerUser(
  row: ServerUser,
  extras?: { vehicles?: any[]; driverProfile?: any; driverProfiles?: any[]; bankDetails?: any }
): AppUser {
  const driverProfiles = (extras?.driverProfiles || (extras?.driverProfile ? [extras.driverProfile] : []))
    .map(mapDriver)
    .filter(Boolean) as DriverProfile[];
  return {
    id: row.id,
    phone: row.phone,
    name: row.name || '',
    email: row.email || '',
    agencyName: row.agency_name || undefined,
    gstNumber: row.gst_number || undefined,
    aadhaarDoc: row.aadhaar_doc || undefined,
    aadhaarName: row.aadhaar_name || undefined,
    selfieDoc: row.selfie_doc || undefined,
    selfieName: row.selfie_name || undefined,
    city: row.city || undefined,
    profileStatus: row.profile_status,
    profileCompleted: Boolean(row.profile_completed),
    createdAt: row.created_at || new Date().toISOString(),
    rejectionReason: row.rejection_reason || undefined,
    isBlocked: Boolean(row.is_blocked),
    blockedReason: row.blocked_reason || undefined,
    vehicles: (extras?.vehicles || []).map(mapVehicle),
    driverProfiles,
    driverProfile: driverProfiles[0],
    bankDetails: mapBank(extras?.bankDetails),
  };
}
