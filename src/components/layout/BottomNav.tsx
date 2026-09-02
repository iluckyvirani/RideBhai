import React from 'react';
import { UserRole } from '../../types';
import { Ticket, User, Car, Sparkles, Package } from 'lucide-react';

interface BottomNavProps {
  role: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ role, activeTab, onTabChange }) => {
  const isPartner = role === 'partner' || role === 'driver' || role === 'agency';
  const tabs = isPartner
    ? [
        { id: 'cars', label: 'Cars', icon: Car },
        { id: 'tours', label: 'Tours', icon: Sparkles },
        { id: 'packages', label: 'Plans', icon: Package },
        { id: 'profile', label: 'Profile', icon: User },
      ]
    : [
        { id: 'bookings', label: 'Bookings', icon: Ticket },
        { id: 'cars', label: 'Cars', icon: Car },
        { id: 'tours', label: 'Tours', icon: Sparkles },
        { id: 'profile', label: 'Profile', icon: User },
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#EBE5D8] px-2 py-1 shadow-nav max-w-[430px] mx-auto">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl transition-all relative ${
                isActive ? 'text-[#F15A24]' : 'text-[#6B6B6B] hover:text-[#1C1C1C]'
              } active-press`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[1.75]'}`} />
              <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-[#F15A24] mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
