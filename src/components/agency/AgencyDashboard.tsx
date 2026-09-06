import React, { useState } from 'react';
import {
  Building,
  PlusCircle,
  ShieldCheck,
  PackageCheck,
  MapPin,
  Calendar,
  Clock,
  Users,
  Car,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Tag,
  Trash2,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { AgencyTripPost } from '../../types';
import { PostAgencyTripModal } from './PostAgencyTripModal';

interface AgencyDashboardProps {
  onOpenVerification: () => void;
  onOpenPackages: () => void;
  onSwitchRole?: (role: any) => void;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({
  onOpenVerification,
  onOpenPackages,
  onSwitchRole,
}) => {
  const {
    currentAgency,
    agencyTripPosts,
    getAgencyActiveSubscription,
    isAgencyVerified,
    canAgencyPost,
    updateAgencyTripStatus,
    updateAgencyTripPosts,
  } = useAppStore();

  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'claimed'>('all');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const isVerified = isAgencyVerified(currentAgency.id);
  const activeSubInfo = getAgencyActiveSubscription(currentAgency.id);
  const gate = canAgencyPost(currentAgency.id);

  // Agency's own posts
  const myPosts = agencyTripPosts.filter((p) => p.agencyId === currentAgency.id || p.agencyId === 'agency-current');

  const filteredPosts = myPosts.filter((post) => {
    if (filterTab === 'active') return post.status === 'active';
    if (filterTab === 'claimed') return post.status === 'claimed' || post.status === 'completed';
    return true;
  });

  const handleDeletePost = (id: string) => {
    if (confirm('Delete this tour lead post?')) {
      updateAgencyTripPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'claimed' : 'active';
    updateAgencyTripStatus(id, nextStatus as any);
  };

  return (
    <div className="space-y-4 pb-32 animate-fade-in">
      {/* 1. AGENCY PROFILE & STATUS BANNER */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1C1C1C] via-[#2A2A2A] to-[#1C1C1C] text-white shadow-card relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F15A24]/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#F15A24] to-[#FF7A45] flex items-center justify-center text-white shadow-md font-black text-lg">
              {currentAgency.agencyName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-extrabold text-white">
                  {currentAgency.agencyName}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-extrabold">
                    <AlertCircle className="w-3 h-3" />
                    <span>KYC Pending</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/70 mt-0.5">
                Owner: {currentAgency.ownerName} • {currentAgency.city}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-white/50 block">Rating</span>
            <span className="text-xs font-black text-[#FFD700] flex items-center gap-1 justify-end">
              ★ {currentAgency.rating || 4.9}
            </span>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[9px] font-bold text-white/50 uppercase block">Posted Tours</span>
            <span className="text-xs font-extrabold text-white">{myPosts.length}</span>
          </div>

          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[9px] font-bold text-white/50 uppercase block">Active Leads</span>
            <span className="text-xs font-extrabold text-[#00A86B]">
              {myPosts.filter((p) => p.status === 'active').length}
            </span>
          </div>

          <div className="p-2 rounded-xl bg-white/5">
            <span className="text-[9px] font-bold text-white/50 uppercase block">Plan Status</span>
            <span className="text-xs font-extrabold text-[#FF7A45]">
              {activeSubInfo ? activeSubInfo.pkg.name.split(' ')[0] : 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. GATE ALERTS IF NOT READY TO POST */}
      {!gate.canPost && (
        <div className="p-4 rounded-2xl bg-[#FFF5F0] border border-[#FFD8CB] space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#F15A24] flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <strong className="text-[#8A2B09] block">
                {gate.code === 'not_verified' ? 'Verification Required' : 'Package Required'}
              </strong>
              <p className="text-[#A33B12] text-[11px] mt-0.5 leading-relaxed">
                {gate.reason}
              </p>
            </div>
          </div>
          <div className="pt-1">
            {gate.code === 'not_verified' ? (
              <button
                onClick={onOpenVerification}
                className="w-full py-2 rounded-xl bg-[#F15A24] text-white text-xs font-bold shadow-xs active-press"
              >
                Upload Documents Now
              </button>
            ) : (
              <button
                onClick={onOpenPackages}
                className="w-full py-2 rounded-xl bg-[#F15A24] text-white text-xs font-bold shadow-xs active-press"
              >
                Get Agency Package
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. PRIMARY ACTION: POST TOUR BOOKING LEAD */}
      <button
        onClick={() => setIsPostModalOpen(true)}
        className="w-full p-4 rounded-3xl bg-gradient-to-r from-[#F15A24] to-[#FF7A45] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-between group active-press"
      >
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider">
              Post Tour Booking Lead
            </h2>
            <p className="text-[11px] text-white/90">
              e.g. Agra to Jaipur • 4 Pax • ₹1,000 Total
            </p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>

      {/* 4. QUICK PORTAL ACTIONS */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenVerification}
          className="p-3.5 rounded-2xl bg-white border border-[#EBE5D8] shadow-card hover:border-[#F15A24] text-left transition-all active-press"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {isVerified ? 'Verified' : 'Review'}
            </span>
          </div>
          <h3 className="text-xs font-extrabold text-[#1C1C1C]">KYC Documents</h3>
          <p className="text-[10px] text-[#6B6B6B] mt-0.5">GST & Trade License</p>
        </button>

        <button
          onClick={onOpenPackages}
          className="p-3.5 rounded-2xl bg-white border border-[#EBE5D8] shadow-card hover:border-[#F15A24] text-left transition-all active-press"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F15A24] flex items-center justify-center">
              <PackageCheck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-[#F15A24] bg-orange-50 px-2 py-0.5 rounded-full">
              {activeSubInfo ? 'Active' : 'Get Plan'}
            </span>
          </div>
          <h3 className="text-xs font-extrabold text-[#1C1C1C]">Posting Plans</h3>
          <p className="text-[10px] text-[#6B6B6B] mt-0.5">Subscriptions & Limits</p>
        </button>
      </div>

      {/* 5. MY POSTED TOUR LEADS SECTION */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold text-[#1C1C1C]">
            My Tour Booking Posts ({myPosts.length})
          </h3>

          <div className="flex items-center gap-1 bg-[#FAF6EE] p-1 rounded-xl border border-[#EBE5D8]">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                filterTab === 'all' ? 'bg-white text-[#1C1C1C] shadow-xs' : 'text-[#6B6B6B]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterTab('active')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                filterTab === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-[#6B6B6B]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterTab('claimed')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                filterTab === 'claimed' ? 'bg-[#1C1C1C] text-white shadow-xs' : 'text-[#6B6B6B]'
              }`}
            >
              Claimed
            </button>
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white border border-[#EBE5D8] shadow-card">
            <Car className="w-10 h-10 text-[#C4BCAB] mx-auto mb-2" />
            <p className="text-xs font-bold text-[#1C1C1C]">No tour leads in this category</p>
            <p className="text-[11px] text-[#6B6B6B] mt-1">
              Click &quot;Post Tour Booking Lead&quot; to broadcast pre-booked client trips to drivers.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded-3xl bg-white border border-[#EBE5D8] shadow-card hover:border-[#F15A24]/50 transition-all space-y-3"
              >
                {/* Top Route & Status */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#1C1C1C]">
                      <span>{post.fromCity}</span>
                      <span className="text-[#F15A24]">{post.tripSide === 'two_side' ? '⇄' : '→'}</span>
                      <span>{post.toCity}</span>
                    </div>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5 flex items-center gap-2">
                      <span>{post.passengers} Pax</span>
                      <span>•</span>
                      <span>{post.duration}</span>
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      post.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}
                  >
                    {post.status === 'active' ? '● Active Lead' : '✓ Claimed by Driver'}
                  </span>
                </div>

                {/* Financials & Payout Card */}
                <div className="p-3 rounded-2xl bg-[#FAF6EE] border border-[#EBE5D8] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#6B6B6B] block">Total Client Price</span>
                    <strong className="text-xs text-[#1C1C1C]">₹{post.totalCustomerPrice}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B6B6B] block">Agency Comm</span>
                    <strong className="text-xs text-[#F15A24]">₹{post.agencyCommission}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#00A86B] font-bold block">Driver Net Payout</span>
                    <strong className="text-sm font-black text-[#00A86B]">
                      ₹{post.driverNetPayout}
                    </strong>
                  </div>
                </div>

                {/* Vehicle & Date Info */}
                <div className="text-[11px] text-[#6B6B6B] flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-[#F15A24]" />
                    {post.requiredVehicleType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#6B6B6B]" />
                    {post.startDate}
                  </span>
                </div>

                {/* Itinerary & Full Details Expandable Section */}
                <div className="space-y-2">
                  <div
                    onClick={() =>
                      setExpandedPostId(expandedPostId === post.id ? null : post.id)
                    }
                    className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-[#F15A24]/30 cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#1C1C1C]">
                      <span className="flex items-center gap-1.5 text-[#F15A24]">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Trip Itinerary & Details</span>
                      </span>
                      <span className="text-[10px] text-[#F15A24] font-extrabold flex items-center gap-1">
                        {expandedPostId === post.id ? (
                          <>
                            <span>Hide Details</span>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            <span>View Full Details</span>
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

                    {/* Extended Details when Expanded */}
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
                              <span className="text-[#6B6B6B] block">Night Allowance</span>
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
                              Sightseeing Highlights:
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
                </div>

                {/* Claimed Driver Details if applicable */}
                {post.claimedByDriverName && (
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                    <span>
                      Claimed by Driver: <strong>{post.claimedByDriverName}</strong>
                    </span>
                    <a
                      href={`tel:${post.claimedByDriverPhone}`}
                      className="px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      Call
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-[#FAF6EE] flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(post.id, post.status)}
                    className="text-[11px] font-bold text-[#F15A24] hover:underline"
                  >
                    {post.status === 'active' ? 'Mark as Claimed' : 'Reactivate Lead'}
                  </button>

                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Trip Modal */}
      <PostAgencyTripModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onOpenVerification={onOpenVerification}
        onOpenPackages={onOpenPackages}
      />
    </div>
  );
};
