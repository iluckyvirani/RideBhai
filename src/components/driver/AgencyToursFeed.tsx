import React, { useState } from 'react';
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  DollarSign,
  Search,
  Building,
  Info,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AgencyTripPost } from '../../types';

export const AgencyToursFeed: React.FC = () => {
  const {
    agencyTripPosts,
    currentDriver,
    claimAgencyTrip,
  } = useAppStore();

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // Active tour posts from verified agencies
  const activePosts = agencyTripPosts.filter((p) => {
    if (selectedCity && !p.fromCity.toLowerCase().includes(selectedCity.toLowerCase()) && !p.toCity.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }
    if (selectedVehicle && !p.requiredVehicleType.toLowerCase().includes(selectedVehicle.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleWhatsAppContact = (post: AgencyTripPost) => {
    const vehicleText = currentDriver.vehicle ? `${currentDriver.vehicle.make} ${currentDriver.vehicle.model} (${currentDriver.vehicle.plate})` : 'Commercial Sedan';
    const message = `Namaste ${post.agencyName}, I am ${currentDriver.name}, a verified driver on Ride Bhai (${vehicleText}).\n\nI want to take your Tour Booking Lead:\n📍 Route: ${post.fromCity} to ${post.toCity}\n👥 Members: ${post.passengers} Pax\n⏱️ Duration: ${post.duration}\n📅 Date: ${post.startDate}\n💰 Net Driver Payout: ₹${post.driverNetPayout}\n\nPlease confirm pickup location and customer details.`;

    const cleanNumber = post.whatsappNumber || post.agencyPhone.replace(/[^0-9]/g, '');
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const handleClaim = (post: AgencyTripPost) => {
    claimAgencyTrip(post.id, currentDriver.id, currentDriver.name, currentDriver.phone);
    setClaimedNotice(`You have marked ${post.fromCity} → ${post.toCity} as claimed! Connecting you with ${post.agencyName}...`);
    setTimeout(() => setClaimedNotice(null), 5000);
    handleWhatsAppContact(post);
  };

  return (
    <div className="space-y-4 pb-32 animate-fade-in">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1C1C1C] via-[#2A2A2A] to-[#1C1C1C] text-white shadow-card relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F15A24]/20 text-[#FF7A45] border border-[#F15A24]/30 text-[10px] font-extrabold mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Guaranteed Tour Leads</span>
          </div>
          <h1 className="text-base font-extrabold text-white">
            Travel Agency Tour Bookings
          </h1>
          <p className="text-xs text-white/70 mt-1 leading-relaxed">
            Directly claim pre-booked intercity trips posted by certified travel agencies. Zero commission loss — contact on WhatsApp instantly!
          </p>
        </div>
      </div>

      {claimedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{claimedNotice}</span>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => {
            setSelectedCity('');
            setSelectedVehicle('');
          }}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
            !selectedCity && !selectedVehicle
              ? 'bg-[#1C1C1C] text-white shadow-xs'
              : 'bg-white border border-[#EBE5D8] text-[#6B6B6B]'
          }`}
        >
          All Tours ({agencyTripPosts.length})
        </button>

        <button
          onClick={() => setSelectedCity(selectedCity === 'Agra' ? '' : 'Agra')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
            selectedCity === 'Agra'
              ? 'bg-[#F15A24] text-white shadow-xs'
              : 'bg-white border border-[#EBE5D8] text-[#6B6B6B]'
          }`}
        >
          Agra ↔ Jaipur
        </button>

        <button
          onClick={() => setSelectedCity(selectedCity === 'Manali' ? '' : 'Manali')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
            selectedCity === 'Manali'
              ? 'bg-[#F15A24] text-white shadow-xs'
              : 'bg-white border border-[#EBE5D8] text-[#6B6B6B]'
          }`}
        >
          Delhi ↔ Manali
        </button>

        <button
          onClick={() => setSelectedVehicle(selectedVehicle === 'Sedan' ? '' : 'Sedan')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
            selectedVehicle === 'Sedan'
              ? 'bg-[#1C1C1C] text-white shadow-xs'
              : 'bg-white border border-[#EBE5D8] text-[#6B6B6B]'
          }`}
        >
          Sedans Only
        </button>

        <button
          onClick={() => setSelectedVehicle(selectedVehicle === 'SUV' ? '' : 'SUV')}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all ${
            selectedVehicle === 'SUV'
              ? 'bg-[#1C1C1C] text-white shadow-xs'
              : 'bg-white border border-[#EBE5D8] text-[#6B6B6B]'
          }`}
        >
          SUV / Ertiga
        </button>
      </div>

      {/* Tour Leads List */}
      <div className="space-y-3">
        {activePosts.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8] shadow-card">
            <Building className="w-10 h-10 text-[#C4BCAB] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#1C1C1C]">No tour leads found matching filters</p>
            <p className="text-[11px] text-[#6B6B6B] mt-1">
              Clear your filters or check back in a few moments as agencies post new trips.
            </p>
          </div>
        ) : (
          activePosts.map((post) => {
            const isClaimed = post.status === 'claimed';

            return (
              <div
                key={post.id}
                className={`p-4 sm:p-5 rounded-3xl bg-white border transition-all shadow-card space-y-3.5 ${
                  isClaimed ? 'opacity-75 border-zinc-200 bg-zinc-50/50' : 'border-[#EBE5D8] hover:border-[#F15A24]/50'
                }`}
              >
                {/* Agency Header & Rating */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F15A24] flex items-center justify-center font-black text-xs">
                      {post.agencyName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-xs font-extrabold text-[#1C1C1C] leading-tight">
                          {post.agencyName}
                        </h2>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      </div>
                      <p className="text-[10px] text-[#6B6B6B]">
                        {post.agencyCity} • ★ {post.agencyRating || 4.9} Verified Agency Partner
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      post.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {post.status === 'active' ? '● Open for Booking' : '✓ Already Claimed'}
                  </span>
                </div>

                {/* Tour Route & Duration Banner */}
                <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-black text-[#1C1C1C]">
                      <MapPin className="w-4 h-4 text-[#F15A24]" />
                      <span>{post.fromCity}</span>
                      <span className="text-[#F15A24] font-bold">{post.tripSide === 'two_side' ? '⇄' : '→'}</span>
                      <span>{post.toCity}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-white bg-[#1C1C1C] px-2 py-0.5 rounded-md">
                        {post.duration}
                      </span>
                    </div>
                  </div>

                  {/* Highlights pills */}
                  {post.routeHighlights && post.routeHighlights.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-[#EBE5D8]/60 text-[10px] text-[#6B6B6B]">
                      <span className="font-bold text-[#1C1C1C]">Sightseeing:</span>
                      {post.routeHighlights.map((hl, idx) => (
                        <span
                          key={idx}
                          className="bg-white px-2 py-0.5 rounded-md border border-[#EBE5D8] font-medium"
                        >
                          {hl}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Trip Specs (Pax, Vehicle, Date) */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <span className="text-[9px] text-[#6B6B6B] block">Group Size</span>
                    <strong className="text-[11px] font-extrabold text-[#1C1C1C] flex items-center justify-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-[#F15A24]" />
                      {post.passengers} Members
                    </strong>
                  </div>

                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <span className="text-[9px] text-[#6B6B6B] block">Vehicle Required</span>
                    <strong className="text-[11px] font-extrabold text-[#1C1C1C] flex items-center justify-center gap-1 mt-0.5 truncate">
                      <Car className="w-3 h-3 text-[#F15A24]" />
                      {post.requiredVehicleType.split(' ')[0]}
                    </strong>
                  </div>

                  <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100">
                    <span className="text-[9px] text-[#6B6B6B] block">Start Date</span>
                    <strong className="text-[11px] font-extrabold text-[#1C1C1C] flex items-center justify-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-[#6B6B6B]" />
                      {post.startDate}
                    </strong>
                  </div>
                </div>

                {/* Pricing & Earnings Highlight (Total Price - Commission = Driver Net) */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-emerald-50/50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-800 block">
                      Client Total: ₹{post.totalCustomerPrice} • Comm: ₹{post.agencyCommission}
                    </span>
                    <span className="text-xs font-bold text-[#1C1C1C]">
                      Your Net Driver Earning:
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#00A86B]">
                      ₹{post.driverNetPayout.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Itinerary & Full Details Expandable Section */}
                <div
                  onClick={() =>
                    setExpandedPostId(expandedPostId === post.id ? null : post.id)
                  }
                  className="p-3 rounded-2xl bg-zinc-50/80 border border-zinc-100 hover:border-[#F15A24]/30 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#1C1C1C]">
                    <span className="flex items-center gap-1.5 text-[#F15A24]">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Tour Itinerary & Details</span>
                    </span>
                    <span className="text-[10px] text-[#F15A24] font-extrabold flex items-center gap-1">
                      {expandedPostId === post.id ? (
                        <>
                          <span>Hide Details</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>View Full Itinerary</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </span>
                  </div>

                  <p
                    className={`text-[11px] text-[#555555] leading-relaxed whitespace-pre-line ${
                      expandedPostId === post.id ? '' : 'line-clamp-2'
                    }`}
                  >
                    {post.tripDetails}
                  </p>

                  {/* Extended Points when Expanded */}
                  {expandedPostId === post.id && (
                    <div className="pt-2.5 mt-2 border-t border-zinc-200/60 space-y-2.5 text-[11px] animate-fade-in">
                      {post.tourType && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FFF0EB] text-[#F15A24] font-bold text-[10px] border border-[#FFD8CB]">
                          <span>🏷️ {post.tourType}</span>
                        </div>
                      )}

                      {post.pickupLocation && (
                        <div className="flex items-start gap-1.5 text-[#6B6B6B]">
                          <MapPin className="w-3.5 h-3.5 text-[#F15A24] flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Pickup Point:</strong> {post.pickupLocation}
                          </span>
                        </div>
                      )}

                      {post.dropLocation && (
                        <div className="flex items-start gap-1.5 text-[#6B6B6B]">
                          <MapPin className="w-3.5 h-3.5 text-[#00A86B] flex-shrink-0 mt-0.5" />
                          <span>
                            <strong>Drop Point:</strong> {post.dropLocation}
                          </span>
                        </div>
                      )}

                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-[10px]">
                        {post.tollTaxOption && (
                          <div className="p-2 rounded-xl bg-white border border-[#EBE5D8]">
                            <span className="text-[#6B6B6B] block">Tolls & Taxes</span>
                            <strong className="text-[#1C1C1C]">{post.tollTaxOption}</strong>
                          </div>
                        )}

                        {post.kmLimit && (
                          <div className="p-2 rounded-xl bg-white border border-[#EBE5D8]">
                            <span className="text-[#6B6B6B] block">Km Package</span>
                            <strong className="text-[#1C1C1C]">{post.kmLimit}</strong>
                          </div>
                        )}

                        {post.driverNightAllowance && (
                          <div className="p-2 rounded-xl bg-white border border-[#EBE5D8]">
                            <span className="text-[#6B6B6B] block">Night Stay Allowance</span>
                            <strong className="text-[#00A86B]">{post.driverNightAllowance}</strong>
                          </div>
                        )}

                        {post.luggageCapacity && (
                          <div className="p-2 rounded-xl bg-white border border-[#EBE5D8]">
                            <span className="text-[#6B6B6B] block">Luggage</span>
                            <strong className="text-[#1C1C1C]">{post.luggageCapacity}</strong>
                          </div>
                        )}
                      </div>

                      {post.driverPreferences && (
                        <div className="p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900 text-[10px]">
                          <strong>Driver Rules:</strong> {post.driverPreferences}
                        </div>
                      )}

                      {post.paymentTerms && (
                        <div className="p-2 rounded-xl bg-emerald-50/60 border border-emerald-200/60 text-emerald-900 text-[10px]">
                          <strong>Payment Terms:</strong> {post.paymentTerms}
                        </div>
                      )}

                      {post.routeHighlights && post.routeHighlights.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[10px] font-bold text-[#1C1C1C] block mb-1">
                            Tour Stops & Sightseeing:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {post.routeHighlights.map((hl, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-white border border-[#EBE5D8] rounded-md text-[10px] font-semibold text-[#1C1C1C]"
                              >
                                {hl}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Call To Actions */}
                <div className="pt-2 border-t border-[#FAF6EE] flex items-center gap-2">
                  <button
                    onClick={() => handleWhatsAppContact(post)}
                    className="flex-1 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-extrabold shadow-sm flex items-center justify-center gap-1.5 transition-all active-press"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Agency</span>
                  </button>

                  <a
                    href={`tel:${post.agencyPhone}`}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-[#EBE5D8] hover:border-[#F15A24] text-[#1C1C1C] text-xs font-bold flex items-center justify-center gap-1.5 transition-all active-press"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F15A24]" />
                    <span>Call</span>
                  </a>

                  {post.status === 'active' && (
                    <button
                      onClick={() => handleClaim(post)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#1C1C1C] hover:bg-[#333333] text-white text-xs font-bold flex items-center justify-center gap-1 transition-all active-press"
                      title="Mark as Claimed"
                    >
                      <span>Claim</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
