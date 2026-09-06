import { CarListing } from '../types';

export const INITIAL_CAR_LISTINGS: CarListing[] = [];

export const INITIAL_INQUIRIES: {
  id: string;
  listingType: 'car' | 'tour';
  listingId: string;
  riderId: string;
  riderName: string;
  inquirerRole: 'customer' | 'partner';
  inquirerPhone: string;
  partnerId: string;
  partnerName: string;
  channel: 'call' | 'whatsapp' | 'ridebhai';
  createdAt: string;
  title: string;
  price: number;
  fromCity?: string;
  toCity?: string;
}[] = [];
