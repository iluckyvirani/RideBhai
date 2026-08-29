import React from 'react';
import { UserRole } from '../../types';
import {
  Compass,
  Ticket,
  MessageSquare,
  User,
  Car,
  PlusCircle,
  Users,
  Sparkles,
  ShieldCheck,
  Package,
  Layers,
  AlertCircle,
  LayoutDashboard,
  Building,
  Briefcase,
  MapPin
} from 'lucide-react';

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadChatCount?: number;
  pendingRequestsCount?: number;
  openAgencyLeadsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  role,
  activeTab,
  onTabChange,
  unreadChatCount = 0,
  pendingRequestsCount = 0,
  openAgencyLeadsCount = 0,
}) => {
  const getTabs = () => {
    if (role === 'rider') {
      return [
        { id: 'search', label: 'Explore', icon: Compass },
        { id: 'bookings', label: 'Bookings', icon: Ticket },
        { id: 'chat', label: 'Chat', icon: MessageSquare, badge: unreadChatCount },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    }

    if (role === 'driver') {
      return [
        { id: 'my-rides', label: 'My Rides', icon: Car },
        { id: 'agency-tours', label: 'Tour Leads', icon: Sparkles, badge: openAgencyLeadsCount },
        { id: 'post-ride', label: 'Post Ride', icon: PlusCircle, highlight: true },
        { id: 'requests', label: 'Requests', icon: Users, badge: pendingRequestsCount },
        { id: 'profile', label: 'Profile', icon: User },
      ];
    }

    if (role === 'agency') {
      return [
        { id: 'agency-home', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'post-lead', label: 'Post Lead', icon: PlusCircle, highlight: true },
        { id: 'agency-packages', label: 'Plans', icon: Sparkles },
        { id: 'agency-kyc', label: 'KYC Verify', icon: ShieldCheck },
        { id: 'agency-profile', label: 'Profile', icon: Building },
      ];
    }

    // Admin
    return [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'verifications', label: 'Verify', icon: ShieldCheck },
      { id: 'packages', label: 'Plans', icon: Package },
      { id: 'boosts', label: 'Boosts', icon: Layers },
      { id: 'disputes', label: 'Disputes', icon: AlertCircle },
    ];
  };

  const tabs = getTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EBE5D8] px-2 py-1 shadow-nav max-w-[430px] mx-auto">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center -mt-5 group active-press"
              >
                <div className="w-12 h-12 rounded-full brand-gradient flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                  <PlusCircle className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold text-[#F15A24] mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-[#F15A24]' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
              } active-press`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-[#E8380D] text-white text-[8px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>

              {/* Active Dot Indicator */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#F15A24] mt-0.5 animate-scale-in"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
